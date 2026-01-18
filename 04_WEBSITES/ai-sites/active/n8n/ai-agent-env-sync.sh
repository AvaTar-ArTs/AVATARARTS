#!/bin/bash
# AI Agent Environment Sync
# =========================
# Syncs environment from ~/.env.d to AI agent Docker stack

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔄 AI Agent Environment Sync${NC}"
echo "================================="

# Check if ~/.env.d exists
if [ ! -d "$HOME/.env.d" ]; then
    echo -e "${RED}❌ ~/.env.d directory not found${NC}"
    echo -e "${YELLOW}   Please set up your modular environment system first${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Found ~/.env.d directory${NC}"

# Load environment from ~/.env.d
echo -e "${BLUE}🔄 Loading environment from ~/.env.d...${NC}"

# Source the loader to get all environment variables
source "$HOME/.env.d/loader.sh"

# Generate Docker environment file
echo -e "${BLUE}🐳 Generating Docker environment file...${NC}"

# Create .env file with all loaded variables
cat > .env << EOF
# AI Agent Docker Environment
# Generated from ~/.env.d on $(date)
# Auto-synced environment variables

# Database Configuration
POSTGRES_DB=${POSTGRES_DB:-n8n}
POSTGRES_USER=${POSTGRES_USER:-n8n}
POSTGRES_PASSWORD=${POSTGRES_PASSWORD:-your_secure_postgres_password_here}

# n8n Configuration
N8N_ENCRYPTION_KEY=${N8N_ENCRYPTION_KEY:-your_n8n_encryption_key_here}
TZ=${TZ:-America/New_York}
GENERIC_TIMEZONE=${GENERIC_TIMEZONE:-America/New_York}
N8N_SECURE_COOKIE=true
N8N_PROXY_HOPS=1

# AI API Keys - Core LLMs
OPENAI_API_KEY=${OPENAI_API_KEY:-your_openai_api_key_here}
ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY:-your_anthropic_api_key_here}
GROQ_API_KEY=${GROQ_API_KEY:-your_groq_api_key_here}
XAI_API_KEY=${XAI_API_KEY:-your_xai_api_key_here}
DEEPSEEK_API_KEY=${DEEPSEEK_API_KEY:-your_deepseek_api_key_here}

# Audio & Music APIs
ELEVENLABS_API_KEY=${ELEVENLABS_API_KEY:-your_elevenlabs_api_key_here}
SUNO_COOKIE=${SUNO_COOKIE:-your_suno_cookie_here}
ASSEMBLYAI_API_KEY=${ASSEMBLYAI_API_KEY:-your_assemblyai_api_key_here}
DEEPGRAM_API_KEY=${DEEPGRAM_API_KEY:-your_deepgram_api_key_here}

# Art & Vision APIs
STABILITY_API_KEY=${STABILITY_API_KEY:-your_stability_api_key_here}
REPLICATE_API_TOKEN=${REPLICATE_API_TOKEN:-your_replicate_api_token_here}
RUNWAY_API_KEY=${RUNWAY_API_KEY:-your_runway_api_key_here}
LEONARDO_API_KEY=${LEONARDO_API_KEY:-your_leonardo_api_key_here}

# Automation & Agents APIs
PINECONE_API_KEY=${PINECONE_API_KEY:-your_pinecone_api_key_here}
OPENROUTER_API_KEY=${OPENROUTER_API_KEY:-your_openrouter_api_key_here}
COHERE_API_KEY=${COHERE_API_KEY:-your_cohere_api_key_here}
FIREWORKS_API_KEY=${FIREWORKS_API_KEY:-your_fireworks_api_key_here}
LANGSMITH_API_KEY=${LANGSMITH_API_KEY:-your_langsmith_api_key_here}

# Documents & Knowledge APIs
NOTION_TOKEN=${NOTION_TOKEN:-your_notion_token_here}

# SEO & Analytics APIs
SERPAPI_KEY=${SERPAPI_KEY:-your_serpapi_key_here}
NEWSAPI_KEY=${NEWSAPI_KEY:-your_newsapi_key_here}

# Server Configuration
FLASK_ENV=production
FLASK_DEBUG=false
LOG_LEVEL=INFO

# Webhook URLs
N8N_WEBHOOK_URL=http://n8n:5678
AI_AGENT_URL=http://ai-agent:5000
CONTENT_RESEARCH_URL=http://content-research:5001

# File Paths
DOCUMENTS_PATH=/Users/steven/Documents
RESEARCH_OUTPUT_PATH=/app/research
LOCAL_FILES_PATH=./local-files

# Monitoring (Optional)
GRAFANA_PASSWORD=${GRAFANA_PASSWORD:-admin}
PROMETHEUS_RETENTION=200h
EOF

# Set secure permissions
chmod 600 .env

echo -e "${GREEN}✅ Docker environment file created: .env${NC}"

# Validate API keys
echo -e "${BLUE}🔍 Validating API keys...${NC}"

# Count configured API keys
configured_keys=0
missing_keys=0

# Check core LLM APIs
for key in OPENAI_API_KEY ANTHROPIC_API_KEY GROQ_API_KEY XAI_API_KEY DEEPSEEK_API_KEY; do
    if [ -n "${!key:-}" ] && [ "${!key}" != "your_${key,,}_here" ]; then
        ((configured_keys++))
        echo -e "  ${GREEN}✅${NC} $key"
    else
        ((missing_keys++))
        echo -e "  ${YELLOW}⚠️${NC} $key (missing)"
    fi
done

# Check other important APIs
for key in ELEVENLABS_API_KEY STABILITY_API_KEY SERPAPI_KEY NEWSAPI_KEY; do
    if [ -n "${!key:-}" ] && [ "${!key}" != "your_${key,,}_here" ]; then
        ((configured_keys++))
        echo -e "  ${GREEN}✅${NC} $key"
    else
        ((missing_keys++))
        echo -e "  ${YELLOW}⚠️${NC} $key (missing)"
    fi
done

echo ""
echo -e "${BLUE}📊 Environment Summary:${NC}"
echo -e "  ${GREEN}✅ Configured: $configured_keys keys${NC}"
echo -e "  ${YELLOW}⚠️  Missing: $missing_keys keys${NC}"

if [ $missing_keys -eq 0 ]; then
    echo -e "${GREEN}🎉 All API keys are configured! Ready for deployment.${NC}"
else
    echo -e "${YELLOW}⚠️  Some API keys are missing. The system will work with available keys.${NC}"
fi

# Show next steps
echo ""
echo -e "${BLUE}📋 Next Steps:${NC}"
echo -e "  1. Review the generated .env file"
echo -e "  2. Add any missing API keys if needed"
echo -e "  3. Run: ./start-ai-agent.sh"
echo -e "  4. Import workflows: ./import-workflows.sh"
echo ""
echo -e "${GREEN}🚀 Environment sync complete!${NC}"