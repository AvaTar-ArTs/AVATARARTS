# 🧪 Testing Guide

**Purpose:** Verify installation and functionality  
**Time:** 10-15 minutes  
**Difficulty:** Beginner-friendly

---

## 📋 Pre-Testing Checklist

Before testing, ensure:

- [ ] Python 3.8+ installed
- [ ] OpenAI package installed
- [ ] API key configured
- [ ] Test audio file ready (optional)
- [ ] Terminal/Command Prompt open

---

## ✅ Test 1: Verify Installation

### Check Python Version

```bash
python --version
```

**Expected:** Python 3.8.0 or higher

### Check OpenAI Package

```bash
python -c "import openai; print(f'OpenAI version: {openai.__version__}')"
```

**Expected:** OpenAI version: 1.x.x

### Check API Key

```bash
python -c "import os; key = os.getenv('OPENAI_API_KEY', ''); print('API Key:', 'Set' if key else 'Not Set', f'({key[:10]}...)' if key else '')"
```

**Expected:** API Key: Set (sk-xxxxx...)

---

## ✅ Test 2: Script Help Command

### Run Help Command

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

Examples:
  # Process a single podcast
  python podcast_to_shorts_ai_FIXED.py --audio podcast.mp3
  
  # Process with custom output directory
  python podcast_to_shorts_ai_FIXED.py --audio podcast.mp3 --output ./shorts_output
  
  # Generate 10 Shorts from one podcast
  python podcast_to_shorts_ai_FIXED.py --audio podcast.mp3 --max-shorts 10
```

**✅ If you see this, the script is working!**

---

## ✅ Test 3: Test with Invalid File

### Test Error Handling

```bash
python podcast_to_shorts_ai_FIXED.py --audio nonexistent.mp3
```

**Expected Output:**
```
❌ Error: Audio file not found: nonexistent.mp3
```

**✅ If you see an error message, error handling works!**

---

## ✅ Test 4: Test with Real Audio File

### Prepare Test Audio

**Requirements:**
- Format: MP3, WAV, or M4A
- Size: Under 25MB
- Duration: 5-30 minutes (for quick testing)

### Run Test

```bash
python podcast_to_shorts_ai_FIXED.py --audio your_test_audio.mp3
```

### Expected Output

```
🎬 Processing Podcast: your_test_audio.mp3
================================================================================
📝 Transcribing: your_test_audio.mp3
✅ Transcript saved: output/podcast_to_shorts/your_test_audio_transcript.txt
🔍 Extracting 5 key moments...
✅ Key moments saved: output/podcast_to_shorts/your_test_audio_key_moments.json
✍️  Generating Shorts scripts for 5 moments...
   Generating script 1/5...
   Generating script 2/5...
   Generating script 3/5...
   Generating script 4/5...
   Generating script 5/5...
✅ Scripts saved: output/podcast_to_shorts/your_test_audio_shorts_scripts.json
📌 Generating titles for 5 Shorts...
📝 Generating descriptions for 5 Shorts...
================================================================================
✅ PODCAST TO SHORTS PROCESSING COMPLETE!
================================================================================

📁 Output Directory: output/podcast_to_shorts
📊 Generated 5 Shorts scripts
📌 Generated 5 title sets
📝 Generated 5 descriptions

💡 Next Steps:
   1. Review scripts in: output/podcast_to_shorts
   2. Use the scripts to create videos
   3. Upload to YouTube with generated titles/descriptions

✅ Complete results saved to: output/podcast_to_shorts
```

---

## ✅ Test 5: Verify Output Files

### Check Output Directory

```bash
ls -la output/podcast_to_shorts/
```

**Expected Files:**
- `{audio_name}_transcript.txt`
- `{audio_name}_key_moments.json`
- `{audio_name}_shorts_scripts.json`
- `{audio_name}_complete_results.json`

### Verify File Contents

**Check Transcript:**
```bash
head -20 output/podcast_to_shorts/{audio_name}_transcript.txt
```

**Expected:** Readable transcript text

**Check Key Moments:**
```bash
cat output/podcast_to_shorts/{audio_name}_key_moments.json
```

**Expected:** JSON with 5 moments, each with:
- `start_time`
- `end_time`
- `quote`
- `engagement_reason`
- `suggested_title`

**Check Scripts:**
```bash
cat output/podcast_to_shorts/{audio_name}_shorts_scripts.json
```

**Expected:** JSON with 5 scripts, each with:
- `moment_number`
- `script`
- `duration_estimate`

---

## ✅ Test 6: Test Custom Options

### Test Custom Output Directory

```bash
python podcast_to_shorts_ai_FIXED.py --audio test.mp3 --output ./custom_output
```

**Verify:**
```bash
ls -la custom_output/
```

**Expected:** Files created in `custom_output/` directory

### Test Custom Number of Shorts

```bash
python podcast_to_shorts_ai_FIXED.py --audio test.mp3 --max-shorts 10
```

**Verify:**
```bash
cat output/podcast_to_shorts/test_key_moments.json | grep -c "start_time"
```

**Expected:** 10 moments (or fewer if podcast is short)

---

## ✅ Test 7: Test API Key Errors

### Test Without API Key

```bash
unset OPENAI_API_KEY  # Mac/Linux
# or
set OPENAI_API_KEY=  # Windows
python podcast_to_shorts_ai_FIXED.py --audio test.mp3
```

**Expected Output:**
```
================================================================================
❌ ERROR: OpenAI API key not found!
================================================================================

📝 To set up your API key, use ONE of these methods:
...
```

**✅ If you see helpful error message, error handling works!**

---

## ✅ Test 8: Test File Size Limits

### Test with Large File (if available)

```bash
python podcast_to_shorts_ai_FIXED.py --audio large_file.mp3
```

**If file > 25MB, expected:**
```
⚠️  Warning: File size (30.5MB) exceeds 25MB limit.
   Consider compressing the audio or splitting into smaller chunks.
```

**✅ If you see warning, file size checking works!**

---

## 📊 Test Results Checklist

After running all tests, verify:

- [ ] ✅ Python version correct
- [ ] ✅ OpenAI package installed
- [ ] ✅ API key configured
- [ ] ✅ Help command works
- [ ] ✅ Error handling works
- [ ] ✅ Real audio processing works
- [ ] ✅ Output files created
- [ ] ✅ Output files contain valid data
- [ ] ✅ Custom options work
- [ ] ✅ API key error handling works
- [ ] ✅ File size checking works

---

## 🎯 Testing Complete!

If all tests pass, your installation is working correctly!

**Next Steps:**
1. ✅ Testing complete
2. → [Quick Start Guide](./quick-start.md) - Start using the tool
3. → [Usage Examples](./examples.md) - See real-world examples
4. → [Configuration Guide](./configuration.md) - Customize settings

---

## ❓ Troubleshooting Tests

### Test fails with "Module not found"
→ Install dependencies: `pip install -r requirements.txt`

### Test fails with "API key not found"
→ Set API key: See [Installation Guide](./installation.md)

### Test fails with "File not found"
→ Check file path is correct
→ Use absolute path if needed

### Output files are empty
→ Check API key has credits
→ Verify audio file is valid
→ Check console for error messages

### Still having issues?
→ See [Troubleshooting Guide](./troubleshooting.md)

---

## 📚 Additional Resources

- [OpenAI API Status](https://status.openai.com/)
- [OpenAI Usage Limits](https://platform.openai.com/docs/guides/rate-limits)
- [Audio Format Support](https://platform.openai.com/docs/guides/speech-to-text)

---

**Testing complete! Ready for production use!** 🚀
