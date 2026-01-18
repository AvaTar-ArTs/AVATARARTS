#!/bin/bash
# Apify Deployment Setup Script

echo "🚀 Setting up Enterprise AI Agents for Apify deployment..."

# Create src directory
mkdir -p src .actor

# Copy main.py
echo "📋 Copying main.py..."
cp main.py src/main.py

# Copy agent files from AUTOMATION directory
echo "📋 Copying agent files..."
cp ../../../AUTOMATION/enterprise_ai_agents/agent_base.py src/ 2>/dev/null || echo "⚠️  agent_base.py not found"
cp ../../../AUTOMATION/enterprise_ai_agents/enterprise_agents.py src/ 2>/dev/null || echo "⚠️  enterprise_agents.py not found"
cp ../../../AUTOMATION/enterprise_ai_agents/agent_orchestrator.py src/ 2>/dev/null || echo "⚠️  agent_orchestrator.py not found"
cp ../../../AUTOMATION/enterprise_ai_agents/requirements.txt src/ 2>/dev/null || echo "⚠️  requirements.txt not found"

# Update main.py to remove sys.path manipulation
echo "🔧 Updating main.py imports..."
sed -i '' '/sys.path.insert/d' src/main.py
sed -i '' '/Add enterprise agents to path/d' src/main.py

# Create .actor/actor.json if it doesn't exist
if [ ! -f .actor/actor.json ]; then
  echo "📝 Creating .actor/actor.json..."
  cat > .actor/actor.json << 'JSON'
{
  "actorSpecification": 1,
  "name": "enterprise-ai-agents",
  "title": "Enterprise AI Agents Framework",
  "description": "Multi-agent orchestration system for enterprise automation. Research, content generation, automation, analytics, and integration agents.",
  "version": "1.0.0",
  "readme": "./README.md"
}
JSON
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Review src/main.py imports"
echo "2. Test locally: apify run"
echo "3. Deploy: apify push"
