const { AppError } = require('../lib/errors');

function requireRole(...roles) {
    return (req, _res, next) => {
        if (!req.user) return next(new AppError('UNAUTHORIZED', 'Authentication required', 401));
        if (!roles.includes(req.user.role)) {
            return next(new AppError(
                'FORBIDDEN',
                `Role '${req.user.role}' is not permitted here (requires ${roles.join(' or ')})`,
                403
            ));
        }
        next();
    };
}

module.exports = requireRole;
