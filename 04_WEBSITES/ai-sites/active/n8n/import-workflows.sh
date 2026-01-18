#!/bin/bash
# n8n Workflow Import Script
# ==========================
# Automatically imports AI agent workflows into n8n

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}📥 n8n Workflow Import Script${NC}"
echo "================================="

# Check if n8n is running
if ! curl -s http://localhost:5678 > /dev/null; then
    echo -e "${RED}❌ n8n is not running. Please start n8n first.${NC}"
    echo -e "${YELLOW}   Run: ./start-ai-agent.sh${NC}"
    exit 1
fi

echo -e "${GREEN}✅ n8n is running${NC}"

# Check if workflows directory exists
if [ ! -d "n8n_workflows" ]; then
    echo -e "${RED}❌ n8n_workflows directory not found${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Workflows directory found${NC}"

# Function to import a workflow
import_workflow() {
    local workflow_file="$1"
    local workflow_name=$(basename "$workflow_file" .json)
    
    echo -e "${BLUE}📥 Importing: $workflow_name${NC}"
    
    # Check if workflow file exists
    if [ ! -f "$workflow_file" ]; then
        echo -e "${RED}❌ Workflow file not found: $workflow_file${NC}"
        return 1
    fi
    
    # Import workflow using n8n API
    response=$(curl -s -X POST \
        -H "Content-Type: application/json" \
        -d @"$workflow_file" \
        http://localhost:5678/api/v1/workflows/import)
    
    if echo "$response" | grep -q "error"; then
        echo -e "${RED}❌ Failed to import $workflow_name${NC}"
        echo -e "${RED}   Response: $response${NC}"
        return 1
    else
        echo -e "${GREEN}✅ Successfully imported $workflow_name${NC}"
        return 0
    fi
}

# Import all workflows
echo -e "${BLUE}🔄 Starting workflow import...${NC}"

# Import main AI workflows
import_workflow "n8n_workflows/ai_content_agent.json"
import_workflow "n8n_workflows/content_research_agent.json"
import_workflow "n8n_workflows/ai_optimization_agent.json"

echo ""
echo -e "${GREEN}🎉 Workflow import complete!${NC}"
echo ""
echo -e "${BLUE}📋 Next steps:${NC}"
echo -e "   1. Open n8n at http://localhost:5678"
echo -e "   2. Go to Settings → Credentials"
echo -e "   3. Add your API credentials:"
echo -e "      - OpenAI API Key"
echo -e "      - SERP API Key"
echo -e "      - News API Key"
echo -e "      - Other AI service keys"
echo -e "   4. Configure webhook URLs in workflows"
echo -e "   5. Test the workflows"
echo ""
echo -e "${YELLOW}💡 Pro tip: Check the credentials_template.json for setup instructions${NC}"
echo ""
echo -e "${GREEN}🚀 Your AI automation workflows are ready!${NC}"