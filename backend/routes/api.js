const express = require('express');
const rateLimit = require('express-rate-limit');
const { z } = require('zod');

const config = require('../lib/config');
const blockchain = require('../blockchain');
const { dbHelpers } = require('../database/db');
const { AppError, successResponse } = require('../lib/errors');
const auth = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');
const validate = require('../middleware/validate');
const logger = require('../lib/logger');
const vectorStore = require('../services/vectorStore');

const router = express.Router();

const writeLimiter = rateLimit({
    windowMs: 60_000,
    limit: 30,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { success: false, error: { code: 'RATE_LIMITED', message: 'Too many write requests, slow down' } },
});

const createBatchSchema = z.object({
    crop: z.string().min(1).max(64),
    weight: z.string().min(1).max(32),
    location: z.string().min(1).max(128),
    basePrice: z.number().int().positive(),
});

const processSchema = z.object({
    batchId: z.number().int().positive(),
    fee: z.number().int().positive(),
    description: z.string().max(256).optional(),
});

// Build the canonical write-response: DB row (snake_case) + priceBreakdown + tx meta.
async function buildWriteResponse(batchId, txHash, blockNumber) {
    const dbRow = await dbHelpers.getBatch(batchId);
    const priceBreakdown = await dbHelpers.getPriceBreakdown(batchId);
    return {
        ...dbRow,
        priceBreakdown,
        txHash,
        blockNumber,
        contractAddress: config.contractAddress,
    };
}

async function syncBatchToDb(batchDetails, txHash, blockNumber, priceTxHash) {
    await dbHelpers.upsertBatch({
        id: batchDetails.id,
        farmer_address: batchDetails.farmer,
        crop: batchDetails.crop,
        weight: batchDetails.weight,
        location: batchDetails.location,
        status: batchDetails.status,
        total_price: batchDetails.totalPrice,
        tx_hash: txHash,
        block_number: blockNumber,
        created_at: batchDetails.createdAt * 1000,
        updated_at: Date.now(),
    });
    const latest = batchDetails.priceBreakdown[batchDetails.priceBreakdown.length - 1];
    await dbHelpers.insertPriceComponent({
        batch_id: batchDetails.id,
        stakeholder_address: latest.stakeholder,
        role: latest.role,
        amount: latest.amount,
        description: latest.description,
        timestamp: latest.timestamp * 1000,
        tx_hash: priceTxHash,
        block_number: blockNumber,
    });
}

// Create batch (FARMER only)
router.post(
    '/batch/create',
    writeLimiter,
    auth,
    requireRole('FARMER'),
    validate(createBatchSchema),
    async (req, res, next) => {
        try {
            const { crop, weight, location, basePrice } = req.body;
            const { txHash, blockNumber, batchId } = await blockchain.createBatch({
                role: 'FARMER', crop, weight, location, basePrice,
            });
            if (!batchId) throw new AppError('CHAIN_ERROR', 'Failed to resolve batch ID from receipt', 502);

            const batchDetails = await blockchain.getBatchDetails(batchId);
            await dbHelpers.upsertBatch({
                id: batchDetails.id,
                farmer_address: batchDetails.farmer,
                crop: batchDetails.crop,
                weight: batchDetails.weight,
                location: batchDetails.location,
                status: batchDetails.status,
                total_price: batchDetails.totalPrice,
                tx_hash: txHash,
                block_number: blockNumber,
                created_at: batchDetails.createdAt * 1000,
                updated_at: Date.now(),
            });
            await dbHelpers.insertPriceComponent({
                batch_id: batchDetails.id,
                stakeholder_address: batchDetails.priceBreakdown[0].stakeholder,
                role: batchDetails.priceBreakdown[0].role,
                amount: batchDetails.priceBreakdown[0].amount,
                description: batchDetails.priceBreakdown[0].description,
                timestamp: batchDetails.priceBreakdown[0].timestamp * 1000,
                tx_hash: txHash,
                block_number: blockNumber,
            });

            logger.info({ batchId, txHash, by: req.user.email }, 'Batch created');
            vectorStore.upsert(batchDetails.id).catch((e) => logger.warn({ e }, 'vectorStore upsert failed'));
            const response = await buildWriteResponse(batchDetails.id, txHash, blockNumber);
            res.status(201).json(successResponse(response));
        } catch (err) {
            next(err);
        }
    }
);

// Process batch (PROCESSOR only)
router.post(
    '/batch/process',
    writeLimiter,
    auth,
    requireRole('PROCESSOR'),
    validate(processSchema),
    async (req, res, next) => {
        try {
            const { batchId, fee, description } = req.body;
            const { txHash, blockNumber } = await blockchain.addProcessing({ batchId, fee, description });
            const batchDetails = await blockchain.getBatchDetails(batchId);
            await syncBatchToDb(batchDetails, txHash, blockNumber, txHash);
            logger.info({ batchId, txHash, by: req.user.email }, 'Batch processed');
            vectorStore.upsert(batchId).catch((e) => logger.warn({ e }, 'vectorStore upsert failed'));
            const response = await buildWriteResponse(batchId, txHash, blockNumber);
            res.json(successResponse(response));
        } catch (err) {
            next(err);
        }
    }
);

// Ship batch (LOGISTICS only)
router.post(
    '/batch/ship',
    writeLimiter,
    auth,
    requireRole('LOGISTICS'),
    validate(processSchema),
    async (req, res, next) => {
        try {
            const { batchId, fee, description } = req.body;
            const { txHash, blockNumber } = await blockchain.updateLogistics({ batchId, fee, description });
            const batchDetails = await blockchain.getBatchDetails(batchId);
            await syncBatchToDb(batchDetails, txHash, blockNumber, txHash);
            logger.info({ batchId, txHash, by: req.user.email }, 'Batch in transit');
            vectorStore.upsert(batchId).catch((e) => logger.warn({ e }, 'vectorStore upsert failed'));
            const response = await buildWriteResponse(batchId, txHash, blockNumber);
            res.json(successResponse(response));
        } catch (err) {
            next(err);
        }
    }
);

// Retailer receive (RETAILER only)
router.post(
    '/batch/receive',
    writeLimiter,
    auth,
    requireRole('RETAILER'),
    validate(processSchema.transform((o) => ({ batchId: o.batchId, markup: o.fee, description: o.description }))),
    async (req, res, next) => {
        try {
            const { batchId, markup, description } = req.body;
            const { txHash, blockNumber } = await blockchain.retailerReceive({ batchId, markup, description });
            const batchDetails = await blockchain.getBatchDetails(batchId);
            await syncBatchToDb(batchDetails, txHash, blockNumber, txHash);
            logger.info({ batchId, txHash, by: req.user.email }, 'Batch at retail');
            vectorStore.upsert(batchId).catch((e) => logger.warn({ e }, 'vectorStore upsert failed'));
            const response = await buildWriteResponse(batchId, txHash, blockNumber);
            res.json(successResponse(response));
        } catch (err) {
            next(err);
        }
    }
);

// Legacy generic update endpoint — kept for backwards compatibility + consumer/admin tooling.
// Dispatches to the specific role-gated route.
const updateSchema = z.object({
    batchId: z.number().int().positive(),
    role: z.enum(['PROCESSOR', 'LOGISTICS', 'RETAILER']),
    fee: z.number().int().positive(),
    description: z.string().max(256).optional(),
});
router.post('/batch/update', writeLimiter, auth, validate(updateSchema), async (req, res, next) => {
    try {
        const { batchId, role, fee, description } = req.body;
        if (req.user.role !== role) {
            throw new AppError('FORBIDDEN', `Your role '${req.user.role}' cannot perform ${role} updates`, 403);
        }
        let result;
        if (role === 'PROCESSOR') result = await blockchain.addProcessing({ batchId, fee, description });
        else if (role === 'LOGISTICS') result = await blockchain.updateLogistics({ batchId, fee, description });
        else result = await blockchain.retailerReceive({ batchId, markup: fee, description });

        const batchDetails = await blockchain.getBatchDetails(batchId);
        await syncBatchToDb(batchDetails, result.txHash, result.blockNumber, result.txHash);
        vectorStore.upsert(batchId).catch((e) => logger.warn({ e }, 'vectorStore upsert failed'));
        const response = await buildWriteResponse(batchId, result.txHash, result.blockNumber);
        res.json(successResponse(response));
    } catch (err) {
        next(err);
    }
});

// Reads — public (no auth) so the consumer scan page works without login
router.get('/batch/:id', async (req, res, next) => {
    try {
        const batchId = parseInt(req.params.id, 10);
        if (!Number.isFinite(batchId) || batchId <= 0) {
            throw new AppError('INVALID_ID', 'Batch ID must be a positive integer', 400);
        }
        const dbBatch = await dbHelpers.getBatch(batchId);
        if (dbBatch) {
            const priceBreakdown = await dbHelpers.getPriceBreakdown(batchId);
            return res.json(successResponse({
                ...dbBatch,
                priceBreakdown,
                contractAddress: config.contractAddress,
            }));
        }
        const chainBatch = await blockchain.getBatchDetails(batchId);
        res.json(successResponse({ ...chainBatch, contractAddress: config.contractAddress }));
    } catch (err) {
        next(err);
    }
});

router.get('/batches', async (req, res, next) => {
    try {
        const { status } = req.query;
        const rows = status
            ? await dbHelpers.getBatchesByStatus(String(status))
            : await dbHelpers.getAllBatches();
        const enriched = await Promise.all(rows.map(async (b) => ({
            ...b,
            priceBreakdown: await dbHelpers.getPriceBreakdown(b.id),
        })));
        res.json(successResponse(enriched, { total: enriched.length }));
    } catch (err) {
        next(err);
    }
});

router.get('/stats/count', async (_req, res, next) => {
    try {
        const count = await blockchain.getBatchCount();
        res.json(successResponse({ batchCount: count, contractAddress: config.contractAddress }));
    } catch (err) {
        next(err);
    }
});

// Admin overview
router.get('/admin/overview', auth, requireRole('ADMIN'), async (_req, res, next) => {
    try {
        const [userCount, byStatus, volume, recent] = await Promise.all([
            dbHelpers.countUsers(),
            dbHelpers.countBatchesByStatus(),
            dbHelpers.volumeByDay(30),
            dbHelpers.recentPriceEvents(20),
        ]);
        res.json(successResponse({
            users: userCount.n,
            batchesByStatus: byStatus,
            volumeByDay: volume,
            recentActivity: recent,
            contractAddress: config.contractAddress,
        }));
    } catch (err) {
        next(err);
    }
});

module.exports = router;
