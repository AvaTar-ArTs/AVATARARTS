# 🚀 Grok CLI Setup Package for macOS

A complete, ready-to-use package for installing and configuring the open-source Grok CLI (terminal AI copilot) on macOS systems.

## 📋 What's Included

- **`setup_grok.sh`** - Automated installation script
- **`README.md`** - This comprehensive guide
- **`.grok/user-settings.json`** - Pre-configured settings template
- **`alfred-workflow.json`** - Alfred workflow for quick access
- **`raycast-extension.json`** - Raycast extension configuration

## 🎯 Quick Start

### Option 1: Automated Setup (Recommended)
```bash
# Make the script executable and run it
chmod +x setup_grok.sh
./setup_grok.sh
```

### Option 2: Manual Setup
Follow the detailed steps below if you prefer manual installation.

## 📋 Prerequisites

- **macOS** (Intel x86_64 optimized, but works on Apple Silicon)
- **Node.js 18+** or **Bun 1.0+**
- **XAI API Key** (get one at [xAI Console](https://console.x.ai))

## 🛠 Manual Installation Steps

### Step 1: Install Grok CLI

**Using Bun (Recommended):**
```bash
bun add -g @vibe-kit/grok-cli
```

**Using npm:**
```bash
npm install -g @vibe-kit/grok-cli
```

### Step 2: Configure API Key

**Option A: Using your existing .env.d setup**
```bash
# Your XAI_API_KEY is already configured in ~/.env.d/llm-apis.env
source ~/.env.d/loader.sh llm-apis
export GROK_API_KEY="$XAI_API_KEY"
```

**Option B: Direct export**
```bash
export GROK_API_KEY="your_xai_api_key_here"
```

**Option C: Add to .zshrc**
```bash
echo 'export GROK_API_KEY="$XAI_API_KEY"' >> ~/.zshrc
source ~/.zshrc
```

### Step 3: Create Configuration

```bash
mkdir -p ~/.grok
cp .grok/user-settings.json ~/.grok/user-settings.json
```

### Step 4: Test Installation

```bash
grok --help
grok "Write a hello world program in Python"
```

## 🎮 Usage Examples

### Basic Commands
```bash
# Simple question
grok "What is machine learning?"

# Code generation
grok "Write a Python function to calculate fibonacci numbers"

# Code explanation
grok "Explain this code: def quicksort(arr): ..."

# Debugging help
grok "Help me debug this Python error: IndexError: list index out of range"
```

### Advanced Usage
```bash
# Using aliases (if you ran the setup script)
grok-code "a function to validate email addresses"
grok-debug "this broken code"
grok-explain "how neural networks work"
grok-refactor "this messy function"

# File analysis
grok-file script.py

# Quick questions
grok-quick "What's the weather like?"
```

### Configuration Management
```bash
# View current configuration
grok-config

# Edit configuration
grok-edit

# Run test
grok-test
```

## ⚙️ Configuration

The Grok CLI uses a JSON configuration file at `~/.grok/user-settings.json`:

```json
{
  "apiKey": "your_api_key_here",
  "defaultModel": "grok-2",
  "maxTokens": 4000,
  "temperature": 0.7,
  "stream": true,
  "timeout": 30000,
  "retries": 3,
  "verbose": false,
  "theme": "auto",
  "editor": "auto",
  "autoSave": true,
  "historySize": 100,
  "conversationMode": true,
  "systemPrompt": "You are Grok, an AI assistant. Be helpful, accurate, and concise.",
  "customPrompts": {
    "code": "Write clean, well-documented code with proper error handling.",
    "debug": "Help debug this code by identifying issues and providing solutions.",
    "explain": "Explain this concept in simple terms with examples.",
    "refactor": "Refactor this code to improve readability and performance."
  }
}
```

### Configuration Options

| Option | Description | Default |
|--------|-------------|---------|
| `apiKey` | Your XAI API key | Required |
| `defaultModel` | Model to use (grok-1, grok-2) | "grok-2" |
| `maxTokens` | Maximum response length | 4000 |
| `temperature` | Creativity level (0.0-1.0) | 0.7 |
| `stream` | Stream responses | true |
| `timeout` | Request timeout (ms) | 30000 |
| `retries` | Number of retries | 3 |
| `verbose` | Show detailed output | false |
| `theme` | Color theme (auto, light, dark) | "auto" |
| `editor` | Default editor | "auto" |
| `autoSave` | Auto-save conversations | true |
| `historySize` | Conversation history size | 100 |
| `conversationMode` | Enable conversation mode | true |

## 🔧 Troubleshooting

### Common Issues

**1. "grok: command not found"**
```bash
# Check if installed
which grok

# Reinstall if needed
bun add -g @vibe-kit/grok-cli
# or
npm install -g @vibe-kit/grok-cli
```

**2. "API key not found"**
```bash
# Check if API key is set
echo $GROK_API_KEY

# Set it manually
export GROK_API_KEY="your_key_here"

# Or add to .zshrc
echo 'export GROK_API_KEY="your_key_here"' >> ~/.zshrc
source ~/.zshrc
```

**3. "Permission denied"**
```bash
# Fix script permissions
chmod +x setup_grok.sh

# Fix config file permissions
chmod 600 ~/.grok/user-settings.json
```

**4. "Connection timeout"**
- Check your internet connection
- Verify API key is valid
- Try increasing timeout in config

### Debug Mode

Enable verbose output for debugging:
```bash
grok --verbose "your question"
```

Or edit the config file:
```bash
grok-edit
# Set "verbose": true
```

## 🎨 Desktop Integration

### Alfred Workflow
1. Import `alfred-workflow.json` into Alfred
2. Use keyword "grok" followed by your question
3. Press Enter to get AI response

### Raycast Extension
1. Import `raycast-extension.json` into Raycast
2. Use "Grok" command
3. Type your question and press Enter

### Terminal Launcher
- Use the "Grok Terminal" app in Applications folder
- Opens a terminal pre-configured with Grok CLI

## 📚 Advanced Features

### Custom Prompts
Add your own custom prompts to the configuration:

```json
{
  "customPrompts": {
    "review": "Review this code and suggest improvements:",
    "optimize": "Optimize this code for better performance:",
    "document": "Add comprehensive documentation to this code:",
    "test": "Write unit tests for this function:"
  }
}
```

### Conversation Mode
Enable conversation mode for multi-turn discussions:
```bash
grok --conversation "Let's discuss machine learning"
# Follow-up questions will maintain context
```

### File Processing
Process entire files:
```bash
grok-file script.py
grok-file README.md
```

### Code Generation with Context
```bash
grok "Write a REST API in Python using FastAPI for a todo app with the following features: user authentication, CRUD operations, and data validation"
```

## 🔒 Security Notes

- Keep your API key secure and never commit it to version control
- The configuration file has restricted permissions (600)
- API keys are loaded from your existing secure .env.d setup
- Consider using environment variables for production use

## 📖 Additional Resources

- [Grok CLI GitHub Repository](https://github.com/superagent-ai/grok-cli)
- [xAI API Documentation](https://docs.x.ai)
- [xAI Console](https://console.x.ai)

## 🤝 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Verify your API key is valid
3. Ensure you have the latest version installed
4. Check the GitHub repository for known issues

## 📝 License

This setup package is provided as-is. The Grok CLI itself follows its own license terms.

---

**Happy coding with Grok CLI! 🚀**