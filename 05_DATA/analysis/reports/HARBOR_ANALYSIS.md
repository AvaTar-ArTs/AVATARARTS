# .harbor/ Directory Deep Dive Analysis

## 📦 Overview

**Location:** `/Users/steven/Documents/Archives/repos/.harbor/`

**Purpose:** Collection of AI/ML development tools and frameworks, likely for Docker/containerized deployments

---

## 🔍 Tools Breakdown

### 🤖 Agent Frameworks
- **`agent/`** - AI agent framework (13 Python files)
- **`aider/`** - AI pair programming assistant
- **`airllm/`** - AirLLM server
- **`chatnio/`** - Chat interface tool

### 💬 Chat/UI Interfaces
- **`chatui/`** - Chat UI interface
- **`open-webui/`** - Web UI for LLMs (popular, actively maintained)
- **`librechat/`** - Open source ChatGPT alternative
- **`aichat/`** - AI chat interface

### 🧠 LLM Inference & Serving
- **`ollama/`** - Local LLM runner (very popular)
- **`litellm/`** - LLM proxy/load balancer (useful for multiple providers)
- **`llamacpp/`** - C++ LLM inference
- **`vllm/`** - Fast LLM serving engine
- **`ktransformers/`** - Transformers library wrapper

### 🔍 RAG & Search
- **`txtairag/`** - RAG (Retrieval Augmented Generation) implementation
- **`raglite/`** - Lightweight RAG tool
- **`perplexica/`** - AI-powered search engine

### 🛠️ Development Tools
- **`boost/`** - Modular AI system (58 Python files - substantial project)
- **`fabric/`** - Development framework
- **`gptme/`** - GPT-based development tool
- **`plandex/`** - AI coding assistant
- **`openinterpreter/`** - Code interpreter

### 🎨 Specialized Tools
- **`comfyui/`** - Stable Diffusion UI (image generation)
- **`dify/`** - LLM app development platform
- **`langfuse/`** - LLM observability/monitoring
- **`mcp/`** - Model Context Protocol
- **`metamcp/`** - Meta MCP implementation
- **`nexa/`** - Proxy server tool
- **`parler/`** - Specialized tool
- **`parllama/`** - LLaMA variant

### 📊 Other Tools
- **`jupyter/`** - Jupyter notebook setup
- **`searxng/`** - Privacy-focused search engine
- **`n8n/`** - Workflow automation
- **`webtop/`** - Web-based desktop
- **`http-catalog/`** - HTTP API catalog (32 .http files)

---

## 🎯 RECOMMENDATIONS BY USE CASE

### If you're actively developing AI/ML:
**Keep:**
- `ollama/` - Essential for local LLMs
- `open-webui/` - Great UI for LLMs
- `litellm/` - Useful for managing multiple LLM providers
- `boost/` - If you use this modular system
- `langfuse/` - If you monitor LLM usage

**Consider removing:**
- Duplicate chat UIs (keep one: `open-webui`)
- Duplicate RAG tools (keep one: `txtairag` or `raglite`)
- Unused agent frameworks

### If you're just experimenting:
**Keep minimal:**
- `ollama/` - Most useful standalone tool
- `open-webui/` - Best UI option

**Remove:**
- Everything else (can re-clone if needed)

### If you're doing OSINT/research:
**Keep:**
- Tools you actually use
- `maigret/` (in parent repos/ directory)

---

## 📋 ACTION ITEMS

### Quick Cleanup (Low Risk)
1. **Remove duplicate chat UIs:**
   ```bash
   cd /Users/steven/Documents/Archives/repos/.harbor
   # Keep open-webui, remove others
   rm -rf chatui aichat  # if not using
   ```

2. **Remove duplicate RAG tools:**
   ```bash
   # Keep txtairag, remove raglite (or vice versa)
   rm -rf raglite  # if txtairag is better
   ```

### Medium Cleanup (Review First)
1. **Review agent frameworks:**
   - Do you use `agent/`, `aider/`, `airllm/`?
   - Keep only what you use

2. **Review specialized tools:**
   - `comfyui/` - Only if doing image generation
   - `dify/` - Only if building LLM apps
   - `langfuse/` - Only if monitoring LLMs

### Deep Cleanup (High Impact)
1. **Archive unused tools:**
   ```bash
   cd /Users/steven/Documents/Archives/repos
   mkdir -p .harbor-archived
   # Move tools you don't use
   mv .harbor/unused-tool .harbor-archived/
   ```

2. **Remove entire .harbor if not using:**
   ```bash
   # Only if you don't use any of these tools
   rm -rf /Users/steven/Documents/Archives/repos/.harbor
   ```

---

## 💾 SPACE CONSIDERATIONS

**Large directories:**
- `boost/` - 58 Python files (substantial project)
- `http-catalog/` - 32 HTTP files (API definitions)

**Small directories:**
- Most others are configuration/setup files

**Recommendation:** Focus on removing entire unused tools rather than individual files.

---

## 🔄 ALTERNATIVES TO ARCHIVING

Instead of keeping source code archived, consider:

1. **Use Docker images:**
   - Many of these tools have Docker images
   - Pull when needed instead of archiving source

2. **Git clone when needed:**
   - Most are on GitHub
   - Clone fresh when you need them

3. **Use package managers:**
   - Some tools available via pip/npm
   - Install when needed

---

## ✅ DECISION MATRIX

| Tool | Keep If... | Remove If... |
|------|-----------|--------------|
| ollama | Using local LLMs | Using cloud LLMs only |
| open-webui | Need LLM UI | Using other UI |
| litellm | Managing multiple LLM providers | Using single provider |
| boost | Actively developing with it | Never used it |
| agent/aider | Doing AI pair programming | Not doing pair programming |
| comfyui | Generating images | Not doing image gen |
| langfuse | Monitoring LLM usage | Not monitoring |

---

## 🚀 NEXT STEPS

1. **Review this analysis**
2. **Decide which tools you actually use**
3. **Run cleanup script for duplicates first**
4. **Then review .harbor/ tools**
5. **Archive or remove unused tools**
