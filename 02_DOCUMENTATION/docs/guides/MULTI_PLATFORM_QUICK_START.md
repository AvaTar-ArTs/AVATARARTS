# 🌐 MULTI-PLATFORM CONTENT EXTRACTION - QUICK START
## Extract, Analyze, and Generate Content from Multiple Platforms

---

## ⚡ QUICK COMMANDS

### Extract from Ideogram.ai

```bash
python ~/pythons/multi_platform_content_extractor.py \
  --ideogram "https://ideogram.ai/t/trending" \
  --max-scrolls 100 \
  --max-downloads 200 \
  --output ~/extracted_content \
  --format both
```

**Output:**
- CSV with all metadata
- JSON with structured data
- Images/videos ready for use

### Extract from Suno

```bash
python ~/pythons/multi_platform_content_extractor.py \
  --suno "https://suno.com/discover" \
  --max-scrolls 100 \
  --output ~/extracted_content \
  --format both
```

**Output:**
- CSV with song metadata
- JSON with lyrics and audio URLs
- Ready for music management system

### Extract from Both

```bash
python ~/pythons/multi_platform_content_extractor.py \
  --ideogram "https://ideogram.ai/t/trending" \
  --suno "https://suno.com/discover" \
  --max-scrolls 100 \
  --output ~/extracted_content \
  --format both
```

---

## 🎯 INTEGRATION EXAMPLES

### 1. Extract + Generate YouTube Content

```python
from multi_platform_content_extractor import MultiPlatformContentExtractor
from hot_trending_content_engine import HotTrendingContentEngine

# Extract
extractor = MultiPlatformContentExtractor()
ideogram_assets = extractor.extract_ideogram("https://ideogram.ai/t/trending")

# Generate YouTube package
engine = HotTrendingContentEngine()
trends = engine.discover_hot_trends(niche="ai art, digital art")
package = engine.generate_trending_content(trends[0])

# Use extracted assets
package.thumbnail_concept = ideogram_assets[0].prompt_or_alt
```

### 2. Extract + Analyze Content

```python
from multi_platform_content_extractor import MultiPlatformContentExtractor

extractor = MultiPlatformContentExtractor()
assets = extractor.extract_ideogram(url)

# Analyze each asset
for asset in assets:
    analysis = extractor.analyze_content(asset)
    print(f"Tags: {analysis.tags}")
    print(f"SEO Keywords: {analysis.seo_keywords}")
    print(f"Category: {analysis.content_category}")
    print(f"Suggested Use: {analysis.suggested_use}")
```

### 3. Extract + Export for Integration

```python
from multi_platform_content_extractor import MultiPlatformContentExtractor

extractor = MultiPlatformContentExtractor()

# Extract
ideogram_assets = extractor.extract_ideogram(url)
suno_songs = extractor.extract_suno(url)

# Export
extractor.export_csv(Path("~/extracted_content"), ideogram_assets)
extractor.export_json(Path("~/extracted_content"), suno_songs)

# Now use CSV/JSON with other systems
```

---

## 📊 WHAT GETS EXTRACTED

### Ideogram.ai Assets

**Metadata:**
- Generation ID and frame index
- Prompt/alt text
- Image/video URLs
- Dimensions and aspect ratio
- Likes and badges
- Page URL and timestamps

**Use Cases:**
- Art gallery integration
- Print-on-demand
- YouTube thumbnails
- Social media content

### Suno Songs

**Metadata:**
- Song ID and title
- Author and author link
- Audio URL (direct download)
- Image URL (thumbnail)
- Lyrics (if available)
- Summary and tags
- Duration and metadata

**Use Cases:**
- Music management system
- YouTube background music
- Music licensing
- Content creation

---

## 🔗 CONNECT TO EXISTING SYSTEMS

### Art Gallery (30,780 images)

```python
# Extract new images
ideogram_assets = extractor.extract_ideogram(url)

# Analyze and tag
for asset in ideogram_assets:
    analysis = extractor.analyze_content(asset)
    # Add to art gallery with tags
    add_to_gallery(asset, analysis.tags, analysis.seo_keywords)
```

### Music Management (1,331 audio files)

```python
# Extract new songs
suno_songs = extractor.extract_suno(url)

# Analyze and classify
for song in suno_songs:
    analysis = extractor.analyze_content(song)
    # Add to music system
    add_to_music_system(song, analysis.tags, analysis.content_category)
```

### YouTube Content Factory

```python
# Extract assets
ideogram_assets = extractor.extract_ideogram(trending_url)
suno_songs = extractor.extract_suno(music_url)

# Generate YouTube package
engine = HotTrendingContentEngine()
package = engine.generate_trending_content(trend)

# Use extracted content
package.thumbnail_concept = ideogram_assets[0].prompt_or_alt
package.background_music = suno_songs[0].audio_url
```

---

## 🚨 TROUBLESHOOTING

### Browser Issues

**Error:** Chrome driver not found

**Fix:**
```bash
# macOS
brew install chromedriver

# Or download from chromedriver.chromium.org
```

### Extraction Issues

**Error:** No assets found

**Fix:**
- Check URL is correct
- Increase `--max-scrolls`
- Check if site structure changed
- Try non-headless mode: remove `--headless`

### Export Issues

**Error:** Permission denied

**Fix:**
```bash
chmod +x ~/pythons/multi_platform_content_extractor.py
mkdir -p ~/extracted_content
```

---

## 📈 EXPECTED RESULTS

### Ideogram.ai Extraction

**Per 100 scrolls:**
- 50-200 images extracted
- Rich metadata captured
- CSV/JSON exported
- Ready for integration

### Suno Extraction

**Per 100 scrolls:**
- 20-50 songs extracted
- Lyrics captured (if available)
- Audio URLs ready
- Metadata complete

### Content Analysis

**Per asset:**
- 5-10 tags extracted
- SEO keywords identified
- Category assigned
- Use cases suggested

---

## 🎯 BEST PRACTICES

1. **Start Small:** Test with `--max-scrolls 10` first
2. **Check Output:** Verify CSV/JSON before large extractions
3. **Respect Rate Limits:** Don't extract too aggressively
4. **Save Progress:** Export frequently during long extractions
5. **Analyze Content:** Use content-aware analysis for better results

---

## 🔄 AUTOMATION

### Daily Extraction

```bash
# Add to cron
0 9 * * * cd ~/pythons && python multi_platform_content_extractor.py \
  --ideogram "https://ideogram.ai/t/trending" \
  --max-scrolls 50 \
  --output ~/extracted_content \
  --format both >> ~/extraction_log.txt 2>&1
```

### Weekly Analysis

```bash
# Analyze extracted content
python ~/pythons/multi_platform_content_extractor.py \
  --analyze ~/extracted_content \
  --output ~/analysis_reports
```

---

**Start extracting content now. Integrate with your systems. Scale your content factory.** 🚀

