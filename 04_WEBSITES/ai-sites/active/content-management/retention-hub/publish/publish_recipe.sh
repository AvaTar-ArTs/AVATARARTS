#!/bin/bash
set -euo pipefail
DIR="$(cd "$(dirname "$0")/.." && pwd)"
source "$DIR/publish/publish_common.sh"
LATEST_FILE=$(ls -t "$DIR/recipes/output"/*.md | head -n1)
DATE_SLUG=$(date +%F)
TARGET="$SITE_EXPORT_DIR/recipe-$DATE_SLUG.md"
cp "$LATEST_FILE" "$TARGET"
echo "✅ Published recipe → $TARGET"

# Export HTML alongside Markdown
python3 "$DIR/exporter/export_md.py" "$TARGET" --title "Recipe"
