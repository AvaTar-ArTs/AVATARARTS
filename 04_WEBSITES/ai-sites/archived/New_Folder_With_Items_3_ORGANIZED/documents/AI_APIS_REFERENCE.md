# AI APIs Quick Reference Guide

## 🚀 Environment Setup

### Activate Environment
```bash
# Method 1: Use helper script
source ~/.activate-ai-apis.sh

# Method 2: Manual activation
mamba activate ai-apis
source ~/.ai-apis.env  # Load API keys
```

### Add to your shell profile for easy access
```bash
# Add to ~/.zshrc or ~/.bash_profile
alias ai='source ~/.activate-ai-apis.sh'
```

---

## 📚 API Quick Reference

### 1. OpenAI (GPT-4, GPT-3.5, DALL-E)

```python
from openai import OpenAI

client = OpenAI()  # Uses OPENAI_API_KEY from env

# Chat completion
response = client.chat.completions.create(
    model="gpt-4",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Hello!"}
    ],
    temperature=0.7,
    max_tokens=150
)
print(response.choices[0].message.content)

# Streaming
stream = client.chat.completions.create(
    model="gpt-4",
    messages=[{"role": "user", "content": "Count to 10"}],
    stream=True
)
for chunk in stream:
    if chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end="")

# Image generation
image = client.images.generate(
    model="dall-e-3",
    prompt="A futuristic cityscape",
    size="1024x1024",
    n=1
)
print(image.data[0].url)
```

### 2. Anthropic (Claude)

```python
from anthropic import Anthropic

client = Anthropic()  # Uses ANTHROPIC_API_KEY from env

# Basic message
message = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=1024,
    messages=[
        {"role": "user", "content": "Hello, Claude!"}
    ]
)
print(message.content[0].text)

# With system prompt
message = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=1024,
    system="You are a helpful coding assistant.",
    messages=[
        {"role": "user", "content": "Explain recursion"}
    ]
)

# Streaming
with client.messages.stream(
    model="claude-sonnet-4-20250514",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Write a poem"}]
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)
```

### 3. Google Gemini

```python
import google.generativeai as genai
import os

genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

# Basic generation
model = genai.GenerativeModel('gemini-pro')
response = model.generate_content("Write a haiku about AI")
print(response.text)

# Multi-turn conversation
chat = model.start_chat(history=[])
response = chat.send_message("Hello! What's the weather like on Mars?")
print(response.text)
response = chat.send_message("That's fascinating! Tell me more.")
print(response.text)

# Vision (with gemini-pro-vision)
vision_model = genai.GenerativeModel('gemini-pro-vision')
# Image must be PIL Image or file path
response = vision_model.generate_content(["What's in this image?", image])
```

### 4. Cohere

```python
import cohere
import os

co = cohere.Client(os.getenv("COHERE_API_KEY"))

# Chat
response = co.chat(
    message="Explain quantum computing",
    model="command",
    temperature=0.7
)
print(response.text)

# Generate embeddings
embeddings = co.embed(
    texts=["Hello world", "Goodbye world"],
    model="embed-english-v3.0"
)
print(embeddings.embeddings)

# Classify
response = co.classify(
    inputs=["This is great!", "This is terrible"],
    examples=[
        cohere.Example("I love this", "positive"),
        cohere.Example("I hate this", "negative")
    ]
)
```

### 5. Hugging Face

```python
from transformers import pipeline
from huggingface_hub import InferenceClient
import os

# Local inference with transformers
generator = pipeline('text-generation', model='gpt2')
result = generator("Once upon a time", max_length=50)
print(result[0]['generated_text'])

# Inference API
client = InferenceClient(token=os.getenv("HUGGINGFACE_TOKEN"))
response = client.text_generation(
    "Complete this sentence: The future of AI is",
    model="meta-llama/Llama-2-7b-hf"
)
print(response)

# Chat completion
messages = [{"role": "user", "content": "Hello!"}]
response = client.chat_completion(messages, model="meta-llama/Llama-2-7b-chat-hf")
print(response.choices[0].message.content)
```

### 6. AWS Bedrock

```python
import boto3
import json

bedrock = boto3.client('bedrock-runtime', region_name='us-east-1')

# Anthropic Claude on Bedrock
body = json.dumps({
    "prompt": "\n\nHuman: Hello!\n\nAssistant:",
    "max_tokens_to_sample": 300,
    "temperature": 0.7
})

response = bedrock.invoke_model(
    modelId='anthropic.claude-v2',
    body=body
)

response_body = json.loads(response['body'].read())
print(response_body['completion'])
```

### 7. Azure OpenAI

```python
from openai import AzureOpenAI
import os

client = AzureOpenAI(
    api_key=os.getenv("AZURE_OPENAI_API_KEY"),
    api_version="2024-02-15-preview",
    azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT")
)

response = client.chat.completions.create(
    model="gpt-4",  # Your deployment name
    messages=[{"role": "user", "content": "Hello!"}]
)
print(response.choices[0].message.content)
```

### 8. Mistral AI

```python
from mistralai.client import MistralClient
import os

client = MistralClient(api_key=os.getenv("MISTRAL_API_KEY"))

# Chat completion
response = client.chat(
    model="mistral-large-latest",
    messages=[{"role": "user", "content": "Hello!"}]
)
print(response.choices[0].message.content)

# Streaming
for chunk in client.chat_stream(
    model="mistral-large-latest",
    messages=[{"role": "user", "content": "Count to 10"}]
):
    print(chunk.choices[0].delta.content, end="")
```

### 9. Together AI

```python
from together import Together
import os

client = Together(api_key=os.getenv("TOGETHER_API_KEY"))

response = client.chat.completions.create(
    model="meta-llama/Llama-3-70b-chat-hf",
    messages=[{"role": "user", "content": "Hello!"}]
)
print(response.choices[0].message.content)
```

### 10. Groq

```python
from groq import Groq
import os

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

response = client.chat.completions.create(
    model="llama3-70b-8192",
    messages=[{"role": "user", "content": "Explain AI in one sentence"}],
    temperature=0.7,
    max_tokens=100
)
print(response.choices[0].message.content)
```

### 11. Replicate

```python
import replicate
import os

# Set API token
os.environ["REPLICATE_API_TOKEN"] = os.getenv("REPLICATE_API_TOKEN")

# Run a model
output = replicate.run(
    "meta/llama-2-70b-chat:latest",
    input={"prompt": "Tell me a joke"}
)
print("".join(output))
```

### 12. Ollama (Local LLMs)

```python
import ollama

# Generate
response = ollama.generate(
    model='llama2',
    prompt='Why is the sky blue?'
)
print(response['response'])

# Chat
response = ollama.chat(
    model='llama2',
    messages=[
        {'role': 'user', 'content': 'Why is the ocean salty?'}
    ]
)
print(response['message']['content'])

# List models
models = ollama.list()
```

---

## 🧰 Framework Examples

### LangChain - Multi-Model Support

```python
from langchain_openai import ChatOpenAI
from langchain_anthropic import ChatAnthropic
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_cohere import ChatCohere
from langchain_core.messages import HumanMessage, SystemMessage

# OpenAI
llm = ChatOpenAI(model="gpt-4", temperature=0.7)

# Anthropic
llm = ChatAnthropic(model="claude-sonnet-4-20250514")

# Google
llm = ChatGoogleGenerativeAI(model="gemini-pro")

# Cohere
llm = ChatCohere(model="command")

# Use any of them the same way
messages = [
    SystemMessage(content="You are a helpful assistant"),
    HumanMessage(content="Tell me a joke")
]
response = llm.invoke(messages)
print(response.content)

# Streaming
for chunk in llm.stream(messages):
    print(chunk.content, end="", flush=True)
```

### LangChain - RAG Example

```python
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_community.vectorstores import Chroma
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.chains import RetrievalQA
from langchain_community.document_loaders import TextLoader

# Load documents
loader = TextLoader("document.txt")
documents = loader.load()

# Split text
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=200
)
texts = text_splitter.split_documents(documents)

# Create embeddings and vector store
embeddings = OpenAIEmbeddings()
vectorstore = Chroma.from_documents(texts, embeddings)

# Create QA chain
qa_chain = RetrievalQA.from_chain_type(
    llm=ChatOpenAI(model="gpt-4"),
    chain_type="stuff",
    retriever=vectorstore.as_retriever()
)

# Query
answer = qa_chain.run("What is this document about?")
print(answer)
```

### LlamaIndex

```python
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader
from llama_index.llms.openai import OpenAI
from llama_index.llms.anthropic import Anthropic

# Load documents
documents = SimpleDirectoryReader('data').load_data()

# Create index with OpenAI
index = VectorStoreIndex.from_documents(documents)

# Or use Claude
llm = Anthropic(model="claude-sonnet-4-20250514")
index = VectorStoreIndex.from_documents(documents, llm=llm)

# Query
query_engine = index.as_query_engine()
response = query_engine.query("What is this about?")
print(response)

# Chat mode
chat_engine = index.as_chat_engine()
response = chat_engine.chat("Tell me about the main topics")
print(response)
```

---

## 🗄️ Vector Database Examples

### Pinecone

```python
from pinecone import Pinecone
import os

pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))

# Create or connect to index
index = pc.Index("my-index")

# Upsert vectors
index.upsert(vectors=[
    ("id1", [0.1, 0.2, 0.3], {"text": "Hello"}),
    ("id2", [0.4, 0.5, 0.6], {"text": "World"})
])

# Query
results = index.query(vector=[0.1, 0.2, 0.3], top_k=5)
```

### ChromaDB

```python
import chromadb

# In-memory
client = chromadb.Client()

# Persistent
# client = chromadb.PersistentClient(path="./chroma_db")

# Create collection
collection = client.create_collection("my_collection")

# Add documents
collection.add(
    documents=["This is document 1", "This is document 2"],
    metadatas=[{"source": "web"}, {"source": "email"}],
    ids=["doc1", "doc2"]
)

# Query
results = collection.query(
    query_texts=["document about AI"],
    n_results=2
)
print(results)
```

### Qdrant

```python
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct

# In-memory
client = QdrantClient(":memory:")

# Or connect to server
# client = QdrantClient("http://localhost:6333")

# Create collection
client.create_collection(
    collection_name="my_collection",
    vectors_config=VectorParams(size=384, distance=Distance.COSINE)
)

# Insert points
client.upsert(
    collection_name="my_collection",
    points=[
        PointStruct(id=1, vector=[0.1]*384, payload={"text": "Hello"}),
        PointStruct(id=2, vector=[0.2]*384, payload={"text": "World"})
    ]
)

# Search
results = client.search(
    collection_name="my_collection",
    query_vector=[0.1]*384,
    limit=5
)
```

---

## 🎯 Common Patterns

### Multi-Model Comparison

```python
def compare_models(prompt: str) -> dict:
    """Compare responses from different models"""
    
    results = {}
    
    # OpenAI
    from openai import OpenAI
    client = OpenAI()
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}]
    )
    results["openai"] = response.choices[0].message.content
    
    # Anthropic
    from anthropic import Anthropic
    client = Anthropic()
    message = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=1024,
        messages=[{"role": "user", "content": prompt}]
    )
    results["anthropic"] = message.content[0].text
    
    # Google
    import google.generativeai as genai
    genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
    model = genai.GenerativeModel('gemini-pro')
    response = model.generate_content(prompt)
    results["google"] = response.text
    
    return results

# Usage
responses = compare_models("What is the meaning of life?")
for provider, response in responses.items():
    print(f"\n{provider.upper()}:")
    print(response)
```

### Async Batch Processing

```python
import asyncio
from openai import AsyncOpenAI

async def process_prompts(prompts: list[str]):
    client = AsyncOpenAI()
    
    async def process_one(prompt):
        response = await client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}]
        )
        return response.choices[0].message.content
    
    # Process all prompts concurrently
    tasks = [process_one(p) for p in prompts]
    return await asyncio.gather(*tasks)

# Usage
prompts = ["Tell me a joke", "Write a haiku", "Explain AI"]
results = asyncio.run(process_prompts(prompts))
```

---

## 📊 Monitoring & Observability

### LangSmith

```python
# Already configured via environment variables:
# LANGCHAIN_TRACING_V2=true
# LANGCHAIN_API_KEY=your-key
# LANGCHAIN_PROJECT=your-project

from langchain_openai import ChatOpenAI

# All calls are automatically traced
llm = ChatOpenAI(model="gpt-4")
response = llm.invoke("Hello!")  # Logged to LangSmith
```

### Weights & Biases

```python
import wandb

# Initialize
wandb.init(project="my-llm-project", name="experiment-1")

# Log metrics
wandb.log({
    "prompt_tokens": 100,
    "completion_tokens": 50,
    "total_cost": 0.002
})

# Finish
wandb.finish()
```

---

## 💡 Tips & Best Practices

### 1. Error Handling

```python
from openai import OpenAI, RateLimitError, APIError
import time

client = OpenAI()

def call_with_retry(prompt, max_retries=3):
    for attempt in range(max_retries):
        try:
            response = client.chat.completions.create(
                model="gpt-4",
                messages=[{"role": "user", "content": prompt}]
            )
            return response.choices[0].message.content
        except RateLimitError:
            if attempt < max_retries - 1:
                wait_time = 2 ** attempt  # Exponential backoff
                print(f"Rate limit hit. Waiting {wait_time}s...")
                time.sleep(wait_time)
            else:
                raise
        except APIError as e:
            print(f"API Error: {e}")
            raise
```

### 2. Cost Tracking

```python
import tiktoken

def estimate_cost(text: str, model: str = "gpt-4"):
    """Estimate API cost"""
    encoding = tiktoken.encoding_for_model(model)
    tokens = len(encoding.encode(text))
    
    # GPT-4 pricing (as of 2024)
    cost_per_1k = {
        "gpt-4": {"input": 0.03, "output": 0.06},
        "gpt-3.5-turbo": {"input": 0.0015, "output": 0.002}
    }
    
    return tokens * cost_per_1k[model]["input"] / 1000
```

### 3. Response Caching

```python
from functools import lru_cache
import hashlib

@lru_cache(maxsize=100)
def cached_completion(prompt: str):
    """Cache LLM responses"""
    client = OpenAI()
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}]
    )
    return response.choices[0].message.content

# Or use a persistent cache
import json

class PersistentCache:
    def __init__(self, cache_file="llm_cache.json"):
        self.cache_file = cache_file
        try:
            with open(cache_file, 'r') as f:
                self.cache = json.load(f)
        except FileNotFoundError:
            self.cache = {}
    
    def get(self, prompt):
        key = hashlib.md5(prompt.encode()).hexdigest()
        return self.cache.get(key)
    
    def set(self, prompt, response):
        key = hashlib.md5(prompt.encode()).hexdigest()
        self.cache[key] = response
        with open(self.cache_file, 'w') as f:
            json.dump(self.cache, f)
```

---

## 🔧 Troubleshooting

### Check API Keys

```python
import os

def check_api_keys():
    keys = {
        "OpenAI": "OPENAI_API_KEY",
        "Anthropic": "ANTHROPIC_API_KEY",
        "Google": "GOOGLE_API_KEY",
        "Cohere": "COHERE_API_KEY"
    }
    
    for name, env_var in keys.items():
        key = os.getenv(env_var)
        status = "✅" if key else "❌"
        print(f"{status} {name}: {env_var}")

check_api_keys()
```

### Test Connections

```python
def test_api(provider: str):
    try:
        if provider == "openai":
            from openai import OpenAI
            client = OpenAI()
            client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": "Hi"}],
                max_tokens=5
            )
        elif provider == "anthropic":
            from anthropic import Anthropic
            client = Anthropic()
            client.messages.create(
                model="claude-sonnet-4-20250514",
                max_tokens=5,
                messages=[{"role": "user", "content": "Hi"}]
            )
        print(f"✅ {provider} connection successful")
        return True
    except Exception as e:
        print(f"❌ {provider} connection failed: {e}")
        return False

# Test all
for provider in ["openai", "anthropic"]:
    test_api(provider)
```

---

## 📖 Resources

- **OpenAI**: https://platform.openai.com/docs
- **Anthropic**: https://docs.anthropic.com
- **Google AI**: https://ai.google.dev/docs
- **Cohere**: https://docs.cohere.com
- **Hugging Face**: https://huggingface.co/docs
- **LangChain**: https://python.langchain.com
- **LlamaIndex**: https://docs.llamaindex.ai
- **Pinecone**: https://docs.pinecone.io
- **ChromaDB**: https://docs.trychroma.com

---

## 🎓 Learning Path

1. **Week 1**: Master OpenAI & Anthropic APIs
2. **Week 2**: Explore LangChain for multi-model apps
3. **Week 3**: Build RAG applications with vector DBs
4. **Week 4**: Add monitoring and production practices

Happy coding! 🚀
