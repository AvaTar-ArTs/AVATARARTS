# OLLAMA MODEL MANAGER - Quick Start Guide

## 📦 Your Setup

You now have **3 complementary tools** to manage Ollama models based on your deployment strategy:

### 1. **Python Script** (Recommended for automation)
```bash
python3 ~/Documents/python/ollama_model_manager.py
```
**Features:**
- Interactive menu or command-line mode
- Status reporting
- Model deployment automation
- Integration with your codebase
- Disk usage tracking

**Usage Examples:**
```bash
# Interactive mode
python3 ~/Documents/python/ollama_model_manager.py

# Command line mode
python3 ~/Documents/python/ollama_model_manager.py status
python3 ~/Documents/python/ollama_model_manager.py strategy
python3 ~/Documents/python/ollama_model_manager.py deploy-local
python3 ~/Documents/python/ollama_model_manager.py pull qwen3-coder:30b
python3 ~/Documents/python/ollama_model_manager.py remove gemma:4b
```

### 2. **Bash Script** (Quick CLI operations)
```bash
bash ~/Documents/python/ollama-manager.sh
```
**Features:**
- Colored output
- Quick status checks
- Easy deployment
- Model removal with confirmation

**Usage Examples:**
```bash
bash ~/Documents/python/ollama-manager.sh status
bash ~/Documents/python/ollama-manager.sh strategy
bash ~/Documents/python/ollama-manager.sh deploy-local
bash ~/Documents/python/ollama-manager.sh deploy-optional
bash ~/Documents/python/ollama-manager.sh list
bash ~/Documents/python/ollama-manager.sh pull qwen3-coder:30b
bash ~/Documents/python/ollama-manager.sh remove gemma:4b
```

### 3. **Curl Reference** (Direct API calls)
See: `OLLAMA_CURL_REFERENCE.md`

**Quick Reference:**
```bash
# List models
curl -s http://localhost:11434/api/tags | jq '.models[]?.name'

# Pull a model
curl -s -X POST http://localhost:11434/api/pull \
  -H "Content-Type: application/json" \
  -d '{"name": "qwen3-coder:30b"}'

# Delete a model
curl -s -X DELETE http://localhost:11434/api/delete \
  -H "Content-Type: application/json" \
  -d '{"name": "gemma:4b"}'
```

---

## 🚀 Recommended Deployment Order

### Phase 1: Start Here (Local Priority)
Deploy these first. They run locally and power your automation:

```bash
# Option A: Using Python script (recommended for automation)
python3 ~/Documents/python/ollama_model_manager.py deploy-local

# Option B: Using Bash script
bash ~/Documents/python/ollama-manager.sh deploy-local

# Option C: Manual curl
curl -s -X POST http://localhost:11434/api/pull \
  -H "Content-Type: application/json" \
  -d '{"name": "qwen3-coder:30b"}'

curl -s -X POST http://localhost:11434/api/pull \
  -H "Content-Type: application/json" \
  -d '{"name": "gemma:4b"}'
```

**Models:**
- `qwen3-coder:30b` (~18GB) - Local code analysis & bot logic
- `gemma:4b` (~2.4GB) - Lightweight filtering & routing

### Phase 2: Optional Backup (When Space Available)
```bash
# Python
python3 ~/Documents/python/ollama_model_manager.py deploy-backup

# Bash
bash ~/Documents/python/ollama-manager.sh deploy-optional
```

**Models:**
- `gpt-oss:120b` (~70GB) - Alternative content generation
- `deepseek-r1:8b` (~5GB) - Reasoning-based tasks

### Phase 3: Cloud Access (Configuration)
For the largest models (480b+, 671b), you need Ollama cloud setup:

```bash
# Login to Ollama cloud
ollama login

# Then use in your scripts
python3 ~/Documents/python/ollama_model_manager.py
# Choose: 4. Deploy Cloud Access Models
```

---

## 📊 Integration with Your Python Codebase

Since you have sophisticated AI analysis tools, integrate Ollama like this:

### Example: Code Analysis Bot

```python
import requests
import json

class OllamaCodeAnalyzer:
    def __init__(self):
        self.api_url = "http://localhost:11434"
        self.model = "qwen3-coder:30b"
    
    def analyze_code(self, code_snippet):
        """Analyze code using local Ollama model."""
        response = requests.post(
            f"{self.api_url}/api/generate",
            json={
                "model": self.model,
                "prompt": f"Analyze this code and suggest improvements:\n\n{code_snippet}",
                "stream": False
            }
        )
        return response.json()["response"]

# Usage in your AI_CONTENT or AUTOMATION_BOTS
analyzer = OllamaCodeAnalyzer()
result = analyzer.analyze_code("def my_func(): pass")
print(result)
```

### Example: Bot Routing

```python
def route_query(query):
    """Use gemma:4b to route queries to appropriate handlers."""
    response = requests.post(
        "http://localhost:11434/api/generate",
        json={
            "model": "gemma:4b",  # lightweight
            "prompt": f"Is this a code question or a general question? {query}",
            "stream": False
        }
    )
    
    if "code" in response.json()["response"].lower():
        return "code_handler"
    return "general_handler"
```

---

## 🔧 Setup Prerequisites

### 1. Make Scripts Executable
```bash
chmod +x ~/Documents/python/ollama-manager.sh
chmod +x ~/Documents/python/ollama_model_manager.py
```

### 2. Install Python Dependencies
```bash
pip3 install requests
```

### 3. Start Ollama Service
```bash
# In a new terminal
ollama serve

# Or if installed as service
brew services start ollama  # macOS
```

### 4. Verify Installation
```bash
# Check if Ollama is running
curl http://localhost:11434/api/tags

# Should return JSON with models array
```

---

## 📋 Monitoring & Maintenance

### Check Status Regularly
```bash
python3 ~/Documents/python/ollama_model_manager.py status
```

### Free Up Disk Space
```bash
python3 ~/Documents/python/ollama_model_manager.py remove <model_name>
```

### Update Models
```bash
# Pull latest version of a model
ollama pull qwen3-coder:30b --latest
```

---

## 🎯 For Your Specific Use Cases

### AI Content Generation
- **Primary:** `deepseeek-v3.1:671b` (cloud, when needed)
- **Local Alternative:** `gpt-oss:120b`
- **Fast Alternative:** `qwen3-coder:30b` (it's actually good at general content too)

### Automation Bots (Instagram, YouTube, etc.)
- **Use:** `qwen3-coder:30b` (local) for decision-making
- **Fallback:** `gemma:4b` (local) for lightweight routing
- **Decision:** Use local models to avoid latency

### Code Analysis & Intelligence
- **Primary:** `qwen3-coder:480b` (cloud)
- **Local:** `qwen3-coder:30b`
- **Integrate:** Into your existing `advanced_code_intelligence.py`

### Media Processing
- **Primary:** `qwen3-vision:235b` (cloud, requires login)
- **Alternative:** Use smaller models + custom vision logic

---

## 🆘 Troubleshooting

### "Ollama is not running"
```bash
# Start Ollama service
ollama serve

# Or check if it's already running
ps aux | grep ollama
```

### "Model download interrupted"
```bash
# Resume pull (Ollama will continue from checkpoint)
python3 ~/Documents/python/ollama_model_manager.py pull qwen3-coder:30b
```

### "Not enough disk space"
```bash
# Check available space
df -h

# Remove unused models
python3 ~/Documents/python/ollama_model_manager.py
# Choose: 8. Remove a Model
```

### "Model inference is slow"
```bash
# Check what models are loaded
curl -s http://localhost:11434/api/tags | jq '.models[]?.name'

# Unload large models you're not using
python3 ~/Documents/python/ollama_model_manager.py remove <model_name>
```

---

## 💡 Pro Tips

1. **Keep Python script handy** - Use it in cron jobs or automation scripts
2. **Use bash script for testing** - Quick status checks while developing
3. **Refer to curl reference** - When integrating into web services
4. **Monitor disk usage** - Large models consume 5-400GB each
5. **Cache responses** - Model inference is the bottleneck, not API calls

---

## 📞 Quick Links

- **Files Directory:** `~/Documents/python/`
- **Models Directory:** `~/.ollama/models/`
- **Ollama Docs:** https://github.com/ollama/ollama
- **Model Library:** https://ollama.ai/library

---

**Last Updated:** October 26, 2025
**Status:** Ready for deployment
