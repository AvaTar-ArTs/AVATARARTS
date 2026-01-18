#!/bin/bash
# NotebookLM v3.0 Installation Script

set -e

echo "🚀 NotebookLM v3.0 - Installation"
echo "================================="
echo ""

# Check Python version
echo "📋 Checking Python version..."
python_version=$(python3 --version 2>&1 | awk '{print $2}')
echo "   Found: Python $python_version"

# Check if Python >= 3.8
required_version="3.8"
if ! python3 -c "import sys; exit(0 if sys.version_info >= (3, 8) else 1)"; then
    echo "❌ Error: Python 3.8 or higher is required"
    echo "   Please upgrade Python and try again"
    exit 1
fi

echo "   ✅ Python version OK"
echo ""

# Create virtual environment
echo "📦 Creating virtual environment..."
if [ -d ".venv" ]; then
    echo "   ⚠️  Virtual environment already exists"
    read -p "   Delete and recreate? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        rm -rf .venv
        python3 -m venv .venv
        echo "   ✅ Virtual environment recreated"
    else
        echo "   ✅ Using existing virtual environment"
    fi
else
    python3 -m venv .venv
    echo "   ✅ Virtual environment created"
fi

echo ""

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source .venv/bin/activate
echo "   ✅ Virtual environment activated"
echo ""

# Upgrade pip
echo "⬆️  Upgrading pip..."
pip install --upgrade pip --quiet
echo "   ✅ pip upgraded"
echo ""

# Install package
echo "📥 Installing NotebookLM..."
pip install -e . --quiet
echo "   ✅ NotebookLM installed"
echo ""

# Install Chrome for Patchright
echo "🌐 Installing Chrome for Patchright..."
patchright install chrome
echo "   ✅ Chrome installed"
echo ""

# Create .env file
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "   ✅ .env file created"
    echo "   ⚠️  Please edit .env with your settings"
else
    echo "📝 .env file already exists"
fi

echo ""

# Create data directories
echo "📁 Creating data directories..."
mkdir -p data/profiles data/cache logs
echo "   ✅ Data directories created"
echo ""

# Verify installation
echo "✅ Verifying installation..."
if command -v nlm &> /dev/null; then
    echo "   ✅ nlm command available"
    nlm --version
else
    echo "   ⚠️  nlm command not found in PATH"
    echo "   Run: source .venv/bin/activate"
fi

echo ""
echo "🎉 Installation complete!"
echo ""
echo "Next steps:"
echo "  1. Edit .env file: nano .env"
echo "  2. Activate venv: source .venv/bin/activate"
echo "  3. Test installation: nlm --version"
echo "  4. Authenticate: nlm auth login"
echo "  5. Get started: nlm --help"
echo ""
echo "Documentation: /Users/steven/AVATARARTS/notebookLM/docs/"
echo ""
