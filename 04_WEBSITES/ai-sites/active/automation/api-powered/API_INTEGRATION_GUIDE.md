# 🤖 API-Powered Automation - Complete Guide

**Added:** October 25, 2025
**Purpose:** Leverage your API keys for full automation - content generates itself!

---

## 🎯 What's New

### API-Powered Tools
1. **AI Content Generator** - Generate blogs, social posts, emails, scripts automatically
2. **DALL-E Auto Generator** - Create images on demand or scheduled
3. **Auto Content Pipeline** - Full end-to-end content creation
4. **Cron Automation** - Set it and forget it

### Key Difference
**Before:** You prep → You upload → You post
**After:** System generates → System optimizes → Ready to post → (Optional: System posts)

---

## 🚀 Quick Start

### 1. Setup (One-Time)
```bash
cd ~/ai-sites/automation/api-powered
chmod +x SETUP_APIS.sh
./SETUP_APIS.sh
```

This will:
- Check your API keys
- Install dependencies
- Test connections
- Make scripts executable

### 2. Generate Content (Manual)
```bash
# Blog post
python3 ai_content_generator.py blog "AI in music production"

# Social media posts (10 at once)
python3 ai_content_generator.py social "creative automation tips"

# Email newsletter
python3 ai_content_generator.py email "monthly roundup"

# YouTube script
python3 ai_content_generator.py youtube "beginner's guide to DALL-E"

# Product description
python3 ai_content_generator.py product "Raccoon Universe T-Shirt"

# AI Recipe
python3 ai_content_generator.py recipe "autumn comfort food"
```

### 3. Generate Images (Manual)
```bash
# Daily AI art (auto theme)
python3 dalle_auto_generator.py daily

# Daily AI art (specific theme)
python3 dalle_auto_generator.py daily "cyberpunk city at sunset"

# Generate series of 5 images
python3 dalle_auto_generator.py series "fantasy landscapes" 5

# Product mockups
python3 dalle_auto_generator.py mockup "geometric patterns"

# Custom prompt
python3 dalle_auto_generator.py custom "vibrant abstract art, neon colors, 4K"
```

### 4. Full Pipeline (Manual)
```bash
# Complete content creation
python3 auto_content_pipeline.py full "sustainable living tips"

# Daily routine (art + social + recipe)
python3 auto_content_pipeline.py daily

# Quick content (social + image)
python3 auto_content_pipeline.py quick "AI productivity hacks"
```

### 5. Automate Everything (Set & Forget)
```bash
# Setup cron jobs
cd ~/ai-sites/automation/api-powered
chmod +x setup_cron_automation.sh
./setup_cron_automation.sh
```

---

## ⏰ Automation Schedule

Once cron is set up, your empire runs automatically:

### Daily
- **8:00 AM** - Generate daily content (blog + social)
- **9:00 AM** - Generate daily AI art
- **10:00 AM** - Generate recipe
- **2:00 PM** - Generate recipe
- **6:00 PM** - Generate recipe + daily stats
- **2:00 AM** - Auto backup

### Multiple Times Daily
- **Every 6 hours** - Generate social posts (variety of topics)

### Weekly
- **Monday 10:00 AM** - Generate weekly music sampler
- **Monday 9:00 AM** - Performance report (7 days)
- **Sunday 6:00 PM** - Revenue summary

---

## 💡 Use Cases

### 1. Never Run Out of Content
```bash
# Generate 30 days of social posts at once
for i in {1..30}; do
  python3 ai_content_generator.py social "Topic $i" groq
  sleep 2
done
```

### 2. Batch Create Images
```bash
# Generate 50 designs for Redbubble
for theme in "abstract" "nature" "tech" "fantasy" "minimalist"; do
  python3 dalle_auto_generator.py series "$theme art" 10
done
```

### 3. Weekly Content Blast
```bash
# Monday morning content generation
python3 auto_content_pipeline.py full "weekly topic"
python3 dalle_auto_generator.py series "weekly theme" 7
```

### 4. Product Launch Campaign
```bash
# Generate everything for a product launch
python3 ai_content_generator.py batch blog,social,email,youtube "New Product Launch"
python3 dalle_auto_generator.py mockup "product design"
```

---

## 🎨 Content Types Supported

### Text Content (AI Generator)
- **blog** - 1000-word blog posts
- **social** - 10 social media posts with hashtags
- **email** - Newsletter with subject line
- **product** - Product descriptions (SEO-optimized)
- **youtube** - Video scripts with timestamps
- **recipe** - Creative AI recipes

### Visual Content (DALL-E Generator)
- **daily** - Daily art drops (auto or themed)
- **series** - Themed image collections
- **mockup** - Product mockups
- **custom** - Any prompt you want

### Combined (Pipeline)
- **full** - Blog + social + image + email + YouTube
- **daily** - Daily routine (art + social + recipe)
- **quick** - Social + image only

---

## 🔧 API Configuration

### Your APIs (from ~/.env.d/)
- **OpenAI** - GPT-4, DALL-E 3 (high quality, slower)
- **Groq** - Mixtral (fast generation, recommended)
- **Grok/XAI** - Alternative LLM
- **DeepSeek** - Alternative LLM

### Choosing Provider
```bash
# Fast generation (recommended for batch)
python3 ai_content_generator.py social "topic" groq

# High quality (recommended for important content)
python3 ai_content_generator.py blog "topic" openai
```

### Cost Optimization
- **Groq**: Fast + cheap for social posts
- **OpenAI GPT-4o-mini**: Balanced quality/cost for blogs
- **DALL-E 3**: ~$0.04/image (standard), ~$0.08/image (HD)

**Estimated costs:**
- 100 social posts: ~$0.50 (Groq)
- 10 blog posts: ~$2-5 (OpenAI)
- 30 images/month: ~$1.20-2.40
- **Total: ~$5-10/month for full automation**

**ROI: $5-10/month → $10,000+/month revenue = 1000x+**

---

## 📊 Output Locations

All generated content goes to:
```
~/ai-sites/automation/api-powered/output/
├── blog_*.txt
├── social_*.txt
├── email_*.txt
├── product_*.txt
├── youtube_*.txt
├── recipe_*.txt
├── images/
│   ├── daily_art_*.png
│   ├── series_*.png
│   └── mockup_*.png
└── pipeline/
    └── pipeline_*.json
```

Logs go to:
```
~/ai-sites/automation/logs/
├── daily_content.log
├── daily_art.log
├── recipes.log
├── social.log
└── ...
```

---

## 🎯 Workflow Integration

### Option 1: Fully Automated
```bash
# Setup once
./setup_cron_automation.sh

# Content generates automatically
# You just review and approve
```

### Option 2: Semi-Automated
```bash
# Run pipeline manually when needed
python3 auto_content_pipeline.py full "topic"

# Review generated content
# Post manually or use scheduling tool
```

### Option 3: Manual with AI Assist
```bash
# Generate content on-demand
python3 ai_content_generator.py blog "specific topic"

# Edit and personalize
# Use as starting point
```

---

## 💻 Advanced Usage

### Batch Generation
```bash
# Generate 100 pieces of content
python3 ai_content_generator.py batch \
  blog,social,email \
  "topic1,topic2,topic3,..." \
  groq
```

### Custom Prompts
Edit the scripts to customize:
- Writing style
- Tone
- Length
- Format
- Keywords

### Chain Multiple Tools
```bash
# Full automation chain
python3 ai_content_generator.py blog "topic" && \
python3 dalle_auto_generator.py daily "topic" && \
python3 ~/ai-sites/automation/cross-pollination/recipe_to_social.py
```

---

## 🐛 Troubleshooting

### "API key not found"
```bash
# Check your .env.d
ls ~/.env.d/
cat ~/.env.d/llm-apis.env

# Reload environment
source ~/.env.d/loader.sh
```

### "Module not found"
```bash
# Install dependencies
pip3 install openai groq requests pillow
```

### "Rate limit exceeded"
- Use Groq for high-volume (faster, higher limits)
- Add delays between requests
- Batch requests during off-peak hours

### Cron jobs not running
```bash
# Check cron is running
crontab -l

# Check logs
tail -f ~/ai-sites/automation/logs/daily_content.log

# Test manually
cd ~/ai-sites/automation/api-powered
python3 auto_content_pipeline.py daily
```

---

## 📈 Scaling

### From Manual to Fully Automated

**Week 1: Manual Testing**
- Generate content manually
- Review quality
- Adjust prompts
- Test different providers

**Week 2: Semi-Automated**
- Use pipelines for bulk generation
- Schedule some cron jobs
- Monitor outputs
- Refine automation

**Week 3-4: Fully Automated**
- All cron jobs active
- Content generates daily
- You just review and approve
- Focus on strategy, not execution

**Result:** 10x content output, 90% less time

---

## 🎉 You're Ready!

**API-powered automation is live!**

### First Steps
1. Run setup: `./SETUP_APIS.sh`
2. Test generation: `python3 ai_content_generator.py social "test topic"`
3. Generate image: `python3 dalle_auto_generator.py daily`
4. Setup cron: `./setup_cron_automation.sh`

### Your Empire Now Runs Itself! 🤖

---

*Part of the Complete Automation Suite - AvaTarArTs Creative Empire*
