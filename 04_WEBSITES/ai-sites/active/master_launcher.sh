#!/bin/bash

# 🏰 Master AI Sites Launcher - Digital Empire Command Center
# Unified launcher for all revenue-generating systems across ai-sites directory

echo "🏰 Master AI Sites Launcher - Digital Empire Command Center"
echo "=========================================================="
echo "Welcome to your unified digital empire management system!"
echo ""

# Check if we're in the right directory
if [ ! -d "passive-income-empire" ] || [ ! -d "AvaTarArTs" ]; then
    echo "❌ Error: Please run this script from the ai-sites directory"
    echo "   cd /Users/steven/ai-sites"
    exit 1
fi

# Check if environment is set up
if [ ! -f ".env" ]; then
    echo "⚠️  Environment not configured. Running setup..."
    if [ -f "setup_master_environment.sh" ]; then
        ./setup_master_environment.sh
    else
        echo "❌ Master setup script not found. Please run setup manually."
        exit 1
    fi
fi

echo "🚀 Available Revenue Systems:"
echo ""
echo "1. 🍳 Passive Income Empire (HIGHEST REVENUE)"
echo "   Revenue Potential: $25K-50K monthly"
echo "   Systems: AI Recipe Generator, AI Receptionist, Music Licensing"
echo "   Status: Production Ready"
echo ""
echo "2. 🎨 AvatarArts Portfolio (CREATIVE REVENUE)"
echo "   Revenue Potential: $15K-30K monthly"
echo "   Systems: Portfolio, Gallery, Tools, Hub"
echo "   Status: Production Ready"
echo ""
echo "3. 🧹 CleanConnect Pro (BUSINESS AUTOMATION)"
echo "   Revenue Potential: $10K-25K monthly"
echo "   Systems: AI Voice Agent, Lead Generation, Marketplace"
echo "   Status: Production Ready"
echo ""
echo "4. 📊 SEO Master Index (CONSULTING REVENUE)"
echo "   Revenue Potential: $5K-15K monthly"
echo "   Systems: SEO Analysis, Technical SEO, Content Strategy"
echo "   Status: Production Ready"
echo ""
echo "5. ⚡ QuantumForgeLabs (TECHNOLOGY REVENUE)"
echo "   Revenue Potential: $20K-40K monthly"
echo "   Systems: AI Development, Quantum Computing, Automation"
echo "   Status: Development Ready"
echo ""
echo "6. 💰 Master Revenue Dashboard"
echo "   Track and optimize revenue across all systems"
echo "   Real-time analytics and recommendations"
echo ""
echo "7. 🛠️ System Management"
echo "   Deploy, update, and manage all systems"
echo ""
echo "8. 📚 Documentation & Guides"
echo "   Access all documentation and guides"
echo ""
echo "9. 🚪 Exit"
echo ""

read -p "Enter your choice (1-9): " choice

case $choice in
    1)
        echo ""
        echo "🍳 Launching Passive Income Empire..."
        cd passive-income-empire
        ./launch_empire.sh
        ;;
    2)
        echo ""
        echo "🎨 Launching AvatarArts Portfolio..."
        cd AvaTarArTs
        if [ -f "launch_avatararts.sh" ]; then
            ./launch_avatararts.sh
        else
            echo "Launching main portfolio site..."
            cd avatararts-portfolio
            npm run dev
        fi
        ;;
    3)
        echo ""
        echo "🧹 Launching CleanConnect Pro..."
        cd cleanconnect-pro
        if [ -f "launch_cleanconnect.sh" ]; then
            ./launch_cleanconnect.sh
        else
            echo "Starting CleanConnect Pro..."
            yarn dev
        fi
        ;;
    4)
        echo ""
        echo "📊 Launching SEO Master Index..."
        cd 00_SEO_Master_Index.md
        if command -v open &> /dev/null; then
            open 00_SEO_Master_Index.md
        else
            cat 00_SEO_Master_Index.md
        fi
        ;;
    5)
        echo ""
        echo "⚡ Launching QuantumForgeLabs..."
        cd "QuantumForgeLabs Portfolio Starter"
        if [ -f "launch_quantumforge.sh" ]; then
            ./launch_quantumforge.sh
        else
            echo "Starting QuantumForgeLabs..."
            npm run dev
        fi
        ;;
    6)
        echo ""
        echo "💰 Launching Master Revenue Dashboard..."
        python3 master_revenue_dashboard.py
        ;;
    7)
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
    8)
        echo ""
        echo "📚 Opening Documentation..."
        if command -v open &> /dev/null; then
            open documentation/
        else
            ls -la documentation/
        fi
        ;;
    9)
        echo ""
        echo "👋 Goodbye! Keep building your digital empire!"
        exit 0
        ;;
    *)
        echo ""
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac