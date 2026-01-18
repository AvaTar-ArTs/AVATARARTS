#!/bin/bash
# Master Automation Launcher - One script to rule them all
set -euo pipefail

AUTOMATION_DIR="/Users/steven/ai-sites/automation"
cd "$AUTOMATION_DIR"

echo "🚀 Steven's Automation Suite - Master Launcher"
echo "================================================"
echo ""

# Menu
echo "What would you like to do?"
echo ""
echo "📊 STATS & DASHBOARDS"
echo "  1) Quick stats"
echo "  2) Revenue dashboard"
echo "  3) Performance analysis"
echo ""
echo "💰 REVENUE"
echo "  4) Log revenue"
echo "  5) Email revenue summary"
echo ""
echo "⚡ BATCH TOOLS"
echo "  6) Redbubble bulk upload (50 designs)"
echo "  7) AudioJungle bulk metadata (100 tracks)"
echo "  8) DistroKid bulk upload (100 tracks)"
echo "  9) Generate thumbnail variants"
echo ""
echo "🌐 CONTENT DISTRIBUTION"
echo " 10) Recipe → social platforms"
echo " 11) Art → social platforms"
echo " 12) Music → social platforms (DistroKid release)"
echo ""
echo "🎨 CONTENT TRANSFORMATION"
echo " 13) Template cascade (content → all formats)"
echo " 14) Content atomizer (1 → many)"
echo ""
echo "📅 SCHEDULING"
echo " 15) Generate smart posting schedule"
echo ""
echo "🔧 UTILITIES"
echo " 16) Start webhook receiver"
echo " 17) Run auto backup"
echo ""
echo "🤖 API-POWERED AUTOMATION (NEW!)"
echo " 18) AI Content Generator (blog, social, email, etc.)"
echo " 19) DALL-E Image Generator (daily art, series, mockups)"
echo " 20) Full Content Pipeline (complete automation)"
echo " 21) Setup Cron Jobs (run on autopilot)"
echo ""
echo "  0) Exit"
echo ""
read -p "Enter choice [0-21]: " choice

case $choice in
  1)
    ./quick-wins/stats.sh
    ;;
  2)
    python3 ./revenue-dashboard/dashboard.py
    ;;
  3)
    python3 ./performance/feedback_loop.py 30
    ;;
  4)
    echo ""
    read -p "Source (redbubble/audiojungle/etsy/etc): " source
    read -p "Amount: " amount
    read -p "Description: " desc
    python3 ./revenue-dashboard/log_revenue.py "$source" "$amount" "$desc"
    ;;
  5)
    echo ""
    read -p "Days to include (default 7): " days
    days=${days:-7}
    python3 ./revenue-dashboard/email_summary.py "$days"
    ;;
  6)
    echo ""
    read -p "Number of designs (default 50): " count
    count=${count:-50}
    python3 ./batch-tools/redbubble_bulk_uploader.py "$count"
    ;;
  7)
    echo ""
    read -p "Number of tracks (default 100): " count
    count=${count:-100}
    python3 ./batch-tools/audiojungle_bulk_metadata.py "$count"
    ;;
  8)
    echo ""
    read -p "Number of tracks (default 100): " count
    count=${count:-100}
    python3 ./batch-tools/distrokid_bulk_upload.py "$count"
    ;;
  9)
    echo ""
    read -p "Image path: " img_path
    python3 ./batch-tools/thumbnail_variants.py "$img_path"
    ;;
  10)
    python3 ./cross-pollination/recipe_to_social.py
    ;;
  11)
    echo ""
    read -p "Art title: " title
    read -p "Theme: " theme
    python3 ./cross-pollination/art_to_social.py "$title" "$theme"
    ;;
  12)
    echo ""
    read -p "Track title: " title
    read -p "Genre (default electronic): " genre
    genre=${genre:-electronic}
    python3 ./cross-pollination/music_to_social.py "$title" "$genre"
    ;;
  13)
    echo ""
    read -p "Content file: " content_file
    read -p "Title: " title
    python3 ./templates/cascade_master.py "$(cat "$content_file")" "$title"
    ;;
  14)
    echo ""
    read -p "Type (blog/song/art): " type
    read -p "Content file: " content_file
    python3 ./atomizer/content_atomizer.py "$type" "$content_file"
    ;;
  15)
    echo ""
    read -p "Platforms (space-separated, e.g. instagram tiktok youtube): " platforms
    python3 ./scheduler/smart_scheduler.py $platforms
    ;;
  16)
    echo ""
    echo "Starting webhook receiver on http://localhost:8765"
    echo "Press Ctrl+C to stop"
    python3 ./quick-wins/webhook_receiver.py
    ;;
  17)
    ./quick-wins/auto_backup.sh
    ;;
  18)
    echo ""
    echo "AI Content Generator"
    echo "===================="
    echo "Types: blog, social, email, product, youtube, recipe"
    read -p "Content type: " ctype
    read -p "Topic: " topic
    read -p "Provider (groq/openai, default groq): " provider
    provider=${provider:-groq}
    python3 ./api-powered/ai_content_generator.py "$ctype" "$topic" "$provider"
    ;;
  19)
    echo ""
    echo "DALL-E Image Generator"
    echo "======================"
    echo "Commands: daily, series, mockup, custom"
    read -p "Command: " cmd
    if [ "$cmd" == "daily" ]; then
      read -p "Theme (leave empty for auto): " theme
      python3 ./api-powered/dalle_auto_generator.py daily ${theme:+"$theme"}
    elif [ "$cmd" == "series" ]; then
      read -p "Theme: " theme
      read -p "Count (default 5): " count
      count=${count:-5}
      python3 ./api-powered/dalle_auto_generator.py series "$theme" "$count"
    elif [ "$cmd" == "mockup" ]; then
      read -p "Design theme: " theme
      python3 ./api-powered/dalle_auto_generator.py mockup "$theme"
    elif [ "$cmd" == "custom" ]; then
      read -p "Prompt: " prompt
      python3 ./api-powered/dalle_auto_generator.py custom "$prompt"
    fi
    ;;
  20)
    echo ""
    echo "Full Content Pipeline"
    echo "====================="
    echo "Options: full, daily, quick"
    read -p "Pipeline type: " ptype
    if [ "$ptype" == "full" ]; then
      read -p "Topic: " topic
      python3 ./api-powered/auto_content_pipeline.py full "$topic"
    elif [ "$ptype" == "daily" ]; then
      python3 ./api-powered/auto_content_pipeline.py daily
    elif [ "$ptype" == "quick" ]; then
      read -p "Topic: " topic
      python3 ./api-powered/auto_content_pipeline.py quick "$topic"
    fi
    ;;
  21)
    echo ""
    echo "Setup Cron Automation"
    echo "====================="
    echo "This will setup automatic content generation on a schedule."
    echo "You'll be asked to confirm before adding cron jobs."
    echo ""
    ./api-powered/setup_cron_automation.sh
    ;;
  0)
    echo "👋 Goodbye!"
    exit 0
    ;;
  *)
    echo "❌ Invalid choice"
    exit 1
    ;;
esac

echo ""
echo "================================================"
echo "✅ Complete!"
echo ""
read -p "Run another command? (y/n): " again

if [[ "$again" =~ ^[Yy]$ ]]; then
  exec "$0"
fi
