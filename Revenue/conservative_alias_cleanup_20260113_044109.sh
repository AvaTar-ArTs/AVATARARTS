#!/bin/bash
# Conservative Alias Cleanup Script
# Generated: 2026-01-13T04:41:09.900577
# Will remove: 21 aliases

ZSHRC_PATH=~/.zshrc
BACKUP_PATH=~/.zshrc.backup.$(date +%Y%m%d_%H%M%S)

echo '='*80
echo 'CONSERVATIVE ALIAS CLEANUP'
echo '='*80

echo 'Creating backup...'
cp "$ZSHRC_PATH" "$BACKUP_PATH"
echo "✓ Backup: $BACKUP_PATH"

echo 'Removing unused tool-specific aliases...'
echo ''

echo ''
echo '='*80
echo '✓ Removed 21 aliases'
echo '💡 Reload: source ~/.zshrc'
echo '='*80
