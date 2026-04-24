const express = require('express');
const { blockchain } = require('../blockchain');
const { dbHelpers } = require('../database/db');

const router = express.Router();

// Create a new batch
router.post('/batch/create', async (req, res) => {
    try {
        const { crop, weight, location, basePrice } = req.body;

        if (!crop || !weight || !location || basePrice === undefined) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Create batch on blockchain
        const { receipt, batchId } = await blockchain.createBatch(crop, weight, location, basePrice);

        if (!batchId) {
            throw new Error('Failed to get batch ID from transaction');
        }

        // Get full batch details from blockchain
        const batchDetails = await blockchain.getBatchDetails(batchId);

        // Save to database
        await dbHelpers.upsertBatch({
            id: batchDetails.id,
            farmer_address: batchDetails.farmer,
            crop: batchDetails.crop,
            weight: batchDetails.weight,
            location: batchDetails.location,
            status: batchDetails.status,
            total_price: batchDetails.totalPrice,
            created_at: Date.now(),
            updated_at: Date.now()
        });

        // Save price component
        for (const component of batchDetails.priceBreakdown) {
            await dbHelpers.insertPriceComponent({
                batch_id: batchDetails.id,
                stakeholder_address: component.stakeholder,
                role: component.role,
                amount: component.amount,
                description: component.description,
                timestamp: component.timestamp
            });
        }

        res.json({
            success: true,
            batchId: batchDetails.id,
            transactionHash: receipt.hash,
            batch: batchDetails
        });
    } catch (error) {
        console.error('Error creating batch:', error);
        res.status(500).json({ error: error.message });
    }
});

// Update batch (generic endpoint for all stakeholder updates)
router.post('/batch/update', async (req, res) => {
    try {
        const { batchId, role, fee, description } = req.body;

        if (!batchId || !role || fee === undefined) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        let receipt;

        // Call appropriate contract function based on role
        switch (role.toUpperCase()) {
            case 'PROCESSOR':
                receipt = await blockchain.addProcessing(batchId, fee, description || 'Processing Fee');
                break;
            case 'LOGISTICS':
                receipt = await blockchain.updateLogistics(batchId, fee, description || 'Transport Fee');
                break;
            case 'RETAILER':
                receipt = await blockchain.retailerReceive(batchId, fee, description || 'Retail Markup');
                break;
            default:
                return res.status(400).json({ error: 'Invalid role' });
        }

        // Get updated batch details
        const batchDetails = await blockchain.getBatchDetails(batchId);

        // Update database
        await dbHelpers.upsertBatch({
            id: batchDetails.id,
            farmer_address: batchDetails.farmer,
            crop: batchDetails.crop,
            weight: batchDetails.weight,
            location: batchDetails.location,
            status: batchDetails.status,
            total_price: batchDetails.totalPrice,
            created_at: Date.now(),
            updated_at: Date.now()
        });

        // Save new price component
        const latestComponent = batchDetails.priceBreakdown[batchDetails.priceBreakdown.length - 1];
        await dbHelpers.insertPriceComponent({
            batch_id: batchDetails.id,
            stakeholder_address: latestComponent.stakeholder,
            role: latestComponent.role,
            amount: latestComponent.amount,
            description: latestComponent.description,
            timestamp: latestComponent.timestamp
        });

        res.json({
            success: true,
            transactionHash: receipt.hash,
            batch: batchDetails
        });
    } catch (error) {
        console.error('Error updating batch:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get batch by ID
router.get('/batch/:id', async (req, res) => {
    try {
        const batchId = parseInt(req.params.id);

        // Try database first (faster)
        const dbBatch = await dbHelpers.getBatch(batchId);

        if (dbBatch) {
            const priceBreakdown = await dbHelpers.getPriceBreakdown(batchId);
            res.json({
                ...dbBatch,
                priceBreakdown
            });
        } else {
            // Fallback to blockchain
            const batchDetails = await blockchain.getBatchDetails(batchId);
            res.json(batchDetails);
        }
    } catch (error) {
        console.error('Error fetching batch:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get all batches
router.get('/batches', async (req, res) => {
    try {
        const batches = await dbHelpers.getAllBatches();

        // Enrich with price breakdown for each
        const enrichedBatches = await Promise.all(
            batches.map(async (batch) => {
                const priceBreakdown = await dbHelpers.getPriceBreakdown(batch.id);
                return { ...batch, priceBreakdown };
            })
        );

        res.json(enrichedBatches);
    } catch (error) {
        console.error('Error fetching batches:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get batch count
router.get('/stats/count', async (req, res) => {
    try {
        const count = await blockchain.getBatchCount();
        res.json({ batchCount: count });
    } catch (error) {
        console.error('Error fetching batch count:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
