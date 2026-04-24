const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

// Read contract ABI
const contractArtifactPath = path.join(__dirname, '../smart-contract/artifacts/contracts/AgriChain.sol/AgriChain.json');
const contractArtifact = JSON.parse(fs.readFileSync(contractArtifactPath, 'utf8'));
const contractABI = contractArtifact.abi;

// Blockchain configuration
const BLOCKCHAIN_URL = process.env.BLOCKCHAIN_URL || 'http://127.0.0.1:8545';
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

// Initialize provider and signer
const provider = new ethers.JsonRpcProvider(BLOCKCHAIN_URL);
let signer;
let contract;

async function initializeBlockchain() {
    try {
        if (!CONTRACT_ADDRESS) {
            console.warn('⚠️  CONTRACT_ADDRESS not set. Deploy contract first.');
            return null;
        }

        if (PRIVATE_KEY) {
            signer = new ethers.Wallet(PRIVATE_KEY, provider);
        } else {
            //Use first account from provider for development
            signer = await provider.getSigner(0);
        }

        contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
        console.log('✅ Connected to blockchain at', BLOCKCHAIN_URL);
        console.log('📝 Contract address:', CONTRACT_ADDRESS);

        return contract;
    } catch (error) {
        console.error('❌ Error initializing blockchain:', error.message);
        return null;
    }
}

// Deploy contract function
async function deployContract() {
    try {
        // Get signer from the first account
        const deployerSigner = await provider.getSigner(0);

        const ContractFactory = new ethers.ContractFactory(contractABI, contractArtifact.bytecode, deployerSigner);
        const deployedContract = await ContractFactory.deploy();
        await deployedContract.waitForDeployment();

        const address = await deployedContract.getAddress();
        console.log('✅ Contract deployed to:', address);
        console.log('💡 Update your .env file with: CONTRACT_ADDRESS=' + address);

        return address;
    } catch (error) {
        console.error('❌ Error deploying contract:', error);
        throw error;
    }
}

// Contract interaction functions
const blockchain = {
    // Create batch
    createBatch: async (crop, weight, location, basePrice) => {
        if (!contract) throw new Error('Contract not initialized');
        const tx = await contract.createBatch(crop, weight, location, basePrice);
        const receipt = await tx.wait();

        // Parse event to specifically find BatchCreated
        const event = receipt.logs
            .map(log => {
                try {
                    return contract.interface.parseLog(log);
                } catch (e) {
                    return null;
                }
            })
            .find(parsedLog => parsedLog && parsedLog.name === 'BatchCreated');

        const batchId = event ? Number(event.args[0]) : null;
        return { receipt, batchId };
    },

    // Add processing details
    addProcessing: async (batchId, fee, description) => {
        if (!contract) throw new Error('Contract not initialized');
        const tx = await contract.addProcessingDetails(batchId, fee, description);
        const receipt = await tx.wait();
        return receipt;
    },

    // Update logistics
    updateLogistics: async (batchId, fee, description) => {
        if (!contract) throw new Error('Contract not initialized');
        const tx = await contract.updateLogistics(batchId, fee, description);
        const receipt = await tx.wait();
        return receipt;
    },

    // Retailer receive
    retailerReceive: async (batchId, markup, description) => {
        if (!contract) throw new Error('Contract not initialized');
        const tx = await contract.retailerReceive(batchId, markup, description);
        const receipt = await tx.wait();
        return receipt;
    },

    // Get batch details
    getBatchDetails: async (batchId) => {
        if (!contract) throw new Error('Contract not initialized');
        const details = await contract.getBatchDetails(batchId);
        return {
            id: Number(details[0]),
            farmer: details[1],
            crop: details[2],
            weight: details[3],
            location: details[4],
            status: details[5],
            totalPrice: Number(details[6]),
            priceBreakdown: details[7].map(component => ({
                stakeholder: component.stakeholder,
                role: component.role,
                amount: Number(component.amount),
                description: component.description,
                timestamp: Number(component.timestamp)
            }))
        };
    },

    // Get batch count
    getBatchCount: async () => {
        if (!contract) throw new Error('Contract not initialized');
        const count = await contract.batchCount();
        return Number(count);
    }
};

module.exports = { initializeBlockchain, deployContract, blockchain, provider, contractABI };
