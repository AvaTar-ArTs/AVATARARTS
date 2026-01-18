#!/bin/bash

# AvatarArts Print-on-Demand Empire Launcher
# Orchestrates all 53 automation tools for maximum revenue

set -e

AUTOMATIONS_DIR="/Users/steven/AVATARARTS/Automations"
cd "$AUTOMATIONS_DIR"

echo "🚀 AVATARARTS POD EMPIRE - INITIALIZATION"
echo "=========================================="
echo ""

# Check tool availability
echo "📦 Checking tool status..."
TOOLS=(
    "notebooklm-mcp-main"
    "ComicBook-AI-main"
    "AI-podcast-generator-main"
    "versatile_bot_project-main"
    "insights-lm-public-main"
)

for tool in "${TOOLS[@]}"; do
    if [ -d "$tool" ]; then
        echo "  ✅ $tool"
    else
        echo "  ❌ $tool (missing)"
    fi
done

echo ""
echo "🎯 Choose your action:"
echo "  1) Run daily workflow (full automation)"
echo "  2) Generate 20 designs only"
echo "  3) Research trending keywords"
echo "  4) Bulk upload existing designs"
echo "  5) Run analytics report"
echo "  6) Setup wizard (first time)"
echo ""

read -p "Enter choice [1-6]: " choice

case $choice in
    1)
        echo "🚀 Starting full daily workflow..."
        python3 AVATARARTS_POD_MASTER.py
        ;;
    2)
        echo "🎨 Generating 20 designs..."
        cd ComicBook-AI-main
        npm run batch-generate -- --count=20
        ;;
    3)
        echo "📊 Researching trends..."
        cd notebooklm-mcp-main
        node src/index.js --mode=trend-scan
        ;;
    4)
        echo "⬆️ Bulk uploading..."
        cd versatile_bot_project-main
        python3 bulk_upload.py
        ;;
    5)
        echo "📈 Running analytics..."
        cd insights-lm-public-main
        npm run analyze
        ;;
    6)
        echo "🛠️ Running setup wizard..."
        ./setup_wizard.sh
        ;;
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "✅ Operation complete!"
echo "💰 Check your dashboard: https://avatararts.org/dashboard"
