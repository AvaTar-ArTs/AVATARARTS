#!/bin/bash
# Organize Home Directory Loose Files
# Based on user's mapping scheme

echo "🔥 ORGANIZING 205 LOOSE FILES..."
echo "════════════════════════════════════════════════════════════════"
echo ""

# Create target directories
echo "📁 Creating target directories..."
mkdir -p ~/Documents/markD
mkdir -p ~/Documents/html
mkdir -p ~/Documents/csv
mkdir -p ~/Documents/json
mkdir -p ~/Documents/txt
mkdir -p ~/Documents/logs
mkdir -p ~/Documents/archive
mkdir -p ~/pythons/home_scripts
mkdir -p ~/scripts/home_scripts

echo "✅ Directories created"
echo ""

# Initialize counters
moved_md=0
moved_html=0
moved_csv=0
moved_json=0
moved_txt=0
moved_py=0
moved_sh=0
moved_zip=0
deleted_log=0
deleted_err=0

# Move Markdown files (106 files)
echo "📄 Moving Markdown files to ~/Documents/markD/..."
cd /Users/steven
for f in *.md; do
  [ -f "$f" ] && mv "$f" ~/Documents/markD/ && ((moved_md++))
done
echo "   Moved: $moved_md files"

# Move HTML files (6 files)
echo "🌐 Moving HTML files to ~/Documents/html/..."
for f in *.html; do
  [ -f "$f" ] && mv "$f" ~/Documents/html/ && ((moved_html++))
done
echo "   Moved: $moved_html files"

# Move CSV files (24 files)
echo "📋 Moving CSV files to ~/Documents/csv/..."
for f in *.csv; do
  [ -f "$f" ] && mv "$f" ~/Documents/csv/ && ((moved_csv++))
done
echo "   Moved: $moved_csv files"

# Move JSON files (14 files)
echo "📋 Moving JSON files to ~/Documents/json/..."
for f in *.json; do
  [ -f "$f" ] && mv "$f" ~/Documents/json/ && ((moved_json++))
done
echo "   Moved: $moved_json files"

# Move TXT files (26 files)
echo "📝 Moving TXT files to ~/Documents/txt/..."
for f in *.txt; do
  [ -f "$f" ] && mv "$f" ~/Documents/txt/ && ((moved_txt++))
done
echo "   Moved: $moved_txt files"

# Move Python files (1 file)
echo "🐍 Moving Python files to ~/pythons/home_scripts/..."
for f in *.py; do
  [ -f "$f" ] && mv "$f" ~/pythons/home_scripts/ && ((moved_py++))
done
echo "   Moved: $moved_py files"

# Move archives (3 files)
echo "📦 Moving ZIP files to ~/Documents/archive/..."
for f in *.zip; do
  [ -f "$f" ] && mv "$f" ~/Documents/archive/ && ((moved_zip++))
done
echo "   Moved: $moved_zip files"

# Delete log files (15 files)
echo "🗑️  Deleting LOG files..."
for f in *.log; do
  [ -f "$f" ] && rm "$f" && ((deleted_log++))
done
echo "   Deleted: $deleted_log files"

# Delete error files (4 files)
echo "🗑️  Deleting ERR files..."
for f in *.err; do
  [ -f "$f" ] && rm "$f" && ((deleted_err++))
done
echo "   Deleted: $deleted_err files"

# Move remaining files
echo "📦 Moving remaining files to ~/Documents/archive/..."
cd /Users/steven
for f in *.yaml *.rtf *.lock zshrc* install; do
  [ -f "$f" ] && mv "$f" ~/Documents/archive/ 2>/dev/null
done

echo ""
echo "════════════════════════════════════════════════════════════════"
echo "✅ ORGANIZATION COMPLETE!"
echo ""
echo "📊 Summary:"
echo "  Markdown:    $moved_md → ~/Documents/markD/"
echo "  HTML:        $moved_html → ~/Documents/html/"
echo "  CSV:         $moved_csv → ~/Documents/csv/"
echo "  JSON:        $moved_json → ~/Documents/json/"
echo "  TXT:         $moved_txt → ~/Documents/txt/"
echo "  Python:      $moved_py → ~/pythons/home_scripts/"
echo "  ZIP:         $moved_zip → ~/Documents/archive/"
echo "  Logs:        $deleted_log deleted"
echo "  Errors:      $deleted_err deleted"
echo ""
total_moved=$((moved_md + moved_html + moved_csv + moved_json + moved_txt + moved_py + moved_zip))
total_deleted=$((deleted_log + deleted_err))
echo "  Total moved:   $total_moved files"
echo "  Total deleted: $total_deleted files"
echo ""
echo "🎉 Your home directory is now clean!"
echo ""

