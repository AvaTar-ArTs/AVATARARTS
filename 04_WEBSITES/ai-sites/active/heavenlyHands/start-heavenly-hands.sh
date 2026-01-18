#!/bin/bash
# start-heavenly-hands.sh
# Simple startup script for Heavenly Hands Call Center

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🎙️  Starting Heavenly Hands Call Center Agent${NC}"
echo "=============================================="

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo -e "${YELLOW}Creating virtual environment...${NC}"
    python3 -m venv venv
fi

# Activate virtual environment
echo -e "${YELLOW}Activating virtual environment...${NC}"
source venv/bin/activate

# Install/update dependencies
echo -e "${YELLOW}Installing dependencies...${NC}"
pip install -r requirements.txt

# Check environment variables
echo -e "${YELLOW}Checking environment configuration...${NC}"
if [ -f ".env" ]; then
    echo -e "${GREEN}✓ .env file found${NC}"
    export $(cat .env | xargs)
else
    echo -e "${RED}⚠️  .env file not found - creating template${NC}"
    cat > .env << EOF
# OpenAI API (Required)
OPENAI_API_KEY=your_openai_api_key_here

# Twilio API (Optional - for phone integration)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+13523296150

# Server Configuration
PORT=5000
DEBUG=False
EOF
    echo -e "${YELLOW}Please edit .env with your actual credentials${NC}"
fi

# Check required API keys
if [ -z "$OPENAI_API_KEY" ] || [ "$OPENAI_API_KEY" = "your_openai_api_key_here" ]; then
    echo -e "${RED}❌ OpenAI API key not configured${NC}"
    echo -e "${YELLOW}Please set OPENAI_API_KEY in .env file${NC}"
    exit 1
fi

# Start the server
echo -e "${GREEN}🚀 Starting server...${NC}"
echo -e "${GREEN}🌐 Web interface will be available at: http://localhost:${PORT:-5000}${NC}"

if [ -n "$TWILIO_ACCOUNT_SID" ] && [ "$TWILIO_ACCOUNT_SID" != "your_twilio_account_sid" ]; then
    echo -e "${GREEN}📞 Phone integration enabled${NC}"
    echo -e "${GREEN}📱 Call ${TWILIO_PHONE_NUMBER:-'not configured'} to test${NC}"
fi

python heavenly_hands_web.py
