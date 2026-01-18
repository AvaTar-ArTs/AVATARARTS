# Installation Guide

**Set up Trend Pulse Expansion Packs**

---

## Prerequisites

1. **Python 3.8+**
   ```bash
   python --version
   ```

2. **trend-pulse-os** (parent directory)
   - Ensure `trend-pulse-os` is in parent directory
   - Or adjust import paths in workflows

---

## Installation Steps

### 1. Install Dependencies

```bash
cd ../trend-pulse-os
pip install -r requirements.txt
```

### 2. Verify Installation

```python
# Test import
import sys
sys.path.insert(0, '../trend-pulse-os')
from core.trend_parser import load_trends
print("✅ Installation successful!")
```

### 3. Run Test Workflow

```python
from PACKS.CONTENT_CREATION.01_AI_Content_Repurposing.workflows.workflow import run

result = run('test keyword')
print(result)
```

---

## Configuration

### Environment Variables

Create `~/.env` or use `~/.env.d/` directory:

```bash
# OpenAI API (if needed)
OPENAI_API_KEY=your_key_here

# Other API keys
OTHER_API_KEY=your_key_here
```

---

## Troubleshooting

### Import Errors

```python
# Add trend-pulse-os to path
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '../../../trend-pulse-os'))
```

### Missing Dependencies

```bash
pip install -r ../trend-pulse-os/requirements.txt
```

---

**Installation complete!** Check [Quick Start](01_QUICK_START.md) to begin.
