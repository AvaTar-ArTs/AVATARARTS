#!/bin/bash

# 💰 Creative AI Marketplace Launcher
# Launches the complete marketplace system

echo "💰 Creative AI Marketplace - Multi-Platform Content Monetization"
echo "==============================================================="

# Check if we're in the right directory
if [ ! -f "core/nft_generator/nft_creator.py" ]; then
    echo "❌ Error: Please run this script from the creative-ai-marketplace directory"
    echo "   cd /Users/steven/ai-sites/creative-ai-marketplace"
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
mkdir -p output/nfts
mkdir -p output/products
mkdir -p output/listings
mkdir -p output/reports
mkdir -p databases
mkdir -p logs
mkdir -p content/ai_generated
mkdir -p content/curated_collections

# Initialize database
echo "🗄️ Initializing marketplace database..."
python3 scripts/init_marketplace_db.py

echo ""
echo "🚀 Creative AI Marketplace is ready!"
echo ""
echo "Available commands:"
echo "  python3 scripts/generate_nfts.py --collection='Digital Art' --count=100"
echo "  python3 scripts/sync_platforms.py --platform=opensea"
echo "  python3 scripts/sales_analyzer.py --period=monthly"
echo "  python3 scripts/create_products.py --type=print-on-demand"
echo ""
echo "💰 Ready to monetize your AI content!"