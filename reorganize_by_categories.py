#!/usr/bin/env python3
"""
Reorganize Python files based on ML categorization results.

Moves files from their current locations to category-based directories
based on ML categorization results.
"""

import json
import shutil
import sys
from pathlib import Path
from typing import Dict, List, Tuple
from datetime import datetime
import argparse

class CategoryReorganizer:
    """Reorganize files based on ML categorization."""

    def __init__(self, categorization_json: Path, source_dir: Path, target_dir: Path, dry_run: bool = True):
        self.categorization_json = categorization_json
        self.source_dir = source_dir
        self.target_dir = target_dir
        self.dry_run = dry_run
        self.moved_files: List[Dict] = []
        self.errors: List[Dict] = []

    def load_categorization(self) -> Dict:
        """Load categorization results from JSON."""
        with open(self.categorization_json) as f:
            return json.load(f)

    def sanitize_category_name(self, name: str) -> str:
        """Convert category name to safe directory name."""
        # Remove special characters, spaces to underscores
        name = name.replace(' ', '_').replace('/', '_').replace('\\', '_')
        name = ''.join(c for c in name if c.isalnum() or c in ('_', '-'))
        # Remove leading/trailing underscores
        name = name.strip('_')
        return name or 'uncategorized'

    def create_category_directories(self, categories: List[str]) -> Dict[str, Path]:
        """Create category directories and return mapping."""
        category_dirs = {}
        for category in categories:
            safe_name = self.sanitize_category_name(category)
            category_dir = self.target_dir / safe_name
            category_dirs[category] = category_dir

            if not self.dry_run:
                category_dir.mkdir(parents=True, exist_ok=True)
            else:
                print(f"[DRY RUN] Would create: {category_dir}")

        return category_dirs

    def reorganize(self) -> Tuple[List[Dict], List[Dict]]:
        """Reorganize files based on categories."""
        print(f"\n{'='*70}")
        print(f"📁 REORGANIZING FILES BASED ON ML CATEGORIZATION")
        print(f"{'='*70}\n")

        if self.dry_run:
            print("⚠️  DRY RUN MODE - No files will be moved\n")

        # Load categorization
        data = self.load_categorization()
        files_by_category = data.get('files_by_category', {})
        base_dir = Path(data.get('base_directory', self.source_dir))

        print(f"📊 Categories: {len(files_by_category)}")
        print(f"📂 Source: {base_dir}")
        print(f"📂 Target: {self.target_dir}\n")

        # Create category directories
        category_dirs = self.create_category_directories(list(files_by_category.keys()))

        # Track original locations
        original_locations = {}

        # Move files
        total_files = 0
        for category, files in files_by_category.items():
            category_dir = category_dirs[category]
            print(f"\n📁 Category: {category}")
            print(f"   Directory: {category_dir.name}")
            print(f"   Files: {len(files)}")

            for filename in files:
                total_files += 1
                source_path = base_dir / filename

                # Handle files in subdirectories
                if not source_path.exists():
                    # Try to find the file
                    found = False
                    for possible_path in base_dir.rglob(filename):
                        if possible_path.is_file():
                            source_path = possible_path
                            found = True
                            break
                    if not found:
                        error_msg = f"File not found: {filename}"
                        print(f"   ❌ {error_msg}")
                        self.errors.append({
                            'file': filename,
                            'category': category,
                            'error': error_msg
                        })
                        continue

                # Store original location
                original_locations[str(source_path)] = {
                    'original_path': str(source_path),
                    'relative_path': str(source_path.relative_to(base_dir)) if source_path.is_relative_to(base_dir) else str(source_path)
                }

                # Destination path
                dest_path = category_dir / source_path.name

                # Handle name conflicts
                if dest_path.exists() and not self.dry_run:
                    counter = 1
                    while dest_path.exists():
                        stem = source_path.stem
                        suffix = source_path.suffix
                        dest_path = category_dir / f"{stem}_{counter}{suffix}"
                        counter += 1

                try:
                    if self.dry_run:
                        print(f"   [DRY RUN] {source_path.name} → {category_dir.name}/")
                    else:
                        # Copy file (safer than move for testing)
                        shutil.copy2(source_path, dest_path)
                        print(f"   ✅ {source_path.name} → {category_dir.name}/")

                    self.moved_files.append({
                        'file': source_path.name,
                        'category': category,
                        'original_path': str(source_path),
                        'new_path': str(dest_path),
                        'original_relative': original_locations[str(source_path)]['relative_path']
                    })

                except Exception as e:
                    error_msg = f"Error moving {filename}: {e}"
                    print(f"   ❌ {error_msg}")
                    self.errors.append({
                        'file': filename,
                        'category': category,
                        'error': str(e)
                    })

        print(f"\n{'='*70}")
        print(f"📊 SUMMARY")
        print(f"{'='*70}")
        print(f"Total files processed: {total_files}")
        print(f"Successfully {'would be ' if self.dry_run else ''}moved: {len(self.moved_files)}")
        print(f"Errors: {len(self.errors)}")

        if self.dry_run:
            print(f"\n⚠️  This was a DRY RUN. Use --execute to actually move files.")
        else:
            print(f"\n✅ Files reorganized to: {self.target_dir}")

        return self.moved_files, self.errors

    def save_reorganization_log(self, output_path: Path):
        """Save reorganization log to JSON."""
        log_data = {
            'timestamp': datetime.now().isoformat(),
            'source_directory': str(self.source_dir),
            'target_directory': str(self.target_dir),
            'dry_run': self.dry_run,
            'total_files': len(self.moved_files),
            'successful_moves': len(self.moved_files) - len(self.errors),
            'errors': len(self.errors),
            'moved_files': self.moved_files,
            'errors': self.errors
        }

        log_path = output_path / f"reorganization_log_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        with open(log_path, 'w', encoding='utf-8') as f:
            json.dump(log_data, f, indent=2)

        print(f"\n📄 Reorganization log saved: {log_path}")
        return log_path


def main():
    parser = argparse.ArgumentParser(description="Reorganize Python files based on ML categorization")
    parser.add_argument("--categorization-json", type=str, required=True,
                        help="Path to ML categorization JSON file")
    parser.add_argument("--source-dir", type=str, default=None,
                        help="Source directory (default: from categorization JSON)")
    parser.add_argument("--target-dir", type=str, required=True,
                        help="Target directory for reorganized files")
    parser.add_argument("--execute", action="store_true",
                        help="Actually move files (default: dry run)")
    parser.add_argument("--output", type=str, default="./reorganization_logs",
                        help="Output directory for logs")

    args = parser.parse_args()

    categorization_json = Path(args.categorization_json).expanduser()
    if not categorization_json.exists():
        print(f"❌ Error: Categorization JSON not found: {categorization_json}")
        sys.exit(1)

    # Load base directory from categorization JSON
    with open(categorization_json) as f:
        cat_data = json.load(f)
        default_source = cat_data.get('base_directory', '~/pythons')

    source_dir = Path(args.source_dir).expanduser() if args.source_dir else Path(default_source).expanduser()
    target_dir = Path(args.target_dir).expanduser()
    output_dir = Path(args.output).expanduser()
    output_dir.mkdir(parents=True, exist_ok=True)

    reorganizer = CategoryReorganizer(
        categorization_json=categorization_json,
        source_dir=source_dir,
        target_dir=target_dir,
        dry_run=not args.execute
    )

    moved_files, errors = reorganizer.reorganize()
    reorganizer.save_reorganization_log(output_dir)

    if errors:
        print(f"\n⚠️  {len(errors)} errors occurred. Check the log for details.")
        sys.exit(1)


if __name__ == '__main__':
    main()
