# Ollama Model Manager (interactive)

For your 2019 Intel MacBook Pro (i9, **16 GB RAM**, CPU-only). This script lets you:

- Install (pull) a minimal, CPU-friendly set of models
- Uninstall any model or alias
- Create/remove friendly aliases
- Run a prompt against a selected model/alias

## Install & run
```bash
chmod +x ollama_menu.sh
./ollama_menu.sh
```

### Notes
- Uses only 7–8B (plus one tiny 3B) models to fit 16 GB.
- Vision models on CLI may require a client that supports image input. For quick tests, use text prompts; for images, use a GUI client or HTTP API.
