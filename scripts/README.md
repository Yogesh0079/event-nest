# EventNest Utility Scripts

Collection of utility scripts for managing the EventNest application.

## 📋 Prerequisites

- Docker and Docker Compose installed
- Bash shell (Linux, macOS, Git Bash on Windows)
- Execute permissions on scripts

## 🚀 Make Scripts Executable

Before first use:

```bash
chmod +x scripts/*.sh
chmod +x deploy.sh
```

## 📝 Available Scripts

### 🎬 start.sh

**Purpose**: Start the EventNest application

**Usage**:

```bash
./scripts/start.sh
```

**What it does**:

- Starts all Docker containers in detached mode
- Shows application URLs
- Provides next steps

**When to use**:

- After stopping the application
- After system restart
- Initial startup

---

### 🛑 stop.sh

**Purpose**: Stop the EventNest application

**Usage**:

```bash
./scripts/stop.sh
```

**What it does**:

- Stops all running containers
- Preserves data in volumes
- Does NOT remove containers

**When to use**:

- When done working
- Before system maintenance
- To free up resources

---

### 🔄 restart.sh

**Purpose**: Restart the EventNest application

**Usage**:

```bash
./scripts/restart.sh
```

**What it does**:

- Restarts all containers
- Maintains data and configuration
- Useful for applying config changes

**When to use**:

- After changing environment variables
- After minor configuration updates
- To refresh connections

---

### 📋 logs.sh

**Purpose**: View application logs in real-time

**Usage**:

```bash
./scripts/logs.sh
```

**What it does**:

- Shows last 100 lines of logs
- Follows logs in real-time
- Shows logs from all services

**Exit**: Press `Ctrl+C`

**When to use**:

- Debugging issues
- Monitoring application
- Checking for errors

**Tip**: To view logs for specific service:

```bash
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

---

### ✅ status.sh

**Purpose**: Check application health and status

**Usage**:

```bash
./scripts/status.sh
```

**What it does**:

- Checks Docker installation
- Shows container status
- Tests service health
- Displays disk usage

**When to use**:

- Before starting work
- Troubleshooting issues
- Verifying deployment

---

### 💾 backup-db.sh

**Purpose**: Create database backup

**Usage**:

```bash
./scripts/backup-db.sh
```

**What it does**:

- Creates SQL dump of database
- Compresses backup with gzip
- Saves to `./backups/` directory
- Shows backup size and location

**Output**: `backups/eventnest_backup_YYYYMMDD_HHMMSS.sql.gz`

**When to use**:

- Before major updates
- Regular scheduled backups
- Before database migrations
- Before testing dangerous operations

**Automated backups**:

```bash
# Add to crontab for daily backups at 2 AM
crontab -e
# Add: 0 2 * * * /path/to/project/scripts/backup-db.sh
```

---

## 🎯 Common Workflows

### Starting Fresh

```bash
./scripts/start.sh
./scripts/status.sh
./scripts/logs.sh
```

### Daily Development

```bash
# Morning
./scripts/start.sh

# During work
./scripts/logs.sh  # Check logs when needed
./scripts/status.sh  # Verify everything running

# End of day
./scripts/stop.sh
```

### Troubleshooting

```bash
# Check status
./scripts/status.sh

# View logs
./scripts/logs.sh

# Try restart
./scripts/restart.sh

# If still issues, check specific service
docker-compose logs backend
```

### Before Updates

```bash
# 1. Backup database
./scripts/backup-db.sh

# 2. Stop application
./scripts/stop.sh

# 3. Update code
git pull

# 4. Rebuild and start
docker-compose build
./scripts/start.sh

# 5. Verify
./scripts/status.sh
```

### Weekly Maintenance

```bash
# Monday morning
./scripts/backup-db.sh  # Weekly backup
./scripts/status.sh      # Health check
./scripts/restart.sh     # Fresh start
```

## 🔧 Script Customization

### Modify Backup Directory

Edit `scripts/backup-db.sh`:

```bash
BACKUP_DIR="./backups"  # Change to your preferred location
```

### Change Log Lines

Edit `scripts/logs.sh`:

```bash
docker-compose logs -f --tail=100  # Change 100 to desired number
```

### Add Custom Scripts

Create new script:

```bash
nano scripts/my-custom-script.sh
chmod +x scripts/my-custom-script.sh
```

## 🐛 Troubleshooting Scripts

### Script Won't Run

**Permission denied**:

```bash
chmod +x scripts/*.sh
```

**Command not found**:

```bash
# Use full path
./scripts/start.sh

# Or from scripts directory
cd scripts
./start.sh
```

### Docker Command Errors

**docker-compose vs docker compose**:
Scripts automatically detect which version you have.

**No such service**:
Ensure you're in the project root directory.

### Backup Script Fails

**No space left**:

```bash
df -h  # Check disk space
rm old-backups/*  # Remove old backups
```

**Permission denied**:

```bash
mkdir -p backups
chmod 755 backups
```

## 💡 Tips & Best Practices

### Regular Backups

- Run backups before major changes
- Keep at least 7 days of backups
- Test restore process periodically

### Log Management

- Don't leave logs running overnight (uses resources)
- Clear old logs: `docker system prune`
- Use `--tail` to limit log output

### Status Checks

- Run status check after any changes
- Monitor disk usage regularly
- Check health before deployment

### Performance

- Stop containers when not in use
- Clean up old images: `docker system prune -a`
- Monitor resource usage: `docker stats`

## 📞 Quick Reference

```bash
# Start application
./scripts/start.sh

# Stop application
./scripts/stop.sh

# Restart application
./scripts/restart.sh

# View logs
./scripts/logs.sh

# Check status
./scripts/status.sh

# Backup database
./scripts/backup-db.sh

# Deploy/Update
./deploy.sh
```

## 🔗 Related Documentation

- [DEPLOYMENT.md](../DEPLOYMENT.md) - Full deployment guide
- [README.md](../README.md) - Project overview
- [docker-compose.yml](../docker-compose.yml) - Docker configuration

---

**Last Updated**: November 2025
