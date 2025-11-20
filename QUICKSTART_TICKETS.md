# Quick Start: Ticketing & QR Code System

Get up and running with EventNest's new ticketing system in minutes!

## 🚀 What You'll Get

- ✅ Automatic ticket generation with QR codes
- ✅ Email confirmations with embedded QR codes
- ✅ Digital ticket management for students
- ✅ QR code scanning for event check-in
- ✅ Real-time attendance tracking
- ✅ Attendance statistics dashboard

## 📦 Installation

### 1. Install Dependencies

```bash
cd backend
npm install nodemailer qrcode uuid
```

### 2. Update Database Schema

```bash
cd backend
npx prisma generate
npx prisma migrate dev --name add_ticket_qr_fields
```

### 3. Configure Email (5 minutes)

Add to `backend/.env`:

```env
# For Gmail (easiest for testing)
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="587"
EMAIL_USER="your-email@gmail.com"
EMAIL_PASSWORD="your-app-specific-password"
EMAIL_FROM="EventNest <your-email@gmail.com>"
FRONTEND_URL="http://localhost:3000"
```

**Get Gmail App Password:**

1. Enable 2FA on your Google account
2. Go to https://myaccount.google.com/apppasswords
3. Create password for "Mail" → "Other" (EventNest)
4. Copy the 16-character password

> See [EMAIL_SETUP.md](EMAIL_SETUP.md) for other email providers

### 4. Start the Application

```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend  
cd frontend
npm start
```

## 🎯 Using the New Features

### For Students

#### 1. Register for an Event

- Browse events at `/events`
- Click on any event → "Register for this Event"
- ✅ **You'll receive an email with your QR code!**

#### 2. View Your Tickets

- Navigate to "My Tickets" in the sidebar
- Or visit `/dashboard/tickets`
- See all your tickets with QR codes
- Download or print tickets

#### 3. At the Event

- Show your QR code (from email or tickets page)
- Organizer scans it → you're checked in!

### For Organizers

#### 1. Create an Event

- Go to `/admin/events/new`
- Fill in event details
- Create event

#### 2. Check In Attendees

**Option A: QR Code Scanner (Recommended)**

- Go to your event's attendance page
- Click "QR Check-in" button
- Or visit `/admin/events/{event-id}/qr-verification`
- Enter/scan ticket codes
- Verify → Check in

**Option B: Manual Check-in**

- Go to `/admin/events/{event-id}/attendance`
- Click "Mark Attended" for each person

#### 3. View Statistics

- QR verification page shows live stats:
    - Total registered
    - Checked in
    - Pending check-ins
    - Attendance rate %

## 📧 Test Email Configuration

Quick test to verify emails work:

1. Register a test student account
2. Create a test event (as organizer)
3. Register for the event
4. Check your email inbox
5. Should receive confirmation with QR code

**Troubleshooting:**

- Check backend console for email errors
- Verify .env credentials are correct
- Gmail users: ensure app password is used (not regular password)
- Check spam folder

## 🎫 QR Code Flow

```
Student Registers
    ↓
System Generates Ticket + QR Code
    ↓
Email Sent with QR Code
    ↓
Student Arrives at Event
    ↓
Organizer Scans QR Code
    ↓
System Verifies & Checks In
    ↓
Attendance Recorded
```

## 🔑 Key URLs

### Students

- **My Tickets**: `/dashboard/tickets`
- **Dashboard**: `/dashboard`

### Organizers

- **Manage Attendance**: `/admin/events/{id}/attendance`
- **QR Check-in**: `/admin/events/{id}/qr-verification`
- **My Events**: `/admin/events`

## 💡 Tips & Tricks

### For Efficient Check-in

1. **Use a dedicated device** for QR scanning
2. **Test beforehand** with a few registrations
3. **Have backup** - manual check-in still available
4. **Print attendee list** as fallback
5. **Multiple devices** - share QR verification link

### For Students

1. **Save the email** - it has your QR code
2. **Screenshot QR code** as backup
3. **Download ticket** from tickets page
4. **Arrive early** - check-in is fast!

### For Development

1. **Use Gmail** for quick email testing
2. **Test with real devices** to scan QR codes
3. **Multiple browsers** to test different users
4. **Network tools** to debug email issues

## 🐛 Common Issues

### Email Not Sending

**Check:**

- `.env` file has correct credentials
- Email service is running
- Internet connection is active
- Backend logs for error messages

**Solution:** Registration still works! Email is non-blocking.

### QR Code Not Appearing

**Check:**

- `qrcode` package installed
- Database migration completed
- Registration was successful

**Solution:** Re-register or generate QR codes manually

### Cannot Scan QR Code

**Check:**

- QR code is visible and clear
- Scanner app can read QR codes
- Ticket code is correct

**Solution:** Manually enter ticket code

## 📊 Database Schema

New fields added to `Registration` table:

```prisma
model Registration {
  // ... existing fields
  ticket_code   String   @unique @default(uuid())
  qr_code       String?  @db.Text
  checked_in_at DateTime?
  
  @@index([ticket_code])
}
```

## 🎨 Customization Ideas

### Email Template

- Modify `sendConfirmationEmail()` in `backend/server.js`
- Add your logo/branding
- Customize colors and styling

### QR Code Data

- Currently stores: ticketCode, eventId, userId, registrationId
- Can add: seatNumber, specialAccess, dietaryPrefs

### Ticket Design

- Customize `MyTickets.jsx` component
- Add event-specific designs
- Include sponsor logos

## 🚀 Next Steps

1. ✅ Get the basics working
2. Configure production email service
3. Test with real events
4. Train organizers on QR scanning
5. Gather feedback and iterate

## 📚 Additional Resources

- **Email Setup**: [EMAIL_SETUP.md](EMAIL_SETUP.md)
- **Migration Guide**: [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md)
- **Full README**: [README.md](README.md)
- **API Documentation**: See README.md "API Endpoints" section

## 🤝 Need Help?

1. Check the troubleshooting sections
2. Review backend console logs
3. Verify all environment variables
4. Test with minimal setup first
5. Check GitHub issues (if applicable)

---

**Happy Event Managing! 🎉**

*Last Updated: November 2025*
