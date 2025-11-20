# Changelog

All notable changes to EventNest will be documented in this file.

## [2.0.0] - 2025-11-10

### 🎉 Major Features Added

#### Event Ticketing System

- **Automatic Ticket Generation**: Every event registration now generates a unique ticket with QR
  code
- **Unique Ticket Codes**: Each registration receives a UUID-based ticket code
- **QR Code Embedding**: Base64-encoded QR codes stored with each ticket
- **Ticket Viewing Page**: New `/dashboard/tickets` page for students to view all their tickets
- **Download & Print**: Students can download QR codes and print tickets

#### Email Notification System

- **Confirmation Emails**: Automatic emails sent upon event registration
- **Professional Templates**: HTML email templates with inline styling
- **Embedded QR Codes**: QR codes included directly in confirmation emails
- **Event Details**: Complete event information in emails (date, location, ticket code)
- **Responsive Design**: Mobile-friendly email templates
- **Multiple Providers**: Support for Gmail, Outlook, SendGrid, Mailgun, and custom SMTP

#### QR Code Verification System

- **QR Verification Page**: New `/admin/events/:id/qr-verification` for organizers
- **Real-time Scanning**: Enter or scan ticket codes for instant verification
- **Attendee Check-in**: One-click check-in after verification
- **Duplicate Prevention**: System prevents double check-ins
- **User Information Display**: Shows attendee details upon verification
- **Recent Check-ins**: Live feed of recently checked-in attendees

#### Attendance Statistics Dashboard

- **Live Statistics**: Real-time attendance metrics
- **Total Registrations**: Count of all registered attendees
- **Checked-in Count**: Number of attendees who have checked in
- **Pending Count**: Attendees yet to check in
- **Attendance Rate**: Percentage calculation with live updates

### 🔧 Backend Changes

#### Database Schema Updates

- Added `ticket_code` field to Registration model (UUID, unique, indexed)
- Added `qr_code` field to Registration model (TEXT, nullable)
- Added `checked_in_at` field to Registration model (DATETIME, nullable)

#### New API Endpoints

- `GET /registrations/:id/ticket` - Get ticket details with QR code
- `POST /events/:id/verify-qr` - Verify QR code validity
- `POST /events/:id/checkin-qr` - Check in attendee via QR code
- `GET /events/:id/attendance-stats` - Get attendance statistics

#### New Dependencies

- `nodemailer@^6.9.13` - Email sending functionality
- `qrcode@^1.5.3` - QR code generation
- `uuid@^9.0.0` - Unique ID generation (already included via Prisma)

#### Helper Functions

- `generateQRCode(data)` - Creates base64 QR code from JSON data
- `sendConfirmationEmail(user, event, registration)` - Sends formatted confirmation email

#### Environment Variables

- `EMAIL_HOST` - SMTP server hostname
- `EMAIL_PORT` - SMTP server port
- `EMAIL_USER` - SMTP username
- `EMAIL_PASSWORD` - SMTP password
- `EMAIL_FROM` - Sender email address
- `FRONTEND_URL` - Frontend URL for links in emails

### 🎨 Frontend Changes

#### New Pages

- `MyTickets.jsx` - Ticket management page for students
- `QRVerification.jsx` - QR code verification and check-in page for organizers

#### Updated Pages

- `Dashboard.jsx` - Added "View My Tickets" button
- `ManageAttendance.jsx` - Added "QR Check-in" button
- `Root.jsx` - Added routes for new pages

#### Updated Components

- `Sidebar.jsx` - Added "My Tickets" navigation link

#### New Features in Existing Pages

- Ticket download functionality
- Print ticket capability
- QR code display
- Real-time statistics display
- Recent check-ins feed

### 📱 UI/UX Improvements

#### Tickets Page

- Grid layout for multiple tickets
- Visual status indicators (Registered vs Checked In)
- QR code preview with ticket details
- Download and print buttons
- Event information cards

#### QR Verification Page

- Clean scanner interface
- Visual feedback for valid/invalid tickets
- Attendee information display
- Check-in confirmation
- Duplicate scan warnings
- Statistics cards with icons
- Recent check-ins sidebar

### 🔐 Security Enhancements

- Email credentials stored securely in environment variables
- Email sending is non-blocking (registration succeeds even if email fails)
- QR code verification requires organizer/admin authentication
- Ticket code uniqueness enforced at database level
- Check-in timestamps for audit trail

### 📚 Documentation

#### New Documents

- `EMAIL_SETUP.md` - Comprehensive email configuration guide
- `MIGRATION_GUIDE.md` - Database migration instructions
- `QUICKSTART_TICKETS.md` - Quick start guide for ticketing features
- `CHANGELOG.md` - This file

#### Updated Documents

- `README.md` - Added new features, API endpoints, and routes
- `FEATURES.md` - Updated with ticketing and QR features

### 🐛 Bug Fixes

- Registration sorting now ordered by date (descending)
- Proper error handling for email sending failures
- Graceful degradation when email service is unavailable

### ⚡ Performance Improvements

- Added database index on `ticket_code` for faster lookups
- QR code verification uses indexed queries
- Parallel data fetching in dashboard and verification pages

### 🔄 Breaking Changes

None - All changes are backward compatible. Existing registrations will receive ticket codes
automatically.

### 📦 Migration Required

Yes - Database schema changes require migration. See [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md)

## [1.0.0] - 2025-10-28

### Initial Release

- User authentication (JWT)
- Event management (CRUD)
- Event registration system
- Certificate generation
- Role-based access control (Student, Organizer, Admin)
- Manual attendance tracking
- Admin dashboard
- Responsive design

---

## Version Numbering

- **Major version** (X.0.0): Breaking changes or major feature additions
- **Minor version** (0.X.0): New features, backward compatible
- **Patch version** (0.0.X): Bug fixes and minor improvements

---

**Current Version**: 2.0.0  
**Last Updated**: November 10, 2025
