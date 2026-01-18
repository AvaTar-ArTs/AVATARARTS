#!/bin/bash
# 🚀 FTP Upload Script for avatararts.org
# Uploads Heavenly Hands and AI Voice Agents to your server

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 FTP Upload to avatararts.org${NC}"
echo "=============================================="

# FTP credentials
FTP_HOST="46.202.196.195"
FTP_USER="u841983302"
FTP_PASS="@i7a9Ad9uz2G3Ujo"

# File paths
HEAVENLY_HANDS_ZIP="/Users/steven/ai-sites/heavenlyHands/heavenly-hands-call-tracking.zip"
AI_VOICE_AGENTS_ZIP="/Users/steven/ai-sites/monetization/ai-voice-agents/ai-voice-agents.zip"
HEAVENLY_HANDS_SUBDOMAIN_ZIP="/Users/steven/ai-sites/heavenlyHands/heavenlyhands-subdomain.zip"

echo -e "${YELLOW}📦 Files to upload:${NC}"
echo "1. Heavenly Hands Call Tracking: $(basename $HEAVENLY_HANDS_ZIP)"
echo "2. AI Voice Agents: $(basename $AI_VOICE_AGENTS_ZIP)"
echo "3. Heavenly Hands Subdomain: $(basename $HEAVENLY_HANDS_SUBDOMAIN_ZIP)"

# Check if files exist
if [ ! -f "$HEAVENLY_HANDS_ZIP" ]; then
    echo -e "${RED}❌ Heavenly Hands zip file not found: $HEAVENLY_HANDS_ZIP${NC}"
    exit 1
fi

if [ ! -f "$AI_VOICE_AGENTS_ZIP" ]; then
    echo -e "${RED}❌ AI Voice Agents zip file not found: $AI_VOICE_AGENTS_ZIP${NC}"
    exit 1
fi

if [ ! -f "$HEAVENLY_HANDS_SUBDOMAIN_ZIP" ]; then
    echo -e "${RED}❌ Heavenly Hands Subdomain zip file not found: $HEAVENLY_HANDS_SUBDOMAIN_ZIP${NC}"
    exit 1
fi

echo -e "\n${GREEN}✅ Files found, starting upload...${NC}"

# Upload Heavenly Hands Call Tracking
echo -e "\n${BLUE}📤 Uploading Heavenly Hands Call Tracking...${NC}"
ftp -n -p $FTP_HOST 21 << EOF
user $FTP_USER $FTP_PASS
binary
cd public_html
put $HEAVENLY_HANDS_ZIP heavenly-hands-call-tracking.zip
quit
EOF

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Heavenly Hands uploaded successfully${NC}"
else
    echo -e "${RED}❌ Heavenly Hands upload failed${NC}"
fi

# Upload AI Voice Agents
echo -e "\n${BLUE}📤 Uploading AI Voice Agents...${NC}"
ftp -n -p $FTP_HOST 21 << EOF
user $FTP_USER $FTP_PASS
binary
cd public_html
put $AI_VOICE_AGENTS_ZIP ai-voice-agents.zip
quit
EOF

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ AI Voice Agents uploaded successfully${NC}"
else
    echo -e "${RED}❌ AI Voice Agents upload failed${NC}"
fi

# Upload Heavenly Hands Subdomain
echo -e "\n${BLUE}📤 Uploading Heavenly Hands Subdomain...${NC}"
ftp -n -p $FTP_HOST 21 << EOF
user $FTP_USER $FTP_PASS
binary
cd public_html
put $HEAVENLY_HANDS_SUBDOMAIN_ZIP heavenlyhands-subdomain.zip
quit
EOF

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Heavenly Hands Subdomain uploaded successfully${NC}"
else
    echo -e "${RED}❌ Heavenly Hands Subdomain upload failed${NC}"
fi

echo -e "\n${BLUE}🎉 Upload complete!${NC}"
echo -e "\n${YELLOW}📋 Next steps on your server:${NC}"
echo "1. SSH into your server"
echo "2. Extract the zip files:"
echo "   unzip heavenly-hands-call-tracking.zip"
echo "   unzip ai-voice-agents.zip"
echo "   unzip heavenlyhands-subdomain.zip"
echo "3. Set up subdomain directory:"
echo "   mkdir -p /home/u841983302/domains/avatararts.org/public_html/heavenlyhands"
echo "   cp -r heavenlyhands/* /home/u841983302/domains/avatararts.org/public_html/heavenlyhands/"
echo "4. Configure subdomain in hosting control panel"
echo "5. Set up Python environment and install dependencies"
echo "6. Configure Twilio webhook URL"

echo -e "\n${GREEN}🌐 Your sites will be available at:${NC}"
echo "• Heavenly Hands: https://avatararts.org/heavenly-hands-call-tracking/"
echo "• AI Voice Agents: https://avatararts.org/ai-voice-agents/"
echo "• Heavenly Hands Subdomain: https://heavenlyhands.avatararts.org"
echo "• Twilio Webhook: https://heavenlyhands.avatararts.org/webhook"
