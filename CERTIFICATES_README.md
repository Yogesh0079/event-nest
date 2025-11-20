# Certificate Issuing Feature - Quick Reference

## 🎓 What's New

EventNest now includes a complete certificate issuing system that automatically generates beautiful
PDF certificates for event attendees!

## ✨ Key Features

### 1. PDF Certificate Generation

- **Beautiful Designs**: Professional landscape A4 certificates
- **Automatic Creation**: Generated with one click
- **Custom Branding**: EventNest branded with emerald theme
- **Event Details**: Includes all event information

### 2. Email Delivery

- **Automatic Sending**: Certificates emailed immediately
- **PDF Attachment**: Certificate attached to email
- **Professional Template**: Beautiful HTML email design
- **Multiple Links**: Dashboard and verification links

### 3. Public Verification

- **Shareable Links**: Verify certificate authenticity
- **No Login Required**: Public verification page
- **Complete Details**: Shows recipient, event, organizer
- **Professional Display**: Beautiful verification UI

## 🚀 Quick Start

### Installation

```bash
# Install PDFKit
cd backend
npm install pdfkit

# No migration needed - uses existing Certificate model
```

### For Organizers

#### Generate Certificates:

1. Go to event's attendance page
2. Mark attendees as "attended" (via QR or manually)
3. Click "Generate Certificates for Attended"
4. Wait for completion
5. Certificates are created and emailed automatically!

### For Students

#### Receive Certificates:

1. Attend an event
2. Get checked in by organizer
3. Organizer generates certificates
4. Receive email with PDF attachment
5. Download from email or dashboard

#### Share Verification:

1. Go to Dashboard → My Certificates
2. Click "Verify" on any certificate
3. Copy the verification URL
4. Share with employers/institutions

## 📄 Certificate Design

- **Format**: A4 Landscape
- **Theme**: Emerald green with professional borders
- **Includes**:
    - Recipient name (large, centered)
    - Event title and details
    - Event date and location
    - Issue date
    - Unique certificate ID
    - Verification URL

## 🔗 New Routes

### Backend API

- `POST /events/:id/generate-certificates` - Generate certificates
- `GET /users/me/certificates` - Get user's certificates
- `GET /certificates/:id/download` - Download certificate PDF
- `GET /certificates/:id/verify` - Verify certificate (public)

### Frontend

- `/verify/:id` - Public certificate verification page
- `/dashboard` - Updated with download & verify buttons

## 📁 Files Modified/Created

### Backend

- ✅ `backend/server.js` - Added PDF generation logic
- ✅ `backend/package.json` - Added pdfkit dependency
- ✅ `backend/certificates/` - Auto-created directory for PDFs

### Frontend

- ✅ `frontend/src/pages/CertificateVerify.jsx` - New verification page
- ✅ `frontend/src/pages/Dashboard.jsx` - Updated certificates section
- ✅ `frontend/src/Root.jsx` - Added verification route

### Documentation

- ✅ `CERTIFICATES_GUIDE.md` - Comprehensive guide
- ✅ `CERTIFICATES_README.md` - This file

## 🎯 How It Works

### Generation Flow

```
1. Organizer clicks "Generate Certificates"
   ↓
2. System finds all attended registrations
   ↓
3. For each attendee:
   - Create certificate record in database
   - Generate PDF with PDFKit
   - Save PDF to certificates/ directory
   - Send email with PDF attachment
   ↓
4. Return success/failure count
```

### Verification Flow

```
1. Student shares verification link
   ↓
2. Anyone visits /verify/{certificate-id}
   ↓
3. System queries database
   ↓
4. Shows certificate details (if valid)
   ↓
5. Displays authenticity badge
```

## 💡 Key Benefits

### For Students

- ✅ Professional certificates for resumes
- ✅ Verifiable credentials
- ✅ Easy sharing with verification links
- ✅ No need to request manually

### For Organizers

- ✅ Automated certificate generation
- ✅ No manual design/creation needed
- ✅ Professional appearance
- ✅ Reduces administrative work

### For Institutions

- ✅ Easy verification of credentials
- ✅ Public verification (no login needed)
- ✅ Authentic and tamper-proof
- ✅ Professional system

## 🔐 Security Features

- **Unique IDs**: Each certificate has unique UUID
- **Database Verification**: Verified against database records
- **Access Control**: Only authorized users can download
- **Public Verification**: Anyone can verify authenticity
- **No Email Exposure**: Emails not shown in verification

## 📧 Email Template Preview

Subject: `🏆 Certificate: [Event Title]`

Content:

- Congratulations header
- Certificate details card
- Event information
- PDF attachment
- Dashboard link
- Verification link
- Professional footer

## 🐛 Common Issues & Solutions

### Issue: "No attendees found"

**Solution**: Mark attendance before generating certificates

### Issue: PDF not downloading

**Solution**: Check `backend/certificates/` directory exists with write permissions

### Issue: Email not sending

**Solution**: Verify email configuration in `.env` file

### Issue: Verification shows "Invalid"

**Solution**: Certificate may not exist or ID is incorrect

## 📚 Documentation

For detailed information, see:

- **[CERTIFICATES_GUIDE.md](CERTIFICATES_GUIDE.md)** - Complete guide
- **[EMAIL_SETUP.md](EMAIL_SETUP.md)** - Email configuration
- **[README.md](README.md)** - Project overview

## 🎉 Success!

You now have a complete certificate issuing system with:

- ✅ Automatic PDF generation
- ✅ Email delivery
- ✅ Public verification
- ✅ Professional design
- ✅ Easy management

## 🚀 Next Steps

1. Configure email if not already done
2. Test with a small event
3. Mark test attendees
4. Generate certificates
5. Verify email delivery
6. Test verification page
7. Use in production!

---

**Version**: 2.1.0  
**Status**: ✅ Ready to Use  
**Last Updated**: November 2025
