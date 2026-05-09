const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const pinoHttp = require('pino-http');

const config = require('./lib/config');
const logger = require('./lib/logger');
const { errorHandler, successResponse, errorResponse } = require('./lib/errors');
const { assertChainReady } = require('./lib/wallets');
const apiRoutes = require('./routes/api');
const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat');
const vectorStore = require('./services/vectorStore');

const app = express();

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors());
app.use(express.json({ limit: '200kb' }));
app.use(pinoHttp({ logger, autoLogging: { ignore: (req) => req.url === '/health' } }));

app.get('/health', (_req, res) => res.json(successResponse({ status: 'ok' })));

app.use('/api/auth', authRoutes);
app.use('/api', apiRoutes);
app.use('/api', chatRoutes);

app.use((req, res) => res.status(404).json(errorResponse('NOT_FOUND', `No route for ${req.method} ${req.path}`)));
app.use(errorHandler(logger));

async function startServer() {
    try {
        await assertChainReady();
        await new Promise((resolve, reject) => {
            const server = app.listen(config.port, () => {
                logger.info({ port: config.port, frontend: config.frontendUrl }, 'AgriChain backend ready');
                resolve(server);
            });
            server.once('error', reject);
        });
        // Non-blocking: build vector index after server is listening
        vectorStore.rebuild().catch((err) => logger.error({ err }, 'Vector store rebuild failed'));
    } catch (err) {
        logger.fatal({ err: err.message }, 'Failed to start server');
        logger.fatal('Hint: start Hardhat node and run `npm run deploy` from the smart-contract workspace first.');
        process.exit(1);
    }
}

startServer();
