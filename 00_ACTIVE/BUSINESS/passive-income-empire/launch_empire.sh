#!/bin/bash

# 🏰 Passive Income Empire Launcher - Enhanced Version
# Master launcher for all revenue-generating systems

echo "🏰 Passive Income Empire - Master Launcher"
echo "=========================================="
echo "Choose your revenue-generating system:"
echo ""

# Check if we're in the right directory
if [ ! -d "ai-recipe-generator" ] || [ ! -d "ai-receptionist" ]; then
    echo "❌ Error: Please run this script from the passive-income-empire directory"
    echo "   cd /Users/steven/ai-sites/passive-income-empire"
    exit 1
fi

# Check if environment is set up
if [ ! -f ".env" ]; then
    echo "⚠️  Environment not configured. Running setup..."
    if [ -f "setup_environment.sh" ]; then
        ./setup_environment.sh
    else
        echo "❌ Setup script not found. Please run setup manually."
        exit 1
    fi
fi

echo "🚀 Available Systems:"
echo ""
echo "1. 🍳 AI Recipe Generator (RECOMMENDED - HIGHEST REVENUE)"
echo "   Revenue Potential: $10K-25K monthly"
echo "   Time to $5K: 3 months"
echo "   Difficulty: Easy"
echo "   Scalability: Very High"
echo ""
echo "2. 🤖 AI Receptionist"
echo "   Revenue Potential: $5K-15K monthly"
echo "   Time to $5K: 6 months"
echo "   Difficulty: Medium"
echo "   Scalability: High"
echo ""
echo "3. 💰 Revenue Dashboard"
echo "   Track and optimize revenue across all systems"
echo "   Real-time analytics and recommendations"
echo ""
echo "4. 🛠️ Setup Environment"
echo "   Configure API keys and dependencies"
echo ""
echo "5. 📊 View Empire Overview"
echo "6. 📚 Open Documentation"
echo "7. 🚪 Exit"
echo ""

read -p "Enter your choice (1-7): " choice

case $choice in
    1)
        echo ""
        echo "🍳 Launching AI Recipe Generator..."
        cd ai-recipe-generator
        ./launch_ai_recipe_generator.sh
        ;;
    2)
        echo ""
        echo "🤖 Launching AI Receptionist..."
        cd ai-receptionist
        ./launch_ai_receptionist.sh
        ;;
    3)
        echo ""
        echo "💰 Launching Revenue Dashboard..."
        python3 revenue_dashboard.py
        ;;
    4)
        echo ""
        echo "🛠️ Running Environment Setup..."
        ./setup_environment.sh
        ;;
    5)
        echo ""
        echo "📊 Opening Empire Overview..."
        if command -v open &> /dev/null; then
            open documentation/PASSIVE_INCOME_EMPIRE_OVERVIEW.md
        else
            cat documentation/PASSIVE_INCOME_EMPIRE_OVERVIEW.md
        fi
        ;;
    6)
        echo ""
        echo "📚 Opening Documentation..."
        if command -v open &> /dev/null; then
            open documentation/
        else
            ls -la documentation/
        fi
        ;;
    7)
        echo ""
        echo "👋 Goodbye! Start building your passive income empire!"
        exit 0
        ;;
    *)
        echo ""
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac