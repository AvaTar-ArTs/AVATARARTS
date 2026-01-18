#!/bin/bash
# AVATARARTS Project Initialization Script

set -e

echo "🚀 Initializing AVATARARTS Project..."
echo ""

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Initialize git if not already done
if [ ! -d .git ]; then
    echo "📦 Initializing git repository..."
    git init
    echo "✅ Git repository initialized"
else
    echo "✅ Git repository already exists"
fi

# Create essential directories if they don't exist
echo ""
echo "📁 Ensuring directory structure..."
mkdir -p scripts
mkdir -p logs
mkdir -p .cache

# Set up git hooks directory
mkdir -p .git/hooks

# Make scripts executable
echo ""
echo "🔧 Making scripts executable..."
find scripts -type f -name "*.sh" -exec chmod +x {} \; 2>/dev/null || true
find scripts -type f -name "*.py" -exec chmod +x {} \; 2>/dev/null || true

# Create initial git commit if repository is empty
if [ -d .git ] && [ -z "$(git log --oneline -1 2>/dev/null)" ]; then
    echo ""
    echo "📝 Creating initial commit..."
    git add .gitignore README.md START_HERE.md 2>/dev/null || true
    git commit -m "Initial commit: AVATARARTS consolidated workspace" 2>/dev/null || echo "⚠️  No files to commit yet"
fi

echo ""
echo "✅ AVATARARTS project initialized!"
echo ""
echo "📋 Next steps:"
echo "   1. Review the README.md for project structure"
echo "   2. Check START_HERE.md for getting started guide"
echo "   3. Explore the organized directory structure"
echo ""
echo "Current directory: $(pwd)"
