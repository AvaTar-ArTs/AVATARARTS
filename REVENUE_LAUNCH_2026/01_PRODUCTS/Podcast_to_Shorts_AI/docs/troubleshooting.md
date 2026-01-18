# 🔧 Troubleshooting Guide

**Common issues and solutions**

---

## ❌ Installation Issues

### Problem: "Python not found"

**Symptoms:**
```bash
$ python --version
bash: python: command not found
```

**Solutions:**

1. **Check if Python 3 is installed:**
   ```bash
   python3 --version
   ```

2. **Install Python:**
   - Download from [python.org](https://www.python.org/downloads/)
   - Make sure to check "Add Python to PATH"

3. **Use python3 command:**
   ```bash
   python3 podcast_to_shorts_ai_FIXED.py --audio podcast.mp3
   ```

---

### Problem: "pip not found"

**Symptoms:**
```bash
$ pip install openai
bash: pip: command not found
```

**Solutions:**

1. **Use python -m pip:**
   ```bash
   python -m pip install openai
   ```

2. **Install pip:**
   ```bash
   python -m ensurepip --upgrade
   ```

3. **Use python3:**
   ```bash
   python3 -m pip install openai
   ```

---

### Problem: "Module not found: openai"

**Symptoms:**
```bash
ModuleNotFoundError: No module named 'openai'
```

**Solutions:**

1. **Install openai:**
   ```bash
   pip install openai
   ```

2. **Check installation:**
   ```bash
   python -c "import openai; print(openai.__version__)"
   ```

3. **Reinstall if needed:**
   ```bash
   pip uninstall openai
   pip install openai
   ```

---

## 🔑 API Key Issues

### Problem: "OpenAI API key not found"

**Symptoms:**
```
❌ ERROR: OpenAI API key not found!
```

**Solutions:**

1. **Check if key is set:**
   ```bash
   echo $OPENAI_API_KEY  # Mac/Linux
   echo %OPENAI_API_KEY%  # Windows
   ```

2. **Set the key:**
   ```bash
   export OPENAI_API_KEY='sk-your-key-here'  # Mac/Linux
   set OPENAI_API_KEY=sk-your-key-here      # Windows
   ```

3. **Use .env file:**
   ```bash
   echo "OPENAI_API_KEY=sk-your-key-here" > .env
   ```

4. **Verify key format:**
   - Should start with `sk-`
   - Should be 51+ characters
   - No spaces or quotes in the key itself

---

### Problem: "Invalid API key"

**Symptoms:**
```
Error: Invalid API key provided
```

**Solutions:**

1. **Verify key is correct:**
   - Check for typos
   - Ensure no extra spaces
   - Copy key directly from OpenAI dashboard

2. **Check key permissions:**
   - Key must have API access enabled
   - Check OpenAI dashboard for key status

3. **Generate new key:**
   - Go to [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
   - Create new key
   - Update your configuration

---

### Problem: "Insufficient quota"

**Symptoms:**
```
Error: You exceeded your current quota
```

**Solutions:**

1. **Check OpenAI usage:**
   - Visit [platform.openai.com/usage](https://platform.openai.com/usage)
   - Check current usage and limits

2. **Add payment method:**
   - Go to [platform.openai.com/account/billing](https://platform.openai.com/account/billing)
   - Add payment method to increase quota

3. **Wait for quota reset:**
   - Free tier resets monthly
   - Paid tier has higher limits

---

## 📁 File Issues

### Problem: "Audio file not found"

**Symptoms:**
```
❌ Error: Audio file not found: podcast.mp3
```

**Solutions:**

1. **Check file path:**
   ```bash
   ls -la podcast.mp3  # Mac/Linux
   dir podcast.mp3     # Windows
   ```

2. **Use absolute path:**
   ```bash
   python podcast_to_shorts_ai_FIXED.py \
     --audio /full/path/to/podcast.mp3
   ```

3. **Check current directory:**
   ```bash
   pwd  # Mac/Linux
   cd   # Windows
   ```

---

### Problem: "File too large"

**Symptoms:**
```
⚠️  Warning: File size (30.5MB) exceeds 25MB limit.
```

**Solutions:**

1. **Compress audio:**
   ```bash
   # Using ffmpeg
   ffmpeg -i large_file.mp3 -b:a 128k compressed.mp3
   ```

2. **Split into chunks:**
   ```bash
   # Split 60-minute podcast into 2x 30-minute files
   ffmpeg -i podcast.mp3 -ss 00:00:00 -t 00:30:00 part1.mp3
   ffmpeg -i podcast.mp3 -ss 00:30:00 -t 00:30:00 part2.mp3
   ```

3. **Convert format:**
   - MP3 is usually smaller than WAV
   - Use lower bitrate if quality allows

---

### Problem: "Unsupported file format"

**Symptoms:**
```
Error: Unsupported audio format
```

**Solutions:**

1. **Convert to supported format:**
   ```bash
   # Convert to MP3
   ffmpeg -i input.m4a output.mp3
   ```

2. **Supported formats:**
   - MP3 ✅
   - WAV ✅
   - M4A ✅
   - FLAC (may need conversion)

---

## ⚙️ Runtime Issues

### Problem: "Script runs but no output"

**Symptoms:**
- Script completes but no files created
- No error messages

**Solutions:**

1. **Check output directory:**
   ```bash
   ls -la output/podcast_to_shorts/
   ```

2. **Check for errors:**
   - Look for warning messages
   - Check API key has credits
   - Verify audio file is valid

3. **Run with verbose output:**
   - Check console for detailed messages
   - Look for API errors

---

### Problem: "Slow processing"

**Symptoms:**
- Script takes very long to complete
- Hangs during processing

**Solutions:**

1. **Check API status:**
   - Visit [status.openai.com](https://status.openai.com/)
   - Check for service issues

2. **Reduce file size:**
   - Use shorter audio files
   - Compress audio

3. **Check internet connection:**
   - API calls require internet
   - Slow connection = slow processing

---

### Problem: "Empty output files"

**Symptoms:**
- Files created but empty
- JSON files have no content

**Solutions:**

1. **Check API key:**
   - Verify key is valid
   - Check key has credits

2. **Check audio file:**
   - Verify file is not corrupted
   - Try with different audio file

3. **Check console output:**
   - Look for error messages
   - Check API response errors

---

## 🐛 Code Issues

### Problem: "Syntax error"

**Symptoms:**
```
SyntaxError: invalid syntax
```

**Solutions:**

1. **Check Python version:**
   ```bash
   python --version  # Should be 3.8+
   ```

2. **Verify file integrity:**
   - Re-download script
   - Check for file corruption

3. **Check for modifications:**
   - If you modified the script, check syntax
   - Use Python syntax checker

---

### Problem: "Import errors"

**Symptoms:**
```
ImportError: cannot import name 'PodcastToShortsAI'
```

**Solutions:**

1. **Check file location:**
   - Ensure script is in correct directory
   - Check file name matches

2. **Check Python path:**
   ```bash
   python -c "import sys; print(sys.path)"
   ```

---

## 📊 Output Issues

### Problem: "Poor quality transcripts"

**Symptoms:**
- Transcript has many errors
- Missing words or phrases

**Solutions:**

1. **Check audio quality:**
   - Use high-quality audio
   - Reduce background noise
   - Ensure clear speech

2. **Check audio format:**
   - Use standard formats (MP3, WAV)
   - Avoid heavily compressed audio

3. **Try different audio:**
   - Test with known good audio
   - Compare results

---

### Problem: "Key moments not relevant"

**Symptoms:**
- Extracted moments don't make good Shorts
- Moments are too long/short

**Solutions:**

1. **Adjust max_shorts:**
   ```bash
   --max-shorts 10  # Get more options
   ```

2. **Review and edit:**
   - Manually review key moments
   - Edit JSON files if needed

3. **Customize prompts:**
   - Modify extraction prompts in script
   - Adjust for your content type

---

## 🆘 Still Having Issues?

### Get Help

1. **Check documentation:**
   - [Installation Guide](./installation.md)
   - [Testing Guide](./testing.md)
   - [Configuration Guide](./configuration.md)

2. **Check OpenAI status:**
   - [status.openai.com](https://status.openai.com/)

3. **Review error messages:**
   - Copy full error message
   - Search for error online
   - Check OpenAI API docs

4. **Contact support:**
   - Email: [your-support-email]
   - Include error messages
   - Include system information

---

## 📋 Diagnostic Checklist

Run these to diagnose issues:

```bash
# 1. Check Python
python --version

# 2. Check OpenAI package
python -c "import openai; print(openai.__version__)"

# 3. Check API key
python -c "import os; print('Key set:', bool(os.getenv('OPENAI_API_KEY')))"

# 4. Test script
python podcast_to_shorts_ai_FIXED.py --help

# 5. Check file
ls -la podcast.mp3  # Mac/Linux
dir podcast.mp3     # Windows
```

---

**Most issues are resolved by checking these!** ✅
