# ⚡ Quick Start Guide

**Get up and running in 5 minutes!**

---

## 🎯 Goal

Convert your first podcast episode into YouTube Shorts in under 5 minutes.

---

## 📋 Prerequisites

- ✅ Python 3.8+ installed
- ✅ OpenAI API key ready
- ✅ Audio file ready (MP3, WAV, or M4A)

---

## 🚀 3-Step Quick Start

### Step 1: Install (1 minute)

```bash
pip install openai
```

### Step 2: Set API Key (1 minute)

**Mac/Linux:**
```bash
export OPENAI_API_KEY='sk-your-key-here'
```

**Windows:**
```cmd
set OPENAI_API_KEY=sk-your-key-here
```

**Or create `.env` file:**
```bash
echo "OPENAI_API_KEY=sk-your-key-here" > .env
```

### Step 3: Run! (3 minutes)

```bash
python podcast_to_shorts_ai_FIXED.py --audio your_podcast.mp3
```

**That's it!** 🎉

---

## 📊 What You Get

After running, check the `output/podcast_to_shorts/` folder:

1. **`{podcast_name}_transcript.txt`**
   - Full transcription
   - Ready to review

2. **`{podcast_name}_key_moments.json`**
   - 5 best moments identified
   - Timestamps and quotes

3. **`{podcast_name}_shorts_scripts.json`**
   - 5 ready-to-use scripts
   - Hooks, content, CTAs

4. **`{podcast_name}_complete_results.json`**
   - Everything in one file
   - Easy to process

---

## 🎬 Example Output

```
🎬 Processing Podcast: my_podcast.mp3
================================================================================
📝 Transcribing: my_podcast.mp3
✅ Transcript saved: output/podcast_to_shorts/my_podcast_transcript.txt
🔍 Extracting 5 key moments...
✅ Key moments saved: output/podcast_to_shorts/my_podcast_key_moments.json
✍️  Generating Shorts scripts for 5 moments...
   Generating script 1/5...
   Generating script 2/5...
   Generating script 3/5...
   Generating script 4/5...
   Generating script 5/5...
✅ Scripts saved: output/podcast_to_shorts/my_podcast_shorts_scripts.json
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

## 🎯 Next Steps

1. ✅ **Review the output**
   - Check transcript accuracy
   - Review key moments
   - Read generated scripts

2. ✅ **Customize if needed**
   - Edit scripts to match your voice
   - Adjust titles
   - Refine descriptions

3. ✅ **Create videos**
   - Use scripts to create Shorts
   - Add visuals
   - Edit to 15-60 seconds

4. ✅ **Upload to YouTube**
   - Use generated titles
   - Use generated descriptions
   - Add hashtags

---

## 💡 Pro Tips

1. **Start with short podcasts** (10-15 min) for faster testing
2. **Review transcript first** to ensure accuracy
3. **Customize scripts** to match your style
4. **Save API key securely** - don't share it
5. **Batch process** multiple episodes

---

## ❓ Common Questions

**Q: How long does it take?**  
A: 3-5 minutes for a 30-minute podcast

**Q: What file formats work?**  
A: MP3, WAV, M4A (up to 25MB)

**Q: How many Shorts can I generate?**  
A: Default is 5, but you can specify more with `--max-shorts`

**Q: Can I customize the output?**  
A: Yes! Edit the JSON files or modify the scripts

---

## 🆘 Need Help?

- [Installation Issues?](./installation.md)
- [Testing Problems?](./testing.md)
- [More Examples?](./examples.md)
- [Troubleshooting?](./troubleshooting.md)

---

**Ready to create your first Shorts?** 🚀

**Next:** [Usage Examples](./examples.md) → [Configuration](./configuration.md) → [API Reference](./api-reference.md)
