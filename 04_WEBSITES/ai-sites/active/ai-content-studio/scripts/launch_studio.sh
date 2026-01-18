#!/bin/bash

# 🎨 AI Content Studio Launcher
# Launches the complete AI Content Studio system

echo "🎨 AI Content Studio - Multi-AI Content Generation Platform"
echo "=========================================================="

# Check if we're in the right directory
if [ ! -f "core/ai_integrations/multi_ai_client.py" ]; then
    echo "❌ Error: Please run this script from the ai-content-studio directory"
    echo "   cd /Users/steven/ai-sites/ai-content-studio"
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
mkdir -p output/images
mkdir -p output/videos
mkdir -p output/music
mkdir -p output/text
mkdir -p output/audio
mkdir -p databases
mkdir -p logs

# Initialize database
echo "🗄️ Initializing database..."
python3 scripts/init_database.py

echo ""
echo "🚀 AI Content Studio is ready!"
echo ""
echo "Available commands:"
echo "  python3 scripts/batch_generate.py --type=images --count=100"
echo "  python3 scripts/content_organizer.py --organize-by=date"
echo "  python3 scripts/quality_checker.py --check-all"
echo ""
echo "🎯 Ready to generate content at scale!"