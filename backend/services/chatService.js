const { encode } = require('./embedding');
const vectorStore = require('./vectorStore');
const config = require('../lib/config');
const logger = require('../lib/logger');

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'nvidia/nemotron-3-super-120b-a12b:free';
const MAX_HISTORY_TURNS = 8;

function buildSystemPrompt(user) {
    const base = `You are AgriChain AI, an assistant for the AgriChain blockchain-based agricultural supply chain platform.

Platform roles:
- FARMER: creates crop batches, sets base price
- PROCESSOR: cleans/grades crops, adds processing fee
- LOGISTICS: transports batches, adds transport fee
- RETAILER: receives and sells to consumers, adds retail markup
- ADMIN: platform oversight and analytics
- CONSUMER: verifies product origin via QR code scan

Data in context comes from a live SQLite database synced with an Ethereum smart contract. Transaction hashes and block numbers are real blockchain records.

Instructions:
- Answer clearly and concisely based on the retrieved context below
- If context does not contain the answer, say so — never invent batch IDs, prices, or addresses
- For general agricultural questions (cold chain, food safety, farming practices), use your knowledge
- When listing batches, include batch ID, crop, status, and total price
- Wallet addresses are Ethereum hex addresses (0x...)`;

    if (user) {
        return `${base}

Current user: ${user.email} | Role: ${user.role}
When the user says "my batches" or "my data", filter results by their role context.`;
    }
    return `${base}

Current user: Public consumer (not authenticated).`;
}

function buildMessages(systemPrompt, retrievedChunks, history, userMessage) {
    const contextBlock = retrievedChunks.length > 0
        ? `Retrieved context (top ${retrievedChunks.length} relevant records):\n\n${retrievedChunks.map((c, i) => `[${i + 1}]\n${c.text}`).join('\n\n---\n\n')}`
        : 'Retrieved context: No batch data found in the database yet.';

    const recentHistory = history.slice(-MAX_HISTORY_TURNS * 2);

    return [
        { role: 'system', content: `${systemPrompt}\n\n${contextBlock}` },
        ...recentHistory,
        { role: 'user', content: userMessage },
    ];
}

async function streamChat(userMessage, history, user, res) {
    if (!config.openRouterApiKey) {
        res.write('data: {"error":"OpenRouter API key not configured"}\n\n');
        res.end();
        return;
    }

    if (vectorStore.size() === 0) {
        const statusMsg = 'No batch data in the system yet. Create some batches first, then I can answer questions about them. I can still answer general agricultural questions!';
        res.write(`data: ${JSON.stringify({ token: statusMsg })}\n\n`);
        res.write('data: {"done":true}\n\n');
        res.end();
        return;
    }

    const queryVector = await encode(userMessage);
    const chunks = vectorStore.search(queryVector, 5);

    const systemPrompt = buildSystemPrompt(user);
    const messages = buildMessages(systemPrompt, chunks, history, userMessage);

    let upstream;
    try {
        upstream = await fetch(OPENROUTER_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${config.openRouterApiKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'https://agrichain.local',
                'X-Title': 'AgriChain AI',
            },
            body: JSON.stringify({
                model: MODEL,
                messages,
                stream: true,
                temperature: 0.7,
                max_tokens: 1024,
            }),
        });
    } catch (err) {
        logger.error({ err }, 'OpenRouter fetch failed');
        res.write('data: {"error":"AI service unavailable"}\n\n');
        res.end();
        return;
    }

    if (!upstream.ok) {
        const body = await upstream.text().catch(() => '');
        logger.error({ status: upstream.status, body }, 'OpenRouter error response');
        res.write('data: {"error":"AI service returned an error"}\n\n');
        res.end();
        return;
    }

    const reader = upstream.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    try {
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() ?? '';
            for (const line of lines) {
                if (!line.startsWith('data: ')) continue;
                const payload = line.slice(6).trim();
                if (!payload || payload === '[DONE]') {
                    res.write('data: {"done":true}\n\n');
                    res.end();
                    return;
                }
                try {
                    const parsed = JSON.parse(payload);
                    const token = parsed.choices?.[0]?.delta?.content;
                    if (token) res.write(`data: ${JSON.stringify({ token })}\n\n`);
                } catch {
                    // malformed SSE line — skip
                }
            }
        }
    } catch (err) {
        logger.error({ err }, 'Error reading OpenRouter stream');
        res.write('data: {"error":"Stream interrupted"}\n\n');
    }

    res.write('data: {"done":true}\n\n');
    res.end();
}

module.exports = { streamChat };
