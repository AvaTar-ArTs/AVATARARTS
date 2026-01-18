# 🚀 Your Comprehensive AI APIs Environment

## 🎯 What's Installed

This setup includes **ALL** the Python packages needed for your configured APIs:

### 🌐 LLMs & Text APIs
- ✅ **OpenAI** (GPT-4, GPT-5) - *Configured*
- ✅ **Anthropic Claude** - *Configured*
- ✅ **Groq** (Fast inference) - *Configured*
- ✅ **Grok/XAI** - *Configured*
- ✅ **DeepSeek** - *Configured*

### 🖼️ Image & Vision APIs
- Stability AI
- Replicate
- Runway ML
- Kaiber
- Pika

### 🎵 Audio & Music APIs
- ✅ **AssemblyAI** (Speech-to-Text) - *Configured*
- ✅ **Deepgram** (Speech-to-Text) - *Configured*
- Suno AI
- ElevenLabs
- InVideo

### 🤖 Automation & Frameworks
- LangChain (Multi-model orchestration)
- LlamaIndex (Data framework)
- Pinecone (Vector DB)
- Qdrant (Vector DB)
- ChromaDB (Vector DB)
- Supabase
- Cohere
- LangSmith

### 📈 Research & Analytics
- SerpAPI (Google Search)
- NewsAPI
- Web scraping tools (BeautifulSoup, Selenium, Playwright)

### ☁️ Cloud Platforms
- AWS (Boto3)
- Azure
- Google Cloud

---

## 🎬 Quick Start (3 Steps!)

### Step 1: Run the Installation

```bash
cd ~
./setup-ai-full.sh
```

⏱️ **Time:** 5-10 minutes (grab a coffee!)

### Step 2: Activate Environment

```bash
source ~/.activate-ai-full.sh
```

**Pro Tip:** Add this alias to `~/.zshrc`:
```bash
echo "alias ai='source ~/.activate-ai-full.sh'" >> ~/.zshrc
source ~/.zshrc
```

Then just type `ai` to activate!

### Step 3: Test It!

```bash
python ~/test-ai-apis.py
```

---

## 📦 Files Created

```
~/
├── 📄 ai-apis-environment-full.yml    # Conda environment definition
├── 🔧 setup-ai-full.sh                # Installation script
├── ⚡ .activate-ai-full.sh            # Quick activation helper
├── 🔑 .ai-apis.env                    # YOUR API KEYS (already copied!)
├── 🧪 test-ai-apis.py                 # Test all your APIs
├── 📖 ai-usage-examples.py            # Usage examples
└── 📚 AI-QUICK-START.md               # Quick reference guide
```

---

## 💻 Usage Examples

### OpenAI (GPT-4/GPT-5)

```python
from openai import OpenAI
import os

client = OpenAI()  # Uses OPENAI_API_KEY automatically

response = client.chat.completions.create(
    model=os.getenv("OPENAI_MODEL", "gpt-4"),  # You have gpt-5 configured!
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Explain quantum computing"}
    ],
    temperature=0.7
)

print(response.choices[0].message.content)
```

### Anthropic Claude

```python
from anthropic import Anthropic

client = Anthropic()  # Uses ANTHROPIC_API_KEY automatically

message = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=1024,
    messages=[
        {"role": "user", "content": "Write a haiku about AI"}
    ]
)

print(message.content[0].text)
```

### Groq (Blazing Fast!)

```python
from groq import Groq

client = Groq()  # Uses GROQ_API_KEY automatically

response = client.chat.completions.create(
    model="llama3-70b-8192",
    messages=[
        {"role": "user", "content": "What is machine learning?"}
    ],
    max_tokens=200
)

print(response.choices[0].message.content)
```

### AssemblyAI (Speech-to-Text)

```python
import assemblyai as aai
import os

aai.settings.api_key = os.getenv("ASSEMBLYAI_API_KEY")

# Transcribe from URL
transcriber = aai.Transcriber()
transcript = transcriber.transcribe("https://example.com/audio.mp3")

print(transcript.text)

# Or from local file
transcript = transcriber.transcribe("./my_audio.mp3")
print(transcript.text)
```

### Deepgram (Real-time Speech-to-Text)

```python
from deepgram import Deepgram
import os

dg_client = Deepgram(os.getenv("DEEPGRAM_API_KEY"))

# Transcribe audio file
with open('audio.wav', 'rb') as audio:
    source = {'buffer': audio, 'mimetype': 'audio/wav'}
    response = dg_client.transcription.sync_prerecorded(source, {'punctuate': True})
    
print(response['results']['channels'][0]['alternatives'][0]['transcript'])
```

### LangChain Multi-Model Comparison

```python
from langchain_openai import ChatOpenAI
from langchain_anthropic import ChatAnthropic
from langchain_core.messages import HumanMessage

prompt = "Explain the theory of relativity in simple terms"

# OpenAI
llm_openai = ChatOpenAI(model="gpt-4")
response_openai = llm_openai.invoke([HumanMessage(content=prompt)])

# Anthropic
llm_anthropic = ChatAnthropic(model="claude-sonnet-4-20250514")
response_anthropic = llm_anthropic.invoke([HumanMessage(content=prompt)])

print("OpenAI:", response_openai.content)
print("\nAnthropic:", response_anthropic.content)
```

---

## 🔑 Your API Keys

**Location:** `~/.ai-apis.env`

**Currently Active APIs:**
- ✅ OpenAI (with GPT-5 configured!)
- ✅ Anthropic Claude
- ✅ Groq
- ✅ Grok/XAI
- ✅ DeepSeek
- ✅ AssemblyAI
- ✅ Deepgram

**To add more:** Edit `~/.ai-apis.env` and uncomment/fill in the keys you need.

---

## 🛠️ Common Commands

### Activate Environment
```bash
source ~/.activate-ai-full.sh
# or with alias:
ai
```

### Deactivate
```bash
conda deactivate
```

### Update Packages
```bash
ai  # Activate first
pip install --upgrade openai anthropic groq assemblyai deepgram-sdk
```

### Check What's Installed
```bash
ai
pip list | grep -E "openai|anthropic|groq|langchain"
```

### Reinstall Environment
```bash
mamba env remove -n ai-apis-full
./setup-ai-full.sh
```

---

## 🧪 Testing Your Setup

### Quick Test All APIs
```bash
ai
python ~/test-ai-apis.py
```

This will:
- ✅ Check all API keys
- ✅ Test package imports
- ✅ Run a quick OpenAI test call

### Try Examples
```bash
ai
python ~/ai-usage-examples.py
```

---

## 🎓 Learning Resources

### Official Documentation
- **OpenAI**: https://platform.openai.com/docs
- **Anthropic**: https://docs.anthropic.com
- **Groq**: https://console.groq.com/docs
- **AssemblyAI**: https://www.assemblyai.com/docs
- **Deepgram**: https://developers.deepgram.com/docs
- **LangChain**: https://python.langchain.com
- **LlamaIndex**: https://docs.llamaindex.ai

### Your Specific Setup
- **Quick Start**: `cat ~/AI-QUICK-START.md`
- **Examples**: `python ~/ai-usage-examples.py`
- **Test Script**: `python ~/test-ai-apis.py`

---

## 💡 Pro Tips

### 1. Compare Models Easily

```python
def ask_all(prompt: str):
    """Ask the same question to multiple models"""
    from openai import OpenAI
    from anthropic import Anthropic
    from groq import Groq
    
    results = {}
    
    # OpenAI
    client = OpenAI()
    r = client.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}]
    )
    results['OpenAI'] = r.choices[0].message.content
    
    # Anthropic
    client = Anthropic()
    r = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=1024,
        messages=[{"role": "user", "content": prompt}]
    )
    results['Anthropic'] = r.content[0].text
    
    # Groq
    client = Groq()
    r = client.chat.completions.create(
        model="llama3-70b-8192",
        messages=[{"role": "user", "content": prompt}]
    )
    results['Groq'] = r.choices[0].message.content
    
    return results

# Usage
responses = ask_all("What is the meaning of life?")
for model, response in responses.items():
    print(f"\n{model}:\n{response}\n")
```

### 2. Cost Tracking

```python
import tiktoken

def estimate_cost(text: str, model: str = "gpt-4"):
    """Estimate API call cost"""
    enc = tiktoken.encoding_for_model(model)
    tokens = len(enc.encode(text))
    
    # Prices as of 2024
    prices = {
        "gpt-4": {"input": 0.03, "output": 0.06},
        "gpt-3.5-turbo": {"input": 0.0015, "output": 0.002}
    }
    
    return tokens * prices[model]["input"] / 1000

print(f"Cost: ${estimate_cost('Your long prompt here'):.4f}")
```

### 3. Error Handling with Retries

```python
from tenacity import retry, stop_after_attempt, wait_exponential

@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=2, max=10))
def call_api_with_retry(prompt: str):
    from openai import OpenAI
    client = OpenAI()
    
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}]
    )
    return response.choices[0].message.content

# Will retry up to 3 times with exponential backoff
result = call_api_with_retry("Your prompt")
```

---

## 🔧 Troubleshooting

### "mamba: command not found"
```bash
source ~/miniforge3/etc/profile.d/conda.sh
```

### "API key not found"
```bash
# Check if environment is activated
which python
# Should show: ~/miniforge3/envs/ai-apis-full/bin/python

# Check if .env is loaded
echo $OPENAI_API_KEY
# Should show your key

# If not, reload:
source ~/.ai-apis.env
```

### Package Import Errors
```bash
# Make sure environment is active
conda activate ai-apis-full

# Reinstall specific package
pip install --force-reinstall openai
```

### Rate Limiting
Most APIs have rate limits. Use tenacity or implement exponential backoff:

```python
import time
from openai import RateLimitError

def call_with_backoff(func, max_retries=3):
    for i in range(max_retries):
        try:
            return func()
        except RateLimitError:
            if i < max_retries - 1:
                wait_time = 2 ** i
                print(f"Rate limited. Waiting {wait_time}s...")
                time.sleep(wait_time)
            else:
                raise
```

---

## 🎯 What's Next?

1. **Explore Different Models**
   - Try GPT-5 (you have it configured!)
   - Compare Claude vs GPT-4
   - Test Groq for speed

2. **Build Something**
   - Create a chatbot
   - Build a transcription service
   - Make a content generator

3. **Learn Frameworks**
   - Dive into LangChain
   - Explore LlamaIndex for RAG
   - Try vector databases

4. **Add More APIs**
   - Uncomment keys in `~/.ai-apis.env`
   - Get keys from provider websites
   - Test with `python ~/test-ai-apis.py`

---

## 🎉 You're All Set!

Your environment includes **40+ Python packages** and supports **15+ AI services**.

**Quick Commands:**
```bash
ai                          # Activate environment
python ~/test-ai-apis.py    # Test everything
python ~/ai-usage-examples.py  # See examples
```

**Happy coding!** 🚀

---

## 📞 Need Help?

- Check `~/AI-QUICK-START.md` for quick reference
- Run `python ~/test-ai-apis.py` to diagnose issues
- Review provider docs for API-specific help

**Environment Info:**
- Name: `ai-apis-full`
- Location: `~/miniforge3/envs/ai-apis-full`
- Python: 3.11
- Packages: 40+ ML/AI libraries
