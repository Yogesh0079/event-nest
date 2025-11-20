# Email Configuration Guide for EventNest

This guide will help you configure the email functionality for sending event confirmation tickets
with QR codes.

## Prerequisites

You need access to an SMTP email server. The most common options are:

1. **Gmail** (recommended for development)
2. **Outlook/Office 365**
3. **SendGrid**
4. **Mailgun**
5. **Your organization's SMTP server**

## Gmail Setup (Recommended for Development)

### Step 1: Enable 2-Factor Authentication

1. Go to your Google Account settings: https://myaccount.google.com/
2. Navigate to Security
3. Enable 2-Step Verification

### Step 2: Create an App-Specific Password

1. After enabling 2FA, go to: https://myaccount.google.com/apppasswords
2. Select "Mail" as the app
3. Select "Other" as the device and name it "EventNest"
4. Click "Generate"
5. Copy the 16-character password (you won't see it again)

### Step 3: Update Your .env File

In your `backend/.env` file, update these values:

```env
# Email Configuration for Gmail
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="587"
EMAIL_USER="your-email@gmail.com"
EMAIL_PASSWORD="your-16-char-app-password"
EMAIL_FROM="EventNest <your-email@gmail.com>"
FRONTEND_URL="http://localhost:3000"
```

**Important:** Replace:

- `your-email@gmail.com` with your actual Gmail address
- `your-16-char-app-password` with the app password you generated

## Alternative Email Providers

### Outlook/Office 365

```env
EMAIL_HOST="smtp.office365.com"
EMAIL_PORT="587"
EMAIL_USER="your-email@outlook.com"
EMAIL_PASSWORD="your-password"
EMAIL_FROM="EventNest <your-email@outlook.com>"
FRONTEND_URL="http://localhost:3000"
```

### SendGrid

```env
EMAIL_HOST="smtp.sendgrid.net"
EMAIL_PORT="587"
EMAIL_USER="apikey"
EMAIL_PASSWORD="your-sendgrid-api-key"
EMAIL_FROM="EventNest <your-verified-sender@yourdomain.com>"
FRONTEND_URL="http://localhost:3000"
```

### Custom SMTP Server

```env
EMAIL_HOST="smtp.yourdomain.com"
EMAIL_PORT="587"
EMAIL_USER="your-smtp-username"
EMAIL_PASSWORD="your-smtp-password"
EMAIL_FROM="EventNest <noreply@yourdomain.com>"
FRONTEND_URL="http://localhost:3000"
```

## Testing Email Configuration

After configuring your email settings, you can test them by:

1. Register a new student account (or login with an existing one)
2. Register for an event
3. Check your email for the confirmation with QR code

### Troubleshooting

**Email not sending:**

- Check that all environment variables are correctly set
- Verify your email credentials are correct
- Check if your email provider requires app-specific passwords
- Look at the backend console for error messages
- Ensure your firewall isn't blocking outgoing SMTP connections

**Gmail "Less secure app access" error:**

- This method is deprecated. Use app-specific passwords instead (see Step 2 above)

**Rate limiting:**

- Gmail has daily sending limits (~500 emails/day for free accounts)
- For production, consider using dedicated email services like SendGrid or Mailgun

## Email Features

The system sends automatic emails for:

1. **Event Registration Confirmation**
    - Event details (title, date, location)
    - Unique ticket code
    - QR code for check-in
    - Links to view ticket and event details

2. **Email Template**
    - Professional HTML design
    - Responsive layout
    - Embedded QR code as base64 image
    - Clear event information

## Production Considerations

### Security

- **Never commit** `.env` files to version control
- Use environment variables for all sensitive data
- Rotate passwords regularly
- Consider using OAuth2 for Gmail in production

### Scalability

- Gmail free accounts: ~500 emails/day
- Gmail Workspace: ~2,000 emails/day
- For larger volumes, use:
    - SendGrid (40,000 free emails/month)
    - Mailgun (5,000 free emails/month)
    - Amazon SES (62,000 free emails/month)

### Best Practices

1. **Use a dedicated sending domain**
2. **Set up SPF, DKIM, and DMARC records**
3. **Monitor bounce rates**
4. **Implement email queue for high volume**
5. **Add unsubscribe links (if sending promotional content)**
6. **Test emails across different clients**

## Email Queue (Optional Enhancement)

For production environments with high traffic, consider implementing an email queue using:

- **Bull** (Redis-based queue)
- **RabbitMQ**
- **AWS SQS**

This prevents blocking the registration API call while emails are being sent.

## Support

If you encounter issues:

1. Check the backend console logs
2. Verify your email provider's SMTP settings
3. Test with a simple email tool first
4. Review your email provider's documentation

## Example Email Output

When a user registers for an event, they receive an email that includes:

```
🎉 Event Registration Confirmed!

Hi [User Name],

Great news! You've successfully registered for [Event Title].

Your Event Ticket
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Event: [Event Title]
Date: [Event Date and Time]
Location: [Event Location]
Ticket Code: [Unique Code]

[QR CODE IMAGE]

Show this QR code at the event entrance for quick check-in.

[View Event Details] [View My Ticket]

Looking forward to seeing you there!

Best regards,
The EventNest Team
```

---

**Note:** Email functionality requires proper configuration before use. Registration will still work
even if email sending fails - the system is designed to be resilient.
