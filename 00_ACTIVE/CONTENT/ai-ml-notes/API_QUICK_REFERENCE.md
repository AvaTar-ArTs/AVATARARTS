# 🚀 API Quick Reference - What Each API Does & How to Use

**Quick access to all your APIs** | Load with: `source ~/.env.d/[category].env`

---

## 🤖 AI / LLM APIs (`llm-apis.env`)

### OpenAI
**What it makes**: Text generation, code, images (DALL-E), speech
**Use for**: GPT-4 for complex tasks, GPT-3.5 for speed/cost
```python
import openai
response = openai.ChatCompletion.create(model="gpt-4", messages=[{"role": "user", "content": "..."}])
```

### Anthropic (Claude)
**What it makes**: Long-form analysis, code review, research
**Use for**: 200K context, detailed analysis, coding help
```python
import anthropic
client = anthropic.Anthropic(api_key=os.getenv('ANTHROPIC_API_KEY'))
response = client.messages.create(model="claude-3-opus-20240229", messages=[...])
```

### Groq
**What it makes**: Fast inference (500+ tokens/sec)
**Use for**: Real-time chat, quick responses, prototyping
```python
from groq import Groq
client = Groq(api_key=os.getenv('GROQ_API_KEY'))
response = client.chat.completions.create(model="mixtral-8x7b-32768", messages=[...])
```

### DeepSeek
**What it makes**: Code generation, technical documentation
**Use for**: Specialized coding tasks
```python
# Use via API similar to OpenAI format
```

### XAI (Grok)
**What it makes**: Real-time information, current events
**Use for**: Up-to-date information, news analysis
```python
# Use via API
```

---

## 🎨 Art / Vision APIs (`art-vision.env`)

### Leonardo.ai
**What it makes**: Artistic images, character designs, game art
**Use for**: Consistent character generation, fantasy art
```python
import requests
response = requests.post("https://cloud.leonardo.ai/api/rest/v1/generations",
    headers={"Authorization": f"Bearer {api_key}"},
    json={"prompt": "...", "modelId": "..."})
```

### Stability AI
**What it makes**: Photorealistic images, Stable Diffusion
**Use for**: Product photos, marketing images, fast generation
```python
response = requests.post("https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image", ...)
```

### Replicate
**What it makes**: Run ANY AI model (images, video, audio, etc.)
**Use for**: Testing models without infrastructure
```python
import replicate
output = replicate.run("stability-ai/sdxl:...", input={"prompt": "..."})
```

### Runway ML
**What it makes**: AI video generation, video editing
**Use for**: Motion graphics, video content creation
```python
response = requests.post("https://api.runwayml.com/v1/generate", json={"prompt": "video description"})
```

---

## 🎵 Audio / Music APIs (`audio-music.env`)

### Suno
**What it makes**: AI-generated music and songs
**Use for**: Background music, soundtracks
```python
# Use via web interface or unofficial API
```

### ElevenLabs
**What it makes**: AI voice cloning, text-to-speech
**Use for**: Voiceovers, podcasts, audiobooks
```python
from elevenlabs import generate
audio = generate(text="Hello world", voice="Rachel", model="eleven_multilingual_v2")
```

### AssemblyAI
**What it makes**: Speech-to-text with AI insights
**Use for**: Transcription + sentiment + content moderation
```python
from assemblyai import AssemblyAI
aai = AssemblyAI(api_key=os.getenv('ASSEMBLYAI_API_KEY'))
transcript = aai.transcriber.transcribe(audio_url)
```

### Deepgram
**What it makes**: Real-time speech transcription
**Use for**: Live transcription, low-latency applications
```python
from deepgram import Deepgram
dg = Deepgram(os.getenv('DEEPGRAM_API_KEY'))
response = await dg.transcription.prerecorded({"url": audio_url})
```

---

## 🤖 Automation / Agents APIs (`automation-agents.env`)

### Cohere
**What it makes**: Embeddings, classification, semantic search
**Use for**: Text analysis, reranking search results
```python
import cohere
co = cohere.Client(os.getenv('COHERE_API_KEY'))
embeddings = co.embed(["text1", "text2"]).embeddings
```

### Fireworks
**What it makes**: Fast inference for open-source models
**Use for**: Cost-effective AI inference
```python
# OpenAI-compatible API
```

### Pinecone
**What it makes**: Vector database (semantic search)
**Use for**: Long-term memory, RAG systems
```python
import pinecone
pinecone.init(api_key=os.getenv('PINECONE_API_KEY'))
index = pinecone.Index("my-index")
index.upsert([("id1", embedding1, {"metadata": "..."})])
```

### Supabase
**What it makes**: Backend-as-a-service (database, auth, storage)
**Use for**: Full backend infrastructure
```python
from supabase import create_client
supabase = create_client(os.getenv('SUPABASE_URL'), os.getenv('SUPABASE_KEY'))
data = supabase.table('users').select("*").execute()
```

### OpenRouter
**What it makes**: Access to 100+ AI models through one API
**Use for**: Testing multiple models, model routing
```python
import openrouter
response = openrouter.ChatCompletion.create(model="anthropic/claude-3-opus", messages=[...])
```

### LangSmith
**What it makes**: LLM observability and debugging
**Use for**: Tracking AI agent behavior, debugging chains
```python
from langsmith import Client
client = Client(api_key=os.getenv('LANGSMITH_API_KEY'))
with client.trace("my_chain") as trace: ...
```

---

## 📈 SEO / Analytics APIs (`seo-analytics.env`)

### SerpAPI
**What it makes**: Google search results data
**Use for**: SERP tracking, competitor analysis, keyword research
```python
from serpapi import GoogleSearch
search = GoogleSearch({"q": "keyword", "api_key": os.getenv('SERPAPI_KEY')})
results = search.get_dict()
```

### NewsAPI
**What it makes**: Real-time news articles
**Use for**: Trending topics, news aggregation, content ideas
```python
from newsapi import NewsApiClient
newsapi = NewsApiClient(api_key=os.getenv('NEWSAPI_KEY'))
articles = newsapi.get_everything(q='topic', language='en')
```

---

## 🧠 Vector / Memory APIs (`vector-memory.env`)

### ChromaDB
**What it makes**: Local vector database
**Use for**: Semantic search, embeddings storage (runs locally)
```python
import chromadb
client = chromadb.Client()
collection = client.create_collection("my_collection")
collection.add(documents=["text"], ids=["id1"])
```

### Zep
**What it makes**: Long-term memory for AI assistants
**Use for**: Conversational memory, fact extraction
```python
from zep_python import ZepClient
zep = ZepClient(api_key=os.getenv('ZEP_API_KEY'))
zep.memory.add_memory(session_id="user_123", messages=[...])
```

---

## 🛠️ Other Tools (`other-tools.env`)

### Moonvalley
**What it makes**: AI video generation
**Use for**: Video content creation

### ArcGIS
**What it makes**: Maps, spatial analysis, demographics
**Use for**: Location intelligence, service area analysis
```python
from arcgis.gis import GIS
gis = GIS(api_key=os.getenv('ARCGIS_API_KEY'))
```

### Supernormal
**What it makes**: Meeting transcription and notes
**Use for**: Automated meeting summaries

### Descript
**What it makes**: Audio/video editing via text
**Use for**: Remove filler words, text-based video editing
```python
# API for automated editing
```

### Sonix
**What it makes**: Audio transcription
**Use for**: Podcast transcription, subtitles

### Rev.ai
**What it makes**: High-accuracy transcription
**Use for**: When accuracy is critical

### Speechmatics
**What it makes**: Real-time transcription
**Use for**: Live events, streaming transcription

### Ngrok
**What it makes**: Secure tunnels to localhost
**Use for**: Webhook testing, local dev → public URL
```bash
ngrok http 8000 --authtoken $NGROK_AUTHTOKEN
```

---

## 🔔 Notifications / Communication (`notifications.env`)

### Twilio
**What it makes**: SMS, voice calls, video
**Use for**: Customer communication, 2FA, notifications
```python
from twilio.rest import Client
client = Client(os.getenv('TWILIO_ACCOUNT_SID'), os.getenv('TWILIO_AUTH_TOKEN'))
message = client.messages.create(to="+1234567890", from_="+...", body="Hello!")
```

### Zapier
**What it makes**: Workflow automation
**Use for**: Connect apps without code

### Make (Integromat)
**What it makes**: Visual automation workflows
**Use for**: Complex integrations

---

## ☁️ Cloud / Infrastructure (`cloud-infrastructure.env`)

### AWS
**What it makes**: Cloud computing (S3, EC2, Lambda, etc.)
**Use for**: Hosting, storage, serverless functions
```python
import boto3
s3 = boto3.client('s3', region_name=os.getenv('AWS_REGION'))
```

### Azure OpenAI
**What it makes**: OpenAI models on Azure infrastructure
**Use for**: Enterprise OpenAI deployment

### Google Cloud
**What it makes**: Cloud services, AI/ML tools
**Use for**: Google infrastructure

---

## 🗂️ Documents / Knowledge (`documents.env`)

### Notion
**What it makes**: Workspace, databases, docs
**Use for**: Knowledge base, CRM, project management
```python
import requests
headers = {"Authorization": f"Bearer {os.getenv('NOTION_TOKEN')}"}
response = requests.get("https://api.notion.com/v1/databases/...", headers=headers)
```

### Slite
**What it makes**: Team documentation
**Use for**: Internal knowledge base

---

## ☁️ Heavenly Hands Project (`heavenly-hands.env`)

### Twilio Call Tracking System
**What it makes**: Complete call tracking for cleaning business
**Use for**: Customer calls, booking automation, analytics
```python
from twilio.rest import Client
client = Client(os.getenv('TWILIO_ACCOUNT_SID'), os.getenv('TWILIO_AUTH_TOKEN'))
# Route calls, track bookings, send SMS reminders
```

---

## 🎯 Quick Use Cases by Goal

### "I want to build a chatbot"
- **Backend**: Supabase (database)
- **AI**: OpenAI GPT-4 or Claude (conversation)
- **Memory**: Pinecone or ChromaDB (long-term memory)
- **Notifications**: Twilio (SMS interface)

### "I want to generate content"
- **Text**: OpenAI GPT-4, Claude, Groq
- **Images**: Stability AI, Leonardo, Replicate
- **Video**: Runway, Replicate
- **Audio**: ElevenLabs, Suno

### "I want to analyze data"
- **Text**: Cohere (embeddings), AssemblyAI (transcripts)
- **Search**: SerpAPI (SERP data), NewsAPI (news)
- **Location**: ArcGIS (spatial analysis)

### "I want to automate workflows"
- **Code**: OpenRouter (multi-model), LangSmith (debugging)
- **No-code**: Zapier, Make
- **Infrastructure**: AWS, Ngrok (tunnels)

### "I want to build an AI agent"
- **LLM**: OpenAI, Claude, Groq
- **Memory**: Pinecone, Zep, ChromaDB
- **Tools**: LangSmith (observability)
- **Classification**: Cohere

---

## 📚 Load APIs Quickly

```bash
# Load specific category
source ~/.env.d/llm-apis.env
source ~/.env.d/art-vision.env
source ~/.env.d/audio-music.env

# Load all at once
for file in ~/.env.d/*.env; do source "$file"; done

# Check what's loaded
env | grep -E "API|TOKEN|KEY" | cut -d= -f1 | sort
```

---

## 💡 Cost Optimization Tips

**Cheapest Options:**
- Text: Groq, GPT-3.5
- Images: Stability AI (direct)
- Transcription: Deepgram
- Search: SerpAPI (pay per use)

**Best Quality:**
- Text: GPT-4, Claude Opus
- Images: Midjourney (via Replicate)
- Transcription: Rev.ai
- Video: Runway

**Best Speed:**
- Text: Groq (500+ tok/sec)
- Images: Stability AI
- Transcription: Deepgram (real-time)

---

## 🔗 Full Documentation

For detailed examples and advanced patterns:
```bash
cat ~/.env.d/GUIDES/[category]_Advanced.md | less
```

Available guides:
- `LLM_APIs_101.md`
- `Art_Vision_101.md`
- `Audio_Music_Advanced.md`
- `Automation_Agents_Advanced.md`
- `SEO_Analytics_Advanced.md`
- `Vector_Memory_Advanced.md`
- `Other_Tools_Advanced.md`
- `Heavenly_Hands_Advanced.md`

---

**Quick reference created**: `~/API_QUICK_REFERENCE.md` 🚀
**Last updated**: 2025-10-27
