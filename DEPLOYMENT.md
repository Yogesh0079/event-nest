# EventNest Deployment Guide

Complete guide for deploying EventNest using Docker and Docker Compose.

## 📋 Prerequisites

### Required Software

- **Docker**: Version 20.10 or higher
- **Docker Compose**: Version 2.0 or higher
- **Git**: For cloning the repository

### System Requirements

- **CPU**: 2+ cores recommended
- **RAM**: 4GB minimum, 8GB recommended
- **Disk**: 10GB free space minimum
- **OS**: Linux, macOS, or Windows with WSL2

## 🚀 Quick Start

### 1. Clone Repository

```bash
git clone <repository-url>
cd YogiKaProject
```

### 2. Configure Environment

```bash
# Copy example environment file
cp .env.example .env

# Edit .env with your configuration
nano .env  # or use your preferred editor
```

**Important**: Update these values in `.env`:

- `JWT_SECRET` - Generate with:
  `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- `EMAIL_HOST`, `EMAIL_USER`, `EMAIL_PASSWORD` - Your email SMTP settings
- `EMAIL_FROM` - Your sender email address

### 3. Deploy with One Command

```bash
chmod +x deploy.sh
./deploy.sh
```

That's it! The application will be available at:

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:4000
- **Database**: localhost:3306

## 📝 Manual Deployment

If you prefer step-by-step deployment:

### Step 1: Build Docker Images

```bash
docker-compose build
```

### Step 2: Start Services

```bash
docker-compose up -d
```

### Step 3: Check Status

```bash
docker-compose ps
```

### Step 4: View Logs

```bash
docker-compose logs -f
```

## 🛠️ Utility Scripts

All scripts are located in the `scripts/` directory:

### Start Application

```bash
./scripts/start.sh
```

### Stop Application

```bash
./scripts/stop.sh
```

### Restart Application

```bash
./scripts/restart.sh
```

### View Logs

```bash
./scripts/logs.sh
```

### Check Status

```bash
./scripts/status.sh
```

### Backup Database

```bash
./scripts/backup-db.sh
```

### Make Scripts Executable

```bash
chmod +x scripts/*.sh deploy.sh
```

## 🔧 Configuration

### Environment Variables

The application uses environment variables for configuration. All variables are defined in the
`.env` file.

#### Database Configuration

```env
DATABASE_URL="mysql://eventnest_user:eventnest_pass@db:3306/eventnest_db"
```

#### JWT Secret

```env
JWT_SECRET="your-super-secret-jwt-key"
```

Generate a secure secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### Email Configuration

```env
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="587"
EMAIL_USER="your-email@gmail.com"
EMAIL_PASSWORD="your-app-password"
EMAIL_FROM="EventNest <your-email@gmail.com>"
```

See [EMAIL_SETUP.md](EMAIL_SETUP.md) for detailed email configuration.

#### Application URLs

```env
FRONTEND_URL="http://localhost:3000"
REACT_APP_API_URL="http://localhost:4000"
```

## 🐳 Docker Services

### Database (MySQL 8.0)

- **Container**: `eventnest_db`
- **Port**: 3306
- **Volume**: `mysql_data`
- **Healthcheck**: mysqladmin ping

### Backend (Node.js + Express)

- **Container**: `eventnest_backend`
- **Port**: 4000
- **Volumes**:
    - `./backend/certificates` - PDF certificates storage
    - `./backend/prisma` - Database schema
- **Depends on**: Database
- **Healthcheck**: HTTP GET /

### Frontend (React + Nginx)

- **Container**: `eventnest_frontend`
- **Port**: 3000 (mapped to 80 in container)
- **Depends on**: Backend
- **Healthcheck**: HTTP GET /

## 📦 Volumes

### mysql_data

- **Purpose**: Persistent MySQL database storage
- **Location**: Docker volume
- **Backup**: Use `./scripts/backup-db.sh`

### Backend Certificates

- **Purpose**: Generated PDF certificates
- **Location**: `./backend/certificates`
- **Type**: Bind mount
- **Backup**: Copy directory or use git (not recommended for production)

## 🔍 Monitoring & Logs

### View All Logs

```bash
docker-compose logs
```

### View Specific Service

```bash
docker-compose logs backend
docker-compose logs frontend
docker-compose logs db
```

### Follow Logs in Real-time

```bash
docker-compose logs -f
```

### View Last N Lines

```bash
docker-compose logs --tail=100
```

## 🚨 Troubleshooting

### Containers Won't Start

**Check Docker**:

```bash
docker --version
docker-compose --version
```

**Check logs**:

```bash
docker-compose logs
```

**Restart services**:

```bash
docker-compose restart
```

### Database Connection Issues

**Check database is running**:

```bash
docker-compose ps db
```

**Check database logs**:

```bash
docker-compose logs db
```

**Verify database credentials** in `.env` file

### Port Already in Use

**Check what's using the port**:

```bash
# Linux/Mac
sudo lsof -i :3000
sudo lsof -i :4000
sudo lsof -i :3306

# Windows
netstat -ano | findstr :3000
```

**Change ports** in `docker-compose.yml`:

```yaml
ports:
  - "8080:80"  # Frontend
  - "5000:4000"  # Backend
  - "3307:3306"  # Database
```

### Backend Not Connecting to Database

**Wait for database to be ready**:
The backend has a healthcheck that waits for the database. Give it 30-60 seconds to start.

**Check network**:

```bash
docker network ls
docker network inspect eventnest_network
```

### Frontend Not Loading

**Check nginx configuration**:

```bash
docker-compose exec frontend cat /etc/nginx/conf.d/default.conf
```

**Check build files**:

```bash
docker-compose exec frontend ls -la /usr/share/nginx/html
```

**Rebuild frontend**:

```bash
docker-compose build --no-cache frontend
docker-compose up -d frontend
```

## 🔐 Security Considerations

### For Production

1. **Change Default Credentials**
    - Update `JWT_SECRET` with strong random value
    - Change database passwords
    - Use environment-specific credentials

2. **Use HTTPS**
    - Add SSL certificate
    - Configure nginx for HTTPS
    - Redirect HTTP to HTTPS

3. **Secure Email**
    - Use app-specific passwords
    - Consider email service (SendGrid, Mailgun)
    - Don't expose credentials

4. **Database Security**
    - Don't expose port 3306 publicly
    - Use strong passwords
    - Regular backups
    - Enable MySQL audit logging

5. **Container Security**
    - Run containers as non-root user (already implemented)
    - Keep images updated
    - Scan for vulnerabilities
    - Use Docker secrets for sensitive data

6. **Network Security**
    - Use internal Docker network
    - Configure firewall rules
    - Rate limiting
    - CORS configuration

## 📊 Database Management

### Access Database Shell

```bash
docker-compose exec db mysql -u eventnest_user -p eventnest_db
```

### Run Prisma Migrations

```bash
docker-compose exec backend npx prisma migrate deploy
```

### Generate Prisma Client

```bash
docker-compose exec backend npx prisma generate
```

### Prisma Studio (Database GUI)

```bash
docker-compose exec backend npx prisma studio
```

Then visit: http://localhost:5555

### Database Backup

```bash
./scripts/backup-db.sh
```

### Database Restore

```bash
# Decompress backup
gunzip backups/eventnest_backup_*.sql.gz

# Restore
docker-compose exec -T db mysql -u eventnest_user -p eventnest_db < backups/eventnest_backup_*.sql
```

## 🔄 Updates & Maintenance

### Update Application Code

```bash
# Pull latest code
git pull origin main

# Rebuild and restart
docker-compose down
docker-compose build
docker-compose up -d
```

### Update Dependencies

```bash
# Backend
cd backend
npm update
cd ..

# Frontend
cd frontend
npm update
cd ..

# Rebuild
docker-compose build
```

### Clean Up

```bash
# Remove stopped containers
docker-compose down

# Remove images
docker-compose down --rmi all

# Remove volumes (⚠️ Deletes data!)
docker-compose down -v

# Clean system
docker system prune -a
```

## 🌐 Production Deployment

### Using Cloud Providers

#### AWS ECS

1. Push images to ECR
2. Create ECS task definitions
3. Configure RDS for MySQL
4. Set up load balancer
5. Configure environment variables

#### Google Cloud Run

1. Build images
2. Push to Google Container Registry
3. Deploy to Cloud Run
4. Use Cloud SQL for MySQL
5. Configure secrets

#### DigitalOcean App Platform

1. Connect GitHub repository
2. Configure build settings
3. Use DigitalOcean Managed Database
4. Set environment variables
5. Deploy

### Kubernetes Deployment

```bash
# Create namespace
kubectl create namespace eventnest

# Apply configurations
kubectl apply -f k8s/

# Check status
kubectl get pods -n eventnest
```

## 📈 Scaling

### Horizontal Scaling

```yaml
# docker-compose.yml
services:
  backend:
    deploy:
      replicas: 3
  frontend:
    deploy:
      replicas: 2
```

### Load Balancing

Add nginx or traefik as reverse proxy:

```yaml
services:
  nginx-proxy:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx-proxy.conf:/etc/nginx/nginx.conf
```

## 💾 Backup Strategy

### Automated Backups

Create cron job:

```bash
# Edit crontab
crontab -e

# Add daily backup at 2 AM
0 2 * * * /path/to/project/scripts/backup-db.sh
```

### Backup Verification

```bash
# List backups
ls -lh backups/

# Test restore in separate container
docker run --name test-db -e MYSQL_ROOT_PASSWORD=test -d mysql:8.0
docker exec -i test-db mysql -uroot -ptest < backups/eventnest_backup_*.sql
```

## 📞 Support

### Logs Location

- **Docker logs**: `docker-compose logs`
- **Backend logs**: Container stdout
- **Frontend logs**: nginx access/error logs
- **Database logs**: MySQL error log

### Common Commands

```bash
# Full status check
./scripts/status.sh

# Restart single service
docker-compose restart backend

# View resource usage
docker stats

# Clean certificates directory
rm -rf backend/certificates/*.pdf

# Reset database (⚠️ Deletes all data!)
docker-compose down -v
docker-compose up -d
```

## ✅ Post-Deployment Checklist

- [ ] .env file configured with secure values
- [ ] JWT_SECRET is strong and unique
- [ ] Email SMTP configured and tested
- [ ] Database is accessible and migrated
- [ ] Frontend loads at http://localhost:3000
- [ ] Backend API responds at http://localhost:4000
- [ ] Can register new user
- [ ] Can create event (as organizer)
- [ ] Can register for event (as student)
- [ ] Email notifications working
- [ ] Certificates generating
- [ ] QR verification working
- [ ] Database backup script tested
- [ ] Logs are accessible
- [ ] Monitoring in place (if production)

---

**Version**: 2.1.0  
**Last Updated**: November 2025  
**Status**: ✅ Production Ready
