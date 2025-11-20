const winston = require('winston');
const path = require('path');
const fs = require('fs');

// --- Configuration ---

// Define log levels and colors
const logLevels = {
    levels: {
        error: 0,
        warn: 1,
        info: 2,
        http: 3,
        debug: 4,
    },
    colors: {
        error: 'red',
        warn: 'yellow',
        info: 'green',
        http: 'magenta',
        debug: 'blue',
    },
};

winston.addColors(logLevels.colors);

// Determine log level based on environment
const level = () => {
    const env = process.env.NODE_ENV || 'development';
    // Log 'debug' (highest verbosity) in development, 'info' in production/staging
    return env === 'development' ? 'debug' : 'info';
};

// --- Formats ---

// Custom format for console output (readable, colorful)
const consoleFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.colorize({ all: true }),
    winston.format.printf(
        (info) => `${info.timestamp} [${info.level}]: ${info.message}${info.stack ? '\n' + info.stack : ''}`
    )
);

// JSON format for file output (machine-readable, structured)
const fileFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }), // Ensures error stack traces are included
    winston.format.json()
);

// --- Directory Setup ---

const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

// --- Transports ---

const transports = [
    // 1. Console Transport (Colored, readable for developers)
    new winston.transports.Console({
        format: consoleFormat,
    }),

    // 2. File Transport for ALL logs (Static File Path - No Rotation)
    // Logs everything at or above the configured level (e.g., 'debug' or 'info')
    new winston.transports.File({
        filename: path.join(logsDir, 'application.log'),
        maxsize: 5242880, // 5MB limit per file (optional, but good practice)
        maxFiles: 5,     // Keep a maximum of 5 application files (will overwrite old ones)
        format: fileFormat,
    }),

    // 3. Separate File for ERROR logs only (Static File Path - No Rotation)
    new winston.transports.File({
        filename: path.join(logsDir, 'error.log'),
        level: 'error', // Only logs error messages here
        maxsize: 1048576, // 1MB limit for the error file
        maxFiles: 2,
        format: fileFormat,
    }),
];

// --- Logger Creation ---

const logger = winston.createLogger({
    level: level(), // Global minimum level
    levels: logLevels.levels,
    transports,
    exitOnError: false, // Prevents logger from exiting the process on uncaught exceptions
});

// --- Sanitization Helper ---

/**
 * Recursively removes or redacts sensitive information from log context data.
 */
const sanitizeData = (data) => {
    if (!data || typeof data !== 'object') return data;

    // Extend this list as needed
    const sensitiveKeys = ['password', 'password_hash', 'token', 'authorization', 'jwt_secret', 'email_password'];
    const sanitized = Array.isArray(data) ? [...data] : { ...data };

    for (const key of Object.keys(sanitized)) {
        // Check if the key name contains any sensitive term (case-insensitive)
        if (sensitiveKeys.some(sk => key.toLowerCase().includes(sk))) {
            sanitized[key] = '[REDACTED]';
        } else if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
            // Recurse for nested objects/arrays
            sanitized[key] = sanitizeData(sanitized[key]);
        }
    }

    return sanitized;
};

// Helper to log with context and automatic sanitization
logger.logWithContext = (level, message, context = {}) => {
    logger.log(level, message, sanitizeData(context));
};

module.exports = logger;