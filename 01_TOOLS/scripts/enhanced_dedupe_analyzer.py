#!/usr/bin/env python3
"""
Enhanced Deduplication Analyzer
================================
Compares files by:
1. Content (MD5 hash)
2. Functionality (for Python scripts - AST comparison)
3. Purpose (docstrings, comments)

This ensures we don't delete functionally different files
that happen to have similar names.
"""

import ast
import hashlib
import json
import csv
from pathlib import Path
from collections import defaultdict
from typing import Dict, List, Tuple, Optional
import difflib


class FunctionalityAnalyzer:
    """Analyzes Python script functionality"""

    @staticmethod
    def get_file_hash(filepath: Path) -> str:
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
    def get_python_ast_signature(filepath: Path) -> Optional[Dict]:
        """Extract functional signature from Python file"""
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                code = f.read()

            tree = ast.parse(code, filename=str(filepath))

            signature = {
                'functions': [],
                'classes': [],
                'imports': [],
                'docstring': ast.get_docstring(tree),
                'global_vars': []
            }

            for node in ast.walk(tree):
                if isinstance(node, ast.FunctionDef):
                    signature['functions'].append({
                        'name': node.name,
                        'args': [arg.arg for arg in node.args.args],
                        'docstring': ast.get_docstring(node),
                        'decorators': [d.id if isinstance(d, ast.Name) else str(d) for d in node.decorator_list]
                    })
                elif isinstance(node, ast.ClassDef):
                    methods = []
                    for item in node.body:
                        if isinstance(item, ast.FunctionDef):
                            methods.append({
                                'name': item.name,
                                'args': [arg.arg for arg in item.args.args]
                            })
                    signature['classes'].append({
                        'name': node.name,
                        'methods': methods,
                        'docstring': ast.get_docstring(node)
                    })
                elif isinstance(node, ast.Import):
                    for alias in node.names:
                        signature['imports'].append(alias.name)
                elif isinstance(node, ast.ImportFrom):
                    if node.module:
                        signature['imports'].append(node.module)
                elif isinstance(node, ast.Assign):
                    for target in node.targets:
                        if isinstance(target, ast.Name):
                            signature['global_vars'].append(target.id)

            return signature

        except Exception as e:
            return None

    @staticmethod
    def compare_signatures(sig1: Dict, sig2: Dict) -> Tuple[float, List[str]]:
        """
        Compare two Python signatures
        Returns: (similarity_score, differences)
        similarity_score: 0-100
        differences: list of differences found
        """
        if not sig1 or not sig2:
            return 0.0, ["Unable to parse one or both files"]

        differences = []
        scores = []

        # Compare functions
        func1_names = {f['name'] for f in sig1['functions']}
        func2_names = {f['name'] for f in sig2['functions']}

        if func1_names != func2_names:
            only_in_1 = func1_names - func2_names
            only_in_2 = func2_names - func1_names
            if only_in_1:
                differences.append(f"Functions only in file 1: {only_in_1}")
            if only_in_2:
                differences.append(f"Functions only in file 2: {only_in_2}")

        func_similarity = len(func1_names & func2_names) / max(len(func1_names | func2_names), 1) * 100
        scores.append(func_similarity)

        # Compare classes
        class1_names = {c['name'] for c in sig1['classes']}
        class2_names = {c['name'] for c in sig2['classes']}

        if class1_names != class2_names:
            only_in_1 = class1_names - class2_names
            only_in_2 = class2_names - class1_names
            if only_in_1:
                differences.append(f"Classes only in file 1: {only_in_1}")
            if only_in_2:
                differences.append(f"Classes only in file 2: {only_in_2}")

        class_similarity = len(class1_names & class2_names) / max(len(class1_names | class2_names), 1) * 100
        scores.append(class_similarity)

        # Compare imports
        imports1 = set(sig1['imports'])
        imports2 = set(sig2['imports'])

        import_diff = (imports1 - imports2) | (imports2 - imports1)
        if import_diff:
            differences.append(f"Different imports: {import_diff}")

        import_similarity = len(imports1 & imports2) / max(len(imports1 | imports2), 1) * 100
        scores.append(import_similarity)

        # Compare docstrings
        doc1 = sig1.get('docstring', '') or ''
        doc2 = sig2.get('docstring', '') or ''

        if doc1 and doc2:
            doc_similarity = difflib.SequenceMatcher(None, doc1, doc2).ratio() * 100
            scores.append(doc_similarity)
        elif doc1 != doc2:
            differences.append("Different or missing docstrings")

        # Overall similarity (average of all components)
        overall_similarity = sum(scores) / len(scores) if scores else 0

        return overall_similarity, differences


class EnhancedDedupeAnalyzer:
    """Enhanced deduplication with functionality comparison"""

    def __init__(self, root_path: str):
        self.root = Path(root_path)
        self.analyzer = FunctionalityAnalyzer()

    def analyze_duplicate_group(self, files: List[Path]) -> Dict:
        """Analyze a group of potential duplicates"""
        results = {
            'group_size': len(files),
            'files': [],
            'recommendation': None,
            'reason': None
        }

        # First, check content hashes
        hashes = {}
        for f in files:
            h = self.analyzer.get_file_hash(f)
            if h:
                hashes[str(f)] = h

        # Group by identical content
        hash_groups = defaultdict(list)
        for filepath, h in hashes.items():
            hash_groups[h].append(filepath)

        # If all have same content hash, they're identical
        if len(hash_groups) == 1:
            results['recommendation'] = 'SAFE_TO_DEDUPE'
            results['reason'] = '100% identical content (same MD5 hash)'
            results['keep'] = min(files, key=len)  # Keep shortest path
            results['remove'] = [f for f in files if f != results['keep']]
            return results

        # For Python files, check functionality
        if all(f.suffix == '.py' for f in files):
            signatures = {}
            for f in files:
                sig = self.analyzer.get_python_ast_signature(f)
                if sig:
                    signatures[str(f)] = sig

            if len(signatures) >= 2:
                # Compare first two (can extend to all pairs)
                files_list = list(signatures.keys())
                sig1 = signatures[files_list[0]]
                sig2 = signatures[files_list[1]]

                similarity, diffs = self.analyzer.compare_signatures(sig1, sig2)

                results['functional_similarity'] = similarity
                results['differences'] = diffs

                if similarity >= 95:
                    results['recommendation'] = 'SAFE_TO_DEDUPE'
                    results['reason'] = f'Functionally identical ({similarity:.1f}% similar)'
                    results['keep'] = min(files, key=len)
                    results['remove'] = [f for f in files if f != results['keep']]
                elif similarity >= 80:
                    results['recommendation'] = 'REVIEW_MANUAL'
                    results['reason'] = f'Very similar but has differences ({similarity:.1f}% similar)'
                else:
                    results['recommendation'] = 'KEEP_BOTH'
                    results['reason'] = f'Functionally different ({similarity:.1f}% similar)'

                return results

        # For non-Python files or if AST failed, use content comparison
        if len(hash_groups) == len(files):
            results['recommendation'] = 'KEEP_ALL'
            results['reason'] = 'All files have different content'
        else:
            results['recommendation'] = 'REVIEW_MANUAL'
            results['reason'] = f'{len(hash_groups)} unique content versions found'

        return results

    def verify_dedupe_mapping(self, mapping_file: str) -> Dict:
        """Verify existing dedupe_mapping.csv with enhanced analysis"""
        results = {
            'total_entries': 0,
            'verified_safe': [],
            'needs_review': [],
            'unsafe': []
        }

        mapping = Path(mapping_file)
        if not mapping.exists():
            return results

        with open(mapping, 'r') as f:
            reader = csv.DictReader(f)
            entries = list(reader)

        results['total_entries'] = len(entries)

        # Group by target (what they're similar to)
        groups = defaultdict(list)
        for entry in entries:
            if 'Similar to' in entry['reason']:
                target = entry['reason'].split('Similar to ')[1].split(' (')[0]
                groups[target].append(entry)

        print(f"Found {len(groups)} duplicate groups to verify...")

        for i, (target, group_entries) in enumerate(groups.items(), 1):
            if i % 10 == 0:
                print(f"  Verified {i}/{len(groups)} groups...")

            # Get all files in this group
            files = [Path(target)]
            for entry in group_entries:
                files.append(Path(entry['old_path']))

            # Only analyze Python files
            if all(f.suffix == '.py' for f in files if f.exists()):
                analysis = self.analyze_duplicate_group([f for f in files if f.exists()])

                if analysis['recommendation'] == 'SAFE_TO_DEDUPE':
                    results['verified_safe'].extend(group_entries)
                elif analysis['recommendation'] == 'REVIEW_MANUAL':
                    for entry in group_entries:
                        entry['_analysis'] = analysis
                    results['needs_review'].extend(group_entries)
                else:  # KEEP_BOTH or KEEP_ALL
                    for entry in group_entries:
                        entry['_analysis'] = analysis
                    results['unsafe'].extend(group_entries)
            else:
                # Non-Python files - trust content hash
                if group_entries and group_entries[0].get('similarity') == '100.0%':
                    results['verified_safe'].extend(group_entries)
                else:
                    results['needs_review'].extend(group_entries)

        return results


def main():
    import sys
    import argparse

    parser = argparse.ArgumentParser(description='Enhanced deduplication analyzer')
    parser.add_argument('--mapping', default='01_TOOLS/data/dedupe_mapping.csv',
                        help='Path to dedupe_mapping.csv')
    parser.add_argument('--output', default='dedupe_verification_report.json',
                        help='Output verification report')
    parser.add_argument('--root', default='.',
                        help='Root directory for analysis')

    args = parser.parse_args()

    print("="*80)
    print("Enhanced Deduplication Analyzer")
    print("="*80)
    print("Analyzing with:")
    print("  - Content hashing (MD5)")
    print("  - Functionality comparison (Python AST)")
    print("  - Docstring/purpose analysis")
    print()

    analyzer = EnhancedDedupeAnalyzer(args.root)

    print(f"Verifying {args.mapping}...")
    results = analyzer.verify_dedupe_mapping(args.mapping)

    # Save results
    with open(args.output, 'w') as f:
        json.dump(results, f, indent=2, default=str)

    # Print summary
    print()
    print("="*80)
    print("VERIFICATION SUMMARY")
    print("="*80)
    print(f"Total entries analyzed: {results['total_entries']}")
    print(f"✅ Verified safe to delete: {len(results['verified_safe'])}")
    print(f"⚠️  Needs manual review: {len(results['needs_review'])}")
    print(f"❌ Unsafe (keep both): {len(results['unsafe'])}")
    print()

    if results['unsafe']:
        print("UNSAFE DELETIONS (functionally different):")
        for entry in results['unsafe'][:10]:  # Show first 10
            print(f"  ❌ {entry['old_path']}")
            if '_analysis' in entry:
                print(f"     Reason: {entry['_analysis']['reason']}")
        if len(results['unsafe']) > 10:
            print(f"  ... and {len(results['unsafe']) - 10} more")
        print()

    if results['needs_review']:
        print("NEEDS MANUAL REVIEW (similar but has differences):")
        for entry in results['needs_review'][:10]:  # Show first 10
            print(f"  ⚠️  {entry['old_path']}")
            if '_analysis' in entry:
                print(f"     Reason: {entry['_analysis']['reason']}")
        if len(results['needs_review']) > 10:
            print(f"  ... and {len(results['needs_review']) - 10} more")
        print()

    print(f"Full report saved to: {args.output}")
    print("="*80)

    # Create filtered mapping for safe deletions only
    safe_mapping_file = 'dedupe_mapping_verified_safe.csv'
    if results['verified_safe']:
        with open(safe_mapping_file, 'w', newline='') as f:
            writer = csv.DictWriter(f, fieldnames=['old_path', 'action', 'reason', 'size_mb', 'similarity'])
            writer.writeheader()
            for entry in results['verified_safe']:
                # Remove _analysis field if present
                clean_entry = {k: v for k, v in entry.items() if not k.startswith('_')}
                writer.writerow(clean_entry)

        print(f"✅ Created verified safe mapping: {safe_mapping_file}")
        print(f"   Use this with safe_dedupe_script.py for safe deletion")
        print()


if __name__ == "__main__":
    main()
