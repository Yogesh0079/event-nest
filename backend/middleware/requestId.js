const crypto = require('crypto');
const logger = require('../logger');

const requestIdMiddleware = (req, res, next) => {
    // Generate unique request ID
    req.id = req.headers['x-request-id'] || crypto.randomUUID();

    // Create child logger with request ID
    req.logger = logger.child({
        requestId: req.id,
        method: req.method,
        path: req.path,
    });

    // Add request ID to response headers
    res.setHeader('X-Request-ID', req.id);

    next();
};

module.exports = requestIdMiddleware;
