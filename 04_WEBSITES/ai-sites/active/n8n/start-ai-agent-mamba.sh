#!/bin/bash
# AI Agent Mamba Startup
# ======================
# Starts the AI agent using the Mamba environment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${BLUE}🤖 AI Agent Mamba Startup${NC}"
echo "=========================="

# Check if Mamba is available
if ! command -v mamba &> /dev/null; then
    echo -e "${RED}❌ Mamba is not installed${NC}"
    echo -e "${YELLOW}   Please run: ./install-with-mamba.sh${NC}"
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "ai-agent-server-local.py" ]; then
    echo -e "${RED}❌ Please run this script from the n8n directory${NC}"
    exit 1
fi

# Activate the AI agent environment
echo -e "${BLUE}🔄 Activating AI agent environment...${NC}"
eval "$(mamba shell hook --shell bash)"
mamba activate ai-agent

echo -e "${GREEN}✅ Environment activated${NC}"

# Load environment from ~/.env.d
echo -e "${BLUE}🔄 Loading environment from ~/.env.d...${NC}"
if python env-loader.py > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Environment loaded from ~/.env.d${NC}"
else
    echo -e "${YELLOW}⚠️  Some API keys may be missing. Continuing anyway...${NC}"
fi

# Check API status
echo -e "${BLUE}🔍 Checking API status...${NC}"
./check-api-status-simple.sh

# Create necessary directories
echo -e "${BLUE}📁 Creating directories...${NC}"
mkdir -p data logs research n8n-data/{backups,logs} local-files

# Start the AI Agent Server
echo -e "${BLUE}🚀 Starting AI Agent Server...${NC}"
echo -e "${CYAN}   Server will run on: http://localhost:9000${NC}"
echo -e "${CYAN}   Press Ctrl+C to stop${NC}"
echo ""

# Start the server
python ai-agent-server-local.py