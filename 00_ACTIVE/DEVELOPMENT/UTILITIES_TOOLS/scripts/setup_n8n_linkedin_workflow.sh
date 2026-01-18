#!/bin/bash
# Setup LinkedIn AI Content Automation Workflow for n8n

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

WORKFLOW_FILE="linkedin-ai-content-automation.json"
WORKSPACE_DIR="/Users/steven/workspace"

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}   LinkedIn AI Content Automation Setup${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Check if workflow file exists
if [ ! -f "$WORKSPACE_DIR/$WORKFLOW_FILE" ]; then
    echo -e "${RED}❌ Workflow file not found: $WORKFLOW_FILE${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Found workflow file${NC}"
echo ""

# Check for required API keys
echo -e "${BLUE}Checking environment variables...${NC}"

if [ -z "$OPENAI_API_KEY" ]; then
    echo -e "${YELLOW}⚠ OPENAI_API_KEY not set${NC}"
    echo "Loading from ~/.env.d/..."
    source ~/.env.d/llm-apis.env 2>/dev/null || true
fi

if [ -n "$OPENAI_API_KEY" ]; then
    echo -e "${GREEN}✓ OpenAI API Key found${NC}"
else
    echo -e "${RED}❌ OpenAI API Key not found${NC}"
    echo "Please set OPENAI_API_KEY in ~/.env.d/llm-apis.env"
fi

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}Next Steps:${NC}"
echo ""
echo "1. Open n8n in your browser"
echo "   ${BLUE}http://localhost:5678${NC} (if running locally)"
echo ""
echo "2. Import the workflow"
echo "   - Click: Settings → Workflows → Import from File"
echo "   - Select: $WORKSPACE_DIR/$WORKFLOW_FILE"
echo ""
echo "3. Set up OpenAI credentials"
echo "   - Click: Credentials → New Credential"
echo "   - Type: OpenAI"
echo "   - API Key: (paste your OPENAI_API_KEY)"
echo "   - Save and copy the Credential ID"
echo ""
echo "4. Set up LinkedIn OAuth2"
echo "   - Click: Credentials → New Credential"
echo "   - Type: LinkedIn OAuth2 API"
echo "   - Follow OAuth flow"
echo "   - Save and copy the Credential ID"
echo ""
echo "5. Update workflow credentials"
echo "   - In each OpenAI node (3 total):"
echo "     • Click on the node"
echo "     • Select your OpenAI credential"
echo "   - In the LinkedIn node:"
echo "     • Click on the node"
echo "     • Select your LinkedIn credential"
echo ""
echo "6. Test the workflow"
echo "   - Click 'Execute Workflow' button"
echo "   - Check each node output"
echo "   - Verify LinkedIn post"
echo ""
echo "7. Activate for automatic posting"
echo "   - Toggle 'Active' switch"
echo "   - Posts will generate every 6 hours"
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "📖 Full documentation:"
echo "   $WORKSPACE_DIR/LinkedIn-AI-Content-Automation-README.md"
echo ""
echo "💡 Cost estimate: ~$0.044 per post (~$5.28/month for 4 posts/day)"
echo ""
echo -e "${GREEN}✅ Setup guide complete!${NC}"
echo ""
