# EventNest Features Guide

Quick reference for all available features by user role.

---

## 👨‍🎓 STUDENT Role Features

### Event Discovery

- 🔍 **Browse Events** - View all upcoming campus events
- 🔎 **Search Events** - Search by keywords in title/description
- 🏷️ **Filter by Category** - Tech, Cultural, Sports, Academic
- 📄 **Event Details** - View complete event information

### Event Participation

- ✅ **Register for Events** - One-click registration
- ❌ **Unregister** - Cancel registration before attendance marked
- 📊 **View Registrations** - See all registered events in dashboard
- 📜 **Access Certificates** - Download certificates for attended events

### Account Management

- 🔐 **Secure Login** - JWT-based authentication
- 📝 **Sign Up** - Create new account (default Student role)
- 👤 **Profile Dashboard** - View profile and event history

---

## 👨‍💼 ORGANIZER Role Features

### All Student Features +

### Event Management

- ➕ **Create Events** - Full event creation form
    - Title, description, date/time
    - Location, category, image URL
- ✏️ **Edit Events** - Modify event details
- 🗑️ **Delete Events** - Remove events with cascade deletion
- 📋 **View My Events** - List all created events with stats

### Attendance & Certificates

- 👥 **View Registrations** - See all registered participants
- ✅ **Mark Attendance** - Check in attendees
- 🏆 **Generate Certificates** - Bulk certificate generation for attendees
- 📊 **Registration Count** - Track event popularity

---

## 👨‍💻 ADMIN Role Features

### All Organizer Features +

### User Management

- 👤 **View All Users** - Complete user list
- 🔄 **Change User Roles** - Promote/demote users
    - Student → Organizer
    - Organizer → Admin
    - Any role changes

### System Management

- 🌐 **View All Events** - System-wide event overview
- 🔓 **Full Access** - Manage any event regardless of creator
- 🛡️ **Override Permissions** - Admin access to all features

---

## 🎯 Feature Availability Matrix

| Feature | Student | Organizer | Admin |
|---------|---------|-----------|-------|
| Browse Events | ✅ | ✅ | ✅ |
| Search/Filter | ✅ | ✅ | ✅ |
| Register for Events | ✅ | ✅ | ✅ |
| Unregister | ✅ | ✅ | ✅ |
| View Own Certificates | ✅ | ✅ | ✅ |
| Create Events | ❌ | ✅ | ✅ |
| Edit Own Events | ❌ | ✅ | ✅ |
| Delete Own Events | ❌ | ✅ | ✅ |
| Manage Attendance | ❌ | ✅ (own) | ✅ (all) |
| Generate Certificates | ❌ | ✅ (own) | ✅ (all) |
| View All Users | ❌ | ❌ | ✅ |
| Change User Roles | ❌ | ❌ | ✅ |
| Edit Any Event | ❌ | ❌ | ✅ |
| Delete Any Event | ❌ | ❌ | ✅ |

---

## 🗺️ Navigation Map

### Public Pages (No Login Required)

```
/                    → Home page
/events              → Browse events
/events/:id          → Event details
/about               → About page
/faq                 → FAQ page
/contact             → Contact page
/news                → News page
/login               → Login/Register page
```

### Protected Pages - Student

```
/dashboard           → Student dashboard
                       - Registered events
                       - Certificates
```

### Protected Pages - Organizer/Admin

```
/admin               → Admin panel home
/admin/events        → Manage my events (NEW!)
/admin/events/new    → Create new event
/admin/events/:id/edit       → Edit event (NEW!)
/admin/events/:id/attendance → Manage attendance
```

### Protected Pages - Admin Only

```
/admin/users         → Manage all users
```

---

## 🔐 Security Features

### Authentication

- JWT tokens with 7-day expiration
- Secure password hashing (bcryptjs, 10 rounds)
- Token stored in localStorage
- Automatic token refresh

### Authorization

- Role-based access control (RBAC)
- Protected routes on frontend
- Protected endpoints on backend
- Ownership verification for event operations

### Data Protection

- SQL injection prevention (Prisma ORM)
- CORS enabled for frontend
- Password hashing before storage
- No password exposure in API responses

---

## 📱 Responsive Design

All pages are fully responsive:

- 📱 **Mobile** - Optimized for phones (320px+)
- 📲 **Tablet** - Enhanced for tablets (768px+)
- 💻 **Desktop** - Full features for desktop (1024px+)

---

## 🎨 UI Components

### Reusable Components

- `EventCard` - Event display card
- `PageHero` - Page header with image
- `FaqItem` - Collapsible FAQ item
- `Toast` - Notification system
- `Header` - Navigation bar
- `Footer` - Site footer
- `Sidebar` - Mobile navigation

### Form Elements

- Text inputs with validation
- Datetime picker
- Select dropdowns
- Textareas for descriptions
- File URL inputs

### Interactive Elements

- Buttons (Primary, Secondary, Danger)
- Loading states
- Empty states
- Confirmation dialogs
- Toast notifications

---

## 🚀 Quick Start for Users

### As a Student

1. Register account at `/login`
2. Browse events at `/events`
3. Click event to view details
4. Click "Register" to join
5. View registrations in `/dashboard`
6. Get certificates after attending

### As an Organizer

1. Get Organizer role from admin
2. Go to `/admin` panel
3. Click "Create New Event"
4. Fill event details and submit
5. Manage events from `/admin/events`
6. Mark attendance and generate certificates

### As an Admin

1. Get Admin role (initial setup)
2. Access `/admin/users` to manage roles
3. View all system events
4. Override permissions as needed

---

## 📞 Support & Help

### For Students

- Check FAQ page for common questions
- Contact organizers through event details
- Use contact form for general inquiries

### For Organizers

- View event analytics in "My Events"
- Manage attendance before certificate generation
- Delete events will cascade delete registrations

### For Admins

- Change user roles carefully
- Monitor system-wide event activity
- Can edit/delete any event

---

## 🎉 Tips & Best Practices

### For Event Creation

- Use clear, descriptive titles
- Add detailed descriptions
- Include high-quality image URLs
- Set accurate date and time
- Choose appropriate category

### For Attendance Management

- Mark attendance during/after event
- Generate certificates only after attendance
- Download certificate list for records

### For System Management (Admins)

- Review user role requests regularly
- Monitor event quality and appropriateness
- Keep user roles organized

---

**Last Updated:** November 10, 2025  
**Version:** 1.0.0  
**Status:** Production Ready ✅
