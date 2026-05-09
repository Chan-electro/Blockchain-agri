const jwt = require('jsonwebtoken');
const config = require('../lib/config');

function optionalAuth(req, _res, next) {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
        req.user = null;
        return next();
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
    } catch {
        req.user = null;
    }
    next();
}

module.exports = optionalAuth;
