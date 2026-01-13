# 🤖 AI CLI Quick Reference

## Unified AI Toolkit (`ai` command)

### Basic Usage
```bash
# Quick chat with default service (OpenAI)
ai "Your question here"

# Interactive mode
ai-i

# Read from file
ai -f question.txt

# List all available models
ai-models
```

### Service-Specific Commands
```bash
# OpenAI
openai "Your question"
openai-i                    # Interactive mode
gpt4 "Your question"        # Use GPT-4
gpt4o "Your question"       # Use GPT-4o

# Groq (Fast & Free)
groq "Your question"
groq-i                      # Interactive mode
llama3 "Your question"      # Use Llama 3
mixtral "Your question"     # Use Mixtral

# Claude
claude "Your question"
claude-i                    # Interactive mode

# xAI (Grok)
xai "Your question"         # Use Grok-2 (default)
xai-i                       # Interactive mode
grok2 "Your question"       # Use Grok-2
grok1 "Your question"       # Use Grok-1
grok "Your question"        # Direct xAI CLI
grok-i                      # Interactive xAI CLI
grok-s                      # Streaming xAI CLI
```

### Advanced Usage
```bash
# Specify model explicitly
ai -s openai -m gpt-4 "Your question"
ai -s groq -m llama3-70b-8192 "Your question"
ai -s claude -m claude-3-opus-20240229 "Your question"
ai -s xai -m grok-beta "Your question"

# Interactive with specific service
ai -s groq -i
ai -s xai -i
```

## Available Models

### OpenAI
- `gpt-4` - Most capable
- `gpt-4-turbo` - Faster GPT-4
- `gpt-4o` - Latest optimized
- `gpt-4o-mini` - Faster, cheaper
- `gpt-3.5-turbo` - Fast and cheap

### Groq (Very Fast)
- `llama3-8b-8192` - Fast, good quality
- `llama3-70b-8192` - Higher quality
- `mixtral-8x7b-32768` - Excellent reasoning
- `gemma2-9b-it` - Google's model
- `llama-3.1-8b-instant` - Fastest
- `llama-3.1-70b-versatile` - Best quality

### Claude
- `claude-3-5-sonnet-20240620` - Best overall
- `claude-3-opus-20240229` - Most capable
- `claude-3-sonnet-20240229` - Balanced
- `claude-3-haiku-20240307` - Fastest

### xAI (Grok)
- `grok-beta` - Grok-2 (latest, recommended)
- `grok-2-1212` - Grok-2 specific version
- `grok-2-1212-preview` - Grok-2 preview
- `grok-1.5` - Grok-1.5
- `grok-1` - Original Grok-1

## Tips

1. **For speed**: Use Groq with `llama3-8b-8192`
2. **For quality**: Use Claude with `claude-3-5-sonnet-20240620`
3. **For coding**: Use OpenAI with `gpt-4` or Groq with `mixtral-8x7b-32768`
4. **For humor/creativity**: Use xAI with `grok-beta` (Grok-2)
5. **For free usage**: Groq has generous free tier
6. **Interactive mode**: Great for back-and-forth conversations

## Environment Setup

Your API keys are loaded from `~/.env`:
- `OPENAI_API_KEY` - For OpenAI models
- `ANTHROPIC_API_KEY` - For Claude models  
- `GROQ_API_KEY` - For Groq models
- `XAI_API_KEY` - For xAI (Grok) models

## Examples

```bash
# Quick coding help
ai "How do I implement a binary search in Python?"

# Interactive coding session
groq-i

# Use specific model for complex reasoning
claude "Explain quantum computing in simple terms"

# Fast response for simple questions
llama3 "What's the capital of France?"

# Creative/humorous responses
grok2 "Write a funny story about a robot learning to cook"

# Streaming response
grok-s "Tell me about the future of AI"
```