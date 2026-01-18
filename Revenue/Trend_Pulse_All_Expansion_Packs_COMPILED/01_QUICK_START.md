# Quick Start Guide

**Get started with Trend Pulse Expansion Packs in 5 minutes!**

---

## 🎯 Step 1: Choose a Pack

Browse the [Master Index](00_MASTER_INDEX.md) and select a pack that matches your needs.

**Popular Packs:**
- **AI_Content_Repurposing** - Repurpose any content
- **YouTube_Shorts_Automation** - Scale Shorts production
- **TikTok_AI_Video_Generator** - Create viral TikTok content
- **AI_Agents_Framework** - Build agentic AI systems

---

## 📦 Step 2: Navigate to Pack

```bash
cd PACKS/CONTENT_CREATION/01_AI_Content_Repurposing
```

---

## 💻 Step 3: Run Workflow

```python
from workflows.workflow import run

# Execute workflow
result = run('AI Video Generator')

# Access results
print(result)
```

---

## 🔄 Step 4: Batch Processing

```python
from workflows.workflow import process_trends_from_file

# Process multiple trends
results = process_trends_from_file('trends.csv', 'output.json')
```

---

## 📚 Next Steps

- Read pack-specific README
- Check [Installation Guide](02_INSTALLATION.md)
- Explore [Examples](EXAMPLES/)
- Review [Documentation](DOCUMENTATION/)

---

**Ready to automate? Pick a pack and start!** 🚀
