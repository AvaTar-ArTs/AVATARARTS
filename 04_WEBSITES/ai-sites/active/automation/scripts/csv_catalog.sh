#!/bin/bash
set -euo pipefail
CSV_DIR="/Users/steven/Documents/CsV"
OUT="/Users/steven/ai-sites/reports/csv_manifest.csv"
mkdir -p "$(dirname "$OUT")"
echo "path,size_kb,rows,cols" > "$OUT"
shopt -s nullglob
for f in "$CSV_DIR"/*.csv; do
  sz=$(du -k "$f" | cut -f1)
  rows=$(wc -l < "$f" | xargs)
  header=$(head -n 1 "$f" | sed 's/\\/\\\\/g; s/"/\\"/g' || echo "")
  if [ -n "$header" ]; then cols=$(python3 -c "import csv,io; line=\"$header\"; print(len(next(csv.reader(io.StringIO(line)))))" 2>/dev/null || echo "0"); else cols=0; fi
  echo "$f,$sz,$rows,$cols" >> "$OUT"
done

echo "CSV manifest written: $OUT"
