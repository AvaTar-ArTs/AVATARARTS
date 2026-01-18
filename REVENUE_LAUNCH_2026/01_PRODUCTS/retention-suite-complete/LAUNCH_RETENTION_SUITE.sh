#!/bin/bash

# 🎯 Retention Products Suite Launcher
# Comprehensive retention and return visit products

echo "🎯 Retention Products Suite Launcher"
echo "===================================="
echo "Building user retention and return visit systems"
echo ""

# Check if we're in the right directory
if [ ! -d "retention-products-suite" ]; then
    echo "❌ Error: Please run this script from the ai-sites directory"
    echo "   cd /Users/steven/ai-sites"
    exit 1
fi

cd retention-products-suite

echo "🚀 Available Retention Products:"
echo ""
echo "1. 🛍️ Digital Products ($15K-30K monthly)"
echo "   One-time purchase items for immediate revenue"
echo "   - Creative Asset Packs"
echo "   - Educational Content"
echo "   - Tools & Utilities"
echo "   - Media Assets"
echo "   - App Templates"
echo ""
echo "2. 💻 SaaS Applications ($20K-50K monthly)"
echo "   Recurring subscription products"
echo "   - Creative AI Studio Pro"
echo "   - Content Analytics Dashboard"
echo "   - AI Automation Hub"
echo "   - Learning Management System"
echo ""
echo "3. 📱 Mobile Apps ($10K-25K monthly)"
echo "   Mobile-first engagement apps"
echo "   - Creative AI Mobile Studio"
echo "   - Content Analytics Mobile"
echo "   - AI Learning Mobile"
echo "   - Automation Mobile Hub"
echo ""
echo "4. 🎯 Engagement Tools ($8K-20K monthly)"
echo "   User retention systems"
echo "   - Gamification Engine"
echo "   - Email Engagement System"
echo "   - Notification Management"
echo "   - Personalization Engine"
echo "   - Community Platform"
echo ""
echo "5. 🛍️ Templates Marketplace ($8K-20K monthly)"
echo "   Recurring asset sales"
echo "   - Design Templates"
echo "   - App Templates"
echo "   - Business Templates"
echo "   - Educational Templates"
echo ""
echo "6. 👥 Community Platforms ($5K-15K monthly)"
echo "   User engagement communities"
echo "   - Creative Community Hub"
echo "   - Learning Community Platform"
echo "   - Entrepreneur Community"
echo ""
echo "7. 🎮 Gamification Systems ($5K-10K monthly)"
echo "   User engagement through game mechanics"
echo "   - Achievement System"
echo "   - Points & Rewards"
echo "   - Leaderboard System"
echo "   - Challenge System"
echo ""
echo "8. 📊 Analytics & Tracking ($3K-8K monthly)"
echo "   Data-driven retention optimization"
echo "   - User Behavior Analytics"
echo "   - Retention Analytics"
echo "   - Content Performance Analytics"
echo "   - Revenue Analytics"
echo ""
echo "9. 💎 Master Retention Dashboard"
echo "   Unified retention management"
echo ""
echo "10. 🛠️ System Management"
echo "    Deploy, update, and manage all systems"
echo ""
echo "11. 📊 Retention Analytics"
echo "    Comprehensive retention analysis"
echo ""
echo "12. 🚪 Exit"
echo ""

read -p "Enter your choice (1-12): " choice

case $choice in
    1)
        echo ""
        echo "🛍️ Launching Digital Products System..."
        cd digital-products
        ./launch_digital_products.sh
        ;;
    2)
        echo ""
        echo "💻 Launching SaaS Applications..."
        cd saas-applications
        ./launch_saas_apps.sh
        ;;
    3)
        echo ""
        echo "📱 Launching Mobile Apps..."
        cd mobile-apps
        ./launch_mobile_apps.sh
        ;;
    4)
        echo ""
        echo "🎯 Launching Engagement Tools..."
        cd engagement-tools
        ./launch_engagement_tools.sh
        ;;
    5)
        echo ""
        echo "🛍️ Launching Templates Marketplace..."
        cd templates-marketplace
        ./launch_templates_marketplace.sh
        ;;
    6)
        echo ""
        echo "👥 Launching Community Platforms..."
        cd community-platforms
        ./launch_community_platforms.sh
        ;;
    7)
        echo ""
        echo "🎮 Launching Gamification Systems..."
        cd gamification-systems
        ./launch_gamification.sh
        ;;
    8)
        echo ""
        echo "📊 Launching Analytics & Tracking..."
        cd analytics-tracking
        ./launch_analytics.sh
        ;;
    9)
        echo ""
        echo "💎 Launching Master Retention Dashboard..."
        python3 master_retention_dashboard.py
        ;;
    10)
        echo ""
        echo "🛠️ Retention System Management Options:"
        echo "1. Deploy all retention systems"
        echo "2. Update all retention systems"
        echo "3. Check retention system status"
        echo "4. Backup all retention systems"
        echo "5. Restore from backup"
        echo ""
        read -p "Choose management option (1-5): " mgmt_choice
        case $mgmt_choice in
            1) ./deploy_all_retention_systems.sh ;;
            2) ./update_all_retention_systems.sh ;;
            3) ./check_retention_system_status.sh ;;
            4) ./backup_all_retention_systems.sh ;;
            5) ./restore_from_backup.sh ;;
            *) echo "Invalid choice" ;;
        esac
        ;;
    11)
        echo ""
        echo "📊 Launching Retention Analytics..."
        python3 retention_analytics.py
        ;;
    12)
        echo ""
        echo "👋 Goodbye! Keep building your retention empire!"
        exit 0
        ;;
    *)
        echo ""
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac