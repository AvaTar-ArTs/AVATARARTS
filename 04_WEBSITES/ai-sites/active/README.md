# ~/ai-sites — Organized Content & Automation Hub

**Reorganized:** October 25, 2025

---

## 📁 Structure

```
ai-sites/
├── automation/           # Scripts, workflows, operation logs
│   ├── scripts/          # pdf_optimize.sh, python_sweep.sh, etc.
│   ├── workflows/        # n8n JSON workflows
│   ├── logs/             # ops_log.csv
│   └── docker-compose.yml
│
├── content-management/   # Content generation & publishing
│   └── retention-hub/
│       ├── recipes/
│       ├── daily-art/
│       ├── weekly-music/
│       ├── lyrics-to-images/
│       ├── digital-dive/
│       ├── exporter/
│       └── publish/
│
├── marketing/            # SEO, keywords, tracking, templates
│   ├── keywords/
│   ├── onpage/
│   ├── schema/
│   ├── templates/
│   └── tracking/
│
├── monetization/         # Revenue streams
│   ├── print-on-demand/
│   ├── music-licensing/
│   └── cleanconnect-leads/
│
├── reports/              # Analysis outputs
│   ├── content-inventory.md
│   ├── pdf-optimization-plan.md
│   ├── csv_manifest.csv
│   └── dupes.csv
│
├── docs/                 # Master documentation
│   ├── README-IMPROVED.md
│   ├── LAUNCH-PLAN-IMPROVED.md
│   ├── START-HERE-IMPROVED.md
│   └── creative-empire/
│
└── [active projects]     # cleanconnect-pro, etc.
```

---

## 🚀 Quick Commands

### Automation
```bash
# Run n8n
cd ~/ai-sites/automation && docker compose up -d

# Optimize PDFs
~/ai-sites/automation/scripts/pdf_optimize.sh

# Clean Python caches
~/ai-sites/automation/scripts/python_sweep.sh
```

### Content Generation
```bash
# Daily recipe
python3 ~/ai-sites/content-management/retention-hub/recipes/generate_recipe.py
~/ai-sites/content-management/retention-hub/publish/publish_recipe.sh

# Daily art drop
python3 ~/ai-sites/content-management/retention-hub/daily-art/generate_daily_art.py
~/ai-sites/content-management/retention-hub/publish/publish_daily_art.sh

# Weekly music sampler
python3 ~/ai-sites/content-management/retention-hub/weekly-music/generate_weekly_playlist.py
~/ai-sites/content-management/retention-hub/publish/publish_weekly_music.sh
```

### Monetization
```bash
# Print-on-demand image selector
python3 ~/ai-sites/monetization/print-on-demand/image-selector.py

# Music track selector
python3 ~/ai-sites/monetization/music-licensing/track-selector.py
```

---

## 📋 Logs & Undo

- Operations log: `~/ai-sites/automation/logs/ops_log.csv`
- Reorganization log: `~/ai-sites/reorganization.log`
- Undo python caches: `mv ~/Documents/python/_trash/YYYYMMDD/* back`
- Undo Notion: `mv ~/Documents/Notion/_raw/* back`

---

**All paths updated. Configuration files reference new locations.**
