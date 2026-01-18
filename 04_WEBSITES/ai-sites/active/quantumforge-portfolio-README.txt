# QuantumForgeLabs Portfolio Starter

This pack lets you stand up a filterable portfolio page + auto-generated CSV/MD content from your repo folders.

## Files
- `python.html` — static portfolio page (reads `portfolio/portfolio_descriptions.csv`).
- `portfolio/portfolio_descriptions.csv` — data source (auto-regenerated).
- `content/python_portfolio.md` — generated developer index.
- `content/alchemy_index.md` — generated creative index.
- `scripts/build_portfolio.py` — scans top-level folders, writes CSV + MD.
- `.github/workflows/portfolio.yml` — GitHub Actions to rebuild on push.

## Quick Start (macOS)
```bash
# 1) create project folder
mkdir -p /Users/steven/QuantumForgeLabs && cd /Users/steven/QuantumForgeLabs

# 2) unzip the starter pack here
# (drag-and-drop the ZIP into this folder, then double-click to extract)

# 3) run the generator once (optional)
python3 scripts/build_portfolio.py .

# 4) serve python.html locally for a quick preview
python3 -m http.server 8080
# then open http://localhost:8080/python.html
```

## Publish
- Upload `python.html` and the `portfolio/` folder to your site root (so the CSV path stays `./portfolio/portfolio_descriptions.csv`).
- Or commit these files into your GitHub repo; the Action will keep CSV/MD in sync as you add/remove folders.

Pro tip: edit category keywords inside `scripts/build_portfolio.py` to fine-tune auto-categorization.
