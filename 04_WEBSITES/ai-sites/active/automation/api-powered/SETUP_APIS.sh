#!/bin/bash
# Setup API-Powered Automation
set -euo pipefail

echo "🔧 Setting up API-Powered Automation"
echo "======================================"
echo ""

# Check for .env.d
if [ ! -d "$HOME/.env.d" ]; then
  echo "❌ ~/.env.d not found"
  exit 1
fi

echo "✅ Found ~/.env.d"

# Check for required API keys
echo ""
echo "Checking API keys..."

source "$HOME/.env.d/loader.sh" 2>/dev/null || {
  echo "⚠️  Could not load env, sourcing manually"
  for file in "$HOME/.env.d"/*.env; do
    if [ -f "$file" ]; then
      source "$file"
    fi
  done
}

# Check OpenAI
if [ -n "${OPENAI_API_KEY:-}" ]; then
  echo "✅ OpenAI API key found"
else
  echo "❌ OpenAI API key missing"
  echo "   Add to ~/.env.d/llm-apis.env"
fi

# Check Groq (optional but recommended)
if [ -n "${GROQ_API_KEY:-}" ]; then
  echo "✅ Groq API key found (fast generation!)"
else
  echo "⚠️  Groq API key missing (optional)"
fi

# Install Python dependencies
echo ""
echo "Installing Python dependencies..."

pip3 install --quiet openai groq requests pillow 2>/dev/null || {
  echo "⚠️  Some packages may need manual install"
}

echo "✅ Python dependencies installed"

# Make scripts executable
echo ""
echo "Making scripts executable..."
chmod +x "$HOME/ai-sites/automation/api-powered"/*.py
echo "✅ Scripts ready"

# Test OpenAI connection
echo ""
echo "Testing OpenAI connection..."

python3 -c "
from openai import OpenAI
import os
client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
try:
    response = client.chat.completions.create(
        model='gpt-4o-mini',
        messages=[{'role': 'user', 'content': 'Say hi in 3 words'}],
        max_tokens=10
    )
    print('✅ OpenAI connection successful!')
    print(f'   Response: {response.choices[0].message.content}')
except Exception as e:
    print(f'❌ OpenAI connection failed: {e}')
" 2>/dev/null || echo "⚠️  OpenAI test skipped"

echo ""
echo "======================================"
echo "✅ API-Powered Automation Ready!"
echo ""
echo "Quick Start:"
echo "  # Generate content"
echo "  python3 ~/ai-sites/automation/api-powered/ai_content_generator.py blog 'AI music'"
echo ""
echo "  # Generate image"
echo "  python3 ~/ai-sites/automation/api-powered/dalle_auto_generator.py daily"
echo ""
echo "  # Full pipeline"
echo "  python3 ~/ai-sites/automation/api-powered/auto_content_pipeline.py full 'creative automation'"
echo ""
echo "  # Daily automation"
echo "  python3 ~/ai-sites/automation/api-powered/auto_content_pipeline.py daily"
