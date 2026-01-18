# AI Tools Quick Reference

Installed AI CLI tools configured with your `~/.env.d/` API keys.

## 🛠 Installed Tools

### 1. **aider** - AI Pair Programming
Interactive AI coding assistant that edits files directly.

```bash
# Edit a file with AI
aider file.py

# Edit multiple files
aider src/main.py tests/test_main.py

# Chat only (no file editing)
aider --chat-mode

# Use specific model
aider --model gpt-4o
aider --model claude-sonnet-4

# One-shot edit
aider --message "add error handling" file.py
```

**Config:** `~/.aider.conf.yml`

---

### 2. **gptme** - ChatGPT-like CLI
Local ChatGPT-style interface with file access.

```bash
# Start interactive chat
gptme chat

# One-shot query
gptme ask "explain this code" < script.py

# Run Python code
gptme run "import this"

# Use specific provider
gptme chat --provider anthropic
```

**Config:** `~/.config/gptme/config.toml`

---

### 3. **llm** - Universal LLM CLI
Simon Willison's tool for quick LLM queries.

```bash
# Quick query (default: GPT-4o-mini)
llm "explain recursion"

# Use specific model
llm -m claude-sonnet-4 "write a haiku about code"
llm -m gemini-pro "summarize this"

# Pipe input
cat README.md | llm "summarize this"

# Save conversations
llm chat -s coding-session

# List available models
llm models

# Install more plugins
llm install llm-mistral
```

**Plugins installed:**
- `llm-claude-3` (Anthropic)
- `llm-gemini` (Google)

---

### 4. **fabric** - AI Prompts for Common Tasks
Pre-built AI patterns for common workflows.

```bash
# List available patterns
fabric --list

# Summarize text
cat document.txt | fabric --pattern summarize

# Extract wisdom from content
cat article.md | fabric --pattern extract_wisdom

# Create social media posts
cat blog.md | fabric --pattern create_tweets

# Code review
cat script.py | fabric --pattern review_code

# Explain code
cat complex.py | fabric --pattern explain_code
```

**Config:** `~/.config/fabric/.env`
**Patterns:** `~/.config/fabric/patterns/`

**Setup patterns (first time):**
```bash
fabric --setup
```

---

### 5. **ripgrep-all (rga)** - Search PDFs/Docs/Archives
Search inside PDFs, Word docs, archives, etc.

```bash
# Search PDF
rga "search term" document.pdf

# Search all PDFs in directory
rga "API key" ~/Documents/*.pdf

# Search Word docs
rga "budget" reports/*.docx

# Search inside ZIP archives
rga "password" archive.zip

# Combine with fzf for interactive search
rga --files-with-matches "TODO" . | fzf
```

---

## 🔑 API Key Configuration

All tools use API keys from `~/.env.d/llm-apis.env`:
- `OPENAI_API_KEY` → aider, gptme, llm, fabric
- `ANTHROPIC_API_KEY` → aider, gptme, llm
- `GEMINI_API_KEY` → llm

Keys are automatically loaded in your shell.

---

## 💡 Common Workflows

### Code Review
```bash
# Interactive review with aider
aider --message "review this code for bugs and improvements" app.py

# Quick review with fabric
cat app.py | fabric --pattern review_code
```

### Explain Code
```bash
# Quick explanation
llm "explain this code" < script.py

# Detailed with fabric
cat complex_algorithm.py | fabric --pattern explain_code
```

### Refactor
```bash
# Interactive refactoring
aider --message "refactor to use async/await" sync_code.py

# Get suggestions first
llm "suggest refactoring improvements" < legacy.py
```

### Documentation Search
```bash
# Search all docs for a concept
rga "authentication flow" ~/Documents/

# Search Python scripts for specific function
rga "def authenticate" ~/pythons/
```

### Content Generation
```bash
# Generate blog post
llm "write a blog post about Python async programming" > post.md

# Create social media content
cat blog.md | fabric --pattern create_tweets
```

---

## 🎯 Tips & Tricks

1. **Combine tools:**
   ```bash
   rga "TODO" ~/pythons/ | llm "prioritize these tasks"
   ```

2. **Chain workflows:**
   ```bash
   cat draft.md | fabric --pattern improve_writing | llm "make it shorter"
   ```

3. **Use fabric for structured output:**
   ```bash
   cat meeting_notes.txt | fabric --pattern extract_action_items
   ```

4. **Quick code generation:**
   ```bash
   llm "create a python script to parse CSV" > parser.py
   aider --message "add error handling" parser.py
   ```

---

## 📚 Resources

- **aider:** https://aider.chat/docs/
- **gptme:** https://github.com/ErikBjare/gptme
- **llm:** https://llm.datasette.io/
- **fabric:** https://github.com/danielmiessler/fabric
- **ripgrep-all:** https://github.com/phiresky/ripgrep-all

---

## 🔧 Reconfigure Tools

Run this script to reconfigure all tools:
```bash
~/scripts/setup_ai_tools_config.sh
```

---

**Last updated:** 2025-12-04
