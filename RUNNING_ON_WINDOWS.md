# Running EventNest on Windows - Complete Guide

## ✅ Your Application is Now Running!

**Congratulations!** Your EventNest application is successfully deployed with Docker.

### 🌐 Access Your Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000
- **Database**: localhost:3306

---

## 🎯 Quick Commands

All commands below are for PowerShell:

### Start the Application

```powershell
docker-compose up -d
```

### Stop the Application

```powershell
docker-compose down
```

### View Logs

```powershell
# All services
docker-compose logs -f

# Backend only
docker-compose logs -f backend

# Frontend only
docker-compose logs -f frontend

# Database only
docker-compose logs -f db
```

### Check Status

```powershell
docker-compose ps
```

### Restart Services

```powershell
# Restart all
docker-compose restart

# Restart backend only
docker-compose restart backend

# Restart frontend only
docker-compose restart frontend
```

### Rebuild After Code Changes

```powershell
# Rebuild all
docker-compose build

# Rebuild backend only
docker-compose build backend

# Rebuild and restart
docker-compose up -d --build
```

### Clean Everything (Fresh Start)

```powershell
# Stop and remove containers, networks, volumes
docker-compose down -v

# Rebuild from scratch
docker-compose build --no-cache

# Start fresh
docker-compose up -d
```

---

## 🎓 What We Fixed

### Issue: Prisma OpenSSL Compatibility

**Problem**: Alpine Linux had OpenSSL compatibility issues with Prisma
**Solution**: Switched to Debian-based Node.js image (`node:18-slim`)

### Changes Made:

1. ✅ Updated `backend/Dockerfile` to use `node:18-slim` instead of `node:18-alpine`
2. ✅ Installed OpenSSL and ca-certificates in all build stages
3. ✅ Fixed entrypoint script to properly wait for database
4. ✅ Added proper Prisma schema copying between build stages

---

## 🚀 Features Available

### For Students:

- ✅ Register and login
- ✅ Browse and register for events
- ✅ View tickets with QR codes
- ✅ Download ticket PDFs
- ✅ Receive email confirmations
- ✅ View certificates

### For Organizers:

- ✅ Create and manage events
- ✅ QR code verification for check-ins
- ✅ Generate certificates for attendees
- ✅ View attendance statistics
- ✅ Manual attendance marking

---

## 📊 Container Overview

| Container | Purpose | Port | Status Check |
|-----------|---------|------|--------------|
| `eventnest_frontend` | React UI | 3000 | http://localhost:3000 |
| `eventnest_backend` | Node.js API | 4000 | http://localhost:4000 |
| `eventnest_db` | MySQL Database | 3306 | Internal only |

---

## 🔧 Troubleshooting

### Frontend Not Loading

```powershell
# Check frontend logs
docker-compose logs frontend

# Restart frontend
docker-compose restart frontend

# If still issues, rebuild
docker-compose build frontend
docker-compose up -d frontend
```

### Backend Errors

```powershell
# Check backend logs
docker-compose logs backend --tail=50

# Check database connection
docker-compose exec db mysql -u eventnest_user -peventnest_pass eventnest_db -e "SELECT 1;"

# Restart backend
docker-compose restart backend
```

### Database Issues

```powershell
# Check database logs
docker-compose logs db

# Access MySQL CLI
docker-compose exec db mysql -u eventnest_user -peventnest_pass eventnest_db

# Reset database (WARNING: Deletes all data)
docker-compose down -v
docker-compose up -d
```

### Port Already in Use

```powershell
# Find what's using port 3000
netstat -ano | findstr :3000

# Find what's using port 4000
netstat -ano | findstr :4000

# Kill the process (replace PID with actual number)
taskkill /PID <PID> /F
```

---

## 📧 Email Configuration

To enable email notifications for tickets and certificates:

1. Open `backend/.env`
2. Update these values:

```env
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="587"
EMAIL_USER="your-email@gmail.com"
EMAIL_PASSWORD="your-app-password"
EMAIL_FROM="EventNest <your-email@gmail.com>"
```

3. For Gmail, create an App Password:
    - Go to Google Account settings
    - Security → 2-Step Verification → App passwords
    - Create password for "Mail"
    - Use that password in `EMAIL_PASSWORD`

4. Restart backend:

```powershell
docker-compose restart backend
```

---

## 🗃️ Database Backup

### Manual Backup

```powershell
# Create backup
docker-compose exec db mysqldump -u eventnest_user -peventnest_pass eventnest_db > backup.sql

# Restore backup
Get-Content backup.sql | docker-compose exec -T db mysql -u eventnest_user -peventnest_pass eventnest_db
```

---

## 🎨 Customization

### Update Frontend Code

1. Edit files in `frontend/src/`
2. Rebuild and restart:

```powershell
docker-compose build frontend
docker-compose up -d frontend
```

### Update Backend Code

1. Edit files in `backend/`
2. Rebuild and restart:

```powershell
docker-compose build backend
docker-compose up -d backend
```

### Update Database Schema

1. Edit `backend/prisma/schema.prisma`
2. Push changes:

```powershell
docker-compose exec backend npx prisma db push
```

---

## 📝 Development Tips

### View Container Internals

```powershell
# Access backend container shell
docker-compose exec backend sh

# Access database
docker-compose exec db mysql -u eventnest_user -peventnest_pass eventnest_db

# List files in backend
docker-compose exec backend ls -la

# Check environment variables
docker-compose exec backend env
```

### Monitor Resource Usage

```powershell
docker stats
```

### Clean Docker System

```powershell
# Remove unused containers, networks, images
docker system prune -a

# Remove all volumes (WARNING: Deletes all data)
docker system prune -a --volumes
```

---

## 🎉 Testing the Application

### 1. Create Student Account

1. Open http://localhost:3000
2. Click "Register"
3. Fill in details (use STUDENT role)
4. Login

### 2. Create Organizer Account

1. Register another account with ORGANIZER role
2. Login as organizer
3. Create a new event

### 3. Test Registration Flow

1. Login as student
2. Register for the event
3. Check "My Tickets" page
4. You should see QR code

### 4. Test Check-in

1. Login as organizer
2. Go to event's attendance page
3. Click "QR Check-in"
4. Scan or enter the ticket code

### 5. Test Certificates

1. Mark attendance for the student
2. Click "Generate Certificates"
3. Student should receive email with certificate
4. Check student's dashboard for certificate download

---

## 🔒 Security Notes

- ✅ JWT secret is randomly generated in `.env`
- ✅ Database credentials are in `.env` (not hardcoded)
- ✅ Containers run as non-root users
- ✅ Internal Docker networking isolates database
- ⚠️ For production: Change all passwords in `.env`
- ⚠️ For production: Use HTTPS with reverse proxy (nginx/traefik)

---

## 🌍 Deploying to Cloud

### Deploy to DigitalOcean/AWS/Azure

1. Install Docker on your server
2. Copy your project folder
3. Update `.env` with production values
4. Run:

```bash
docker-compose up -d
```

### Using Docker Swarm/Kubernetes

The `docker-compose.yml` is compatible with Docker Swarm. For Kubernetes, you'll need to convert it
to K8s manifests.

---

## 📚 Additional Resources

- **DEPLOYMENT.md** - Comprehensive deployment guide
- **CERTIFICATES_GUIDE.md** - Certificate system details
- **EMAIL_SETUP.md** - Email configuration help
- **README.md** - Project overview and features

---

## 🆘 Getting Help

If you encounter issues:

1. **Check logs first**: `docker-compose logs`
2. **Verify all services are running**: `docker-compose ps`
3. **Restart services**: `docker-compose restart`
4. **Fresh start**: `docker-compose down -v && docker-compose up -d`

---

## ✅ Checklist

- [x] Docker Desktop installed and running
- [x] Containers built successfully
- [x] All services running (db, backend, frontend)
- [x] Frontend accessible at http://localhost:3000
- [x] Backend accessible at http://localhost:4000
- [x] Database initialized with Prisma schema
- [x] No OpenSSL errors in logs
- [ ] Email configured (optional but recommended)
- [ ] Test account created
- [ ] Test event created
- [ ] Test registration completed
- [ ] QR code check-in tested
- [ ] Certificate generation tested

---

## 🎊 Success!

Your EventNest application is now fully operational on Windows with Docker!

**Next Steps:**

1. Configure email for full functionality
2. Create test accounts and events
3. Customize the UI to match your brand
4. Deploy to production when ready

**Enjoy managing campus events!** 🚀
