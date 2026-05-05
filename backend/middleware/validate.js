const { AppError } = require('../lib/errors');

function validate(schema, source = 'body') {
    return (req, _res, next) => {
        const result = schema.safeParse(req[source]);
        if (!result.success) {
            const issues = result.error.issues
                .map((i) => `${i.path.join('.') || 'field'}: ${i.message}`)
                .join('; ');
            return next(new AppError('VALIDATION_ERROR', issues, 400));
        }
        req[source] = result.data;
        next();
    };
}

module.exports = validate;
