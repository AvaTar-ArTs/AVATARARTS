# AI CLI Tools for iTerm2

This setup provides convenient command-line access to various AI models directly from your terminal.

## Available AI Tools

### 1. Claude (Anthropic)
- **Command**: `claude "your question"`
- **Interactive**: `claude-i`
- **From file**: `claude-f filename.txt`
- **Model**: Claude 3.5 Sonnet (default)
- **API Key**: `ANTHROPIC_API_KEY`

### 2. OpenAI GPT
- **Command**: `gpt "your question"`
- **Interactive**: `gpt-i`
- **From file**: `gpt-f filename.txt`
- **Models**: 
  - `gpt4` - GPT-4o (default)
  - `gpt3` - GPT-3.5 Turbo
- **API Key**: `OPENAI_API_KEY`

### 3. xAI/Grok (Placeholder)
- **Command**: `grok "your question"`
- **Interactive**: `grok-i`
- **From file**: `grok-f filename.txt`
- **Status**: API not yet publicly available
- **API Key**: `XAI_API_KEY` (when available)

### 4. Groq (Existing)
- **Command**: `groq "your question"`
- **Interactive**: `groq-i`
- **From file**: `groq-f filename.txt`
- **Models**: `groq-models`

## Setup Instructions

### 1. API Keys
Add your API keys to `~/.env` file:
```bash
# Required for Claude
ANTHROPIC_API_KEY=your_anthropic_key_here

# Required for OpenAI
OPENAI_API_KEY=your_openai_key_here

# For xAI/Grok (when available)
XAI_API_KEY=your_xai_key_here
```

### 2. Reload Shell Configuration
```bash
source ~/.zshrc
```

## Usage Examples

### Basic Usage
```bash
# Ask Claude a question
claude "Explain quantum computing in simple terms"

# Ask GPT a question
gpt "Write a Python function to sort a list"

# Use specific models
gpt4 "Analyze this code for potential issues"
gpt3 "What is the capital of France?"
```

### Interactive Mode
```bash
# Start interactive session with Claude
claude-i

# Start interactive session with GPT
gpt-i
```

### File Input
```bash
# Ask Claude about a file's contents
claude-f mycode.py

# Ask GPT to review a document
gpt-f report.txt
```

### Pipeline Usage
```bash
# Pipe output to AI
cat myfile.txt | claude
ls -la | gpt "Summarize this directory listing"
```

## Features

- **Multiple AI Providers**: Claude, OpenAI, xAI/Grok, Groq
- **Interactive Mode**: Chat-like interface for extended conversations
- **File Input**: Process entire files
- **Pipeline Support**: Use with Unix pipes
- **Error Handling**: Clear error messages and setup instructions
- **Model Selection**: Choose different models for different tasks

## Troubleshooting

### API Key Issues
- Ensure your `.env` file has proper permissions: `chmod 600 ~/.env`
- Check that API keys are correctly set: `echo $ANTHROPIC_API_KEY`
- Restart your terminal after adding new API keys

### Permission Issues
- Make sure scripts are executable: `chmod +x ~/claude-cli.py`
- Check Python path: `which python`

### Model Availability
- Some models may not be available in all regions
- Check provider documentation for current model availability
- xAI/Grok API is not yet publicly available

## Quick Reference

| Command | Description |
|---------|-------------|
| `claude "question"` | Ask Claude |
| `gpt "question"` | Ask GPT-4o |
| `gpt4 "question"` | Ask GPT-4o (explicit) |
| `gpt3 "question"` | Ask GPT-3.5 Turbo |
| `grok "question"` | Ask Grok (when available) |
| `claude-i` | Interactive Claude |
| `gpt-i` | Interactive GPT |
| `grok-i` | Interactive Grok |
| `ai-help` | Show this help |