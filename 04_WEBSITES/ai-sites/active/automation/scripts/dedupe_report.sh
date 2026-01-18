#!/bin/bash
set -euo pipefail
OUT="/Users/steven/ai-sites/reports/dupes.csv"
mkdir -p "$(dirname "$OUT")"
# Scan large files across selected dirs and group by hash
DIRS=(
  "/Users/steven/Documents/HTML"
  "/Users/steven/Documents/Code"
  "/Users/steven/Documents/Docs"
)
TMP="$(mktemp)"
> "$TMP"
for d in "${DIRS[@]}"; do
  find "$d" -type f -size +50M -print 2>/dev/null | while read -r f; do
    h=$(shasum "$f" 2>/dev/null | awk '{print $1}' || echo "error")
    sz=$(du -k "$f" 2>/dev/null | cut -f1 || echo "0")
    echo "$h,$f,$sz" >> "$TMP"
  done
done
{
  echo "hash,path,size_kb"; cat "$TMP" | sort;
} > "$OUT"
rm -f "$TMP"
echo "Dedup report written: $OUT"
