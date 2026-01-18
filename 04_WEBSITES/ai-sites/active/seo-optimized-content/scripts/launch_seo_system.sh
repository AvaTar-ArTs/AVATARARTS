#!/bin/bash

# 🚀 SEO-Optimized Content System Launcher
# Launches the complete SEO content generation system

echo "🚀 SEO-Optimized Content - Top 1-5% Trending Keywords"
echo "====================================================="

# Check if we're in the right directory
if [ ! -f "content_generation/trending_content_generator.py" ]; then
    echo "❌ Error: Please run this script from the seo-optimized-content directory"
    echo "   cd /Users/steven/ai-sites/seo-optimized-content"
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
mkdir -p output/blog_posts
mkdir -p output/articles
mkdir -p output/video_scripts
mkdir -p output/social_content
mkdir -p databases
mkdir -p logs
mkdir -p analytics
mkdir -p content_templates

# Initialize database
echo "🗄️ Initializing SEO content database..."
python3 scripts/init_seo_db.py

echo ""
echo "🚀 SEO-Optimized Content System is ready!"
echo ""
echo "Available commands:"
echo "  python3 scripts/generate_content.py --keyword='AI content generation' --type='blog_post'"
echo "  python3 scripts/optimize_content.py --url='https://yoursite.com/article' --keyword='AI automation'"
echo "  python3 scripts/track_rankings.py --keywords='AI content generation,AI art generator'"
echo "  python3 scripts/batch_generate.py --keywords='AI,automation,content' --count=10"
echo ""
echo "🚀 Ready to dominate search results!"