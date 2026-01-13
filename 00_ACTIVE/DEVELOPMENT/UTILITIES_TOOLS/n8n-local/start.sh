#!/bin/bash
# Quick start script for n8n

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "🚀 Starting n8n..."
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env from .env.example..."
    cp .env.example .env
    echo "⚠️  Please edit .env and set your password!"
    echo ""
fi

# Start n8n
docker-compose up -d

echo ""
echo "✅ n8n is starting..."
echo ""
echo "🌐 Access n8n at: http://localhost:5678"
echo ""
echo "📊 To monitor disk usage: python docker-disk-monitor.py"
echo "🧹 To clean up Docker: python docker-cleanup.py"
echo ""
echo "📋 View logs: docker-compose logs -f n8n"
echo "🛑 Stop n8n: docker-compose down"
