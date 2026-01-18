#!/bin/bash
# AI Agent Mamba Installer
# ========================
# Installs the AI agent system using Mamba for fast, reliable dependency management

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${BLUE}🐍 AI Agent Mamba Installer${NC}"
echo "=============================="

# Check if Mamba is installed
if ! command -v mamba &> /dev/null; then
    echo -e "${RED}❌ Mamba is not installed${NC}"
    echo -e "${YELLOW}   Installing Mamba...${NC}"
    
    # Install Mamba via conda
    if command -v conda &> /dev/null; then
        conda install mamba -n base -c conda-forge -y
        echo -e "${GREEN}✅ Mamba installed via conda${NC}"
    else
        echo -e "${RED}❌ Neither Mamba nor Conda found${NC}"
        echo -e "${YELLOW}   Please install Miniconda or Mambaforge first:${NC}"
        echo -e "${CYAN}   https://mamba.readthedocs.io/en/latest/installation.html${NC}"
        exit 1
    fi
fi

echo -e "${GREEN}✅ Mamba found${NC}"

# Check if we're in the right directory
if [ ! -f "environment.yml" ]; then
    echo -e "${RED}❌ environment.yml not found${NC}"
    echo -e "${YELLOW}   Please run this script from the n8n directory${NC}"
    exit 1
fi

# Create the AI agent environment
echo -e "${BLUE}🔧 Creating AI agent environment...${NC}"
mamba env create -f environment.yml

echo -e "${GREEN}✅ AI agent environment created${NC}"

# Activate the environment
echo -e "${BLUE}🔄 Activating environment...${NC}"
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

echo -e "${GREEN}✅ Directories created${NC}"

# Test the installation
echo -e "${BLUE}🧪 Testing installation...${NC}"
python -c "import flask, openai, anthropic, groq, elevenlabs; print('✅ All core packages imported successfully')"

echo -e "${GREEN}✅ Installation test passed${NC}"

# Show next steps
echo ""
echo -e "${BLUE}🎯 Next Steps:${NC}"
echo -e "  ${CYAN}1. Activate the environment:${NC}"
echo -e "  ${YELLOW}   mamba activate ai-agent${NC}"
echo ""
echo -e "  ${CYAN}2. Start the AI agent server:${NC}"
echo -e "  ${YELLOW}   python ai-agent-server-local.py${NC}"
echo ""
echo -e "  ${CYAN}3. Or use the startup script:${NC}"
echo -e "  ${YELLOW}   ./start-ai-agent-mamba.sh${NC}"
echo ""
echo -e "  ${CYAN}4. Test the server:${NC}"
echo -e "  ${YELLOW}   curl http://localhost:5000/health${NC}"

echo ""
echo -e "${GREEN}🎉 AI Agent installation complete!${NC}"
echo -e "${PURPLE}   Environment: ai-agent${NC}"
echo -e "${PURPLE}   Python: $(python --version)${NC}"
echo -e "${PURPLE}   Location: $(pwd)${NC}"