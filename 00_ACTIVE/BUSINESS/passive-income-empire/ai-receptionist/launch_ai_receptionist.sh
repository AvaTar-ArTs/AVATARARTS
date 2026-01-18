#!/bin/bash

# 🤖 AI Receptionist Launcher
# Business automation system for $5K-15K monthly revenue

echo "🤖 AI Receptionist - Passive Income Empire"
echo "=========================================="
echo "Business automation system for $5K-15K monthly revenue"
echo ""

# Check if we're in the right directory
if [ ! -f "ai_receptionist.py" ]; then
    echo "❌ Error: Please run this script from the ai-receptionist directory"
    echo "   cd /Users/steven/ai-sites/passive-income-empire/ai-receptionist"
    exit 1
fi

# Check if Python 3 is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Error: Python 3 is not installed or not in PATH"
    exit 1
fi

echo "🚀 Starting AI Receptionist..."
echo ""

# Run the AI receptionist
python3 ai_receptionist.py

echo ""
echo "🎉 AI Receptionist completed!"
echo ""
echo "💡 Next steps:"
echo "   1. Set up business clients"
echo "   2. Configure AI responses"
echo "   3. Launch web dashboard: python3 ai_receptionist_web.py"
echo "   4. Run demo: python3 ai_receptionist_demo.py"
echo "   5. Start generating $5K-15K monthly revenue!"
echo ""
echo "📚 Read the documentation:"
echo "   - README_AI_RECEPTIONIST.md"
echo "   - ../documentation/REVENUE_OPTIMIZATION_GUIDE.md"