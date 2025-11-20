# Next Steps - Getting Started with Ticketing System

## 🎯 Quick Start (5 Minutes)

Follow these steps to get the new ticketing and QR code system up and running:

### Step 1: Install Dependencies (2 min)

```bash
# Navigate to backend
cd backend

# Install new packages
npm install

# This will install:
# - nodemailer (email sending)
# - qrcode (QR code generation)
# - uuid (unique IDs, may already be installed)
```

### Step 2: Database Migration (1 min)

```bash
# Still in backend directory

# Generate Prisma client with new schema
npx prisma generate

# Create and apply migration
npx prisma migrate dev --name add_ticket_qr_fields

# If prompted, confirm the migration
```

### Step 3: Configure Email (2 min)

Edit `backend/.env` and add these lines:

```env
# Email Configuration (Gmail example)
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="587"
EMAIL_USER="your-email@gmail.com"
EMAIL_PASSWORD="your-app-password"
EMAIL_FROM="EventNest <your-email@gmail.com>"
FRONTEND_URL="http://localhost:3000"
```

**Quick Gmail Setup:**

1. Go to https://myaccount.google.com/apppasswords
2. Create password for "Mail" → "Other (EventNest)"
3. Copy the 16-character password
4. Paste it as `EMAIL_PASSWORD` value

> **Note:** You need 2FA enabled on your Google account first

### Step 4: Start Application

```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm start
```

### Step 5: Test It Out!

1. **Login as a Student** (or create new student account)
2. **Register for an event**
3. **Check your email** for the confirmation with QR code
4. **Go to "My Tickets"** in the sidebar to see your ticket
5. **Try downloading** the QR code

**For Organizers:**

1. **Create an event** (if you're an organizer)
2. **Go to event's attendance page**
3. **Click "QR Check-in"** button
4. **Enter a ticket code** to test verification

## 📋 Detailed Setup Guide

### If You're Starting Fresh

#### 1. Clone and Setup (If not already done)

```bash
# Clone repository
git clone <your-repo-url>
cd YogiKaProject

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

#### 2. Database Setup

```bash
cd backend

# Create .env file (if not exists)
# Add DATABASE_URL and other configs

# Run migrations
npx prisma migrate dev

# Optional: Open Prisma Studio to view database
npx prisma studio
```

### If You Have Existing Data

Your existing registrations will automatically receive:

- Unique `ticket_code` (auto-generated)
- `qr_code` will be NULL initially
- `checked_in_at` will be NULL

**To generate QR codes for existing registrations:**
See [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md) for a script to backfill QR codes.

## 🧪 Testing Checklist

### Basic Functionality

- [ ] Start backend server (no errors)
- [ ] Start frontend (no errors)
- [ ] Login as student
- [ ] Register for an event
- [ ] Check email received
- [ ] View "My Tickets" page
- [ ] Download a QR code
- [ ] Print a ticket

### Organizer Features

- [ ] Login as organizer/admin
- [ ] Go to an event's attendance page
- [ ] Click "QR Check-in" button
- [ ] Enter a ticket code (from student's email/ticket)
- [ ] Verify the ticket
- [ ] Check in the attendee
- [ ] View attendance statistics

### Edge Cases

- [ ] Register when email is not configured (should still work)
- [ ] Try checking in same person twice (should be prevented)
- [ ] View tickets page with no registrations
- [ ] Unregister from event (ticket should still exist)

## 🔧 Troubleshooting

### Backend Won't Start

**Error:** "Cannot find module 'nodemailer'" or similar

**Solution:**

```bash
cd backend
npm install
```

### Database Migration Failed

**Error:** "Prisma migration failed"

**Solution:**

```bash
# Check database connection
cd backend
npx prisma db pull

# Try resetting (WARNING: deletes data)
npx prisma migrate reset

# Then migrate again
npx prisma migrate dev
```

### Email Not Sending

**Error:** "Invalid login" or "Authentication failed"

**Solutions:**

1. **Gmail:** Use app-specific password, not regular password
2. **Check .env:** Ensure all EMAIL_* variables are set
3. **Test connection:** Try with a simple nodemailer test script
4. **Firewall:** Check if port 587 is blocked

**Note:** Registration will still work even if email fails!

### QR Code Not Generated

**Check:**

```bash
# Ensure qrcode package is installed
cd backend
npm list qrcode

# Should show: qrcode@1.5.3 or similar
```

### Frontend Routes Not Working

**Error:** "Page not found" for `/dashboard/tickets`

**Solution:**

```bash
# Ensure you're running the latest code
cd frontend
npm start

# Clear browser cache
# Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
```

## 📚 What to Read Next

Depending on your needs:

### For Development

→ Read [QUICKSTART_TICKETS.md](QUICKSTART_TICKETS.md)

### For Email Setup

→ Read [EMAIL_SETUP.md](EMAIL_SETUP.md)

### For Database Migration

→ Read [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md)

### For Features Overview

→ Read [CHANGELOG.md](CHANGELOG.md)

### For Complete Documentation

→ Read [README.md](README.md)

## 🎨 Customization

### Want to Customize Email Templates?

Edit the `sendConfirmationEmail()` function in `backend/server.js`:

- Line ~40-140 contains the HTML email template
- Change colors, add logo, modify layout
- Test by registering for an event

### Want to Customize Ticket Design?

Edit `frontend/src/pages/MyTickets.jsx`:

- Modify the ticket card styling
- Add event-specific themes
- Change QR code size/placement

### Want to Add More Stats?

Edit the `attendance-stats` endpoint in `backend/server.js`:

- Add more calculations
- Include time-based analytics
- Track check-in trends

## 🚀 Deployment

### Before Deploying to Production

1. **Configure Production Email Service**
    - Use SendGrid, Mailgun, or AWS SES
    - Set up proper email domain
    - Configure SPF/DKIM records

2. **Set Environment Variables**
    - Never commit `.env` files
    - Use platform environment variables
    - Rotate credentials regularly

3. **Run Migration**
   ```bash
   npx prisma migrate deploy
   ```

4. **Test Thoroughly**
    - Test email delivery
    - Test QR scanning on real devices
    - Load test check-in system

5. **Monitor**
    - Set up error logging
    - Monitor email delivery rates
    - Track QR verification success

## 💡 Tips for Success

### For Students

- Save the confirmation email
- Screenshot QR code as backup
- Download ticket before event day
- Arrive early for smooth check-in

### For Organizers

- Test QR system before event
- Have backup (manual check-in list)
- Use multiple devices for large events
- Train volunteers on the system

### For Admins

- Monitor email sending quotas
- Keep backup of attendee data
- Regularly check system logs
- Update documentation as needed

## 🤝 Getting Help

If you're stuck:

1. **Check logs** - Backend console shows errors
2. **Read docs** - Comprehensive guides provided
3. **Test components** - Isolate the problem
4. **Review code** - Check implementation details
5. **Ask for help** - Provide error messages and logs

## ✅ You're Ready!

Once you've completed the Quick Start steps, you'll have:

- ✅ Automatic ticket generation
- ✅ Email confirmations
- ✅ QR code system
- ✅ Ticket management
- ✅ Check-in verification
- ✅ Attendance tracking

**Now go create some events and test it out! 🎉**

---

**Need more help?** Check out the other documentation files:

- [QUICKSTART_TICKETS.md](QUICKSTART_TICKETS.md)
- [EMAIL_SETUP.md](EMAIL_SETUP.md)
- [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md)

**Questions or issues?** Review the troubleshooting sections in each guide.

---

*Last Updated: November 2025*
