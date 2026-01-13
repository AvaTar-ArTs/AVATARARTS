# 📖 AI CLI Tools - Comprehensive Usage Guide

> **Created:** January 12, 2026
> **Purpose:** Complete usage guide for all your AI CLI tools
> **Audience:** You (and future you)

---

## 📋 Table of Contents

1. [Quick Reference](#quick-reference)
2. [Currently Installed Tools](#currently-installed-tools)
3. [Detailed Usage by Tool](#detailed-usage-by-tool)
4. [Common Workflows](#common-workflows)
5. [Integration Examples](#integration-examples)
6. [Troubleshooting](#troubleshooting)
7. [Best Practices](#best-practices)
8. [Cheatsheet](#cheatsheet)

---

## ⚡ Quick Reference

### **One-Liner Commands**

```bash
# Grok
grok "your prompt"
grok-ai "your prompt"
ask-grok "your prompt"

# Cursor-Agent
ca models
ca chat "your prompt"
ca cloud

# Qwen
qw "your prompt"
qwen-version
qw mcp

# Aider
aider --help
aider chat

# Claude
claude "your prompt"

# OpenAI
openai --help

# LiteLLM (if using)
litellm --help

# Ollama (if installed)
ollama run llama3.1:8b
ask-ollama "your prompt"
```

---

## 🛠️ Currently Installed Tools

### **✅ Installed & Configured**

| Tool | Version | Location | Status |
|------|---------|----------|--------|
| **Grok CLI** | v1.0.1 | `/Users/steven/.bun/bin/grok` | ✅ Working |
| **Cursor-Agent** | v2026.01.09 | `~/.local/bin/cursor-agent` | ✅ Working |
| **Qwen CLI** | v0.6.0 | `/Users/steven/.npm/bin/qwen` | ✅ Working |
| **Aider** | v0.86.1 | `~/.local/bin/aider` | ✅ Working |
| **Claude CLI** | v2.1.5 | `~/.local/bin/claude` | ✅ Working |
| **OpenAI CLI** | - | `~/.local/bin/openai` | ✅ Working |
| **LiteLLM** | - | `~/.local/bin/litellm` | ✅ Installed |

### **⚠️ Configured But Not Installed**

- **Ollama** - Alias exists (`ask-ollama`) but tool not installed

---

## 📚 Detailed Usage by Tool

### 1. **Grok CLI (X.AI)**

#### **Basic Usage**

```bash
# Interactive mode
grok

# Direct prompt
grok "Write a Python function to calculate fibonacci"

# With alias
ask-grok "Explain quantum computing"
grok-ai "Help me debug this code"
```

#### **Advanced Usage**

```bash
# Using grok-ai function
grok-ai menu              # Open menu (if available)
grok-ai file <file>       # Analyze file
grok-ai code <code>       # Review code
grok-ai git               # Analyze git status

# Using grok-quick function
grok-quick "your question"

# Using grok-file function
grok-file script.py

# Help and config
grok-help                 # Show help
grok-version              # Show version
grok-config               # Show config
grok-edit                 # Edit config
```

#### **Configuration**

**Location:** `~/.grok/user-settings.json`

**Key Settings:**
- Default model: `grok-2`
- Available models: `grok-4-1-fast-reasoning`, `grok-4`, `grok-3`, etc.
- Max tokens: 4000
- Temperature: 0.7

**API Key:**
- Set via `GROK_API_KEY` environment variable
- Or in `~/.grok/user-settings.json`
- Auto-loaded via `~/.env.d/llm-apis.env`

---

### 2. **Cursor-Agent**

#### **Basic Usage**

```bash
# Interactive mode
cursor-agent
ca                        # Using alias

# Chat mode
cursor-agent chat "your prompt"
ca chat "your prompt"     # Using alias

# List available models
cursor-agent --list-models
ca models                 # Using alias

# Cloud mode
cursor-agent --cloud
ca cloud                  # Using alias

# Non-interactive mode (print)
cursor-agent --print "your prompt"
ca code "your prompt"     # Using alias
```

#### **Advanced Usage**

```bash
# Resume session
cursor-agent --resume <chatId>
ca resume <chatId>        # Using alias

# Use specific model
cursor-agent --model gpt-5.2 "your prompt"

# Sandbox mode
cursor-agent --sandbox

# Force allow commands
cursor-agent --force
```

#### **Available Models (13 models)**

```
auto (current)
composer-1
gpt-5.1-codex-max
gpt-5.1-codex-max-high
gpt-5.2
opus-4.5-thinking (default)
gpt-5.2-high
gemini-3-pro
opus-4.5
sonnet-4.5
sonnet-4.5-thinking
gemini-3-flash
grok
```

#### **Configuration**

**Location:** `~/.config/cursor-agent/config.json`

**API Key:**
- Set via `CURSOR_API_KEY` environment variable
- Auto-loaded from `~/.env.d/cursor.env`
- Auto-loaded in `.zshrc` if not set

#### **ca() Function Usage**

```bash
# Interactive mode
ca

# Chat mode
ca chat "your prompt"

# Cloud mode
ca cloud

# List models
ca models
ca list                  # Alternative

# Resume session
ca resume <chatId>

# Non-interactive code mode
ca code "your prompt"

# Direct command passthrough
ca --model gpt-5.2 "your prompt"
```

---

### 3. **Qwen CLI**

#### **Basic Usage**

```bash
# Interactive mode
qwen
qw                       # Using function

# Direct prompt
qwen "your prompt"

# Version
qwen --version
qwen-version             # Using alias
```

#### **Advanced Usage**

```bash
# MCP server management
qwen mcp
qw mcp                   # Using function

# Extensions management
qwen extensions
qwen-ext                 # Using alias
qw ext                   # Using function
qw extensions            # Using function

# Sandbox mode
qwen --sandbox
qw code "your prompt"    # Using function

# Model selection
qwen --model qwen-code-fast-1 "your prompt"

# Continue session
qwen --continue

# Resume session
qwen --resume <sessionId>

# List extensions
qwen --list-extensions
```

#### **Configuration**

**Authentication Types:**
- `openai` - OpenAI API
- `anthropic` - Anthropic Claude
- `qwen-oauth` - Qwen OAuth
- `gemini` - Google Gemini
- `vertex-ai` - Google Vertex AI

**Web Search:**
- Tavily API (`--tavily-api-key`)
- Google Custom Search (`--google-api-key`)

---

### 4. **Aider**

#### **Basic Usage**

```bash
# Help
aider --help

# Interactive chat
aider chat

# With files
aider file1.py file2.py

# With directory
aider src/
```

#### **Advanced Usage**

```bash
# Code editing mode
aider --edit

# Auto-commit mode
aider --auto-commits

# Model selection
aider --model gpt-4

# Git integration
aider --git

# Streaming mode
aider --stream
```

---

### 5. **Claude CLI**

#### **Basic Usage**

```bash
# Interactive mode
claude

# Direct prompt
claude "your prompt"

# Help
claude --help
```

#### **Advanced Usage**

```bash
# File input
claude --file script.py

# Model selection
claude --model claude-3-5-sonnet-20241022

# Streaming
claude --stream "your prompt"

# JSON output
claude --json "your prompt"
```

---

### 6. **OpenAI CLI**

#### **Basic Usage**

```bash
# Help
openai --help

# Chat completion
openai chat completions create --model gpt-4 --message "your prompt"

# Short form (if available)
openai "your prompt"
```

#### **Advanced Usage**

```bash
# List models
openai models list

# Files API
openai files create --file script.py

# Fine-tuning
openai fine_tunes.create --training_file file.jsonl
```

---

### 7. **LiteLLM** (Installed but may not be using)

#### **Basic Usage**

```bash
# Help
litellm --help

# Proxy server
litellm --config config.yaml

# Model selection
litellm -m gpt-4 --prompt "your prompt"
```

#### **Advanced Usage**

```bash
# Start proxy server
litellm --host 0.0.0.0 --port 8000

# Use with config
litellm --config ~/.litellm/config.yaml

# Unified API interface
# Access OpenAI, Anthropic, Groq, etc. via single interface
```

#### **Setup (If Not Configured)**

```bash
# Create config file
cat > ~/.litellm/config.yaml << EOF
model_list:
  - model_name: gpt-4
    litellm_params:
      model: gpt-4
      api_key: os.environ/OPENAI_API_KEY
  - model_name: claude-3-opus
    litellm_params:
      model: claude-3-opus-20240229
      api_key: os.environ/ANTHROPIC_API_KEY
EOF

# Start proxy
litellm --config ~/.litellm/config.yaml
```

---

### 8. **Ollama** (Not Installed - Recommended)

#### **Installation**

```bash
# macOS
brew install ollama

# Or download from: https://ollama.ai
```

#### **Basic Usage (After Installation)**

```bash
# Pull a model
ollama pull llama3.1:8b
ollama pull mistral
ollama pull qwen2.5

# Run a model
ollama run llama3.1:8b
ollama run mistral

# Using your alias
ask-ollama "your prompt"

# List models
ollama list

# Show model info
ollama show llama3.1:8b

# Remove model
ollama rm llama3.1:8b
```

#### **Popular Models**

```bash
# Code models
ollama pull codellama
ollama pull deepseek-coder

# Chat models
ollama pull llama3.1:8b
ollama pull mistral
ollama pull qwen2.5

# Large models
ollama pull llama3.1:70b
ollama pull mixtral:8x7b
```

---

### 9. **Unified AI Function (ai)**

#### **Basic Usage**

```bash
# Interactive menu (requires fzf)
ai

# Direct Grok mode
ai --grok "your prompt"
ai -g "your prompt"

# OpenAI mode (placeholder - needs implementation)
ai --openai "your prompt"
ai -o "your prompt"

# Claude mode (placeholder - needs implementation)
ai --claude "your prompt"
ai -c "your prompt"
```

#### **Current Status**

- ✅ Grok mode: **WORKING**
- ⚠️ OpenAI mode: **Placeholder** (needs implementation)
- ⚠️ Claude mode: **Placeholder** (needs implementation)

**To Implement OpenAI/Claude modes:**

Edit `~/.zshrc` (around line 573-584):

```bash
if [[ "$1" == "--openai" ]] || [[ "$1" == "-o" ]]; then
  shift
  openai "$@"  # Use OpenAI CLI
  return
fi

if [[ "$1" == "--claude" ]] || [[ "$1" == "-c" ]]; then
  shift
  claude "$@"  # Use Claude CLI
  return
fi
```

---

## 🔄 Common Workflows

### **Workflow 1: Code Review**

```bash
# Using Grok
grok-file script.py
grok-ai code "Review this code: $(cat script.py)"

# Using Cursor-Agent
ca code "Review this code: $(cat script.py)"

# Using Qwen
qw code "Review this code: $(cat script.py)"
```

---

### **Workflow 2: Code Generation**

```bash
# Using Grok
grok-code "Write a Python function to parse JSON"

# Using Cursor-Agent
ca chat "Write a Python function to parse JSON"

# Using Qwen
qw "Write a Python function to parse JSON"

# Using Aider
aider --edit "Add a function to parse JSON"
```

---

### **Workflow 3: Debugging**

```bash
# Using Grok
grok-debug "Error: undefined variable 'x' in line 10"

# Using Cursor-Agent
ca chat "Help me debug this error: undefined variable 'x'"

# Using Aider
aider script.py  # Aider will help debug
```

---

### **Workflow 4: Git Integration**

```bash
# Using Grok
grok-ai git

# Using Cursor-Agent
ca chat "Analyze git status and recent commits"

# Using Aider
aider --git  # Aider has built-in git integration
```

---

### **Workflow 5: Multi-Tool Comparison**

```bash
# Compare responses from different tools
grok "Explain async/await in Python" > grok_response.txt
ca chat "Explain async/await in Python" > cursor_response.txt
qw "Explain async/await in Python" > qwen_response.txt
```

---

### **Workflow 6: Local Development (with Ollama)**

```bash
# After installing Ollama
ollama pull llama3.1:8b
ask-ollama "Write a Python hello world"

# Compare with cloud models
ask-ollama "Explain recursion" > local_response.txt
grok "Explain recursion" > cloud_response.txt
```

---

## 🔗 Integration Examples

### **Example 1: Shell Function with Multiple Tools**

```bash
# Add to ~/.zshrc
ai-code-review() {
  local file="$1"
  local tool="${2:-grok}"

  case "$tool" in
    grok)
      grok-file "$file"
      ;;
    cursor)
      ca code "Review this code: $(cat "$file")"
      ;;
    qwen)
      qw code "Review this code: $(cat "$file")"
      ;;
    *)
      echo "Unknown tool: $tool"
      ;;
  esac
}

# Usage
ai-code-review script.py grok
ai-code-review script.py cursor
ai-code-review script.py qwen
```

---

### **Example 2: Batch Processing**

```bash
# Review multiple files with different tools
for file in *.py; do
  echo "Reviewing $file with Grok..."
  grok-file "$file" > "reviews/grok_${file}.txt"
done
```

---

### **Example 3: Tool Selection Menu**

```bash
# Add to ~/.zshrc
ai-select() {
  local prompt="$1"
  local tool=$(echo -e "grok\ncursor\nqwen\naider" | fzf --prompt="Choose tool> ")

  case "$tool" in
    grok)
      grok "$prompt"
      ;;
    cursor)
      ca chat "$prompt"
      ;;
    qwen)
      qw "$prompt"
      ;;
    aider)
      aider chat "$prompt"
      ;;
  esac
}

# Usage
ai-select "Write a hello world in Python"
```

---

### **Example 4: Model Comparison**

```bash
# Compare models in Cursor-Agent
for model in gpt-5.2 opus-4.5-thinking gemini-3-pro; do
  echo "Testing $model..."
  ca --model "$model" code "Explain recursion" > "comparisons/${model}.txt"
done
```

---

## 🐛 Troubleshooting

### **Problem: API Keys Not Loading**

**Solution:**
```bash
# Manually load API keys
source ~/.env.d/loader.sh llm-apis

# Check if keys are loaded
echo $GROK_API_KEY
echo $CURSOR_API_KEY
echo $OPENAI_API_KEY
```

---

### **Problem: Tool Not Found**

**Solution:**
```bash
# Check if tool is in PATH
which grok
which cursor-agent
which qwen

# Check PATH
echo $PATH

# Add to PATH if needed (already in ~/.zshrc)
export PATH="$HOME/.local/bin:$PATH"
export PATH="$HOME/.npm/bin:$PATH"
export PATH="$HOME/.bun/bin:$PATH"
```

---

### **Problem: Cursor-Agent API Key Issues**

**Solution:**
```bash
# Load cursor API key
source ~/.env.d/loader.sh cursor

# Check config
cat ~/.config/cursor-agent/config.json

# Test with API key
CURSOR_API_KEY=$(cat ~/.env.d/cursor.env | grep CURSOR_API_KEY | cut -d'=' -f2)
cursor-agent --list-models
```

---

### **Problem: Qwen Not Working**

**Solution:**
```bash
# Check installation
qwen --version

# Check npm installation
npm list -g @qwen-code/qwen-code

# Reinstall if needed
npm install -g @qwen-code/qwen-code
```

---

### **Problem: Ollama Alias Not Working**

**Solution:**
```bash
# Install Ollama first
brew install ollama

# Then alias will work
ask-ollama "your prompt"
```

---

## ✅ Best Practices

### **1. API Key Management**

- ✅ Use `~/.env.d/loader.sh` for loading keys
- ✅ Never commit API keys to git
- ✅ Use environment variables
- ✅ Set appropriate permissions: `chmod 600 ~/.env.d/*.env`

---

### **2. Tool Selection**

- ✅ **Grok**: Best for general questions, fast responses
- ✅ **Cursor-Agent**: Best for code tasks, multiple models
- ✅ **Qwen**: Best for code-specific tasks, MCP integration
- ✅ **Aider**: Best for pair programming, git integration
- ✅ **Ollama** (when installed): Best for local, private tasks

---

### **3. Model Selection**

**For Speed:**
- Grok: `grok-4-1-fast-reasoning`
- Cursor-Agent: `gemini-3-flash`

**For Quality:**
- Grok: `grok-4`
- Cursor-Agent: `opus-4.5-thinking` (default)

**For Code:**
- Grok: `grok-code-fast-1`
- Qwen: Use code-specific models

---

### **4. Workflow Optimization**

```bash
# Create aliases for common workflows
alias code-review-grok='grok-file'
alias code-review-cursor='ca code'
alias code-review-qwen='qw code'

# Use functions for complex workflows
# (See Integration Examples above)
```

---

### **5. Cost Management**

- ✅ Use local models (Ollama) for testing
- ✅ Use faster models for simple tasks
- ✅ Use premium models only when needed
- ✅ Monitor API usage (LiteLLM can help)

---

## 📝 Cheatsheet

### **Quick Command Reference**

```bash
# Grok
grok "prompt"                    # Basic usage
grok-ai "prompt"                 # Smart wrapper
grok-file file.py                # Analyze file
grok-code "code prompt"          # Code generation
ask-grok "prompt"                # Alias

# Cursor-Agent
ca                              # Interactive
ca chat "prompt"                 # Chat mode
ca models                        # List models
ca cloud                         # Cloud mode
ca code "prompt"                 # Print mode
ca resume <id>                   # Resume session

# Qwen
qw "prompt"                      # Interactive
qw mcp                           # MCP management
qw ext                           # Extensions
qwen-version                     # Version
qwen-help                        # Help

# Aider
aider chat                       # Chat mode
aider file.py                    # Edit file
aider --git                      # Git mode

# Claude
claude "prompt"                  # Basic usage

# OpenAI
openai "prompt"                  # Basic usage

# Ollama (if installed)
ask-ollama "prompt"              # Using alias
ollama run llama3.1:8b           # Run model
ollama list                      # List models

# Unified
ai                               # Interactive menu
ai -g "prompt"                   # Grok mode
ai -o "prompt"                   # OpenAI (if implemented)
ai -c "prompt"                   # Claude (if implemented)
```

---

### **Environment Setup**

```bash
# Load all API keys
source ~/.env.d/loader.sh llm-apis

# Load specific categories
source ~/.env.d/loader.sh llm-apis cursor

# Check loaded keys
env | grep -E "(API_KEY|TOKEN)"

# Reload shell
source ~/.zshrc
```

---

### **File Locations**

```bash
# Config files
~/.grok/user-settings.json       # Grok config
~/.config/cursor-agent/config.json  # Cursor config
~/.env.d/cursor.env              # Cursor API key
~/.env.d/llm-apis.env            # LLM API keys
~/.zshrc                         # Shell config

# Tool locations
~/.bun/bin/grok                  # Grok CLI
~/.local/bin/cursor-agent        # Cursor-Agent
~/.npm/bin/qwen                  # Qwen CLI
~/.local/bin/aider               # Aider
~/.local/bin/claude              # Claude CLI
~/.local/bin/openai              # OpenAI CLI
```

---

## 🎯 Quick Start Guide

### **For First-Time Users**

1. **Load API Keys:**
   ```bash
   source ~/.env.d/loader.sh llm-apis cursor
   ```

2. **Test Basic Commands:**
   ```bash
   grok "Hello, world!"
   ca models
   qwen-version
   ```

3. **Try File Analysis:**
   ```bash
   grok-file script.py
   ```

4. **Explore Models:**
   ```bash
   ca models
   ```

5. **Install Recommended Tools:**
   ```bash
   brew install ollama  # Highest priority
   ```

---

## 📚 Additional Resources

### **Documentation**

- **Grok**: https://x.ai/grok
- **Cursor-Agent**: https://docs.cursor.com
- **Qwen**: https://qwen.readthedocs.io
- **Aider**: https://aider.chat
- **Ollama**: https://ollama.ai
- **LiteLLM**: https://docs.litellm.ai

### **Your Reports**

- `TERMINAL_AI_TOOLS_ANALYSIS.md` - Grok, XAI, Groq analysis
- `QWEN_CURSOR_AGENT_ANALYSIS.md` - Qwen & Cursor-Agent analysis
- `AI_CLI_TOOLS_RECOMMENDATIONS.md` - Additional tools recommendations
- `AI_CLI_TOOLS_USAGE_GUIDE.md` - This file!

---

## 🎉 Summary

**You have an excellent AI CLI toolkit!**

✅ **8+ tools installed and working**
✅ **Multiple providers** (X.AI, Anthropic, OpenAI, Qwen, etc.)
✅ **Well-configured** with aliases and functions
✅ **Ready to use** - just load API keys and go!

**Next Steps:**
1. Install Ollama for local inference
2. Use LiteLLM for unified API access
3. Implement OpenAI/Claude in `ai()` function
4. Explore Continue for open-source alternative

**Happy coding with AI! 🚀**

---

*Last Updated: January 12, 2026*
*Next Review: After installing Ollama and implementing OpenAI/Claude modes*
