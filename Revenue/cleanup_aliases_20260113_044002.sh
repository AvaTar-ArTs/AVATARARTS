#!/bin/bash
# Interactive Alias Cleanup Script
# Generated: 2026-01-13T04:40:02.518750
# Aliases to remove: 49

ZSHRC_PATH=~/.zshrc
BACKUP_PATH=~/.zshrc.backup.$(date +%Y%m%d_%H%M%S)

echo '='*80
echo 'ALIAS CLEANUP'
echo '='*80

echo 'Creating backup...'
cp "$ZSHRC_PATH" "$BACKUP_PATH"
echo "✓ Backup saved to: $BACKUP_PATH"

echo 'Removing aliases...'
echo ''
# Remove qwen-ext (line 1786)
sed -i '' '1786d' "$ZSHRC_PATH"
echo "  ✓ Removed: qwen-ext"
# Remove qwen-mcp (line 1785)
sed -i '' '1785d' "$ZSHRC_PATH"
echo "  ✓ Removed: qwen-mcp"
# Remove qwen-version (line 1784)
sed -i '' '1784d' "$ZSHRC_PATH"
echo "  ✓ Removed: qwen-version"
# Remove qwen-help (line 1783)
sed -i '' '1783d' "$ZSHRC_PATH"
echo "  ✓ Removed: qwen-help"
# Remove ca-code (line 1747)
sed -i '' '1747d' "$ZSHRC_PATH"
echo "  ✓ Removed: ca-code"
# Remove ca-resume (line 1746)
sed -i '' '1746d' "$ZSHRC_PATH"
echo "  ✓ Removed: ca-resume"
# Remove ca-models (line 1745)
sed -i '' '1745d' "$ZSHRC_PATH"
echo "  ✓ Removed: ca-models"
# Remove ca-cloud (line 1744)
sed -i '' '1744d' "$ZSHRC_PATH"
echo "  ✓ Removed: ca-cloud"
# Remove ca-chat (line 1743)
sed -i '' '1743d' "$ZSHRC_PATH"
echo "  ✓ Removed: ca-chat"
# Remove grok-refactor (line 1714)
sed -i '' '1714d' "$ZSHRC_PATH"
echo "  ✓ Removed: grok-refactor"
# Remove grok-explain (line 1713)
sed -i '' '1713d' "$ZSHRC_PATH"
echo "  ✓ Removed: grok-explain"
# Remove grok-debug (line 1712)
sed -i '' '1712d' "$ZSHRC_PATH"
echo "  ✓ Removed: grok-debug"
# Remove grok-code (line 1711)
sed -i '' '1711d' "$ZSHRC_PATH"
echo "  ✓ Removed: grok-code"
# Remove grok-test (line 1710)
sed -i '' '1710d' "$ZSHRC_PATH"
echo "  ✓ Removed: grok-test"
# Remove grok-edit (line 1709)
sed -i '' '1709d' "$ZSHRC_PATH"
echo "  ✓ Removed: grok-edit"
# Remove grok-config (line 1708)
sed -i '' '1708d' "$ZSHRC_PATH"
echo "  ✓ Removed: grok-config"
# Remove grok-version (line 1707)
sed -i '' '1707d' "$ZSHRC_PATH"
echo "  ✓ Removed: grok-version"
# Remove grok-help (line 1706)
sed -i '' '1706d' "$ZSHRC_PATH"
echo "  ✓ Removed: grok-help"
# Remove d2m-security (line 1675)
sed -i '' '1675d' "$ZSHRC_PATH"
echo "  ✓ Removed: d2m-security"
# Remove d2m (line 1673)
sed -i '' '1673d' "$ZSHRC_PATH"
echo "  ✓ Removed: d2m"
# Remove pinit (line 1255)
sed -i '' '1255d' "$ZSHRC_PATH"
echo "  ✓ Removed: pinit"
# Remove preq (line 1254)
sed -i '' '1254d' "$ZSHRC_PATH"
echo "  ✓ Removed: preq"
# Remove psetup (line 1253)
sed -i '' '1253d' "$ZSHRC_PATH"
echo "  ✓ Removed: psetup"
# Remove venv-setup (line 1217)
sed -i '' '1217d' "$ZSHRC_PATH"
echo "  ✓ Removed: venv-setup"
# Remove cdai (line 871)
sed -i '' '871d' "$ZSHRC_PATH"
echo "  ✓ Removed: cdai"
# Remove cdinsta (line 870)
sed -i '' '870d' "$ZSHRC_PATH"
echo "  ✓ Removed: cdinsta"
# Remove cdyt (line 869)
sed -i '' '869d' "$ZSHRC_PATH"
echo "  ✓ Removed: cdyt"
# Remove cdpy (line 868)
sed -i '' '868d' "$ZSHRC_PATH"
echo "  ✓ Removed: cdpy"
# Remove pyflake (line 867)
sed -i '' '867d' "$ZSHRC_PATH"
echo "  ✓ Removed: pyflake"
# Remove pyformat (line 866)
sed -i '' '866d' "$ZSHRC_PATH"
echo "  ✓ Removed: pyformat"
# Remove pyverify (line 865)
sed -i '' '865d' "$ZSHRC_PATH"
echo "  ✓ Removed: pyverify"
# Remove pyai (line 864)
sed -i '' '864d' "$ZSHRC_PATH"
echo "  ✓ Removed: pyai"
# Remove pyanalyze (line 863)
sed -i '' '863d' "$ZSHRC_PATH"
echo "  ✓ Removed: pyanalyze"
# Remove ask-ollama (line 527)
sed -i '' '527d' "$ZSHRC_PATH"
echo "  ✓ Removed: ask-ollama"
# Remove ask-grok (line 526)
sed -i '' '526d' "$ZSHRC_PATH"
echo "  ✓ Removed: ask-grok"
# Remove bcat (line 406)
sed -i '' '406d' "$ZSHRC_PATH"
echo "  ✓ Removed: bcat"
# Remove l (line 399)
sed -i '' '399d' "$ZSHRC_PATH"
echo "  ✓ Removed: l"
# Remove la (line 398)
sed -i '' '398d' "$ZSHRC_PATH"
echo "  ✓ Removed: la"
# Remove lt (line 393)
sed -i '' '393d' "$ZSHRC_PATH"
echo "  ✓ Removed: lt"
# Remove ll (line 392)
sed -i '' '392d' "$ZSHRC_PATH"
echo "  ✓ Removed: ll"
# Remove z (line 386)
sed -i '' '386d' "$ZSHRC_PATH"
echo "  ✓ Removed: z"
# Remove pip-upgrade (line 359)
sed -i '' '359d' "$ZSHRC_PATH"
echo "  ✓ Removed: pip-upgrade"
# Remove pip-outdated (line 358)
sed -i '' '358d' "$ZSHRC_PATH"
echo "  ✓ Removed: pip-outdated"
# Remove pip-list (line 357)
sed -i '' '357d' "$ZSHRC_PATH"
echo "  ✓ Removed: pip-list"
# Remove pip3 (line 110)
sed -i '' '110d' "$ZSHRC_PATH"
echo "  ✓ Removed: pip3"
# Remove pip3.12 (line 106)
sed -i '' '106d' "$ZSHRC_PATH"
echo "  ✓ Removed: pip3.12"
# Remove pip3.11 (line 103)
sed -i '' '103d' "$ZSHRC_PATH"
echo "  ✓ Removed: pip3.11"
# Remove python3.12 (line 94)
sed -i '' '94d' "$ZSHRC_PATH"
echo "  ✓ Removed: python3.12"
# Remove python3.11 (line 91)
sed -i '' '91d' "$ZSHRC_PATH"
echo "  ✓ Removed: python3.11"

echo ''
echo '='*80
echo '✓ Removed 49 aliases'
echo '✓ Backup created at: $BACKUP_PATH'
echo '💡 Reload your shell: source ~/.zshrc'
echo '='*80
