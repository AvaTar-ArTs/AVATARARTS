#!/bin/bash

# 🏰 Creative AI Empire Automation Master
# Comprehensive automation system for your $7M creative AI empire

echo "🏰 Creative AI Empire Automation Master"
echo "======================================"
echo "Welcome to your automated creative AI empire!"
echo ""

# Check if we're in the right directory
if [ ! -d "ai-content-studio" ] || [ ! -d "creative-ai-marketplace" ]; then
    echo "❌ Error: Please run this script from the ai-sites directory"
    echo "   cd /Users/steven/ai-sites"
    exit 1
fi

# Load environment variables
echo "🔧 Loading environment variables..."
source ~/.env.d/loader.sh llm-apis art-vision automation-agents seo-analytics

# Check API keys
echo "🔑 Checking API keys..."
if [ -z "$OPENAI_API_KEY" ]; then
    echo "❌ OpenAI API key not found"
    exit 1
fi
if [ -z "$ANTHROPIC_API_KEY" ]; then
    echo "❌ Anthropic API key not found"
    exit 1
fi
echo "✅ API keys loaded successfully"

# Create automation directories
echo "📁 Creating automation directories..."
mkdir -p automation/logs
mkdir -p automation/backups
mkdir -p automation/schedules
mkdir -p automation/reports
mkdir -p automation/monitoring

# Set up logging
LOG_FILE="automation/logs/empire_automation_$(date +%Y%m%d_%H%M%S).log"
exec > >(tee -a "$LOG_FILE")
exec 2>&1

echo "📊 Empire Automation Options:"
echo ""
echo "1. 🚀 Deploy All Systems (Complete Empire Setup)"
echo "2. 📈 Content Generation Pipeline (SEO + AI Content)"
echo "3. 💰 Revenue Optimization (All Revenue Streams)"
echo "4. 🎬 Video Production Automation (Sora + Runway)"
echo "5. 🎓 Education Platform Automation (Course Generation)"
echo "6. 🏢 Agency Management (Client + Project Automation)"
echo "7. 📊 Analytics & Reporting (Performance Tracking)"
echo "8. 🔄 System Maintenance (Updates + Backups)"
echo "9. 🎯 SEO Content Blitz (Trending Keywords)"
echo "10. 💎 Master Revenue Dashboard"
echo "11. 🛠️ Environment Optimization"
echo "12. 📋 System Status Check"
echo "13. 🚪 Exit"
echo ""

read -p "Enter your choice (1-13): " choice

case $choice in
    1)
        echo ""
        echo "🚀 Deploying Complete Creative AI Empire..."
        ./deploy_complete_empire.sh
        ;;
    2)
        echo ""
        echo "📈 Launching Content Generation Pipeline..."
        ./automation/content_generation_pipeline.sh
        ;;
    3)
        echo ""
        echo "💰 Launching Revenue Optimization..."
        ./automation/revenue_optimization.sh
        ;;
    4)
        echo ""
        echo "🎬 Launching Video Production Automation..."
        ./automation/video_production_automation.sh
        ;;
    5)
        echo ""
        echo "🎓 Launching Education Platform Automation..."
        ./automation/education_automation.sh
        ;;
    6)
        echo ""
        echo "🏢 Launching Agency Management..."
        ./automation/agency_management.sh
        ;;
    7)
        echo ""
        echo "📊 Launching Analytics & Reporting..."
        ./automation/analytics_reporting.sh
        ;;
    8)
        echo ""
        echo "🔄 Launching System Maintenance..."
        ./automation/system_maintenance.sh
        ;;
    9)
        echo ""
        echo "🎯 Launching SEO Content Blitz..."
        ./automation/seo_content_blitz.sh
        ;;
    10)
        echo ""
        echo "💎 Launching Master Revenue Dashboard..."
        python3 master_revenue_dashboard.py
        ;;
    11)
        echo ""
        echo "🛠️ Launching Environment Optimization..."
        ./automation/environment_optimization.sh
        ;;
    12)
        echo ""
        echo "📋 Checking System Status..."
        ./automation/system_status_check.sh
        ;;
    13)
        echo ""
        echo "👋 Goodbye! Your creative AI empire is ready for domination!"
        exit 0
        ;;
    *)
        echo ""
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac

echo ""
echo "✅ Automation completed successfully!"
echo "📊 Check logs at: $LOG_FILE"
echo "🏰 Your creative AI empire is now automated and ready for $7M+ revenue!"