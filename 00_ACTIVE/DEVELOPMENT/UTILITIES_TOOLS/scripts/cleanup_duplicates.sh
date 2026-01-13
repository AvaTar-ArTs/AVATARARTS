#!/bin/bash
# Cleanup duplicate files in Archives directory
# Focus: Ollama configs and Notion exports

set -e

cd /Users/steven/Documents/Archives

echo "🧹 Starting Archives cleanup..."
echo ""

# Backup directory for safety
BACKUP_DIR="misc-archives/cleanup-backup-$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

# Function to safely remove files (with backup)
safe_remove() {
    local file="$1"
    if [ -f "$file" ]; then
        echo "  Moving to backup: $file"
        mv "$file" "$BACKUP_DIR/"
        return 0
    fi
    return 1
}

# 1. Ollama config duplicates
echo "📦 Processing Ollama config duplicates..."
KEEP_OLLAMA="ollama-setup-kit-Intel-macOS.zip"
OLLAMA_REMOVED=0

for file in ollama*.zip; do
    if [ -f "$file" ]; then
        if [ "$file" != "$KEEP_OLLAMA" ]; then
            if safe_remove "$file"; then
                ((OLLAMA_REMOVED++))
            fi
        else
            echo "  ✅ Keeping: $file (most recent/specific)"
        fi
    fi
done

if [ $OLLAMA_REMOVED -eq 0 ]; then
    echo "  ℹ️  No Ollama duplicates found or already cleaned"
else
    echo "  ✅ Removed $OLLAMA_REMOVED Ollama config duplicates"
fi

# 2. Organize Notion exports
echo ""
echo "📦 Organizing Notion exports..."
NOTION_DIR="misc-archives/notion-exports"
mkdir -p "$NOTION_DIR"
NOTION_COUNT=0

# Find and move Notion export files
for file in *Export*.zip; do
    if [ -f "$file" ]; then
        echo "  Moving: $file"
        mv "$file" "$NOTION_DIR/"
        ((NOTION_COUNT++))
    fi
done

# Also check for UUID-named files that look like Notion exports
# Pattern: UUID-UUID-UUID-UUID_Export-UUID-UUID-UUID-UUID.zip
for file in [0-9a-f][0-9a-f][0-9a-f][0-9a-f][0-9a-f][0-9a-f][0-9a-f][0-9a-f]-*.zip; do
    if [ -f "$file" ] && [[ "$file" =~ Export ]] && [[ "$file" =~ ^[0-9a-f]{8}- ]]; then
        echo "  Moving: $file"
        mv "$file" "$NOTION_DIR/"
        ((NOTION_COUNT++))
    fi
done

if [ $NOTION_COUNT -eq 0 ]; then
    echo "  ℹ️  No Notion export files found"
else
    echo "  ✅ Organized $NOTION_COUNT Notion export files to: $NOTION_DIR"
fi

echo ""
echo "✅ Cleanup complete!"
echo ""
echo "📊 Summary:"
echo "   - Ollama duplicates removed: $OLLAMA_REMOVED"
echo "   - Notion exports organized: $NOTION_COUNT"
echo "   - Backup location: $BACKUP_DIR"
echo ""
echo "⚠️  Review the backup directory before permanently deleting:"
echo "   ls -lh $BACKUP_DIR"
echo ""
echo "💡 To restore from backup:"
echo "   cp $BACKUP_DIR/* ."
