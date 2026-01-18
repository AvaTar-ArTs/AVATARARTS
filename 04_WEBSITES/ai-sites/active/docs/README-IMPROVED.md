# 🚀 Passive Income Empire — Improved Ops Playbook

This enhanced README adds a Retention Hub, auto-publishing, and n8n scheduling to drive recurring traffic and faster monetization.

---

## 📦 System Map

```
passive-income-empire/
├── README.md (original)            ──┐
├── README-IMPROVED.md (this)        │  Overview + ops
├── LAUNCH-PLAN.md (original)        │
├── LAUNCH-PLAN-IMPROVED.md          │  Execution calendar + KPIs
├── START-HERE.md (original)         │
├── START-HERE-IMPROVED.md           │  10‑minute launch
│
├── retention-hub/                   →  Daily/weekly return hooks
│   ├── config.env                   →  SITE_EXPORT_DIR=/path/to/site
│   ├── recipes/ (template, data, generator, output)
│   ├── daily-art/ (generator)
│   ├── weekly-music/ (generator)
│   └── publish/ (3 publisher scripts)
│
├── automation/
│   ├── docker-compose.yml           →  n8n @ http://localhost:5678
│   └── workflows/
│       ├── retention-daily-recipe.json
│       ├── retention-daily-art.json
│       └── retention-weekly-music.json
│
└── marketing/ (SEO, schema, templates, tracking)
```

---

## 🔁 Retention Hub (Return‑Rate Engine)

- Daily Recipe (programmatic SEO + Recipe schema + affiliate tools)
- Daily Art Drop (3×3 gallery micro-post with internal links)
- Weekly Music Sampler (ItemList + licensing CTAs)

Configure export once:

```bash
# Edit the export path to your site content folder
sed -i '' 's#SITE_EXPORT_DIR=.*#SITE_EXPORT_DIR=/absolute/path/to/your/site/content#' \
  ~/ai-sites/passive-income-empire/retention-hub/config.env
```

Generate + publish now:

```bash
# Recipe
python3 ~/ai-sites/passive-income-empire/retention-hub/recipes/generate_recipe.py && \
~/ai-sites/passive-income-empire/retention-hub/publish/publish_recipe.sh

# Daily Art
python3 ~/ai-sites/passive-income-empire/retention-hub/daily-art/generate_daily_art.py && \
~/ai-sites/passive-income-empire/retention-hub/publish/publish_daily_art.sh

# Weekly Music
python3 ~/ai-sites/passive-income-empire/retention-hub/weekly-music/generate_weekly_playlist.py && \
~/ai-sites/passive-income-empire/retention-hub/publish/publish_weekly_music.sh
```

---

## 🤖 Automation (n8n)

```bash
cd ~/ai-sites/passive-income-empire/automation
docker compose up -d
# open http://localhost:5678 → Import the 3 retention workflows
```

- Edit schedule times inside each workflow.
- Add API keys if you later wire posting (Buffer/Twitter/YouTube).

---

## 📈 Fastest Path to $10k

- CleanConnect leads (phone → partner): 3–5 qualified/day @ $60–$90
- Daily Art posts → Redbubble/Etsy
- Music sampler → AudioJungle/DistroKid
- Affiliate tools on recipe pages (knives, pans, mics, hosting, Canva)

Track with GA4 + UTM (see marketing/tracking).

---

## 🧪 Health Checks

- Export files created daily in SITE_EXPORT_DIR
- n8n running and cron firing
- GA/GTM events flowing (view_item, preview_music, lead_submit)

