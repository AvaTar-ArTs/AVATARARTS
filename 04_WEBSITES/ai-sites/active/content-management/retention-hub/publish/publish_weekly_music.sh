#!/bin/bash
set -euo pipefail
DIR="$(cd "$(dirname "$0")/.." && pwd)"
source "$DIR/publish/publish_common.sh"
DATE_SLUG=$(date +%F)
MD_SRC="$DIR/weekly-music/weekly-music.md"
JSON_SRC="$DIR/weekly-music/weekly-music.json"
MD_TGT="$SITE_EXPORT_DIR/weekly-music-$DATE_SLUG.md"
JSON_TGT="$SITE_EXPORT_DIR/weekly-music-$DATE_SLUG.json"
cp "$MD_SRC" "$MD_TGT"
cp "$JSON_SRC" "$JSON_TGT"
echo "✅ Published weekly music → $MD_TGT, $JSON_TGT"

# Export HTML alongside Markdown
python3 "$DIR/exporter/export_md.py" "$MD_TGT" --title "Weekly Music"
