# 🚀 Setup Instructions - Podcast to Shorts AI

**Welcome!** This guide will help you set up and use the Podcast to Shorts AI tool.

---

## ⚡ Quick Setup (5 minutes)

### Step 1: Install Python (if needed)
- Download from: https://www.python.org/downloads/
- Make sure to check "Add Python to PATH" during installation
- Verify: Open terminal/command prompt and type `python --version` (should show 3.8+)

### Step 2: Install Required Package
```bash
pip install openai
```

Or use the requirements file:
```bash
pip install -r requirements.txt
```

### Step 3: Get Your OpenAI API Key
1. Go to: https://platform.openai.com/api-keys
2. Sign up or log in
3. Click "Create new secret key"
4. Copy the key (starts with `sk-`)
5. **Important:** Save it securely - you won't see it again!

### Step 4: Set Up Your API Key

**Choose the easiest method for you:**

#### Option 0: Copy the Template (Recommended)
This folder includes `env.template` (safe example). Copy it to `.env`, then paste your key:

```bash
cp env.template .env
```

#### Option A: Environment Variable (Recommended)
**Mac/Linux:**
```bash
export OPENAI_API_KEY='sk-your-key-here'
```

**Windows (Command Prompt):**
```cmd
set OPENAI_API_KEY=sk-your-key-here
```

**Windows (PowerShell):**
```powershell
$env:OPENAI_API_KEY="sk-your-key-here"
```

#### Option B: .env File (Easiest for beginners)
1. Copy `env.template` to `.env`:
   ```bash
   cp env.template .env
   ```

2. Open `.env` in a text editor

3. Replace `sk-your-key-here` with your actual key:
   ```
   OPENAI_API_KEY=sk-your-actual-key-here
   ```

4. Save the file

**That's it!** The script will automatically find your key.

### Step 5: Test It!
```bash
python podcast_to_shorts_ai_FIXED.py --help
```

If you see the help text, you're ready to go! 🎉

---

## 🎬 Using the Tool

### Basic Usage
```bash
python podcast_to_shorts_ai_FIXED.py --audio your_podcast.mp3
```

### What Happens:
1. ✅ Script transcribes your podcast
2. ✅ AI finds the 5 best moments
3. ✅ Generates Shorts scripts
4. ✅ Creates catchy titles
5. ✅ Writes descriptions with hashtags

### Output Files:
All files are saved in `./output/podcast_to_shorts/`:
- `{podcast_name}_transcript.txt` - Full transcript
- `{podcast_name}_key_moments.json` - Best moments
- `{podcast_name}_shorts_scripts.json` - Ready-to-use scripts
- `{podcast_name}_complete_results.json` - Everything in one file

---

## 💡 Tips

1. **Start small:** Test with a 10-15 minute podcast first
2. **Review output:** Check the transcript and scripts before creating videos
3. **Customize:** Edit the generated scripts to match your style
4. **Save your key:** Keep your API key secure and don't share it

---

## ❓ Troubleshooting

### "OpenAI API key not found"
- Make sure you set the key using one of the methods above
- Check that the key is correct (starts with `sk-`)
- Try the `.env` file method - it's the easiest!

### "File too large"
- OpenAI has a 25MB limit
- Try compressing your audio or using MP3 format
- Split long podcasts into smaller chunks

### "Module not found"
- Run: `pip install openai`
- Make sure Python is installed correctly

---

## 📞 Need Help?

- Check the README.md for more details
- Review OpenAI's documentation
- Contact support if needed

---

**You're all set! Start creating YouTube Shorts from your podcasts!** 🚀
