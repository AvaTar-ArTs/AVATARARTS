#!/usr/bin/env python3
"""
Compare before and after reorganization states.

Analyzes the original structure vs the reorganized structure
and generates a comprehensive comparison report.
"""

import json
import sys
from pathlib import Path
from typing import Dict, List, Tuple, Set
from collections import defaultdict, Counter
from datetime import datetime
import argparse

class BeforeAfterComparator:
    """Compare before and after reorganization states."""

    def __init__(self, categorization_json: Path, reorganization_log: Path, source_dir: Path, target_dir: Path):
        self.categorization_json = categorization_json
        self.reorganization_log = reorganization_log
        self.source_dir = source_dir
        self.target_dir = target_dir

    def load_data(self) -> Tuple[Dict, Dict]:
        """Load categorization and reorganization data."""
        with open(self.categorization_json) as f:
            categorization = json.load(f)

        with open(self.reorganization_log) as f:
            reorganization = json.load(f)

        return categorization, reorganization

    def analyze_before(self, categorization: Dict) -> Dict:
        """Analyze the 'before' state (original structure)."""
        base_dir = Path(categorization.get('base_directory', self.source_dir))
        files_by_category = categorization.get('files_by_category', {})

        # Count files by category
        category_counts = {cat: len(files) for cat, files in files_by_category.items()}

        # Analyze file locations (depth, subdirectories)
        file_depths = []
        subdirs = set()
        total_files = 0

        for category, files in files_by_category.items():
            for filename in files:
                total_files += 1
                file_path = base_dir / filename
                if not file_path.exists():
                    # Try to find it
                    for possible_path in base_dir.rglob(filename):
                        if possible_path.is_file():
                            file_path = possible_path
                            break

                if file_path.exists():
                    depth = len(file_path.relative_to(base_dir).parts) - 1
                    file_depths.append(depth)
                    if depth > 0:
                        subdirs.add('/'.join(file_path.relative_to(base_dir).parts[:-1]))

        return {
            'total_files': total_files,
            'categories': len(category_counts),
            'category_counts': category_counts,
            'files_by_category': files_by_category,
            'average_depth': sum(file_depths) / len(file_depths) if file_depths else 0,
            'max_depth': max(file_depths) if file_depths else 0,
            'subdirectories': len(subdirs),
            'subdirectory_list': sorted(list(subdirs))
        }

    def analyze_after(self, reorganization: Dict, categorization: Dict) -> Dict:
        """Analyze the 'after' state (reorganized structure)."""
        moved_files = reorganization.get('moved_files', [])
        target_dir = Path(reorganization.get('target_directory', self.target_dir))

        # Count files by category
        category_counts = Counter()
        category_files = defaultdict(list)

        for move_info in moved_files:
            category = move_info['category']
            category_counts[category] += 1
            category_files[category].append(move_info['file'])

        # Analyze target structure
        category_dirs = []
        if target_dir.exists():
            category_dirs = [d.name for d in target_dir.iterdir() if d.is_dir()]

        return {
            'total_files': len(moved_files),
            'categories': len(category_counts),
            'category_counts': dict(category_counts),
            'files_by_category': dict(category_files),
            'category_directories': category_dirs,
            'average_depth': 1,  # All files now at depth 1 (category/file)
            'max_depth': 1,
            'subdirectories': len(category_dirs),
            'target_directory': str(target_dir)
        }

    def compare(self, before: Dict, after: Dict) -> Dict:
        """Compare before and after states."""
        comparison = {
            'file_count': {
                'before': before['total_files'],
                'after': after['total_files'],
                'difference': after['total_files'] - before['total_files']
            },
            'categories': {
                'before': before['categories'],
                'after': after['categories'],
                'difference': after['categories'] - before['categories']
            },
            'structure': {
                'before': {
                    'average_depth': before['average_depth'],
                    'max_depth': before['max_depth'],
                    'subdirectories': before['subdirectories']
                },
                'after': {
                    'average_depth': after['average_depth'],
                    'max_depth': after['max_depth'],
                    'subdirectories': after['subdirectories']
                },
                'depth_reduction': before['average_depth'] - after['average_depth'],
                'subdir_change': after['subdirectories'] - before['subdirectories']
            },
            'category_distribution': {}
        }

        # Compare category distributions
        before_cats = set(before['category_counts'].keys())
        after_cats = set(after['category_counts'].keys())

        for cat in before_cats | after_cats:
            comparison['category_distribution'][cat] = {
                'before': before['category_counts'].get(cat, 0),
                'after': after['category_counts'].get(cat, 0),
                'difference': after['category_counts'].get(cat, 0) - before['category_counts'].get(cat, 0)
            }

        return comparison

    def generate_report(self, before: Dict, after: Dict, comparison: Dict, output_path: Path):
        """Generate markdown comparison report."""
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        report_path = output_path / f"before_after_comparison_{datetime.now().strftime('%Y%m%d_%H%M%S')}.md"

        with open(report_path, 'w', encoding='utf-8') as f:
            f.write(f"# Before/After Reorganization Comparison\n\n")
            f.write(f"**Generated:** {timestamp}\n\n")

            f.write(f"## 📊 Executive Summary\n\n")
            f.write(f"- **Files Processed:** {comparison['file_count']['before']} → {comparison['file_count']['after']}\n")
            f.write(f"- **Categories:** {comparison['categories']['before']} → {comparison['categories']['after']}\n")
            f.write(f"- **Structure Simplification:** {comparison['structure']['depth_reduction']:.1f} levels reduced\n")
            f.write(f"- **Organization:** {before['subdirectories']} scattered dirs → {after['subdirectories']} category dirs\n\n")

            f.write(f"## 📁 Structure Comparison\n\n")
            f.write(f"### Before (Original Structure)\n\n")
            f.write(f"- **Base Directory:** `{self.source_dir}`\n")
            f.write(f"- **Total Files:** {before['total_files']}\n")
            f.write(f"- **Categories:** {before['categories']}\n")
            f.write(f"- **Average Depth:** {before['average_depth']:.2f} levels\n")
            f.write(f"- **Max Depth:** {before['max_depth']} levels\n")
            f.write(f"- **Subdirectories:** {before['subdirectories']}\n")
            if before['subdirectories'] > 0:
                f.write(f"- **Subdirectory Examples:** {', '.join(before['subdirectory_list'][:10])}")
                if len(before['subdirectory_list']) > 10:
                    f.write(f" (and {len(before['subdirectory_list']) - 10} more)")
                f.write(f"\n")

            f.write(f"\n### After (Reorganized Structure)\n\n")
            f.write(f"- **Target Directory:** `{after.get('target_directory', self.target_dir)}`\n")
            f.write(f"- **Total Files:** {after['total_files']}\n")
            f.write(f"- **Categories:** {after['categories']}\n")
            f.write(f"- **Average Depth:** {after['average_depth']:.2f} levels (flat structure)\n")
            f.write(f"- **Max Depth:** {after['max_depth']} levels\n")
            f.write(f"- **Category Directories:** {after['subdirectories']}\n")
            if after['category_directories']:
                f.write(f"- **Categories:** {', '.join(sorted(after['category_directories']))}\n")

            f.write(f"\n## 📈 Changes\n\n")
            f.write(f"### Structure Improvements\n\n")
            depth_reduction = comparison['structure']['depth_reduction']
            if depth_reduction > 0:
                f.write(f"✅ **Simplified Structure:** Reduced average depth by {depth_reduction:.2f} levels\n")
            f.write(f"✅ **Organized by Category:** Files now grouped by ML-identified categories\n")
            f.write(f"✅ **Flat Category Structure:** All category folders at the same level\n")

            f.write(f"\n### Category Distribution\n\n")
            f.write(f"| Category | Before | After | Change |\n")
            f.write(f"|----------|--------|-------|--------|\n")

            sorted_cats = sorted(
                comparison['category_distribution'].items(),
                key=lambda x: x[1]['after'],
                reverse=True
            )

            for cat, counts in sorted_cats:
                before_count = counts['before']
                after_count = counts['after']
                diff = counts['difference']
                diff_str = f"+{diff}" if diff > 0 else str(diff) if diff < 0 else "—"
                f.write(f"| {cat} | {before_count} | {after_count} | {diff_str} |\n")

            f.write(f"\n## 📂 Category Details (After)\n\n")
            for cat, files in sorted(after['files_by_category'].items(), key=lambda x: len(x[1]), reverse=True):
                f.write(f"### {cat} ({len(files)} files)\n\n")
                # Show first 10 files
                sample_files = files[:10]
                for filename in sample_files:
                    f.write(f"- `{filename}`\n")
                if len(files) > 10:
                    f.write(f"- ... and {len(files) - 10} more\n")
                f.write(f"\n")

            f.write(f"## 💡 Insights\n\n")
            f.write(f"1. **Organization:** Files are now organized by functional categories identified by ML\n")
            f.write(f"2. **Accessibility:** Flat structure makes it easier to find related scripts\n")
            f.write(f"3. **Clustering:** Similar scripts are grouped together based on code content\n")
            f.write(f"4. **Scalability:** Category-based organization scales better than flat directory\n")

            if comparison['structure']['depth_reduction'] > 1:
                f.write(f"5. **Simplification:** Reduced nesting depth improves navigation\n")

        print(f"📄 Comparison report saved: {report_path}")
        return report_path

    def generate_json_report(self, before: Dict, after: Dict, comparison: Dict, output_path: Path):
        """Generate JSON comparison report."""
        report_data = {
            'timestamp': datetime.now().isoformat(),
            'before': before,
            'after': after,
            'comparison': comparison
        }

        report_path = output_path / f"before_after_comparison_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        with open(report_path, 'w', encoding='utf-8') as f:
            json.dump(report_data, f, indent=2)

        print(f"📄 JSON comparison report saved: {report_path}")
        return report_path


def main():
    parser = argparse.ArgumentParser(description="Compare before and after reorganization")
    parser.add_argument("--categorization-json", type=str, required=True,
                        help="Path to ML categorization JSON file")
    parser.add_argument("--reorganization-log", type=str, required=True,
                        help="Path to reorganization log JSON file")
    parser.add_argument("--source-dir", type=str, default=None,
                        help="Source directory (default: from categorization JSON)")
    parser.add_argument("--target-dir", type=str, default=None,
                        help="Target directory (default: from reorganization log)")
    parser.add_argument("--output", type=str, default="./comparison_reports",
                        help="Output directory for reports")

    args = parser.parse_args()

    categorization_json = Path(args.categorization_json).expanduser()
    reorganization_log = Path(args.reorganization_log).expanduser()
    output_dir = Path(args.output).expanduser()
    output_dir.mkdir(parents=True, exist_ok=True)

    if not categorization_json.exists():
        print(f"❌ Error: Categorization JSON not found: {categorization_json}")
        sys.exit(1)

    if not reorganization_log.exists():
        print(f"❌ Error: Reorganization log not found: {reorganization_log}")
        sys.exit(1)

    # Load directories from JSON files
    with open(categorization_json) as f:
        cat_data = json.load(f)
        default_source = cat_data.get('base_directory', '~/pythons')

    with open(reorganization_log) as f:
        reorg_data = json.load(f)
        default_target = reorg_data.get('target_directory', './reorganized')

    source_dir = Path(args.source_dir).expanduser() if args.source_dir else Path(default_source).expanduser()
    target_dir = Path(args.target_dir).expanduser() if args.target_dir else Path(default_target).expanduser()

    comparator = BeforeAfterComparator(
        categorization_json=categorization_json,
        reorganization_log=reorganization_log,
        source_dir=source_dir,
        target_dir=target_dir
    )

    print(f"\n{'='*70}")
    print(f"📊 COMPARING BEFORE/AFTER REORGANIZATION")
    print(f"{'='*70}\n")

    categorization, reorganization = comparator.load_data()
    before = comparator.analyze_before(categorization)
    after = comparator.analyze_after(reorganization, categorization)
    comparison = comparator.compare(before, after)

    comparator.generate_report(before, after, comparison, output_dir)
    comparator.generate_json_report(before, after, comparison, output_dir)

    print(f"\n✅ Comparison complete!")
    print(f"   Reports saved to: {output_dir}")


if __name__ == '__main__':
    main()
