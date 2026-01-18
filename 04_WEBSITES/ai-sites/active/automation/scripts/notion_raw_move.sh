#!/bin/bash
set -euo pipefail
. "$(cd "$(dirname "$0")" && pwd)/ops_lib.sh"
NOTION_DIR="/Users/steven/Documents/Notion"
RAW_DIR="$NOTION_DIR/_raw"
mkdir -p "$RAW_DIR"
FILES=()
while IFS= read -r -d '' line; do
  FILES+=("$line")
done < <(find "$NOTION_DIR" -type f -size +250M -print0 2>/dev/null)
for src in "${FILES[@]}"; do
  sb=$(size_of "$src" || echo 0)
  base="$(basename "$src")"
  dst="$RAW_DIR/$base"
  if mv "$src" "$dst"; then
    log_op "notion_move_raw" "$src" "$dst" "ok" "moved_big_zip" "$sb" "$(size_of "$dst" || echo 0)"
  else
    log_op "notion_move_raw" "$src" "$dst" "error" "mv_failed" "$sb" 0
  fi
done

echo "Moved large Notion files to $RAW_DIR"
