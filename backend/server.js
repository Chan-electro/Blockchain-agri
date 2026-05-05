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

const app = express();

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors());
app.use(express.json({ limit: '200kb' }));
app.use(pinoHttp({ logger, autoLogging: { ignore: (req) => req.url === '/health' } }));

app.get('/health', (_req, res) => res.json(successResponse({ status: 'ok' })));

app.use('/api/auth', authRoutes);
app.use('/api', apiRoutes);

app.use((req, res) => res.status(404).json(errorResponse('NOT_FOUND', `No route for ${req.method} ${req.path}`)));
app.use(errorHandler(logger));

async function startServer() {
    try {
        await assertChainReady();
        app.listen(config.port, () => {
            logger.info({ port: config.port, frontend: config.frontendUrl }, 'AgriChain backend ready');
        });
    } catch (err) {
        logger.fatal({ err: err.message }, 'Failed to start server');
        logger.fatal('Hint: start Hardhat node and run `npm run deploy` from the smart-contract workspace first.');
        process.exit(1);
    }
}

startServer();
