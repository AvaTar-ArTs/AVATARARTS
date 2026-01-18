#!/bin/bash

# 🍳 AI Recipe Generator Launcher
# High-engagement content system for $10K+ monthly revenue

echo "🍳 AI Recipe Generator - Passive Income Empire"
echo "=============================================="
echo "High-engagement content system for $10K+ monthly revenue"
echo ""

# Check current directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
echo "📍 Working directory: $SCRIPT_DIR"
echo ""

# List available files
echo "📁 Available files in this directory:"
ls -la | grep -E "\.(py|sh|md|txt)$" | awk '{print "   " $NF}'
echo ""

# Check for Python files
echo "🔍 Looking for Python modules..."
if [ -f "ai_recipe_generator.py" ]; then
    echo "   ✅ Found ai_recipe_generator.py"
    python3 ai_recipe_generator.py
elif [ -f "recipe_generator.py" ]; then
    echo "   ✅ Found recipe_generator.py"
    python3 recipe_generator.py
else
    echo "   ⚠️  No Python AI module found"
    echo ""
    echo "📚 Available next steps:"
    echo "   1. Review README_AI_RECIPE_GENERATOR.md"
    echo "   2. Check requirements.txt: $(cat requirements.txt 2>/dev/null | head -3)"
    echo "   3. Install dependencies: pip install -r requirements.txt"
    echo ""
    echo "💡 This system is a template. To activate it:"
    echo "   - Set up your API keys in ../.env"
    echo "   - Create ai_recipe_generator.py using the specification"
    echo "   - Run this launcher again"
    exit 0
fi

echo ""
echo "🎉 AI Recipe Generator completed!"
echo ""
echo "💡 Next steps:"
echo "   1. Set up affiliate programs (Amazon, HelloFresh, Vitamix)"
echo "   2. Create website/blog with SEO optimization"
echo "   3. Launch social media accounts (Instagram, Pinterest, TikTok)"
echo "   4. Run content automation: python3 content_automation_system.py"
echo "   5. Start generating \$10K+ monthly revenue!"

echo ""
echo "🎉 AI Recipe Generator completed!"
echo ""
echo "💡 Next steps:"
echo "   1. Set up affiliate programs (Amazon, HelloFresh, Vitamix)"
echo "   2. Create website/blog with SEO optimization"
echo "   3. Launch social media accounts (Instagram, Pinterest, TikTok)"
echo "   4. Run content automation: python3 content_automation_system.py"
echo "   5. Start generating $10K+ monthly revenue!"
echo ""
echo "📚 Read the documentation:"
echo "   - README_AI_RECIPE_GENERATOR.md"
echo "   - ../documentation/REVENUE_OPTIMIZATION_GUIDE.md"
echo "   - ../documentation/QUICK_START_REVENUE.md"