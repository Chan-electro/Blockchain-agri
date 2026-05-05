const {
    provider,
    getContractForRole,
    getReadContract,
    assertChainReady,
} = require('./lib/wallets');

const STATUS_BY_INDEX = ['CREATED', 'PROCESSED', 'IN_TRANSIT', 'RETAIL', 'SOLD'];

function toStatusName(value) {
    const idx = typeof value === 'bigint' ? Number(value) : value;
    return STATUS_BY_INDEX[idx] ?? String(value);
}

async function createBatch({ role, crop, weight, location, basePrice }) {
    const contract = getContractForRole(role);
    const tx = await contract.createBatch(crop, weight, location, basePrice);
    const receipt = await tx.wait();

    const event = receipt.logs
        .map((log) => {
            try { return contract.interface.parseLog(log); } catch { return null; }
        })
        .find((parsed) => parsed && parsed.name === 'BatchCreated');

    const batchId = event ? Number(event.args[0]) : null;
    return {
        txHash: receipt.hash,
        blockNumber: receipt.blockNumber,
        batchId,
    };
}

async function addProcessing({ batchId, fee, description }) {
    const contract = getContractForRole('PROCESSOR');
    const tx = await contract.addProcessingDetails(batchId, fee, description || 'Processing Fee');
    const receipt = await tx.wait();
    return { txHash: receipt.hash, blockNumber: receipt.blockNumber };
}

async function updateLogistics({ batchId, fee, description }) {
    const contract = getContractForRole('LOGISTICS');
    const tx = await contract.updateLogistics(batchId, fee, description || 'Transport Fee');
    const receipt = await tx.wait();
    return { txHash: receipt.hash, blockNumber: receipt.blockNumber };
}

async function retailerReceive({ batchId, markup, description }) {
    const contract = getContractForRole('RETAILER');
    const tx = await contract.retailerReceive(batchId, markup, description || 'Retail Markup');
    const receipt = await tx.wait();
    return { txHash: receipt.hash, blockNumber: receipt.blockNumber };
}

async function getBatchDetails(batchId) {
    const contract = getReadContract();
    const details = await contract.getBatchDetails(batchId);
    return {
        id: Number(details[0]),
        farmer: details[1],
        crop: details[2],
        weight: details[3],
        location: details[4],
        createdAt: Number(details[5]),
        status: toStatusName(details[6]),
        totalPrice: Number(details[7]),
        priceBreakdown: details[8].map((c) => ({
            stakeholder: c.stakeholder,
            role: c.role,
            amount: Number(c.amount),
            description: c.description,
            timestamp: Number(c.timestamp),
        })),
    };
}

async function getBatchCount() {
    const contract = getReadContract();
    return Number(await contract.batchCount());
}

module.exports = {
    provider,
    assertChainReady,
    createBatch,
    addProcessing,
    updateLogistics,
    retailerReceive,
    getBatchDetails,
    getBatchCount,
    toStatusName,
};
