#!/bin/bash
# Daily backup of all generated content
set -euo pipefail

BACKUP_DIR="/Users/steven/ai-sites/backups/$(date +%Y%m%d)"
mkdir -p "$BACKUP_DIR"

# Backup content outputs
rsync -a /Users/steven/ai-sites/content-management/retention-hub/recipes/output/ "$BACKUP_DIR/recipes/" 2>/dev/null || true
rsync -a /Users/steven/ai-sites/content-management/retention-hub/daily-art/ "$BACKUP_DIR/daily-art/" 2>/dev/null || true
rsync -a /Users/steven/ai-sites/content-management/retention-hub/weekly-music/ "$BACKUP_DIR/weekly-music/" 2>/dev/null || true

# Backup reports
rsync -a /Users/steven/ai-sites/reports/ "$BACKUP_DIR/reports/" 2>/dev/null || true

# Backup logs
rsync -a /Users/steven/ai-sites/automation/logs/ "$BACKUP_DIR/logs/" 2>/dev/null || true

# Cleanup old backups (keep 30 days)
find /Users/steven/ai-sites/backups/ -type d -mtime +30 -exec rm -rf {} \; 2>/dev/null || true

echo "✅ Backup complete: $BACKUP_DIR"
du -sh "$BACKUP_DIR"
