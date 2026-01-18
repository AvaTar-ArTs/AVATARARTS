# AI Manager Consolidation Guide

## 📦 What Was Consolidated

### Ollama Scripts (Merged)
```
OLD:                                    NEW:
├── ollama_gui.py                       │
├── ollama-run.py                       ├─→ unified_ai_manager.py (GUI + CLI)
└── ollama-run_from_utilities.py         │
    (all 3 had overlapping functionality)

OLD: ollama_test.py                     ├─→ Built into unified_ai_manager.py
    (testing/status features)
```

### OpenAI Scripts (Consolidated)
```
OLD:                                    NEW:
├── openai_client.py                    │
├── openai-cli.py                       ├─→ unified_ai_manager.py (integrated)
└── openai.py                           │
    (all provided OpenAI access)

OLD: openpy.py                          ├─→ Still available as utility
    (Python encoding utility)           │   (standalone, no consolidation needed)
```

### New Structure
```
~/Documents/python/
├── unified_ai_manager.py         ← MAIN: Full-featured manager
├── ai                            ← CLI: Quick command wrapper
├── AI_CONSOLIDATION_GUIDE.md     ← You are here
├── OLLAMA_QUICKSTART.md          ← Ollama setup guide
├── ollama_model_manager.py       ← Model deployment tool
└── AI_CONTENT/
    └── content_creation/
        ├── ollama_gui.py         ← [LEGACY - use unified_ai_manager instead]
        ├── openai-cli.py         ← [LEGACY - use unified_ai_manager instead]
        └── ... (old files archived)
```

---

## 🚀 How to Use the New Unified System

### Option 1: Interactive Mode (Most User-Friendly)
```bash
python3 ~/Documents/python/unified_ai_manager.py
```
**Choose from menu:**
- Chat with Ollama
- Ask OpenAI
- View status
- Launch GUI

### Option 2: GUI Mode (Best for Frequent Use)
```bash
python3 ~/Documents/python/unified_ai_manager.py gui
```
**Features:**
- Tabbed interface (Ollama | OpenAI | Status)
- Real-time responses
- Model management
- Status dashboard

### Option 3: CLI Mode (Fastest for Scripts/Automation)
```bash
# Chat with Ollama
python3 ~/Documents/python/unified_ai_manager.py ollama "Your prompt"

# Ask OpenAI
python3 ~/Documents/python/unified_ai_manager.py openai "Your question"

# Check status
python3 ~/Documents/python/unified_ai_manager.py status

# Launch GUI
python3 ~/Documents/python/unified_ai_manager.py gui
```

### Option 4: Quick CLI Wrapper (Fastest)
```bash
# Make executable
chmod +x ~/Documents/python/ai

# Use as command
python3 ~/Documents/python/ai ollama "Your prompt"
python3 ~/Documents/python/ai openai "Your question"
python3 ~/Documents/python/ai status
python3 ~/Documents/python/ai gui
```

### Option 5: Create Shell Alias (One-Time Setup)
```bash
# Add to ~/.zshrc or ~/.bashrc
alias ai="python3 ~/Documents/python/ai"
alias ai-manager="python3 ~/Documents/python/unified_ai_manager.py"

# Then use directly:
ai ollama "Your prompt"
ai openai "Your question"
ai-manager gui
```

---

## 🔧 Setup Instructions

### Step 1: Install Dependencies
```bash
pip3 install requests openai
```

### Step 2: Configure OpenAI (Optional)
```bash
# Option A: Environment variable
export OPENAI_API_KEY="your-key-here"

# Option B: Add to ~/.zshrc or ~/.bashrc
echo 'export OPENAI_API_KEY="your-key-here"' >> ~/.zshrc
source ~/.zshrc

# Option C: Create ~/.env file
OPENAI_API_KEY=your-key-here
OPENAI_MODEL=gpt-4o
```

### Step 3: Start Ollama (if using Ollama)
```bash
# Terminal 1: Start Ollama service
ollama serve

# Terminal 2: Run manager
python3 ~/Documents/python/unified_ai_manager.py
```

### Step 4: Make CLI Executable (Optional)
```bash
chmod +x ~/Documents/python/ai
```

---

## 📊 Feature Comparison

| Feature | Old | New |
|---------|-----|-----|
| Ollama Chat | ✅ | ✅ (Enhanced) |
| OpenAI Chat | ✅ | ✅ (Integrated) |
| GUI Interface | ✅ | ✅ (Tabbed) |
| CLI Support | ❌ | ✅ (Full) |
| Status Reporting | ✅ | ✅ (Detailed) |
| Error Handling | ⚠️ | ✅ (Production-grade) |
| Logging | ❌ | ✅ (~/.cache/ai_manager.log) |
| Configuration Management | ❌ | ✅ (JSON config) |
| Code Reusability | ❌ | ✅ (Modular classes) |
| Performance | Good | Better (async support) |

---

## 🔄 Migration from Old Scripts

### If You Were Using `ollama_gui.py`
**Before:**
```bash
python3 ~/Documents/python/AI_CONTENT/content_creation/ollama_gui.py
```

**After:**
```bash
python3 ~/Documents/python/unified_ai_manager.py gui
```

### If You Were Using `openai-cli.py`
**Before:**
```bash
python3 ~/Documents/python/AI_CONTENT/content_creation/openai-cli.py "Your question"
```

**After:**
```bash
python3 ~/Documents/python/unified_ai_manager.py openai "Your question"
# Or:
python3 ~/Documents/python/ai openai "Your question"
```

### If You Were Using `ollama_test.py`
**Before:**
```bash
python3 ~/Documents/python/AI_CONTENT/content_creation/ollama_test.py
```

**After:**
```bash
python3 ~/Documents/python/unified_ai_manager.py status
```

---

## 💻 Integration with Your Automation Bots

### Example: Use in AUTOMATION_BOTS

```python
# In your bot script
import sys
sys.path.insert(0, '/Users/steven/Documents/python')

from unified_ai_manager import UnifiedAIManager

manager = UnifiedAIManager()

# Chat with Ollama (local, fast)
response = manager.ollama_chat("Classify this message as positive/negative: 'Great product!'")

# Ask OpenAI (powerful, when needed)
response = manager.openai_ask("Write a tweet about this: 'New feature released'")

# Check status
if manager.ollama.available:
    print("Ollama is ready!")
else:
    print("Ollama is down!")
```

### Example: Use in AI_CONTENT

```python
# In content generation script
from unified_ai_manager import UnifiedAIManager

manager = UnifiedAIManager()

def generate_content(topic):
    # Use local model for speed
    return manager.ollama_chat(f"Write creative content about: {topic}")

def polish_content(content):
    # Use OpenAI for quality when needed
    return manager.openai_ask(f"Improve this content: {content}")
```

---

## 🚨 Troubleshooting

### "Ollama is not running"
```bash
# Terminal 1: Start Ollama
ollama serve

# Terminal 2: Run manager
python3 ~/Documents/python/unified_ai_manager.py status
```

### "OPENAI_API_KEY not set"
```bash
# Add to ~/.zshrc or ~/.bashrc
export OPENAI_API_KEY="sk-..."
source ~/.zshrc

# Verify
echo $OPENAI_API_KEY
```

### "No Ollama models available"
```bash
# Pull a model
ollama pull qwen3-coder:30b

# Check models
python3 ~/Documents/python/unified_ai_manager.py ollama list
```

### "requests module not found"
```bash
pip3 install requests
```

---

## 📚 Documentation

- **Setup:** See `OLLAMA_QUICKSTART.md`
- **Model Management:** See `ollama_model_manager.py`
- **Curl Reference:** See `OLLAMA_CURL_REFERENCE.md`

---

## ✅ What Changed

### Improvements
- ✅ **Removed duplication** - 3 Ollama GUIs → 1 unified interface
- ✅ **Added CLI mode** - No GUI needed for scripts/automation
- ✅ **Better error handling** - Production-grade exceptions
- ✅ **Configuration management** - Persistent settings
- ✅ **Logging** - Debug issues in ~/.cache/ai_manager.log
- ✅ **Modular design** - Easy to import into your projects
- ✅ **Tabbed GUI** - Cleaner interface for both tools

### Backward Compatibility
- Old files still exist in `AI_CONTENT/content_creation/` (for reference)
- All functionality preserved
- No breaking changes to your existing code

---

## 🎯 Recommended Usage by Role

### For Development/Testing
```bash
python3 ~/Documents/python/unified_ai_manager.py
# Interactive menu
```

### For Automation Bots
```python
from unified_ai_manager import UnifiedAIManager
manager = UnifiedAIManager()
response = manager.ollama_chat(prompt)
```

### For Content Creation
```bash
python3 ~/Documents/python/unified_ai_manager.py gui
# Keep GUI open, switch between Ollama/OpenAI tabs
```

### For Quick Commands
```bash
ai ollama "Your prompt"
ai openai "Your question"
```

---

## 🔐 Security Notes

- API keys stored in environment variables (not in code)
- Log file at `~/.cache/ai_manager.log` (review for sensitive data)
- Configuration stored at `~/.ai_manager/config.json` (keep private)

---

**Consolidation Date:** October 26, 2025
**Status:** Ready for production
