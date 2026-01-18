#!/bin/bash
# =================================================================
# AVATARARTS Workspace Reorganization Script
# =================================================================
# This script reorganizes the chaotic AVATARARTS project directory
# into a clean, brand-aligned structure.
#
# Brands:
# - avatararts_creative: For creative AI applications and assets.
# - quantumforge_labs: For deep-tech, products, and R&D.
#
# RUN INSTRUCTIONS:
# 1. Review this script carefully to understand the changes.
# 2. Open your terminal in the AVATARARTS project root.
# 3. Make the script executable: chmod +x reorganize_workspace.sh
# 4. Run the script: ./reorganize_workspace.sh
# =================================================================

# Exit immediately if a command exits with a non-zero status.
set -e

echo "🚀 Starting The Alchemy & Quantum Blueprint reorganization..."
echo ""

# --- 1. Create the new directory structure ---
echo "Step 1: Creating new directory structure..."
mkdir -p avatararts_creative/gallery
mkdir -p avatararts_creative/foundry
mkdir -p avatararts_creative/website

mkdir -p quantumforge_labs/products
mkdir -p quantumforge_labs/research
mkdir -p quantumforge_labs/business

mkdir -p archive/meta_documentation
mkdir -p config
echo "✅ New directories created."
echo ""

# --- 2. Consolidate AI & Editor Configurations ---
echo "Step 2: Consolidating configuration files..."
# Move config folders. Use a loop to handle missing folders gracefully.
CONFIG_FOLDERS=(".claude" ".gemini" ".github" ".grok" ".history" ".playwright-mcp" ".qwen" ".vscode")
for folder in "${CONFIG_FOLDERS[@]}"; do
    if [ -d "$folder" ]; then
        mv "$folder" config/
        echo "Moved $folder to config/"
    fi
done
echo "✅ Config files consolidated."
echo ""

# --- 3. Relocate Assets to avatararts_creative ---
echo "Step 3: Relocating assets to 'avatararts_creative'..."
# Use -n (no-clobber) to prevent overwriting.
[ -d "REDBUBBLE_DESIGN_EMPIRE_2025" ] && mv -n "REDBUBBLE_DESIGN_EMPIRE_2025" "avatararts_creative/gallery/" && echo "Moved REDBUBBLE..."
[ -d "assets" ] && mv -n "assets" "avatararts_creative/gallery/" && echo "Moved assets..."
[ -d "heavenlyHands" ] && mv -n "heavenlyHands" "avatararts_creative/gallery/" && echo "Moved heavenlyHands..."
[ -d "content" ] && mv -n "content" "avatararts_creative/gallery/" && echo "Moved content..."

[ -d "pythons" ] && mv -n "pythons" "avatararts_creative/foundry/" && echo "Moved pythons..."
[ -d "scripts" ] && mv -n "scripts" "avatararts_creative/foundry/" && echo "Moved scripts..."
[ -f "etsy_niche_master.tsx" ] && mv -n "etsy_niche_master.tsx" "avatararts_creative/foundry/" && echo "Moved etsy_niche_master.tsx..."
[ -f "portfolio_generator.py" ] && mv -n "portfolio_generator.py" "avatararts_creative/foundry/" && echo "Moved portfolio_generator.py..."
[ -d "Opus_clone_creation_guide" ] && mv -n "Opus_clone_creation_guide" "avatararts_creative/foundry/" && echo "Moved Opus_clone_creation_guide..."

[ -d "AI Alchemy Website" ] && mv -n "AI Alchemy Website" "avatararts_creative/website/" && echo "Moved AI Alchemy Website..."
[ -d "docs-docusaurus" ] && mv -n "docs-docusaurus" "avatararts_creative/website/" && echo "Moved docs-docusaurus..."
[ -d "docs-mkdocs" ] && mv -n "docs-mkdocs" "avatararts_creative/website/" && echo "Moved docs-mkdocs..."
[ -d "docs-sphinx" ] && mv -n "docs-sphinx" "avatararts_creative/website/" && echo "Moved docs-sphinx..."
[ -d "docs-vitepress" ] && mv -n "docs-vitepress" "avatararts_creative/website/" && echo "Moved docs-vitepress..."
[ -d "gol-ia-newq" ] && mv -n "gol-ia-newq" "avatararts_creative/website/" && echo "Moved gol-ia-newq..."
[ -f "sitemap.xml" ] && mv -n "sitemap.xml" "avatararts_creative/website/" && echo "Moved sitemap.xml..."
echo "✅ Creative assets relocated."
echo ""

# --- 4. Relocate Assets to quantumforge_labs ---
echo "Step 4: Relocating assets to 'quantumforge_labs'..."
[ -d "01_TOOLS" ] && mv -n "01_TOOLS" "quantumforge_labs/products/" && echo "Moved 01_TOOLS..."
[ -d "EMPIRE_COMMAND_CENTER" ] && mv -n "EMPIRE_COMMAND_CENTER" "quantumforge_labs/products/" && echo "Moved EMPIRE_COMMAND_CENTER..." # Contains many product ideas
[ -d "Dir2md-main" ] && mv -n "Dir2md-main" "quantumforge_labs/products/" && echo "Moved Dir2md-main..."
[ -f "upwork_automation_suite.py" ] && mv -n "upwork_automation_suite.py" "quantumforge_labs/products/" && echo "Moved upwork_automation_suite.py..."
[ -f "upwork_complete_automation.py" ] && mv -n "upwork_complete_automation.py" "quantumforge_labs/products/" && echo "Moved upwork_complete_automation.py..."
[ -f "upwork_revenue_optimizer.py" ] && mv -n "upwork_revenue_optimizer.py" "quantumforge_labs/products/" && echo "Moved upwork_revenue_optimizer.py..."
[ -f "upwork_analyzer.py" ] && mv -n "upwork_analyzer.py" "quantumforge_labs/products/" && echo "Moved upwork_analyzer.py..."
[ -f "etsy_niche_master-v1.tsx" ] && mv -n "etsy_niche_master-v1.tsx" "quantumforge_labs/products/" && echo "Moved etsy_niche_master-v1.tsx..."

[ -d "research_and_architecture" ] && mv -n "research_and_architecture" "quantumforge_labs/research/" && echo "Moved research_and_architecture..."
[ -d "notebooklm-youtube-skill-main" ] && mv -n "notebooklm-youtube-skill-main" "quantumforge_labs/research/" && echo "Moved notebooklm-youtube-skill-main..."
[ -d "notebooklm.clone.20260114031210" ] && mv -n "notebooklm.clone.20260114031210" "quantumforge_labs/research/" && echo "Moved notebooklm.clone..."
[ -d "Obsidian-plugins-mine" ] && mv -n "Obsidian-plugins-mine" "quantumforge_labs/research/" && echo "Moved Obsidian-plugins-mine..."

# Move all Upwork, SEO, and Revenue related files and folders
[ -d "seo" ] && mv -n "seo" "quantumforge_labs/business/" && echo "Moved seo dir..."
[ -d "06_SEO_MARKETING" ] && mv -n "06_SEO_MARKETING" "quantumforge_labs/business/" && echo "Moved 06_SEO_MARKETING..."
[ -d "REVENUE_ANALYSIS" ] && mv -n "REVENUE_ANALYSIS" "quantumforge_labs/business/" && echo "Moved REVENUE_ANALYSIS..."
[ -d "REVENUE_LAUNCH_2026" ] && mv -n "REVENUE_LAUNCH_2026" "quantumforge_labs/business/" && echo "Moved REVENUE_LAUNCH_2026..."
[ -d "REVENUE_LAUNCH_COMPLETE_2026" ] && mv -n "REVENUE_LAUNCH_COMPLETE_2026" "quantumforge_labs/business/" && echo "Moved REVENUE_LAUNCH_COMPLETE_2026..."
[ -d "Revenue" ] && mv -n "Revenue" "quantumforge_labs/business/" && echo "Moved Revenue..."
find . -maxdepth 1 -type f -name "*UPWORK*" -exec mv -n {} quantumforge_labs/business/ \;
find . -maxdepth 1 -type f -name "*upwork*" -exec mv -n {} quantumforge_labs/business/ \;
[ -f "AEO_SEO_Content_Optimization.md" ] && mv -n "AEO_SEO_Content_Optimization.md" "quantumforge_labs/business/"
[ -f "profile_keywords.csv" ] && mv -n "profile_keywords.csv" "quantumforge_labs/business/"
echo "✅ Tech and business assets relocated."
echo ""

# --- 5. Archive All Meta-Documentation ---
echo "Step 5: Archiving meta-documentation..."
# Move all markdown files that are about organization, analysis, summaries, etc.
# Using find is safer for a large number of files.
find . -maxdepth 1 -type f -name '*.md' -exec mv -n {} archive/meta_documentation/ \;
# Move a few other meta-files
[ -f "Best Sellers.pdf" ] && mv -n "Best Sellers.pdf" "archive/meta_documentation/"
[ -f "hybrid-db.txt" ] && mv -n "hybrid-db.txt" "archive/meta_documentation/"
[ -f "QUICK_REORGANIZE.sh" ] && mv -n "QUICK_REORGANIZE.sh" "archive/meta_documentation/"
[ -f "sitemap.xml" ] && mv -n "sitemap.xml" "archive/meta_documentation/"
echo "✅ Meta-documentation archived."
echo ""

# --- 6. Move Remaining Unsorted Top-Level Folders ---
echo "Step 6: Moving remaining top-level folders to the archive for manual review..."
# These are folders that were not clearly categorized. They will be moved to the archive
# for you to sort through later. This keeps the root clean.
[ -d "00_ACTIVE" ] && mv -n "00_ACTIVE" "archive/"
[ -d "02_DOCUMENTATION" ] && mv -n "02_DOCUMENTATION" "archive/"
[ -d "03_ARCHIVES" ] && mv -n "03_ARCHIVES" "archive/"
[ -d "04_WEBSITES" ] && mv -n "04_WEBSITES" "archive/"
[ -d "05_DATA" ] && mv -n "05_DATA" "archive/"
[ -d "07_MISC" ] && mv -n "07_MISC" "archive/"
[ -d "08_REPORTS" ] && mv -n "08_REPORTS" "archive/"
[ -d "09_SCRIPTS" ] && mv -n "09_SCRIPTS" "archive/"
[ -d "Automations" ] && mv -n "Automations" "archive/"
[ -d "avatararts-enhanced" ] && mv -n "avatararts-enhanced" "archive/"
[ -d "comparison_reports" ] && mv -n "comparison_reports" "archive/"
[ -d "DATABASES" ] && mv -n "DATABASES" "archive/"
[ -d "disco" ] && mv -n "disco" "archive/"
[ -d "INDEXES" ] && mv -n "INDEXES" "archive/"
[ -d "ml_categorization_output" ] && mv -n "ml_categorization_output" "archive/"
[ -d "n8n" ] && mv -n "n8n" "archive/"
[ -d "New_Folder_With_Items_3_ORGANIZED" ] && mv -n "New_Folder_With_Items_3_ORGANIZED" "archive/"
[ -d "notebookLM" ] && mv -n "notebookLM" "archive/"
[ -d "ORGANIZED" ] && mv -n "ORGANIZED" "archive/"
[ -d "Publish" ] && mv -n "Publish" "archive/"
[ -d "Sorted" ] && mv -n "Sorted" "archive/"
[ -d "WEBSITE_DEPLOYMENT" ] && mv -n "WEBSITE_DEPLOYMENT" "archive/"
[ -d "ZiPs" ] && mv -n "ZiPs" "archive/"
[ -d "⭐_EMPIRE_COMMAND_CENTER" ] && mv -n "⭐_EMPIRE_COMMAND_CENTER" "archive/"
echo "✅ Unsorted folders moved to archive for review."
echo ""

echo "🎉 Reorganization script complete!"
echo "Your workspace is now structured for action."
echo ""
echo "NEXT STEPS:"
echo "1. Manually review the contents of the 'archive' directory."
echo "2. Delete any old, now-empty directories if you are satisfied with the result."
echo "3. A new 'README.md' will be created next to explain the structure."
echo "================================================================="
