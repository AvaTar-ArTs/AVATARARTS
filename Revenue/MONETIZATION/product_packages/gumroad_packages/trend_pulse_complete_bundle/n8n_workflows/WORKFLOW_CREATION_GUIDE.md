# n8n Workflow Creation Guide

**For:** Trend Pulse System Workflows
**Based On:** Expansion Packs & Trending Keywords
**Version:** 1.0

---

## 🎯 Workflow Strategy

### Free vs Premium

**Free Versions:**
- Basic functionality
- Limited executions (10-50/day)
- Simple processing
- Lead generation focus

**Premium Versions:**
- Full functionality
- Unlimited executions
- AI-powered processing
- Commercial use

---

## 📋 Workflow Templates

### 1. Trend Analyzer

**Free:**
- Basic scoring (growth/difficulty)
- CSV export
- 10 trends/day limit

**Premium:**
- AI-powered analysis
- AEO scoring
- Batch processing
- Unlimited

### 2. Content Repurposing

**Free:**
- Basic templates
- Single platform
- 5 repurposes/day

**Premium:**
- Multi-platform
- AI optimization
- Custom templates
- Batch processing

### 3. AI Note Taker

**Free:**
- Basic transcription
- Simple notes
- 3 notes/day

**Premium:**
- WhisperX transcription
- Word-level timestamps
- Study tools generation
- Unlimited

### 4. YouTube Shorts

**Free:**
- Idea generation
- Basic scripts
- 3 ideas/day

**Premium:**
- Full automation
- Publishing schedule
- Analytics integration
- Unlimited

---

## 🔧 Node Patterns

### Webhook Trigger
```json
{
  "name": "Webhook",
  "type": "n8n-nodes-base.webhook",
  "webhookId": "workflow-name"
}
```

### OpenAI Integration
```json
{
  "name": "OpenAI",
  "type": "n8n-nodes-base.openAi",
  "model": "gpt-4",
  "messages": [...]
}
```

### Code Processing
```json
{
  "name": "Process",
  "type": "n8n-nodes-base.code",
  "jsCode": "..."
}
```

### Response
```json
{
  "name": "Respond",
  "type": "n8n-nodes-base.respondToWebhook",
  "respondWith": "json"
}
```

---

## 📊 Trending Keywords Integration

### High-Priority Workflows

1. **AI Voice Generator** (1,500% growth)
   - Use case: Faceless YouTube
   - Integration: ElevenLabs API

2. **Local LLM** (450% growth)
   - Use case: Privacy-first AI
   - Integration: Ollama API

3. **Private GPT** (380% growth)
   - Use case: Enterprise privacy
   - Integration: Local model APIs

4. **AI Video Generator** (400% growth)
   - Use case: Content creation
   - Integration: Runway/Stable Video

5. **AI Note Taking** (350% growth)
   - Use case: Productivity
   - Integration: WhisperX

---

## 🚀 Next Workflows to Create

### Immediate Priority
1. ✅ Trend Analyzer Pro
2. ✅ AI Note Taker Pro
3. ✅ Content Repurposing Pro
4. ⏳ AI Voice Generator Pro
5. ⏳ Local LLM Assistant Pro

### High Priority
6. ⏳ YouTube Shorts Automation Pro
7. ⏳ TikTok Generator Pro
8. ⏳ Private GPT Pro
9. ⏳ AI Video Generator Pro
10. ⏳ AEO Optimizer Pro

---

## 💡 Tips

### Free Version Limits
- Use Code node to check execution count
- Store count in Google Sheets
- Return error if limit exceeded

### Premium Features
- Add AI processing
- Enable batch operations
- Include analytics
- Add custom templates

### Monetization
- Free: Lead generation
- Premium: $29-99/month
- Custom: $199+/workflow

---

**Ready to build?** Use these templates and patterns! 🚀
