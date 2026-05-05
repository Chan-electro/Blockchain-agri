const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');
const config = require('./config');
const logger = require('./logger');

const ROLE_TO_WALLET_INDEX = {
    FARMER: 1,
    PROCESSOR: 2,
    LOGISTICS: 3,
    RETAILER: 4,
};

const artifactPath = path.join(
    __dirname,
    '../../smart-contract/artifacts/contracts/AgriChain.sol/AgriChain.json'
);
const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
const contractAbi = artifact.abi;

const provider = new ethers.JsonRpcProvider(config.blockchainUrl);

const signerCache = new Map();
const contractCache = new Map();

function getSignerByIndex(walletIndex) {
    if (signerCache.has(walletIndex)) return signerCache.get(walletIndex);
    const hdPath = `m/44'/60'/0'/0/${walletIndex}`;
    const wallet = ethers.HDNodeWallet.fromPhrase(config.mnemonic, undefined, hdPath).connect(provider);
    signerCache.set(walletIndex, wallet);
    return wallet;
}

function getSignerForRole(role) {
    const index = ROLE_TO_WALLET_INDEX[role];
    if (!index) throw new Error(`No signer configured for role: ${role}`);
    return getSignerByIndex(index);
}

function getContractForSigner(signer) {
    if (!config.contractAddress) {
        throw new Error('CONTRACT_ADDRESS not set. Run the deploy script first.');
    }
    const cacheKey = signer.address;
    if (contractCache.has(cacheKey)) return contractCache.get(cacheKey);
    const contract = new ethers.Contract(config.contractAddress, contractAbi, signer);
    contractCache.set(cacheKey, contract);
    return contract;
}

function getContractForRole(role) {
    return getContractForSigner(getSignerForRole(role));
}

function getReadContract() {
    if (!config.contractAddress) {
        throw new Error('CONTRACT_ADDRESS not set. Run the deploy script first.');
    }
    return new ethers.Contract(config.contractAddress, contractAbi, provider);
}

async function assertChainReady() {
    try {
        await provider.getBlockNumber();
    } catch (err) {
        throw new Error(`Cannot reach blockchain at ${config.blockchainUrl}: ${err.message}`);
    }
    const contract = getReadContract();
    try {
        await contract.batchCount();
    } catch (err) {
        throw new Error(
            `Contract at ${config.contractAddress} does not look like AgriChain v2. ` +
            `Run: npm run reset. Original error: ${err.message}`
        );
    }
    if (typeof contract.getBatchHistory !== 'function') {
        throw new Error('Contract ABI is stale — getBatchHistory missing. Run: npm run reset');
    }
    logger.info({ contractAddress: config.contractAddress }, 'Blockchain ready');
}

module.exports = {
    provider,
    contractAbi,
    getSignerForRole,
    getContractForRole,
    getReadContract,
    assertChainReady,
    ROLE_TO_WALLET_INDEX,
};
