# 📦 Installation Guide

**Estimated Time:** 5-10 minutes  
**Difficulty:** Beginner-friendly

---

## 📋 Prerequisites Checklist

Before installing, make sure you have:

- [ ] Python 3.8 or higher installed
- [ ] Internet connection
- [ ] OpenAI API key (get at [openai.com](https://platform.openai.com/api-keys))
- [ ] Terminal/Command Prompt access

---

## 🔍 Step 1: Verify Python Installation

### Check Python Version

**Mac/Linux:**
```bash
python3 --version
```

**Windows:**
```bash
python --version
```

**Expected Output:**
```
Python 3.8.0
```
(or any version 3.8 or higher)

### If Python is Not Installed

**Download Python:**
1. Go to [python.org/downloads](https://www.python.org/downloads/)
2. Download latest version (3.8+)
3. Run installer
4. **Important:** Check "Add Python to PATH" during installation

**Verify Installation:**
```bash
python --version
```

---

## 📥 Step 2: Download the Tool

### Option A: From Gumroad (Recommended)

1. Purchase/download from Gumroad
2. Extract the ZIP file
3. Navigate to the folder:
   ```bash
   cd path/to/podcast-to-shorts-ai
   ```

### Option B: From GitHub (If Available)

```bash
git clone https://github.com/yourusername/podcast-to-shorts-ai.git
cd podcast-to-shorts-ai
```

---

## 🔧 Step 3: Install Dependencies

### Method 1: Using requirements.txt (Recommended)

```bash
pip install -r requirements.txt
```

### Method 2: Manual Installation

```bash
pip install openai
```

### Verify Installation

```bash
python -c "import openai; print('OpenAI installed successfully')"
```

**Expected Output:**
```
OpenAI installed successfully
```

---

## 🔑 Step 4: Set Up OpenAI API Key

You need an OpenAI API key to use this tool. Get one at: [platform.openai.com/api-keys](https://platform.openai.com/api-keys)

### Method 1: Environment Variable (Recommended)

**Mac/Linux:**
```bash
export OPENAI_API_KEY='sk-your-actual-api-key-here'
```

**Windows (Command Prompt):**
```cmd
set OPENAI_API_KEY=sk-your-actual-api-key-here
```

**Windows (PowerShell):**
```powershell
$env:OPENAI_API_KEY="sk-your-actual-api-key-here"
```

**Make it Permanent (Mac/Linux):**
Add to `~/.bashrc` or `~/.zshrc`:
```bash
echo 'export OPENAI_API_KEY="sk-your-key-here"' >> ~/.bashrc
source ~/.bashrc
```

**Make it Permanent (Windows):**
Add to System Environment Variables:
1. Search "Environment Variables" in Windows
2. Add new variable: `OPENAI_API_KEY`
3. Value: `sk-your-key-here`

### Method 2: .env File (Easiest for Beginners)

1. Copy the example file:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` in a text editor

3. Replace `your-api-key-here` with your actual key:
   ```
   OPENAI_API_KEY=sk-your-actual-api-key-here
   ```

4. Save the file

**The script will automatically find your key!**

### Verify API Key

```bash
python -c "import os; print('API Key:', os.getenv('OPENAI_API_KEY', 'Not found')[:10] + '...')"
```

**Expected Output:**
```
API Key: sk-xxxxx...
```

---

## ✅ Step 5: Verify Installation

### Test the Script

```bash
python podcast_to_shorts_ai_FIXED.py --help
```

**Expected Output:**
```
usage: podcast_to_shorts_ai_FIXED.py [-h] --audio AUDIO [--output OUTPUT] [--max-shorts MAX_SHORTS]

Podcast to Shorts AI - Convert podcasts to YouTube Shorts automatically

options:
  -h, --help            show this help message and exit
  --audio AUDIO, -a AUDIO
                        Path to podcast audio file (MP3, WAV, M4A)
  --output OUTPUT, -o OUTPUT
                        Output directory for generated content
  --max-shorts MAX_SHORTS, -m MAX_SHORTS
                        Maximum number of Shorts to generate (default: 5)
```

**If you see this, installation is successful! ✅**

---

## 🧪 Step 6: Test with Sample Audio (Optional)

If you have a test audio file:

```bash
python podcast_to_shorts_ai_FIXED.py --audio test_podcast.mp3
```

**Expected Output:**
```
🎬 Processing Podcast: test_podcast.mp3
================================================================================
📝 Transcribing: test_podcast.mp3
✅ Transcript saved: output/podcast_to_shorts/test_podcast_transcript.txt
🔍 Extracting 5 key moments...
✅ Key moments saved: output/podcast_to_shorts/test_podcast_key_moments.json
✍️  Generating Shorts scripts for 5 moments...
✅ Scripts saved: output/podcast_to_shorts/test_podcast_shorts_scripts.json
...
✅ PODCAST TO SHORTS PROCESSING COMPLETE!
```

---

## 🎯 Installation Complete!

You're ready to use Podcast to Shorts AI!

**Next Steps:**
1. ✅ Installation complete
2. → [Quick Start Guide](./quick-start.md) - Run your first conversion
3. → [Testing Guide](./testing.md) - Verify everything works
4. → [Usage Examples](./examples.md) - See real examples

---

## ❓ Troubleshooting Installation

### "Python not found"
- Make sure Python is installed
- Check PATH environment variable
- Try `python3` instead of `python`

### "pip not found"
- Install pip: `python -m ensurepip --upgrade`
- Or use `python3 -m pip install`

### "Module not found: openai"
- Run: `pip install openai`
- Or: `pip install -r requirements.txt`

### "OpenAI API key not found"
- Verify key is set correctly
- Check for typos
- Try the `.env` file method

### Still having issues?
→ See [Troubleshooting Guide](./troubleshooting.md)

---

## 📚 Additional Resources

- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Python Installation Guide](https://www.python.org/about/gettingstarted/)
- [Environment Variables Guide](https://www.twilio.com/blog/environment-variables-python)

---

**Installation complete! Ready to create YouTube Shorts!** 🚀
