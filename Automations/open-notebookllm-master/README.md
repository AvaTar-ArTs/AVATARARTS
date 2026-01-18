# Open NotebookLLM

Open source implementation of NotebookLM. Supports multiple AI providers, RAG-based retrieval, podcast generation, speech-to-text, and more.

![Python](https://img.shields.io/badge/python-3.10+-blue.svg)
![Node.js](https://img.shields.io/badge/node.js-18+-green.svg)

## Features

- **Multiple AI Providers:** Gemini, OpenAI, Anthropic, Ollama, Groq, DeepSeek
- **RAG Smart Q&A:** Chat with AI based on your uploaded documents
- **Multi-format Source Support:** PDF, Word, Excel, Web, YouTube, Audio
- **Podcast Generation:** Multi-speaker podcasts with TTS synthesis
- **Studio Tools:** Summaries, mind maps, flashcards, quizzes, slides, infographics
- **AI Image Generation:** AI-powered images for slides and infographics
- **Advanced Hybrid Search:** RRF fusion algorithm + Query Expansion + LLM Reranking
- **Adaptive Learning Content:** Bloom’s taxonomy + Difficulty Levels + Multiple Question Types
- **Chart.js Data Visualization:** Auto-selects suitable chart type

---

## 📚 Tutorial Slides

Comprehensive 7-part tutorial covering concept introduction, technical architecture, setup, feature usage and deployment.

👉 **[View Tutorial Slides](https://chatgpt3a01.github.io/open-notebookllm/%E7%B0%A1%E5%A0%B1/index.html)**

| Part   | Topic                          | Content                                                  |
| ------ | ------------------------------ | -------------------------------------------------------- |
| Part 1 | Overview & Core Features       | What is NotebookLLM, main features, tech stack           |
| Part 2 | Architecture & AI Providers    | System architecture, provider abstraction, RAG principle |
| Part 3 | Environment Setup              | Requirements, installation, API Key config               |
| Part 4 | Source Management & RAG Search | Source types, RAG workflow, search modes                 |
| Part 5 | Studio Feature Deep-Dive       | Flashcards, quizzes, charts, flowcharts, slides          |
| Part 6 | Podcast & Speech Synthesis     | Script generation, TTS engines, Edge TTS                 |
| Part 7 | Deployment & Hands-on          | Local, Docker, cloud deployment, real-world use          |

> 💡 **Tip:** Use keyboard arrow keys to navigate the slides, or switch to full screen.

---

## Requirements

| Item    | Version                     |
| ------- | --------------------------- |
| Python  | 3.10+                       |
| Node.js | 18+                         |
| npm     | 9+                          |
| FFmpeg  | Optional, for audio support |

---

## Quick Start

### Step 1: Clone the Project

```bash
git clone https://github.com/ChatGPT3a01/open-notebookllm.git
cd open-notebookllm
```

### Step 2: Set Environment Variables

```bash
# Windows
copy .env.example backend\.env

# macOS/Linux
cp .env.example backend/.env
```

Edit `backend/.env` and fill in your API Keys:

```env
# Choose AI Provider (gemini / openai / anthropic / ollama / groq / deepseek)
AI_PROVIDER=gemini

# ===== Gemini =====
GEMINI_API_KEY=your-Gemini-API-Key
GEMINI_MODEL=gemini-2.0-flash

# ===== OpenAI =====
OPENAI_API_KEY=your-OpenAI-API-Key
OPENAI_MODEL=gpt-4o

# ===== Anthropic =====
ANTHROPIC_API_KEY=your-Anthropic-API-Key
ANTHROPIC_MODEL=claude-sonnet-4-20250514

# ===== Ollama (local model, no API Key needed) =====
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2

# ===== Groq =====
GROQ_API_KEY=your-Groq-API-Key
GROQ_MODEL=llama-3.3-70b-versatile

# ===== DeepSeek =====
DEEPSEEK_API_KEY=your-DeepSeek-API-Key
DEEPSEEK_MODEL=deepseek-chat
```

**Obtain API Keys:**
| Provider | Link |
|----------|------|
| Gemini | https://aistudio.google.com/app/apikey |
| OpenAI | https://platform.openai.com/api-keys |
| Anthropic | https://console.anthropic.com/settings/keys |
| Ollama | https://ollama.ai/download (local install, no API Key) |
| Groq | https://console.groq.com/keys |
| DeepSeek | https://platform.deepseek.com/api_keys |

### Step 3: Backend Dependency Installation

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### Step 4: Frontend Dependency Installation

Open a **new terminal window**:

```bash
cd frontend
npm install
```

### Step 5: Start Application

**Start Backend** (from backend folder, virtual env activated):

```bash
python app.py
```

Backend runs at http://localhost:5000

**Start Frontend** (another terminal, frontend folder):

```bash
npm run dev
```

Frontend runs at http://localhost:3000

### Step 6: Start Using

1. Open your browser and visit `http://localhost:3000`
2. Create a new notebook
3. Add sources (upload documents, paste URLs, YouTube links, etc.)
4. Chat with AI (answers are based on your sources)
5. Use Studio features to generate summaries, mind maps, podcasts, and more

---

## AI Provider Comparison

| Provider      | Highlights                        | Embeddings | Image Gen | Requires API Key |
| ------------- | --------------------------------- | :--------: | :-------: | :--------------: |
| **Gemini**    | Google multimodal model           |     ✅     |    ✅     |       Yes        |
| **OpenAI**    | GPT-4o/4.1 + DALL-E 3             |     ✅     |    ✅     |       Yes        |
| **Anthropic** | Claude Sonnet/Opus (long context) |    ❌\*    |    ❌     |       Yes        |
| **Ollama**    | Local, unlimited use              |     ✅     |    ❌     |        No        |
| **Groq**      | Ultra-fast inference              |    ❌\*    |    ❌     |       Yes        |
| **DeepSeek**  | R1 inference model                |    ❌\*    |    ❌     |       Yes        |

> \*Providers that do not support embeddings will automatically fallback to another embedding provider.

---

## Supported Source Types

| Type    | Description            | File Types                                       |
| ------- | ---------------------- | ------------------------------------------------ |
| PDF     | PDF documents          | `.pdf`                                           |
| Text    | Plain text files       | `.txt`, `.md`                                    |
| Word    | Microsoft Word         | `.docx`, `.doc`                                  |
| Excel   | Spreadsheets           | `.xlsx`, `.xls`, `.csv`                          |
| Web     | Web links              | URL                                              |
| YouTube | YouTube video captions | YouTube URL                                      |
| Audio   | Speech-to-text (STT)   | `.mp3`, `.wav`, `.m4a`, `.ogg`, `.flac`, `.webm` |

---

## Studio Output Types

| Type         | Description             | Features                               |
| ------------ | ----------------------- | -------------------------------------- |
| Summary      | Content summary         | -                                      |
| Mind Map     | Mermaid visualization   | Export SVG, zoom control               |
| Flowchart    | Draw.io flowchart       | 🆕 AI generation, editable, SVG export |
| Architecture | Draw.io diagrams        | 🆕 6 chart types, system visualization |
| Report       | Structured documents    | -                                      |
| Flashcard    | Q&A flashcards          | 🆕 Bloom taxonomy, difficulty, hint    |
| Quiz         | Multiple question types | 🆕 MCQ/TF/Fill-in/Match/Short Ans.     |
| Infographic  | Chart.js visualizations | 🆕 7 chart types, insights             |
| Slides       | Slides + images         | ✅ AI images, PPTX export              |
| **Podcast**  | Multi-speaker podcast   | 1-4 speakers, various styles, TTS      |

### 🆕 Flashcards/Quiz Difficulty Levels

| Level  | Bloom’s Tier         | Description                        |
| ------ | -------------------- | ---------------------------------- |
| Easy   | Remember, Understand | Basic definitions, recall          |
| Medium | Apply, Analyze       | Application, compare/analyze       |
| Hard   | Evaluate, Create     | Critical thinking, problem-solving |
| Mixed  | All tiers            | All difficulties, progressive      |

### 🆕 Infographic Supported Chart Types

| Type      | Use Case             |
| --------- | -------------------- |
| Bar       | Category comparison  |
| Line      | Trend analysis       |
| Pie       | Proportion           |
| Doughnut  | Proportion (variant) |
| Radar     | Multi-dim comparison |
| Scatter   | Correlation analysis |
| PolarArea | Category (variant)   |

### 🆕 Draw.io Architecture Chart Types

| Type         | Description                             |
| ------------ | --------------------------------------- |
| architecture | System/component relationships/topology |
| sequence     | Interaction sequence/flow               |
| class        | OOP class/inheritance                   |
| er           | ERD - DB relationships/entities         |
| network      | Network topology/device connections     |
| auto         | Auto-select type based on content (AI)  |

---

## Optional: Install FFmpeg (for audio processing)

### Windows

1. Download [FFmpeg](https://github.com/BtbN/FFmpeg-Builds/releases) (choose `ffmpeg-master-latest-win64-gpl.zip`)
2. Extract to `C:\ffmpeg`
3. Add `C:\ffmpeg\bin` to your system PATH
4. Verify: `ffmpeg -version`

### macOS

```bash
brew install ffmpeg
```

### Linux

```bash
sudo apt install ffmpeg
```

---

## Project Structure

```
open-notebookllm/
├── backend/                    # Flask backend (Python)
│   ├── app.py                 # Main application entry
│   ├── config.py              # Config management
│   ├── requirements.txt       # Python dependencies
│   ├── models/                # Database models
│   ├── services/              # Business/service logic
│   │   ├── ai_providers/      # AI provider abstraction
│   │   ├── rag_service.py     # RAG retrieval services
│   │   ├── podcast_service.py # Podcast generation
│   │   └── studio_service.py  # Studio output generation
│   └── controllers/           # API controllers
│
├── frontend/                   # React frontend (TypeScript)
│   ├── src/
│   │   ├── pages/             # Page components
│   │   ├── components/        # UI components
│   │   ├── store/             # Zustand state management
│   │   └── api/               # API client
│   ├── package.json
│   └── vite.config.ts
│
├── uploads/                    # Upload file storage
└── .env.example                # Environment variable template
```

---

## Tech Stack

| Layer           | Technology                                             |
| --------------- | ------------------------------------------------------ |
| Backend         | Flask 3.0                                              |
| Database        | SQLite + SQLAlchemy + FTS5                             |
| Frontend        | React 18 + TypeScript                                  |
| Build tool      | Vite                                                   |
| Styling         | TailwindCSS                                            |
| State mgmt      | Zustand                                                |
| Chart rendering | Chart.js + react-chartjs-2                             |
| Mind map        | Mermaid.js                                             |
| Flowchart/Arch. | Draw.io + react-drawio                                 |
| AI Text API     | Gemini / OpenAI / Anthropic / Ollama / Groq / DeepSeek |
| AI Image API    | Gemini multimodal / DALL-E 3                           |
| Speech-to-text  | OpenAI Whisper / Groq Whisper                          |
| Text-to-speech  | OpenAI TTS / Google Cloud TTS                          |

### 🆕 Advanced RAG Search Techniques

| Technique       | Description                                        |
| --------------- | -------------------------------------------------- |
| RRF Fusion      | Reciprocal Rank Fusion combining fulltext & vector |
| Query Expansion | LLM expands query intent automatically             |
| LLM Reranking   | AI-powered re-ranking of results                   |
| Deduplication   | Merge duplicate search results automatically       |

---

## FAQs

### Q: Backend shows ModuleNotFoundError on startup?

**A:** Make sure you’ve installed all requirements in the virtual environment using `pip install -r requirements.txt`.

### Q: Frontend cannot connect to backend?

**A:** Ensure your backend is running at `http://localhost:5000`.

### Q: API Key is invalid?

**A:**

1. Make sure your `.env` file is inside the `backend/` directory.
2. Use the "Test Connection" feature in the settings page.

### Q: Ollama cannot connect?

**A:**

1. Ensure Ollama service is running: `ollama serve`
2. Make sure the model is pulled: `ollama pull llama3.2`

---

## Development Commands

```bash
# Backend development mode (auto-reload)
cd backend && flask run --debug

# Frontend dev mode
cd frontend && npm run dev

# Build frontend for production
cd frontend && npm run build
```

---

## Author

**Teacher Liang (A-Liang)**

- Facebook: https://www.facebook.com/?locale=zh_TW
- YouTube: https://www.youtube.com/@Liang-yt02
- 3A Technology Community: https://www.facebook.com/groups/2754139931432955

---

## License Statement

© 2026 Teacher Liang. All rights reserved.

This project is for "Teacher Liang’s course students" for learning purposes only.

**Prohibited:**

- Modifying this project’s content
- Redistribution or reselling
- Commercial use
- Any unauthorized use of any kind

For authorization inquiries, please contact the author.
