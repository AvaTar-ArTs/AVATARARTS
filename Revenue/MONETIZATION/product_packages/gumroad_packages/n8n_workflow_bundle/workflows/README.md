# n8n Workflow Templates - Trend Pulse System

**Created By:** Steven Chaplinski | QuantumForgeLabs & AvatarArts
**Version:** 1.0
**Date:** 2026-01-13
**Based On:** Trend Pulse OS Expansion Packs

---

## 🎯 Overview

These n8n workflows replicate and extend the functionality of Trend Pulse Expansion Packs. They're designed for:
- **Free Versions** - Limited features for lead generation
- **Premium Versions** - Full features for commercial use
- **Customization** - Easy to modify and extend

---

## 🚀 Quick Start

### Import Workflow

1. Open n8n
2. Click "Workflows" → "Import from File"
3. Select a JSON file from `free/` or `premium/`
4. Configure credentials
5. Activate workflow

### Required Credentials

- **OpenAI API** - For AI features
- **Webhook URL** - For triggers (optional)
- **Google Sheets** - For data storage (optional)

---

## 📦 Available Workflows

### Free Versions (`free/`)

1. **Trend Analyzer Free**
   - Basic trend analysis
   - Simple scoring
   - CSV export
   - Limit: 10 trends/day

2. **Content Ideas Generator Free**
   - Generate ideas from keywords
   - Basic templates
   - Limit: 5 ideas/keyword

3. **YouTube Shorts Ideas Free**
   - Generate Shorts ideas
   - Basic optimization
   - Limit: 3 ideas/keyword

### Premium Versions (`premium/`)

1. **Trend Analyzer Pro**
   - Advanced analysis with AEO scoring
   - Batch processing
   - Unlimited trends
   - API integration

2. **Content Repurposing Pro**
   - Multi-platform repurposing
   - AI optimization
   - Batch processing
   - Custom templates

3. **YouTube Shorts Automation Pro**
   - Full automation pipeline
   - Publishing schedule
   - Analytics integration

4. **TikTok Video Generator Pro**
   - Viral strategy
   - Hook optimization
   - Batch creation

5. **AI Note Taker Pro**
   - Audio transcription
   - Note organization
   - Study tools generation

6. **AI Workflow Automation Pro**
   - Multi-agent systems
   - Task orchestration
   - Pipeline building

7. **Local AI Assistant Pro**
   - Local LLM integration
   - Privacy-first
   - Offline capabilities

---

## 💰 Pricing Strategy

### Free Versions
- **Purpose:** Lead generation, community building
- **Limits:** 10-50 executions/day
- **Features:** Basic functionality
- **Monetization:** Upsell to premium

### Premium Versions
- **Purpose:** Commercial use, professional workflows
- **Limits:** Unlimited
- **Features:** Full functionality
- **Pricing:** $29-99/month per workflow

---

## 🔧 Configuration

### Environment Variables

Set in n8n settings:
```
OPENAI_API_KEY=your_key_here
WEBHOOK_SECRET=your_secret_here
MAX_FREE_TRIES=10
```

### API Credentials

Configure in n8n:
- OpenAI API
- Google Sheets (optional)
- Airtable (optional)
- Webhook URLs

---

## 📊 Workflow Features

### Trend Analyzer
- CSV/JSON input
- Trend scoring (growth/difficulty)
- AEO scoring (premium)
- Keyword clustering
- Export to multiple formats
- Batch processing (premium)

### Content Repurposing
- Multi-platform output (YouTube, TikTok, Instagram)
- AI optimization
- Template system
- Batch processing (premium)
- Custom templates (premium)

### YouTube Shorts
- Idea generation
- Script creation
- Publishing schedule
- Analytics integration (premium)
- Auto-publishing (premium)

### AI Note Taker
- Audio transcription (WhisperX)
- Note organization
- Study tools generation
- Multi-format export
- Batch processing (premium)

---

## 🎯 Use Cases

### For Selling
- **SaaS Product** - Sell as subscription
- **One-Time Purchase** - Sell workflow files
- **Custom Development** - Build custom workflows

### For Free Use
- **Lead Generation** - Attract customers
- **Community Building** - Share free versions
- **Marketing** - Showcase capabilities

---

## 📚 Documentation

Each workflow includes:
- Setup instructions
- Usage examples
- Configuration guide
- Limitations (free vs premium)

---

## 🔗 Integration

### With Trend Pulse OS
- Import trends from CSV
- Use core modules
- Export results

### With Other Tools
- Make.com
- Zapier
- Airtable
- Google Sheets

---

## 🆘 Support

### Troubleshooting
1. Check n8n logs
2. Verify API credentials
3. Test individual nodes
4. Review workflow documentation

---

**Ready to automate?** Import a workflow and start! 🚀
