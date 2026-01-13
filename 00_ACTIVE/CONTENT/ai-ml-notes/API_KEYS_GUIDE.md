# API Keys Setup Guide

## 🎯 Priority 1: Essential APIs (Fill These First)

### 1. **Stability AI** (Image Generation)
- **URL**: https://platform.stability.ai/
- **Steps**: 
  1. Sign up for free account
  2. Go to API Keys section
  3. Generate new API key
  4. Copy the key (starts with `sk-`)
- **Free Tier**: 25 credits/month
- **Update**: `~/.env.d/art-vision.env` → `STABILITY_API_KEY=`

### 2. **Replicate** (AI Models Platform)
- **URL**: https://replicate.com/
- **Steps**:
  1. Sign up for free account
  2. Go to Account → API Tokens
  3. Create new token
  4. Copy the token (starts with `r8_`)
- **Free Tier**: $10 credit
- **Update**: `~/.env.d/art-vision.env` → `REPLICATE_API_TOKEN=`

### 3. **ElevenLabs** (AI Voice)
- **URL**: https://elevenlabs.io/
- **Steps**:
  1. Sign up for free account
  2. Go to Profile → API Keys
  3. Generate new key
  4. Copy the key
- **Free Tier**: 10,000 characters/month
- **Update**: `~/.env.d/audio-music.env` → `ELEVENLABS_API_KEY=`

### 4. **Suno AI** (Music Generation)
- **URL**: https://suno.com/
- **Steps**:
  1. Sign up for free account
  2. Go to Settings → API
  3. Generate API key
  4. Copy the key
- **Free Tier**: Limited credits
- **Update**: `~/.env.d/audio-music.env` → `SUNO_API_KEY=`

## 🎯 Priority 2: Vector Databases (For RAG/AI Agents)

### 5. **Pinecone** (Vector Database)
- **URL**: https://www.pinecone.io/
- **Steps**:
  1. Sign up for free account
  2. Create a project
  3. Go to API Keys
  4. Copy the API key
- **Free Tier**: 1M vectors
- **Update**: `~/.env.d/automation-agents.env` → `PINECONE_API_KEY=`

### 6. **Supabase** (Database + Auth)
- **URL**: https://supabase.com/
- **Steps**:
  1. Sign up for free account
  2. Create new project
  3. Go to Settings → API
  4. Copy the anon/public key
- **Free Tier**: 500MB database
- **Update**: `~/.env.d/automation-agents.env` → `SUPABASE_KEY=`

## 🎯 Priority 3: Search & Analytics

### 7. **SerpAPI** (Google Search)
- **URL**: https://serpapi.com/
- **Steps**:
  1. Sign up for free account
  2. Go to Dashboard
  3. Copy API key
- **Free Tier**: 100 searches/month
- **Update**: `~/.env.d/seo-analytics.env` → `SERPAPI_KEY=`

### 8. **NewsAPI** (News Data)
- **URL**: https://newsapi.org/
- **Steps**:
  1. Sign up for free account
  2. Go to Dashboard
  3. Copy API key
- **Free Tier**: 1000 requests/day
- **Update**: `~/.env.d/seo-analytics.env` → `NEWSAPI_KEY=`

## 🎯 Priority 4: Additional Tools

### 9. **Notion** (Documentation)
- **URL**: https://www.notion.so/
- **Steps**:
  1. Go to https://www.notion.so/my-integrations
  2. Create new integration
  3. Copy the Internal Integration Token
- **Free Tier**: Unlimited
- **Update**: `~/.env.d/documents.env` → `NOTION_TOKEN=`

### 10. **Twilio** (SMS/Notifications)
- **URL**: https://www.twilio.com/
- **Steps**:
  1. Sign up for free account
  2. Go to Console Dashboard
  3. Copy Account SID and Auth Token
- **Free Tier**: $15 credit
- **Update**: `~/.env.d/notifications.env` → `TWILIO_ACCOUNT_SID=` and `TWILIO_AUTH_TOKEN=`

## 🚀 Quick Setup Commands

Once you have the API keys, I can help you update the files:

```bash
# Test your current setup
source ~/.env.d/loader.sh
python3 ~/test-apis.py

# Or run the automation setup
bash ~/ai-sites/automation/api-powered/SETUP_APIS.sh
```

## 📝 Notes

- **Security**: Never commit API keys to git
- **Backup**: Keep a secure copy of your keys
- **Rotation**: Regularly rotate API keys
- **Testing**: Use the test script to verify keys work

## 🎯 Recommended Order

1. Start with **Stability AI** and **Replicate** (image generation)
2. Add **ElevenLabs** and **Suno** (audio/music)
3. Set up **Pinecone** and **Supabase** (data storage)
4. Add **SerpAPI** and **NewsAPI** (search/data)
5. Fill in others as needed for specific projects

Would you like me to help you update the environment files once you have some of these keys?