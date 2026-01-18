# ❓ Frequently Asked Questions

**Common questions and answers**

---

## 🚀 Getting Started

### Q: How long does it take to set up?

**A:** 5-10 minutes for basic setup:
1. Install Python (if needed): 2-5 minutes
2. Install dependencies: 1 minute
3. Set API key: 1 minute
4. Test: 2-3 minutes

**Total:** ~10 minutes

---

### Q: Do I need coding experience?

**A:** No! The tool is designed for non-technical users:
- Simple command-line interface
- Clear error messages
- Step-by-step documentation
- No coding required

---

### Q: What do I need to get started?

**A:** Just three things:
1. **Python 3.8+** (free - download from python.org)
2. **OpenAI API key** (get at openai.com - free credits available)
3. **Audio file** (MP3, WAV, or M4A)

---

## 💰 Pricing & Costs

### Q: How much does it cost?

**A:** The tool itself is a one-time purchase. You also need:
- **OpenAI API credits** (pay-as-you-go)
- **Estimated cost:** $0.10-0.50 per podcast episode
- **Free tier available:** $5 free credits from OpenAI

---

### Q: How much does OpenAI API cost?

**A:** OpenAI pricing:
- **Whisper (transcription):** $0.006 per minute
- **GPT-4o-mini (analysis):** ~$0.01-0.05 per episode
- **30-minute podcast:** ~$0.20-0.30 total

**Very affordable!**

---

### Q: Can I use free OpenAI credits?

**A:** Yes! New OpenAI accounts get $5 free credits:
- Enough for ~15-20 podcast episodes
- No credit card required initially
- Great for testing

---

## 🎯 Usage

### Q: How long does processing take?

**A:** Depends on podcast length:
- **10-minute podcast:** 2-3 minutes
- **30-minute podcast:** 5-7 minutes
- **60-minute podcast:** 10-15 minutes

**Most podcasts process in under 10 minutes!**

---

### Q: What file formats are supported?

**A:** Supported formats:
- ✅ MP3 (recommended)
- ✅ WAV
- ✅ M4A
- ⚠️ Other formats may need conversion

**File size limit:** 25MB

---

### Q: How many Shorts can I generate?

**A:** Default is 5, but you can specify:
- **Minimum:** 1
- **Maximum:** 20+ (limited by podcast length)
- **Recommended:** 5-10

**Use `--max-shorts` to customize**

---

### Q: Can I process multiple files at once?

**A:** Yes! Use a batch script:
```bash
for file in *.mp3; do
    python podcast_to_shorts_ai_FIXED.py --audio "$file"
done
```

**See [Examples](./examples.md) for more**

---

## 📊 Output

### Q: What do I get as output?

**A:** Four files:
1. **Transcript** - Full text with timestamps
2. **Key Moments** - 5 best moments identified
3. **Scripts** - Ready-to-use Shorts scripts
4. **Complete Results** - Everything in one JSON file

---

### Q: Can I customize the output?

**A:** Yes! Multiple ways:
1. **Edit JSON files** after generation
2. **Modify the script** to change prompts
3. **Adjust settings** via command-line options
4. **Edit scripts** to match your voice

---

### Q: Are the scripts ready to use?

**A:** Yes! But we recommend:
1. **Review** the scripts first
2. **Customize** to match your style
3. **Edit** for accuracy
4. **Add** your personal touch

**They're 90% ready - just add your voice!**

---

## 🔧 Technical

### Q: Do I need internet connection?

**A:** Yes, for API calls:
- Transcription uses OpenAI Whisper API
- Analysis uses GPT-4o-mini API
- All processing happens in the cloud

**No internet = no processing**

---

### Q: Is my data secure?

**A:** Yes:
- Audio files processed by OpenAI
- OpenAI has strict privacy policies
- You can review OpenAI's data usage policy
- No data stored permanently by default

**See OpenAI's privacy policy for details**

---

### Q: Can I run this offline?

**A:** No, the tool requires:
- Internet connection for API calls
- OpenAI API access
- Active API key

**Offline processing not supported**

---

### Q: What Python version do I need?

**A:** Python 3.8 or higher:
- **Check version:** `python --version`
- **Download:** python.org/downloads
- **Most systems:** Already have Python installed

---

## 🎬 Content Creation

### Q: Will this work for my podcast?

**A:** Works best for:
- ✅ Interview podcasts
- ✅ Educational content
- ✅ Storytelling podcasts
- ✅ Conversational podcasts
- ⚠️ Music-heavy podcasts (may need editing)

**Most podcast types work well!**

---

### Q: How accurate is the transcription?

**A:** Very accurate:
- **OpenAI Whisper:** State-of-the-art accuracy
- **Typical accuracy:** 95%+ for clear audio
- **Depends on:** Audio quality, accents, background noise

**Review and edit if needed**

---

### Q: Can I edit the generated content?

**A:** Absolutely! Recommended workflow:
1. Generate content with tool
2. Review and edit scripts
3. Customize titles
4. Refine descriptions
5. Create videos

**Use it as a starting point, not final product**

---

## 🆘 Support

### Q: Where can I get help?

**A:** Multiple resources:
1. **Documentation:** This site
2. **Troubleshooting Guide:** [troubleshooting.md](./troubleshooting.md)
3. **Examples:** [examples.md](./examples.md)
4. **Support Email:** [your-email]

---

### Q: What if something doesn't work?

**A:** Follow these steps:
1. Check [Troubleshooting Guide](./troubleshooting.md)
2. Verify installation: [Testing Guide](./testing.md)
3. Check OpenAI status: status.openai.com
4. Contact support with error messages

---

## 🔄 Updates & Maintenance

### Q: Will I get updates?

**A:** Depends on your purchase:
- **One-time purchase:** May include updates
- **Check purchase terms** for update policy
- **Major updates:** May require new purchase

---

### Q: How do I update the tool?

**A:** If updates are available:
1. Download new version
2. Backup your customizations
3. Replace old files
4. Test with sample audio

**Always backup first!**

---

## 💡 Tips & Best Practices

### Q: Any tips for best results?

**A:** Yes! Best practices:
1. **Use high-quality audio** - Better transcription
2. **Start with short episodes** - Faster testing
3. **Review transcript first** - Ensure accuracy
4. **Customize scripts** - Add your voice
5. **Batch process** - Save time

---

### Q: How can I save API costs?

**A:** Cost-saving tips:
1. **Compress audio** - Smaller files = lower costs
2. **Process during off-peak** - May have better rates
3. **Review before processing** - Don't process bad audio
4. **Use free credits** - Test with OpenAI's free tier

---

## 📚 More Questions?

- [Installation Guide](./installation.md)
- [Testing Guide](./testing.md)
- [Configuration Guide](./configuration.md)
- [Examples](./examples.md)
- [Troubleshooting](./troubleshooting.md)

**Can't find your answer?** Contact support!

---

**Have more questions?** We're here to help! 🚀
