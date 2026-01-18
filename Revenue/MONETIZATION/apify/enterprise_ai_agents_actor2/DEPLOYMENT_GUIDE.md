# 🚀 Apify Deployment Guide - Enterprise AI Agents

**Date:** 2026-01-13
**Status:** Ready for Deployment

---

## 📋 Prerequisites

### 1. Install Apify CLI

**macOS (Homebrew):**
```bash
brew install apify-cli
```

**Or using installation script:**
```bash
curl -fsSL https://apify.com/install-cli.sh | bash
```

**Verify installation:**
```bash
apify --version
```

---

## 🏗️ Project Structure Setup

### Current Structure
```
MONETIZATION/apify/enterprise_ai_agents_actor/
├── main.py              # Apify actor entry point
├── README.md
└── src/                 # Need to create this
    ├── agent_base.py
    ├── enterprise_agents.py
    ├── agent_orchestrator.py
    └── requirements.txt
```

### Apify Requires:
```
enterprise_ai_agents_actor/
├── src/
│   ├── main.py          # Actor entry point
│   ├── agent_base.py
│   ├── enterprise_agents.py
│   ├── agent_orchestrator.py
│   └── requirements.txt
├── .actor/
│   └── actor.json       # Actor configuration
└── README.md
```

---

## 🔧 Setup Steps

### Step 1: Create Actor Structure

```bash
cd /Users/steven/AVATARARTS/Revenue/MONETIZATION/apify

# Create actor from template (if starting fresh)
apify create enterprise-ai-agents -t python-empty

# OR use existing structure
cd enterprise_ai_agents_actor
mkdir -p src
```

### Step 2: Copy Files to src/

```bash
# Copy main.py
cp main.py src/main.py

# Copy agent files from AUTOMATION directory
cp ../../../AUTOMATION/enterprise_ai_agents/agent_base.py src/
cp ../../../AUTOMATION/enterprise_ai_agents/enterprise_agents.py src/
cp ../../../AUTOMATION/enterprise_ai_agents/agent_orchestrator.py src/
cp ../../../AUTOMATION/enterprise_ai_agents/requirements.txt src/
```

### Step 3: Update main.py for Apify Structure

The main.py needs to import from same directory:

```python
# Change from:
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "../../../AUTOMATION/enterprise_ai_agents"))

# To:
from agent_orchestrator import AgentOrchestrator
from agent_base import BaseAgent
from enterprise_agents import ResearchAgent, ContentAgent, AutomationAgent, AnalyticsAgent, IntegrationAgent
```

### Step 4: Create .actor/actor.json

```json
{
  "actorSpecification": 1,
  "name": "enterprise-ai-agents",
  "title": "Enterprise AI Agents Framework",
  "description": "Multi-agent orchestration system for enterprise automation. Research, content generation, automation, analytics, and integration agents.",
  "version": "1.0.0",
  "input": "./input_schema.json",
  "storages": {
    "dataset": "./dataset_schema.json"
  },
  "environmentVariables": {},
  "readme": "./README.md"
}
```

---

## 🚀 Deployment Commands

### 1. Login to Apify
```bash
apify login
```

### 2. Test Locally
```bash
cd enterprise_ai_agents_actor
apify run
```

### 3. Deploy to Apify
```bash
apify push
```

---

## 📝 Quick Setup Script

```bash
#!/bin/bash
# Quick setup script for Apify deployment

cd /Users/steven/AVATARARTS/Revenue/MONETIZATION/apify/enterprise_ai_agents_actor

# Create src directory
mkdir -p src

# Copy main.py
cp main.py src/main.py

# Copy agent files
cp ../../../AUTOMATION/enterprise_ai_agents/agent_base.py src/
cp ../../../AUTOMATION/enterprise_ai_agents/enterprise_agents.py src/
cp ../../../AUTOMATION/enterprise_ai_agents/agent_orchestrator.py src/
cp ../../../AUTOMATION/enterprise_ai_agents/requirements.txt src/

# Update imports in main.py (remove sys.path manipulation)
sed -i '' 's|sys.path.insert.*||g' src/main.py
sed -i '' 's|from agent_orchestrator import|from agent_orchestrator import|g' src/main.py

echo "✅ Files copied to src/"
echo "📝 Next: Update src/main.py imports, then run 'apify push'"
```

---

## ✅ Verification Checklist

- [ ] Apify CLI installed (`apify --version`)
- [ ] Logged in (`apify login`)
- [ ] Files in `src/` directory
- [ ] `main.py` imports updated (no sys.path manipulation)
- [ ] `requirements.txt` in `src/`
- [ ] `.actor/actor.json` created
- [ ] Test locally (`apify run`)
- [ ] Deploy (`apify push`)

---

## 🎯 Expected Result

After `apify push`:
- ✅ Actor deployed to Apify platform
- ✅ Available in "My Actors"
- ✅ Ready to configure pricing
- ✅ Ready to publish to store

---

**Ready to deploy!** Follow the steps above. 🚀
