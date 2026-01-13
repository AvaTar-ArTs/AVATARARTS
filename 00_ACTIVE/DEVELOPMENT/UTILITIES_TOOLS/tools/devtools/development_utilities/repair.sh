#!/bin/zsh
# ============================================
# Python Code Repair & Quality Check Script
# ============================================

PROJECT_DIR="/Users/Steven/Documents/python"
BACKUP_DIR="/Users/Steven/Documents/python-Backup-$(date +%Y%m%d-%H%M%S)"

echo "🔄 Backing up project..."
# rsync -av --progress "$PROJECT_DIR/" "$BACKUP_DIR/"

echo "🎨 Formatting with Black..."
black "$PROJECT_DIR"

echo "📚 Sorting imports with isort..."
isort "$PROJECT_DIR"

echo "🔍 Linting with Flake8..."
flake8 "$PROJECT_DIR" --count --statistics --show-source || true

echo "🧠 Running Pylint (deep analysis)..."
pylint "$PROJECT_DIR" || true

echo "📈 Checking complexity with Radon..."
radon cc "$PROJECT_DIR" -nc

echo "🔎 Running type checks with mypy..."
mypy "$PROJECT_DIR" || true

echo "📖 Generating documentation..."
pdoc --html "$PROJECT_DIR" -o "$PROJECT_DIR/docs/" --force

echo "✅ Repair complete. Backup stored at $BACKUP_DIR"

