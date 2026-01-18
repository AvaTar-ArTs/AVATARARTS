# Installation & Setup

## Requirements

### Python Version
- Python 3.8 or higher

### Required Packages
```bash
pip install numpy scikit-learn
```

### Optional Packages (for enhanced features)
```bash
# For AI content generation
pip install openai anthropic

# For advanced NLP (optional)
pip install spacy
python -m spacy download en_core_web_sm
```

## Environment Setup

### API Keys (Optional)

For AI-powered content generation, set these environment variables:

```bash
# OpenAI (for GPT-4)
export OPENAI_API_KEY="your-key-here"

# Anthropic (for Claude)
export ANTHROPIC_API_KEY="your-key-here"
```

Or load from your existing system:
```bash
source ~/.env.d/loader.sh llm-apis
```

## Installation

1. **Navigate to the directory:**
   ```bash
   cd /Users/steven/workspace/seo-domination-engine
   ```

2. **Verify installation:**
   ```bash
   python3 seo_domination_engine.py --help
   ```

3. **Test with a quick metadata generation:**
   ```bash
   python3 seo_domination_engine.py generate-metadata --domain avatararts
   ```

## Output Directory

All generated content is saved to: `~/seo_content/`

Create it if needed:
```bash
mkdir -p ~/seo_content
```

## Quick Test

```bash
# Generate metadata
python3 seo_domination_engine.py generate-metadata --domain avatararts

# Check output
ls -lah ~/seo_content/
```

## Troubleshooting

### Missing Dependencies
If you see import errors, install missing packages:
```bash
pip install numpy scikit-learn
```

### API Key Issues
If AI generation fails, the system will fall back to template-based content. This is normal and still produces high-quality SEO content.

### Output Directory
If you get permission errors, check:
```bash
ls -ld ~/seo_content
chmod 755 ~/seo_content
```

## Next Steps

See `README.md` for usage examples and quick start guide.

