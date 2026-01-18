#!/bin/bash

# 🏢 Creative AI Agency Launcher
# Launches the complete agency management system

echo "🏢 Creative AI Agency - Client Management & Automation System"
echo "============================================================"

# Check if we're in the right directory
if [ ! -f "core/client_management/crm_system.py" ]; then
    echo "❌ Error: Please run this script from the creative-ai-agency directory"
    echo "   cd /Users/steven/ai-sites/creative-ai-agency"
    exit 1
fi

# Check Python installation
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required but not installed"
    exit 1
fi

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "📥 Installing dependencies..."
pip install -r requirements.txt

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please edit .env file with your API keys"
fi

# Create necessary directories
echo "📁 Creating output directories..."
mkdir -p output/client_deliverables
mkdir -p output/project_reports
mkdir -p output/invoices
mkdir -p output/contracts
mkdir -p databases
mkdir -p logs
mkdir -p client_portal
mkdir -p team_portal

# Initialize database
echo "🗄️ Initializing agency database..."
python3 scripts/init_agency_db.py

echo ""
echo "🚀 Creative AI Agency is ready!"
echo ""
echo "Available commands:"
echo "  python3 scripts/create_project.py --client='Tech Startup' --service='Content Creation'"
echo "  python3 scripts/generate_invoice.py --project='Tech Startup Content' --amount=5000"
echo "  python3 scripts/client_report.py --client='Tech Startup' --period=monthly"
echo "  python3 scripts/launch_portal.py --type=client --port=8000"
echo ""
echo "🏢 Ready to scale your creative services!"