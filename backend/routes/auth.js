const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const { z } = require('zod');

const config = require('../lib/config');
const { dbHelpers } = require('../database/db');
const { AppError, successResponse } = require('../lib/errors');
const { ROLE_TO_WALLET_INDEX } = require('../lib/wallets');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

const ROLES = ['FARMER', 'PROCESSOR', 'LOGISTICS', 'RETAILER', 'CONSUMER', 'ADMIN'];

const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8).max(128),
    role: z.enum(ROLES),
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});

const authLimiter = rateLimit({
    windowMs: 60_000,
    limit: 10,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { success: false, error: { code: 'RATE_LIMITED', message: 'Too many auth attempts, try again shortly' } },
});

function toPublicUser(row) {
    return {
        id: row.id,
        email: row.email,
        role: row.role,
        walletIndex: row.wallet_index,
        createdAt: row.created_at,
    };
}

function issueToken(user) {
    return jwt.sign(
        {
            sub: user.id,
            email: user.email,
            role: user.role,
            walletIndex: user.walletIndex,
        },
        config.jwtSecret,
        { expiresIn: config.jwtExpiresIn }
    );
}

router.post('/register', authLimiter, validate(registerSchema), async (req, res, next) => {
    try {
        const { email, password, role } = req.body;
        const existing = await dbHelpers.getUserByEmail(email);
        if (existing) throw new AppError('EMAIL_TAKEN', 'Email is already registered', 409);

        const password_hash = await bcrypt.hash(password, config.bcryptRounds);
        const walletIndex = ROLE_TO_WALLET_INDEX[role] ?? null;

        const result = await dbHelpers.createUser({
            email,
            password_hash,
            role,
            wallet_index: walletIndex,
            created_at: Date.now(),
        });

        const row = await dbHelpers.getUserById(result.lastID);
        const user = toPublicUser(row);
        const token = issueToken(user);
        res.status(201).json(successResponse({ token, user }));
    } catch (err) {
        next(err);
    }
});

router.post('/login', authLimiter, validate(loginSchema), async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const row = await dbHelpers.getUserByEmail(email);
        if (!row) throw new AppError('INVALID_CREDENTIALS', 'Invalid email or password', 401);
        const match = await bcrypt.compare(password, row.password_hash);
        if (!match) throw new AppError('INVALID_CREDENTIALS', 'Invalid email or password', 401);

        const user = toPublicUser(row);
        const token = issueToken(user);
        res.json(successResponse({ token, user }));
    } catch (err) {
        next(err);
    }
});

router.get('/me', auth, async (req, res, next) => {
    try {
        const row = await dbHelpers.getUserById(req.user.id);
        if (!row) throw new AppError('NOT_FOUND', 'User no longer exists', 404);
        res.json(successResponse({ user: toPublicUser(row) }));
    } catch (err) {
        next(err);
    }
});

module.exports = router;
