#!/bin/bash
# Rollback script for consolidation 20260101_094117

BACKUP_FILE="consolidation_backup_20260101_094117.tar.gz"

if [ ! -f "$BACKUP_FILE" ]; then
  echo "Error: Backup file not found!"
  exit 1
fi

echo "🔄 Rolling back consolidation..."
tar -xzf "$BACKUP_FILE"
rsync -av consolidation_backup_20260101_094117/ /
rm -rf consolidation_backup_20260101_094117
echo "✓ Rollback complete!"
