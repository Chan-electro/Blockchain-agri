class AppError extends Error {
    constructor(code, message, status = 400) {
        super(message);
        this.code = code;
        this.status = status;
    }
}

function successResponse(data, meta) {
    return meta ? { success: true, data, meta } : { success: true, data };
}

function errorResponse(code, message) {
    return { success: false, error: { code, message } };
}

function errorHandler(logger) {
    return (err, req, res, _next) => {
        if (err instanceof AppError) {
            logger.warn({ code: err.code, status: err.status }, err.message);
            return res.status(err.status).json(errorResponse(err.code, err.message));
        }
        logger.error({ err }, 'Unhandled error');
        const isProd = process.env.NODE_ENV === 'production';
        return res.status(500).json(errorResponse(
            'INTERNAL_ERROR',
            isProd ? 'Internal server error' : err.message || 'Unknown error'
        ));
    };
}

module.exports = { AppError, successResponse, errorResponse, errorHandler };
