# 📖 Usage Examples

**Real-world examples and use cases**

---

## 🎯 Basic Examples

### Example 1: Simple Conversion

**Convert a single podcast episode:**

```bash
python podcast_to_shorts_ai_FIXED.py --audio episode_001.mp3
```

**Output:**
- 5 YouTube Shorts scripts
- 5 title sets
- 5 descriptions
- Full transcript

---

### Example 2: Custom Output Directory

**Save output to specific folder:**

```bash
python podcast_to_shorts_ai_FIXED.py \
  --audio episode_001.mp3 \
  --output ./youtube_shorts/episode_001
```

**Result:**
```
youtube_shorts/episode_001/
├── episode_001_transcript.txt
├── episode_001_key_moments.json
├── episode_001_shorts_scripts.json
└── episode_001_complete_results.json
```

---

### Example 3: Generate More Shorts

**Extract 10 key moments instead of 5:**

```bash
python podcast_to_shorts_ai_FIXED.py \
  --audio long_episode.mp3 \
  --max-shorts 10
```

**Use case:** Long-form podcasts (60+ minutes)

---

## 🔄 Advanced Examples

### Example 4: Batch Processing

**Process multiple episodes:**

```bash
#!/bin/bash
for file in podcasts/*.mp3; do
    echo "Processing: $file"
    python podcast_to_shorts_ai_FIXED.py \
      --audio "$file" \
      --output "./output/$(basename "$file" .mp3)"
done
```

**Save as:** `batch_process.sh`  
**Run:** `bash batch_process.sh`

---

### Example 5: Python Integration

**Use in your own Python script:**

```python
from pathlib import Path
from podcast_to_shorts_ai_FIXED import PodcastToShortsAI

# Initialize
processor = PodcastToShortsAI(output_dir=Path("./custom_output"))

# Process podcast
results = processor.process_podcast(
    audio_file=Path("podcast.mp3"),
    max_shorts=5
)

# Access results
print(f"Generated {len(results['shorts_scripts'])} scripts")
print(f"Output directory: {results['output_dir']}")
```

---

### Example 6: Automated Workflow

**Combine with video creation:**

```bash
#!/bin/bash

# 1. Generate Shorts content
python podcast_to_shorts_ai_FIXED.py --audio podcast.mp3

# 2. Process each script
for i in {1..5}; do
    script_file="output/podcast_to_shorts/podcast_shorts_scripts.json"
    # Use script to create video
    # (your video creation tool here)
done

# 3. Upload to YouTube
# (your upload script here)
```

---

## 📊 Output Examples

### Transcript Output

**File:** `{podcast_name}_transcript.txt`

```
[00:00:00] Welcome to today's podcast episode.

[00:00:15] Today we're talking about AI automation.

[00:01:30] The key insight is that automation saves time.

...
```

---

### Key Moments Output

**File:** `{podcast_name}_key_moments.json`

```json
{
  "moments": [
    {
      "start_time": "00:05:30",
      "end_time": "00:06:15",
      "quote": "The most important thing is to start small and iterate.",
      "engagement_reason": "Actionable advice with personal story",
      "suggested_title": "Start Small: The Key to Success"
    },
    {
      "start_time": "00:12:45",
      "end_time": "00:13:30",
      "quote": "I made $10,000 in my first month using this strategy.",
      "engagement_reason": "Specific number creates curiosity",
      "suggested_title": "How I Made $10K in 30 Days"
    }
  ]
}
```

---

### Scripts Output

**File:** `{podcast_name}_shorts_scripts.json`

```json
{
  "moment_number": 1,
  "original_moment": {
    "start_time": "00:05:30",
    "end_time": "00:06:15",
    "quote": "The most important thing is to start small and iterate."
  },
  "script": "Hook: Want to know the secret to success?\n\nMain: The most important thing is to start small and iterate. Don't try to do everything at once. Pick one thing, master it, then move to the next.\n\nCTA: Follow for more tips!\n\nHashtags: #success #productivity #tips",
  "duration_estimate": "30-60 seconds"
}
```

---

## 🎬 Real-World Use Cases

### Use Case 1: Weekly Podcast

**Scenario:** Weekly 60-minute podcast  
**Goal:** 5 Shorts per episode  
**Workflow:**

```bash
# Every Monday
python podcast_to_shorts_ai_FIXED.py \
  --audio weekly_episode_$(date +%Y%m%d).mp3 \
  --output ./shorts/week_$(date +%U)
```

**Result:** 5 Shorts ready for the week

---

### Use Case 2: Interview Podcast

**Scenario:** Interview-based podcast  
**Goal:** Extract best quotes  
**Workflow:**

```bash
# Generate 10 Shorts from interview
python podcast_to_shorts_ai_FIXED.py \
  --audio interview_guest_name.mp3 \
  --max-shorts 10 \
  --output ./interviews/guest_name
```

**Result:** 10 quote-worthy moments

---

### Use Case 3: Educational Series

**Scenario:** Educational content  
**Goal:** Break down into digestible Shorts  
**Workflow:**

```bash
# Process entire series
for episode in series_*.mp3; do
    python podcast_to_shorts_ai_FIXED.py \
      --audio "$episode" \
      --max-shorts 8 \
      --output "./series/$(basename "$episode" .mp3)"
done
```

**Result:** Multiple Shorts per educational topic

---

## 💡 Tips & Best Practices

1. **Start with short episodes** (10-15 min) for testing
2. **Review transcript first** to ensure accuracy
3. **Customize scripts** to match your voice
4. **Batch process** similar content together
5. **Organize output** by date or topic
6. **Save API costs** by processing during off-peak hours

---

## 🔗 Integration Examples

### With Video Editing Tools

```python
import json
from pathlib import Path

# Load generated scripts
with open('output/podcast_to_shorts/podcast_shorts_scripts.json') as f:
    scripts = json.load(f)

# Use with video editing API
for script in scripts:
    create_video(
        script=script['script'],
        title=script['original_moment']['suggested_title']
    )
```

### With YouTube API

```python
import json
from googleapiclient.discovery import build

# Load results
with open('output/podcast_to_shorts/podcast_complete_results.json') as f:
    results = json.load(f)

# Upload to YouTube
youtube = build('youtube', 'v3', credentials=creds)

for i, script in enumerate(results['shorts_scripts']):
    upload_video(
        title=results['titles'][i]['recommended'],
        description=results['descriptions'][i]['description'],
        script=script['script']
    )
```

---

## 📚 More Examples

- [Configuration Examples](./configuration.md#configuration-examples)
- [API Reference](./api-reference.md)
- [Troubleshooting](./troubleshooting.md)

---

**Ready to try these examples?** 🚀
