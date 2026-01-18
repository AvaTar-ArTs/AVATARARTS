#!/bin/bash
# AvaTarArTs Suite - Environment Loader
# Integrates with ~/.env.d/ API key management

echo "🔑 Loading AvaTarArTs Suite Environment..."

# Check if ~/.env.d/ exists
if [ ! -d "$HOME/.env.d" ]; then
    echo "❌ Error: ~/.env.d/ directory not found"
    echo "   Please set up your environment configuration first"
    exit 1
fi

# Load the main environment loader
if [ -f "$HOME/.env.d/loader.sh" ]; then
    source "$HOME/.env.d/loader.sh"
    echo "✅ Loaded API keys from ~/.env.d/"
else
    echo "❌ Error: ~/.env.d/loader.sh not found"
    exit 1
fi

# Display loaded APIs
echo ""
echo "📊 API Keys Loaded:"
env | grep -E "API_KEY|API_TOKEN" | cut -d= -f1 | sort | sed 's/^/   ✓ /'

echo ""
echo "🚀 AvaTarArTs Suite environment ready!"
echo ""
echo "Quick commands:"
echo "  • cd media/audio     - Audio processing tools"
echo "  • cd media/image     - Image processing tools"
echo "  • cd automation/     - Automation & API integrations"
echo "  • cd utilities/      - System utilities"
echo ""
