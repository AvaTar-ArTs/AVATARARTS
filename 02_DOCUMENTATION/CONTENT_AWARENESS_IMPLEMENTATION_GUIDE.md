# Content-Awareness Intelligence: Technical Implementation Guide

## Overview

This guide details the implementation of advanced content-awareness intelligence for Python codebases, focusing on **semantic understanding**, **relationship mapping**, and **adaptive organization**.

---

## Architecture: Five-Layer Intelligence Stack

```
┌─────────────────────────────────────────────────────────────┐
│ Layer 5: Adaptive Learning & Recommendation Engine          │
│ • Usage pattern analysis • Confidence scoring • Evolution   │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ Layer 4: Semantic Understanding & Classification            │
│ • Multi-label categorization • Context detection • Quality  │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ Layer 3: Relationship & Dependency Mapping                  │
│ • Import graphs • Cross-references • Pattern detection      │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ Layer 2: Deep Structural Analysis (AST)                     │
│ • Function extraction • Class hierarchy • Complexity metrics│
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ Layer 1: Content Ingestion & Preprocessing                  │
│ • File reading • Encoding detection • Content sampling      │
└─────────────────────────────────────────────────────────────┘
```

---

## Layer 1: Content Ingestion & Preprocessing

### Smart File Reading with Encoding Detection

```python
import chardet
from pathlib import Path
from typing import Optional, Dict, Any

class ContentReader:
    """Intelligent file reading with encoding detection and error handling."""

    MAX_CONTENT_SIZE = 2 * 1024 * 1024  # 2MB
    SAMPLE_SIZE = 50 * 1024  # 50KB for large files

    @staticmethod
    def detect_encoding(file_path: Path) -> str:
        """Detect file encoding using chardet."""
        with open(file_path, 'rb') as f:
            raw_data = f.read(10000)  # Sample first 10KB
            result = chardet.detect(raw_data)
            return result['encoding'] or 'utf-8'

    @classmethod
    def read_content(cls, file_path: Path) -> Optional[str]:
        """Read file content with intelligent sampling for large files."""
        try:
            file_size = file_path.stat().st_size
            encoding = cls.detect_encoding(file_path)

            if file_size <= cls.MAX_CONTENT_SIZE:
                # Read entire file
                with open(file_path, 'r', encoding=encoding, errors='ignore') as f:
                    return f.read()
            else:
                # Strategic sampling: beginning + end
                with open(file_path, 'r', encoding=encoding, errors='ignore') as f:
                    beginning = f.read(cls.SAMPLE_SIZE)
                    f.seek(max(0, file_size - cls.SAMPLE_SIZE))
                    end = f.read(cls.SAMPLE_SIZE)
                    return f"{beginning}\n\n[... CONTENT TRUNCATED ...]\n\n{end}"

        except Exception as e:
            print(f"Error reading {file_path}: {e}")
            return None

    @staticmethod
    def compute_content_hash(content: str) -> str:
        """Generate content hash for duplicate detection."""
        import hashlib
        return hashlib.sha256(content.encode('utf-8')).hexdigest()
```

### Usage Example

```python
reader = ContentReader()
content = reader.read_content(Path("~/pythons/my_script.py"))
content_hash = reader.compute_content_hash(content)
print(f"File hash: {content_hash[:16]}...")
```

---

## Layer 2: Deep Structural Analysis (AST)

### Python AST Parser for Code Intelligence

```python
import ast
from typing import List, Dict, Set
from dataclasses import dataclass

@dataclass
class CodeStructure:
    """Represents the structural elements of a Python file."""
    functions: List[str]
    classes: List[str]
    imports: List[str]
    global_vars: List[str]
    complexity_score: int
    docstring: Optional[str] = None

class ASTAnalyzer:
    """Advanced AST analysis for deep code understanding."""

    @staticmethod
    def analyze_file(file_path: Path) -> Optional[CodeStructure]:
        """Extract structural information using AST."""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                tree = ast.parse(f.read(), filename=str(file_path))

            analyzer = ASTAnalyzer()
            return CodeStructure(
                functions=analyzer._extract_functions(tree),
                classes=analyzer._extract_classes(tree),
                imports=analyzer._extract_imports(tree),
                global_vars=analyzer._extract_globals(tree),
                complexity_score=analyzer._calculate_complexity(tree),
                docstring=ast.get_docstring(tree)
            )

        except SyntaxError as e:
            print(f"Syntax error in {file_path}: {e}")
            return None
        except Exception as e:
            print(f"Error analyzing {file_path}: {e}")
            return None

    @staticmethod
    def _extract_functions(tree: ast.AST) -> List[str]:
        """Extract all function names."""
        return [node.name for node in ast.walk(tree)
                if isinstance(node, ast.FunctionDef)]

    @staticmethod
    def _extract_classes(tree: ast.AST) -> List[str]:
        """Extract all class names."""
        return [node.name for node in ast.walk(tree)
                if isinstance(node, ast.ClassDef)]

    @staticmethod
    def _extract_imports(tree: ast.AST) -> List[str]:
        """Extract all import statements."""
        imports = []
        for node in ast.walk(tree):
            if isinstance(node, ast.Import):
                imports.extend([alias.name for alias in node.names])
            elif isinstance(node, ast.ImportFrom):
                module = node.module or ''
                imports.extend([f"{module}.{alias.name}" for alias in node.names])
        return imports

    @staticmethod
    def _extract_globals(tree: ast.AST) -> List[str]:
        """Extract global variable assignments."""
        globals_vars = []
        for node in tree.body:
            if isinstance(node, ast.Assign):
                for target in node.targets:
                    if isinstance(target, ast.Name):
                        globals_vars.append(target.id)
        return globals_vars

    @staticmethod
    def _calculate_complexity(tree: ast.AST) -> int:
        """Calculate cyclomatic complexity (simplified)."""
        complexity = 0
        for node in ast.walk(tree):
            if isinstance(node, (ast.If, ast.For, ast.While, ast.ExceptHandler)):
                complexity += 1
            elif isinstance(node, ast.BoolOp):
                complexity += len(node.values) - 1
        return complexity
```

### Advanced Pattern Detection

```python
class PatternDetector:
    """Detect architectural patterns in code."""

    PATTERNS = {
        'mvc': ['model', 'view', 'controller'],
        'repository': ['repository', 'dao', 'data_access'],
        'factory': ['factory', 'create', 'builder'],
        'singleton': ['singleton', 'instance', '__new__'],
        'observer': ['observer', 'subscribe', 'notify', 'listener'],
        'decorator': ['decorator', 'wrapper', 'wrap']
    }

    @classmethod
    def detect_patterns(cls, structure: CodeStructure) -> Set[str]:
        """Detect architectural patterns in code structure."""
        detected = set()

        # Combine all names for analysis
        all_names = (
            structure.functions +
            structure.classes +
            structure.global_vars
        )
        all_names_lower = [name.lower() for name in all_names]

        # Check each pattern
        for pattern_name, keywords in cls.PATTERNS.items():
            if any(keyword in name for name in all_names_lower
                   for keyword in keywords):
                detected.add(pattern_name)

        return detected
```

---

## Layer 3: Relationship & Dependency Mapping

### Import Graph Builder

```python
import networkx as nx
from collections import defaultdict

class DependencyGraph:
    """Build and analyze import dependency graphs."""

    def __init__(self):
        self.graph = nx.DiGraph()
        self.file_imports = defaultdict(set)

    def add_file(self, file_path: Path, imports: List[str]):
        """Add file and its imports to the graph."""
        file_name = file_path.name
        self.graph.add_node(file_name, path=str(file_path))
        self.file_imports[file_name] = set(imports)

        # Add edges for imports
        for imp in imports:
            # Extract module name
            module = imp.split('.')[0]
            self.graph.add_edge(file_name, module, import_type='module')

    def find_circular_dependencies(self) -> List[List[str]]:
        """Detect circular dependencies."""
        try:
            cycles = list(nx.simple_cycles(self.graph))
            return cycles
        except:
            return []

    def get_dependency_depth(self, file_name: str) -> int:
        """Calculate dependency depth for a file."""
        if file_name not in self.graph:
            return 0

        try:
            # Find longest path from this node
            lengths = nx.single_source_shortest_path_length(self.graph, file_name)
            return max(lengths.values()) if lengths else 0
        except:
            return 0

    def find_hub_files(self, top_n: int = 10) -> List[tuple]:
        """Find most connected files (hubs)."""
        degree_centrality = nx.degree_centrality(self.graph)
        sorted_nodes = sorted(degree_centrality.items(),
                            key=lambda x: x[1], reverse=True)
        return sorted_nodes[:top_n]

    def visualize(self, output_path: Path):
        """Generate graph visualization."""
        import matplotlib.pyplot as plt

        plt.figure(figsize=(12, 8))
        pos = nx.spring_layout(self.graph)
        nx.draw(self.graph, pos, with_labels=True,
                node_color='lightblue', node_size=500,
                font_size=8, arrows=True)
        plt.title("Code Dependency Graph")
        plt.savefig(output_path)
        plt.close()
```

---

## Layer 4: Semantic Understanding & Classification

### Multi-Label Semantic Classifier

```python
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

class SemanticClassifier:
    """ML-powered semantic classification using embeddings."""

    CATEGORIES = {
        'ai_ml': [
            'machine learning', 'neural network', 'model training',
            'tensorflow', 'pytorch', 'scikit-learn', 'embeddings'
        ],
        'web_dev': [
            'flask', 'django', 'fastapi', 'api endpoint',
            'http request', 'web server', 'routes'
        ],
        'data_analysis': [
            'pandas', 'numpy', 'data processing', 'csv',
            'dataframe', 'analysis', 'statistics'
        ],
        'automation': [
            'selenium', 'playwright', 'scraping', 'bot',
            'automated', 'scheduler', 'cron'
        ],
        'media_processing': [
            'image', 'video', 'audio', 'ffmpeg', 'pillow',
            'opencv', 'processing', 'conversion'
        ]
    }

    def __init__(self, model_name: str = 'all-MiniLM-L6-v2'):
        """Initialize with sentence transformer model."""
        self.model = SentenceTransformer(model_name)
        self.category_embeddings = self._compute_category_embeddings()

    def _compute_category_embeddings(self) -> Dict[str, np.ndarray]:
        """Pre-compute embeddings for each category."""
        embeddings = {}
        for category, keywords in self.CATEGORIES.items():
            # Combine keywords into category description
            description = ' '.join(keywords)
            embeddings[category] = self.model.encode(description)
        return embeddings

    def classify(self, content: str, threshold: float = 0.3) -> Dict[str, float]:
        """
        Classify content into categories with confidence scores.

        Returns:
            Dict mapping category names to confidence scores (0-1)
        """
        # Generate content embedding
        content_embedding = self.model.encode(content)

        # Calculate similarity to each category
        scores = {}
        for category, cat_embedding in self.category_embeddings.items():
            similarity = cosine_similarity(
                [content_embedding],
                [cat_embedding]
            )[0][0]

            if similarity >= threshold:
                scores[category] = float(similarity)

        return scores

    def get_top_categories(self, content: str, top_n: int = 3) -> List[tuple]:
        """Get top N categories with highest confidence."""
        scores = self.classify(content)
        sorted_scores = sorted(scores.items(), key=lambda x: x[1], reverse=True)
        return sorted_scores[:top_n]
```

### Context-Aware Quality Assessment

```python
@dataclass
class QualityMetrics:
    """Code quality and maturity indicators."""
    complexity: str  # 'low', 'medium', 'high'
    documentation_coverage: float  # 0.0 to 1.0
    maturity: str  # 'experimental', 'development', 'production'
    technical_debt: List[str]  # Detected issues
    test_coverage: Optional[float] = None

class QualityAnalyzer:
    """Assess code quality and production readiness."""

    DEBT_MARKERS = ['TODO', 'FIXME', 'HACK', 'XXX', 'DEPRECATED']

    @staticmethod
    def analyze(structure: CodeStructure, content: str) -> QualityMetrics:
        """Comprehensive quality analysis."""

        # Complexity assessment
        if structure.complexity_score < 10:
            complexity = 'low'
        elif structure.complexity_score < 30:
            complexity = 'medium'
        else:
            complexity = 'high'

        # Documentation coverage
        total_defs = len(structure.functions) + len(structure.classes)
        documented = sum(1 for _ in re.finditer(r'"""[\s\S]*?"""', content))
        doc_coverage = documented / total_defs if total_defs > 0 else 0.0

        # Maturity detection
        maturity = QualityAnalyzer._detect_maturity(content, structure)

        # Technical debt
        debt = [marker for marker in QualityAnalyzer.DEBT_MARKERS
                if marker in content]

        return QualityMetrics(
            complexity=complexity,
            documentation_coverage=doc_coverage,
            maturity=maturity,
            technical_debt=debt
        )

    @staticmethod
    def _detect_maturity(content: str, structure: CodeStructure) -> str:
        """Determine project maturity level."""
        # Experimental: has TODOs, minimal docs, few tests
        if 'TODO' in content and structure.docstring is None:
            return 'experimental'

        # Production: comprehensive docs, error handling, logging
        production_indicators = ['logging', 'error handling', 'validate']
        if any(ind in content.lower() for ind in production_indicators):
            return 'production'

        # Default to development
        return 'development'
```

---

## Layer 5: Adaptive Learning & Recommendation

### Usage Pattern Tracker

```python
import json
from datetime import datetime
from pathlib import Path

class UsageTracker:
    """Track file access patterns for adaptive learning."""

    def __init__(self, data_file: Path):
        self.data_file = data_file
        self.usage_data = self._load_data()

    def _load_data(self) -> Dict:
        """Load existing usage data."""
        if self.data_file.exists():
            with open(self.data_file, 'r') as f:
                return json.load(f)
        return {}

    def record_access(self, file_path: str, context: str = 'general'):
        """Record file access event."""
        key = str(file_path)
        if key not in self.usage_data:
            self.usage_data[key] = {
                'access_count': 0,
                'first_accessed': datetime.now().isoformat(),
                'last_accessed': None,
                'contexts': []
            }

        self.usage_data[key]['access_count'] += 1
        self.usage_data[key]['last_accessed'] = datetime.now().isoformat()
        if context not in self.usage_data[key]['contexts']:
            self.usage_data[key]['contexts'].append(context)

        self._save_data()

    def _save_data(self):
        """Persist usage data."""
        with open(self.data_file, 'w') as f:
            json.dump(self.usage_data, f, indent=2)

    def get_frequently_used(self, top_n: int = 20) -> List[tuple]:
        """Get most frequently accessed files."""
        sorted_files = sorted(
            self.usage_data.items(),
            key=lambda x: x[1]['access_count'],
            reverse=True
        )
        return sorted_files[:top_n]

    def get_recent_files(self, days: int = 7) -> List[str]:
        """Get files accessed in recent days."""
        from datetime import timedelta
        cutoff = datetime.now() - timedelta(days=days)

        recent = []
        for file_path, data in self.usage_data.items():
            if data['last_accessed']:
                last_access = datetime.fromisoformat(data['last_accessed'])
                if last_access >= cutoff:
                    recent.append(file_path)

        return recent
```

### Intelligent Recommendation Engine

```python
class RecommendationEngine:
    """Generate context-aware organization recommendations."""

    def __init__(self,
                 dependency_graph: DependencyGraph,
                 classifier: SemanticClassifier,
                 usage_tracker: UsageTracker):
        self.dep_graph = dependency_graph
        self.classifier = classifier
        self.usage = usage_tracker

    def recommend_organization(self, file_path: Path,
                              content: str) -> List[Dict]:
        """
        Generate organization recommendations based on multiple signals.

        Returns list of recommendations with confidence scores.
        """
        recommendations = []

        # Semantic classification
        categories = self.classifier.classify(content)
        for category, confidence in categories.items():
            recommendations.append({
                'type': 'semantic',
                'category': category,
                'confidence': confidence,
                'suggested_path': f"~/organized/{category}/"
            })

        # Dependency-based grouping
        file_name = file_path.name
        if file_name in self.dep_graph.graph:
            # Find closely connected files
            neighbors = list(self.dep_graph.graph.neighbors(file_name))
            if neighbors:
                recommendations.append({
                    'type': 'dependency',
                    'related_files': neighbors[:5],
                    'confidence': 0.7,
                    'suggested_path': f"~/organized/related_to_{file_name}/"
                })

        # Usage pattern grouping
        usage_data = self.usage.usage_data.get(str(file_path), {})
        contexts = usage_data.get('contexts', [])
        for context in contexts:
            recommendations.append({
                'type': 'usage_context',
                'context': context,
                'confidence': 0.6,
                'suggested_path': f"~/organized/{context}/"
            })

        # Sort by confidence
        recommendations.sort(key=lambda x: x['confidence'], reverse=True)

        return recommendations

    def suggest_refactoring(self, structure: CodeStructure) -> List[str]:
        """Suggest refactoring opportunities."""
        suggestions = []

        # High complexity
        if structure.complexity_score > 30:
            suggestions.append(
                "High complexity detected. Consider breaking into smaller functions."
            )

        # Missing docstrings
        if not structure.docstring:
            suggestions.append(
                "Add module docstring to describe purpose and usage."
            )

        # Many imports (potential coupling)
        if len(structure.imports) > 20:
            suggestions.append(
                f"Many imports ({len(structure.imports)}). Consider reducing dependencies."
            )

        return suggestions
```

---

## Complete Integration Example

```python
from pathlib import Path
from typing import Dict, Any

class ContentAwarenessEngine:
    """Unified engine integrating all intelligence layers."""

    def __init__(self, workspace: Path):
        self.workspace = workspace
        self.reader = ContentReader()
        self.ast_analyzer = ASTAnalyzer()
        self.dep_graph = DependencyGraph()
        self.classifier = SemanticClassifier()
        self.quality_analyzer = QualityAnalyzer()
        self.usage_tracker = UsageTracker(workspace / '.usage_data.json')
        self.pattern_detector = PatternDetector()

    def analyze_file(self, file_path: Path) -> Dict[str, Any]:
        """Complete multi-layer analysis of a single file."""

        # Layer 1: Content reading
        content = self.reader.read_content(file_path)
        if not content:
            return {'error': 'Could not read file'}

        content_hash = self.reader.compute_content_hash(content)

        # Layer 2: AST analysis
        structure = self.ast_analyzer.analyze_file(file_path)
        if not structure:
            return {'error': 'AST analysis failed'}

        # Detect patterns
        patterns = self.pattern_detector.detect_patterns(structure)

        # Layer 3: Dependency mapping
        self.dep_graph.add_file(file_path, structure.imports)

        # Layer 4: Semantic classification
        categories = self.classifier.classify(content)
        top_categories = self.classifier.get_top_categories(content)

        # Quality assessment
        quality = self.quality_analyzer.analyze(structure, content)

        # Layer 5: Usage tracking
        self.usage_tracker.record_access(str(file_path))

        # Generate recommendations
        rec_engine = RecommendationEngine(
            self.dep_graph,
            self.classifier,
            self.usage_tracker
        )
        recommendations = rec_engine.recommend_organization(file_path, content)
        refactoring_suggestions = rec_engine.suggest_refactoring(structure)

        return {
            'file_path': str(file_path),
            'content_hash': content_hash,
            'structure': {
                'functions': structure.functions,
                'classes': structure.classes,
                'imports': structure.imports,
                'complexity': structure.complexity_score,
                'patterns': list(patterns)
            },
            'semantic': {
                'categories': categories,
                'top_categories': top_categories
            },
            'quality': {
                'complexity': quality.complexity,
                'documentation_coverage': quality.documentation_coverage,
                'maturity': quality.maturity,
                'technical_debt': quality.technical_debt
            },
            'recommendations': recommendations,
            'refactoring_suggestions': refactoring_suggestions
        }

    def analyze_repository(self, file_pattern: str = "**/*.py") -> Dict[str, Any]:
        """Analyze entire repository."""
        results = {}

        python_files = list(self.workspace.glob(file_pattern))
        print(f"Analyzing {len(python_files)} files...")

        for file_path in python_files:
            print(f"Processing: {file_path.name}")
            results[str(file_path)] = self.analyze_file(file_path)

        # Generate repository-level insights
        return {
            'files_analyzed': len(results),
            'file_results': results,
            'repository_insights': self._generate_repo_insights(results)
        }

    def _generate_repo_insights(self, results: Dict) -> Dict[str, Any]:
        """Generate repository-level insights."""

        all_categories = {}
        total_complexity = 0
        maturity_counts = {'experimental': 0, 'development': 0, 'production': 0}
        all_patterns = set()

        for file_result in results.values():
            if 'error' in file_result:
                continue

            # Aggregate categories
            for cat, score in file_result['semantic']['categories'].items():
                all_categories[cat] = all_categories.get(cat, 0) + score

            # Sum complexity
            total_complexity += file_result['structure']['complexity']

            # Count maturity levels
            maturity = file_result['quality']['maturity']
            maturity_counts[maturity] = maturity_counts.get(maturity, 0) + 1

            # Collect patterns
            all_patterns.update(file_result['structure']['patterns'])

        return {
            'dominant_categories': sorted(all_categories.items(),
                                        key=lambda x: x[1], reverse=True)[:5],
            'average_complexity': total_complexity / len(results),
            'maturity_distribution': maturity_counts,
            'detected_patterns': list(all_patterns),
            'hub_files': self.dep_graph.find_hub_files(),
            'circular_dependencies': self.dep_graph.find_circular_dependencies()
        }

# Usage
if __name__ == "__main__":
    engine = ContentAwarenessEngine(Path("~/pythons"))

    # Analyze single file
    result = engine.analyze_file(Path("~/pythons/my_script.py"))
    print(json.dumps(result, indent=2))

    # Analyze entire repository
    repo_analysis = engine.analyze_repository()

    # Save results
    with open("repository_analysis.json", 'w') as f:
        json.dump(repo_analysis, f, indent=2)
```

---

## Advanced Techniques

### 1. Code Embedding for Semantic Search

```python
class CodeEmbeddingSearch:
    """Semantic search over codebase using embeddings."""

    def __init__(self, model_name: str = 'microsoft/codebert-base'):
        from transformers import AutoTokenizer, AutoModel
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)
        self.model = AutoModel.from_pretrained(model_name)
        self.index = {}  # file_path -> embedding

    def index_file(self, file_path: Path, content: str):
        """Generate and store embedding for file."""
        # Tokenize code
        inputs = self.tokenizer(content, return_tensors="pt",
                              truncation=True, max_length=512)

        # Generate embedding
        import torch
        with torch.no_grad():
            outputs = self.model(**inputs)
            embedding = outputs.last_hidden_state.mean(dim=1).squeeze()

        self.index[str(file_path)] = embedding.numpy()

    def search(self, query: str, top_k: int = 5) -> List[tuple]:
        """Search for files matching natural language query."""
        # Generate query embedding
        inputs = self.tokenizer(query, return_tensors="pt",
                              truncation=True, max_length=512)

        import torch
        with torch.no_grad():
            outputs = self.model(**inputs)
            query_embedding = outputs.last_hidden_state.mean(dim=1).squeeze().numpy()

        # Calculate similarity to all indexed files
        similarities = []
        for file_path, file_embedding in self.index.items():
            similarity = cosine_similarity(
                [query_embedding],
                [file_embedding]
            )[0][0]
            similarities.append((file_path, similarity))

        # Return top-k results
        similarities.sort(key=lambda x: x[1], reverse=True)
        return similarities[:top_k]
```

### 2. Graph-Based Project Detection

```python
class ProjectDetector:
    """Detect logical project boundaries using graph analysis."""

    @staticmethod
    def detect_projects(dep_graph: DependencyGraph) -> List[Set[str]]:
        """Find strongly connected components (projects)."""
        # Find communities in undirected version of graph
        undirected = dep_graph.graph.to_undirected()

        import networkx as nx
        from networkx.algorithms import community

        # Use Louvain community detection
        communities = community.greedy_modularity_communities(undirected)

        return [set(c) for c in communities]
```

### 3. Temporal Evolution Tracking

```python
class EvolutionTracker:
    """Track how code evolves over time."""

    def __init__(self, repo_path: Path):
        self.repo_path = repo_path
        self.snapshots = []

    def capture_snapshot(self):
        """Capture current state of repository."""
        snapshot = {
            'timestamp': datetime.now().isoformat(),
            'files': {},
            'metrics': {}
        }

        engine = ContentAwarenessEngine(self.repo_path)
        analysis = engine.analyze_repository()

        snapshot['files'] = analysis['file_results']
        snapshot['metrics'] = analysis['repository_insights']

        self.snapshots.append(snapshot)
        return snapshot

    def detect_changes(self) -> Dict[str, Any]:
        """Detect changes between last two snapshots."""
        if len(self.snapshots) < 2:
            return {'error': 'Need at least 2 snapshots'}

        old = self.snapshots[-2]
        new = self.snapshots[-1]

        changes = {
            'files_added': [],
            'files_removed': [],
            'files_modified': [],
            'complexity_change': 0,
            'maturity_improvements': 0
        }

        old_files = set(old['files'].keys())
        new_files = set(new['files'].keys())

        changes['files_added'] = list(new_files - old_files)
        changes['files_removed'] = list(old_files - new_files)

        # Detect modifications
        for file_path in old_files & new_files:
            old_hash = old['files'][file_path].get('content_hash')
            new_hash = new['files'][file_path].get('content_hash')
            if old_hash != new_hash:
                changes['files_modified'].append(file_path)

        # Complexity trend
        old_complexity = old['metrics']['average_complexity']
        new_complexity = new['metrics']['average_complexity']
        changes['complexity_change'] = new_complexity - old_complexity

        return changes
```

---

## Performance Optimization

### Parallel Processing for Large Repositories

```python
from concurrent.futures import ProcessPoolExecutor, as_completed
from tqdm import tqdm

class ParallelAnalyzer:
    """Analyze large repositories using parallel processing."""

    @staticmethod
    def analyze_file_worker(file_path: Path) -> Dict:
        """Worker function for parallel execution."""
        engine = ContentAwarenessEngine(file_path.parent)
        return engine.analyze_file(file_path)

    @classmethod
    def analyze_repository_parallel(cls, workspace: Path,
                                   max_workers: int = 4) -> Dict:
        """Analyze repository using parallel workers."""
        python_files = list(workspace.glob("**/*.py"))
        results = {}

        with ProcessPoolExecutor(max_workers=max_workers) as executor:
            # Submit all tasks
            future_to_file = {
                executor.submit(cls.analyze_file_worker, f): f
                for f in python_files
            }

            # Process completed tasks with progress bar
            with tqdm(total=len(python_files)) as pbar:
                for future in as_completed(future_to_file):
                    file_path = future_to_file[future]
                    try:
                        result = future.result()
                        results[str(file_path)] = result
                    except Exception as e:
                        results[str(file_path)] = {'error': str(e)}
                    pbar.update(1)

        return results
```

### Caching for Incremental Analysis

```python
import pickle
from functools import lru_cache

class CachedAnalyzer:
    """Cached analysis to avoid redundant processing."""

    def __init__(self, cache_dir: Path):
        self.cache_dir = cache_dir
        self.cache_dir.mkdir(exist_ok=True)

    def _get_cache_path(self, file_path: Path) -> Path:
        """Generate cache file path."""
        cache_name = f"{file_path.name}.{file_path.stat().st_mtime}.cache"
        return self.cache_dir / cache_name

    def analyze_with_cache(self, file_path: Path) -> Dict:
        """Analyze file with caching."""
        cache_path = self._get_cache_path(file_path)

        # Check cache
        if cache_path.exists():
            with open(cache_path, 'rb') as f:
                return pickle.load(f)

        # Perform analysis
        engine = ContentAwarenessEngine(file_path.parent)
        result = engine.analyze_file(file_path)

        # Save to cache
        with open(cache_path, 'wb') as f:
            pickle.dump(result, f)

        return result

    def clear_stale_cache(self, max_age_days: int = 7):
        """Remove old cache files."""
        from datetime import timedelta
        cutoff = datetime.now() - timedelta(days=max_age_days)

        for cache_file in self.cache_dir.glob("*.cache"):
            if datetime.fromtimestamp(cache_file.stat().st_mtime) < cutoff:
                cache_file.unlink()
```

---

## Deployment & Production Considerations

### API Service Example

```python
from fastapi import FastAPI, UploadFile
from pydantic import BaseModel

app = FastAPI(title="Content-Awareness Intelligence API")

class AnalysisRequest(BaseModel):
    repository_url: str
    file_pattern: str = "**/*.py"

@app.post("/analyze")
async def analyze_repository(request: AnalysisRequest):
    """Analyze a GitHub repository."""
    # Clone repo
    import tempfile
    import git

    with tempfile.TemporaryDirectory() as tmpdir:
        repo_path = Path(tmpdir) / "repo"
        git.Repo.clone_from(request.repository_url, repo_path)

        # Analyze
        engine = ContentAwarenessEngine(repo_path)
        results = engine.analyze_repository(request.file_pattern)

        return results

@app.post("/analyze-file")
async def analyze_single_file(file: UploadFile):
    """Analyze uploaded Python file."""
    content = await file.read()

    # Save temporarily
    with tempfile.NamedTemporaryFile(suffix='.py', delete=False) as tmp:
        tmp.write(content)
        tmp_path = Path(tmp.name)

    try:
        engine = ContentAwarenessEngine(tmp_path.parent)
        result = engine.analyze_file(tmp_path)
        return result
    finally:
        tmp_path.unlink()
```

---

## Future Enhancements

### 1. Active Learning Pipeline
- Collect user feedback on classifications
- Retrain models with corrected labels
- A/B test new classification strategies

### 2. Multi-Language Support
- Extend AST analysis to JavaScript, TypeScript, Go
- Language-specific pattern detection
- Cross-language dependency tracking

### 3. IDE Integration
- VS Code extension for real-time analysis
- Inline recommendations while coding
- Project structure suggestions

### 4. Graph Database Backend
- Store relationships in Neo4j
- Complex graph queries (e.g., "find all files that indirectly depend on X")
- Visualization of code architecture

---

**Last Updated**: December 29, 2025
**Version**: 1.0
**Next Review**: Q2 2026
