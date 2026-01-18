# ⚙️ Configuration Guide

**Customize Podcast to Shorts AI to your needs**

---

## 📋 Configuration Options

### Command-Line Arguments

#### Required Arguments

**`--audio` or `-a`**
- **Description:** Path to podcast audio file
- **Format:** MP3, WAV, M4A
- **Size Limit:** 25MB
- **Example:**
  ```bash
  python podcast_to_shorts_ai_FIXED.py --audio podcast.mp3
  ```

#### Optional Arguments

**`--output` or `-o`**
- **Description:** Custom output directory
- **Default:** `./output/podcast_to_shorts/`
- **Example:**
  ```bash
  python podcast_to_shorts_ai_FIXED.py --audio podcast.mp3 --output ./my_shorts
  ```

**`--max-shorts` or `-m`**
- **Description:** Maximum number of Shorts to generate
- **Default:** 5
- **Range:** 1-20 (recommended)
- **Example:**
  ```bash
  python podcast_to_shorts_ai_FIXED.py --audio podcast.mp3 --max-shorts 10
  ```

---

## 🔑 Environment Variables

### OPENAI_API_KEY

**Required:** Yes  
**Description:** Your OpenAI API key

**Set Methods:**

1. **Environment Variable:**
   ```bash
   export OPENAI_API_KEY='sk-your-key-here'
   ```

2. **`.env` File (Current Directory):**
   ```
   OPENAI_API_KEY=sk-your-key-here
   ```

3. **`.env` File (Home Directory):**
   ```
   ~/.env
   OPENAI_API_KEY=sk-your-key-here
   ```

**Priority Order:**
1. Environment variable
2. `.env` in current directory
3. `.env` in home directory

---

## 📁 Output Configuration

### Default Output Structure

```
output/
└── podcast_to_shorts/
    ├── {podcast_name}_transcript.txt
    ├── {podcast_name}_key_moments.json
    ├── {podcast_name}_shorts_scripts.json
    └── {podcast_name}_complete_results.json
```

### Custom Output Directory

```bash
python podcast_to_shorts_ai_FIXED.py \
  --audio podcast.mp3 \
  --output /path/to/custom/output
```

**Result:**
```
/path/to/custom/output/
├── {podcast_name}_transcript.txt
├── {podcast_name}_key_moments.json
├── {podcast_name}_shorts_scripts.json
└── {podcast_name}_complete_results.json
```

---

## 🎛️ Advanced Configuration

### Modify Script Behavior

**To customize the tool, edit `podcast_to_shorts_ai_FIXED.py`:**

#### Change Default Output Directory

**Find:**
```python
self.output_dir = Path.cwd() / "output" / "podcast_to_shorts"
```

**Change to:**
```python
self.output_dir = Path.home() / "Documents" / "podcast_shorts"
```

#### Change Default Number of Shorts

**Find:**
```python
default=5
```

**Change to:**
```python
default=10
```

#### Customize AI Models

**Find:**
```python
model="gpt-4o-mini"
```

**Change to:**
```python
model="gpt-4"  # More powerful but more expensive
```

**Or:**
```python
model="gpt-3.5-turbo"  # Faster and cheaper
```

#### Adjust Temperature

**Find:**
```python
temperature=0.7
```

**Change to:**
```python
temperature=0.9  # More creative
# or
temperature=0.5  # More focused
```

---

## 📝 Prompt Customization

### Customize Key Moment Extraction

**Find the `extract_key_moments` method and modify the prompt:**

```python
prompt = f"""Analyze this podcast transcript and identify the {max_moments} most engaging, shareable moments that would work well as YouTube Shorts.

For each moment, provide:
1. Start timestamp (estimated, in MM:SS format)
2. End timestamp (estimated, in MM:SS format)
3. Key quote or summary (max 50 words)
4. Why it's engaging (hook, emotion, value)
5. Suggested Shorts title

Transcript:
{transcript_sample}

Format as JSON with a "moments" array. Each moment should have: start_time, end_time, quote, engagement_reason, suggested_title"""
```

**Add your custom requirements:**
- Focus on specific topics
- Prefer certain types of moments
- Adjust length requirements

---

### Customize Script Generation

**Find the `generate_shorts_scripts` method and modify:**

```python
prompt = f"""Create a YouTube Shorts script (15-60 seconds) based on this key moment:

Quote: {moment.get('quote', '')}
Engagement Reason: {moment.get('engagement_reason', '')}

Requirements:
- Hook in first 3 seconds
- Clear value proposition
- Call to action
- Optimized for 15-60 second format
- Engaging and shareable

Provide:
1. Hook (first 3 seconds)
2. Main content (15-50 seconds)
3. CTA (last 3 seconds)
4. Suggested visuals/imagery
5. Hashtags (5-10 relevant)"""
```

**Customize:**
- Script length
- Style preferences
- CTA requirements
- Hashtag count

---

## 🔧 Configuration Examples

### Example 1: Batch Processing

**Create a script:**
```bash
#!/bin/bash
for file in podcasts/*.mp3; do
    python podcast_to_shorts_ai_FIXED.py \
      --audio "$file" \
      --output "./output/$(basename "$file" .mp3)"
done
```

### Example 2: High Volume Processing

```bash
python podcast_to_shorts_ai_FIXED.py \
  --audio long_podcast.mp3 \
  --max-shorts 20 \
  --output ./high_volume_output
```

### Example 3: Organized Output

```bash
python podcast_to_shorts_ai_FIXED.py \
  --audio podcast.mp3 \
  --output "./shorts/$(date +%Y-%m-%d)"
```

---

## 📊 Configuration Checklist

- [ ] API key configured
- [ ] Output directory set (if custom)
- [ ] Number of Shorts set (if custom)
- [ ] Script behavior customized (if needed)
- [ ] Prompts customized (if needed)

---

## 🎯 Best Practices

1. **Use `.env` file** for API key (most secure)
2. **Organize output** by date or project
3. **Start with defaults** then customize
4. **Test changes** before processing many files
5. **Backup customizations** if you modify the script

---

## ❓ Configuration FAQ

**Q: Can I change the output format?**  
A: Yes, modify the script to output different formats (CSV, Markdown, etc.)

**Q: Can I use different AI models?**  
A: Yes, change the `model` parameter (may affect cost/quality)

**Q: Can I process multiple files at once?**  
A: Yes, use a bash script or Python loop

**Q: Can I customize the prompts?**  
A: Yes, edit the prompt strings in the script

---

## 🆘 Need Help?

- [Installation Guide](./installation.md)
- [Usage Examples](./examples.md)
- [Troubleshooting](./troubleshooting.md)
- [API Reference](./api-reference.md)

---

**Configuration complete! Ready to customize!** ⚙️
