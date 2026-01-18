# Trend Pulse OS - Step-by-Step User Guide

**Complete guide to using Trend Pulse OS for trend analysis, scoring, and workflow generation.**

---

## Table of Contents

1. [Prerequisites & Installation](#prerequisites--installation)
2. [Getting Started](#getting-started)
3. [Step 1: Loading Trend Data](#step-1-loading-trend-data)
4. [Step 2: Scoring Trends](#step-2-scoring-trends)
5. [Step 3: Filtering Trends](#step-3-filtering-trends)
6. [Step 4: Clustering Keywords](#step-4-clustering-keywords)
7. [Step 5: Exporting Results](#step-5-exporting-results)
8. [Step 6: Using Workflows](#step-6-using-workflows)
9. [Complete Examples](#complete-examples)
10. [Troubleshooting](#troubleshooting)

---

## Prerequisites & Installation

### Requirements

- Python 3.8 or higher
- pip (Python package manager)

### Step 1: Navigate to Project Directory

```bash
cd /Users/steven/AVATARARTS/Revenue/trend-pulse-os
```

### Step 2: Install Dependencies

```bash
pip install -r requirements.txt
```

This will install:
- `python-dateutil` (required)
- Other dependencies as needed

### Step 3: Verify Installation

Open Python and test the import:

```python
python3
```

```python
from trend_pulse_os import load_trends, score_trend
print("Installation successful!")
```

---

## Getting Started

Trend Pulse OS follows a simple workflow:

1. **Load** trend data from CSV or JSON
2. **Score** trends to identify opportunities
3. **Filter** trends based on your criteria
4. **Cluster** keywords by intent or similarity
5. **Export** results for further analysis
6. **Generate** workflows from top trends

---

## Step 1: Loading Trend Data

### Understanding the Data Format

Trend data should be in CSV or JSON format with at least a `keyword` field. Recommended fields:

- `keyword` (required): The trending keyword or topic
- `growth`: Growth metric (e.g., search volume increase)
- `difficulty`: Difficulty score (1-10, where 1 is easiest)
- `intent`: Category (e.g., "creator", "education", "productivity")

### Example CSV Format

Create a file `my_trends.csv`:

```csv
keyword,growth,difficulty,intent
AI Video Generator,6700,2,creator
AI Image Enhancer,9000,2,creator
AI Personal Assistant,2600,3,productivity
AI for Teachers,7600,2,education
```

### Loading from CSV

```python
from trend_pulse_os import load_trends

# Load trends from CSV file
trends = load_trends('data/trends_sample.csv')

# View loaded trends
print(f"Loaded {len(trends)} trends")
for trend in trends[:3]:
    print(f"- {trend['keyword']}: growth={trend.get('growth')}, intent={trend.get('intent')}")
```

### Loading from JSON

Create a JSON file `my_trends.json`:

```json
[
  {
    "keyword": "AI Video Generator",
    "growth": 6700,
    "difficulty": 2,
    "intent": "creator"
  },
  {
    "keyword": "AI Image Enhancer",
    "growth": 9000,
    "difficulty": 2,
    "intent": "creator"
  }
]
```

```python
trends = load_trends('my_trends.json')
```

### Using Sample Data

The project includes sample data you can use:

```python
# Use the included sample data
trends = load_trends('data/trends_sample.csv')
```

---

## Step 2: Scoring Trends

Scoring helps you identify the most valuable trends by combining growth, difficulty, and AEO compatibility.

### Basic Scoring

```python
from trend_pulse_os import score_trend

# Score a single trend
trend = trends[0]
score = score_trend(trend)
print(f"{trend['keyword']}: Score = {score}")
```

### Scoring with AEO Optimization

AEO (Answer Engine Optimization) boosts scores for keywords optimized for answer engines:

```python
# Score with AEO enabled (default)
score = score_trend(trend, include_aeo=True)

# Score without AEO
score = score_trend(trend, include_aeo=False)
```

### Scoring Multiple Trends

Use `score_batch` to score all trends at once:

```python
from trend_pulse_os import score_batch

# Score all trends and get sorted results
scored_trends = score_batch(trends)

# View top 5 scored trends
print("Top 5 Trends:")
for trend in scored_trends[:5]:
    print(f"{trend['keyword']}: {trend['score']}")
```

### Understanding Scores

- **90-100**: Exceptional opportunity (high growth, low difficulty, AEO-friendly)
- **70-89**: Great opportunity
- **50-69**: Good opportunity
- **Below 50**: Lower priority

---

## Step 3: Filtering Trends

Filter trends to focus on specific criteria.

### Filter by Minimum Growth

```python
from trend_pulse_os import filter_trends

# Get trends with growth >= 5000
high_growth = filter_trends(trends, min_growth=5000)
print(f"Found {len(high_growth)} high-growth trends")
```

### Filter by Maximum Difficulty

```python
# Get easy trends (difficulty <= 2)
easy_trends = filter_trends(trends, max_difficulty=2)
print(f"Found {len(easy_trends)} easy trends")
```

### Filter by Intent

```python
# Get trends for creators
creator_trends = filter_trends(trends, intent='creator')
print(f"Found {len(creator_trends)} creator trends")
```

### Combining Filters

```python
# High-growth, easy, creator trends
best_trends = filter_trends(
    trends,
    min_growth=5000,
    max_difficulty=2,
    intent='creator'
)
print(f"Found {len(best_trends)} optimal trends")
```

### Filtering Scored Trends

```python
# First score, then filter
scored_trends = score_batch(trends)
high_scoring = [t for t in scored_trends if t['score'] >= 70]
```

---

## Step 4: Clustering Keywords

Clustering groups related trends together for better analysis.

### Cluster by Intent

```python
from trend_pulse_os import cluster_keywords, get_top_clusters

# Cluster trends by intent category
clusters = cluster_keywords(trends, method='intent')

# View clusters
for intent, cluster_trends in clusters.items():
    print(f"\n{intent.upper()} ({len(cluster_trends)} trends):")
    for trend in cluster_trends:
        print(f"  - {trend['keyword']}")
```

### Cluster by Score

```python
# First score the trends
scored_trends = score_batch(trends)

# Cluster by score ranges (default: 5 bins)
score_clusters = cluster_keywords(scored_trends, method='score')

# View score-based clusters
for score_range, cluster_trends in score_clusters.items():
    print(f"\nScore {score_range} ({len(cluster_trends)} trends)")
```

### Cluster by Similarity

```python
# Cluster by keyword similarity
similarity_clusters = cluster_keywords(trends, method='similarity')

# Get top 5 largest clusters
top_clusters = get_top_clusters(similarity_clusters, top_n=5)
```

### Working with Clusters

```python
# Get the largest cluster
creator_cluster = clusters.get('creator', [])
print(f"Creator cluster has {len(creator_cluster)} trends")

# Score a specific cluster
scored_cluster = score_batch(creator_cluster)
top_creator_trend = scored_cluster[0]
print(f"Top creator trend: {top_creator_trend['keyword']}")
```

---

## Step 5: Exporting Results

Export your analyzed trends to CSV or JSON for further use.

### Export to CSV

```python
from trend_pulse_os import export_csv, score_batch

# Score trends first
scored_trends = score_batch(trends)

# Export to CSV
export_csv(scored_trends, 'output/scored_trends.csv')
print("Exported to scored_trends.csv")
```

### Export to JSON

```python
from trend_pulse_os import export_json

# Export to JSON
export_json(scored_trends, 'output/scored_trends.json')
print("Exported to scored_trends.json")
```

### Export Clusters

```python
from trend_pulse_os import cluster_keywords, export_json

# Cluster and export
clusters = cluster_keywords(trends, method='intent')

# Convert clusters to list format for export
cluster_list = [
    {
        'cluster_name': name,
        'trends': trends_list,
        'count': len(trends_list)
    }
    for name, trends_list in clusters.items()
]

export_json(cluster_list, 'output/clusters.json')
```

### Custom Field Selection

```python
# Export only specific fields
export_csv(
    scored_trends,
    'output/top_trends.csv',
    fieldnames=['keyword', 'score', 'intent']
)
```

---

## Step 6: Using Workflows

Workflows generate actionable content from trends.

### AI Video Generator Workflow

Generate video ideas from trends:

```python
from workflows.ai_video_generator import generate_video_ideas, generate_batch_ideas

# Get a high-scoring trend
scored_trends = score_batch(trends)
top_trend = scored_trends[0]

# Generate video idea
video_idea = generate_video_ideas(top_trend, style='tutorial')
print(f"Title: {video_idea['title']}")
print(f"Hook: {video_idea['hook']}")
print(f"Estimated Views: {video_idea['estimated_views']}")
```

### Video Styles

Available styles:
- `'tutorial'`: How-to guides
- `'news'`: Breaking news format
- `'review'`: Product/service reviews
- `'comparison'`: Comparison videos

```python
# Generate different styles
tutorial_idea = generate_video_ideas(trend, style='tutorial')
review_idea = generate_video_ideas(trend, style='review')
comparison_idea = generate_video_ideas(trend, style='comparison')
```

### Batch Video Idea Generation

```python
# Generate ideas for multiple trends
top_5_trends = scored_trends[:5]
video_ideas = generate_batch_ideas(top_5_trends, style='tutorial')

for idea in video_ideas:
    print(f"\n{idea['title']}")
    print(f"  Target Audience: {idea['target_audience']}")
```

### Other Workflows

```python
# AI Image Enhancer workflow
from workflows.ai_image_enhancer import *

# AI Personal Assistant workflow
from workflows.ai_personal_assistant import *

# AI for Teachers workflow
from workflows.ai_for_teachers import *
```

---

## Complete Examples

### Example 1: Basic Analysis Pipeline

Complete workflow from loading to exporting:

```python
from trend_pulse_os import (
    load_trends,
    score_batch,
    filter_trends,
    export_csv
)

# 1. Load trends
trends = load_trends('data/trends_sample.csv')

# 2. Score all trends
scored_trends = score_batch(trends, include_aeo=True)

# 3. Filter for high-scoring trends
top_trends = [t for t in scored_trends if t['score'] >= 70]

# 4. Export results
export_csv(top_trends, 'output/top_trends.csv')

print(f"Analyzed {len(trends)} trends")
print(f"Found {len(top_trends)} high-scoring trends")
```

### Example 2: Creator-Focused Analysis

Focus on creator trends:

```python
from trend_pulse_os import (
    load_trends,
    filter_trends,
    score_batch,
    cluster_keywords,
    export_json
)

# Load and filter
trends = load_trends('data/trends_sample.csv')
creator_trends = filter_trends(trends, intent='creator', min_growth=5000)

# Score
scored_creator = score_batch(creator_trends)

# Cluster by similarity
clusters = cluster_keywords(scored_creator, method='similarity')

# Export
export_json(scored_creator, 'output/creator_trends.json')

print(f"Found {len(scored_creator)} creator trends")
```

### Example 3: Video Content Generation

Generate video ideas from top trends:

```python
from trend_pulse_os import load_trends, score_batch
from workflows.ai_video_generator import generate_batch_ideas
from trend_pulse_os import export_json

# Load and score
trends = load_trends('data/trends_sample.csv')
scored_trends = score_batch(trends)

# Get top 10
top_10 = scored_trends[:10]

# Generate video ideas
video_ideas = generate_batch_ideas(top_10, style='tutorial')

# Export ideas
export_json(video_ideas, 'output/video_ideas.json')

print(f"Generated {len(video_ideas)} video ideas")
for idea in video_ideas[:3]:
    print(f"\n{idea['title']}")
    print(f"  Views: {idea['estimated_views']}")
```

### Example 4: Comprehensive Analysis Report

Complete analysis with multiple outputs:

```python
from trend_pulse_os import (
    load_trends,
    score_batch,
    filter_trends,
    cluster_keywords,
    get_top_clusters,
    export_csv,
    export_json
)

# Load data
trends = load_trends('data/trends_sample.csv')

# Score everything
scored_trends = score_batch(trends, include_aeo=True)

# Filter high-scoring
high_score = [t for t in scored_trends if t['score'] >= 70]

# Cluster by intent
clusters = cluster_keywords(scored_trends, method='intent')
top_clusters = get_top_clusters(clusters, top_n=3)

# Export multiple files
export_csv(scored_trends, 'output/all_scored_trends.csv')
export_csv(high_score, 'output/high_score_trends.csv')
export_json(list(top_clusters.items()), 'output/top_clusters.json')

# Print summary
print("=" * 50)
print("ANALYSIS SUMMARY")
print("=" * 50)
print(f"Total trends analyzed: {len(trends)}")
print(f"High-scoring trends (≥70): {len(high_score)}")
print(f"Top clusters: {len(top_clusters)}")
print(f"\nTop 3 trends:")
for trend in scored_trends[:3]:
    print(f"  {trend['keyword']}: {trend['score']}")
```

---

## Troubleshooting

### Common Issues

#### File Not Found Error

```
FileNotFoundError: Trend data file not found: data/trends.csv
```

**Solution**: Check that the file path is correct. Use absolute paths or ensure you're running from the project directory.

```python
import os
print(os.getcwd())  # Check current directory
trends = load_trends('data/trends_sample.csv')  # Use relative path
```

#### Missing Required Fields

```
ValueError: Error loading trend data
```

**Solution**: Ensure your CSV has at least a `keyword` column. Check for empty rows.

```python
# Validate trends after loading
from trend_pulse_os import validate_trend

trends = load_trends('my_data.csv')
valid_trends = [t for t in trends if validate_trend(t)]
print(f"Valid trends: {len(valid_trends)}/{len(trends)}")
```

#### Type Errors with Growth/Difficulty

**Solution**: Ensure numeric fields are actual numbers in your CSV, or convert them:

```python
# Convert string numbers to floats
for trend in trends:
    if 'growth' in trend:
        trend['growth'] = float(trend['growth'])
    if 'difficulty' in trend:
        trend['difficulty'] = float(trend['difficulty'])
```

#### Empty Export Files

**Solution**: Ensure you have data to export:

```python
if scored_trends:
    export_csv(scored_trends, 'output.csv')
else:
    print("No trends to export")
```

### Getting Help

1. Check the README.md for API documentation
2. Review example code in this guide
3. Check the sample data format in `data/trends_sample.csv`
4. Inspect the source code in the `core/` directory

---

## Next Steps

After mastering the basics:

1. **Explore Workflows**: Check out all workflows in the `workflows/` directory
2. **Custom Scoring**: Modify scoring algorithms in `core/trend_score.py`
3. **New Export Formats**: Extend `core/export_engine.py` for custom formats
4. **Integration**: Connect Trend Pulse OS with your existing tools
5. **Frontend**: Use [trend-pulse-pro](../trend-pulse-pro) for a visual dashboard

---

## Quick Reference

### Essential Imports

```python
from trend_pulse_os import (
    load_trends,           # Load data
    score_trend,           # Score single trend
    score_batch,           # Score multiple trends
    filter_trends,         # Filter trends
    cluster_keywords,      # Cluster trends
    export_csv,            # Export to CSV
    export_json            # Export to JSON
)
```

### Common Patterns

```python
# Load → Score → Filter → Export
trends = load_trends('data.csv')
scored = score_batch(trends)
filtered = filter_trends(scored, min_growth=5000)
export_csv(filtered, 'output.csv')

# Cluster analysis
clusters = cluster_keywords(trends, method='intent')
top_clusters = get_top_clusters(clusters, top_n=5)
```

---

**Happy trend analyzing! 🚀**
