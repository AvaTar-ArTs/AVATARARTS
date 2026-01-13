# Ollama — CPU‑Only Setup (Intel Mac, 16GB RAM)

This pack installs a lean set of **7–8B** models (plus one tiny 3B) that actually run on your 2019 Intel MacBook Pro (i9, 16GB).

## What’s inside
- `ollama_setup_light.sh` — pulls only usable sizes and creates friendly aliases.
- Aliases:
  - `general` → llama3.1:8b
  - `reason` → deepseek-r1:7b
  - `code` → qwen2.5-coder:7b
  - `code-tiny` → starcoder2:3b
  - `vis` → llava:7b
  - `vis-light` → gemma3:4b
  - `embed` → nomic-embed-text
  - `guard` → llama-guard3:8b (optional)

## Quick start
```bash
chmod +x ollama_setup_light.sh
./ollama_setup_light.sh
```
Then try:
```bash
ollama run general "Summarize TechnoMancer in 3 bullets."
ollama run reason  "Solve: a train leaves at 2pm... show steps."
ollama run code    "Write a Python slugify() function."
ollama run vis     # then attach an image when the model asks
```
