#!/bin/bash
# Aggressive Alias Cleanup - Keep only scan-* and essentials
# Generated: 2026-01-13T04:44:05.676911
# Will remove: 49 aliases
# Will keep: 27 aliases

ZSHRC_PATH=~/.zshrc
BACKUP_PATH=~/.zshrc.backup.$(date +%Y%m%d_%H%M%S)

echo '='*80
echo 'AGGRESSIVE ALIAS CLEANUP'
echo '='*80

echo 'Creating backup...'
cp "$ZSHRC_PATH" "$BACKUP_PATH"
echo "✓ Backup: $BACKUP_PATH"

echo 'Removing unused aliases (keeping scan-* and essentials)...'
echo ''
# filesearch: alias filesearch='echo "⚠️  flamehaven-api not found. Instal
sed -i '' '1663d' "$ZSHRC_PATH"
echo "  ✓ filesearch"
# env-check: alias env-check='pyenv-status'  # Check Python environment s
sed -i '' '1278d' "$ZSHRC_PATH"
echo "  ✓ env-check"
# suno-merge: alias suno-merge='echo "⚠️  pythons directory not found"'
sed -i '' '918d' "$ZSHRC_PATH"
echo "  ✓ suno-merge"
# suno-extract: alias suno-extract='echo "⚠️  pythons directory not found (c
sed -i '' '917d' "$ZSHRC_PATH"
echo "  ✓ suno-extract"
# suno-master: alias suno-master='echo "⚠️  suno_ultimate_master.csv not fo
sed -i '' '902d' "$ZSHRC_PATH"
echo "  ✓ suno-master"
# suno-browser: alias suno-browser='echo "⚠️  SUNO_ULTIMATE_EXTRACTOR.js not
sed -i '' '896d' "$ZSHRC_PATH"
echo "  ✓ suno-browser"
# suno-summary: alias suno-summary='echo "⚠️  SUNO_COLLECTION_SUMMARY.md not
sed -i '' '890d' "$ZSHRC_PATH"
echo "  ✓ suno-summary"
# pyenv: alias pyenv="py-env"
sed -i '' '846d' "$ZSHRC_PATH"
echo "  ✓ pyenv"
# cd-ai: alias cd-ai='echo "⚠️  Python directory not found"'
sed -i '' '840d' "$ZSHRC_PATH"
echo "  ✓ cd-ai"
# cd-insta: alias cd-insta='echo "⚠️  Python directory not found"'
sed -i '' '839d' "$ZSHRC_PATH"
echo "  ✓ cd-insta"
# cd-yt: alias cd-yt='echo "⚠️  Python directory not found"'
sed -i '' '838d' "$ZSHRC_PATH"
echo "  ✓ cd-yt"
# cd-py: alias cd-py='echo "⚠️  Python directory not found (checked ~
sed -i '' '837d' "$ZSHRC_PATH"
echo "  ✓ cd-py"
# py-flake: alias py-flake="flake8 --max-line-length 120"
sed -i '' '820d' "$ZSHRC_PATH"
echo "  ✓ py-flake"
# py-format: alias py-format="black --line-length 120"
sed -i '' '819d' "$ZSHRC_PATH"
echo "  ✓ py-format"
# py-verify: alias py-verify='echo "⚠️  Python directory not found"'
sed -i '' '814d' "$ZSHRC_PATH"
echo "  ✓ py-verify"
# py-ai: alias py-ai='echo "⚠️  Python directory not found"'
sed -i '' '813d' "$ZSHRC_PATH"
echo "  ✓ py-ai"
# py-analyze: alias py-analyze='echo "⚠️  Python scripts directory not fou
sed -i '' '812d' "$ZSHRC_PATH"
echo "  ✓ py-analyze"
# py-env: alias py-env='echo "⚠️  Python directory not found (checked 
sed -i '' '811d' "$ZSHRC_PATH"
echo "  ✓ py-env"
# ai-menu: alias ai-menu='echo "⚠️  ai_unified_menu.sh not found (check
sed -i '' '507d' "$ZSHRC_PATH"
echo "  ✓ ai-menu"
# bcat: alias bcat="/bin/cat"  # Keep bcat as original cat
sed -i '' '395d' "$ZSHRC_PATH"
echo "  ✓ bcat"
# lt: alias lt='ls -altr'
sed -i '' '387d' "$ZSHRC_PATH"
echo "  ✓ lt"
# ll: alias ll='ls -alF'
sed -i '' '386d' "$ZSHRC_PATH"
echo "  ✓ ll"
# nb-install: alias nb-install='echo "⚠️  nanobanana directory not found"'
sed -i '' '367d' "$ZSHRC_PATH"
echo "  ✓ nb-install"
# nb-run: alias nb-run='echo "⚠️  nanobanana directory not found"'
sed -i '' '366d' "$ZSHRC_PATH"
echo "  ✓ nb-run"
# nb-test: alias nb-test='echo "⚠️  nanobanana directory not found"'
sed -i '' '365d' "$ZSHRC_PATH"
echo "  ✓ nb-test"
# nb: alias nb='echo "⚠️  nanobanana directory not found at $HOME/
sed -i '' '364d' "$ZSHRC_PATH"
echo "  ✓ nb"
# py-serve: alias py-serve='python3 -m http.server 8000'
sed -i '' '353d' "$ZSHRC_PATH"
echo "  ✓ py-serve"
# py-check: alias py-check='python3 -m py_compile'
sed -i '' '352d' "$ZSHRC_PATH"
echo "  ✓ py-check"
# gd: alias gd='git diff'
sed -i '' '342d' "$ZSHRC_PATH"
echo "  ✓ gd"
# gl: alias gl='git pull'
sed -i '' '341d' "$ZSHRC_PATH"
echo "  ✓ gl"
# gp: alias gp='git push'
sed -i '' '340d' "$ZSHRC_PATH"
echo "  ✓ gp"
# gc: alias gc='git commit'
sed -i '' '339d' "$ZSHRC_PATH"
echo "  ✓ gc"
# ga: alias ga='git add'
sed -i '' '338d' "$ZSHRC_PATH"
echo "  ✓ ga"
# gs: alias gs='git status'
sed -i '' '337d' "$ZSHRC_PATH"
echo "  ✓ gs"
# env-cloud: alias env-cloud='${EDITOR:-open -e} ~/.env.d/cloud-infrastru
sed -i '' '202d' "$ZSHRC_PATH"
echo "  ✓ env-cloud"
# env-notify: alias env-notify='${EDITOR:-open -e} ~/.env.d/notifications.
sed -i '' '201d' "$ZSHRC_PATH"
echo "  ✓ env-notify"
# env-docs: alias env-docs='${EDITOR:-open -e} ~/.env.d/documents.env'
sed -i '' '200d' "$ZSHRC_PATH"
echo "  ✓ env-docs"
# env-audio: alias env-audio='${EDITOR:-open -e} ~/.env.d/audio-music.env
sed -i '' '199d' "$ZSHRC_PATH"
echo "  ✓ env-audio"
# env-llm: alias env-llm='${EDITOR:-open -e} ~/.env.d/llm-apis.env'
sed -i '' '198d' "$ZSHRC_PATH"
echo "  ✓ env-llm"
# env-edit: alias env-edit='cd ~/.env.d && ls -la *.env'
sed -i '' '194d' "$ZSHRC_PATH"
echo "  ✓ env-edit"
# env-quick: alias env-quick='cat ~/.env.d/QUICKSTART.md'
sed -i '' '193d' "$ZSHRC_PATH"
echo "  ✓ env-quick"
# env-help: alias env-help='cat ~/.env.d/CHEATSHEET.txt'
sed -i '' '192d' "$ZSHRC_PATH"
echo "  ✓ env-help"
# env-status: alias env-status='source ~/.env.d/loader.sh --status'
sed -i '' '190d' "$ZSHRC_PATH"
echo "  ✓ env-status"
# env-validate: alias env-validate='python3 ~/.env.d/envctl.py validate'
sed -i '' '189d' "$ZSHRC_PATH"
echo "  ✓ env-validate"
# env-rebuild: alias env-rebuild='python3 ~/.env.d/envctl.py build --force'
sed -i '' '187d' "$ZSHRC_PATH"
echo "  ✓ env-rebuild"
# env-load-audio: alias env-load-audio='source ~/.env.d/loader.sh audio-music'
sed -i '' '185d' "$ZSHRC_PATH"
echo "  ✓ env-load-audio"
# env-load-llm: alias env-load-llm='source ~/.env.d/loader.sh llm-apis'
sed -i '' '184d' "$ZSHRC_PATH"
echo "  ✓ env-load-llm"
# env-load-all: alias env-load-all='source ~/.env.d/loader.sh'
sed -i '' '183d' "$ZSHRC_PATH"
echo "  ✓ env-load-all"
# env-load: alias env-load='source ~/.env.d/loader.sh'
sed -i '' '182d' "$ZSHRC_PATH"
echo "  ✓ env-load"

echo ''
echo '='*80
echo '✓ Removed 49 aliases'
echo '✓ Kept 27 aliases (including all scan-* aliases)'
echo '💡 Reload: source ~/.zshrc'
echo '='*80
