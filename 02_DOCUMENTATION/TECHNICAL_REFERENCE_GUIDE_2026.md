# 🔧 TECHNICAL REFERENCE GUIDE - Passive Income Empire

**Purpose:** Deep technical documentation for developers/technical team members  
**Date:** January 16, 2026  
**Audience:** Developers, DevOps, technical staff

---

## TABLE OF CONTENTS

1. [System Architecture](#system-architecture)
2. [Technology Stack](#technology-stack)
3. [Database Schemas](#database-schemas)
4. [API Reference](#api-reference)
5. [Deployment Guide](#deployment-guide)
6. [Performance Optimization](#performance-optimization)
7. [Security Considerations](#security-considerations)
8. [Monitoring & Logging](#monitoring--logging)

---

## SYSTEM ARCHITECTURE

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                   USER INTERACTION LAYER                    │
│  (Websites, Social Media, Email, Phone)                     │
└──────────────────────────┬──────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
┌───────────────┐  ┌───────────────┐  ┌────────────────┐
│   RECIPE GEN  │  │  SEO ENGINE   │  │  RECEPTIONIST  │
│   (Python)    │  │   (Python)    │  │   (Python)     │
└───────┬───────┘  └───────┬───────┘  └────────┬───────┘
        │                  │                   │
        └──────────────────┼───────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
   ┌─────────┐      ┌──────────┐      ┌────────────┐
   │ SQLite  │      │ Analytics│      │ Affiliate  │
   │Database │      │ DB       │      │ Tracking   │
   └─────────┘      └──────────┘      └────────────┘
        │                  │                  │
        └──────────────────┼──────────────────┘
                           │
                ┌──────────┴──────────┐
                │                     │
                ▼                     ▼
        ┌────────────────┐    ┌──────────────────┐
        │  FILE STORAGE  │    │  REVENUE TRACKING│
        │  (seo_content/ │    │  (revenue.db)    │
        │   recipes/)    │    └──────────────────┘
        └────────────────┘
```

### Data Flow Pipeline

```
1. GENERATION PHASE
   Recipe Generator     SEO Engine           AI Receptionist
        │                   │                     │
        ├─ Prompt GPT-4 ─┬──┼─ Analyze Content ──┼─ Process Call
        ├─ Generate text │  ├─ Cluster Keywords  ├─ Qualify Lead
        ├─ Add metadata  │  ├─ Generate Article  ├─ Store Contact
        └─ Save to DB    └──└─ Create Schema     └─ Schedule Follow-up

2. OPTIMIZATION PHASE
   ┌─────────────────────────────────────┐
   │ - Add affiliate links                │
   │ - Optimize SEO metadata              │
   │ - Format for social media            │
   │ - Extract keywords                   │
   │ - Calculate revenue potential        │
   └─────────────────────────────────────┘

3. STORAGE PHASE
   Recipe    →  recipe_generator.db
   Articles  →  seo_content/
   Leads     →  ai_receptionist.db
   Revenue   →  revenue_tracking.db

4. PUBLISHING PHASE
   Website   →  HTML publishing
   Social    →  Social media posting
   Email     →  Newsletter distribution
   Analytics →  Dashboard tracking
```

---

## TECHNOLOGY STACK

### Core Technologies

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Language** | Python | 3.8+ | Primary development |
| **AI Engine** | OpenAI API | GPT-4 | Content generation |
| **Database** | SQLite | 3.x | Local data storage |
| **Web Framework** | Flask | 3.0+ | Web interface (optional) |
| **Task Scheduling** | Schedule | 1.2+ | Cron-like job scheduling |
| **HTTP Client** | Requests | 2.31+ | API calls |
| **Environment** | Python-dotenv | 1.0+ | Config management |

### Python Dependencies

```txt
# Core
openai>=1.0.0              # GPT-4 access
requests>=2.31.0           # HTTP requests
python-dotenv>=1.0.0       # Environment variables

# Database
sqlite3                    # Built-in SQLite

# Scheduling
schedule>=1.2.0            # Job scheduling

# Web (optional)
Flask>=3.0.0               # Web framework
Flask-CORS>=4.0.0          # CORS support

# ML/Analytics (optional)
numpy>=1.24.0              # Numerical computing
scikit-learn>=1.2.0        # ML algorithms
pandas>=2.0.0              # Data manipulation

# Monitoring (optional)
python-prometheus-client   # Prometheus metrics
```

### External Services

| Service | Purpose | Cost |
|---------|---------|------|
| **OpenAI API** | GPT-4 content generation | $0.03-0.06 per 1K tokens |
| **Amazon Associates** | Affiliate products | 4% commission |
| **HelloFresh** | Meal kit affiliate | 30% commission |
| **Google AdSense** | Display ads | 68% of revenue |
| **Affiliate Networks** | Various products | Varies (5-50%) |

---

## DATABASE SCHEMAS

### Database 1: recipe_generator.db

#### Table: recipes
```sql
CREATE TABLE recipes (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    ingredients TEXT,  -- JSON array
    instructions TEXT,  -- JSON array
    prep_time TEXT,
    cook_time TEXT,
    servings INTEGER,
    difficulty TEXT,  -- easy, medium, hard
    category TEXT,  -- breakfast, lunch, dinner, dessert, snack
    tags TEXT,  -- JSON array
    nutrition_info TEXT,  -- JSON object
    seo_keywords TEXT,  -- JSON array
    affiliate_links TEXT,  -- JSON array
    image_prompt TEXT,
    video_prompt TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    published BOOLEAN,
    views INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0
);
```

#### Table: recipe_metrics
```sql
CREATE TABLE recipe_metrics (
    id TEXT PRIMARY KEY,
    recipe_id TEXT NOT NULL,
    page_views INTEGER,
    affiliate_clicks INTEGER,
    conversions INTEGER,
    estimated_revenue REAL,
    social_shares INTEGER,
    avg_time_on_page INTEGER,  -- seconds
    bounce_rate REAL,  -- 0-1
    date_recorded DATE,
    FOREIGN KEY (recipe_id) REFERENCES recipes(id)
);
```

#### Table: affiliate_products
```sql
CREATE TABLE affiliate_products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT,
    affiliate_url TEXT,
    commission_rate REAL,  -- 0-1
    estimated_monthly_revenue REAL,
    clicks_last_month INTEGER,
    conversion_rate REAL,  -- 0-1
    created_at TIMESTAMP
);
```

### Database 2: ai_receptionist.db

#### Table: leads
```sql
CREATE TABLE leads (
    id TEXT PRIMARY KEY,
    phone_number TEXT,
    name TEXT,
    email TEXT,
    company TEXT,
    interested_in TEXT,  -- Product/service they're interested in
    call_duration INTEGER,  -- seconds
    qualified BOOLEAN,
    qualification_score REAL,  -- 0-1
    follow_up_scheduled TIMESTAMP,
    follow_up_completed BOOLEAN,
    conversion_value REAL,  -- $
    created_at TIMESTAMP,
    notes TEXT
);
```

#### Table: conversations
```sql
CREATE TABLE conversations (
    id TEXT PRIMARY KEY,
    lead_id TEXT NOT NULL,
    message TEXT,
    sender TEXT,  -- 'agent' or 'caller'
    timestamp TIMESTAMP,
    sentiment TEXT,  -- positive, neutral, negative
    FOREIGN KEY (lead_id) REFERENCES leads(id)
);
```

### Database 3: revenue_tracking.db

#### Table: transactions
```sql
CREATE TABLE transactions (
    id TEXT PRIMARY KEY,
    source TEXT,  -- 'affiliate', 'ads', 'sponsored', 'lead', 'subscription'
    amount REAL NOT NULL,
    currency TEXT DEFAULT 'USD',
    date_transaction DATE,
    description TEXT,
    related_item_id TEXT,  -- recipe_id, lead_id, etc
    status TEXT,  -- 'pending', 'confirmed', 'paid'
    created_at TIMESTAMP
);
```

#### Table: revenue_daily_summary
```sql
CREATE TABLE revenue_daily_summary (
    date DATE PRIMARY KEY,
    affiliate_revenue REAL,
    ad_revenue REAL,
    sponsored_revenue REAL,
    lead_revenue REAL,
    subscription_revenue REAL,
    total_revenue REAL,
    total_transactions INTEGER,
    unique_visitors INTEGER,
    conversions INTEGER
);
```

---

## API REFERENCE

### 1. AI Recipe Generator API

#### GenerateRecipe()
```python
def generate_recipe(
    category: str,
    difficulty: str = "medium",
    servings: int = 4,
    diet_type: str = "omnivore",
    cuisine: str = "american",
    include_affiliate: bool = True
) -> Recipe:
    """
    Generate a complete recipe with SEO optimization
    
    Args:
        category: breakfast|lunch|dinner|dessert|snack
        difficulty: easy|medium|hard
        servings: 1-12
        diet_type: omnivore|vegetarian|vegan|paleo|keto
        cuisine: american|italian|mexican|asian|middle_eastern
        include_affiliate: Whether to include affiliate links
    
    Returns:
        Recipe object with:
        - Title, description, ingredients, instructions
        - SEO keywords and affiliate links
        - Image/video prompts
        - Nutrition information
    
    Example:
        recipe = generate_recipe(
            category="dinner",
            difficulty="easy",
            diet_type="vegan"
        )
    """
```

#### BatchGenerateRecipes()
```python
def batch_generate_recipes(
    count: int = 5,
    categories: List[str] = None,
    parallel: bool = True
) -> List[Recipe]:
    """
    Generate multiple recipes in batch
    
    Optimizations:
    - Parallel API calls if enabled
    - Rate limiting respects OpenAI quotas
    - Automatic retry on failure
    - Caches results to avoid duplication
    """
```

#### OptimizeForSEO()
```python
def optimize_for_seo(recipe: Recipe) -> Recipe:
    """
    Enhance recipe with SEO optimization
    
    Performs:
    - Keyword enrichment
    - Meta description generation
    - Schema.org markup creation
    - Internal link suggestions
    - Related recipe recommendations
    """
```

### 2. SEO Domination Engine API

#### GenerateMetadata()
```python
def generate_metadata(
    domain: str,
    keyword: str = None
) -> MetadataPackage:
    """
    Generate complete SEO metadata pack
    
    Returns:
    - Meta titles (60 chars)
    - Meta descriptions (160 chars)
    - Schema.org markup (JSON-LD)
    - OG tags for social sharing
    - Open Graph images
    
    Example:
        metadata = generate_metadata(
            domain="quantumforge",
            keyword="AI Agents Framework"
        )
    """
```

#### CreateContent()
```python
def create_content(
    keyword: str,
    domain: str,
    word_count: int = 2500,
    content_type: str = "article",
    include_semantic_analysis: bool = True
) -> ContentPackage:
    """
    Generate SEO-optimized article with analysis
    
    Includes:
    - Full article (2000-3000 words)
    - Keyword intelligence (intent, opportunity)
    - Semantic content analysis
    - Related keywords discovered
    - Optimization recommendations
    
    Content types:
    - article: Blog post
    - guide: Comprehensive guide
    - tutorial: Step-by-step
    - comparison: Comparison article
    - review: Product review
    """
```

#### AnalyzeContent()
```python
def analyze_content(content: str) -> SemanticAnalysis:
    """
    Perform deep semantic analysis on content
    
    Returns:
    - Semantic tags (15+ extracted)
    - Intent classification
    - Keyword clusters
    - Topic entities
    - Readability score
    - SEO potential score
    - Confidence metrics
    - Optimization recommendations
    """
```

### 3. AI Receptionist API

#### ProcessCall()
```python
def process_call(
    caller_phone: str,
    caller_name: str = None
) -> ConversationResult:
    """
    Handle inbound phone call
    
    Steps:
    1. Answer call with greeting
    2. Understand caller need
    3. Qualify as lead
    4. Collect contact info
    5. Schedule follow-up
    6. Generate transcript
    
    Returns:
    - Transcript
    - Lead qualification score
    - Extracted contact info
    - Recommended next actions
    """
```

#### QualifyLead()
```python
def qualify_lead(
    lead_data: Dict,
    scoring_model: str = "default"
) -> LeadScore:
    """
    Analyze and score lead quality
    
    Scoring factors:
    - Interest level
    - Budget capability
    - Timeline
    - Decision-making authority
    - Previous interactions
    
    Returns score: 0-100
    """
```

---

## DEPLOYMENT GUIDE

### Local Development Setup

```bash
# 1. Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Create .env file
cp .env.example .env
# Edit .env with your API keys

# 4. Initialize databases
python3 -c "
import sqlite3
sqlite3.connect('databases/recipe_generator.db').execute('SELECT 1')
sqlite3.connect('databases/ai_receptionist.db').execute('SELECT 1')
sqlite3.connect('databases/revenue_tracking.db').execute('SELECT 1')
"

# 5. Run tests
python3 -m pytest tests/ -v

# 6. Start development server
python3 app.py  # If Flask app exists
```

### Production Deployment

#### Option 1: VPS Deployment (Recommended for under $20/month)

```bash
# 1. Provision VPS (DigitalOcean, Linode, AWS Lightsail)
# - OS: Ubuntu 20.04 LTS
# - RAM: 2GB minimum
# - Storage: 20GB
# - CPU: 1-2 vCPU

# 2. SSH into server
ssh root@your_vps_ip

# 3. Install dependencies
apt update && apt upgrade -y
apt install python3.10 python3-pip python3-venv postgresql -y

# 4. Clone repository
git clone https://github.com/yourusername/passive-income-empire.git
cd passive-income-empire

# 5. Set up Python environment
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
pip install gunicorn supervisor

# 6. Configure environment
nano .env  # Add your production API keys

# 7. Set up supervisor for process management
cat > /etc/supervisor/conf.d/passive-income.conf << EOF
[program:recipe-generator]
command=/path/to/venv/bin/python3 ai-recipe-generator/ai_recipe_generator.py
directory=/path/to/passive-income-empire
autostart=true
autorestart=true
stderr_logfile=/var/log/recipe-generator.err.log
stdout_logfile=/var/log/recipe-generator.out.log

[program:revenue-dashboard]
command=/path/to/venv/bin/python3 revenue_dashboard.py
directory=/path/to/passive-income-empire
autostart=true
autorestart=true
stderr_logfile=/var/log/revenue-dashboard.err.log
stdout_logfile=/var/log/revenue-dashboard.out.log
EOF

# 8. Start services
supervisorctl reread
supervisorctl update
supervisorctl start all

# 9. Monitor logs
tail -f /var/log/recipe-generator.err.log
```

#### Option 2: Heroku Deployment (Easiest but pricier)

```bash
# 1. Install Heroku CLI
brew tap heroku/brew && brew install heroku

# 2. Login to Heroku
heroku login

# 3. Create app
heroku create your-app-name

# 4. Set environment variables
heroku config:set OPENAI_API_KEY=sk-...
heroku config:set AFFILIATE_AMAZON_TAG=...

# 5. Deploy
git push heroku main

# 6. Check logs
heroku logs --tail
```

#### Option 3: Docker Deployment

```dockerfile
# Dockerfile
FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["python3", "ai-recipe-generator/ai_recipe_generator.py"]
```

```bash
# Build and run
docker build -t passive-income-empire .
docker run -e OPENAI_API_KEY=sk-... passive-income-empire
```

---

## PERFORMANCE OPTIMIZATION

### Database Optimization

```python
# Index frequent queries
CREATE INDEX idx_recipes_created_at ON recipes(created_at);
CREATE INDEX idx_recipes_category ON recipes(category);
CREATE INDEX idx_recipes_published ON recipes(published);
CREATE INDEX idx_metrics_recipe_id ON recipe_metrics(recipe_id);

# Query optimization example
# SLOW: SELECT * FROM recipes WHERE DATE(created_at) = '2026-01-16'
# FAST: SELECT * FROM recipes WHERE created_at >= '2026-01-16' AND created_at < '2026-01-17'

# Connection pooling
import sqlite3
class DBPool:
    def __init__(self, max_connections=10):
        self.pool = [sqlite3.connect(':memory:') for _ in range(max_connections)]
    
    def get_connection(self):
        return self.pool.pop() if self.pool else sqlite3.connect(':memory:')
```

### API Optimization

```python
# Batch requests to OpenAI
# SLOW: Call API 100 times (100 API calls)
# FAST: Batch 10 prompts at once (10 API calls)

def batch_generate(prompts: List[str], batch_size=10):
    for i in range(0, len(prompts), batch_size):
        batch = prompts[i:i+batch_size]
        # Single API call for batch
        results = openai.Completion.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": p} for p in batch]
        )

# Caching
from functools import lru_cache

@lru_cache(maxsize=1000)
def get_keywords_for_category(category: str):
    """Cache keyword lookups"""
    pass

# Rate limiting
from ratelimit import limits, sleep_and_retry

@sleep_and_retry
@limits(calls=3, period=60)  # 3 calls per 60 seconds
def call_openai_api():
    pass
```

### Content Generation Optimization

```python
# Parallel recipe generation
from concurrent.futures import ThreadPoolExecutor

def generate_recipes_parallel(count=10, max_workers=5):
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        futures = [executor.submit(generate_recipe) for _ in range(count)]
        return [f.result() for f in futures]

# Cost optimization
def estimate_api_cost(prompt: str) -> float:
    """Estimate cost before calling API"""
    tokens = len(prompt.split()) * 1.3  # Rough estimate
    cost_per_1k_tokens = 0.015  # GPT-3.5
    return (tokens / 1000) * cost_per_1k_tokens

# Budget management
def track_api_spend():
    """Monitor daily spending"""
    today_spend = sum(
        t.amount for t in transactions 
        if t.source == 'api' and t.date == datetime.today()
    )
    if today_spend > DAILY_BUDGET:
        # Pause generation
        return False
    return True
```

---

## SECURITY CONSIDERATIONS

### API Key Management

```python
# ✅ CORRECT: Use environment variables
import os
api_key = os.getenv('OPENAI_API_KEY')

# ❌ WRONG: Hardcoded keys
api_key = "sk-..."

# Best practices
1. Never commit .env to Git
2. Use .gitignore: .env, *.key, *.pem
3. Rotate keys monthly
4. Use separate keys for dev/prod
5. Monitor key usage for anomalies
```

### Database Security

```python
# ✅ Parameterized queries (prevent SQL injection)
cursor.execute('SELECT * FROM recipes WHERE id = ?', (recipe_id,))

# ❌ String concatenation (UNSAFE!)
cursor.execute(f'SELECT * FROM recipes WHERE id = {recipe_id}')

# Password hashing for user data
from werkzeug.security import generate_password_hash, check_password_hash

# Encrypt sensitive fields
from cryptography.fernet import Fernet
cipher = Fernet(key)
encrypted = cipher.encrypt(sensitive_data.encode())
```

### API Security

```python
# Rate limiting
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

limiter = Limiter(app, key_func=get_remote_address)

@app.route('/api/recipes')
@limiter.limit("10 per minute")
def get_recipes():
    pass

# CORS security
from flask_cors import CORS

CORS(app, resources={
    r"/api/*": {
        "origins": ["yourdomain.com"],
        "methods": ["GET", "POST"],
        "allow_headers": ["Content-Type"]
    }
})

# Input validation
from pydantic import BaseModel, validator

class RecipeRequest(BaseModel):
    category: str
    servings: int
    
    @validator('servings')
    def validate_servings(cls, v):
        if v < 1 or v > 100:
            raise ValueError('Servings must be 1-100')
        return v
```

---

## MONITORING & LOGGING

### Logging Setup

```python
import logging
import logging.handlers

# Configure logging
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)

# File handler
file_handler = logging.handlers.RotatingFileHandler(
    'logs/app.log',
    maxBytes=10485760,  # 10MB
    backupCount=5
)
file_handler.setLevel(logging.INFO)

# Console handler
console_handler = logging.StreamHandler()
console_handler.setLevel(logging.DEBUG)

# Formatter
formatter = logging.Formatter(
    '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
file_handler.setFormatter(formatter)
console_handler.setFormatter(formatter)

logger.addHandler(file_handler)
logger.addHandler(console_handler)

# Usage
logger.info(f"Generated recipe: {recipe.id}")
logger.error(f"API error: {str(e)}")
logger.debug(f"Processing: {len(recipes)} recipes")
```

### Health Checks

```python
def health_check() -> Dict[str, Any]:
    """Comprehensive system health check"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "checks": {
            "api_key": check_openai_key(),
            "database": check_database(),
            "disk_space": check_disk_space(),
            "memory_usage": check_memory(),
            "last_recipe_generation": get_last_generation_time(),
            "recent_errors": get_recent_errors(hours=1)
        }
    }

# Run health check
if __name__ == "__main__":
    health = health_check()
    print(json.dumps(health, indent=2))
```

### Metrics & Monitoring

```python
from prometheus_client import Counter, Histogram, Gauge

# Metrics
recipes_generated = Counter('recipes_generated_total', 'Total recipes generated')
api_call_duration = Histogram('api_call_seconds', 'API call duration')
active_leads = Gauge('active_leads', 'Number of active leads')
daily_revenue = Gauge('daily_revenue_usd', 'Daily revenue in USD')

# Usage
recipes_generated.inc()

@api_call_duration.time()
def call_openai():
    pass
```

---

## TROUBLESHOOTING GUIDE

### Common Issues & Fixes

#### Issue: "OpenAI Rate Limit"
```python
# Solution: Implement exponential backoff
import time
from tenacity import retry, stop_after_attempt, wait_exponential

@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=4, max=10)
)
def call_openai_with_retry():
    return openai.Completion.create(...)
```

#### Issue: "Database Locked"
```python
# Solution: Use WAL mode (Write-Ahead Logging)
conn = sqlite3.connect('database.db')
conn.execute('PRAGMA journal_mode=WAL')

# Or: Implement connection queue
from queue import Queue
db_queue = Queue(maxsize=10)
```

#### Issue: "Memory Leaks"
```python
# Solution: Profile memory usage
import tracemalloc

tracemalloc.start()
# ... run code ...
current, peak = tracemalloc.get_traced_memory()
print(f"Current: {current/1e6:.1f}MB; Peak: {peak/1e6:.1f}MB")
```

---

## APPENDIX: Code Examples

### Full Recipe Generation Example

```python
from openai import OpenAI

client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

def generate_recipe_complete(category: str) -> dict:
    """Generate complete recipe with all metadata"""
    
    prompt = f"""Generate a unique {category} recipe with:
    1. Title (SEO-friendly)
    2. Description (2-3 sentences, includes keywords)
    3. Ingredients list with quantities
    4. Step-by-step instructions
    5. Prep and cook times
    6. Nutrition info
    7. 5 affiliate-friendly product recommendations
    8. 10 SEO keywords
    
    Format as JSON."""
    
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.7,
        max_tokens=2000
    )
    
    recipe_json = json.loads(response.choices[0].message.content)
    
    # Save to database
    db = sqlite3.connect('databases/recipe_generator.db')
    cursor = db.cursor()
    cursor.execute("""
        INSERT INTO recipes 
        (id, title, description, ingredients, instructions, 
         prep_time, cook_time, category, seo_keywords, affiliate_links, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        str(uuid.uuid4()),
        recipe_json['title'],
        recipe_json['description'],
        json.dumps(recipe_json['ingredients']),
        json.dumps(recipe_json['instructions']),
        recipe_json['prep_time'],
        recipe_json['cook_time'],
        category,
        json.dumps(recipe_json['seo_keywords']),
        json.dumps(recipe_json['affiliate_products']),
        datetime.now().isoformat()
    ))
    db.commit()
    db.close()
    
    return recipe_json
```

---

**End of Technical Reference Guide**

Document Version: 1.0  
Last Updated: January 16, 2026  
Audience: Technical Teams

