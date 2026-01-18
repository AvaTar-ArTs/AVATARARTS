# Ollama — Main Models Only (Intel macOS • 16 GB)

This tiny kit installs only the models you use most: **chat/prompts, coding+debug, image analysis, and embeddings**.
It’s tuned for your 16‑GB Intel Mac (CPU‑only).

## Models included
- **Chat**: `llama3.1:8b` (fast), `qwen3:14b` (optional heavier)
- **Reasoning**: `deepseek-r1:8b`
- **Coding**: `qwen2.5-coder:7b` (optionally add `qwen2.5-coder:14b` later)
- **Vision**: `llava:13b` (image/doc reasoning)
- **Embeddings (RAG)**: `mxbai-embed-large`, `nomic-embed-text`

## Disk footprint (approx, Q4)
~25–30 GB if you pull them all (skip the 14B variants to save ~7–8 GB each).

## Quick start
```bash
# 1) Ensure Ollama is running (brew services start ollama)
# 2) Run the installer (adds emoji UI and skips already-installed models)
chmod +x ollama_main_only.sh
./ollama_main_only.sh
```

### What the script does
- Shows a small menu:
  - Install ALL main models
  - Install only chat / only coding / only vision / only embeddings
  - (Optional) Pull heavier 14B chat/coder models
  - Run a quick prompt for chat/coding/vision with sane NUM_CTX
  - Show model disk usage
- Pulls are **idempotent** (skip if installed)
- Logs to `~/Library/Logs/ollama-main.log`
