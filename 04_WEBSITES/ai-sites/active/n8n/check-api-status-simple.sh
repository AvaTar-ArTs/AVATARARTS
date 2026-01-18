#!/bin/bash
# Simple API Status Checker
# =========================
# Checks API status from the generated .env file

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔍 AI Agent API Status Check${NC}"
echo "================================"

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo -e "${RED}❌ .env file not found. Run: python3 env-loader.py${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Found .env file${NC}"

# Load the .env file
source .env

# Function to check API key
check_api_key() {
    local key_name="$1"
    local key_value="${!key_name}"
    local pattern="$2"
    
    if [ -n "$key_value" ] && [ "$key_value" != "your_$(echo $key_name | tr '[:upper:]' '[:lower:]')_here" ]; then
        if [[ "$key_value" =~ $pattern ]]; then
            echo -e "  ${GREEN}✅${NC} $key_name"
            return 0
        else
            echo -e "  ${YELLOW}⚠️${NC} $key_name (invalid format)"
            return 1
        fi
    else
        echo -e "  ${RED}❌${NC} $key_name (missing)"
        return 1
    fi
}

# Core LLM APIs
echo -e "\n${CYAN}🤖 Core LLM APIs:${NC}"
core_llm_count=0
check_api_key "OPENAI_API_KEY" "^sk-" && ((core_llm_count++))
check_api_key "ANTHROPIC_API_KEY" "^sk-ant-" && ((core_llm_count++))
check_api_key "GROQ_API_KEY" "^gsk_" && ((core_llm_count++))
check_api_key "XAI_API_KEY" "^xai-" && ((core_llm_count++))
check_api_key "DEEPSEEK_API_KEY" "^sk-" && ((core_llm_count++))

# Audio & Music APIs
echo -e "\n${CYAN}🎵 Audio & Music APIs:${NC}"
audio_count=0
check_api_key "ELEVENLABS_API_KEY" "^sk_" && ((audio_count++))
check_api_key "SUNO_COOKIE" "^.*" && ((audio_count++))
check_api_key "ASSEMBLYAI_API_KEY" "^[a-f0-9]{32}$" && ((audio_count++))
check_api_key "DEEPGRAM_API_KEY" "^[a-f0-9]{40}$" && ((audio_count++))

# Art & Vision APIs
echo -e "\n${CYAN}🎨 Art & Vision APIs:${NC}"
art_count=0
check_api_key "STABILITY_API_KEY" "^sk-" && ((art_count++))
check_api_key "REPLICATE_API_TOKEN" "^r8_" && ((art_count++))
check_api_key "RUNWAY_API_KEY" "^.*" && ((art_count++))
check_api_key "LEONARDO_API_KEY" "^.*" && ((art_count++))

# Automation & Agents APIs
echo -e "\n${CYAN}🤖 Automation & Agents APIs:${NC}"
automation_count=0
check_api_key "PINECONE_API_KEY" "^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$" && ((automation_count++))
check_api_key "OPENROUTER_API_KEY" "^sk-or-" && ((automation_count++))
check_api_key "COHERE_API_KEY" "^.*" && ((automation_count++))
check_api_key "FIREWORKS_API_KEY" "^.*" && ((automation_count++))
check_api_key "LANGSMITH_API_KEY" "^.*" && ((automation_count++))

# Documents & Knowledge APIs
echo -e "\n${CYAN}📚 Documents & Knowledge APIs:${NC}"
docs_count=0
check_api_key "NOTION_TOKEN" "^secret_" && ((docs_count++))

# SEO & Analytics APIs
echo -e "\n${CYAN}📊 SEO & Analytics APIs:${NC}"
seo_count=0
check_api_key "SERPAPI_KEY" "^[a-f0-9]{16}$" && ((seo_count++))
check_api_key "NEWSAPI_KEY" "^[a-f0-9]{32}$" && ((seo_count++))

# Summary
total_apis=$((core_llm_count + audio_count + art_count + automation_count + docs_count + seo_count))
total_possible=18

echo -e "\n${BLUE}📊 API Status Summary:${NC}"
echo -e "  ${GREEN}✅ Configured: $total_apis/$total_possible APIs${NC}"
echo -e "  ${CYAN}🤖 Core LLMs: $core_llm_count/5${NC}"
echo -e "  ${CYAN}🎵 Audio: $audio_count/4${NC}"
echo -e "  ${CYAN}🎨 Art: $art_count/4${NC}"
echo -e "  ${CYAN}🤖 Automation: $automation_count/5${NC}"
echo -e "  ${CYAN}📚 Docs: $docs_count/1${NC}"
echo -e "  ${CYAN}📊 SEO: $seo_count/2${NC}"

# Deployment readiness
echo -e "\n${BLUE}🚀 Deployment Readiness:${NC}"
if [ $core_llm_count -ge 3 ] && [ $total_apis -ge 8 ]; then
    echo -e "  ${GREEN}🎉 Ready for deployment!${NC}"
    echo -e "  ${GREEN}   You have sufficient APIs for content generation${NC}"
elif [ $core_llm_count -ge 1 ] && [ $total_apis -ge 5 ]; then
    echo -e "  ${YELLOW}⚠️  Partially ready${NC}"
    echo -e "  ${YELLOW}   You have basic functionality but may want more APIs${NC}"
else
    echo -e "  ${RED}❌ Not ready${NC}"
    echo -e "  ${RED}   Please configure more API keys${NC}"
fi

# Show configured APIs
echo -e "\n${BLUE}🔑 Configured API Keys:${NC}"
for key in OPENAI_API_KEY ANTHROPIC_API_KEY GROQ_API_KEY XAI_API_KEY DEEPSEEK_API_KEY ELEVENLABS_API_KEY ASSEMBLYAI_API_KEY DEEPGRAM_API_KEY SERPAPI_KEY NEWSAPI_KEY; do
    if [ -n "${!key}" ] && [ "${!key}" != "your_$(echo $key | tr '[:upper:]' '[:lower:]')_here" ]; then
        echo -e "  ${GREEN}✅${NC} $key: ${!key:0:20}..."
    fi
done

echo -e "\n${GREEN}🔍 API status check complete!${NC}"