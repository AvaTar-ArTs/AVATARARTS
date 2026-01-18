#!/bin/bash

# 🛠️ Master AI Sites Environment Setup
# Sets up the complete environment for all revenue systems across the digital empire

echo "🛠️ Setting up Master AI Sites Environment"
echo "=========================================="

# Check if we're in the right directory
if [ ! -f "master_launcher.sh" ]; then
    echo "❌ Error: Please run this script from the ai-sites directory"
    echo "   cd /Users/steven/ai-sites"
    exit 1
fi

echo "📁 Creating necessary directories..."
mkdir -p databases
mkdir -p logs
mkdir -p backups
mkdir -p documentation
mkdir -p config
mkdir -p analytics

echo "🔧 Setting up master environment configuration..."
if [ ! -f ".env" ]; then
    cat > .env << 'EOF'
# Master AI Sites Configuration
# Digital Empire Environment Settings

# OpenAI API Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Database Configuration
MASTER_DB_PATH=databases/master_revenue.db
PASSIVE_INCOME_DB_PATH=passive-income-empire/databases/
AVATARARTS_DB_PATH=AvaTarArTs/databases/
CLEANCONNECT_DB_PATH=cleanconnect-pro/databases/

# Revenue Goals
EMPIRE_MONTHLY_GOAL=100000
EMPIRE_DAILY_GOAL=3333
EMPIRE_WEEKLY_GOAL=25000

# System Configuration
AUTO_DEPLOY=true
AUTO_BACKUP=true
AUTO_ANALYTICS=true

# Marketing Configuration
SOCIAL_MEDIA_AUTO_POST=true
SEO_AUTO_OPTIMIZE=true
CONTENT_AUTO_GENERATE=true

# Security Configuration
ENCRYPT_DATABASES=true
BACKUP_FREQUENCY=daily
LOG_RETENTION_DAYS=365
EOF
    echo "✅ Created master .env file"
    echo "⚠️  Please edit .env file with your actual API keys and settings"
else
    echo "✅ .env file already exists"
fi

echo "🐍 Installing Python dependencies..."
if command -v pip3 &> /dev/null; then
    # Install master dependencies
    pip3 install openai python-dotenv schedule requests sqlite3
    
    # Install passive income empire dependencies
    if [ -f "passive-income-empire/requirements.txt" ]; then
        pip3 install -r passive-income-empire/requirements.txt
    fi
    
    echo "✅ Python dependencies installed"
else
    echo "❌ pip3 not found. Please install Python 3 with pip"
    exit 1
fi

echo "📦 Installing Node.js dependencies..."
if command -v npm &> /dev/null; then
    # Install dependencies for each system
    if [ -d "AvaTarArTs/avatararts-portfolio" ]; then
        cd AvaTarArTs/avatararts-portfolio
        npm install
        cd ../..
    fi
    
    if [ -d "cleanconnect-pro" ]; then
        cd cleanconnect-pro
        npm install
        cd ..
    fi
    
    echo "✅ Node.js dependencies installed"
else
    echo "⚠️  npm not found. Please install Node.js"
fi

echo "🗄️ Initializing databases..."
python3 -c "
import sqlite3
import os

# Create master revenue database
os.makedirs('databases', exist_ok=True)
conn = sqlite3.connect('databases/master_revenue.db')
cursor = conn.cursor()

cursor.execute('''
    CREATE TABLE IF NOT EXISTS system_revenue (
        id TEXT PRIMARY KEY,
        system_name TEXT NOT NULL,
        monthly_revenue REAL DEFAULT 0.0,
        daily_revenue REAL DEFAULT 0.0,
        weekly_revenue REAL DEFAULT 0.0,
        total_revenue REAL DEFAULT 0.0,
        growth_rate REAL DEFAULT 0.0,
        status TEXT DEFAULT 'active',
        last_updated TEXT,
        created_at TEXT
    )
''')

cursor.execute('''
    CREATE TABLE IF NOT EXISTS empire_goals (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        target_amount REAL NOT NULL,
        current_amount REAL DEFAULT 0.0,
        deadline TEXT,
        priority TEXT DEFAULT 'medium',
        status TEXT DEFAULT 'active',
        created_at TEXT,
        updated_at TEXT
    )
''')

conn.commit()
conn.close()
print('✅ Master revenue database initialized')
"

echo "📊 Setting up analytics..."
mkdir -p analytics/daily
mkdir -p analytics/weekly
mkdir -p analytics/monthly
mkdir -p analytics/yearly

echo "🔄 Setting up automation..."
mkdir -p automation/scripts
mkdir -p automation/workflows
mkdir -p automation/schedules

echo "📚 Setting up documentation..."
mkdir -p documentation/guides
mkdir -p documentation/api
mkdir -p documentation/tutorials

echo "🎉 Master environment setup complete!"
echo ""
echo "🚀 Next steps:"
echo "   1. Edit .env file with your API keys"
echo "   2. Run: ./master_launcher.sh"
echo "   3. Choose your revenue system"
echo "   4. Start generating income!"
echo ""
echo "💰 Ready to build your digital empire!"