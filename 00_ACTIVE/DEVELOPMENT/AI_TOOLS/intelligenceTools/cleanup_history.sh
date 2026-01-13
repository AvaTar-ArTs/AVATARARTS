#!/bin/bash
# Cleanup Old History Files
# Removes history files older than specified days (default: 30)

DAYS=${1:-30}
DRY_RUN=${2:-false}

HISTORY_DIR="$HOME/.history"
BACKUP_DIR="$HOME/.history/.backups"

echo "🧹 History Cleanup Script"
echo "=========================="
echo "Target: $HISTORY_DIR"
echo "Age threshold: $DAYS days"
echo ""

if [ ! -d "$HISTORY_DIR" ]; then
    echo "❌ History directory not found: $HISTORY_DIR"
    exit 1
fi

# Count files before
TOTAL_FILES=$(find "$HISTORY_DIR" -type f \( -name "*.py" -o -name "*.md" -o -name "*.sh" \) ! -path "*/backups/*" | wc -l | tr -d ' ')
OLD_FILES=$(find "$HISTORY_DIR" -type f \( -name "*.py" -o -name "*.md" -o -name "*.sh" \) ! -path "*/backups/*" -mtime +$DAYS | wc -l | tr -d ' ')

echo "📊 Statistics:"
echo "   Total history files: $TOTAL_FILES"
echo "   Files older than $DAYS days: $OLD_FILES"
echo ""

if [ "$OLD_FILES" -eq 0 ]; then
    echo "✅ No old files to clean"
    exit 0
fi

if [ "$DRY_RUN" = "true" ] || [ "$DRY_RUN" = "dry-run" ]; then
    echo "🔍 DRY RUN - Files that would be deleted:"
    find "$HISTORY_DIR" -type f \( -name "*.py" -o -name "*.md" -o -name "*.sh" \) ! -path "*/backups/*" -mtime +$DAYS -ls
    echo ""
    echo "Run with: $0 $DAYS false"
else
    # Create backup directory
    mkdir -p "$BACKUP_DIR"
    
    # Move old files to backup
    echo "📦 Moving old files to backup..."
    find "$HISTORY_DIR" -type f \( -name "*.py" -o -name "*.md" -o -name "*.sh" \) ! -path "*/backups/*" -mtime +$DAYS -exec mv {} "$BACKUP_DIR/" \;
    
    # Count after
    REMAINING=$(find "$HISTORY_DIR" -type f \( -name "*.py" -o -name "*.md" -o -name "*.sh" \) ! -path "*/backups/*" | wc -l | tr -d ' ')
    
    echo "✅ Cleanup complete!"
    echo "   Files moved to backup: $OLD_FILES"
    echo "   Remaining files: $REMAINING"
    echo "   Backup location: $BACKUP_DIR"
fi

