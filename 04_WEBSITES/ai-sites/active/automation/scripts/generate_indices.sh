#!/bin/bash
set -euo pipefail
DOCS_DIR="/Users/steven/Documents/Docs"
MARKD_DIR="/Users/steven/Documents/markD"
HTML_DIR="/Users/steven/Documents/HTML"
OUT1="$MARKD_DIR/📋_MARKD_INDEX.md"
OUT2="$DOCS_DIR/📋_DOCS_INDEX.md"
OUT3="$HTML_DIR/📋_HTML_INDEX.md"

{
  echo "# markD Index"; echo;
  find "$MARKD_DIR" -type f -maxdepth 1 -name '*.md' -print0 | xargs -0 -I {} sh -c 'sz=$(du -h "{}" | cut -f1); echo "- {} ($sz)"' | sed 's#\Q'$MARKD_DIR'/\E##g';
} > "$OUT1" 2>/dev/null || true

{
  echo "# Docs Index"; echo;
  find "$DOCS_DIR" -type f -maxdepth 2 -name '*.md' -print0 | xargs -0 -I {} sh -c 'sz=$(du -h "{}" | cut -f1); echo "- {} ($sz)"' | sed 's#\Q'$DOCS_DIR'/\E##g';
} > "$OUT2" 2>/dev/null || true

{
  echo "# HTML Index"; echo;
  du -sh "$HTML_DIR"/* 2>/dev/null | sort -hr | head -50;
} > "$OUT3" 2>/dev/null || true

echo "Indices written: $OUT1, $OUT2, $OUT3"
