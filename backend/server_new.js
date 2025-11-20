const express = require('express');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const nodemailer = require('nodemailer');
const QRCode = require('qrcode');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
require('express-async-errors'); // Automatically catch async errors

// Import logger and middleware
const logger = require('./logger');
const httpLogger = require('./middleware/httpLogger');
const requestIdMiddleware = require('./middleware/requestId');
const errorHandler = require('./middleware/errorHandler');

const prisma = new PrismaClient({
    log: [
        { emit: 'event', level: 'query' },
        { emit: 'event', level: 'error' },
        { emit: 'event', level: 'warn' },
    ],
});

// Log Prisma queries in development
if (process.env.NODE_ENV === 'development') {
    prisma.$on('query', (e) => {
        logger.debug('Prisma Query', {
            query: e.query,
            duration: `${e.duration}ms`
        });
    });
}

prisma.$on('error', (e) => {
    logger.error('Prisma Error', { message: e.message, target: e.target });
});

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Create certificates directory if it doesn't exist
const certificatesDir = path.join(__dirname, 'certificates');
if (!fs.existsSync(certificatesDir)) {
    fs.mkdirSync(certificatesDir, { recursive: true });
    logger.info('Certificates directory created', { path: certificatesDir });
}

// Email transporter setup
const emailTransporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT),
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

// Verify email connection on startup
emailTransporter.verify((error) => {
    if (error) {
        logger.error('Email transporter verification failed', { error: error.message });
    } else {
        logger.info('Email transporter ready');
    }
});

// --- Middleware ---
app.use(cors());
app.use(express.json());
app.use(requestIdMiddleware); // Add request ID to all requests
app.use(httpLogger); // Log all HTTP requests

// Serve static files
app.use('/api/certificates', express.static(certificatesDir));

// Helper function to generate QR code
async function generateQRCode(data) {
    try {
        const qrCode = await QRCode.toDataURL(data);
        logger.debug('QR code generated successfully');
        return qrCode;
    } catch (error) {
        logger.error('Error generating QR code', {
            error: error.message,
            stack: error.stack
        });
        return null;
    }
}

// Helper function to generate certificate PDF
async function generateCertificatePDF(user, event, certificate) {
    return new Promise((resolve, reject) => {
        const startTime = Date.now();

        try {
            const filename = `certificate-${certificate.id}.pdf`;
            const filepath = path.join(certificatesDir, filename);

            logger.info('Generating certificate PDF', {
                certificateId: certificate.id,
                userId: user.id,
                userName: user.name,
                eventId: event.id,
                eventTitle: event.title,
            });

            const doc = new PDFDocument({
                size: 'A4',
                layout: 'landscape',
                margins: { top: 50, bottom: 50, left: 50, right: 50 }
            });

            const stream = fs.createWriteStream(filepath);
            doc.pipe(stream);

            // [Keep your existing PDF generation code here]
            doc.lineWidth(10);
            doc.strokeColor('#10b981');
            doc.rect(30, 30, doc.page.width - 60, doc.page.height - 60).stroke();
            // ... rest of your PDF code ...

            doc.end();

            stream.on('finish', () => {
                const duration = Date.now() - startTime;
                logger.info('Certificate PDF generated successfully', {
                    filename,
                    certificateId: certificate.id,
                    duration: `${duration}ms`,
                });
                resolve(filename);
            });

            stream.on('error', (err) => {
                logger.error('Error writing certificate PDF', {
                    error: err.message,
                    certificateId: certificate.id,
                    filepath,
                });
                reject(err);
            });
        } catch (error) {
            logger.error('Error in certificate PDF generation', {
                error: error.message,
                stack: error.stack,
                certificateId: certificate.id,
            });
            reject(error);
        }
    });
}

// Helper function to send certificate email
async function sendCertificateEmail(user, event, certificate, pdfPath) {
    try {
        logger.info('Sending certificate email', {
            recipientEmail: user.email,
            recipientName: user.name,
            eventTitle: event.title,
            certificateId: certificate.id,
        });

        // [Keep your existing email HTML template]
        const emailHtml = `...`; // Your existing template

        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: user.email,
            subject: `🏆 Certificate: ${event.title}`,
            html: emailHtml,
            attachments: [
                {
                    filename: `Certificate-${event.title.replace(/[^a-z0-9]/gi, '_')}.pdf`,
                    path: pdfPath,
                }
            ]
        };

        await emailTransporter.sendMail(mailOptions);

        logger.info('Certificate email sent successfully', {
            recipientEmail: user.email,
            certificateId: certificate.id,
        });
    } catch (error) {
        logger.error('Error sending certificate email', {
            error: error.message,
            stack: error.stack,
            recipientEmail: user.email,
            certificateId: certificate.id,
        });
        // Don't throw - certificate should be created even if email fails
    }
}

// Helper function to send confirmation email
async function sendConfirmationEmail(user, event, registration) {
    try {
        logger.info('Sending confirmation email', {
            recipientEmail: user.email,
            recipientName: user.name,
            eventTitle: event.title,
            registrationId: registration.id,
            ticketCode: registration.ticket_code,
        });

        // [Keep your existing email template]
        const emailHtml = `...`;

        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: user.email,
            subject: `Ticket Confirmation: ${event.title}`,
            html: emailHtml,
        };

        await emailTransporter.sendMail(mailOptions);

        logger.info('Confirmation email sent successfully', {
            recipientEmail: user.email,
            registrationId: registration.id,
        });
    } catch (error) {
        logger.error('Error sending confirmation email', {
            error: error.message,
            stack: error.stack,
            recipientEmail: user.email,
            registrationId: registration.id,
        });
    }
}

// Authentication Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        req.logger.warn('Authentication failed: No token provided', {
            ip: req.ip,
            path: req.path,
        });
        return res.sendStatus(401);
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            req.logger.warn('Authentication failed: Invalid token', {
                error: err.message,
                ip: req.ip,
            });
            return res.sendStatus(403);
        }

        req.user = user;
        req.logger = req.logger.child({ userId: user.id, userRole: user.role });
        next();
    });
};

// Role-based Access Middleware
const authorizeRole = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            req.logger.warn('Authorization failed: Insufficient role', {
                requiredRoles: roles,
                userRole: req.user.role,
                userId: req.user.id,
            });
            return res.status(403).json({ message: "Access forbidden: insufficient role" });
        }
        next();
    };
};

// --- Routes ---

// 1. Authentication
app.post('/auth/register', async (req, res) => {
    const { name, email, password } = req.body;

    req.logger.info('User registration attempt', { email, name });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            name,
            email,
            password_hash: hashedPassword,
            role: 'STUDENT',
        },
    });

    const userResponse = { id: user.id, name: user.name, email: user.email, role: user.role };
    const token = jwt.sign(userResponse, JWT_SECRET, { expiresIn: '7d' });

    req.logger.info('User registered successfully', {
        userId: user.id,
        email: user.email,
        role: user.role
    });

    res.status(201).json({ token, user: userResponse });
});

app.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;

    req.logger.info('Login attempt', { email });

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
        req.logger.warn('Login failed: User not found', { email });
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
        req.logger.warn('Login failed: Invalid password', {
            email,
            userId: user.id
        });
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const userResponse = { id: user.id, name: user.name, email: user.email, role: user.role };
    const token = jwt.sign(userResponse, JWT_SECRET, { expiresIn: '7d' });

    req.logger.info('Login successful', {
        userId: user.id,
        email: user.email,
        role: user.role
    });

    res.json({ token, user: userResponse });
});

// [Continue with your other routes, adding appropriate logging...]

// Event registration with enhanced logging
app.post('/events/:id/register', authenticateToken, authorizeRole(['STUDENT']), async (req, res) => {
    const event_id = req.params.id;
    const user_id = req.user.id;

    req.logger.info('Event registration attempt', {
        eventId: event_id,
        userId: user_id
    });

    const existingRegistration = await prisma.registration.findUnique({
        where: { user_id_event_id: { user_id, event_id } },
    });

    if (existingRegistration) {
        req.logger.warn('Registration failed: Already registered', {
            eventId: event_id,
            userId: user_id,
            existingRegistrationId: existingRegistration.id,
        });
        return res.status(400).json({ message: 'Already registered for this event' });
    }

    const registration = await prisma.registration.create({
        data: { user_id, event_id },
    });

    const qrCodeData = JSON.stringify({
        ticketCode: registration.ticket_code,
        eventId: event_id,
        userId: user_id,
        registrationId: registration.id,
    });

    const qrCode = await generateQRCode(qrCodeData);

    const updatedRegistration = await prisma.registration.update({
        where: { id: registration.id },
        data: { qr_code: qrCode },
    });

    const user = await prisma.user.findUnique({ where: { id: user_id } });
    const event = await prisma.event.findUnique({ where: { id: event_id } });

    await sendConfirmationEmail(user, event, updatedRegistration);

    req.logger.info('Event registration successful', {
        registrationId: registration.id,
        eventId: event_id,
        userId: user_id,
        ticketCode: registration.ticket_code,
    });

    res.status(201).json({
        message: 'Successfully registered!',
        registration: updatedRegistration
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// --- Start Server ---
const server = app.listen(PORT, () => {
    logger.info('EventNest backend server started', {
        port: PORT,
        environment: process.env.NODE_ENV || 'development',
        nodeVersion: process.version,
    });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
    logger.info('SIGTERM signal received: closing HTTP server');
    server.close(async () => {
        logger.info('HTTP server closed');
        await prisma.$disconnect();
        logger.info('Database connection closed');
        process.exit(0);
    });
});

process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection', {
        reason,
        promise,
    });
});

process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception', {
        error: error.message,
        stack: error.stack,
    });
    process.exit(1);
});
