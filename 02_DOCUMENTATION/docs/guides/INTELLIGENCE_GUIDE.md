# Advanced Content-Awareness Intelligence System

## 🚀 Overview

This advanced intelligence system goes far beyond traditional file analysis by using cutting-edge techniques:

### Core Capabilities

1. **AST-Based Deep Analysis**
   - Parses Python and JavaScript/TypeScript into Abstract Syntax Trees
   - Understands actual code structure (classes, functions, control flow)
   - Calculates cyclomatic complexity for quality metrics

2. **Semantic Pattern Recognition**
   - Detects architectural patterns: Singleton, Factory, Repository, MVC
   - Provides confidence scores (0.0-1.0) with evidence trails
   - Identifies React components, Express APIs, and more

3. **ML-Powered Categorization** (Optional)
   - Uses OpenAI embeddings for intelligent file categorization
   - Understands semantic meaning, not just keywords
   - 10 predefined categories: AI/ML, Web Dev, Data Analysis, etc.

4. **Intelligent Dependency Graphs**
   - Maps relationships between files
   - Detects circular dependencies
   - Finds orphaned files
   - Tracks reverse dependencies ("what depends on me?")

5. **Quality Metrics & Scoring**
   - Code quality score (0-100) based on:
     - Documentation coverage
     - Test presence
     - Complexity ratios
     - Code organization
   - Identifies high-quality code and files needing improvement

6. **Beautiful Visualizations**
   - Interactive HTML dashboards with Chart.js
   - Category distributions, quality heatmaps
   - Pattern detection summaries
   - Dependency coupling analysis

---

## 📋 Installation & Requirements

### Required Dependencies

```bash
# Install Python dependencies
pip install numpy openai python-dotenv

# Optional: For ML-based categorization
# Set up OpenAI API key in ~/.env.d/llm-apis or .env
```

### System Requirements

- Python 3.12+
- Works with any codebase containing Python, JavaScript, or TypeScript files

---

## 🔧 Usage

### Basic Analysis (No ML)

Analyze current directory:

```bash
python advanced_content_intelligence.py
```

Analyze specific directory:

```bash
python advanced_content_intelligence.py /path/to/your/project
```

Specify output location:

```bash
python advanced_content_intelligence.py ~/projects/myapp --output ~/analysis_results
```

### Advanced Analysis (With ML Categorization)

```bash
# Load API keys
source ~/.env.d/loader.sh llm-apis

# Run with ML
python advanced_content_intelligence.py --use-ml
```

### Exclude Additional Directories

```bash
python advanced_content_intelligence.py --exclude archive old_versions backup
```

---

## 📊 Generated Reports

The analyzer generates three comprehensive reports:

### 1. CSV Report (`ADVANCED_INTELLIGENCE_YYYYMMDD_HHMMSS.csv`)

Spreadsheet-friendly format with columns:
- Filepath, Language, LOC
- Complexity, Category, Confidence
- Classes, Functions, Imports counts
- Detected Patterns
- Quality Score, Tests, Documentation
- Dependencies (in/out counts)
- Primary Purpose

**Use cases:**
- Import into Excel/Google Sheets for custom analysis
- Track metrics over time
- Sort by quality score to find problem areas

### 2. JSON Report (`ADVANCED_INTELLIGENCE_YYYYMMDD_HHMMSS.json`)

Complete detailed analysis including:
- Full entity lists (all classes, functions with line numbers)
- Pattern detection with evidence trails
- Dependency graphs (file-to-file relationships)
- All metadata and confidence scores

**Use cases:**
- Programmatic analysis
- Integration with other tools
- Archive for historical comparison

### 3. Markdown Summary (`ADVANCED_INTELLIGENCE_YYYYMMDD_HHMMSS.md`)

Human-readable summary with:
- Overall statistics (LOC, avg quality, test coverage)
- Category distribution
- Architectural patterns found
- Top 10 quality files
- Files needing improvement

**Use cases:**
- Quick overview for team meetings
- Include in project documentation
- Track improvement progress

---

## 📈 Dashboard Generation

Create beautiful interactive visualizations:

```bash
# Generate dashboard from JSON report
python generate_intelligence_dashboard.py ADVANCED_INTELLIGENCE_20260101_120000.json

# Specify output location
python generate_intelligence_dashboard.py report.json --output my_dashboard.html
```

### Dashboard Features

- **Key Metrics Cards**: Files analyzed, LOC, avg quality, coverage percentages
- **Interactive Charts**:
  - Category distribution (doughnut chart)
  - Quality distribution (bar chart)
  - Language breakdown (pie chart)
  - Architectural patterns (horizontal bar chart)
- **File Lists**:
  - Top quality files with scores
  - Files needing attention
  - Highly coupled files with dependency counts

Open the HTML file in any modern browser - no server required!

---

## 🎯 Understanding the Analysis

### Code Quality Score (0-100)

The quality score is calculated from:

| Factor | Impact | Details |
|--------|--------|---------|
| **Documentation** | +20 | Module-level docstring + 50%+ function/class docstrings |
| **Tests** | +20 | Associated test file or inline tests |
| **Complexity** | ±10 to -20 | Cyclomatic complexity per LOC ratio |
| **Organization** | +5 | Presence of classes or functions (not just scripts) |
| **Docstring Coverage** | +10 | Percentage of entities with docstrings |

**Scoring Guide:**
- **90-100**: Excellent - Well-documented, tested, maintainable
- **70-89**: Good - Solid quality, minor improvements possible
- **50-69**: Fair - Functional but needs attention
- **<50**: Poor - Requires significant improvement

### Pattern Detection Confidence

Pattern detection uses heuristics with confidence scoring:

**Singleton Pattern** (confidence factors):
- Overrides `__new__` method: +0.4
- Has `_instance` variable: +0.3
- Uses `@singleton` decorator: +0.5

**Factory Pattern**:
- Factory method names (create, build, make): +0.3 each
- Factory class name: +0.4

**Repository Pattern**:
- Repository naming: +0.5
- 3+ CRUD methods: +0.4

**MVC Pattern**:
- MVC directory structure: +0.4
- Controller/Model/View class names: +0.3 each

Patterns are reported when confidence ≥ 0.5 (50%).

### Category Confidence

Categories are assigned based on:
- **Import analysis**: Specific libraries indicate purpose (e.g., flask → Web Dev)
- **Filename patterns**: Keywords like "test", "dashboard", "api"
- **ML embeddings** (if enabled): Semantic content understanding

Higher confidence = more evidence for categorization.

---

## 🔍 Advanced Features

### Dependency Graph Analysis

The system builds a complete dependency graph:

```python
# Example insights from dependency analysis:

# Circular dependencies detected:
# auth/middleware.py ↔ auth/models.py
# (file A imports B, B imports A)

# Orphaned files (no dependencies in/out):
# scripts/one_off_migration.py
# utils/legacy_helper.py

# Highly coupled files:
# core/engine.py: depends on 15 files, depended by 23 files
```

**Why this matters:**
- Circular dependencies can cause import errors and maintainability issues
- Orphaned files may be dead code to remove
- Highly coupled files are fragile and hard to test

### AST Entity Extraction

For each Python file, the analyzer extracts:

```python
CodeEntity {
    name: "UserRepository"
    type: "class"
    line_start: 42
    line_end: 156
    complexity: 12
    docstring: "Handles all user database operations..."
    decorators: ["dataclass", "singleton"]
    dependencies: {"sqlalchemy", "User", "Session"}
}
```

This enables:
- Jump-to-definition links (using `filepath:line_number`)
- Complexity hotspot identification
- Decorator usage analysis
- Dependency tracking at granular level

### ML-Based Semantic Understanding

When ML mode is enabled:

1. File content is embedded using OpenAI's `text-embedding-3-small`
2. Embeddings are compared against category prototypes
3. Semantic similarity determines categorization
4. Falls back to keyword matching if API fails

**Benefits over keyword matching:**
- Understands context and purpose, not just imports
- Handles polyglot files (e.g., data science + web dev)
- More accurate for domain-specific code

---

## 💡 Use Cases

### 1. Onboarding New Developers

```bash
# Generate comprehensive overview
python advanced_content_intelligence.py --use-ml
python generate_intelligence_dashboard.py ADVANCED_INTELLIGENCE_*.json

# Share dashboard.html with new team members
# They see: architecture, quality hotspots, key patterns
```

### 2. Code Quality Improvement Sprint

```bash
# Run analysis
python advanced_content_intelligence.py --output quality_audit

# Review ADVANCED_INTELLIGENCE_*.md
# Focus on "Files Needing Attention" section
# Create tickets for files with quality score < 50
```

### 3. Refactoring Planning

```bash
# Analyze before refactor
python advanced_content_intelligence.py --output before_refactor

# Check dependency graph for circular dependencies
# Review complexity scores to identify hotspots
# Use pattern detection to understand current architecture

# After refactor, compare results
python advanced_content_intelligence.py --output after_refactor
```

### 4. Technical Debt Tracking

```bash
# Run monthly analysis
python advanced_content_intelligence.py --output analysis_$(date +%Y_%m)

# Track metrics over time:
# - Average quality score trend
# - Test coverage percentage
# - Documentation coverage
# - Complexity growth
```

### 5. Architecture Documentation

```bash
# Generate analysis with pattern detection
python advanced_content_intelligence.py --use-ml

# Use detected patterns to auto-document:
# - "We use Repository pattern for data access"
# - "React components follow hooks-based architecture"
# - "API layer uses Express.js routing"
```

---

## 🎓 Learning Opportunities

This system is designed to be **educational**. Here's what you can learn:

### For Developers

1. **Code Quality Metrics**
   - See how documentation affects quality scores
   - Understand cyclomatic complexity impact
   - Learn what makes code "high quality"

2. **Architectural Patterns**
   - Discover patterns you're using (maybe unknowingly!)
   - See evidence for why patterns were detected
   - Learn pattern recognition heuristics

3. **Dependency Management**
   - Visualize how files interconnect
   - Spot problematic circular dependencies
   - Understand coupling vs. cohesion

### For Students

1. **AST Analysis**: See how code parsers work under the hood
2. **Pattern Detection**: Learn design pattern characteristics
3. **ML Embeddings**: Understand semantic similarity in code
4. **Graph Algorithms**: Dependency analysis uses graph theory

---

## 🛠️ Customization & Extension

### Adding New Patterns

Edit `advanced_content_intelligence.py`:

```python
def _detect_observer(self, classes: List[CodeEntity]) -> Optional[ArchitecturalPattern]:
    """Detect Observer pattern"""
    for cls in classes:
        evidence = []
        confidence = 0.0

        # Check for observer method names
        if 'subscribe' in cls.dependencies or 'notify' in cls.dependencies:
            evidence.append("Has observer methods")
            confidence += 0.5

        # Check for listener list
        if 'listeners' in cls.dependencies or 'observers' in cls.dependencies:
            evidence.append("Maintains observer collection")
            confidence += 0.4

        if confidence >= 0.6:
            return ArchitecturalPattern(
                pattern_type='Observer',
                confidence=min(confidence, 1.0),
                evidence=evidence,
                file_path=str(self.current_file)
            )
    return None
```

### Adding New Categories

Update the import-to-category mapping:

```python
import_categories = {
    'flask': ('Web Development', 0.9),
    'fastapi': ('Web Development', 0.9),
    # Add your custom mappings:
    'pygame': ('Game Development', 0.9),
    'kivy': ('Mobile Development', 0.9),
    'trio': ('Async Programming', 0.8),
}
```

### Custom Quality Scoring

Modify `_calculate_quality_score()` to weight factors differently:

```python
# Emphasize tests more
if has_tests:
    score += 30  # was 20

# Reduce complexity penalty
if complexity_per_loc > 0.5:
    score -= 10  # was 20
```

---

## 🔬 Technical Deep Dive

### How AST Analysis Works

1. **Parse**: `ast.parse(source_code)` creates syntax tree
2. **Walk**: `ast.walk(tree)` visits every node
3. **Extract**: Identify node types (ClassDef, FunctionDef, etc.)
4. **Analyze**: Calculate complexity, extract metadata
5. **Structure**: Build CodeEntity objects with relationships

**Why AST vs. Regex?**
- AST understands code structure, not just text patterns
- Handles nested scopes correctly
- Ignores comments and strings
- Language-aware parsing

### Dependency Graph Algorithm

```python
# Build forward graph
for file in files:
    for import in file.imports:
        if import in local_files:
            graph[file].add(import)

# Build reverse graph (who depends on me?)
for file, deps in graph.items():
    for dep in deps:
        reverse_graph[dep].add(file)

# Detect circular dependencies
for file, deps in graph.items:
    for dep in deps:
        if file in graph[dep]:  # A→B and B→A
            circular.append((file, dep))
```

### Complexity Calculation

Cyclomatic complexity = decision points + 1:

```python
complexity = 1  # baseline

for node in ast.walk(tree):
    if isinstance(node, ast.If):      # +1 per if
        complexity += 1
    if isinstance(node, ast.While):   # +1 per loop
        complexity += 1
    if isinstance(node, ast.BoolOp):  # +1 per and/or
        complexity += len(node.values) - 1
```

**Why complexity matters:**
- High complexity = more paths to test
- Increases bug likelihood
- Reduces maintainability

---

## 📚 Integration Examples

### CI/CD Integration

```yaml
# .github/workflows/code-quality.yml
name: Code Quality Analysis

on: [push, pull_request]

jobs:
  analyze:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Run Intelligence Analysis
        run: |
          python advanced_content_intelligence.py --output analysis
          python generate_intelligence_dashboard.py analysis/*.json

      - name: Upload Dashboard
        uses: actions/upload-artifact@v2
        with:
          name: quality-dashboard
          path: intelligence_dashboard.html

      - name: Check Quality Threshold
        run: |
          # Extract average quality from JSON
          avg_quality=$(jq '.analyses | map(.code_quality_score) | add / length' analysis/*.json)
          if (( $(echo "$avg_quality < 60" | bc -l) )); then
            echo "Quality score too low: $avg_quality"
            exit 1
          fi
```

### Pre-commit Hook

```bash
#!/bin/bash
# .git/hooks/pre-commit

echo "Running code quality analysis..."
python advanced_content_intelligence.py --output /tmp/quality_check

# Check for quality degradation
# (Compare with previous analysis)
```

### VS Code Task

```json
// .vscode/tasks.json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Analyze Code Quality",
      "type": "shell",
      "command": "python",
      "args": [
        "advanced_content_intelligence.py",
        "--use-ml",
        "&&",
        "python",
        "generate_intelligence_dashboard.py",
        "ADVANCED_INTELLIGENCE_*.json"
      ],
      "group": "build",
      "presentation": {
        "reveal": "always",
        "panel": "new"
      }
    }
  ]
}
```

---

## 🐛 Troubleshooting

### "No module named 'openai'"

**Solution**: Install dependencies:
```bash
pip install openai python-dotenv numpy
```

### "OPENAI_API_KEY not found"

**Solution**: Either:
1. Set in `~/.env.d/llm-apis`:
   ```bash
   export OPENAI_API_KEY="sk-..."
   source ~/.env.d/loader.sh llm-apis
   ```

2. Or run without ML:
   ```bash
   python advanced_content_intelligence.py  # ML auto-disabled
   ```

### Analysis is slow

**Causes & Solutions**:
- **Large codebase**: Use `--exclude` to skip unnecessary directories
- **ML enabled**: Disable with `--use-ml` flag removed (ML makes API calls)
- **Complex files**: Normal - AST parsing is thorough

### Dashboard charts not showing

**Solution**: Open HTML in modern browser (Chrome, Firefox, Safari, Edge)
- Chart.js requires JavaScript enabled
- Check browser console for errors

### Encoding errors on Windows

**Solution**: Files must be UTF-8 encoded
```python
# The analyzer already handles this:
with open(filepath, 'r', encoding='utf-8') as f:
```

---

## 🌟 Best Practices

### Running Regular Analyses

```bash
# Weekly quality check
0 9 * * 1 cd /path/to/project && python advanced_content_intelligence.py --output weekly_analysis
```

### Comparing Over Time

```bash
# Save with dates
python advanced_content_intelligence.py --output analysis_$(date +%Y%m%d)

# Compare CSVs in spreadsheet
# Track: avg quality, test coverage %, complexity trend
```

### Team Collaboration

1. **Commit CSVs to repo** (small, trackable)
2. **Share dashboards** via GitHub Pages or internal server
3. **Review in stand-ups**: "Quality score increased from 65 to 72!"
4. **Set thresholds**: "No PR merged if quality < 60"

### Prioritizing Improvements

Focus order:
1. **Files with score < 40**: Critical attention needed
2. **Circular dependencies**: Refactor to break cycles
3. **High complexity (>20)**: Split into smaller functions
4. **Missing tests**: Add test coverage
5. **Missing docs**: Add docstrings

---

## 📖 Further Reading

### Code Quality Resources

- **Cyclomatic Complexity**: [Wikipedia](https://en.wikipedia.org/wiki/Cyclomatic_complexity)
- **Design Patterns**: "Design Patterns" by Gang of Four
- **Code Metrics**: "Code Complete" by Steve McConnell

### AST in Python

- [Official AST docs](https://docs.python.org/3/library/ast.html)
- [Green Tree Snakes](https://greentreesnakes.readthedocs.io/) - AST tutorial

### Embeddings & ML

- [OpenAI Embeddings Guide](https://platform.openai.com/docs/guides/embeddings)
- [Semantic Code Search](https://arxiv.org/abs/1909.09436)

---

## 🤝 Contributing

Want to extend this system? Ideas:

- **Language support**: Add Ruby, Go, Java analyzers
- **More patterns**: Strategy, Command, Decorator detection
- **Visualization**: D3.js network graphs for dependencies
- **AI insights**: GPT-4 code review suggestions
- **Performance**: Parallel file processing
- **Diff analysis**: Compare two analyses to show changes

---

## 📄 License & Attribution

This advanced intelligence system was created using cutting-edge techniques from:
- Abstract Syntax Tree (AST) analysis
- Pattern recognition algorithms
- Machine learning embeddings
- Graph theory for dependency analysis

Created: 2026-01-01
Version: 1.0.0

**Happy analyzing! 🚀**
