const { dbHelpers } = require('../database/db');
const { encode } = require('./embedding');
const config = require('../lib/config');
const logger = require('../lib/logger');

const store = [];

function cosineSimilarity(a, b) {
    let dot = 0, normA = 0, normB = 0;
    for (let i = 0; i < a.length; i++) {
        dot += a[i] * b[i];
        normA += a[i] * a[i];
        normB += b[i] * b[i];
    }
    const denom = Math.sqrt(normA) * Math.sqrt(normB);
    return denom === 0 ? 0 : dot / denom;
}

function formatDocument(batch, priceBreakdown) {
    const createdAt = new Date(batch.created_at).toISOString();
    const updatedAt = new Date(batch.updated_at).toISOString();

    const lines = [
        `Batch #${batch.id} | Crop: ${batch.crop} | Weight: ${batch.weight} | Location: ${batch.location}`,
        `Status: ${batch.status} | Total Price: ${batch.total_price} units`,
        `Farmer Wallet: ${batch.farmer_address}`,
        `Created: ${createdAt} | Last Updated: ${updatedAt}`,
        `Blockchain TX (creation): ${batch.tx_hash || 'pending'} | Block: ${batch.block_number || 'pending'}`,
        `Contract Address: ${config.contractAddress}`,
        '',
        'Supply Chain Journey:',
    ];

    if (priceBreakdown.length === 0) {
        lines.push('  (no price events recorded yet)');
    } else {
        priceBreakdown.forEach((pc, i) => {
            lines.push(
                `  [${i + 1}] ${pc.role} | Wallet: ${pc.stakeholder_address} | +${pc.amount} units | "${pc.description || ''}"`
            );
            lines.push(
                `      TX: ${pc.tx_hash || 'pending'} | Block: ${pc.block_number || 'pending'} | Time: ${new Date(pc.timestamp).toISOString()}`
            );
        });
    }

    return lines.join('\n');
}

async function upsert(batchId) {
    const batch = await dbHelpers.getBatch(batchId);
    if (!batch) return;
    const priceBreakdown = await dbHelpers.getPriceBreakdown(batchId);
    const text = formatDocument(batch, priceBreakdown);
    const vector = await encode(text);
    const existing = store.findIndex((e) => e.id === batchId);
    const entry = {
        id: batchId,
        text,
        vector,
        metadata: {
            batchId: batch.id,
            crop: batch.crop,
            status: batch.status,
            farmerAddress: batch.farmer_address,
        },
    };
    if (existing >= 0) {
        store[existing] = entry;
    } else {
        store.push(entry);
    }
}

async function rebuild() {
    store.length = 0;
    const batches = await dbHelpers.getAllBatches();
    if (batches.length === 0) {
        logger.info('Vector store: no batches to index');
        return;
    }
    logger.info({ count: batches.length }, 'Vector store: indexing batches...');
    await Promise.all(batches.map((b) => upsert(b.id)));
    logger.info({ count: store.length }, 'Vector store ready');
}

function search(queryVector, k = 5) {
    if (store.length === 0) return [];
    return store
        .map((entry) => ({ ...entry, score: cosineSimilarity(queryVector, entry.vector) }))
        .sort((a, b) => b.score - a.score)
        .slice(0, k);
}

function size() {
    return store.length;
}

module.exports = { rebuild, upsert, search, size, formatDocument };
