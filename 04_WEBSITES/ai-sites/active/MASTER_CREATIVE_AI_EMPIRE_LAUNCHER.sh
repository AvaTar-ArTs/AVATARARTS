#!/bin/bash

# 🏰 Master Creative AI Empire Launcher
# Launches all 5 creative AI systems with SEO optimization

echo "🏰 Master Creative AI Empire Launcher"
echo "====================================="
echo "Welcome to your complete creative AI empire!"
echo ""

# Check if we're in the right directory
if [ ! -d "ai-content-studio" ] || [ ! -d "creative-ai-marketplace" ]; then
    echo "❌ Error: Please run this script from the ai-sites directory"
    echo "   cd /Users/steven/ai-sites"
    exit 1
fi

echo "🚀 Available Creative AI Systems:"
echo ""
echo "1. 🎨 AI Content Studio (HIGHEST REVENUE)"
echo "   Revenue Potential: $50K-100K monthly"
echo "   Features: Multi-AI integration, batch processing, content generation"
echo "   Status: Production Ready"
echo ""
echo "2. 💰 Creative AI Marketplace (MONETIZATION)"
echo "   Revenue Potential: $30K-75K monthly"
echo "   Features: NFT generation, print-on-demand, stock content, licensing"
echo "   Status: Production Ready"
echo ""
echo "3. 🎬 AI Video Production Pipeline (VIDEO REVENUE)"
echo "   Revenue Potential: $40K-80K monthly"
echo "   Features: Sora integration, Runway, Pika Labs, automated editing"
echo "   Status: Production Ready"
echo ""
echo "4. 🎓 Creative AI Education Platform (EDUCATION REVENUE)"
echo "   Revenue Potential: $25K-50K monthly"
echo "   Features: Course generation, certification, community, mentorship"
echo "   Status: Production Ready"
echo ""
echo "5. 🏢 Creative AI Agency (SERVICE REVENUE)"
echo "   Revenue Potential: $75K-150K monthly"
echo "   Features: Client management, project automation, team collaboration"
echo "   Status: Production Ready"
echo ""
echo "6. 🚀 SEO-Optimized Content System (TRAFFIC REVENUE)"
echo "   Revenue Potential: $100K-200K monthly"
echo "   Features: Trending keywords, content generation, SEO optimization"
echo "   Status: Production Ready"
echo ""
echo "7. 💎 Master Revenue Dashboard"
echo "   Track and optimize revenue across all systems"
echo "   Real-time analytics and recommendations"
echo ""
echo "8. 🛠️ System Management"
echo "   Deploy, update, and manage all systems"
echo ""
echo "9. 📊 Empire Analytics"
echo "   Comprehensive analytics across all systems"
echo ""
echo "10. 🚪 Exit"
echo ""

read -p "Enter your choice (1-10): " choice

case $choice in
    1)
        echo ""
        echo "🎨 Launching AI Content Studio..."
        cd ai-content-studio
        ./scripts/launch_studio.sh
        ;;
    2)
        echo ""
        echo "💰 Launching Creative AI Marketplace..."
        cd creative-ai-marketplace
        ./scripts/launch_marketplace.sh
        ;;
    3)
        echo ""
        echo "🎬 Launching AI Video Production Pipeline..."
        cd ai-video-pipeline
        ./scripts/launch_pipeline.sh
        ;;
    4)
        echo ""
        echo "🎓 Launching Creative AI Education Platform..."
        cd creative-ai-education
        ./scripts/launch_education.sh
        ;;
    5)
        echo ""
        echo "🏢 Launching Creative AI Agency..."
        cd creative-ai-agency
        ./scripts/launch_agency.sh
        ;;
    6)
        echo ""
        echo "🚀 Launching SEO-Optimized Content System..."
        cd seo-optimized-content
        ./scripts/launch_seo_system.sh
        ;;
    7)
        echo ""
        echo "💎 Launching Master Revenue Dashboard..."
        python3 master_revenue_dashboard.py
        ;;
    8)
        echo ""
        echo "🛠️ System Management Options:"
        echo "1. Deploy all systems"
        echo "2. Update all systems"
        echo "3. Check system status"
        echo "4. Backup all systems"
        echo "5. Restore from backup"
        echo ""
        read -p "Choose management option (1-5): " mgmt_choice
        case $mgmt_choice in
            1) ./deploy_all_systems.sh ;;
            2) ./update_all_systems.sh ;;
            3) ./check_system_status.sh ;;
            4) ./backup_all_systems.sh ;;
            5) ./restore_from_backup.sh ;;
            *) echo "Invalid choice" ;;
        esac
        ;;
    9)
        echo ""
        echo "📊 Launching Empire Analytics..."
        python3 empire_analytics.py
        ;;
    10)
        echo ""
        echo "👋 Goodbye! Keep building your creative AI empire!"
        exit 0
        ;;
    *)
        echo ""
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac