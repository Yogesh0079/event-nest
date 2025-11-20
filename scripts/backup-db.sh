#!/bin/bash

# Backup EventNest Database

set -e

# Configuration
BACKUP_DIR="./backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="eventnest_backup_${TIMESTAMP}.sql"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}💾 Creating database backup...${NC}"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Get database credentials from .env or use defaults
DB_NAME="${DB_NAME:-eventnest_db}"
DB_USER="${DB_USER:-eventnest_user}"
DB_PASSWORD="${DB_PASSWORD:-eventnest_pass}"

# Create backup
if command -v docker-compose &> /dev/null; then
    docker-compose exec -T db mysqldump -u"$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" > "$BACKUP_DIR/$BACKUP_FILE"
else
    docker compose exec -T db mysqldump -u"$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" > "$BACKUP_DIR/$BACKUP_FILE"
fi

# Compress backup
gzip "$BACKUP_DIR/$BACKUP_FILE"

echo -e "${GREEN}✅ Backup created: $BACKUP_DIR/${BACKUP_FILE}.gz${NC}"
echo ""
echo "Backup size: $(du -h "$BACKUP_DIR/${BACKUP_FILE}.gz" | cut -f1)"
echo ""
echo "To restore this backup, run:"
echo "  ./scripts/restore-db.sh $BACKUP_DIR/${BACKUP_FILE}.gz"
