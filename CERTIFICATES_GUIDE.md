# Certificate Issuing System Guide

Comprehensive guide for generating, issuing, and verifying certificates in EventNest.

## 🎓 Overview

The certificate issuing system automatically generates beautiful PDF certificates for event
attendees and sends them via email with professional templates.

## ✨ Features

### Certificate Generation

- **Automatic PDF Creation**: Beautiful landscape A4 certificates
- **Professional Design**: Custom branded certificates with borders and styling
- **Event Details**: Includes event name, date, location, and organizer
- **Unique Certificate IDs**: Each certificate has a unique identifier
- **Verification Links**: QR-style verification URLs embedded in certificates

### Email Delivery

- **Automatic Sending**: Certificates emailed immediately upon generation
- **PDF Attachment**: Certificate included as PDF file
- **Professional Template**: Beautiful HTML email with certificate details
- **Multiple CTAs**: Links to view dashboard and verify certificate

### Certificate Verification

- **Public Verification**: Anyone can verify a certificate using its ID
- **Detailed Information**: Shows recipient, event, organizer, and dates
- **Authenticity Badge**: Visual confirmation of valid certificates
- **Shareable Links**: Easy sharing for resumes and portfolios

## 🚀 Quick Start

### For Organizers

#### 1. Mark Attendance First

Before generating certificates, ensure attendees are marked as "attended":

```
1. Go to event's attendance page
2. Check in attendees (via QR or manually)
3. Verify attendance is marked
```

#### 2. Generate Certificates

```
1. Navigate to `/admin/events/{event-id}/attendance`
2. Click "Generate Certificates for Attended"
3. Wait for generation to complete
4. System creates PDFs and sends emails automatically
```

#### 3. Monitor Status

- Check console logs for progress
- View success/failure count in response
- Certificates saved in `backend/certificates/` directory

### For Students

#### 1. Receive Certificate Email

After attending an event and certificates are generated:

```
1. Check your email inbox
2. Find "🏆 Certificate: [Event Name]"
3. Download attached PDF
4. Click links to view in dashboard
```

#### 2. Access from Dashboard

```
1. Go to Dashboard (`/dashboard`)
2. Scroll to "My Certificates" section
3. Download PDF or verify certificate
```

#### 3. Share Verification

```
1. Click "Verify" button on certificate
2. Copy the verification URL
3. Share with employers/institutions
4. They can verify authenticity publicly
```

## 📄 Certificate Design

### Layout

- **Format**: A4 Landscape (841 x 595 points)
- **Margins**: 50 points on all sides
- **Border**: Double border (green theme)
- **Fonts**: Helvetica (Bold and Regular)

### Elements

1. **Header**: "EventNest" logo text
2. **Title**: "Certificate of Participation"
3. **Recipient Name**: Large, bold, centered
4. **Event Details**: Title, date, location
5. **Issue Date**: Certificate generation date
6. **Certificate ID**: Unique identifier
7. **Verification URL**: Link to verify

### Colors

- Primary: `#10b981` (Emerald)
- Secondary: `#059669` (Dark Emerald)
- Text: `#1f2937` (Dark Gray)
- Accents: `#4b5563`, `#6b7280`, `#9ca3af`

## ���� API Endpoints

### Generate Certificates

```http
POST /events/:id/generate-certificates
Authorization: Bearer <token>
Role: ORGANIZER, ADMIN
```

**Response:**

```json
{
  "message": "Successfully generated 5 certificate(s).",
  "generated": 5,
  "failed": 0,
  "total": 5
}
```

### Get User's Certificates

```http
GET /users/me/certificates
Authorization: Bearer <token>
Role: STUDENT, ORGANIZER, ADMIN
```

**Response:**

```json
[
  {
    "id": "cert-uuid",
    "user_id": "user-uuid",
    "event_id": "event-uuid",
    "certificate_url": "/api/certificates/cert-uuid/download",
    "issued_at": "2025-11-10T12:00:00Z",
    "event": {
      "title": "Tech Workshop 2025",
      "date": "2025-11-01T10:00:00Z",
      "location": "Main Auditorium"
    }
  }
]
```

### Download Certificate

```http
GET /certificates/:id/download
Authorization: Bearer <token>
```

**Response:** PDF file download

### Verify Certificate (Public)

```http
GET /certificates/:id/verify
```

**Response:**

```json
{
  "valid": true,
  "certificate": {
    "id": "cert-uuid",
    "recipientName": "John Doe",
    "eventTitle": "Tech Workshop 2025",
    "eventDate": "2025-11-01T10:00:00Z",
    "eventLocation": "Main Auditorium",
    "organizer": "Jane Smith",
    "issuedAt": "2025-11-10T12:00:00Z"
  }
}
```

## 📧 Email Template

### Subject

```
🏆 Certificate: [Event Title]
```

### Content Includes

1. Congratulations header with trophy emoji
2. Certificate details card
3. Event information
4. PDF attachment
5. Links to dashboard and verification
6. Tips for saving and sharing
7. Professional footer

## 🎨 Frontend Components

### CertificateVerify Page

- Public verification interface
- No authentication required
- Clean, professional design
- Shareable URL
- Located at `/verify/:id`

### Dashboard Integration

- Certificates section in student dashboard
- Download PDF button
- Verify button
- Event details display

## 🔐 Security & Privacy

### Access Control

- **Generation**: Only organizers/admins for their events
- **Download**: Certificate owners, organizers, admins
- **Verification**: Public (anyone with link)

### Data Protection

- Certificate PDFs stored securely on server
- Only necessary information in public verification
- Email addresses not exposed in verification
- Unique IDs prevent guessing

## 📁 File Structure

### Backend

```
backend/
├── certificates/           # Generated PDF files
│   ├── certificate-uuid-1.pdf
│   ├── certificate-uuid-2.pdf
│   └── ...
└── server.js              # Certificate generation logic
```

### Frontend

```
frontend/src/pages/
├── CertificateVerify.jsx  # Public verification page
└── Dashboard.jsx          # Shows user certificates
```

## 🛠️ Technical Details

### PDF Generation

- Library: `pdfkit@^0.14.0`
- Size: A4 Landscape
- Resolution: 72 DPI
- Format: PDF 1.3

### File Naming

```
certificate-{certificate-id}.pdf
```

### Storage

- Files stored in `backend/certificates/`
- No cloud storage (local filesystem)
- Automatic directory creation
- Consider CDN for production

## 💡 Tips & Best Practices

### For Organizers

**Before Generation:**

1. ✅ Verify all attendees are marked
2. ✅ Check event details are correct
3. ✅ Ensure email service is configured
4. ✅ Test with small batch first

**During Generation:**

- Monitor console for errors
- Don't refresh/close browser
- Wait for completion message
- Check generated count matches expected

**After Generation:**

- Spot check a few PDFs
- Verify emails were sent
- Test verification links
- Keep backup of certificates

### For Students

**Receiving Certificates:**

- Check spam/junk folder
- Save PDF immediately
- Keep verification link
- Add to portfolio/resume

**Sharing:**

- Use verification link for proof
- Don't share PDF directly (large file)
- Verification link is permanent
- Safe to share publicly

## 🐛 Troubleshooting

### Certificates Not Generating

**Issue**: "No attendees found"
**Solution**: Mark attendance first before generating

**Issue**: Generation fails silently
**Solution**: Check:

- `backend/certificates/` directory exists
- Sufficient disk space
- File write permissions
- Console error logs

### PDFs Not Displaying Correctly

**Issue**: Text appears cut off
**Solution**: Font metrics issue - use standard fonts

**Issue**: Border not showing
**Solution**: Check PDF viewer zoom settings

### Email Not Sending

**Issue**: Certificates generate but no email
**Solution**:

- Check email configuration in `.env`
- Verify SMTP credentials
- Check console for email errors
- Emails sent asynchronously (non-blocking)

### Verification Fails

**Issue**: "Certificate not found"
**Solution**:

- Verify certificate ID is correct
- Check certificate exists in database
- Try accessing `/certificates/:id/verify` directly

## 📊 Database Schema

### Certificate Model

```prisma
model Certificate {
  id              String   @id @default(uuid())
  user            User     @relation(fields: [user_id], references: [id])
  user_id         String
  event           Event    @relation(fields: [event_id], references: [id])
  event_id        String
  issued_at       DateTime @default(now())
  certificate_url String   // Download URL

  @@unique([user_id, event_id])
  @@index([user_id])
  @@index([event_id])
}
```

## 🚀 Production Considerations

### Storage

- **Development**: Local filesystem
- **Production**: Consider AWS S3, CloudFlare R2, or CDN
- **Backup**: Regular backups of certificates directory

### Scalability

- **Queue System**: For high-volume events (Bull, RabbitMQ)
- **Batch Processing**: Generate in batches of 50-100
- **Progress Tracking**: WebSocket for real-time updates

### Performance

- **Async Generation**: Don't block API response
- **CDN Delivery**: Serve PDFs through CDN
- **Caching**: Cache verification responses (5 min)

### Monitoring

- **Track Generation**: Success/failure rates
- **Email Delivery**: Monitor bounce rates
- **Verification**: Track verification usage
- **Storage**: Monitor disk usage

## 🎯 Future Enhancements

### Planned Features

1. **Custom Templates**: Different designs per event category
2. **Bulk Download**: ZIP file of all certificates
3. **Watermarks**: Add security watermarks
4. **Digital Signatures**: Cryptographic signatures
5. **Blockchain**: Store hashes on blockchain
6. **Badge Integration**: LinkedIn badge integration
7. **Analytics**: Track certificate views and downloads
8. **Multi-language**: Support for multiple languages

### Integration Opportunities

- LinkedIn Certifications
- Resume builders
- Portfolio websites
- Credential verification services

## 📞 Support

### Common Issues

- Check logs in `backend/certificates/`
- Verify email configuration
- Test with single certificate first
- Ensure attendees are marked

### Best Practices

- Generate certificates within 24 hours of event
- Test email delivery before large batches
- Keep certificates directory backed up
- Monitor disk space usage

---

**Last Updated**: November 2025  
**Version**: 2.1.0  
**Status**: ✅ Production Ready
