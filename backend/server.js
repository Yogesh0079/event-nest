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

// --- Configuration & Initialization ---

// Import logger and middleware
const logger = require('./logger'); // Assuming './logger' exists for structured logging
const httpLogger = require('./middleware/httpLogger'); // Assuming HTTP logging middleware exists
const requestIdMiddleware = require('./middleware/requestId'); // Assuming Request ID middleware exists
const errorHandler = require('./middleware/errorHandler'); // Assuming final error handler exists

const prisma = new PrismaClient({
    // Enable logging events for integration with custom logger
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
    secure: false, // Use true for 465, false for other ports (like 587)
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

// --- Helper Functions (Updated to include full certificate generation logic) ---

/**
 * Generates a base64 Data URL for a QR code.
 */
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

/**
 * Generates the certificate PDF and saves it to the filesystem.
 */
async function generateCertificatePDF(user, event, certificate) {
    return new Promise((resolve, reject) => {
        const startTime = Date.now();
        const filename = `certificate-${certificate.id}.pdf`;
        const filepath = path.join(certificatesDir, filename);

        try {
            logger.info('Starting certificate PDF generation', {
                certificateId: certificate.id,
                userId: user.id,
                eventId: event.id,
            });

            const doc = new PDFDocument({
                size: 'A4',
                layout: 'landscape',
                margins: { top: 50, bottom: 50, left: 50, right: 50 }
            });

            const stream = fs.createWriteStream(filepath);
            doc.pipe(stream);

            // Certificate content (from the provided code)
            doc.lineWidth(10);
            doc.strokeColor('#10b981');
            doc.rect(30, 30, doc.page.width - 60, doc.page.height - 60).stroke();

            doc.lineWidth(3);
            doc.strokeColor('#059669');
            doc.rect(40, 40, doc.page.width - 80, doc.page.height - 80).stroke();

            // Logo/Header
            doc.fontSize(40)
                .fillColor('#10b981')
                .font('Helvetica-Bold')
                .text('EventNest', 0, 100, { align: 'center' });

            // Certificate title
            doc.fontSize(50)
                .fillColor('#1f2937')
                .font('Helvetica-Bold')
                .text('Certificate of Participation', 0, 170, { align: 'center' });

            // Decorative line
            doc.moveTo(200, 240)
                .lineTo(doc.page.width - 200, 240)
                .strokeColor('#10b981')
                .lineWidth(2)
                .stroke();

            // Certificate text
            doc.fontSize(16)
                .fillColor('#4b5563')
                .font('Helvetica')
                .text('This is to certify that', 0, 270, { align: 'center' });

            // Recipient name
            doc.fontSize(36)
                .fillColor('#1f2937')
                .font('Helvetica-Bold')
                .text(user.name, 0, 310, { align: 'center' });

            // Event details
            doc.fontSize(16)
                .fillColor('#4b5563')
                .font('Helvetica')
                .text('has successfully participated in', 0, 370, { align: 'center' });

            doc.fontSize(24)
                .fillColor('#059669')
                .font('Helvetica-Bold')
                .text(event.title, 0, 405, { align: 'center', width: doc.page.width - 100 });

            // Date and location
            doc.fontSize(14)
                .fillColor('#6b7280')
                .font('Helvetica')
                .text(`Held on ${new Date(event.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                })}`, 0, 460, { align: 'center' });

            doc.text(`at ${event.location}`, 0, 482, { align: 'center' });

            // Issue date
            doc.fontSize(12)
                .fillColor('#9ca3af')
                .font('Helvetica')
                .text(`Issued on: ${new Date(certificate.issued_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                })}`, 0, 520, { align: 'center' });

            // Certificate ID
            doc.fontSize(10)
                .fillColor('#d1d5db')
                .text(`Certificate ID: ${certificate.id}`, 0, doc.page.height - 70, { align: 'center' });

            // Verification note
            doc.fontSize(9)
                .fillColor('#9ca3af')
                .text(`Verify at: ${FRONTEND_URL}/verify/${certificate.id}`, 0, doc.page.height - 50, { align: 'center' });

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

/**
 * Sends the certificate email with the PDF attached.
 */
async function sendCertificateEmail(user, event, certificate, pdfPath) {
    try {
        logger.info('Sending certificate email', {
            recipientEmail: user.email,
            certificateId: certificate.id,
        });

        // Email HTML template (from the provided code)
        const emailHtml = `
            <!DOCTYPE html>
            <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 40px 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .header h1 { margin: 0; font-size: 32px; }
                .content { background: #f9fafb; padding: 40px 30px; border-radius: 0 0 10px 10px; }
                .cert-box { background: white; padding: 30px; border-radius: 8px; margin: 20px 0; border: 2px solid #10b981; }
                .event-title { color: #10b981; font-size: 24px; font-weight: bold; margin: 10px 0; }
                .detail-row { padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
                .label { font-weight: bold; color: #059669; }
                .button { display: inline-block; background: #10b981; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; margin: 10px 5px; font-weight: bold; }
                .button-secondary { background: #6b7280; }
                .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
                .congrats { text-align: center; font-size: 24px; color: #10b981; font-weight: bold; margin: 20px 0; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <div style="font-size: 60px; margin-bottom: 10px;">🏆</div>
                  <h1>Certificate Issued!</h1>
                </div>
                <div class="content">
                  <p class="congrats">Congratulations, ${user.name}!</p>
                  <p style="text-align: center; font-size: 18px;">You've earned a certificate of participation!</p>
                  
                  <div class="cert-box">
                    <div style="text-align: center; margin-bottom: 20px;">
                      <div style="font-size: 48px;">📜</div>
                    </div>
                    <h2 style="text-align: center; color: #1f2937; margin: 0;">Certificate of Participation</h2>
                    <p class="event-title" style="text-align: center;">${event.title}</p>
                    
                    <div style="margin-top: 20px;">
                      <div class="detail-row">
                        <span class="label">Event Date:</span> ${new Date(event.date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })}
                      </div>
                      <div class="detail-row">
                        <span class="label">Location:</span> ${event.location}
                      </div>
                      <div class="detail-row">
                        <span class="label">Issued:</span> ${new Date(certificate.issued_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })}
                      </div>
                      <div class="detail-row" style="border-bottom: none;">
                        <span class="label">Certificate ID:</span> <code style="background: #e5e7eb; padding: 4px 8px; border-radius: 4px;">${certificate.id}</code>
                      </div>
                    </div>
                  </div>

                  <div style="text-align: center;">
                    <p style="font-size: 16px; margin-bottom: 20px;">Your certificate is attached to this email as a PDF document.</p>
                    <a href="${FRONTEND_URL}/dashboard/certificates" class="button">View My Certificates</a>
                    <a href="${FRONTEND_URL}/verify/${certificate.id}" class="button button-secondary">Verify Certificate</a>
                  </div>

                  <div style="background: #e0f2fe; padding: 20px; border-radius: 8px; margin-top: 30px;">
                    <p style="margin: 0; font-size: 14px; color: #0369a1;">
                      <strong>💡 Tip:</strong> Save this certificate for your records. You can always access it from your dashboard,
                      and share the verification link with employers or institutions.
                    </p>
                  </div>

                  <p style="margin-top: 30px; text-align: center;">
                    Thank you for participating in our event. We hope to see you at more events soon!
                  </p>
                  <p style="text-align: center;">Best regards,<br><strong>The EventNest Team</strong></p>
                </div>
                <div class="footer">
                  <p>This is an automated message. Please do not reply to this email.</p>
                  <p>&copy; 2025 EventNest. All rights reserved.</p>
                </div>
              </div>
            </body>
            </html>
          `;

        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: user.email,
            subject: `🏆 Certificate: ${event.title}`,
            html: emailHtml,
            attachments: [{
                filename: `Certificate-${event.title.replace(/[^a-z0-9]/gi, '_')}.pdf`,
                path: pdfPath,
            }]
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
    }
}

/**
 * Sends the ticket confirmation email with the QR code embedded.
 */
async function sendConfirmationEmail(user, event, registration) {
    try {
        logger.info('Sending confirmation email', {
            recipientEmail: user.email,
            registrationId: registration.id,
            ticketCode: registration.ticket_code,
        });

        // Email HTML template (from the provided code)
        const emailHtml = `
            <!DOCTYPE html>
            <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
                .ticket { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 2px dashed #10b981; }
                .qr-code { text-align: center; margin: 20px 0; }
                .qr-code img { max-width: 250px; border: 3px solid #10b981; border-radius: 8px; }
                .event-details { margin: 20px 0; }
                .detail-row { padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
                .label { font-weight: bold; color: #059669; }
                .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
                .button { display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>🎉 Event Registration Confirmed!</h1>
                </div>
                <div class="content">
                  <p>Hi ${user.name},</p>
                  <p>Great news! You've successfully registered for <strong>${event.title}</strong>.</p>
                  
                  <div class="ticket">
                    <h2 style="color: #10b981; margin-top: 0;">Your Event Ticket</h2>
                    <div class="event-details">
                      <div class="detail-row">
                        <span class="label">Event:</span> ${event.title}
                      </div>
                      <div class="detail-row">
                        <span class="label">Date:</span> ${new Date(event.date).toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })}
                      </div>
                      <div class="detail-row">
                        <span class="label">Location:</span> ${event.location}
                      </div>
                      <div class="detail-row">
                        <span class="label">Ticket Code:</span> <code style="background: #e5e7eb; padding: 4px 8px; border-radius: 4px;">${registration.ticket_code}</code>
                      </div>
                    </div>
                    
                    <div class="qr-code">
                      <p style="margin-bottom: 10px;"><strong>Your Check-in QR Code:</strong></p>
                      <img src="${registration.qr_code}" alt="QR Code" />
                      <p style="margin-top: 10px; font-size: 14px; color: #6b7280;">
                        Show this QR code at the event entrance for quick check-in
                      </p>
                    </div>
                  </div>

                  <div style="text-align: center;">
                    <a href="${FRONTEND_URL}/events/${event.id}" class="button">View Event Details</a>
                    <a href="${FRONTEND_URL}/dashboard/tickets/${registration.id}" class="button" style="background: #059669;">View My Ticket</a>
                  </div>

                  <p style="margin-top: 30px;">
                    <strong>Important:</strong> Please save this email or take a screenshot of your QR code.
                    You'll need it to check in at the event.
                  </p>

                  <p>Looking forward to seeing you there!</p>
                  <p>Best regards,<br><strong>The EventNest Team</strong></p>
                </div>
                <div class="footer">
                  <p>This is an automated message. Please do not reply to this email.</p>
                  <p>&copy; 2025 EventNest. All rights reserved.</p>
                </div>
              </div>
            </body>
            </html>
          `;

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


// --- Authentication & Authorization Middleware ---

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        req.logger.warn('Authentication failed: No token provided', { ip: req.ip });
        return res.sendStatus(401);
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            req.logger.warn('Authentication failed: Invalid token', { error: err.message, ip: req.ip });
            return res.sendStatus(403);
        }

        req.user = user;
        req.logger = req.logger.child({ userId: user.id, userRole: user.role });
        next();
    });
};

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
    req.logger.info('User registration attempt', { email });

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user = await prisma.user.create({
            data: { name, email, password_hash: hashedPassword, role: 'STUDENT' },
        });

        const userResponse = { id: user.id, name: user.name, email: user.email, role: user.role };
        const token = jwt.sign(userResponse, JWT_SECRET, { expiresIn: '7d' });

        req.logger.info('User registered successfully', { userId: user.id, role: user.role });
        res.status(201).json({ token, user: userResponse });
    } catch (error) {
        if (error.code === 'P2002') {
            req.logger.warn('Registration failed: Email already in use', { email });
            return res.status(400).json({ message: 'Email already in use' });
        }
        throw error; // Let express-async-errors catch it
    }
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
        req.logger.warn('Login failed: Invalid password', { email, userId: user.id });
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const userResponse = { id: user.id, name: user.name, email: user.email, role: user.role };
    const token = jwt.sign(userResponse, JWT_SECRET, { expiresIn: '7d' });

    req.logger.info('Login successful', { userId: user.id, role: user.role });
    res.json({ token, user: userResponse });
});

app.get('/auth/me', authenticateToken, async (req, res) => {
    const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: { id: true, name: true, email: true, role: true },
    });
    if (!user) {
        req.logger.error('Auth check failed: User token refers to non-existent user', { jwtId: req.user.id });
        return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
});

// 2. Events (/events)
app.get('/events', async (req, res) => {
    const { category, search } = req.query;
    const where = { date: { gte: new Date() } }; // Only upcoming events

    if (category) {
        where.category = category;
    }

    if (search) {
        where.OR = [
            { title: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
        ];
    }

    const events = await prisma.event.findMany({
        where,
        include: { organizer: { select: { name: true } } },
        orderBy: { date: 'asc' },
    });
    res.json(events);
});

app.get('/events/:id', async (req, res) => {
    const event = await prisma.event.findUnique({
        where: { id: req.params.id },
        include: { organizer: { select: { name: true } } },
    });
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
});

app.post('/events', authenticateToken, authorizeRole(['ORGANIZER', 'ADMIN']), async (req, res) => {
    const { title, description, date, location, category, image_url } = req.body;
    const event = await prisma.event.create({
        data: {
            title, description, date: new Date(date), location, category, image_url,
            organizer_id: req.user.id,
        },
    });
    req.logger.info('Event created', { eventId: event.id, organizerId: req.user.id });
    res.status(201).json(event);
});

app.put('/events/:id', authenticateToken, authorizeRole(['ORGANIZER', 'ADMIN']), async (req, res) => {
    const eventId = req.params.id;
    const existingEvent = await prisma.event.findUnique({ where: { id: eventId } });

    if (!existingEvent) return res.status(404).json({ message: 'Event not found' });
    if (existingEvent.organizer_id !== req.user.id && req.user.role !== 'ADMIN') {
        req.logger.warn('Event update failed: Insufficient permission', { eventId, userId: req.user.id });
        return res.status(403).json({ message: 'You do not have permission to edit this event' });
    }

    const { title, description, date, location, category, image_url } = req.body;
    const updatedEvent = await prisma.event.update({
        where: { id: eventId },
        data: {
            title, description, date: new Date(date), location, category, image_url,
        },
    });
    req.logger.info('Event updated', { eventId });
    res.json(updatedEvent);
});

app.delete('/events/:id', authenticateToken, authorizeRole(['ORGANIZER', 'ADMIN']), async (req, res) => {
    const eventId = req.params.id;
    const existingEvent = await prisma.event.findUnique({ where: { id: eventId } });

    if (!existingEvent) return res.status(404).json({ message: 'Event not found' });
    if (existingEvent.organizer_id !== req.user.id && req.user.role !== 'ADMIN') {
        req.logger.warn('Event deletion failed: Insufficient permission', { eventId, userId: req.user.id });
        return res.status(403).json({ message: 'You do not have permission to delete this event' });
    }

    await prisma.certificate.deleteMany({ where: { event_id: eventId } });
    await prisma.registration.deleteMany({ where: { event_id: eventId } });
    await prisma.event.delete({ where: { id: eventId } });

    req.logger.info('Event deleted', { eventId });
    res.json({ message: 'Event deleted successfully' });
});

app.get('/users/me/events', authenticateToken, authorizeRole(['ORGANIZER', 'ADMIN']), async (req, res) => {
    const events = await prisma.event.findMany({
        where: { organizer_id: req.user.id },
        include: { _count: { select: { registrations: true } } },
        orderBy: { date: 'desc' },
    });
    res.json(events);
});

// 3. Registrations (/registrations)
app.post('/events/:id/register', authenticateToken, authorizeRole(['STUDENT']), async (req, res) => {
    const event_id = req.params.id;
    const user_id = req.user.id;
    req.logger.info('Event registration attempt', { eventId: event_id, userId: user_id });

    const existingRegistration = await prisma.registration.findUnique({
        where: { user_id_event_id: { user_id, event_id } },
    });

    if (existingRegistration) {
        req.logger.warn('Registration failed: Already registered', { eventId: event_id, userId: user_id });
        return res.status(400).json({ message: 'Already registered for this event' });
    }

    const registration = await prisma.registration.create({ data: { user_id, event_id } });

    const qrCodeData = JSON.stringify({ ticketCode: registration.ticket_code, eventId: event_id, userId: user_id, registrationId: registration.id });
    const qrCode = await generateQRCode(qrCodeData);

    const updatedRegistration = await prisma.registration.update({
        where: { id: registration.id },
        data: { qr_code: qrCode },
    });

    const user = await prisma.user.findUnique({ where: { id: user_id } });
    const event = await prisma.event.findUnique({ where: { id: event_id } });

    await sendConfirmationEmail(user, event, updatedRegistration);

    req.logger.info('Event registration successful', { registrationId: registration.id });
    res.status(201).json({ message: 'Successfully registered!', registration: updatedRegistration });
});

app.get('/registrations/:id/ticket', authenticateToken, async (req, res) => {
    const registrationId = req.params.id;

    const registration = await prisma.registration.findUnique({
        where: { id: registrationId },
        include: { event: true, user: { select: { id: true, name: true, email: true } } },
    });

    if (!registration) return res.status(404).json({ message: 'Ticket not found' });

    if (registration.user_id !== req.user.id && registration.event.organizer_id !== req.user.id && req.user.role !== 'ADMIN') {
        req.logger.warn('Ticket access denied', { registrationId, userId: req.user.id });
        return res.status(403).json({ message: 'Not authorized to view this ticket' });
    }
    res.json(registration);
});

app.post('/events/:id/verify-qr', authenticateToken, authorizeRole(['ORGANIZER', 'ADMIN']), async (req, res) => {
    const eventId = req.params.id;
    const { ticketCode } = req.body;

    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) return res.status(404).json({ message: 'Event not found' });
    if (event.organizer_id !== req.user.id && req.user.role !== 'ADMIN') return res.status(403).json({ message: 'Permission denied' });

    const registration = await prisma.registration.findFirst({
        where: { ticket_code: ticketCode, event_id: eventId },
        include: { user: { select: { id: true, name: true, email: true } }, event: { select: { id: true, title: true } } },
    });

    if (!registration) {
        req.logger.warn('QR verification failed: Invalid ticket code', { eventId, ticketCode });
        return res.status(404).json({ valid: false, message: 'Invalid ticket code for this event' });
    }

    req.logger.info('QR code verified successfully', { registrationId: registration.id, ticketCode });
    res.json({ valid: true, registration, alreadyCheckedIn: registration.attended, checkedInAt: registration.checked_in_at });
});

app.post('/events/:id/checkin-qr', authenticateToken, authorizeRole(['ORGANIZER', 'ADMIN']), async (req, res) => {
    const eventId = req.params.id;
    const { ticketCode } = req.body;

    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) return res.status(404).json({ message: 'Event not found' });
    if (event.organizer_id !== req.user.id && req.user.role !== 'ADMIN') return res.status(403).json({ message: 'Permission denied' });

    const registration = await prisma.registration.findFirst({
        where: { ticket_code: ticketCode, event_id: eventId },
        include: { user: { select: { id: true, name: true, email: true } } },
    });

    if (!registration) return res.status(404).json({ success: false, message: 'Invalid ticket code for this event' });
    if (registration.attended) return res.status(400).json({ success: false, message: 'This attendee has already been checked in', checkedInAt: registration.checked_in_at });

    const updatedRegistration = await prisma.registration.update({
        where: { id: registration.id },
        data: { attended: true, checked_in_at: new Date() },
        include: { user: { select: { id: true, name: true, email: true } } },
    });

    req.logger.info('Attendee checked in', { registrationId: registration.id, eventId });
    res.json({ success: true, message: 'Successfully checked in', registration: updatedRegistration });
});

app.delete('/events/:id/register', authenticateToken, authorizeRole(['STUDENT']), async (req, res) => {
    const event_id = req.params.id;
    const user_id = req.user.id;

    const registration = await prisma.registration.findUnique({
        where: { user_id_event_id: { user_id, event_id } },
    });

    if (!registration) return res.status(404).json({ message: 'Registration not found' });

    await prisma.registration.delete({
        where: { user_id_event_id: { user_id, event_id } },
    });

    req.logger.info('User unregistered from event', { eventId: event_id, userId: user_id });
    res.json({ message: 'Successfully unregistered from event' });
});

app.get('/users/me/registrations', authenticateToken, authorizeRole(['STUDENT']), async (req, res) => {
    const registrations = await prisma.registration.findMany({
        where: { user_id: req.user.id },
        include: { event: true },
    });
    res.json(registrations);
});

// 4. Attendance (/attendance)
app.get('/events/:id/registrations', authenticateToken, authorizeRole(['ORGANIZER', 'ADMIN']), async (req, res) => {
    const eventId = req.params.id;

    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) return res.status(404).json({ message: 'Event not found' });
    if (event.organizer_id !== req.user.id && req.user.role !== 'ADMIN') return res.status(403).json({ message: 'Permission denied' });

    const registrations = await prisma.registration.findMany({
        where: { event_id: eventId },
        include: { user: { select: { id: true, name: true, email: true } } },
        orderBy: { registered_at: 'desc' },
    });
    res.json(registrations);
});

app.get('/events/:id/attendance-stats', authenticateToken, authorizeRole(['ORGANIZER', 'ADMIN']), async (req, res) => {
    const eventId = req.params.id;

    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) return res.status(404).json({ message: 'Event not found' });
    if (event.organizer_id !== req.user.id && req.user.role !== 'ADMIN') return res.status(403).json({ message: 'Permission denied' });

    const totalRegistrations = await prisma.registration.count({ where: { event_id: eventId } });
    const checkedIn = await prisma.registration.count({ where: { event_id: eventId, attended: true } });

    const pending = totalRegistrations - checkedIn;
    const attendanceRate = totalRegistrations > 0 ? ((checkedIn / totalRegistrations) * 100).toFixed(1) : 0;

    res.json({ totalRegistrations, checkedIn, pending, attendanceRate: parseFloat(attendanceRate) });
});

app.post('/registrations/:id/attend', authenticateToken, authorizeRole(['ORGANIZER', 'ADMIN']), async (req, res) => {
    const registrationId = req.params.id;

    const registration = await prisma.registration.findUnique({ where: { id: registrationId }, include: { event: true } });
    if (!registration) return res.status(404).json({ message: 'Registration not found' });
    if (registration.event.organizer_id !== req.user.id && req.user.role !== 'ADMIN') return res.status(403).json({ message: 'Permission denied' });

    await prisma.registration.update({ where: { id: registrationId }, data: { attended: true } });
    req.logger.info('Attendance marked manually', { registrationId });
    res.json({ message: 'User marked as attended' });
});

// 5. Certificates (/certificates)
app.get('/users/me/certificates', authenticateToken, async (req, res) => {
    const certificates = await prisma.certificate.findMany({
        where: { user_id: req.user.id },
        include: { event: { select: { title: true, date: true, location: true } } },
        orderBy: { issued_at: 'desc' },
    });
    res.json(certificates);
});

app.get('/certificates/:id/download', authenticateToken, async (req, res) => {
    const certificateId = req.params.id;

    const certificate = await prisma.certificate.findUnique({
        where: { id: certificateId },
        include: { user: { select: { id: true } }, event: { select: { title: true } } },
    });

    if (!certificate) return res.status(404).json({ message: 'Certificate not found' });

    // Assuming organizers/admins should also be able to download any certificate for audit
    const event = await prisma.event.findUnique({ where: { id: certificate.event_id } });
    const isOrganizer = event && event.organizer_id === req.user.id;

    if (certificate.user.id !== req.user.id && !isOrganizer && req.user.role !== 'ADMIN') {
        req.logger.warn('Certificate download denied', { certificateId, userId: req.user.id });
        return res.status(403).json({ message: 'Not authorized to download this certificate' });
    }

    const filepath = path.join(certificatesDir, `certificate-${certificate.id}.pdf`);

    if (!fs.existsSync(filepath)) {
        req.logger.error('Certificate file not found', { filepath, certificateId });
        return res.status(404).json({ message: 'Certificate file not found' });
    }

    res.download(filepath, `Certificate-${certificate.event.title.replace(/[^a-z0-9]/gi, '_')}.pdf`);
});

app.get('/certificates/:id/verify', async (req, res) => {
    const certificateId = req.params.id;

    const certificate = await prisma.certificate.findUnique({
        where: { id: certificateId },
        include: {
            user: { select: { name: true, email: true } },
            event: { select: { title: true, date: true, location: true, organizer: { select: { name: true } } } },
        },
    });

    if (!certificate) return res.status(404).json({ valid: false, message: 'Certificate not found' });

    res.json({
        valid: true,
        certificate: {
            id: certificate.id,
            recipientName: certificate.user.name,
            eventTitle: certificate.event.title,
            eventDate: certificate.event.date,
            eventLocation: certificate.event.location,
            organizer: certificate.event.organizer.name,
            issuedAt: certificate.issued_at,
        }
    });
});

app.post('/events/:id/generate-certificates', authenticateToken, authorizeRole(['ORGANIZER', 'ADMIN']), async (req, res) => {
    const event_id = req.params.id;

    const event = await prisma.event.findUnique({ where: { id: event_id } });
    if (!event) return res.status(404).json({ message: 'Event not found' });
    if (event.organizer_id !== req.user.id && req.user.role !== 'ADMIN') return res.status(403).json({ message: 'Permission denied' });

    // Find all attended registrations
    const attendedRegistrations = await prisma.registration.findMany({
        where: { event_id, attended: true },
        include: { user: { select: { id: true, name: true, email: true } } },
    });

    if (attendedRegistrations.length === 0) {
        return res.status(200).json({ message: 'No attendees found for certificate generation.' });
    }

    // Filter out those that already have a certificate
    const existingCerts = await prisma.certificate.findMany({
        where: { event_id },
        select: { user_id: true }
    });
    const usersWithCerts = new Set(existingCerts.map(c => c.user_id));

    const registrationsNeedingCerts = attendedRegistrations.filter(reg => !usersWithCerts.has(reg.user_id));

    if (registrationsNeedingCerts.length === 0) {
        return res.status(200).json({ message: 'All eligible attendees already have certificates.' });
    }

    let successCount = 0;
    let failCount = 0;

    for (const reg of registrationsNeedingCerts) {
        try {
            // Create certificate record
            const certificate = await prisma.certificate.create({
                data: { user_id: reg.user_id, event_id: event_id, certificate_url: '' },
            });

            // Generate PDF
            const filename = await generateCertificatePDF(reg.user, event, certificate);

            // Update certificate with actual URL
            const finalCert = await prisma.certificate.update({
                where: { id: certificate.id },
                data: { certificate_url: `/api/certificates/${certificate.id}/download` },
            });

            // Send email with certificate attached
            const pdfPath = path.join(certificatesDir, filename);
            await sendCertificateEmail(reg.user, event, finalCert, pdfPath);

            successCount++;
            req.logger.info('Certificate generated and sent', { certificateId: finalCert.id, userId: reg.user.id });
        } catch (error) {
            req.logger.error('Certificate generation failed for user', {
                error: error.message,
                userId: reg.user.id
            });
            failCount++;
        }
    }

    const message = `Successfully generated ${successCount} certificate(s).${failCount > 0 ? ` ${failCount} failed.` : ''}`;
    res.status(201).json({
        message,
        generated: successCount,
        failed: failCount,
        total: registrationsNeedingCerts.length
    });
});

// 6. Admin Portal (/admin)
app.get('/admin/users', authenticateToken, authorizeRole(['ADMIN']), async (req, res) => {
    const users = await prisma.user.findMany({
        select: { id: true, name: true, email: true, role: true, created_at: true },
        orderBy: { created_at: 'desc' }
    });
    res.json(users);
});

app.put('/admin/users/:id/role', authenticateToken, authorizeRole(['ADMIN']), async (req, res) => {
    const { role } = req.body;
    if (!['STUDENT', 'ORGANIZER', 'ADMIN'].includes(role)) {
        return res.status(400).json({ message: 'Invalid role provided' });
    }

    const updatedUser = await prisma.user.update({
        where: { id: req.params.id },
        data: { role },
        select: { id: true, name: true, email: true, role: true },
    });
    req.logger.info('User role updated by admin', { targetUserId: updatedUser.id, newRole: updatedUser.role });
    res.json(updatedUser);
});

app.get('/admin/events', authenticateToken, authorizeRole(['ADMIN']), async (req, res) => {
    const events = await prisma.event.findMany({
        include: { organizer: { select: { name: true } } },
        orderBy: { date: 'desc' },
    });
    res.json(events);
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
    // For uncaught exceptions, it's safer to exit and let a process manager restart
    process.exit(1);
});