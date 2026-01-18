#!/bin/bash

# 🎬 AI Video Production Pipeline Launcher
# Launches the complete video production system

echo "🎬 AI Video Production Pipeline - Automated Video Creation System"
echo "==============================================================="

# Check if we're in the right directory
if [ ! -f "core/video_generator/sora_integration.py" ]; then
    echo "❌ Error: Please run this script from the ai-video-pipeline directory"
    echo "   cd /Users/steven/ai-sites/ai-video-pipeline"
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
mkdir -p output/raw_videos
mkdir -p output/edited_videos
mkdir -p output/final_deliverables
mkdir -p output/social_media
mkdir -p databases
mkdir -p logs
mkdir -p assets/templates
mkdir -p assets/music_library
mkdir -p assets/voice_samples

# Initialize database
echo "🗄️ Initializing video database..."
python3 scripts/init_video_db.py

echo ""
echo "🚀 AI Video Production Pipeline is ready!"
echo ""
echo "Available commands:"
echo "  python3 scripts/generate_video.py --script='Tech startup pitch' --style='professional'"
echo "  python3 scripts/batch_process.py --input=scripts/ --output=videos/"
echo "  python3 scripts/quality_check.py --video=output/final_deliverables/"
echo "  python3 scripts/export_social.py --platform=instagram --format=reel"
echo ""
echo "🎬 Ready to create professional videos at scale!"