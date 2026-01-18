#!/usr/bin/env python3
"""
Advanced Content-Aware ML Script Categorizer
============================================

Uses AST analysis, code embeddings, and ML clustering to categorize
Python scripts based on their actual code content and functionality,
not just file names.

Focus:
- Code structure (functions, classes, imports)
- Semantic similarity (code embeddings)
- Functional categorization (ML clustering)
- Deep code understanding (AST analysis)

Author: Auto-generated
Date: 2026-01-12
"""

import os
import sys
import ast
import json
import csv
from pathlib import Path
from typing import Dict, List, Tuple, Optional, Set
from collections import defaultdict, Counter
from datetime import datetime
import hashlib

# ML Libraries
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.cluster import KMeans, AgglomerativeClustering
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler

# Code Embeddings (if available)
try:
    from sentence_transformers import SentenceTransformer
    EMBEDDINGS_AVAILABLE = True
except ImportError:
    EMBEDDINGS_AVAILABLE = False
    print("⚠️  sentence-transformers not available - using TF-IDF only")


class ASTCodeAnalyzer:
    """Extract code structure using AST analysis"""

    def __init__(self):
        self.imports = []
        self.functions = []
        self.classes = []
        self.complexity = 0

    def analyze_file(self, filepath: Path) -> Dict:
        """Analyze Python file using AST"""
        try:
            with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()

            tree = ast.parse(content)
            analyzer = self._analyze_tree(tree)

            return {
                'filepath': str(filepath),
                'imports': analyzer['imports'],
                'functions': analyzer['functions'],
                'classes': analyzer['classes'],
                'complexity': analyzer['complexity'],
                'function_signatures': analyzer['function_signatures'],
                'class_methods': analyzer['class_methods'],
                'code_features': self._extract_code_features(tree),
                'code_text': self._normalize_code(content)
            }
        except Exception as e:
            return {
                'filepath': str(filepath),
                'error': str(e),
                'imports': [],
                'functions': [],
                'classes': [],
                'complexity': 0
            }

    def _analyze_tree(self, tree: ast.AST) -> Dict:
        """Analyze AST tree"""
        imports = []
        functions = []
        classes = []
        function_signatures = []
        class_methods = {}
        complexity = 0

        for node in ast.walk(tree):
            # Imports
            if isinstance(node, ast.Import):
                for alias in node.names:
                    imports.append(alias.name)
            elif isinstance(node, ast.ImportFrom):
                if node.module:
                    imports.append(node.module)

            # Functions
            elif isinstance(node, ast.FunctionDef):
                func_name = node.name
                func_args = [arg.arg for arg in node.args.args]
                functions.append(func_name)
                function_signatures.append({
                    'name': func_name,
                    'args': func_args,
                    'signature': f"{func_name}({','.join(func_args)})"
                })
                # Calculate complexity
                for child in ast.walk(node):
                    if isinstance(child, (ast.If, ast.While, ast.For, ast.Try, ast.With)):
                        complexity += 1

            # Classes
            elif isinstance(node, ast.ClassDef):
                class_name = node.name
                classes.append(class_name)
                methods = []
                for item in node.body:
                    if isinstance(item, ast.FunctionDef):
                        methods.append(item.name)
                class_methods[class_name] = methods

        return {
            'imports': imports,
            'functions': functions,
            'classes': classes,
            'complexity': complexity,
            'function_signatures': function_signatures,
            'class_methods': class_methods
        }

    def _extract_code_features(self, tree: ast.AST) -> Dict:
        """Extract code features for categorization"""
        features = {
            'uses_async': False,
            'uses_generators': False,
            'uses_decorators': False,
            'uses_context_managers': False,
            'has_main': False,
            'has_tests': False
        }

        for node in ast.walk(tree):
            if isinstance(node, ast.AsyncFunctionDef):
                features['uses_async'] = True
            if isinstance(node, (ast.Yield, ast.YieldFrom)):
                features['uses_generators'] = True
            if isinstance(node, ast.FunctionDef) and node.decorator_list:
                features['uses_decorators'] = True
            if isinstance(node, ast.With):
                features['uses_context_managers'] = True
            if isinstance(node, ast.FunctionDef) and node.name == '__main__':
                features['has_main'] = True
            if isinstance(node, ast.FunctionDef) and 'test' in node.name.lower():
                features['has_tests'] = True

        return features

    def _normalize_code(self, code: str) -> str:
        """Normalize code for similarity analysis"""
        lines = []
        for line in code.splitlines():
            line = line.strip()
            if line and not line.startswith('#'):
                # Remove comments
                if '#' in line:
                    line = line.split('#')[0].strip()
                if line:
                    lines.append(line)
        return '\n'.join(lines)


class ContentAwareMLCategorizer:
    """Advanced content-aware ML categorizer"""

    def __init__(self, base_dir: Path, use_embeddings: bool = True):
        self.base_dir = Path(base_dir).expanduser()
        self.use_embeddings = use_embeddings and EMBEDDINGS_AVAILABLE
        self.ast_analyzer = ASTCodeAnalyzer()

        # ML components
        self.vectorizer = TfidfVectorizer(max_features=5000, stop_words='english')
        self.embedding_model = None

        if self.use_embeddings:
            print("🤖 Loading code embedding model...")
            try:
                # Use smaller model for speed, or code-specific model
                self.embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
                print("✅ Embedding model loaded")
            except Exception as e:
                print(f"⚠️  Could not load embedding model: {e}")
                self.use_embeddings = False

        # Data storage
        self.files = []
        self.ast_data = []
        self.features = []
        self.embeddings = None
        self.categories = []

    def scan_files(self, max_files: Optional[int] = None) -> List[Path]:
        """Scan all Python files recursively"""
        print(f"🔍 Scanning {self.base_dir} for Python files...")

        files = list(self.base_dir.rglob("*.py"))

        # Filter out common excluded directories
        exclude_patterns = [
            '__pycache__', '.pytest_cache', '.mypy_cache',
            '.venv', 'venv', '.git', 'node_modules',
            'dist', 'build', '.eggs'
        ]

        filtered_files = []
        for f in files:
            if not any(pattern in str(f) for pattern in exclude_patterns):
                try:
                    if f.is_file() and f.stat().st_size > 0:
                        filtered_files.append(f)
                except:
                    pass

        if max_files:
            filtered_files = filtered_files[:max_files]

        print(f"✅ Found {len(filtered_files)} Python files")
        self.files = filtered_files
        return filtered_files

    def extract_features(self) -> np.ndarray:
        """Extract features from all files"""
        print(f"\n📊 Extracting features from {len(self.files)} files...")

        ast_data = []
        code_texts = []
        feature_texts = []

        for i, filepath in enumerate(self.files):
            if (i + 1) % 100 == 0:
                print(f"   Processing {i + 1}/{len(self.files)} files...")

            # AST analysis
            ast_info = self.ast_analyzer.analyze_file(filepath)
            ast_data.append(ast_info)

            if 'error' not in ast_info:
                # Create feature text (code structure + content)
                feature_parts = []

                # Imports
                feature_parts.extend([f"import_{imp}" for imp in ast_info['imports'][:10]])

                # Functions
                feature_parts.extend([f"func_{func}" for func in ast_info['functions'][:20]])

                # Classes
                feature_parts.extend([f"class_{cls}" for cls in ast_info['classes'][:10]])

                # Function signatures
                for sig in ast_info['function_signatures'][:10]:
                    feature_parts.append(sig['signature'])

                # Code features
                features = ast_info['code_features']
                if features['uses_async']:
                    feature_parts.append("async_code")
                if features['uses_generators']:
                    feature_parts.append("generators")
                if features['has_main']:
                    feature_parts.append("main_script")

                feature_texts.append(' '.join(feature_parts))
                code_texts.append(ast_info['code_text'][:5000])  # Limit size
            else:
                feature_texts.append("")
                code_texts.append("")

        self.ast_data = ast_data

        # Combine feature text and code text
        combined_texts = [f"{ft} {ct}" for ft, ct in zip(feature_texts, code_texts)]

        # TF-IDF features
        print("   Computing TF-IDF features...")
        tfidf_features = self.vectorizer.fit_transform(combined_texts)

        # Code embeddings (if available)
        if self.use_embeddings and self.embedding_model:
            print("   Computing code embeddings...")
            try:
                # Use code text for embeddings (semantic similarity)
                embeddings = self.embedding_model.encode(code_texts, show_progress_bar=True)
                self.embeddings = embeddings

                # Combine TF-IDF and embeddings
                from scipy.sparse import hstack
                if tfidf_features.shape[0] == embeddings.shape[0]:
                    # Normalize embeddings
                    from sklearn.preprocessing import normalize
                    embeddings_normalized = normalize(embeddings, norm='l2')
                    # Combine
                    combined_features = hstack([tfidf_features, embeddings_normalized])
                else:
                    combined_features = tfidf_features
            except Exception as e:
                print(f"⚠️  Embedding error: {e}, using TF-IDF only")
                combined_features = tfidf_features
        else:
            combined_features = tfidf_features

        # Convert to dense array if sparse
        if hasattr(combined_features, 'toarray'):
            combined_features = combined_features.toarray()

        self.features = combined_features
        print(f"✅ Feature extraction complete: {combined_features.shape}")
        return combined_features

    def categorize(self, n_clusters: Optional[int] = None) -> np.ndarray:
        """Categorize files using ML clustering"""
        print(f"\n🎯 Categorizing {len(self.files)} files using ML...")

        if n_clusters is None:
            # Estimate number of clusters (heuristic: sqrt(n/2))
            n_clusters = max(10, int(np.sqrt(len(self.files) / 2)))
            print(f"   Using {n_clusters} clusters (auto-estimated)")

        # Use KMeans clustering
        kmeans = KMeans(n_clusters=n_clusters, random_state=42, n_init=10, max_iter=300)
        categories = kmeans.fit_predict(self.features)

        self.categories = categories

        # Count files per category
        category_counts = Counter(categories)
        print(f"✅ Categorization complete!")
        print(f"   Categories: {len(category_counts)}")
        print(f"   Files per category: min={min(category_counts.values())}, max={max(category_counts.values())}")

        return categories

    def analyze_categories(self) -> Dict:
        """Analyze categories to understand them"""
        print(f"\n📊 Analyzing categories...")

        category_analysis = defaultdict(lambda: {
            'files': [],
            'common_imports': Counter(),
            'common_functions': Counter(),
            'common_classes': Counter(),
            'avg_complexity': 0.0,
            'code_features': Counter()
        })

        for i, (filepath, ast_info, category) in enumerate(zip(self.files, self.ast_data, self.categories)):
            cat_data = category_analysis[category]
            cat_data['files'].append(str(filepath.relative_to(self.base_dir)))

            if 'error' not in ast_info:
                cat_data['common_imports'].update(ast_info['imports'][:10])
                cat_data['common_functions'].update(ast_info['functions'][:20])
                cat_data['common_classes'].update(ast_info['classes'][:10])
                cat_data['avg_complexity'] += ast_info['complexity']

                # Code features
                features = ast_info['code_features']
                if features['uses_async']:
                    cat_data['code_features']['async'] += 1
                if features['uses_generators']:
                    cat_data['code_features']['generators'] += 1
                if features['has_main']:
                    cat_data['code_features']['main_script'] += 1

        # Calculate averages
        for cat_id, cat_data in category_analysis.items():
            if cat_data['files']:
                cat_data['avg_complexity'] /= len(cat_data['files'])

        # Generate category names based on common patterns
        category_names = {}
        for cat_id, cat_data in category_analysis.items():
            name_parts = []

            # Top imports
            top_imports = [imp for imp, _ in cat_data['common_imports'].most_common(3)]
            if top_imports:
                name_parts.append(top_imports[0].split('.')[0])

            # Top functions
            top_funcs = [func for func, _ in cat_data['common_functions'].most_common(3)]
            if top_funcs:
                # Extract function name pattern
                if any('clean' in f.lower() for f in top_funcs):
                    name_parts.append("cleanup")
                elif any('organize' in f.lower() for f in top_funcs):
                    name_parts.append("organization")
                elif any('analyze' in f.lower() for f in top_funcs):
                    name_parts.append("analysis")

            # Code features
            if cat_data['code_features']['async'] > len(cat_data['files']) * 0.5:
                name_parts.append("async")
            if cat_data['code_features']['main_script'] > len(cat_data['files']) * 0.5:
                name_parts.append("scripts")

            category_name = "_".join(name_parts[:3]) if name_parts else f"category_{cat_id}"
            category_names[cat_id] = category_name

        self.category_names = category_names
        self.category_analysis = category_analysis

        print(f"✅ Category analysis complete!")
        return category_analysis

    def generate_report(self, output_dir: Path) -> Dict:
        """Generate comprehensive report"""
        print(f"\n📄 Generating report...")

        output_dir = Path(output_dir)
        output_dir.mkdir(parents=True, exist_ok=True)

        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")

        # JSON report
        json_report = {
            'timestamp': timestamp,
            'base_directory': str(self.base_dir),
            'total_files': len(self.files),
            'categories': len(self.category_names),
            'files_by_category': {},
            'category_details': {}
        }

        for cat_id, cat_data in self.category_analysis.items():
            cat_name = self.category_names[cat_id]
            json_report['files_by_category'][cat_name] = cat_data['files']
            json_report['category_details'][cat_name] = {
                'file_count': len(cat_data['files']),
                'top_imports': dict(cat_data['common_imports'].most_common(10)),
                'top_functions': dict(cat_data['common_functions'].most_common(10)),
                'top_classes': dict(cat_data['common_classes'].most_common(10)),
                'avg_complexity': cat_data['avg_complexity'],
                'code_features': dict(cat_data['code_features'])
            }

        json_path = output_dir / f"ml_categorization_{timestamp}.json"
        with open(json_path, 'w') as f:
            json.dump(json_report, f, indent=2)

        # CSV report
        csv_path = output_dir / f"ml_categorization_{timestamp}.csv"
        with open(csv_path, 'w', newline='') as f:
            writer = csv.writer(f)
            writer.writerow(['File', 'Category', 'Category_ID', 'Complexity', 'Functions', 'Classes', 'Top_Imports'])

            for filepath, ast_info, category in zip(self.files, self.ast_data, self.categories):
                rel_path = filepath.relative_to(self.base_dir)
                cat_name = self.category_names[category]

                if 'error' not in ast_info:
                    writer.writerow([
                        str(rel_path),
                        cat_name,
                        category,
                        ast_info['complexity'],
                        len(ast_info['functions']),
                        len(ast_info['classes']),
                        ', '.join(ast_info['imports'][:5])
                    ])
                else:
                    writer.writerow([str(rel_path), cat_name, category, 0, 0, 0, 'error'])

        # Summary report (Markdown)
        md_path = output_dir / f"ml_categorization_{timestamp}.md"
        with open(md_path, 'w') as f:
            f.write(f"# ML Script Categorization Report\n\n")
            f.write(f"**Date:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n")
            f.write(f"**Base Directory:** `{self.base_dir}`\n\n")
            f.write(f"**Total Files:** {len(self.files)}\n\n")
            f.write(f"**Categories:** {len(self.category_names)}\n\n")

            f.write("## Categories\n\n")
            for cat_id, cat_data in sorted(self.category_analysis.items()):
                cat_name = self.category_names[cat_id]
                f.write(f"### {cat_name} (Category {cat_id})\n\n")
                f.write(f"- **Files:** {len(cat_data['files'])}\n")
                f.write(f"- **Avg Complexity:** {cat_data['avg_complexity']:.1f}\n")

                top_imports = cat_data['common_imports'].most_common(5)
                if top_imports:
                    f.write(f"- **Top Imports:** {', '.join([imp for imp, _ in top_imports])}\n")

                top_funcs = cat_data['common_functions'].most_common(5)
                if top_funcs:
                    f.write(f"- **Top Functions:** {', '.join([func for func, _ in top_funcs])}\n")

                f.write(f"\n**Files:**\n")
                for file in cat_data['files'][:20]:
                    f.write(f"- `{file}`\n")
                if len(cat_data['files']) > 20:
                    f.write(f"- ... and {len(cat_data['files']) - 20} more\n")
                f.write("\n")

        print(f"✅ Report generated:")
        print(f"   JSON: {json_path}")
        print(f"   CSV: {csv_path}")
        print(f"   Markdown: {md_path}")

        return {
            'json': json_path,
            'csv': csv_path,
            'markdown': md_path
        }


def main():
    """Main function"""
    import argparse

    parser = argparse.ArgumentParser(
        description='Advanced Content-Aware ML Script Categorizer'
    )
    parser.add_argument(
        '--dir',
        type=str,
        default='~/pythons',
        help='Directory to analyze (default: ~/pythons)'
    )
    parser.add_argument(
        '--output',
        type=str,
        default='./ml_categorization_output',
        help='Output directory (default: ./ml_categorization_output)'
    )
    parser.add_argument(
        '--clusters',
        type=int,
        default=None,
        help='Number of clusters (default: auto-estimated)'
    )
    parser.add_argument(
        '--max-files',
        type=int,
        default=None,
        help='Maximum number of files to process (default: all)'
    )
    parser.add_argument(
        '--no-embeddings',
        action='store_true',
        help='Disable code embeddings (use TF-IDF only)'
    )

    args = parser.parse_args()

    print("=" * 70)
    print("🧠 Advanced Content-Aware ML Script Categorizer")
    print("=" * 70)
    print()

    # Initialize categorizer
    categorizer = ContentAwareMLCategorizer(
        base_dir=Path(args.dir).expanduser(),
        use_embeddings=not args.no_embeddings
    )

    # Scan files
    categorizer.scan_files(max_files=args.max_files)

    if not categorizer.files:
        print("❌ No Python files found!")
        return

    # Extract features
    categorizer.extract_features()

    # Categorize
    categorizer.categorize(n_clusters=args.clusters)

    # Analyze categories
    categorizer.analyze_categories()

    # Generate report
    output_path = Path(args.output).expanduser()
    categorizer.generate_report(output_path)

    print()
    print("=" * 70)
    print("✅ ML Categorization Complete!")
    print("=" * 70)
    print(f"\n📊 Summary:")
    print(f"   Files analyzed: {len(categorizer.files)}")
    print(f"   Categories created: {len(categorizer.category_names)}")
    print(f"   Reports saved to: {output_path}")
    print()


if __name__ == '__main__':
    main()
