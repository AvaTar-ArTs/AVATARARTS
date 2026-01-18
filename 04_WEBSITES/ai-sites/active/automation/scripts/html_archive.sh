#!/bin/bash
set -euo pipefail
. "$(cd "$(dirname "$0")" && pwd)/ops_lib.sh"
HTML_MISC="/Users/steven/Documents/HTML/misc"
DEST_BASE="/Users/steven/Documents/Archives/HTML/$(date +%Y%m%d)"
mkdir -p "$DEST_BASE"
# Move subdirs > 500M
BIGS=()
while IFS= read -r line; do
  BIGS+=("$line")
done < <(du -sk "$HTML_MISC"/* 2>/dev/null | awk '$1>512000 {print $2}')
if [ ${#BIGS[@]} -eq 0 ]; then
  echo "No large HTML/misc folders to archive"
  exit 0
fi
for src in "${BIGS[@]}"; do
  sb=$(size_of "$src" || echo 0)
  base="$(basename "$src")"
  dst="$DEST_BASE/$base"
  if mv "$src" "$dst"; then
    log_op "html_archive" "$src" "$dst" "ok" "moved_big_misc" "$sb" "$(size_of "$dst" || echo 0)"
  else
    log_op "html_archive" "$src" "$dst" "error" "mv_failed" "$sb" 0
  fi
done

echo "Archived big HTML/misc subfolders to $DEST_BASE"
