# Trend Pulse OS

**Trend → Action → Revenue**

Core trend analysis engine for identifying trending topics, scoring opportunities, and generating actionable workflows.

## 🚀 Features

- **Trend Parsing**: Load trends from CSV, JSON, or API sources
- **Smart Scoring**: Multi-factor trend scoring with AEO compatibility
- **Keyword Clustering**: Group trends by intent, similarity, or score
- **Export Engine**: Export processed data to CSV, JSON, or custom formats
- **Workflow Generation**: Create AI-powered workflows from trends

## 📦 Installation

```bash
pip install -r requirements.txt
```

## 🎯 Quick Start

```python
from trend_pulse_os import load_trends, score_trend, cluster_keywords

# Load trends
trends = load_trends('data/trends_sample.csv')

# Score trends
scored = score_trend(trends[0], include_aeo=True)

# Cluster by intent
clusters = cluster_keywords(trends, method='intent')
```

## 📚 Core Modules

### `core.trend_parser`
Load and parse trend data from various sources.

```python
from trend_pulse_os.core.trend_parser import load_trends, filter_trends

trends = load_trends('data/trends.csv')
filtered = filter_trends(trends, min_growth=5000, intent='creator')
```

### `core.trend_score`
Calculate trend scores with AEO optimization.

```python
from trend_pulse_os.core.trend_score import score_trend, score_batch

score = score_trend(trend, include_aeo=True, time_decay=True)
scored_trends = score_batch(trends)
```

### `core.keyword_cluster`
Cluster keywords by intent, similarity, or score.

```python
from trend_pulse_os.core.keyword_cluster import cluster_keywords

clusters = cluster_keywords(trends, method='intent')
top_clusters = get_top_clusters(clusters, top_n=5)
```

### `core.export_engine`
Export processed data to various formats.

```python
from trend_pulse_os.core.export_engine import export_csv, export_json

export_csv(scored_trends, 'output.csv')
export_json(clusters, 'clusters.json')
```

## 🔧 Workflows

Pre-built workflows for common use cases:

- `workflows.ai_video_generator` - Generate video ideas from trends
- `workflows.ai_image_enhancer` - Image enhancement workflows
- `workflows.ai_personal_assistant` - Personal assistant automation
- `workflows.ai_for_teachers` - Educational content generation

## 📊 Data Format

Trend data should follow this structure:

```csv
keyword,growth,difficulty,intent
AI Video Generator,6700,2,creator
AI Image Enhancer,9000,2,creator
```

## 🤝 Contributing

Contributions welcome! Please read the contributing guidelines.

## 📄 License

MIT License - see LICENSE file for details.

## 🔗 Related Projects

- [trend-pulse-pro](../trend-pulse-pro) - Frontend dashboard
- [Trend_Pulse_All_Expansion_Packs](../Trend_Pulse_All_Expansion_Packs) - Workflow templates
