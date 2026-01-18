#!/bin/bash

# 🛠️ Passive Income Empire - Environment Setup
# Sets up the complete environment for all revenue systems

echo "🛠️ Setting up Passive Income Empire Environment"
echo "=============================================="

# Check if we're in the right directory
if [ ! -f "launch_empire.sh" ]; then
    echo "❌ Error: Please run this script from the passive-income-empire directory"
    echo "   cd /Users/steven/ai-sites/passive-income-empire"
    exit 1
fi

echo "📁 Creating necessary directories..."
mkdir -p databases
mkdir -p seo_content
mkdir -p social_media_posts
mkdir -p affiliate_links
mkdir -p analytics
mkdir -p logs

echo "🔧 Setting up environment configuration..."
if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo "✅ Created .env file from template"
        echo "⚠️  Please edit .env file with your actual API keys and settings"
    else
        echo "❌ .env.example file not found"
        exit 1
    fi
else
    echo "✅ .env file already exists"
fi

echo "🐍 Installing Python dependencies..."
if command -v pip3 &> /dev/null; then
    pip3 install -r ai-recipe-generator/requirements.txt
    pip3 install -r ai-receptionist/requirements_ai_receptionist.txt
    echo "✅ Python dependencies installed"
else
    echo "❌ pip3 not found. Please install Python 3 with pip"
    exit 1
fi

echo "🔑 Setting up OpenAI API key..."
if [ -f "~/.env.d/llm-apis.env" ]; then
    echo "✅ OpenAI API key configuration found"
else
    echo "⚠️  OpenAI API key not found in ~/.env.d/llm-apis.env"
    echo "   Please add your OpenAI API key to the .env file"
fi

echo "🗄️ Initializing databases..."
cd ai-recipe-generator
python3 -c "from ai_recipe_generator import AIRecipeGenerator; gen = AIRecipeGenerator(); print('✅ Recipe database initialized')"
cd ../ai-receptionist
python3 -c "from ai_receptionist import AIReceptionist; rec = AIReceptionist(); print('✅ Receptionist database initialized')"
cd ..

echo "📊 Setting up analytics..."
mkdir -p analytics/daily
mkdir -p analytics/weekly
mkdir -p analytics/monthly

echo "🎉 Environment setup complete!"
echo ""
echo "🚀 Next steps:"
echo "   1. Edit .env file with your API keys"
echo "   2. Run: ./launch_empire.sh"
echo "   3. Choose your revenue system"
echo "   4. Start generating income!"
echo ""
echo "💰 Ready to build your passive income empire!"