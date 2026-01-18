#!/bin/bash
# Quick stats dashboard - today's numbers
set -euo pipefail

echo "📊 Steven's Creative Empire - Daily Stats"
echo "=========================================="
echo "Date: $(date '+%Y-%m-%d %H:%M')"
echo ""

# Files generated today
echo "📁 Content Generated Today:"
TODAY=$(date +%Y%m%d)
RECIPES=$(find /Users/steven/ai-sites/content-management/retention-hub/recipes/output -type f -name "*$TODAY*" 2>/dev/null | wc -l | xargs)
ART=$(find /Users/steven/ai-sites/content-management/retention-hub/daily-art -type f -name "*$TODAY*" 2>/dev/null | wc -l | xargs)
MUSIC=$(find /Users/steven/ai-sites/content-management/retention-hub/weekly-music -type f -name "*$TODAY*" 2>/dev/null | wc -l | xargs)
echo "  Recipes: $RECIPES"
echo "  Art Drops: $ART"
echo "  Music Samplers: $MUSIC"
echo ""

# Operations log
echo "🔧 Operations Today:"
if [ -f "/Users/steven/ai-sites/automation/logs/ops_log.csv" ]; then
  OPS=$(grep "^$(date -u +%Y-%m-%d)" /Users/steven/ai-sites/automation/logs/ops_log.csv 2>/dev/null | wc -l | xargs)
  echo "  Total Operations: $OPS"
fi
echo ""

# Storage
echo "💾 Storage:"
CONTENT_SIZE=$(du -sh /Users/steven/ai-sites/content-management 2>/dev/null | cut -f1)
TOTAL_SIZE=$(du -sh /Users/steven/ai-sites 2>/dev/null | cut -f1)
echo "  Content: $CONTENT_SIZE"
echo "  Total ai-sites: $TOTAL_SIZE"
echo ""

# Music Library
echo "🎵 Music Library:"
SUNO_DIR="/Users/steven/Music/SUNO"
if [ -d "$SUNO_DIR" ]; then
  TRACKS=$(find "$SUNO_DIR" -type f -name "*.mp3" 2>/dev/null | wc -l | xargs)
  echo "  SUNO Tracks: $TRACKS"
fi
echo ""

# Pictures Library
echo "🎨 Art Library:"
PICS_DIR="/Users/steven/Pictures"
if [ -d "$PICS_DIR" ]; then
  IMAGES=$(find "$PICS_DIR" -type f \( -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" \) 2>/dev/null | wc -l | xargs)
  echo "  Total Images: $IMAGES"
fi
echo ""

echo "=========================================="
echo "Run: ~/ai-sites/automation/revenue-dashboard/dashboard.py for revenue"
