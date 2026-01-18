# Trend Pulse OS - Examples

This directory contains runnable examples demonstrating how to use Trend Pulse OS for trend analysis.

## 📁 Examples Overview

| Example | Description | Key Features |
|---------|-------------|--------------|
| `example_1_basic_analysis.py` | Basic trend loading and scoring | Load data, score trends, view results |
| `example_2_filtering.py` | Filtering trends by criteria | Growth, difficulty, intent filters |
| `example_3_clustering.py` | Clustering trends | Intent, score, and similarity clustering |
| `example_4_workflows.py` | Generating workflows | Video idea generation, multiple styles |
| `example_5_complete_pipeline.py` | End-to-end analysis | Complete workflow from load to export |

## 🚀 Quick Start

### Prerequisites

1. Install dependencies:
   ```bash
   cd /Users/steven/AVATARARTS/Revenue/trend-pulse-os
   pip install -r requirements.txt
   ```

2. Navigate to the project directory:
   ```bash
   cd /Users/steven/AVATARARTS/Revenue/trend-pulse-os
   ```

### Running Examples

Run any example script directly:

```bash
python3 examples/example_1_basic_analysis.py
python3 examples/example_2_filtering.py
python3 examples/example_3_clustering.py
python3 examples/example_4_workflows.py
python3 examples/example_5_complete_pipeline.py
```

Or make them executable and run:

```bash
chmod +x examples/*.py
./examples/example_1_basic_analysis.py
```

## 📋 Example Details

### Example 1: Basic Analysis

**File**: `example_1_basic_analysis.py`

**What it does**:
- Loads trend data from CSV
- Scores individual trends
- Scores batches of trends
- Compares scores with/without AEO

**Run it**:
```bash
python3 examples/example_1_basic_analysis.py
```

**Expected output**:
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

...
```

---

### Example 2: Filtering

**File**: `example_2_filtering.py`

**What it does**:
- Filters trends by minimum growth
- Filters by maximum difficulty
- Filters by intent category
- Combines multiple filters
- Filters scored trends

**Run it**:
```bash
python3 examples/example_2_filtering.py
```

**Key concepts**:
- Single-criterion filtering
- Multi-criterion filtering
- Post-scoring filtering

---

### Example 3: Clustering

**File**: `example_3_clustering.py`

**What it does**:
- Clusters trends by intent
- Clusters by score ranges
- Clusters by similarity
- Gets top clusters
- Analyzes cluster data

**Run it**:
```bash
python3 examples/example_3_clustering.py
```

**Clustering methods**:
- `intent`: Groups by intent category
- `score`: Groups by score ranges
- `similarity`: Groups by keyword similarity

---

### Example 4: Workflows

**File**: `example_4_workflows.py`

**What it does**:
- Generates video ideas from trends
- Uses different video styles (tutorial, review, comparison, news)
- Generates batch ideas
- Shows workflow outputs

**Run it**:
```bash
python3 examples/example_4_workflows.py
```

**Video styles**:
- `tutorial`: How-to guides
- `review`: Product/service reviews
- `comparison`: Comparison videos
- `news`: Breaking news format

---

### Example 5: Complete Pipeline

**File**: `example_5_complete_pipeline.py`

**What it does**:
- Complete end-to-end workflow
- Loads, scores, filters, clusters
- Generates workflows
- Exports results to CSV/JSON

**Run it**:
```bash
python3 examples/example_5_complete_pipeline.py
```

**Output files** (created in `examples/output/`):
- `all_scored_trends.csv`: All trends with scores
- `high_score_trends.csv`: High-scoring trends only
- `clusters.json`: Clustered trends
- `video_ideas.json`: Generated video ideas

---

## 📊 Output Files

When you run `example_5_complete_pipeline.py`, it creates output files in the `examples/output/` directory:

### CSV Output Format

```csv
keyword,growth,difficulty,intent,score
AI Video Generator,6700,2,creator,89.5
AI Image Enhancer,9000,2,creator,89.5
...
```

### JSON Output Format

**Video Ideas** (`video_ideas.json`):
```json
[
  {
    "title": "How to Use AI Video Generator in 2026: Complete Guide",
    "hook": "AI Video Generator just exploded — here's why everyone's using it",
    "description": "Learn everything about AI Video Generator in this comprehensive tutorial.",
    "tags": ["AI Video Generator", "tutorial", "how-to", "guide"],
    "style": "tutorial",
    "trend_score": 89.5,
    "estimated_views": "100K+",
    "target_audience": "Content Creators"
  }
]
```

**Clusters** (`clusters.json`):
```json
[
  {
    "cluster_name": "creator",
    "trend_count": 2,
    "average_score": 89.5,
    "trends": [...]
  }
]
```

---

## 🔧 Customization

### Using Your Own Data

To use your own trend data:

1. Create a CSV file with this format:
   ```csv
   keyword,growth,difficulty,intent
   Your Trend,5000,2,creator
   ```

2. Update the data path in the example:
   ```python
   data_path = 'path/to/your/trends.csv'
   ```

### Modifying Examples

All examples are fully commented and can be easily modified:

- Change filtering criteria
- Adjust scoring parameters
- Modify clustering methods
- Customize workflow styles
- Add new export formats

---

## 📖 Related Documentation

- **[USER_GUIDE.md](../USER_GUIDE.md)**: Complete user guide with detailed explanations
- **[README.md](../README.md)**: Project overview and API documentation
- **Core Modules**: Check `core/` directory for implementation details
- **Workflows**: Check `workflows/` directory for workflow templates

---

## 🐛 Troubleshooting

### Import Errors

If you see `ModuleNotFoundError`:
- Make sure you're running from the project root directory
- Check that all dependencies are installed: `pip install -r requirements.txt`

### File Not Found Errors

If examples can't find data files:
- Ensure you're in the project root: `/Users/steven/AVATARARTS/Revenue/trend-pulse-os`
- Check that `data/trends_sample.csv` exists

### Empty Outputs

If examples produce no results:
- Check that your data file has valid trends
- Verify CSV format matches expected structure
- Ensure trends have required fields (at minimum: `keyword`)

---

## 💡 Next Steps

After running the examples:

1. **Experiment**: Modify the examples to use your own data
2. **Combine**: Mix and match techniques from different examples
3. **Extend**: Create your own workflows using the workflow templates
4. **Integrate**: Use the patterns in your own projects

---

**Happy analyzing! 🚀**
