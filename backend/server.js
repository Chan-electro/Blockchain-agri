require('dotenv').config(); // Load environment variables FIRST

const express = require('express');
const cors = require('cors');
const { initializeBlockchain, deployContract } = require('./blockchain');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', apiRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'AgriChain Backend is running' });
});

// Deploy contract endpoint (for initial setup)
app.post('/deploy', async (req, res) => {
    try {
        const address = await deployContract();
        res.json({
            success: true,
            message: 'Contract deployed successfully',
            address
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Initialize blockchain connection
async function startServer() {
    try {
        // Initialize blockchain
        const contract = await initializeBlockchain();

        if (!contract && !process.env.CONTRACT_ADDRESS) {
            console.log('\n🚀 To deploy the contract, send a POST request to http://localhost:' + PORT + '/deploy');
            console.log('   Or set CONTRACT_ADDRESS in .env file\n');
        }

        // Start server
        app.listen(PORT, () => {
            console.log(`\n🌾 AgriChain Backend Server`);
            console.log(`📡 Server running on http://localhost:${PORT}`);
            console.log(`🔗 Blockchain: ${process.env.BLOCKCHAIN_URL || 'http://127.0.0.1:8545'}`);
            console.log(`\n📚 API Endpoints:`);
            console.log(`   POST /api/batch/create`);
            console.log(`   POST /api/batch/update`);
            console.log(`   GET  /api/batch/:id`);
            console.log(`   GET  /api/batches`);
            console.log(`   GET  /api/stats/count`);
            console.log(`   POST /deploy (setup only)\n`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();
