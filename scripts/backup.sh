#!/bin/bash

# Drake Homes Database Backup Script
# Usage: ./scripts/backup.sh

# Configuration
BACKUP_DIR="./backups"
DATE=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="drakehomes_backup_$DATE.sql"

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Database URL - Replace with your actual Supabase connection string
# Get this from: Supabase Dashboard → Settings → Database → Connection string
DB_URL="postgresql://postgres:[YOUR-PASSWORD]@[YOUR-PROJECT-REF].supabase.co:5432/postgres"

echo "🏠 Starting Drake Homes database backup..."
echo "📅 Date: $(date)"
echo "📂 Backup file: $BACKUP_FILE"

# Create full database backup
pg_dump "$DB_URL" > "$BACKUP_DIR/$BACKUP_FILE"

# Check if backup was successful
if [ $? -eq 0 ]; then
    echo "✅ Backup completed successfully!"
    echo "📁 Backup saved to: $BACKUP_DIR/$BACKUP_FILE"
    
    # Get file size
    FILE_SIZE=$(du -h "$BACKUP_DIR/$BACKUP_FILE" | cut -f1)
    echo "📊 Backup size: $FILE_SIZE"
    
    # Keep only last 10 backups to save space
    cd "$BACKUP_DIR"
    ls -t drakehomes_backup_*.sql | tail -n +11 | xargs -r rm
    echo "🧹 Cleaned up old backups (keeping last 10)"
    
else
    echo "❌ Backup failed!"
    exit 1
fi

echo "🎉 Backup process completed!" 