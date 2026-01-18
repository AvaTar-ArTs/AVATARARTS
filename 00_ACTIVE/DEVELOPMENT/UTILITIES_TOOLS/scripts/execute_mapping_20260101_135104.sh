#!/bin/bash
# Consolidation execution script generated 2026-01-01T13:51:11.014112
# Based on: CONSOLIDATION_MAPPING_20260101_135104.csv

set -e  # Exit on error

WORKSPACE_ROOT="/Users/steven/AVATARARTS"
BACKUP_DIR="$WORKSPACE_ROOT/consolidation_backup_$(date +%Y%m%d_%H%M%S)"

echo "📦 Creating backup directory..."
mkdir -p "$BACKUP_DIR"

echo "🔄 Processing consolidation mappings..."
python3 << 'PYTHON_SCRIPT'
import csv
import shutil
import os
from pathlib import Path

workspace = Path('/Users/steven/AVATARARTS')
backup_dir = Path(os.environ.get('BACKUP_DIR', workspace / 'backup'))
mapping_csv = Path('/Users/steven/AVATARARTS/CONSOLIDATION_MAPPING_20260101_135104.csv')

with open(mapping_csv, 'r') as f:
    reader = csv.DictReader(f)
    for i, row in enumerate(reader, 1):
        original = workspace / row['original_path']
        new = workspace / row['new_path']
        action = row['action']

        if not original.exists():
            continue

        # Backup
        backup_path = backup_dir / row['original_path']
        backup_path.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(original, backup_path)

        if action == 'DELETE':
            original.unlink()
        elif action == 'MOVE':
            new.parent.mkdir(parents=True, exist_ok=True)
            if new.exists():
                original.unlink()  # Remove duplicate
            else:
                shutil.move(str(original), str(new))

        if i % 100 == 0:
            print(f'Processed {i} files...')

print('✅ Consolidation complete!')
PYTHON_SCRIPT

echo "✅ Consolidation script completed"
echo "Backup location: $BACKUP_DIR"
