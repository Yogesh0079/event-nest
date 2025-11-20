const logger = require('../logger');

const errorHandler = (err, req, res, next) => {
    const errorLogger = req.logger || logger;

    // Log error with full context
    errorLogger.error('Request error', {
        error: err.message,
        stack: err.stack,
        code: err.code,
        requestId: req.id,
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
        userId: req.user?.id,
    });

    // Send error response
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        error: process.env.NODE_ENV === 'production'
            ? 'Internal server error'
            : err.message,
        requestId: req.id,
    });
};

module.exports = errorHandler;
