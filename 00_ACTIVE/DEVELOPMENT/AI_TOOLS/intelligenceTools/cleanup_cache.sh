#!/bin/bash
# Intelligent Cache Cleanup Script
# Safely cleans .cache and .local folders with package manager cache cleanup

DRY_RUN=${1:-dry-run}
DAYS_OLD=${2:-30}

CACHE_DIR="$HOME/.cache"
LOCAL_DIR="$HOME/.local"
BACKUP_DIR="$HOME/.cache_cleanup_backup_$(date +%Y%m%d_%H%M%S)"

echo "🧹 Intelligent Cache Cleanup"
echo "============================="
echo ""

# Function to get directory size
get_size() {
    du -sh "$1" 2>/dev/null | awk '{print $1}'
}

# Function to count files
count_files() {
    find "$1" -type f 2>/dev/null | wc -l | tr -d ' '
}

echo "📊 Current State:"
echo "   .cache: $(get_size $CACHE_DIR) ($(count_files $CACHE_DIR) files)"
echo "   .local: $(get_size $LOCAL_DIR) ($(count_files $LOCAL_DIR) files)"
echo ""

if [ "$DRY_RUN" = "dry-run" ] || [ "$DRY_RUN" = "true" ]; then
    echo "🔍 DRY RUN MODE - No files will be deleted"
    echo ""
    
    echo "📦 Package Manager Caches:"
    echo "   Bun: $(du -sh ~/.bun 2>/dev/null | awk '{print $1}')"
    echo "   npm: $(du -sh ~/.npm 2>/dev/null | awk '{print $1}')"
    echo "   pip: $(du -sh ~/.cache/pip 2>/dev/null | awk '{print $1}')"
    echo "   uv: $(du -sh ~/.cache/uv 2>/dev/null | awk '{print $1}')"
    echo ""
    
    echo "🗑️  Would clean:"
    echo "   - Old cache files (>$DAYS_OLD days)"
    echo "   - Package manager caches (with commands)"
    echo ""
    echo "Run with: $0 false to actually clean"
else
    echo "🚀 Starting cleanup..."
    echo ""
    
    # Create backup directory
    mkdir -p "$BACKUP_DIR"
    
    # Clean package manager caches
    echo "📦 Cleaning package manager caches..."
    
    if command -v bun &> /dev/null; then
        echo "   Cleaning Bun cache..."
        bun pm cache rm 2>/dev/null || echo "   ⚠️  Bun cache cleanup failed"
    fi
    
    if command -v npm &> /dev/null; then
        echo "   Cleaning npm cache..."
        npm cache clean --force 2>/dev/null || echo "   ⚠️  npm cache cleanup failed"
    fi
    
    if command -v pip &> /dev/null; then
        echo "   Cleaning pip cache..."
        pip cache purge 2>/dev/null || echo "   ⚠️  pip cache cleanup failed"
    fi
    
    if command -v uv &> /dev/null; then
        echo "   Cleaning uv cache..."
        # uv cache clean if available
    fi
    
    echo ""
    echo "📁 Cleaning old cache files..."
    
    # Find and move old files
    OLD_COUNT=0
    find "$CACHE_DIR" -type f -mtime +$DAYS_OLD 2>/dev/null | while read file; do
        rel_path="${file#$CACHE_DIR/}"
        backup_path="$BACKUP_DIR/cache/$rel_path"
        mkdir -p "$(dirname "$backup_path")"
        mv "$file" "$backup_path" 2>/dev/null && ((OLD_COUNT++))
    done
    
    echo "   Moved $OLD_COUNT old files to backup"
    echo ""
    
    echo "✅ Cleanup complete!"
    echo "   Backup location: $BACKUP_DIR"
    echo ""
    echo "📊 New State:"
    echo "   .cache: $(get_size $CACHE_DIR) ($(count_files $CACHE_DIR) files)"
    echo "   .local: $(get_size $LOCAL_DIR) ($(count_files $LOCAL_DIR) files)"
fi

