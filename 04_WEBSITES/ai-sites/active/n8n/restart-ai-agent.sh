#!/bin/bash
# AI Agent Restart Script
# =======================
# Clean restart of the AI agent system

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔄 AI Agent Restart${NC}"
echo "=================="

# Step 1: Clear all ports
echo -e "${BLUE}🧹 Step 1: Clearing ports...${NC}"
./clear-all-ports.sh

echo ""

# Step 2: Activate Mamba environment
echo -e "${BLUE}🐍 Step 2: Activating Mamba environment...${NC}"
eval "$(mamba shell hook --shell bash)"
mamba activate ai-agent

echo -e "${GREEN}✅ Mamba environment activated${NC}"

# Step 3: Load environment
echo -e "${BLUE}🔧 Step 3: Loading environment...${NC}"
if python env-loader.py > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Environment loaded from ~/.env.d${NC}"
else
    echo -e "${YELLOW}⚠️  Some API keys may be missing. Continuing anyway...${NC}"
fi

# Step 4: Check API status
echo -e "${BLUE}🔍 Step 4: Checking API status...${NC}"
./check-api-status-simple.sh

# Step 5: Start AI agent
echo -e "${BLUE}🚀 Step 5: Starting AI agent server...${NC}"
echo -e "${CYAN}   Server will run on: http://localhost:9000${NC}"
echo -e "${CYAN}   Press Ctrl+C to stop${NC}"
echo ""

# Start the server
python ai-agent-server-local.py