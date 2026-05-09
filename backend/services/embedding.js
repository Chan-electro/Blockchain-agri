const logger = require('../lib/logger');

let _pipeline = null;

async function getPipeline() {
    if (_pipeline) return _pipeline;
    logger.info('Loading embedding model (first run may download ~22MB)...');
    const { pipeline, env } = await import('@xenova/transformers');
    env.allowLocalModels = false;
    _pipeline = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', { quantized: true });
    logger.info('Embedding model loaded');
    return _pipeline;
}

async function encode(text) {
    const pipe = await getPipeline();
    const output = await pipe(text, { pooling: 'mean', normalize: true });
    return Array.from(output.data);
}

module.exports = { encode };
