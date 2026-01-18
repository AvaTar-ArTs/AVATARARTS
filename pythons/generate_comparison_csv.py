#!/usr/bin/env python3
"""
Generate CSV comparison report from before/after reorganization.
"""

import json
import csv
import sys
from pathlib import Path
from typing import Dict, List
from datetime import datetime
import argparse

def generate_comparison_csv(reorganization_log: Path, categorization_json: Path, output_path: Path):
    """Generate CSV comparison report."""

    # Load data
    with open(reorganization_log) as f:
        reorganization = json.load(f)

    with open(categorization_json) as f:
        categorization = json.load(f)

    moved_files = reorganization.get('moved_files', [])
    files_by_category = categorization.get('files_by_category', {})

    # Create CSV with detailed comparison
    csv_path = output_path / f"before_after_comparison_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"

    with open(csv_path, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)

        # Header
        writer.writerow([
            'File Name',
            'Category',
            'Original Path',
            'New Path',
            'Original Relative Path',
            'Status',
            'Category File Count (Before)',
            'Category File Count (After)'
        ])

        # File rows
        category_counts = {}
        for cat, files in files_by_category.items():
            category_counts[cat] = len(files)

        for move_info in sorted(moved_files, key=lambda x: (x['category'], x['file'])):
            category = move_info['category']
            writer.writerow([
                move_info['file'],
                category,
                move_info['original_path'],
                move_info['new_path'],
                move_info.get('original_relative_path', move_info.get('original_relative', '')),
                'Moved' if not reorganization.get('dry_run', True) else 'Dry Run',
                category_counts.get(category, 0),
                len([m for m in moved_files if m['category'] == category])
            ])

        # Summary rows
        writer.writerow([])
        writer.writerow(['SUMMARY'])
        writer.writerow(['Metric', 'Before', 'After', 'Change'])
        writer.writerow(['Total Files', len(moved_files), len(moved_files), 0])
        writer.writerow(['Categories', len(files_by_category), len(set(m['category'] for m in moved_files)), 0])
        writer.writerow(['Dry Run', 'Yes' if reorganization.get('dry_run', True) else 'No', '', ''])

        # Category summary
        writer.writerow([])
        writer.writerow(['CATEGORY SUMMARY'])
        writer.writerow(['Category', 'File Count (Before)', 'File Count (After)', 'Change'])

        for category in sorted(set(m['category'] for m in moved_files)):
            before_count = category_counts.get(category, 0)
            after_count = len([m for m in moved_files if m['category'] == category])
            writer.writerow([
                category,
                before_count,
                after_count,
                after_count - before_count
            ])

    print(f"📄 CSV comparison report saved: {csv_path}")
    return csv_path


def main():
    parser = argparse.ArgumentParser(description="Generate CSV comparison report")
    parser.add_argument("--reorganization-log", type=str, required=True,
                        help="Path to reorganization log JSON file")
    parser.add_argument("--categorization-json", type=str, required=True,
                        help="Path to categorization JSON file")
    parser.add_argument("--output", type=str, default="./comparison_reports",
                        help="Output directory for CSV")

    args = parser.parse_args()

    reorganization_log = Path(args.reorganization_log).expanduser()
    categorization_json = Path(args.categorization_json).expanduser()
    output_dir = Path(args.output).expanduser()
    output_dir.mkdir(parents=True, exist_ok=True)

    if not reorganization_log.exists():
        print(f"❌ Error: Reorganization log not found: {reorganization_log}")
        sys.exit(1)

    if not categorization_json.exists():
        print(f"❌ Error: Categorization JSON not found: {categorization_json}")
        sys.exit(1)

    generate_comparison_csv(reorganization_log, categorization_json, output_dir)


if __name__ == '__main__':
    main()
