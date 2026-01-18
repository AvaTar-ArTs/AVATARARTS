#!/bin/bash
# Restore .zshrc from backup
# Usage: bash restore_aliases.sh

BACKUP=$(ls -1t ~/.zshrc.backup.* 2>/dev/null | head -1)

if [ -z "$BACKUP" ]; then
    echo "❌ No backup found"
    exit 1
fi

echo "="*80
echo "RESTORE .ZSHRC FROM BACKUP"
echo "="*80
echo ""
echo "Backup file: $BACKUP"
echo "Current .zshrc: ~/.zshrc"
echo ""
echo "This will restore your .zshrc to the state before cleanup."
echo ""
read -p "Continue? (y/N) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    cp "$BACKUP" ~/.zshrc
    echo "✅ .zshrc restored from backup"
    echo "💡 Reload your shell: source ~/.zshrc"
else
    echo "Cancelled"
fi
