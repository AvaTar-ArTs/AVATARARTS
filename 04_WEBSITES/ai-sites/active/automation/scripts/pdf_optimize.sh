#!/bin/bash
set -euo pipefail
. "$(cd "$(dirname "$0")" && pwd)/ops_lib.sh"
PDF_DIR="/Users/steven/Documents/PDF"
OUT_DIR="$PDF_DIR/_optimized"
THUMBS_DIR="$PDF_DIR/_thumbs"
mkdir -p "$OUT_DIR" "$THUMBS_DIR"
QPDF_BIN="$(command -v qpdf || true)"
SIPS_BIN="/usr/bin/sips"

shopt -s nullglob
FILES=()
while IFS= read -r -d '' line; do
  FILES+=("$line")
done < <(find "$PDF_DIR" -type f -name '*.pdf' -size +100M -print0 2>/dev/null)
for src in "${FILES[@]}"; do
  base="$(basename "$src")"
  dst="$OUT_DIR/$base"
  sb=$(size_of "$src" || echo 0)
  status="ok"; notes=""; sa=0
  if [ -n "$QPDF_BIN" ]; then
    if "$QPDF_BIN" --linearize "$src" "$dst" 2>/dev/null; then
      sa=$(size_of "$dst" || echo 0)
      log_op "pdf_linearize" "$src" "$dst" "$status" "$notes" "$sb" "$sa"
    else
      status="error"; notes="qpdf_failed"; cp -p "$src" "$dst"; sa=$(size_of "$dst" || echo 0)
      log_op "pdf_copy_on_fail" "$src" "$dst" "$status" "$notes" "$sb" "$sa"
    fi
  else
    status="skipped"; notes="qpdf_missing"; cp -p "$src" "$dst"; sa=$(size_of "$dst" || echo 0)
    log_op "pdf_copy_no_qpdf" "$src" "$dst" "$status" "$notes" "$sb" "$sa"
  fi
  # thumbnail
  thumb="$THUMBS_DIR/${base%.pdf}.png"
  if [ -x "$SIPS_BIN" ]; then
    if "$SIPS_BIN" -s format png "$src" --out "$thumb" >/dev/null 2>&1; then
      "$SIPS_BIN" --resampleHeightWidthMax 256 "$thumb" >/dev/null 2>&1 || true
      log_op "pdf_thumb" "$src" "$thumb" "ok" "sips_png_256" "$sb" "$(size_of "$thumb" || echo 0)"
    else
      log_op "pdf_thumb" "$src" "$thumb" "error" "sips_failed" "$sb" 0
    fi
  else
    log_op "pdf_thumb" "$src" "$thumb" "skipped" "sips_missing" "$sb" 0
  fi
done

echo "Done PDF optimization to $OUT_DIR with thumbs in $THUMBS_DIR"
