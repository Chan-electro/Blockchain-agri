require('dotenv').config();

const required = (key) => {
    const value = process.env[key];
    if (!value) throw new Error(`Missing required env var: ${key}`);
    return value;
};

const config = {
    port: parseInt(process.env.PORT || '3001', 10),
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
    blockchainUrl: process.env.BLOCKCHAIN_URL || 'http://127.0.0.1:8545',
    contractAddress: process.env.CONTRACT_ADDRESS || '',
    mnemonic: required('MNEMONIC'),
    jwtSecret: required('JWT_SECRET'),
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
    bcryptRounds: 10,
    isProduction: process.env.NODE_ENV === 'production',
};

module.exports = config;
