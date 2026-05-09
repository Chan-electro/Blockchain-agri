const express = require('express');
const rateLimit = require('express-rate-limit');
const { z } = require('zod');

const optionalAuth = require('../middleware/optionalAuth');
const validate = require('../middleware/validate');
const { streamChat } = require('../services/chatService');

const router = express.Router();

const chatLimiter = rateLimit({
    windowMs: 60_000,
    limit: 20,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { success: false, error: { code: 'RATE_LIMITED', message: 'Too many chat requests, slow down' } },
});

const chatSchema = z.object({
    message: z.string().min(1).max(2000),
    history: z.array(
        z.object({
            role: z.enum(['user', 'assistant']),
            content: z.string().max(4000),
        })
    ).max(16).default([]),
});

router.post(
    '/chat',
    chatLimiter,
    optionalAuth,
    validate(chatSchema),
    async (req, res, next) => {
        try {
            res.setHeader('Content-Type', 'text/event-stream');
            res.setHeader('Cache-Control', 'no-cache');
            res.setHeader('Connection', 'keep-alive');
            res.setHeader('X-Accel-Buffering', 'no');
            res.flushHeaders();

            const { message, history } = req.body;
            await streamChat(message, history, req.user, res);
        } catch (err) {
            next(err);
        }
    }
);

module.exports = router;
