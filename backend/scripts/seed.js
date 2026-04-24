// Seeds the database with demo users and drives 5 demo batches to different
// stages of the supply chain. Idempotent-ish: resets the DB first, then re-runs.
//
//   node scripts/seed.js
//
// Requires: Hardhat node running + `npm run deploy` completed.

const bcrypt = require('bcryptjs');
const config = require('../lib/config');
const blockchain = require('../blockchain');
const { dbHelpers } = require('../database/db');
const { ROLE_TO_WALLET_INDEX, assertChainReady } = require('../lib/wallets');
const logger = require('../lib/logger');

const DEMO_PASSWORD = 'demo12345';

const DEMO_USERS = [
    { email: 'admin@demo.agri', role: 'ADMIN' },
    { email: 'farmer@demo.agri', role: 'FARMER' },
    { email: 'processor@demo.agri', role: 'PROCESSOR' },
    { email: 'logistics@demo.agri', role: 'LOGISTICS' },
    { email: 'retailer@demo.agri', role: 'RETAILER' },
    { email: 'consumer@demo.agri', role: 'CONSUMER' },
];

const DEMO_BATCHES = [
    { crop: 'Basmati Rice', weight: '500kg', location: 'Punjab, IN', basePrice: 100, target: 'RETAIL' },
    { crop: 'Wheat',        weight: '800kg', location: 'Haryana, IN', basePrice: 120, target: 'RETAIL' },
    { crop: 'Tomatoes',     weight: '200kg', location: 'Karnataka, IN', basePrice: 60,  target: 'IN_TRANSIT' },
    { crop: 'Mangoes',      weight: '150kg', location: 'Andhra, IN',    basePrice: 180, target: 'PROCESSED' },
    { crop: 'Cardamom',     weight: '40kg',  location: 'Kerala, IN',    basePrice: 400, target: 'CREATED' },
];

async function seedUsers() {
    for (const { email, role } of DEMO_USERS) {
        const existing = await dbHelpers.getUserByEmail(email);
        if (existing) continue;
        const password_hash = await bcrypt.hash(DEMO_PASSWORD, config.bcryptRounds);
        await dbHelpers.createUser({
            email,
            password_hash,
            role,
            wallet_index: ROLE_TO_WALLET_INDEX[role] ?? null,
            created_at: Date.now(),
        });
        logger.info({ email, role }, 'Seeded user');
    }
}

async function syncBatchToDb(batchDetails, txHash, blockNumber) {
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
        tx_hash: txHash,
        block_number: blockNumber,
    });
}

async function driveBatch(spec, index) {
    const { txHash: createHash, blockNumber: createBlock, batchId } = await blockchain.createBatch({
        role: 'FARMER',
        crop: spec.crop,
        weight: spec.weight,
        location: spec.location,
        basePrice: spec.basePrice,
    });
    let details = await blockchain.getBatchDetails(batchId);
    // Seed the creation row
    await dbHelpers.upsertBatch({
        id: details.id,
        farmer_address: details.farmer,
        crop: details.crop,
        weight: details.weight,
        location: details.location,
        status: details.status,
        total_price: details.totalPrice,
        tx_hash: createHash,
        block_number: createBlock,
        created_at: details.createdAt * 1000,
        updated_at: Date.now(),
    });
    await dbHelpers.insertPriceComponent({
        batch_id: details.id,
        stakeholder_address: details.priceBreakdown[0].stakeholder,
        role: details.priceBreakdown[0].role,
        amount: details.priceBreakdown[0].amount,
        description: details.priceBreakdown[0].description,
        timestamp: details.priceBreakdown[0].timestamp * 1000,
        tx_hash: createHash,
        block_number: createBlock,
    });
    logger.info({ batchId, crop: spec.crop, target: spec.target }, 'Seeded batch CREATED');

    if (spec.target === 'CREATED') return;

    const processingFee = Math.round(spec.basePrice * 0.2);
    let r = await blockchain.addProcessing({ batchId, fee: processingFee, description: 'Cleaning & grading' });
    details = await blockchain.getBatchDetails(batchId);
    await syncBatchToDb(details, r.txHash, r.blockNumber);
    if (spec.target === 'PROCESSED') return;

    const transportFee = Math.round(spec.basePrice * 0.1);
    r = await blockchain.updateLogistics({ batchId, fee: transportFee, description: 'Refrigerated truck' });
    details = await blockchain.getBatchDetails(batchId);
    await syncBatchToDb(details, r.txHash, r.blockNumber);
    if (spec.target === 'IN_TRANSIT') return;

    const markup = Math.round(spec.basePrice * 0.5);
    r = await blockchain.retailerReceive({ batchId, markup, description: 'Retail markup' });
    details = await blockchain.getBatchDetails(batchId);
    await syncBatchToDb(details, r.txHash, r.blockNumber);
}

async function main() {
    await assertChainReady();
    await dbHelpers.resetAll();
    logger.info('Database reset');

    await seedUsers();

    for (let i = 0; i < DEMO_BATCHES.length; i++) {
        await driveBatch(DEMO_BATCHES[i], i);
    }

    logger.info(`\n\nDemo credentials (password: ${DEMO_PASSWORD}):`);
    for (const u of DEMO_USERS) logger.info(`  - ${u.role.padEnd(10)} ${u.email}`);
    process.exit(0);
}

main().catch((err) => {
    logger.fatal({ err: err.message }, 'Seed failed');
    process.exit(1);
});
