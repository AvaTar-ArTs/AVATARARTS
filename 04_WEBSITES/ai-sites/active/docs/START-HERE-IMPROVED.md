# 🎯 Start Here (Improved)

1) Set export path
```bash
sed -i '' 's#SITE_EXPORT_DIR=.*#SITE_EXPORT_DIR=/absolute/path/to/your/site/content#' \
  ~/ai-sites/passive-income-empire/retention-hub/config.env
```

2) Run your first retention drops
```bash
python3 ~/ai-sites/passive-income-empire/retention-hub/recipes/generate_recipe.py && \
~/ai-sites/passive-income-empire/retention-hub/publish/publish_recipe.sh

python3 ~/ai-sites/passive-income-empire/retention-hub/daily-art/generate_daily_art.py && \
~/ai-sites/passive-income-empire/retention-hub/publish/publish_daily_art.sh
```

3) Turn on automation
```bash
cd ~/ai-sites/passive-income-empire/automation
docker compose up -d
# http://localhost:5678 → import the 3 retention workflows and enable
```

4) Monetize
- Add Redbubble/Etsy links on Daily Art
- Add AudioJungle/DistroKid on Weekly Music
- Add Amazon/Canva/hosting links on Recipes

5) Next
- Run image-selector.py then upload 10 designs today
- Run track-selector.py and upload 10 tracks
- Deploy CleanConnect and connect Bland.ai
