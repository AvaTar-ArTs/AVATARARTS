# AI Content Repurposing Expansion Pack

**Turn long-form content into Shorts, Reels, TikToks.**

Transform your long-form videos, blog posts, and podcasts into engaging short-form content across multiple platforms.

## 🎯 What This Pack Includes

- **Python Automation Workflows**: Complete repurposing pipeline
- **AEO-First Prompt Templates**: Optimized for Answer Engine Optimization
- **Multi-Platform Support**: YouTube Shorts, Instagram Reels, TikTok
- **Export-Ready Structures**: JSON/CSV export capabilities
- **Comprehensive Documentation**: Step-by-step execution guides

## 👥 Target Audience

Content creators, marketers, and operators who want to:
- Maximize content ROI by repurposing
- Create platform-specific short-form content
- Automate content adaptation workflows
- Scale content production efficiently

## 🚀 Quick Start

```python
from workflows.workflow import run, process_trends_from_file

# Process a single keyword
result = run('AI Video Generator')

# Access platform-specific content
print(result['shorts'])    # YouTube Shorts
print(result['reels'])     # Instagram Reels
print(result['tik_toks'])  # TikTok videos

# Process multiple trends from file
results = process_trends_from_file('trends.csv', 'output.json')
```

## 📋 Workflow Structure

The Content Repurposing workflow creates:

1. **Repurposing Strategy**: Analyzes content and creates plan
2. **Platform-Specific Content**: Adapts for each platform
3. **Hook Generation**: Creates compelling openings
4. **Hashtag Optimization**: Suggests trending tags

## 🔧 Usage Example

```python
from workflows.workflow import run

# Execute workflow with custom config
result = run('AI Video Generator', config={
    'source_type': 'long_form_video',
    'target_platforms': ['youtube_shorts', 'instagram_reels']
})

# Get Shorts content
for short in result['shorts']:
    print(f"Title: {short['title']}")
    print(f"Hook: {short['hook']}")
    print(f"Hashtags: {short['hashtags']}")
```

## 📊 Output Format

Workflows generate structured output including:
- Repurposing strategy
- Platform-specific content (Shorts, Reels, TikTok)
- Hooks, captions, and hashtags
- Content calendar suggestions

## 🎨 Content Types Supported

- Long-form videos → Short clips
- Blog posts → Video scripts
- Podcasts → Short-form videos
- Webinars → Reels/Shorts
- Tutorials → Quick tips

## 🔗 Integration

This pack integrates with:
- `trend-pulse-os` core modules
- Video editing tools
- Social media schedulers
- Analytics platforms

## 📅 Created

2026-01-13

## 📄 License

See main project license.
