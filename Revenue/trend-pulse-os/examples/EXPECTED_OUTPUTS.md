# Expected Outputs

This document shows examples of the output files and console output you can expect when running the Trend Pulse OS examples.

## 📊 Console Output Examples

### Example 1: Basic Analysis Output

```
============================================================
Example 1: Basic Trend Analysis
============================================================

Step 1: Loading trends from CSV...
✓ Loaded 5 trends

Step 2: Scoring a single trend...
Trend: AI Video Generator
  Growth: 6700
  Difficulty: 2
  Intent: creator
  Score: 89.5

Step 3: Scoring all trends...
✓ Scored 5 trends

Step 4: Top 5 Scored Trends:
------------------------------------------------------------
1. AI Video Generator
   Score: 89.50 | Growth: 6700 | Difficulty: 2 | Intent: creator
2. AI Image Enhancer
   Score: 89.50 | Growth: 9000 | Difficulty: 2 | Intent: creator
3. AI Personal Assistant
   Score: 89.50 | Growth: 2600 | Difficulty: 3 | Intent: productivity
4. AI for Teachers
   Score: 89.50 | Growth: 7600 | Difficulty: 2 | Intent: education
5. AI Mini PC
   Score: 89.50 | Growth: 7300 | Difficulty: 3 | Intent: hardware

Step 5: Comparing scores with and without AEO:
------------------------------------------------------------
Trend: AI Video Generator
  Score with AEO: 89.50
  Score without AEO: 100.00
  Difference: -10.50

============================================================
Example 1 Complete!
============================================================
```

---

### Example 5: Complete Pipeline Output

```
======================================================================
Example 5: Complete Analysis Pipeline
======================================================================

STEP 1: Loading Trends
----------------------------------------------------------------------
✓ Loaded 5 trends from data/trends_sample.csv

STEP 2: Scoring Trends
----------------------------------------------------------------------
✓ Scored 5 trends
  Score range: 89.50 - 89.50
  Average score: 89.50

STEP 3: Filtering High-Scoring Trends
----------------------------------------------------------------------
✓ Found 5 high-scoring trends (score >= 70)
  Top 5:
    1. AI Video Generator: 89.50
    2. AI Image Enhancer: 89.50
    3. AI Personal Assistant: 89.50
    4. AI for Teachers: 89.50
    5. AI Mini PC: 89.50

STEP 4: Clustering by Intent
----------------------------------------------------------------------
✓ Created 4 intent clusters
  creator: 2 trends (avg score: 89.50)
  productivity: 1 trends (avg score: 89.50)
  education: 1 trends (avg score: 89.50)
  hardware: 1 trends (avg score: 89.50)

STEP 5: Top Clusters
----------------------------------------------------------------------
✓ Top 3 clusters:
  CREATOR: 2 trends
  PRODUCTIVITY: 1 trends
  EDUCATION: 1 trends

STEP 6: Generating Video Ideas
----------------------------------------------------------------------
✓ Generated 5 video ideas
  Sample ideas:
    1. How to Use AI Video Generator in 2026: Complete Guide
       Estimated Views: 50K-100K
    2. How to Use AI Image Enhancer in 2026: Complete Guide
       Estimated Views: 50K-100K
    3. How to Use AI Personal Assistant in 2026: Complete Guide
       Estimated Views: 50K-100K

STEP 7: Exporting Results
----------------------------------------------------------------------
✓ Exported all scored trends to: examples/output/all_scored_trends.csv
✓ Exported high-scoring trends to: examples/output/high_score_trends.csv
✓ Exported clusters to: examples/output/clusters.json
✓ Exported video ideas to: examples/output/video_ideas.json

======================================================================
PIPELINE SUMMARY
======================================================================
Total trends analyzed: 5
High-scoring trends (≥70): 5
Intent clusters created: 4
Video ideas generated: 5
Output files created: 4

Output Directory: examples/output/
======================================================================
Complete Pipeline Finished!
======================================================================
```

---

## 📄 Output File Formats

### CSV Output: Scored Trends

**File**: `all_scored_trends.csv`

```csv
keyword,growth,difficulty,intent,score
AI Video Generator,6700,2,creator,89.5
AI Image Enhancer,9000,2,creator,89.5
AI Personal Assistant,2600,3,productivity,89.5
AI for Teachers,7600,2,education,89.5
AI Mini PC,7300,3,hardware,89.5
```

**Fields**:
- `keyword`: The trending keyword/topic
- `growth`: Growth metric (search volume, etc.)
- `difficulty`: Difficulty score (1-10)
- `intent`: Category/intent
- `score`: Calculated trend score (0-100)

---

### CSV Output: High-Scoring Trends

**File**: `high_score_trends.csv`

Same format as `all_scored_trends.csv`, but only contains trends with scores above the threshold (default: ≥70).

---

### JSON Output: Video Ideas

**File**: `video_ideas.json`

```json
[
  {
    "title": "How to Use AI Video Generator in 2026: Complete Guide",
    "hook": "AI Video Generator just exploded — here's why everyone's using it",
    "description": "Learn everything about AI Video Generator in this comprehensive tutorial.",
    "tags": [
      "AI Video Generator",
      "tutorial",
      "how-to",
      "guide"
    ],
    "style": "tutorial",
    "trend_score": 89.5,
    "intent": "creator",
    "generated_at": "2026-01-13T12:00:00.000000",
    "estimated_views": "50K-100K",
    "target_audience": "Content Creators"
  },
  {
    "title": "How to Use AI Image Enhancer in 2026: Complete Guide",
    "hook": "AI Image Enhancer just exploded — here's why everyone's using it",
    "description": "Learn everything about AI Image Enhancer in this comprehensive tutorial.",
    "tags": [
      "AI Image Enhancer",
      "tutorial",
      "how-to",
      "guide"
    ],
    "style": "tutorial",
    "trend_score": 89.5,
    "intent": "creator",
    "generated_at": "2026-01-13T12:00:00.000001",
    "estimated_views": "50K-100K",
    "target_audience": "Content Creators"
  }
]
```

**Fields**:
- `title`: Generated video title
- `hook`: Attention-grabbing opening line
- `description`: Video description
- `tags`: SEO tags for the video
- `style`: Video style used (tutorial, review, comparison, news)
- `trend_score`: Original trend score
- `intent`: Trend intent category
- `generated_at`: ISO timestamp
- `estimated_views`: Estimated view range based on score
- `target_audience`: Target audience for the video

---

### JSON Output: Clusters

**File**: `clusters.json`

```json
[
  {
    "cluster_name": "creator",
    "trend_count": 2,
    "average_score": 89.5,
    "trends": [
      {
        "keyword": "AI Video Generator",
        "growth": "6700",
        "difficulty": "2",
        "intent": "creator",
        "score": 89.5
      },
      {
        "keyword": "AI Image Enhancer",
        "growth": "9000",
        "difficulty": "2",
        "intent": "creator",
        "score": 89.5
      }
    ]
  },
  {
    "cluster_name": "productivity",
    "trend_count": 1,
    "average_score": 89.5,
    "trends": [
      {
        "keyword": "AI Personal Assistant",
        "growth": "2600",
        "difficulty": "3",
        "intent": "productivity",
        "score": 89.5
      }
    ]
  }
]
```

**Structure**:
- Array of cluster objects
- Each cluster contains:
  - `cluster_name`: Name/category of the cluster
  - `trend_count`: Number of trends in cluster
  - `average_score`: Average score of trends in cluster
  - `trends`: Array of trend objects in the cluster

---

## 📈 Understanding Scores

### Score Ranges

| Score Range | Meaning | Recommendation |
|-------------|---------|----------------|
| **90-100** | Exceptional opportunity | High priority - excellent growth/difficulty ratio, AEO-friendly |
| **70-89** | Great opportunity | High priority - strong potential |
| **50-69** | Good opportunity | Medium priority - worth considering |
| **Below 50** | Lower priority | Review carefully before investing |

### Score Factors

Trend scores are calculated using:
- **Growth/Difficulty Ratio**: Base score from growth divided by difficulty
- **AEO Compatibility**: Bonus for Answer Engine Optimization (question keywords, long-tail, etc.)
- **Time Decay** (optional): Reduces score for older trends

---

## 🎯 Video Style Outputs

### Tutorial Style

```
Title: How to Use [Keyword] in 2026: Complete Guide
Hook: [Keyword] just exploded — here's why everyone's using it
Description: Learn everything about [Keyword] in this comprehensive tutorial.
Tags: [Keyword], tutorial, how-to, guide
```

### Review Style

```
Title: [Keyword] Review: Is It Worth It?
Hook: I tested [Keyword] so you don't have to
Description: Honest review of [Keyword] based on real testing.
Tags: [Keyword], review, test, honest
```

### Comparison Style

```
Title: [Keyword] vs Alternatives: Which is Best?
Hook: I compared [Keyword] with top alternatives — here's the winner
Description: Detailed comparison of [Keyword] with competing solutions.
Tags: [Keyword], comparison, vs, alternatives
```

### News Style

```
Title: [Keyword]: The Trend Everyone's Talking About
Hook: [Keyword] is trending — here's what you need to know
Description: Breaking down the [Keyword] trend and what it means.
Tags: [Keyword], news, trending, update
```

---

## 📊 Expected View Estimates

Based on trend scores:

| Score Range | Estimated Views |
|-------------|----------------|
| ≥ 90 | 100K+ |
| 70-89 | 50K-100K |
| 50-69 | 10K-50K |
| < 50 | 1K-10K |

---

## 🔍 Filtering Output Examples

### Growth Filter (min_growth=7000)

```
Filter 1: Trends with growth >= 7000
------------------------------------------------------------
Found 3 trends:
  - AI Image Enhancer: growth=9000
  - AI for Teachers: growth=7600
  - AI Mini PC: growth=7300
```

### Difficulty Filter (max_difficulty=2)

```
Filter 2: Easy trends (difficulty <= 2)
------------------------------------------------------------
Found 4 trends:
  - AI Video Generator: difficulty=2
  - AI Image Enhancer: difficulty=2
  - AI for Teachers: difficulty=2
  - ...
```

### Intent Filter (intent='creator')

```
Filter 3: Creator intent trends
------------------------------------------------------------
Found 2 trends:
  - AI Video Generator: intent=creator
  - AI Image Enhancer: intent=creator
```

---

## 🎨 Clustering Output Examples

### Intent Clustering

```
Cluster 1: By Intent
------------------------------------------------------------
Found 4 intent clusters:

  CREATOR (2 trends):
    - AI Video Generator (score: 89.50)
    - AI Image Enhancer (score: 89.50)

  PRODUCTIVITY (1 trends):
    - AI Personal Assistant (score: 89.50)

  EDUCATION (1 trends):
    - AI for Teachers (score: 89.50)
```

### Score Clustering

```
Cluster 2: By Score Ranges
------------------------------------------------------------
Found 5 score clusters:

  Score 89-89 (5 trends):
    - AI Video Generator: 89.50
    - AI Image Enhancer: 89.50
    ...
```

---

## 💡 Tips for Interpreting Outputs

1. **Score Values**: Higher scores indicate better opportunities (high growth, low difficulty, AEO-friendly)

2. **Filtering Results**: Use filters to narrow down to trends matching your specific criteria

3. **Cluster Analysis**: Clusters help identify trends that can be grouped together for content strategies

4. **Video Ideas**: Generated ideas are templates - customize them for your brand and audience

5. **Export Files**: Use exported CSV/JSON files for further analysis in spreadsheet tools or other scripts

---

**Note**: Actual output values may vary based on:
- Input data (your trend CSV/JSON)
- Scoring parameters (AEO enabled/disabled, time decay)
- Filter criteria
- Date/time of execution

For reproducible results, use the same input data and parameters.
