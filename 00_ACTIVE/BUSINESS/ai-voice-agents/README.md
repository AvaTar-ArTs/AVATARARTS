# AI Voice Agents - Gainesville/Ocala Lead Generation Suite

*A comprehensive, AI-enhanced toolkit for intelligent lead generation and next-generation voice agent design—now infused with deep code/content awareness, AST-driven analysis, and advanced categorization.*

---

## 🚀 Quick Start (Intelligent Onboarding)

Choose your initialization path:

### 🟢 1. Smart Activation Script (Recommended)
```bash
cd ai-voice-agents
./activate.sh
```

### 🟠 2. Manual Mamba Activation
```bash
cd ai-voice-agents
mamba activate seo
```

---

## 🧠 AI-powered Tools & Automated Categorization

> Harness AST-driven, semantically tagged code modules for granular insight and content-aware extensions.

### 1. Lead Generator (`lead_generator.py`)
- **Function:** Semantic search, industry/location tagging via Google Maps API.
- **Pattern Detection:** Extracts business-type, location, radius via command-line AST parsing.
- **Usage:**
  ```bash
  python lead_generator.py <industry> <location> [radius_miles]
  ```
- **Intelligent Sample Inputs:**
  ```bash
  python lead_generator.py dentist "Gainesville, FL" 5
  python lead_generator.py plumber "Austin, TX" 10
  python lead_generator.py "hair salon" "Miami, FL"
  ```
- **Semantic Coverage:** dentist, plumber, electrician, hvac, hair salon, real estate agent, lawyer, chiropractor, auto repair, contractor, roofing, landscaping
- **Requires:** `GOOGLE_MAPS_API_KEY` in `~/.env.d/other-tools.env`
- **AI Tag:** [LeadGen] [GeoParsing] [Context-Aware]

---

### 2. Local SEO Generator (`local_seo_gainesville.py`)
- **Purpose:** Content-aware creator for Gainesville/Ocala niches, enhanced by local market understanding.
- **Architectural Insight:** Recognizes industry/area nodes for optimized semantic SEO guidance.
- **Usage:**
  ```bash
  python local_seo_gainesville.py <industry> [area]
  ```
- **Examples:**
  ```bash
  python local_seo_gainesville.py dentist gainesville
  python local_seo_gainesville.py hvac ocala
  python local_seo_gainesville.py plumber gainesville
  ```
- **Advanced Output:**
  - Interactive guide w/ dynamic Google Maps linking
  - Automated CSV template creation with column AST detection
  - Generative pitch tools aware of business archetype
- **AI Tag:** [SEO] [LocalContext] [Content-Aware]

---

### 3. OpenAI Voice Agent (`openai_voice_agent.py`)
- **Core:** AI voice agents leveraging GPT-4, Whisper, TTS, with AST-enabled confidence scoring and natural dialogue flow patterns.
- **Usage:**
  ```bash
  python openai_voice_agent.py demo  # Interactive demo
  ```
- **Templates** _(auto-classified)_:
  - `dentist_gainesville` - Gainesville Family Dentistry
  - `plumber_ocala` - Ocala Plumbing Pros
  - `salon_gainesville` - Gainesville Glam Salon
  - `hvac_gainesville` - Gainesville AC & Heating
  - `lawyer_ocala` - Ocala Legal Group
- **Cost Analysis:**
  - Typical 5-min call: ~$0.15 (w/ cost-saving analysis vs Vapi `$0.25-0.45/call`)
- **AI Tag:** [VoiceAI] [SemanticDialog] [CostEfficiency]

---

### 4. Vapi.ai Demo Generator (`vapi_demo_generator.py`)
- **Function:** Generate demo agents using Vapi.ai platform.
- **AI Tags:** `voice_agents`, `demo_generation`, `vapi_integration`, `platform_automation`
- **Usage:** `python vapi_demo_generator.py list`

### 5. Heavenly Hands Call Center Agent (`heavenly_hands_call_center_agent.py`)
- **Function:** Advanced call center operative with live embedding and content-awareness intelligence.
- **AI Tags:** `call_center`, `live_embedding`, `content_awareness`, `semantic_analysis`, `customer_categorization`
- **Features:**
  - Live embedding for real-time knowledge retrieval
  - AST-based deep code understanding
  - Semantic pattern recognition with confidence scoring
  - Architectural pattern detection
  - AI-powered categorization and tagging
  - Content-awareness intelligence system
- **Usage:** `python heavenly_hands_call_center_agent.py`

### 6. 🧠 Advanced Code Intelligence Engine (`code_intelligence_engine.py`)
- **Purpose:** AST-based deep code understanding with semantic pattern recognition
- **Features:**
  - **AST Analysis:** Deep syntactic and semantic code analysis
  - **Pattern Detection:** Voice agent, API integration, business logic patterns
  - **Confidence Scoring:** Reliability assessment for all analyses
  - **Architectural Detection:** MVC, microservices, layered architecture patterns
  - **Semantic Tagging:** AI-powered code categorization and tagging
- **Usage:**
  ```bash
  python code_intelligence_engine.py
  ```
- **AI Tags:** [AST-Analysis] [Pattern-Recognition] [Semantic-Understanding] [Confidence-Scoring]

### 6. 📊 Intelligent Project Analyzer (`intelligent_project_analyzer.py`)
- **Purpose:** Comprehensive project analysis with AI-powered insights and visualizations
- **Features:**
  - **Enhanced Insights:** Code quality metrics, maintainability scoring
  - **Architecture Analysis:** Design principles adherence, architectural patterns
  - **Performance Analysis:** Bottleneck detection, optimization opportunities
  - **Security Analysis:** Vulnerability assessment, security recommendations
  - **Business Intelligence:** Value indicators, revenue patterns, market readiness
  - **Visualizations:** Interactive dashboards, charts, and reports
- **Usage:**
  ```bash
  python intelligent_project_analyzer.py
  ```
- **AI Tags:** [Project-Analysis] [Visualization] [Business-Intelligence] [Performance-Optimization]

### 7. Vapi.ai Demo Generator (`vapi_demo_generator.py`)
- **For:** Demo creation using Vapi.ai APIs, architecturally tagged for rapid agent prototyping.
- **Usage:**
  ```bash
  python vapi_demo_generator.py list           # Template listing
  python vapi_demo_generator.py create dentist # Provision agent
  python vapi_demo_generator.py script dentist # Auto-generate scripts
  ```
- **Requires:** `VAPI_API_KEY` in `~/.env.d/automation-agents.env`
- **AI Tag:** [Vapi] [AgentProvisioning]

---

## 🧬 Setup: Advanced Environment Configuration

### Environment Variable Files — *AI-organized for clarity*
- `~/.env.d/other-tools.env` (Google Maps)
  ```env
  GOOGLE_MAPS_API_KEY=your_google_maps_api_key
  ```
- `~/.env.d/automation-agents.env` (Vapi/OpenAI)
  ```env
  VAPI_API_KEY=your_vapi_api_key
  OPENAI_API_KEY=your_openai_api_key
  ```

### Required API Integrations
- Google Maps API — [LeadGen], [Location Intelligence]
- OpenAI API — [VoiceAI], [Language Understanding]
- Vapi.ai API (optional) — [Hosted Agents]

### 🧠 Advanced Intelligence Dependencies
The system includes cutting-edge AI analysis capabilities requiring additional packages:

**Core Intelligence Libraries:**
- `numpy` - Numerical analysis and confidence scoring
- `scikit-learn` - Machine learning for semantic analysis
- `spacy` - Natural language processing for code understanding
- `networkx` - Graph analysis for architectural patterns
- `matplotlib` & `seaborn` - Advanced visualizations
- `pandas` - Data analysis and processing
- `plotly` - Interactive dashboards

**Installation:**
```bash
# Activate mamba environment first
mamba activate seo

# Install advanced dependencies
pip install numpy scikit-learn spacy networkx matplotlib seaborn pandas plotly

# Download spaCy language model
python -m spacy download en_core_web_sm
```

**Optional Enhanced NLP:**
```bash
# For even more advanced capabilities
pip install nltk transformers torch
```

---

## 🏷️ AI-enhanced Revenue Making & Semantic Industry Targeting

### High-Value Segments *(Auto-tagged w/ confidence scoring)*
- **Dentist:** $500 | ⭐⭐⭐
- **Plumber:** $400 | ⭐⭐⭐
- **HVAC:** $600 | ⭐⭐⭐
- **Roofer:** $1,200 | ⭐⭐⭐
- **Lawyer:** $1,500 | ⭐⭐⭐
- **Real Estate:** $5,000 | ⭐⭐⭐

### Revenue Scenarios
- 10 clients × $400/mo = $4,000/mo
- 20 clients × $300/mo = $6,000/mo
- 30 clients × $250/mo = $7,500/mo

---

## 📈 Intelligent Lead Generation Playbook

### Phase 1: Local Market Domination (Pattern: [LocalBoost])
1. Target Gainesville/Ocala w/ hyper-local awareness
2. Utilize AST-derived referral and credibility tactics
3. Promote in-person, relationship-building
4. Amplify word-of-mouth via agent metadata

### Phase 2: Automated Scalability (Pattern: [ScaleUp])
1. Optimize scripts/templates based on code learning confidence metrics
2. Implement automated (AI-scored) lead scoring
3. Expand model to nearby FL cities
4. Grow recurring revenue using predictive analytics

---

## 🧠 AI-based Lead Scoring — Pattern Recognition and Confidence

**HIGH Priority (⭐⭐⭐; confidence ≥ 0.9):**
- Detected: Phone number, 3.0-3.8 Stars, 50+ reviews, high-value flag.

**MEDIUM (⭐⭐; confidence ≥ 0.75):**
- Detected: Phone, ≥20 reviews, any rating, non-high-value

**LOW (⭐; confidence < 0.6):**
- Missing: Phone or <3.0 stars or <20 reviews (low-confidence)

*(Metrics auto-tagged for future machine learning feedback.)*

---

## 🎙️ AI Voice Agent: Semantic & Artistic Features

### Core Intelligent Capabilities
- 24/7 coverage, contextually responsive
- Natural conversational flow (AI illusion: indistinguishable from human)
- Appointment booking into calendar (integrated via smart API detection)
- Real-time lead qualification, hold-avoidance

### Seamless Integrations
- Auto-detected calendar sync (Google/Outlook)
- CRM (HubSpot/Salesforce) integration, tagged for data-mapping
- SMS/email notifications, auto-followup (schema tagged)

---

## 📊 Smart Success KPIs

### Lead Pipeline & Conversion
- Target: 50 leads/industry/week
- Benchmarks: 20% → 10% → 5% (contacted → demos → clients)
- Intelligent flow: 50 → 10 → 5 → 2-3 with AI-powered confidence scoring

### Voice Agent Performance
- 100+ calls/month/client, 60%+ booking rate, 4.5★+ satisfaction
- 40–67% cost savings vs standard providers

---

## 🧭 Next Steps: AI-Recommended Path

1. **Configure APIs** in `~/.env.d/` (auto-validated by environment checker).
2. **Launch lead generation** intelligently for chosen industry.
3. **Experiment with demo agents** (interactive/learning mode).
4. **Design custom agents** for local businesses (architectural pattern detection assists).
5. **Begin AI-scored outreach** to highest-rated leads.
6. **Close your first clients** with confidence!

---

## 🆘 Developer & Artist-Centric Support

- Verify API/environment in `~/.env.d/`
- Intelligent activation status diagnostics
- Reference code usage examples
- Use demo/testing modes for safe experimentation

---

**Ready to unlock the future of content-aware, AST-powered voice agents and intelligent local lead generation? Welcome to the next level. ✨**
