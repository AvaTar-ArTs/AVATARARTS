#!/bin/bash
# Project-Based Organization for SEO/Website Work
# Groups related files by project instead of scattering by type

echo "🔥 ORGANIZING BY PROJECTS (NOT BY FILE TYPE)..."
echo "════════════════════════════════════════════════════════════════"
echo ""

# Create project-based structure
echo "📁 Creating project-based directories..."
mkdir -p ~/Documents/SEO_EMPIRE/{AvatarArts,QuantumForge,Strategies,Analysis}
mkdir -p ~/Documents/ANALYSIS_REPORTS/{System,Pictures,Audio,Cleanup}
mkdir -p ~/Documents/GUIDES_TUTORIALS
mkdir -p ~/Documents/PROJECT_DOCS/{Planning,Handoffs,Complete}
mkdir -p ~/Documents/WORKING/{Active,Archive}
mkdir -p ~/pythons/home_scripts
mkdir -p ~/scripts/home_scripts

echo "✅ Project structure created"
echo ""

# Initialize counters
seo_count=0
analysis_count=0
guides_count=0
project_docs=0
working_count=0
deleted_count=0

cd /Users/steven

# 1. SEO EMPIRE FILES (HTML + related MD/CSV)
echo "🌐 Organizing SEO EMPIRE files..."
# HTML files
for f in *.html; do
  [ -f "$f" ] && mv "$f" ~/Documents/SEO_EMPIRE/ && ((seo_count++))
done

# SEO-related Markdown
for pattern in "*SEO*" "*AEO*" "*TRENDING*" "*REVENUE*" "*MONETIZATION*" "*10K*" "*10k*" "*YOUTUBE*"; do
  for f in $pattern.md 2>/dev/null; do
    [ -f "$f" ] && mv "$f" ~/Documents/SEO_EMPIRE/Strategies/ && ((seo_count++))
  done
done

# SEO-related TXT
for pattern in "*seo*" "*avatararts*" "*automation*"; do
  for f in $pattern.txt 2>/dev/null; do
    [ -f "$f" ] && mv "$f" ~/Documents/SEO_EMPIRE/ && ((seo_count++))
  done
done

echo "   Moved: $seo_count SEO files → ~/Documents/SEO_EMPIRE/"

# 2. ANALYSIS REPORTS (MD + CSV + JSON together)
echo "📊 Organizing ANALYSIS reports..."
# System analysis
for pattern in "*ANALYSIS*" "*REPORT*" "*SUMMARY*" "*ADVANCED*" "*DEEP*" "*COMPREHENSIVE*" "*VOLUMES*" "*HOME*"; do
  for f in $pattern.md 2>/dev/null; do
    [ -f "$f" ] && mv "$f" ~/Documents/ANALYSIS_REPORTS/System/ && ((analysis_count++))
  done
  for f in $pattern.json 2>/dev/null; do
    [ -f "$f" ] && mv "$f" ~/Documents/ANALYSIS_REPORTS/System/ && ((analysis_count++))
  done
done

# Pictures analysis (CSV + MD together)
for f in pictures*.csv pictures*.md; do
  [ -f "$f" ] && mv "$f" ~/Documents/ANALYSIS_REPORTS/Pictures/ && ((analysis_count++))
done

# Audio/MP3 analysis
for f in mp3*.csv mp3*.txt audio*.csv; do
  [ -f "$f" ] && mv "$f" ~/Documents/ANALYSIS_REPORTS/Audio/ && ((analysis_count++))
done

# Duplicates & cleanup
for f in *duplicate*.csv *duplicate*.txt *CLEANUP*.md; do
  [ -f "$f" ] && mv "$f" ~/Documents/ANALYSIS_REPORTS/Cleanup/ && ((analysis_count++))
done

# All other CSVs
for f in *.csv; do
  [ -f "$f" ] && mv "$f" ~/Documents/ANALYSIS_REPORTS/System/ && ((analysis_count++))
done

# All other JSON
for f in *.json; do
  [ -f "$f" ] && mv "$f" ~/Documents/ANALYSIS_REPORTS/System/ && ((analysis_count++))
done

echo "   Moved: $analysis_count analysis files → ~/Documents/ANALYSIS_REPORTS/"

# 3. GUIDES & TUTORIALS
echo "📚 Organizing GUIDES & TUTORIALS..."
for pattern in "*GUIDE*" "*TUTORIAL*" "*SETUP*" "*INSTRUCTIONS*" "*OPTIONS*" "*TOOLS*"; do
  for f in $pattern.md 2>/dev/null; do
    [ -f "$f" ] && mv "$f" ~/Documents/GUIDES_TUTORIALS/ && ((guides_count++))
  done
done
echo "   Moved: $guides_count guide files → ~/Documents/GUIDES_TUTORIALS/"

# 4. PROJECT DOCUMENTATION
echo "📋 Organizing PROJECT DOCS..."
for pattern in "*HANDOFF*" "*SESSION*" "*PROJECT*" "*CONSOLIDATION*" "*PLAN*"; do
  for f in $pattern.md 2>/dev/null; do
    [ -f "$f" ] && mv "$f" ~/Documents/PROJECT_DOCS/Planning/ && ((project_docs++))
  done
done
echo "   Moved: $project_docs project docs → ~/Documents/PROJECT_DOCS/"

# 5. WORKING/ACTIVE FILES
echo "💼 Organizing WORKING files..."
for f in *.txt; do
  [ -f "$f" ] && mv "$f" ~/Documents/WORKING/Active/ && ((working_count++))
done
for f in *.py; do
  [ -f "$f" ] && mv "$f" ~/pythons/home_scripts/ && ((working_count++))
done
for f in *.zip; do
  [ -f "$f" ] && mv "$f" ~/Documents/WORKING/Archive/ && ((working_count++))
done
for f in *.yaml *.rtf *.lock; do
  [ -f "$f" ] && mv "$f" ~/Documents/WORKING/Archive/ && ((working_count++))
done
mv zshrc* install ~/Documents/WORKING/Archive/ 2>/dev/null
echo "   Moved: $working_count working files"

# 6. DELETE TEMP FILES
echo "🗑️  Deleting temp files..."
for f in *.log *.err; do
  [ -f "$f" ] && rm "$f" && ((deleted_count++))
done
echo "   Deleted: $deleted_count temp files"

# Move any remaining MD files to PROJECT_DOCS
for f in *.md; do
  [ -f "$f" ] && mv "$f" ~/Documents/PROJECT_DOCS/Planning/
done

echo ""
echo "════════════════════════════════════════════════════════════════"
echo "✅ PROJECT-BASED ORGANIZATION COMPLETE!"
echo ""
echo "📊 Summary by Project:"
echo "  SEO Empire:        $seo_count files → ~/Documents/SEO_EMPIRE/"
echo "  Analysis Reports:  $analysis_count files → ~/Documents/ANALYSIS_REPORTS/"
echo "  Guides/Tutorials:  $guides_count files → ~/Documents/GUIDES_TUTORIALS/"
echo "  Project Docs:      $project_docs files → ~/Documents/PROJECT_DOCS/"
echo "  Working Files:     $working_count files → ~/Documents/WORKING/"
echo "  Deleted:           $deleted_count temp files"
echo ""
total_moved=$((seo_count + analysis_count + guides_count + project_docs + working_count))
echo "  Total organized:   $total_moved files"
echo ""
echo "🎉 Everything grouped by project - no more scattered files!"
echo ""

