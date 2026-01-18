#!/bin/bash
set -euo pipefail
DIR="$(cd "$(dirname "$0")/.." && pwd)"
source "$DIR/publish/publish_common.sh"
SOURCE_MD="$DIR/daily-art/daily-art.md"
DATE_SLUG=$(date +%F)
TARGET="$SITE_EXPORT_DIR/daily-art-$DATE_SLUG.md"
cp "$SOURCE_MD" "$TARGET"
echo "✅ Published daily art → $TARGET"

# Export HTML alongside Markdown
python3 "$DIR/exporter/export_md.py" "$TARGET" --title "Daily Art"
