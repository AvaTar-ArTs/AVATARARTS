# API & Python Ecosystem Inventory

**Generated:** 2025-11-06
**Scanned:** Home directory (~/)
**Total Python Scripts:** 1,020

---

## 🔑 API KEYS CONFIGURATION

### Location: `~/.env.d/`

**Summary:**
- **Total API Keys:** 50+ active
- **Categories:** 17 organized .env files
- **Security:** ✅ All files have 600 permissions
- **Loading Pattern:** 222 Python scripts use `.env.d` loader

### API Categories

#### 🤖 LLM/AI APIs (`llm-apis.env`)

| Provider | Key Variable | Status |
|----------|-------------|---------|
| OpenAI | `OPENAI_API_KEY` | ✅ Active (gpt-5 model configured) |
| Anthropic | `ANTHROPIC_API_KEY` | ✅ Active (Claude) |
| Google Gemini | `GEMINI_API_KEY` | ✅ Active |
| Groq | `GROQ_API_KEY` | ✅ Active (fast inference) |
| DeepSeek | `DEEPSEEK_API_KEY` | ✅ Active |
| Mistral | `MISTRAL_API_KEY` | ✅ Active |
| Perplexity | `PERPLEXITY_API_KEY` | ✅ Active |
| Cohere | `COHERE_API_KEY` | ✅ Active |
| OpenRouter | `OPENROUTER_API_KEY` | ✅ Active (multi-model router) |
| Together AI | `TOGETHER_API_KEY` | ✅ Active |
| Cerebras | `CEREBRAS_API_KEY` | ✅ Active (ultra-fast) |

**Total:** 11 LLM providers configured

#### 🎵 Audio/Music APIs (`audio-music.env`)

| Provider | Key Variable | Purpose |
|----------|-------------|---------|
| ElevenLabs | `ELEVENLABS_API_KEY` | Voice synthesis/TTS |
| AssemblyAI | `ASSEMBLYAI_API_KEY` | Speech-to-text transcription |
| Deepgram | `DEEPGRAM_API_KEY` | Speech-to-text |
| Rev.ai | `REVAI_API_KEY` | Transcription |
| Suno | `SUNO_COOKIE` | Music generation (cookie-based auth) |
| Murf | `MURF_API_KEY` | Text-to-speech |
| Resemble | `RESEMBLE_API_KEY` | Voice cloning |
| Udio | `UDIO_API_KEY` | Music generation (Suno alternative) |

**Total:** 8 audio/music providers

#### 🎨 Art/Vision APIs (`art-vision.env`)

| Provider | Key Variable | Purpose |
|----------|-------------|---------|
| Leonardo AI | `LEONARDO_API_KEY` | AI art generation |
| Replicate | `REPLICATE_API_KEY` | Multi-model platform |
| Stability AI | `STABILITY_API_KEY` | Stable Diffusion |
| Runway | `RUNWAY_API_KEY` | Video generation |
| FAL | `FAL_API_KEY` | Fast AI Lab |
| Remove.bg | `REMOVEBG_API_KEY` | Background removal |
| Imagga | `IMAGGA_API_KEY` | Image recognition |
| VanceAI | `VANCEAI_API_KEY` | AI enhancement |

**Total:** 8 image/video providers

#### ☁️ Cloud & Storage

- Cloudflare R2
- Azure OpenAI
- Google Cloud (SDK installed)
- AWS (credentials in ~/.boto)

#### 🔄 Automation

- E2B - Code execution
- n8n - Workflow automation
- Make - Automation platform
- Zapier - Integration platform

#### 🧠 Vector Databases (`vector-memory.env`)

- ChromaDB
- Pinecone
- Qdrant
- LangSmith (monitoring)
- Mem0 (memory layer)
- LlamaIndex (data framework)

#### 📊 Other Categories

- SEO & Analytics
- Monitoring (BetterUptime)
- Notifications
- Documents/PDF processing
- Web scraping (ScrapingBee, ScrapingBot)

---

## 🐍 PYTHON SCRIPTS ECOSYSTEM

### Distribution by Location

```
~/Documents/pythons/              # Main scripts directory
├── transcribe/                   # 15+ audio transcription scripts
├── youtube/                      # 10+ YouTube automation scripts
├── _library/                     # Shared utilities
├── _backups/                     # ENV fixes backup (20251105)
└── [root]                        # 180+ active scripts
```

### Key Script Categories

#### 1. **Audio/Music Processing (30+ scripts)**

**Transcription:**
- `transcribe/whisper-transcript.py` - Whisper-based transcription
- `transcribe/openai-transcribe-audio.py` - OpenAI Whisper API
- `transcribe/deepgram-test.py` - Deepgram transcription
- `transcribe/verbose-transcriber.py` - Detailed transcription
- `transcribe/audio-analyzer.py` - Audio content analysis

**Music Analysis:**
- `openai-song-lyrics-analyzer.py` - Analyze song lyrics (OpenAI GPT)
- `song-process.py` - Process song metadata
- `mp3-batch-timestamp.py` - Batch timestamp MP3s

**TTS/Voice:**
- `thinketh-tts-main.py` - Main TTS pipeline
- `thinketh-tts-universal.py` - Universal TTS
- `thinketh-tts-transcription.py` - TTS with transcription
- `generate-emotional-audio.py` - Emotional voice generation

#### 2. **Image/Art Generation (40+ scripts)**

**Leonardo AI:**
- `leonardo-autonomous-content-agency.py` - Autonomous content creation
- `leonardo-brand-builder.py` - Brand asset generation
- `leonardo-newsletter-empire.py` - Newsletter graphics
- `leonardo-cyberpunk-hacker-generator.py` - Themed generation
- `leonardo-upscaled.py` - Image upscaling
- `leonardo-convert-loop.py` - Batch conversion

**OpenAI Vision:**
- `openai-vision-image-reader.py` - Image analysis with GPT-4V
- `openai-gpt4o-image-metadata.py` - Extract image metadata
- `openai-image-enrichment.py` - Enhance image descriptions
- `openai-batch-image-seo-pipeline.py` - SEO metadata generation

**DALL-E:**
- `dalle-prompt.py` - DALL-E image generation
- `createimages.py` - Batch image creation

**Utilities:**
- `batch-image.py` - Batch image processing
- `resize.py` - Image resizing
- `goapi-midjourney-imagine.py` - Midjourney via GOAPI

#### 3. **Content Creation & Analysis (50+ scripts)**

**Research & Analysis:**
- `research-assistant.py` - AI research assistant
- `DEEP-CONTENT-ANALYSIS.py` - Deep content analysis
- `ai-deep-analyzer.py` - Advanced AI analysis
- `analyze-files-comprehensive.py` - Comprehensive file analysis

**Business Intelligence:**
- `business-intelligence.py` - BI automation
- `revenue-engine.py` - Revenue analysis
- `market-research-platform.py` - Market research
- `domination-engine.py` - Competitive analysis

**Document Processing:**
- `ai-docs-generator.py` - AI documentation generator
- `intelligent-docs-builder.py` - Smart docs builder
- `docs-reorganizer.py` - Document reorganization

#### 4. **YouTube Automation (10+ scripts)**

- `youtube/youtube-upload-file.py` - Video upload
- `youtube/youtube-upload-video.py` - Video upload (alt)
- `youtube/youtube-content-maker.py` - Content generation
- `youtube/youtube-generate-content.py` - Generate video content
- `youtube/youtube-load.py` - Load YouTube data
- `youtube/ygpt-utils-textgenerator.py` - GPT text generation

#### 5. **File Organization (30+ scripts)**

**Smart Renamers:**
- `intelligent-renamer-1.py` - AI-powered renaming
- `smart-content-renamer-v3.py` - Content-aware renaming
- `rename-by-purpose.py` - Purpose-based renaming
- `python-namer.py` - Python script naming
- `simple-smart-renamer.py` - Simple AI renamer

**Organizers:**
- `organize-files-intelligent.py` - Intelligent file organization
- `organize-directory.py` - Directory organization
- `album-sorting.py` - Music album sorting
- `simple-flat-organizer.py` - Flat directory organizer

**Categorizers:**
- `enhanced-categorization.py` - Enhanced categorization
- `categorizer.py` - File categorization
- `classify.py` - Content classification

#### 6. **Automation & Orchestration (20+ scripts)**

**Claude/Anthropic:**
- `claude-code-review-system.py` - Code review automation
- `claude-chief.py` - Chief orchestrator
- `claude-deep.py` - Deep analysis
- `chatgpt.py` - ChatGPT interaction

**Multi-Agent:**
- `intelligent-code-orchestrator.py` - Code orchestration
- `advanced-content-pipeline.py` - Content pipeline
- `groq-cli.py` - Groq CLI interface

**Cloud Services:**
- `cloud-services-aws-streamlit.py` - AWS + Streamlit
- `aws-sqs-image-queue.py` - AWS SQS queue management

---

## 🔄 STANDARD LOADING PATTERN

### Common API Key Loading (222 scripts use this)

```python
# Standard pattern found in most scripts:
from pathlib import Path as PathLib
from dotenv import load_dotenv

env_dir = PathLib.home() / ".env.d"
if env_dir.exists():
    for env_file in env_dir.glob("*.env"):
        load_dotenv(env_file)
```

**Files using this pattern:** 222+
**Advantage:** Loads all .env.d files automatically, no manual import needed

---

## 📊 STATISTICS

### Python Scripts
- **Total Scripts:** 1,020
- **Active Development:** ~180 in main directory
- **Backup/Archive:** ~840 in _backups/
- **API Integration:** 211 scripts use OpenAI/Anthropic/Groq/DeepSeek
- **Using .env.d:** 222 scripts (27% adoption of standard)

### API Usage by Script Type
- **Transcription/Audio:** 30+ scripts
- **Image Generation:** 40+ scripts
- **Content Analysis:** 50+ scripts
- **File Organization:** 30+ scripts
- **YouTube:** 10+ scripts
- **Business/Analytics:** 20+ scripts

### API Key Coverage
- **LLM Providers:** 11
- **Audio/Music:** 8
- **Image/Vision:** 8
- **Cloud/Storage:** 4+
- **Automation:** 4+
- **Vector DBs:** 6
- **Other Services:** 15+

**Total Unique API Integrations:** 50+

---

## 🎯 KEY INTEGRATIONS

### Most Used APIs (by script count)

1. **OpenAI** - ~150+ scripts
   - GPT models for text generation
   - GPT-4V for vision
   - DALL-E for images
   - Whisper for transcription

2. **Leonardo AI** - ~20+ scripts
   - Image generation
   - Upscaling
   - Style transfer

3. **ElevenLabs** - ~15+ scripts
   - Voice synthesis
   - TTS pipelines

4. **AssemblyAI/Deepgram** - ~10+ scripts
   - Audio transcription
   - Speech-to-text

5. **Anthropic (Claude)** - ~10+ scripts
   - Code review
   - Deep analysis
   - Content generation

---

## 🔐 SECURITY STATUS

✅ **Good Practices:**
- All .env files have 600 permissions (owner-only)
- API keys in dedicated ~/.env.d/ directory (not in repo)
- Standardized loading pattern across scripts
- Backup system in place (dated backups)

⚠️ **Concerns Found (from audit):**
- GOAPI and old STABILITY keys exposed in git history → **REVOKE**
- Some scripts have hardcoded key references (rare)
- HuggingFace API commented out due to auth issues

---

## 📁 KEY DIRECTORIES

```
~/.env.d/                        # API keys (17 category files)
~/Documents/pythons/             # Main Python scripts (1000+)
~/advanced_toolkit/              # Advanced file intelligence (60+ scripts)
~/workspace/music-empire/        # Music business tools
~/workspace/csvs-consolidated/   # Data consolidation (4M lines)
~/Music/nocTurneMeLoDieS/        # Music library with metadata
```

---

## 🚀 COMMON WORKFLOWS

### 1. Music Processing Pipeline
```bash
# Transcribe audio
python3 ~/Documents/pythons/transcribe/openai-transcribe-audio.py input.mp3

# Analyze lyrics
python3 ~/Documents/pythons/openai-song-lyrics-analyzer.py transcript.txt analysis.txt

# Organize by album
python3 ~/Music/nocTurneMeLoDieS/SCRIPTS/organize_into_albums.py
```

### 2. Content Creation Pipeline
```bash
# Generate image
python3 ~/Documents/pythons/leonardo-autonomous-content-agency.py

# Analyze image
python3 ~/Documents/pythons/openai-vision-image-reader.py image.png

# Generate metadata
python3 ~/Documents/pythons/openai-batch-image-seo-pipeline.py
```

### 3. File Organization
```bash
# Intelligent rename
python3 ~/Documents/pythons/smart-content-renamer-v3.py

# Organize by category
python3 ~/Documents/pythons/organize-files-intelligent.py

# Deep analysis
python3 ~/Documents/pythons/ai-deep-analyzer.py
```

---

## 📝 NOTES

- Most scripts support both dry-run and execution modes
- Standard error handling with try/except patterns
- Logging to files for audit trails
- Batch processing capabilities in most tools
- Interactive prompts before destructive operations

---

**Last Updated:** 2025-11-06
**Inventory Source:** Home directory scan + .env.d audit
**Scripts Cataloged:** 1,020
**API Keys Found:** 50+
