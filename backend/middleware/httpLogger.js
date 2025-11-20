const morgan = require('morgan');
const logger = require('../logger');

// Create a stream that writes to Winston
const stream = {
    write: (message) => logger.http(message.trim()),
};

// Custom token for request ID
morgan.token('id', (req) => req.id);

// Custom Morgan format with additional context
const morganFormat = ':id :method :url :status :res[content-length] - :response-time ms';

// Skip logging for health checks in production
const skip = (req) => {
    const env = process.env.NODE_ENV || 'development';
    return env === 'production' && req.url === '/health';
};

const httpLogger = morgan(morganFormat, { stream, skip });

module.exports = httpLogger;
