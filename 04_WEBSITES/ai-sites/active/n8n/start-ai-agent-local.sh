#!/bin/bash
# AI Agent Local Startup (No Docker)
# ===================================
# Runs the AI agent system directly on your machine

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${BLUE}🤖 AI Agent Local Startup (No Docker)${NC}"
echo "=========================================="

# Check if Python 3 is available
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Python 3 is required but not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Python 3 found${NC}"

# Check if we're in the right directory
if [ ! -f "ai-agent-server.py" ]; then
    echo -e "${RED}❌ Please run this script from the n8n directory${NC}"
    exit 1
fi

# Load environment from ~/.env.d
echo -e "${BLUE}🔄 Loading environment from ~/.env.d...${NC}"
if python3 env-loader.py > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Environment loaded from ~/.env.d${NC}"
else
    echo -e "${YELLOW}⚠️  Some API keys may be missing. Continuing anyway...${NC}"
fi

# Check API status
echo -e "${BLUE}🔍 Checking API status...${NC}"
./check-api-status-simple.sh

# Install Python dependencies if needed
echo -e "${BLUE}📦 Installing Python dependencies...${NC}"
if [ -f "requirements-minimal.txt" ]; then
    pip3 install -r requirements-minimal.txt --user
    echo -e "${GREEN}✅ Dependencies installed${NC}"
else
    echo -e "${YELLOW}⚠️  No requirements-minimal.txt found, installing basic dependencies...${NC}"
    pip3 install --user flask openai anthropic groq requests python-dotenv
fi

# Create necessary directories
echo -e "${BLUE}📁 Creating directories...${NC}"
mkdir -p data logs research n8n-data/{backups,logs} local-files

# Start the AI Agent Server
echo -e "${BLUE}🚀 Starting AI Agent Server...${NC}"
echo -e "${CYAN}   Server will run on: http://localhost:5000${NC}"
echo -e "${CYAN}   Press Ctrl+C to stop${NC}"
echo ""

# Start the server in the background
python3 ai-agent-server-local.py &
AI_AGENT_PID=$!

# Wait a moment for the server to start
sleep 3

# Check if the server is running
if kill -0 $AI_AGENT_PID 2>/dev/null; then
    echo -e "${GREEN}✅ AI Agent Server started (PID: $AI_AGENT_PID)${NC}"
    
    # Test the server
    echo -e "${BLUE}🔍 Testing AI Agent Server...${NC}"
    if curl -s http://localhost:5000/health > /dev/null; then
        echo -e "${GREEN}✅ AI Agent Server is responding${NC}"
    else
        echo -e "${YELLOW}⚠️  AI Agent Server may not be ready yet${NC}"
    fi
    
    # Show status
    echo ""
    echo -e "${BLUE}📊 AI Agent Status:${NC}"
    echo -e "  ${GREEN}✅ Server: http://localhost:5000${NC}"
    echo -e "  ${GREEN}✅ Health: http://localhost:5000/health${NC}"
    echo -e "  ${GREEN}✅ Services: http://localhost:5000/ai-agent/services${NC}"
    echo -e "  ${GREEN}✅ Analyze: http://localhost:5000/ai-agent/analyze${NC}"
    echo -e "  ${GREEN}✅ Execute: http://localhost:5000/ai-agent/execute${NC}"
    
    echo ""
    echo -e "${BLUE}🎯 Test Commands:${NC}"
    echo -e "  ${CYAN}# Check health${NC}"
    echo -e "  ${YELLOW}curl http://localhost:5000/health${NC}"
    echo ""
    echo -e "  ${CYAN}# Check available services${NC}"
    echo -e "  ${YELLOW}curl http://localhost:5000/ai-agent/services${NC}"
    echo ""
    echo -e "  ${CYAN}# Test content analysis${NC}"
    echo -e "  ${YELLOW}curl -X POST http://localhost:5000/ai-agent/analyze \\${NC}"
    echo -e "  ${YELLOW}  -H 'Content-Type: application/json' \\${NC}"
    echo -e "  ${YELLOW}  -d '{\"content_type\": \"blog_post\", \"topic\": \"AI automation\"}'${NC}"
    
    echo ""
    echo -e "${GREEN}🎉 AI Agent is running locally!${NC}"
    echo -e "${YELLOW}   Press Ctrl+C to stop the server${NC}"
    
    # Wait for user to stop
    trap "echo -e '\n${BLUE}🛑 Stopping AI Agent Server...${NC}'; kill $AI_AGENT_PID 2>/dev/null; echo -e '${GREEN}✅ AI Agent Server stopped${NC}'; exit 0" INT
    
    # Keep the script running
    wait $AI_AGENT_PID
else
    echo -e "${RED}❌ Failed to start AI Agent Server${NC}"
    exit 1
fi