#!/bin/bash
# AVATARARTS Quick Access Script
# Usage: ./quick-access.sh [project-name] or source it and use: ava [project-name]

AVA_ROOT="$HOME/AVATARARTS"

ava() {
  local project="${1:-help}"
  
  case "$project" in
    passive|1|passive-income)
      cd "$AVA_ROOT/passive-income-empire"
      echo "✅ Navigated to passive-income-empire"
      ;;
    retention|2|retention-suite)
      cd "$AVA_ROOT/retention-suite-complete"
      echo "✅ Navigated to retention-suite-complete"
      ;;
    cleanconnect|3|clean)
      cd "$AVA_ROOT/cleanconnect-complete"
      echo "✅ Navigated to cleanconnect-complete"
      ;;
    heavenly|4|heavenlyhands)
      cd "$AVA_ROOT/heavenlyhands-complete"
      echo "✅ Navigated to heavenlyhands-complete"
      ;;
    quantum|5|quantumforge)
      cd "$AVA_ROOT/quantumforge-complete"
      echo "✅ Navigated to quantumforge-complete"
      ;;
    avatararts|6|avatar)
      cd "$AVA_ROOT/avatararts-complete"
      echo "✅ Navigated to avatararts-complete"
      ;;
    education|7|edu)
      cd "$AVA_ROOT/education"
      echo "✅ Navigated to education"
      ;;
    marketplace|8|market)
      cd "$AVA_ROOT/marketplace"
      echo "✅ Navigated to marketplace"
      ;;
    tools|t)
      cd "$AVA_ROOT/tools"
      echo "✅ Navigated to tools"
      source ~/.env.d/loader.sh 2>/dev/null
      echo "✅ API keys loaded"
      ;;
    sites|ai-sites)
      cd "$AVA_ROOT/ai-sites"
      echo "✅ Navigated to ai-sites"
      ;;
    music)
      cd "$AVA_ROOT/music-empire"
      echo "✅ Navigated to music-empire"
      ;;
    assets)
      cd "$AVA_ROOT/assets"
      echo "✅ Navigated to assets"
      ;;
    archive|archives)
      cd "$AVA_ROOT/archive"
      echo "✅ Navigated to archive"
      ;;
    docs|doc)
      cd "$AVA_ROOT/docs"
      echo "✅ Navigated to docs"
      ;;
    root|.)
      cd "$AVA_ROOT"
      echo "✅ Navigated to AVATARARTS root"
      ;;
    help|--help|-h|"")
      cat << 'EOF'
AVATARARTS Quick Access

Usage: ava [project-name]

Projects:
  1, passive, passive-income    → passive-income-empire
  2, retention, retention-suite  → retention-suite-complete
  3, cleanconnect, clean          → cleanconnect-complete
  4, heavenly, heavenlyhands      → heavenlyhands-complete
  5, quantum, quantumforge        → quantumforge-complete
  6, avatararts, avatar           → avatararts-complete
  7, education, edu               → education
  8, marketplace, market           → marketplace

Other:
  tools, t                        → tools (loads API keys)
  sites, ai-sites                 → ai-sites
  music                           → music-empire
  assets                          → assets
  archive, archives               → archive
  docs, doc                       → docs
  root, .                         → AVATARARTS root

Examples:
  ava passive      # Go to passive-income-empire
  ava tools        # Go to tools and load API keys
  ava 1            # Go to project #1
  ava help         # Show this help

EOF
      ;;
    *)
      echo "❌ Unknown project: $project"
      echo "Run 'ava help' for available options"
      return 1
      ;;
  esac
}

# If script is executed directly, run the function
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
  ava "$@"
fi
