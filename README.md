# EventNest 🎉

A full-stack campus event management system built with React, Node.js, Express, Prisma, and MySQL.

## 🎯 Project Overview

**EventNest** is a comprehensive platform for managing college/university events. It allows students
to discover and register for events, organizers to create and manage events with attendance
tracking, and administrators to oversee the entire system.

## ✨ Features

### For Students

- 🔍 Browse and search events by category and keywords
- 📝 Register for upcoming events
- 🎫 View registered events in personal dashboard
- ❌ Unregister from events (if not yet attended)
- 📜 Access and download certificates for attended events
- 🔐 Secure authentication with JWT
- **Receive instant email confirmations with QR codes**
- **View and manage tickets with QR codes**
- **Download and print tickets**

### For Organizers

- ➕ Create new campus events
- ✏️ Edit existing events
- 🗑️ Delete events (with cascade deletion of registrations and certificates)
- 📊 View all events created with registration counts
- ✅ Manage event attendance
- 🏆 Generate certificates for attendees
- 👥 View registered participants for each event
- **QR code verification page for check-ins**
- **Real-time attendance tracking**
- **Live attendance statistics**

### For Admins

- 👤 Manage user roles (Student, Organizer, Admin)
- 📋 View all events in the system
- 🎯 All organizer capabilities
- 🔒 Full system access

## 🛠️ Tech Stack

### Frontend

- **React 18** - UI library
- **React Router v6** - Client-side routing
- **Zustand** - State management
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Webpack** - Module bundler

### Backend

- **Node.js** - Runtime environment
- **Express** - Web framework
- **Prisma ORM** - Database ORM
- **MySQL** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing
- **Nodemailer** - Email sending

### DevOps

- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration

## 📁 Project Structure

```
YogiKaProject/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma          # Database schema
│   ├── server.js                  # Express server & API routes
│   ├── package.json
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/            # Reusable UI components
│   │   ├── pages/                 # Page components
│   │   ├── layouts/               # Layout components
│   │   ├── store/                 # Zustand stores
│   │   ├── lib/                   # Utilities & API client
│   │   ├── App.jsx
│   │   └── Root.jsx               # Router configuration
│   ├── public/
│   ├── package.json
│   └── Dockerfile
└── docker-compose.yml             # Docker orchestration
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- Docker & Docker Compose (optional, for containerized setup)
- **SMTP email account** (Gmail, SendGrid, etc.)

### Environment Variables

Create a `.env` file in the `backend` directory:

```env
DATABASE_URL="mysql://user:password@localhost:3306/eventnest"
JWT_SECRET="your-super-secret-jwt-key-here"
PORT=4000
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-email-password"
```

For Docker Compose, create a `.env` file in the root directory:

```env
DB_ROOT_PASSWORD=rootpassword
DB_NAME=eventnest
DB_USER=eventnest_user
DB_PASSWORD=eventnest_pass
DATABASE_URL="mysql://eventnest_user:eventnest_pass@db:3306/eventnest"
JWT_SECRET="your-super-secret-jwt-key-here"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-email-password"
```

### Installation & Setup

#### Option 1: Local Development

**Backend Setup:**

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

**Frontend Setup:**

```bash
cd frontend
npm install
npm start
```

The frontend will be available at `http://localhost:3000` and the backend API at
`http://localhost:4000`.

#### Option 2: Docker Compose

```bash
# Build and start all services
docker-compose up --build

# Or run in detached mode
docker-compose up -d
```

Access the application:

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:4000`

### Database Setup

After starting the backend, run migrations:

```bash
cd backend
npx prisma migrate dev --name init
npx prisma generate
```

## 📡 API Endpoints

### Authentication

- `POST /auth/register` - Create new account
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user

### Events

- `GET /events` - List all upcoming events (with search & filter)
- `GET /events/:id` - Get single event details
- `POST /events` - Create new event (Organizer/Admin)
- `PUT /events/:id` - Update event (Organizer/Admin)
- `DELETE /events/:id` - Delete event (Organizer/Admin)

### Registrations
- `POST /events/:id/register` - Register for event (Student)
- `DELETE /events/:id/register` - Unregister from event (Student)
- `GET /users/me/registrations` - Get user's registrations

### Tickets & QR Codes

- `GET /registrations/:id/ticket` - Get ticket details with QR code
- `POST /events/:id/verify-qr` - Verify QR code (Organizer/Admin)
- `POST /events/:id/checkin-qr` - Check in attendee via QR code (Organizer/Admin)

### Attendance

- `GET /events/:id/registrations` - List event registrations (Organizer/Admin)
- `GET /events/:id/attendance-stats` - Get attendance statistics (Organizer/Admin)
- `POST /registrations/:id/attend` - Mark attendance manually (Organizer/Admin)

### Certificates

- `GET /users/me/certificates` - Get user's certificates
- `POST /events/:id/generate-certificates` - Generate certificates (Organizer/Admin)

### Admin

- `GET /admin/users` - List all users (Admin)
- `PUT /admin/users/:id/role` - Update user role (Admin)
- `GET /admin/events` - List all events in system (Admin)

## 🌐 Frontend Routes

### Public Routes

- `/` - Home page
- `/events` - Browse events
- `/events/:id` - Event details
- `/about` - About page
- `/faq` - FAQ
- `/contact` - Contact
- `/login` - Login/Register

### Protected Routes (Students)

- `/dashboard` - User dashboard
- `/dashboard/tickets` - View all tickets with QR codes

### Protected Routes (Organizer/Admin)

- `/admin` - Admin dashboard
- `/admin/events` - Manage my events
- `/admin/events/new` - Create new event
- `/admin/events/:id/edit` - Edit event
- `/admin/events/:id/attendance` - Manage attendance
- `/admin/events/:id/qr-verification` - QR code check-in page

### Protected Routes (Admin Only)

- `/admin/users` - Manage users

## 📧 Email Configuration

The system now sends automatic email confirmations when users register for events. To enable this
feature:

1. See [EMAIL_SETUP.md](EMAIL_SETUP.md) for detailed configuration instructions
2. Update your `.env` file with SMTP credentials
3. Supported email providers:
    - Gmail (recommended for development)
    - Outlook/Office 365
    - SendGrid
    - Mailgun
    - Custom SMTP servers

**Note:** Registration will work even if email sending fails - the system is resilient.

## 🎫 Ticket System

### How It Works

1. **User Registers**: Student registers for an event
2. **Ticket Generated**: System creates a unique ticket with QR code
3. **Email Sent**: Confirmation email sent with QR code and ticket details
4. **View Tickets**: User can view/download tickets from dashboard
5. **Event Day**: Organizer scans QR code to check in attendees

### QR Code Format

Each QR code contains JSON data:

```json
{
  "ticketCode": "unique-uuid",
  "eventId": "event-uuid",
  "userId": "user-uuid",
  "registrationId": "registration-uuid"
}
```

### Ticket Features

- Unique ticket code per registration
- Base64-encoded QR code image
- Downloadable as PNG
- Printable ticket format
- Check-in timestamp tracking

## 🎨 User Roles

1. **STUDENT** (Default)
    - Browse and search events
    - Register/unregister for events
   - **Receive instant email confirmations with QR codes**
   - **View and manage tickets with QR codes**
   - Access earned certificates

2. **ORGANIZER**
    - All Student capabilities
    - Create, edit, and delete events
    - Manage event attendance
    - Generate certificates
   - **QR code verification page for check-ins**
   - **Real-time attendance tracking**

3. **ADMIN**
    - All Organizer capabilities
    - Manage user roles
    - View all events in system
   - Override permissions

## 🔒 Security Features

- Password hashing with bcryptjs (10 salt rounds)
- JWT-based authentication with 7-day expiration
- Role-based access control (RBAC)
- Authorization checks for event ownership
- Protected API routes with middleware
- SQL injection prevention with Prisma ORM

## 🎓 Key Implementation Details

### Authorization System

All event management operations (edit, delete, attendance, certificates) include ownership
verification:

- Organizers can only manage their own events
- Admins have full access to all events
- Students can only register/unregister for events

### Database Relations

- One-to-Many: User → Events (organizer)
- Many-to-Many: Users ↔ Events (through Registrations)
- One-to-Many: Event → Certificates
- Cascade deletion for event removal

### Frontend State Management

- Zustand for global auth state
- Local component state for page-specific data
- Token persistence in localStorage
- Automatic token refresh on app load

## 🤝 Contributing

This project was created by:

- **Arshbir Singh** - Project Lead & Content
- **Abhay** - Functionality & Interactivity
- **Yogesh** - Design & Styling
- **Yuvraj** - Page Structure & Testing

## 📝 License

This project is part of a university assignment for Chitkara University, Punjab.

## 🐛 Known Issues & Future Enhancements

- Certificate PDF generation (currently returns mock URLs)
- Email notifications for event updates
- Event capacity limits
- Real-time updates with WebSockets
- Image upload functionality
- Advanced search filters
- Event categories management
- User profile editing

## 📞 Support

For issues or questions, please contact the development team through the project repository.

---

Built with ❤️ by the EventNest Team at Chitkara University
