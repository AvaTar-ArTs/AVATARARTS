#!/bin/bash
# Quick deployment script for Enterprise AI Agents Actor

cd "$(dirname "$0")"

echo "🚀 Deploying Enterprise AI Agents to Apify..."
echo ""

# Set token
export APIFY_TOKEN="[REDACTED]"

# Verify authentication
echo "🔐 Verifying authentication..."
apify info >/dev/null 2>&1 || {
    echo "❌ Authentication failed. Please check your token."
    exit 1
}
echo "✅ Authenticated as: $(apify info 2>/dev/null | grep username | cut -d: -f2 | tr -d ' ' || echo 'avatararts')"

echo ""
echo "📦 Deploying actor..."
apify push

echo ""
echo "✅ Deployment complete!"
echo ""
echo "Next steps:"
echo "1. Go to https://console.apify.com/actors"
echo "2. Find 'enterprise-ai-agents' in My Actors"
echo "3. Configure pricing (Pay-per-Result: \$1.00-2.00)"
echo "4. Publish to store"