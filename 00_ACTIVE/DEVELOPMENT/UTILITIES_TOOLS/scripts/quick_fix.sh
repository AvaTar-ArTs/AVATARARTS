#!/bin/bash
# Quick Fix Script - Fix API issues

echo "?? Fixing API configuration issues..."
echo ""

# Fix 1: Remove problematic source line in llm-apis.env
echo "1?? Fixing llm-apis.env source issue..."
cd ~/.env.d/

# Backup first
cp llm-apis.env llm-apis.env.backup

# Remove the problematic source line (line 4) and replace with direct export
cat > llm-apis.env << 'EOF'
# =======================
#  ?? LLMs / TEXT / RESEARCH
# =======================

# Gemini API (Google)
GEMINI_API_KEY=AIzaSyDHPCYrqrCrYryyLQDSD1p1Hrwsqtg6tPg

# NOTE: OPENAI_MODEL should be a valid model name (gpt-4o, gpt-4-turbo, gpt-3.5-turbo, etc.)
OPENAI_MODEL=gpt-4o

# Anthropic Claude
ANTHROPIC_API_KEY=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  # https://console.anthropic.com/

# Other LLM Providers
MISTRAL_API_KEY=n70ocylJpQnMs5ANfaPPryGdWaYWo7x9
PERPLEXITY_API_KEY=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  # Use model: "sonar"
DEEPSEEK_API_KEY=sk-56a6e1cb1ce74535b5f8c1bc02d3446b  # https://platform.deepseek.com/
GROQ_API_KEY=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  # Get from: https://console.groq.com/
COHERE_API_KEY=KVVeVwoRVknE6VAvFijJZ3owOx3tBeGbvWj9iDyQ  # Get from: https://dashboard.cohere.com/
OPENROUTER_API_KEY=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  # Get from: https://openrouter.ai/keys

# Recommended - Cost-effective alternatives
TOGETHER_API_KEY=a7622ddf1aabd72f4cf2d36e466cb97b53d3d954059571c121e68f10421e294b  # Get from: https://api.together.xyz/settings/api-keys
CEREBRAS_API_KEY=csk-tyjt64vpe428t59eeckvrfpxe4kd9e4ew6mfpwkxkctnjf2x  # Get from: https://cloud.cerebras.ai/

# OpenAI - GET YOUR KEY FROM: https://platform.openai.com/api-keys
# Then paste it below (replace YOUR_OPENAI_KEY_HERE)
OPENAI_API_KEY=YOUR_OPENAI_KEY_HERE
EOF

echo "   ? Fixed llm-apis.env"
echo ""

# Fix 2: Rebuild master environment
echo "2?? Rebuilding master environment..."
bash ~/.env.d/rebuild_master.sh
echo ""

# Fix 3: Set permissions
echo "3?? Setting secure permissions..."
chmod 600 ~/.env.d/*.env
chmod 600 ~/.env.d/MASTER_CONSOLIDATED.env
echo "   ? Permissions secured"
echo ""

echo "????????????????????????????????????????????????????????????????"
echo "? FIXES APPLIED!"
echo "????????????????????????????????????????????????????????????????"
echo ""
echo "?? Next Steps:"
echo ""
echo "1. Get OpenAI API key (OPTIONAL - 5 minutes):"
echo "   ? Visit: https://platform.openai.com/api-keys"
echo "   ? Click 'Create new secret key'"
echo "   ? Copy the key"
echo "   ? Run: nano ~/.env.d/llm-apis.env"
echo "   ? Replace: YOUR_OPENAI_KEY_HERE with your actual key"
echo "   ? Save: Ctrl+O, Enter, Ctrl+X"
echo "   ? Rebuild: bash ~/.env.d/rebuild_master.sh"
echo ""
echo "2. OR skip OpenAI and use what you have:"
echo "   ? Claude (Anthropic) - READY"
echo "   ? Groq - READY (FREE, super fast!)"
echo "   ? Gemini - READY (FREE!)"
echo "   ? Deepseek - READY"
echo ""
echo "3. Reload environment:"
echo "   source ~/.env.d/loader.sh"
echo ""
echo "4. Test again:"
echo "   python ~/workspace/test_everything.py"
echo ""
echo "5. LAUNCH:"
echo "   cd ~/workspace/work/universal-sales-empire/"
echo "   python MEGA_SALES_PLATFORM.py"
echo ""
echo "????????????????????????????????????????????????????????????????"
echo "?? PRO TIP: You can launch RIGHT NOW without OpenAI!"
echo "   Just use Claude + Groq + Twilio (you have all of them!)"
echo "????????????????????????????????????????????????????????????????"
