# AVATARARTS Tools Directory

**Merged from:** `~/GitHub/AvaTarArTs-Suite/`  
**Date:** 2026-01-11  
**Status:** Consolidated toolkit for AVATARARTS projects

---

## Overview

This directory contains a comprehensive suite of AI-powered creative and development tools, originally consolidated from 12+ repositories. It includes:

- **1,493+ Python scripts**
- **98+ API integrations**
- **Media processing tools** (audio, image, video)
- **Automation platforms**
- **Development utilities**
- **System utilities**

---

## Structure

```
tools/
├── automation/          # API integrations, social media bots, YouTube tools
├── core/               # Shared libraries, AI analysis tools
├── media/              # Media processing
│   ├── audio/          # 70+ audio tools
│   ├── image/          # 300+ image processing scripts
│   ├── video/          # 120+ video tools
│   └── processing/     # Format conversion
├── devtools/           # Development utilities
│   ├── analysis_tools/
│   ├── development_utilities/
│   └── documentation_tools/
├── utilities/          # System utilities (166MB)
│   ├── batch/
│   ├── duplicates/
│   ├── organizers/
│   └── system/
├── content/            # Content creation tools
├── data/               # Data management
├── archived/          # Archived projects
└── docs/               # Documentation (30MB)
```

---

## Quick Start

### Load Environment
```bash
# Load API keys (required for AI features)
source ~/.env.d/loader.sh

# Or load specific categories
source ~/.env.d/loader.sh llm-apis art-vision
```

### Example Usage

**Image Processing:**
```bash
cd tools/media/image
python3 [script_name].py
```

**Audio Processing:**
```bash
cd tools/media/audio
python3 [script_name].py
```

**Automation:**
```bash
cd tools/automation/api_integrations
python3 [integration_name].py
```

---

## Integration with AVATARARTS

These tools are designed to support the 8 major AVATARARTS projects:

1. passive-income-empire
2. retention-suite-complete
3. cleanconnect-complete
4. heavenlyhands-complete
5. avatararts-complete
6. quantumforge-complete
7. education
8. marketplace

---

## Documentation

- Original README: See root `README.md` in this directory
- Guides: `docs/guides/`
- Reports: `docs/reports/`
- Organization: `docs/organization/`

---

## API Integrations

This toolkit integrates with 98+ APIs managed through `~/.env.d/`:

- **LLM APIs:** OpenAI, Anthropic, Groq, XAI (Grok), etc.
- **Image:** Leonardo AI, Stability AI, Replicate, FAL AI
- **Audio:** ElevenLabs, Deepgram, AssemblyAI, Suno
- **Video:** Runway ML, Stable Video Diffusion
- **Automation:** n8n, Make, Zapier
- **Infrastructure:** Supabase, Cloudflare R2, Pinecone, Qdrant

---

## Notes

- All API keys are managed in `~/.env.d/` (never hardcoded)
- Tools follow AVATARARTS coding conventions
- See original `README.md` for detailed usage examples
- This is a consolidated toolkit - individual tools may have their own documentation

---

*Merged: 2026-01-11*  
*Original location: ~/GitHub/AvaTarArTs-Suite/*
