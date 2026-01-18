# Podcast to Shorts AI - Complete Automation Tool

**Version:** 2.0 (Standalone)
**Status:** ✅ Ready to Use

---

## 🚀 Quick Start

### 1. Install Requirements

```bash
pip install -r requirements.txt
```

Or install directly:
```bash
pip install openai
```

### 2. Set Up Your OpenAI API Key

**You need an OpenAI API key to use this tool.** Get one at: https://platform.openai.com/api-keys

**Choose ONE of these methods:**

#### Method 0: Copy the Template (Easiest)
This folder includes `env.template` (safe example). Copy it, then paste your key:

```bash
cp env.template .env
```

#### Method 1: Environment Variable (Recommended)
```bash
export OPENAI_API_KEY='your-api-key-here'
```

**For Windows:**
```cmd
set OPENAI_API_KEY=your-api-key-here
```

**For PowerShell:**
```powershell
$env:OPENAI_API_KEY="your-api-key-here"
```

#### Method 2: Create .env File (Current Directory)
Create a file named `.env` in the same directory as the script:

```bash
# .env file
OPENAI_API_KEY=your-api-key-here
```

#### Method 3: Create .env File (Home Directory)
Create `~/.env` (or `C:\Users\YourName\.env` on Windows):

```bash
# ~/.env file
OPENAI_API_KEY=your-api-key-here
```

### 3. Run the Script

```bash
python podcast_to_shorts_ai_FIXED.py --audio your_podcast.mp3
```

### Optional: Add “Personality + Emotional Arc”

```bash
# Add timecoded transcript (better clip timestamps)
python podcast_to_shorts_ai_FIXED.py --audio your_podcast.mp3 --timestamps

# Add a persona and emotional depth (more “you”)
python podcast_to_shorts_ai_FIXED.py --audio your_podcast.mp3 --emotional-depth 2 --persona "NocturneMelodies: poetic, gritty, hopeful"

# Feed a style bible / notes file
python podcast_to_shorts_ai_FIXED.py --audio your_podcast.mp3 --emotional-depth 2 --style-file ./my_style_notes.txt
```

---

## 📖 Usage Examples

### Basic Usage
```bash
python podcast_to_shorts_ai_FIXED.py --audio podcast.mp3
```

### Custom Output Directory
```bash
python podcast_to_shorts_ai_FIXED.py --audio podcast.mp3 --output ./my_shorts
```

### Generate More Shorts
```bash
python podcast_to_shorts_ai_FIXED.py --audio podcast.mp3 --max-shorts 10
```

---

## 📊 What You Get

The script generates these files:

1. **`{podcast_name}_transcript.txt`**
   - Full transcription of your podcast
   - Ready to review and edit

2. **`{podcast_name}_key_moments.json`**
   - 5 (or more) key moments identified
   - Timestamps, quotes, engagement reasons
   - Suggested titles

3. **`{podcast_name}_shorts_scripts.json`**
   - Complete scripts for each Short
   - Hooks, content, CTAs
   - Visual suggestions
   - Hashtags

4. **`{podcast_name}_complete_results.json`**
   - All results in one file
   - Easy to process programmatically

---

## ⚙️ Requirements

- **Python 3.8+** (free - download from python.org)
- **OpenAI API key** (get at openai.com)
- **Audio file** (MP3, WAV, M4A - up to 25MB)

---

## 🔧 Troubleshooting

### "OpenAI API key not found"
- Make sure you've set the API key using one of the methods above
- Check that the key is correct (starts with `sk-`)
- Try running: `echo $OPENAI_API_KEY` (Linux/Mac) or `echo %OPENAI_API_KEY%` (Windows)

### "File too large"
- OpenAI has a 25MB limit
- Compress your audio or split into smaller chunks
- Use MP3 format (usually smaller than WAV)

### "Module not found: openai"
- Run: `pip install openai`
- Or: `pip install -r requirements.txt`

### Script runs but no output
- Check the output directory (default: `./output/podcast_to_shorts/`)
- Look for error messages in the console
- Verify your API key has credits/quota

---

## 💡 Tips

1. **Start with a short podcast** (10-30 minutes) to test
2. **Review the transcript** before generating Shorts
3. **Edit the scripts** to match your voice/style
4. **Use the titles** as inspiration, customize as needed
5. **Save your API key** securely - don't share it!

---

## 📞 Support

For issues or questions:
- Check the troubleshooting section above
- Review OpenAI API documentation
- Contact support: [Your Email Here]

---

## 📄 License

See license file included with this product.

---

## 🎯 Next Steps

1. ✅ Install requirements
2. ✅ Set up API key
3. ✅ Run script with your podcast
4. ✅ Review generated content
5. ✅ Create videos using the scripts
6. ✅ Upload to YouTube!

---

**Ready to transform your podcasts into YouTube Shorts!** 🚀
