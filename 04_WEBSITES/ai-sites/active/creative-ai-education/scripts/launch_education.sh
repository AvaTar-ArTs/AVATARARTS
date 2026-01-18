#!/bin/bash

# 🎓 Creative AI Education Platform Launcher
# Launches the complete education platform

echo "🎓 Creative AI Education Platform - AI-Powered Learning System"
echo "============================================================="

# Check if we're in the right directory
if [ ! -f "core/course_generator/ai_course_creator.py" ]; then
    echo "❌ Error: Please run this script from the creative-ai-education directory"
    echo "   cd /Users/steven/ai-sites/creative-ai-education"
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
mkdir -p output/courses
mkdir -p output/certificates
mkdir -p output/reports
mkdir -p output/analytics
mkdir -p databases
mkdir -p logs
mkdir -p content/courses
mkdir -p content/tutorials
mkdir -p content/assessments

# Initialize database
echo "🗄️ Initializing education database..."
python3 scripts/init_education_db.py

echo ""
echo "🚀 Creative AI Education Platform is ready!"
echo ""
echo "Available commands:"
echo "  python3 scripts/generate_course.py --topic='AI Content Creation' --level='beginner'"
echo "  python3 scripts/create_assessment.py --course='AI Content Creation' --type='quiz'"
echo "  python3 scripts/analytics_report.py --period=monthly"
echo "  python3 scripts/launch_platform.py --port=8000"
echo ""
echo "🎓 Ready to democratize AI education!"