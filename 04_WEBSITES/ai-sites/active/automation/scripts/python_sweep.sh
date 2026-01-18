#!/bin/bash
set -euo pipefail
. "$(cd "$(dirname "$0")" && pwd)/ops_lib.sh"
PY_DIR="/Users/steven/Documents/python"
TRASH_DIR="$PY_DIR/_trash/$(date +%Y%m%d)"
mkdir -p "$TRASH_DIR"
DIRS=()
while IFS= read -r -d '' line; do
  DIRS+=("$line")
done < <(find "$PY_DIR" -type d \( -name __pycache__ -o -name .ipynb_checkpoints \) -print0 2>/dev/null)
for src in "${DIRS[@]}"; do
  sb=$(size_of "$src" || echo 0)
  rel="${src#$PY_DIR/}"
  dst="$TRASH_DIR/$rel"
  mkdir -p "$(dirname "$dst")"
  if mv "$src" "$dst"; then
    log_op "py_cache_move" "$src" "$dst" "ok" "moved_to_trash" "$sb" "$(size_of "$dst" || echo 0)"
  else
    log_op "py_cache_move" "$src" "$dst" "error" "mv_failed" "$sb" 0
  fi
done

echo "Moved caches to $TRASH_DIR"
