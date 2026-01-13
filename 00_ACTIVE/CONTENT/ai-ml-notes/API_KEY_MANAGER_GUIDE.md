# API Key Manager - Usage Guide

## Overview
The API Key Manager is an interactive script that helps you manage all your API keys across your `.env.d` environment files. It can scan, validate, and guide you through setting up missing API keys.

## Quick Start

### 1. Scan Current Status
```bash
# Quick scan (no interaction)
api-scan

# Or use the full command
python3 /Users/steven/Documents/script/api_key_manager.py --no-interactive --no-fix
```

### 2. Interactive Setup
```bash
# Full interactive setup
apisetup

# Or
api-setup
```

### 3. Available Commands
- `apisetup` - Interactive setup for missing API keys
- `api-setup` - Same as above (alternative alias)
- `api-scan` - Quick scan without interaction

## What It Does

### 1. **Scans All Environment Files**
- Reads all `.env` files in `~/.env.d/`
- Identifies API key variables (ending in `_API_KEY`, `_TOKEN`, `_SID`, `_SECRET`)
- Categorizes them by service and file location

### 2. **Validates API Keys**
- Checks if keys are missing (empty or placeholder values)
- Validates key formats using known patterns
- Identifies invalid or malformed keys

### 3. **Interactive Setup**
- Opens browser links to API key creation pages
- Guides you through entering each missing key
- Validates input before saving
- Updates the appropriate `.env` file

### 4. **Generates Reports**
- Creates detailed markdown reports
- Shows status of all API keys
- Provides direct links to service websites

## Current Status (Based on Latest Scan)

### ✅ Working API Keys (8)
- **OpenAI** - GPT models and embeddings
- **Groq** - Fast LLM inference  
- **Grok (xAI)** - xAI Grok models
- **xAI** - xAI models and tools
- **DeepSeek** - DeepSeek AI models
- **Google Client Secret** - Google services
- **AssemblyAI** - Speech-to-text
- **Deepgram** - Speech-to-text and audio intelligence

### ⚠️ Missing API Keys (30)
The script found 30 missing API keys across different categories:

#### **Art & Vision** (5 missing)
- Stability AI, Replicate, Runway ML, Kaiber, Pika Labs

#### **Audio & Music** (4 missing)  
- Suno AI, ElevenLabs, InVideo, Sora AI

#### **Automation & Agents** (6 missing)
- Cohere, Fireworks AI, Pinecone, Qdrant, OpenRouter, LangSmith

#### **Notifications** (4 missing)
- Twilio Account SID, Twilio Auth Token, Zapier, Make

#### **Other Tools** (6 missing)
- Moonvalley, ArcGIS, Supernormal, Descript, Sonix, Rev.ai, Speechmatics

#### **Vector Memory** (2 missing)
- ChromaDB, Zep

#### **Documents** (2 missing)
- Notion, Slite

## Usage Examples

### Scan Only
```bash
api-scan
```

### Interactive Setup (Recommended)
```bash
apisetup
```

### Generate Report Only
```bash
python3 /Users/steven/Documents/script/api_key_manager.py --no-interactive --no-fix --no-report
```

### Fix Invalid Keys Only
```bash
python3 /Users/steven/Documents/script/api_key_manager.py --no-interactive
```

## Features

### 🔍 **Smart Detection**
- Automatically detects API key variables
- Recognizes placeholder values (`your_key_here`, empty strings)
- Validates key formats using service-specific patterns

### 🌐 **Browser Integration**
- Opens creation pages automatically
- Provides direct links to API key management
- Supports all major AI and development services

### 🔒 **Security**
- Sets proper file permissions (600) on `.env` files
- Validates keys before saving
- Preserves existing comments and formatting

### 📊 **Comprehensive Reporting**
- Color-coded terminal output
- Detailed markdown reports
- Categorized by service type and importance

### 🎯 **Service Coverage**
Supports 50+ API services including:
- **LLMs**: OpenAI, Anthropic, Groq, xAI, DeepSeek, Perplexity, Gemini
- **Art/Vision**: Stability AI, Replicate, Runway, Leonardo, Ideogram
- **Audio**: ElevenLabs, AssemblyAI, Deepgram, Suno AI
- **Automation**: Cohere, Pinecone, Supabase, Zapier, Make
- **Cloud**: AWS, Azure, Google Cloud
- **And many more...**

## File Structure
```
~/.env.d/
├── llm-apis.env          # Language models
├── art-vision.env        # Image generation
├── audio-music.env       # Audio processing
├── automation-agents.env # AI agents & automation
├── cloud-infrastructure.env # Cloud services
├── notifications.env     # Messaging & alerts
├── other-tools.env       # Miscellaneous tools
├── vector-memory.env     # Vector databases
└── documents.env         # Document processing
```

## Tips

1. **Start with Required Keys**: The script marks essential APIs as "REQUIRED"
2. **Use Interactive Mode**: Let the script guide you through each service
3. **Check Reports**: Generated reports are saved to `~/api_keys_report.md`
4. **Validate Keys**: The script validates formats before saving
5. **Secure Storage**: All keys are stored with proper permissions

## Troubleshooting

### Script Won't Run
```bash
# Make sure it's executable
chmod +x /Users/steven/Documents/script/api_key_manager.py

# Check Python version
python3 --version
```

### Browser Won't Open
- The script will show the URL to visit manually
- Copy and paste the URL into your browser

### Permission Errors
```bash
# Fix permissions on .env files
chmod 600 ~/.env.d/*.env
```

### Invalid Key Format
- Check the service's documentation for the correct format
- The script shows expected patterns for known services

## Next Steps

1. Run `apisetup` to start the interactive setup
2. Focus on required APIs first (marked in the output)
3. Set up APIs for services you actually use
4. Check the generated report for a complete overview
5. Re-run the script periodically to check for new missing keys

---

**Happy API key managing! 🚀**