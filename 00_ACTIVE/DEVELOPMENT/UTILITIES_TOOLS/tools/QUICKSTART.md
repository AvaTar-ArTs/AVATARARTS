# 🚀 Quick Start Guide - AvaTarArTs Suite

Get up and running in 5 minutes!

---

## ⚡ Prerequisites

1. **Python 3.8+** installed
2. **Git** installed
3. **API Keys** configured in `~/.env.d/`

---

## 📦 Installation

### Step 1: Clone the Repository
```bash
cd ~/GitHub
git clone https://github.com/ichoake/AvaTarArTs-Suite.git
cd AvaTarArTs-Suite
```

### Step 2: Install Dependencies
```bash
# Create virtual environment (recommended)
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install requirements
pip install -r requirements.txt
```

### Step 3: Load API Keys
```bash
# Load all API keys
source ~/.env.d/loader.sh

# Verify keys are loaded
env | grep API_KEY | wc -l
# Should show 60+ keys
```

---

## 🎯 First Tasks

### Task 1: Generate an Image with Leonardo AI
```bash
source ~/.env.d/loader.sh art-vision

# Navigate to automation integrations
cd automation/api_integrations

# Find Leonardo integration script
ls | grep leonardo

# Run image generation
python3 [leonardo_script].py --prompt "magical forest" --output ../../outputs/
```

### Task 2: Process Audio Files
```bash
source ~/.env.d/loader.sh audio-music

cd media/audio

# List available audio tools
ls *.py | head -10

# Example: Text-to-speech
python3 text_to_speech.py --text "Hello from AvaTarArTs Suite" --voice elevenlabs
```

### Task 3: Organize Files
```bash
cd utilities/organizers

# Run file organizer
python3 [organizer_script].py --source ~/Downloads --destination ~/Organized
```

### Task 4: Find Duplicate Files
```bash
cd utilities/duplicates/fdupes

# Scan for duplicates
python3 sorts.py --path ~/Documents --output duplicates_report.csv
```

---

## 🔍 Explore the Suite

### Browse by Category

**Creative Tools:**
```bash
cd media/
ls audio/     # 70+ audio scripts
ls image/     # 300+ image scripts
ls video/     # 120+ video scripts
```

**Automation:**
```bash
cd automation/
ls api_integrations/    # 65+ API wrappers
ls social_media/        # Social media bots
ls youtube/             # YouTube automation
```

**Utilities:**
```bash
cd utilities/
ls batch/       # Batch processors
ls duplicates/  # Duplicate finders
ls organizers/  # File organizers
ls system/      # System tools
```

---

## 🛠️ Common Commands

### Load API Keys by Category
```bash
# LLM APIs only
source ~/.env.d/loader.sh llm-apis

# Art & Vision
source ~/.env.d/loader.sh art-vision

# Audio & Music
source ~/.env.d/loader.sh audio-music

# All categories
source ~/.env.d/loader.sh
```

### Check Loaded APIs
```bash
# List all loaded API keys
env | grep API_KEY | cut -d= -f1 | sort

# Check specific key
echo $LEONARDO_API_KEY
echo $OPENAI_API_KEY
echo $ELEVENLABS_API_KEY
```

### Run Scripts Safely
```bash
# Always run from suite root or appropriate directory
cd ~/GitHub/AvaTarArTs-Suite

# Use virtual environment
source venv/bin/activate

# Load environment
source ~/.env.d/loader.sh

# Run script
python3 path/to/script.py
```

---

## 📊 Verify Installation

### Quick Health Check
```bash
# Check Python version
python3 --version  # Should be 3.8+

# Check pip packages
pip list | grep -E "openai|anthropic|elevenlabs|replicate"

# Check API keys loaded
env | grep -c API_KEY  # Should be 60+

# Check file count
find . -name "*.py" | wc -l  # Should be 1400+
```

---

## 🎨 Example Workflows

### Workflow 1: AI Image Pipeline
```bash
# Load APIs
source ~/.env.d/loader.sh

# 1. Generate concept with GPT
python3 automation/api_integrations/openai_complete.py \
  --prompt "Generate 3 image concepts for a fantasy landscape"

# 2. Create image with Leonardo
python3 automation/api_integrations/leonardo_generate.py \
  --prompt "mystical fantasy landscape with waterfalls"

# 3. Enhance with VanceAI
python3 media/image/vanceai_upscale.py \
  --input output.png --scale 4x
```

### Workflow 2: Content Creation
```bash
# 1. Generate script
# 2. Create voice with ElevenLabs
# 3. Generate visuals
# 4. Combine into video
# 5. Upload to cloud storage
```

### Workflow 3: File Management
```bash
# 1. Scan for duplicates
cd utilities/duplicates/fdupes
python3 sorts.py --path ~/Documents

# 2. Organize files
cd ../utilities/organizers
python3 organize.py --auto

# 3. Batch process
cd ../utilities/batch
python3 batch_processor.py
```

---

## 🆘 Troubleshooting

### Issue: API Keys Not Loading
```bash
# Check if ~/.env.d/ exists
ls -la ~/.env.d/

# Manually load
source ~/.env.d/loader.sh

# Verify
echo $OPENAI_API_KEY
```

### Issue: Missing Dependencies
```bash
# Reinstall requirements
pip install -r requirements.txt --upgrade

# Or install individually
pip install openai anthropic elevenlabs replicate
```

### Issue: Script Not Found
```bash
# Make sure you're in the right directory
pwd

# Navigate to suite root
cd ~/GitHub/AvaTarArTs-Suite

# Find the script
find . -name "script_name.py"
```

### Issue: Permission Denied
```bash
# Make script executable
chmod +x script_name.py

# Or run with python3
python3 script_name.py
```

---

## 📚 Next Steps

1. **Read the full README** - `README.md`
2. **Explore documentation** - `docs/`
3. **Check out guides** - `docs/guides/`
4. **Review example scripts** - Each directory has examples
5. **Set up n8n workflows** - `automation/`

---

## 🔗 Useful Links

- [Main README](README.md)
- [API Documentation](~/.env.d/README.md)
- [GitHub Audit Tool](../github-audit-bundle/)
- [Leonardo AI Docs](https://docs.leonardo.ai/)
- [OpenAI Docs](https://platform.openai.com/docs)
- [ElevenLabs Docs](https://docs.elevenlabs.io/)

---

## 💡 Pro Tips

1. **Always use virtual environment** for Python
2. **Load API keys first** before running scripts
3. **Start with small tests** before batch processing
4. **Check output directories** before running bulk operations
5. **Back up important files** before processing
6. **Use --help flag** to see script options
7. **Check logs** if something fails

---

**Ready to build amazing things! 🚀**

*Questions? Check the docs or review the example scripts in each directory.*
