#!/usr/bin/env python3
"""
Smart Deduplication Analyzer with Parent-Folder Awareness
==========================================================
Analyzes duplicates with organizational context:
1. Content similarity (MD5)
2. Functionality (Python AST for scripts)
3. Parent-folder context (organizational purpose)
4. Workspace location (active vs archive)

This prevents deleting files that serve different purposes
in different organizational contexts.
"""

import ast
import hashlib
import json
import csv
from pathlib import Path
from collections import defaultdict
from typing import Dict, List, Tuple, Optional, Set
import difflib


class OrganizationalContext:
    """Understands AVATARARTS workspace organization"""

    # Organizational hierarchy
    WORKSPACE_ZONES = {
        '00_ACTIVE': {'purpose': 'Active development', 'priority': 'high', 'auto_dedupe': False},
        '01_TOOLS': {'purpose': 'Automation tools', 'priority': 'critical', 'auto_dedupe': False},
        '02_DOCUMENTATION': {'purpose': 'Documentation', 'priority': 'medium', 'auto_dedupe': True},
        '03_ARCHIVES': {'purpose': 'Archived/old files', 'priority': 'low', 'auto_dedupe': True},
        '04_WEBSITES': {'purpose': 'Web projects', 'priority': 'high', 'auto_dedupe': False},
        '05_DATA': {'purpose': 'Data files', 'priority': 'medium', 'auto_dedupe': True},
        '06_SEO_MARKETING': {'purpose': 'SEO/Marketing', 'priority': 'high', 'auto_dedupe': False},
        '07_MISC': {'purpose': 'Miscellaneous', 'priority': 'low', 'auto_dedupe': True},
        '08_REPORTS': {'purpose': 'Generated reports', 'priority': 'low', 'auto_dedupe': True},
        '09_TEMPLATES': {'purpose': 'Templates', 'priority': 'medium', 'auto_dedupe': False},
    }

    # Context indicators in path names
    CONTEXT_MARKERS = {
        'backup': 'backup',
        'archive': 'archive',
        'old': 'archive',
        'deprecated': 'archive',
        'temp': 'temporary',
        'tmp': 'temporary',
        'test': 'testing',
        'draft': 'draft',
        'working': 'development',
        'dev': 'development',
        'prod': 'production',
        'production': 'production',
        'staging': 'staging',
        'copy': 'duplicate',
        'duplicate': 'duplicate',
        'clone': 'duplicate',
    }

    @classmethod
    def get_zone(cls, filepath: Path) -> Optional[str]:
        """Get the workspace zone (00_ACTIVE, 01_TOOLS, etc.)"""
        parts = filepath.parts
        for part in parts:
            if part in cls.WORKSPACE_ZONES:
                return part
        return None

    @classmethod
    def get_context_markers(cls, filepath: Path) -> Set[str]:
        """Extract context markers from path"""
        markers = set()
        path_lower = str(filepath).lower()

        for marker, context in cls.CONTEXT_MARKERS.items():
            if marker in path_lower:
                markers.add(context)

        return markers

    @classmethod
    def are_same_purpose(cls, file1: Path, file2: Path) -> Tuple[bool, str]:
        """
        Determine if two files serve the same purpose
        Returns: (same_purpose, reason)
        """
        zone1 = cls.get_zone(file1)
        zone2 = cls.get_zone(file2)

        # Different zones = different purposes (unless archive vs active)
        if zone1 != zone2:
            # Archive vs Active = safe to dedupe
            if zone1 == '03_ARCHIVES' or zone2 == '03_ARCHIVES':
                active_zone = zone1 if zone1 != '03_ARCHIVES' else zone2
                return True, f"Archive duplicate of {active_zone}"
            else:
                return False, f"Different zones: {zone1} vs {zone2}"

        # Check context markers
        markers1 = cls.get_context_markers(file1)
        markers2 = cls.get_context_markers(file2)

        # If one is marked as duplicate/backup/old
        duplicate_markers = {'duplicate', 'backup', 'archive', 'temporary'}
        if (markers1 & duplicate_markers) != (markers2 & duplicate_markers):
            return True, "One is marked as backup/duplicate"

        # Different deployment contexts
        deployment_contexts = {'development', 'production', 'staging'}
        ctx1 = markers1 & deployment_contexts
        ctx2 = markers2 & deployment_contexts
        if ctx1 and ctx2 and ctx1 != ctx2:
            return False, f"Different deployment: {ctx1} vs {ctx2}"

        # Same zone, similar markers = same purpose
        return True, f"Same zone ({zone1}) with similar context"

    @classmethod
    def should_auto_dedupe(cls, filepath: Path) -> bool:
        """Can this file be auto-deduped if it's a duplicate?"""
        zone = cls.get_zone(filepath)
        if zone:
            return cls.WORKSPACE_ZONES[zone]['auto_dedupe']

        # Check if in a duplicate-marked location
        markers = cls.get_context_markers(filepath)
        if {'duplicate', 'backup', 'archive', 'temporary'} & markers:
            return True

        return False


class SmartDedupeAnalyzer:
    """Enhanced deduplication with organizational awareness"""

    def __init__(self, root_path: str):
        self.root = Path(root_path)
        self.org_context = OrganizationalContext()

    @staticmethod
    def get_file_hash(filepath: Path) -> Optional[str]:
        """Calculate MD5 hash of file content"""
        try:
            hash_md5 = hashlib.md5()
            with open(filepath, "rb") as f:
                for chunk in iter(lambda: f.read(4096), b""):
                    hash_md5.update(chunk)
            return hash_md5.hexdigest()
        except:
            return None

    @staticmethod
    def get_python_signature(filepath: Path) -> Optional[Dict]:
        """Extract functional signature from Python file"""
        try:
            with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                code = f.read()

            tree = ast.parse(code, filename=str(filepath))

            signature = {
                'functions': [node.name for node in ast.walk(tree) if isinstance(node, ast.FunctionDef)],
                'classes': [node.name for node in ast.walk(tree) if isinstance(node, ast.ClassDef)],
                'imports': [],
                'docstring': ast.get_docstring(tree),
            }

            for node in ast.walk(tree):
                if isinstance(node, ast.Import):
                    signature['imports'].extend([alias.name for alias in node.names])
                elif isinstance(node, ast.ImportFrom):
                    if node.module:
                        signature['imports'].append(node.module)

            return signature
        except:
            return None

    @staticmethod
    def compare_signatures(sig1: Dict, sig2: Dict) -> float:
        """Compare two Python signatures, return similarity 0-100"""
        if not sig1 or not sig2:
            return 0.0

        scores = []

        # Compare functions
        func1 = set(sig1['functions'])
        func2 = set(sig2['functions'])
        if func1 or func2:
            scores.append(len(func1 & func2) / max(len(func1 | func2), 1) * 100)

        # Compare classes
        class1 = set(sig1['classes'])
        class2 = set(sig2['classes'])
        if class1 or class2:
            scores.append(len(class1 & class2) / max(len(class1 | class2), 1) * 100)

        # Compare imports
        imp1 = set(sig1['imports'])
        imp2 = set(sig2['imports'])
        if imp1 or imp2:
            scores.append(len(imp1 & imp2) / max(len(imp1 | imp2), 1) * 100)

        return sum(scores) / len(scores) if scores else 0.0

    def analyze_file_group(self, files: List[Path]) -> Dict:
        """Analyze a group of potentially duplicate files"""
        result = {
            'files': [str(f.relative_to(self.root)) for f in files],
            'total_files': len(files),
            'recommendation': 'KEEP_ALL',
            'reason': '',
            'confidence': 0,
            'safe_to_remove': [],
            'must_keep': [],
        }

        if len(files) < 2:
            return result

        # 1. Check content hashes
        hashes = {}
        for f in files:
            if f.exists():
                h = self.get_file_hash(f)
                if h:
                    hashes[str(f)] = h

        # Group by hash
        hash_groups = defaultdict(list)
        for filepath, h in hashes.items():
            hash_groups[h].append(Path(filepath))

        # All identical content
        if len(hash_groups) == 1:
            # Check organizational context
            contexts = []
            for f in files:
                zone = self.org_context.get_zone(f)
                auto_dedupe = self.org_context.should_auto_dedupe(f)
                contexts.append({
                    'file': f,
                    'zone': zone,
                    'auto_dedupe': auto_dedupe,
                    'path_length': len(str(f))
                })

            # Find files safe to remove
            safe_to_remove = [ctx for ctx in contexts if ctx['auto_dedupe']]
            must_keep = [ctx for ctx in contexts if not ctx['auto_dedupe']]

            if not must_keep:
                # All are in auto-dedupe zones, keep shortest path
                must_keep = [min(contexts, key=lambda x: x['path_length'])]
                safe_to_remove = [ctx for ctx in contexts if ctx != must_keep[0]]

            if safe_to_remove:
                result['recommendation'] = 'SAFE_TO_DEDUPE'
                result['reason'] = '100% identical content, safe organizational context'
                result['confidence'] = 100
                result['safe_to_remove'] = [str(ctx['file'].relative_to(self.root)) for ctx in safe_to_remove]
                result['must_keep'] = [str(ctx['file'].relative_to(self.root)) for ctx in must_keep]
            else:
                result['recommendation'] = 'KEEP_ALL'
                result['reason'] = 'Identical content but all in critical zones'
                result['confidence'] = 50

            return result

        # 2. For Python files with different content, check functionality
        python_files = [f for f in files if f.suffix == '.py' and f.exists()]
        if len(python_files) >= 2:
            signatures = {}
            for f in python_files:
                sig = self.get_python_signature(f)
                if sig:
                    signatures[str(f)] = sig

            if len(signatures) >= 2:
                # Compare first two
                files_list = list(signatures.keys())
                sim = self.compare_signatures(signatures[files_list[0]], signatures[files_list[1]])

                if sim >= 95:
                    # Functionally identical, check context
                    same_purpose, purpose_reason = self.org_context.are_same_purpose(
                        Path(files_list[0]), Path(files_list[1])
                    )

                    if same_purpose:
                        result['recommendation'] = 'REVIEW_MANUAL'
                        result['reason'] = f'Functionally similar ({sim:.0f}%), {purpose_reason}'
                        result['confidence'] = 70
                    else:
                        result['recommendation'] = 'KEEP_ALL'
                        result['reason'] = f'Similar code but different purposes: {purpose_reason}'
                        result['confidence'] = 90
                elif sim >= 70:
                    result['recommendation'] = 'KEEP_ALL'
                    result['reason'] = f'Similar but has differences ({sim:.0f}% similar)'
                    result['confidence'] = 80
                else:
                    result['recommendation'] = 'KEEP_ALL'
                    result['reason'] = f'Functionally different ({sim:.0f}% similar)'
                    result['confidence'] = 100

                return result

        # 3. Different content, check if one is clearly a duplicate marker
        contexts = []
        for f in files:
            if f.exists():
                markers = self.org_context.get_context_markers(f)
                contexts.append({
                    'file': f,
                    'markers': markers,
                    'has_dup_marker': bool(markers & {'duplicate', 'backup', 'copy'})
                })

        marked_duplicates = [ctx for ctx in contexts if ctx['has_dup_marker']]
        unmarked = [ctx for ctx in contexts if not ctx['has_dup_marker']]

        if marked_duplicates and unmarked:
            result['recommendation'] = 'REVIEW_MANUAL'
            result['reason'] = 'Some files marked as duplicates but content differs'
            result['confidence'] = 60
            result['safe_to_remove'] = [str(ctx['file'].relative_to(self.root)) for ctx in marked_duplicates]
            result['must_keep'] = [str(ctx['file'].relative_to(self.root)) for ctx in unmarked]
        else:
            result['recommendation'] = 'KEEP_ALL'
            result['reason'] = 'Different content, unclear duplication'
            result['confidence'] = 90

        return result

    def scan_workspace(self, extensions: List[str] = None) -> Dict:
        """Scan entire workspace for duplicates"""
        print("Scanning workspace for potential duplicates...")

        # Find all files
        all_files = defaultdict(list)  # filename -> [paths]

        extensions = extensions or ['.py', '.js', '.md', '.json', '.html', '.css']

        for ext in extensions:
            pattern = f"**/*{ext}"
            for filepath in self.root.glob(pattern):
                if filepath.is_file():
                    # Skip hidden and build artifacts
                    if any(part.startswith('.') for part in filepath.parts):
                        continue
                    if 'node_modules' in filepath.parts:
                        continue
                    if '__pycache__' in filepath.parts:
                        continue

                    filename = filepath.name
                    all_files[filename].append(filepath)

        # Filter to only files with duplicates
        duplicate_groups = {name: paths for name, paths in all_files.items() if len(paths) > 1}

        print(f"Found {len(duplicate_groups)} filename groups with duplicates")

        # Analyze each group
        results = {
            'total_groups': len(duplicate_groups),
            'safe_to_dedupe': [],
            'needs_review': [],
            'keep_all': [],
            'total_files_scanned': sum(len(paths) for paths in all_files.values()),
        }

        for i, (filename, paths) in enumerate(duplicate_groups.items(), 1):
            if i % 50 == 0:
                print(f"  Analyzed {i}/{len(duplicate_groups)} groups...")

            analysis = self.analyze_file_group(paths)
            analysis['filename'] = filename

            if analysis['recommendation'] == 'SAFE_TO_DEDUPE':
                results['safe_to_dedupe'].append(analysis)
            elif analysis['recommendation'] == 'REVIEW_MANUAL':
                results['needs_review'].append(analysis)
            else:
                results['keep_all'].append(analysis)

        return results


def main():
    import argparse

    parser = argparse.ArgumentParser(description='Smart deduplication with organizational awareness')
    parser.add_argument('--root', default='.', help='Root directory to analyze')
    parser.add_argument('--output', default='smart_dedupe_report.json', help='Output report file')
    parser.add_argument('--extensions', default='.py,.js,.md,.json,.html,.css',
                       help='Comma-separated file extensions to analyze')

    args = parser.parse_args()

    print("="*80)
    print("Smart Deduplication Analyzer")
    print("="*80)
    print("Features:")
    print("  ✓ Content-based comparison (MD5)")
    print("  ✓ Functionality analysis (Python AST)")
    print("  ✓ Organizational context awareness")
    print("  ✓ Parent-folder purpose detection")
    print()

    extensions = [ext.strip() for ext in args.extensions.split(',')]

    analyzer = SmartDedupeAnalyzer(args.root)
    results = analyzer.scan_workspace(extensions)

    # Save full results
    with open(args.output, 'w') as f:
        json.dump(results, f, indent=2)

    # Print summary
    print()
    print("="*80)
    print("ANALYSIS SUMMARY")
    print("="*80)
    print(f"Total files scanned: {results['total_files_scanned']:,}")
    print(f"Duplicate filename groups: {results['total_groups']}")
    print()
    print(f"✅ Safe to deduplicate: {len(results['safe_to_dedupe'])} groups")
    print(f"⚠️  Needs manual review: {len(results['needs_review'])} groups")
    print(f"🔒 Keep all (different purposes): {len(results['keep_all'])} groups")
    print()

    # Calculate space savings
    total_savings = 0
    for group in results['safe_to_dedupe']:
        for filepath in group['safe_to_remove']:
            full_path = Path(args.root) / filepath
            if full_path.exists():
                total_savings += full_path.stat().st_size

    print(f"💾 Potential space savings: {total_savings / (1024*1024):.1f} MB")
    print()

    # Show top safe deletions
    if results['safe_to_dedupe']:
        print("Top Safe Deletions:")
        for group in results['safe_to_dedupe'][:10]:
            print(f"  ✅ {group['filename']}")
            print(f"     Remove: {', '.join(group['safe_to_remove'][:2])}")
            if len(group['safe_to_remove']) > 2:
                print(f"     ... and {len(group['safe_to_remove']) - 2} more")
            print(f"     Keep: {', '.join(group['must_keep'][:1])}")
            print()

    # Show items needing review
    if results['needs_review']:
        print("Needs Manual Review (examples):")
        for group in results['needs_review'][:5]:
            print(f"  ⚠️  {group['filename']}")
            print(f"     Reason: {group['reason']}")
            print()

    print(f"Full report saved to: {args.output}")
    print("="*80)

    # Create safe deletion CSV
    csv_file = 'smart_dedupe_safe_deletions.csv'
    with open(csv_file, 'w', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(['file', 'reason', 'confidence', 'group'])

        for group in results['safe_to_dedupe']:
            for filepath in group['safe_to_remove']:
                writer.writerow([
                    filepath,
                    group['reason'],
                    group['confidence'],
                    group['filename']
                ])

    print(f"✅ Safe deletions list: {csv_file}")
    print()


if __name__ == "__main__":
    main()
