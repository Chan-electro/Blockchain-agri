const jwt = require('jsonwebtoken');
const config = require('../lib/config');
const { AppError } = require('../lib/errors');

function auth(req, _res, next) {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
        return next(new AppError('UNAUTHORIZED', 'Missing or invalid Authorization header', 401));
    }
    const token = header.slice('Bearer '.length).trim();
    try {
        const decoded = jwt.verify(token, config.jwtSecret);
        req.user = {
            id: decoded.sub,
            email: decoded.email,
            role: decoded.role,
            walletIndex: decoded.walletIndex,
        };
        next();
    } catch (_err) {
        next(new AppError('UNAUTHORIZED', 'Invalid or expired token', 401));
    }
}

module.exports = auth;
