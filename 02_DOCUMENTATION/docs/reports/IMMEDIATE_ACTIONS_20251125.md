# ⚡ IMMEDIATE ACTION ITEMS

**Date:** 2025-11-25  
**Priority:** CRITICAL → HIGH → MEDIUM

---

## 🔥 CRITICAL (Do Today - 30 mins total)

### 1. Fix Environment Variable Exports (15 mins)
**Problem:** Variables not being exported (from your audit report)

```bash
cd ~/.env.d/

# Method 1: Quick sed fix (all at once)
for f in *.env; do
    sed -i '' 's/^\([A-Z_][A-Z0-9_]*=\)/export \1/' "$f"
done

# Method 2: Manual verification (safer)
# Open each .env file and add "export " before each variable
# Example: OPENAI_API_KEY=xxx becomes export OPENAI_API_KEY=xxx

# Rebuild master
python3 envctl.py build --force

# Test in new terminal
source ~/.env.d/loader.sh
echo $OPENAI_API_KEY  # Should print your key
```

**Expected Result:** All API keys properly exported to environment

---

### 2. Install Context7 for Claude Desktop (15 mins)

**Step 1:** Get API key from https://context7.com/dashboard

**Step 2:** Add to Claude Desktop config:
```bash
# Edit Claude Desktop config
# File location: ~/.claude/config.json (or similar)

# Add this to mcpServers:
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp", "--api-key", "YOUR_API_KEY"]
    }
  }
}
```

**Step 3:** Restart Claude Desktop

**Step 4:** Test it:
```
"Create Python script using Anthropic SDK. use context7"
```

**Benefits:**
- Up-to-date docs for all your APIs
- No more hallucinated functions
- Version-specific examples

---

## 🎯 HIGH PRIORITY (This Week - 4 hours total)

### 3. Create API Cost Tracker Prototype (2 hours)

```python
# ~/scripts/api-operations/cost_tracker.py

import openai
import anthropic
from datetime import datetime
import csv

class APIUsageTracker:
    def __init__(self):
        self.log_file = "~/api_usage_log.csv"
        self.setup_log()
    
    def setup_log(self):
        with open(self.log_file, 'w') as f:
            writer = csv.writer(f)
            writer.writerow([
                'timestamp', 'provider', 'model', 
                'tokens', 'estimated_cost', 'project'
            ])
    
    def log_usage(self, provider, model, tokens, cost, project):
        with open(self.log_file, 'a') as f:
            writer = csv.writer(f)
            writer.writerow([
                datetime.now().isoformat(),
                provider, model, tokens, cost, project
            ])
    
    def get_summary(self, days=30):
        # Read log and generate summary
        # Group by provider, calculate totals
        # Return report
        pass

# Start with just OpenAI and Anthropic
# Expand to other providers later
```

**Integration:**
- Add to all Python scripts that call APIs
- Create n8n workflow to aggregate daily
- Send summary to Notion weekly

---

### 4. Audit LLM Provider Usage (2 hours)

**Goal:** Identify which of your 11 LLM providers you actually use

**Steps:**

1. **Check recent logs:**
```bash
# Search for API calls in recent scripts
cd ~/scripts
grep -r "openai" . | wc -l
grep -r "anthropic" . | wc -l
grep -r "groq" . | wc -l
# etc. for each provider
```

2. **Review last 3 months:**
- Check provider dashboards for usage
- Download usage reports where available
- Create spreadsheet comparing:
  - Total requests
  - Total cost
  - Average cost per request
  - Use case (what was it used for)

3. **Make consolidation decision:**
- Keep: Top 5 by usage OR unique capability
- Drop: Redundant providers with low usage
- Result: Save 25-35% on API costs

**Recommended Core Stack:**
1. **Anthropic Claude** - Code, analysis, long-context
2. **OpenAI GPT** - Creative, established ecosystem
3. **Groq** - Speed-critical operations
4. **Perplexity** - Research queries
5. **One alt** - Mistral or DeepSeek based on your usage

---

## 💰 MEDIUM PRIORITY (This Month - 8 hours total)

### 5. Music Metadata Pipeline (4 hours)

**Goal:** Transcribe and organize your 1,123 MP3 files

**Phase 1 - Pilot (100 files):**

```python
import assemblyai as aai
from pathlib import Path
import json

aai.settings.api_key = os.getenv('ASSEMBLYAI_API_KEY')

music_dir = Path("~/workspace/music-empire/suno-complete-catalog")
output_dir = Path("~/workspace/music-empire/metadata")

for mp3 in music_dir.glob("*.mp3")[:100]:  # Start with 100
    print(f"Transcribing: {mp3.name}")
    
    # Transcribe
    transcriber = aai.Transcriber()
    transcript = transcriber.transcribe(str(mp3))
    
    # Extract metadata
    metadata = {
        "filename": mp3.name,
        "lyrics": transcript.text,
        "duration": transcript.audio_duration,
        "themes": extract_trashcat_themes(transcript.text),  # Custom function
        "mood": analyze_mood(transcript.text),
        "transcription_date": datetime.now().isoformat()
    }
    
    # Save to JSON
    output_file = output_dir / f"{mp3.stem}.json"
    with open(output_file, 'w') as f:
        json.dump(metadata, f, indent=2)
```

**Phase 2 - Full Catalog:**
- Batch process remaining files
- Store in ChromaDB for semantic search
- Create Notion database with metadata
- Link to TrashCat narrative themes

---

### 6. n8n Workflow Templates (4 hours)

**Create 3 Essential Workflows:**

**Workflow 1: API Cost Aggregation**
```
Trigger: Daily at midnight
↓
Fetch usage from OpenAI, Anthropic, etc.
↓
Calculate costs
↓
Store in Notion database
↓
If monthly total > $200:
  → Send Telegram alert
```

**Workflow 2: Music Generation Pipeline**
```
Trigger: New row in Notion (TrashCat prompts)
↓
Call Suno API with prompt
↓
Wait for generation
↓
Download MP3
↓
Transcribe with AssemblyAI
↓
Extract themes
↓
Store metadata in ChromaDB
↓
Upload to Cloudflare R2
↓
Update Notion with results
```

**Workflow 3: Error Monitoring Hub**
```
Trigger: Webhook from any system
↓
Parse error details
↓
Check severity
↓
If critical:
  → Immediate Slack alert
If warning:
  → Log to Notion
If info:
  → Store for weekly summary
```

---

## 📊 TRACKING & METRICS

### Week 1 Checklist

- [ ] Environment exports fixed and tested
- [ ] Context7 installed and working
- [ ] API cost tracker prototype running
- [ ] LLM provider audit completed

### Week 2 Checklist

- [ ] LLM provider consolidation decided
- [ ] API keys for dropped providers documented
- [ ] Music metadata pilot (100 files) complete
- [ ] Cost tracking integrated into main workflows

### Week 3 Checklist

- [ ] n8n workflow templates created
- [ ] Full music catalog transcription started
- [ ] Weekly cost reports automated

### Week 4 Checklist

- [ ] Cost dashboard in Notion complete
- [ ] Music metadata in ChromaDB
- [ ] Backup verification system running
- [ ] Documentation updated

---

## 🎯 SUCCESS CRITERIA

### By End of Week 1:
- ✅ All environment variables export correctly
- ✅ Context7 responding to queries
- ✅ Cost tracking collecting data

### By End of Month:
- ✅ 25% reduction in API costs
- ✅ 100% of music files have metadata
- ✅ 3 n8n workflows operational
- ✅ Weekly cost reports automated

### By End of Quarter (Q1 2025):
- ✅ Full TrashCat universe knowledge base
- ✅ Multi-platform content engine live
- ✅ Revenue dashboard operational
- ✅ Technical debt <20% of original

---

## 💡 QUICK REFERENCE

### Important File Locations

```bash
~/.env.d/MASTER_CONSOLIDATED.env    # Main environment file
~/.env.d/envctl.py                  # Management tool
~/scripts/api-operations/           # API interaction scripts
~/workspace/music-empire/           # Your music catalog
~/.claude/config.json               # Claude Desktop config
```

### Key Commands

```bash
# Environment Management
source ~/.env.d/loader.sh           # Load all variables
python3 ~/.env.d/envctl.py build    # Rebuild master

# System Checks
echo $OPENAI_API_KEY               # Test if exported
env | grep API                      # List all API vars

# Music Operations
cd ~/workspace/music-empire
find . -name "*.mp3" | wc -l       # Count MP3s

# Cost Tracking
python3 ~/scripts/api-operations/cost_tracker.py summary
```

### Your API Categories (17 Total)

1. llm-apis (11 providers)
2. art-vision (9 providers)
3. audio-music (8 providers)
4. automation-agents (7 providers)
5. cloud-infrastructure
6. storage
7. documents
8. enhanced-video-generator
9. gemini
10. github
11. monitoring
12. n8n-database
13. notifications
14. other-tools
15. seo-analytics
16. vector-memory
17. cursor

---

## 🚨 COMMON ISSUES & FIXES

### Issue: "Command not found: envctl"

**Fix:**
```bash
alias envctl='python3 ~/.env.d/envctl.py'
# Add to ~/.zshrc to make permanent
```

### Issue: Variables not loading

**Fix:**
```bash
# Make sure to add "export" prefix
export OPENAI_API_KEY=xxx

# Then rebuild and reload
cd ~/.env.d
python3 envctl.py build --force
source ~/.env.d/loader.sh
```

### Issue: Context7 not responding

**Fix:**
```bash
# Check if MCP server is running
ps aux | grep context7

# Restart Claude Desktop
# Check logs in Claude Desktop settings
```

### Issue: AssemblyAI rate limits

**Fix:**
```python
# Add rate limiting to your script
import time

for mp3 in mp3_files:
    transcribe(mp3)
    time.sleep(2)  # 2 second delay between calls
```

---

## 📞 SUPPORT RESOURCES

### Documentation
- Full Analysis: ~/COMPREHENSIVE_SYSTEM_ANALYSIS_20251125.md
- API Audit: ~/.env.d/API_AUDIT_REPORT.md
- Quick Start: ~/.env.d/QUICKSTART.md

### Tools
- envctl.py - Environment management
- Desktop Commander - File operations
- Context7 - Library documentation
- n8n - Workflow automation

### Next Steps
1. Complete critical items today
2. Schedule 2 hours this week for high priority items
3. Review progress Friday
4. Update tracking checklist

---

**Last Updated:** 2025-11-25  
**Status:** 🚀 Ready for Implementation  
**Expected Impact:** $2K-3K annual savings + 10+ hours/week time savings
