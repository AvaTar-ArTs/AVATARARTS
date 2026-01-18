# 🧠 Advanced Content-Aware Intelligent Analyzer

## Overview

A sophisticated file analysis system that uses deep content awareness, semantic understanding, and intelligent categorization to analyze files based on their actual content and functionality, not just filenames.

## 🎯 Key Features

### 1. **Deep Content Reading**
- Intelligent encoding detection (UTF-8 with fallback to chardet when available)
- Strategic sampling for large files (beginning + end for files > 2MB)
- Content hash generation (SHA256) for duplicate detection
- Graceful handling of binary and corrupted files

### 2. **Semantic Analysis**
- **9 Semantic Categories** with weighted keyword scoring:
  - AI/ML (OpenAI, Anthropic, GPT, LLMs, Transformers, etc.)
  - Web Development (Flask, Django, FastAPI, Streamlit, React, etc.)
  - Data Analysis (Pandas, NumPy, Matplotlib, DataFrames, etc.)
  - Portfolio Work (Showcase, Gallery, Art, Design, etc.)
  - Documentation (README, Docs, Guides, Markdown, etc.)
  - Automation Scripts (Bots, Schedulers, Pipelines, etc.)
  - Media Content (Audio, Video, Image processing)
  - Configuration (Config files, .env, YAML, JSON, etc.)
  - Testing (Pytest, Unittest, Test cases)

- **Weighted Scoring System**: Keywords have different weights based on relevance
- **Multi-factor Analysis**: Combines keywords, code patterns, imports, and context
- **Confidence Scoring**: Calculates confidence based on category score distribution

### 3. **AST-Based Code Intelligence**
- Parses Python files using Abstract Syntax Tree (AST)
- Extracts:
  - Function definitions and counts
  - Class definitions and counts
  - Import statements (direct imports and import-from)
  - Lines of code (non-empty, non-comment)
  - Docstring presence
  - Type hint detection
  - Technical debt markers (TODO, FIXME, XXX, HACK, BUG, REFACTOR)

### 4. **Content Quality Insights**
- **Code Complexity Assessment**: Low/Medium/High based on functions, classes, and LOC
- **Documentation Quality**: Evaluates docstrings, type hints, and comments
- **Project Maturity**: Assesses structure, type hints, documentation, and technical debt
- **Technical Debt Detection**: Identifies and extracts TODO/FIXME markers with context

### 5. **Advanced Relationship Mapping**
- **Import Analysis**: All imports and import-from statements
- **File References**: Detects references to other files (Python, JSON, YAML, etc.)
- **External URLs**: Extracts HTTP/HTTPS URLs from content
- **Version Patterns**: Detects version numbers in various formats
- **Date Markers**: Finds dates in multiple formats (ISO, US, written)

### 6. **Intelligent Categorization**
- **Multi-factor Priority Scoring** (0-100):
  - Semantic confidence (40 points)
  - Code quality indicators (classes, functions, docs)
  - File size consideration
  - Project context boost
- **Confidence Calculation**: Based on category score distribution
- **Context-Aware**: Considers project context (As-a-Man-Thinketh, YouTube, Portfolio, etc.)

### 7. **Pattern Recognition**
- **Code Pattern Detection**: Recognizes patterns in function/class names
- **Project Context Detection**: Identifies 4 specific project types
- **Content Type Detection**: Markdown, Python, Web, Data, etc.
- **Architectural Patterns**: Detects common code structures

### 8. **Intelligent Recommendations**
- **Destination Suggestions**: Context-aware path recommendations
- **Key Phrase Extraction**: Identifies important terms and concepts
- **Descriptive Summaries**: Generates intelligent file descriptions
- **Project-Aware Organization**: Suggests organization by project context

## 📊 Output

### JSON Report
Comprehensive structured data with:
- Statistics and summaries
- File intelligence data
- Categories and content types
- All analysis results

### Markdown Report
Human-readable report with:
- Executive summary
- Category breakdowns
- File intelligence details
- Suggested destinations
- Quality assessments

## 🚀 Usage

```bash
# Basic usage
python3 ADVANCED_CONTENT_AWARE_ANALYZER.py /path/to/directory

# With options
python3 ADVANCED_CONTENT_AWARE_ANALYZER.py /path/to/directory \
    --output ~/analysis_reports \
    --max-files 1000 \
    --max-size 5242880  # 5MB
```

## 🔧 Requirements

### Required
- Python 3.8+
- Standard library only (ast, json, pathlib, etc.)

### Optional (for enhanced encoding detection)
```bash
pip install chardet
```

The script works without chardet but will use UTF-8 as the default encoding.

## 📈 Improvements Over Basic Analysis

### Compared to filename-based analysis:
1. **Content Understanding**: Analyzes actual code content, not just names
2. **Semantic Intelligence**: Uses weighted keyword scoring and pattern recognition
3. **Relationship Mapping**: Understands file dependencies and connections
4. **Quality Assessment**: Evaluates code quality and maturity
5. **Multi-factor Scoring**: Combines multiple signals for better categorization

### Compared to basic AST analysis:
1. **Semantic Categories**: 9 specialized categories with weighted scoring
2. **Project Context**: Identifies specific project types
3. **Quality Metrics**: Comprehensive quality assessment
4. **Recommendations**: Intelligent destination suggestions
5. **Relationship Mapping**: Detects dependencies and references

## 🎓 Research-Based Features

Based on research into:
- **Static Code Analysis**: AST parsing and pattern recognition
- **Semantic Analysis**: Keyword weighting and multi-factor scoring
- **Code Intelligence**: Function/class extraction and relationship mapping
- **Content-Aware Organization**: Context-aware categorization
- **Quality Metrics**: Complexity and maturity assessment

## 📝 Example Output

```
🧠 ADVANCED CONTENT-AWARE INTELLIGENT ANALYZER
======================================================================

🔍 Analyzing directory: /Users/steven/pythons
======================================================================
   Analyzed 10 files...
   Analyzed 20 files...
✅ Analysis complete: 50 files analyzed

💾 Reports saved:
   - JSON: advanced_content_analysis_20250113_143022.json
   - Markdown: ADVANCED_CONTENT_ANALYSIS_20250113_143022.md

======================================================================
📊 ANALYSIS SUMMARY
======================================================================

Files Analyzed: 50
Categories Found: 6
Content Types: 8

Top Categories:
  - Automation Scripts: 16 files
  - Data Analysis: 15 files
  - Portfolio Work: 15 files
  - Documentation: 17 files
  - Media Content: 18 files
  - AI/ML: 12 files

✅ Analysis complete!
```

## 🔮 Future Enhancements

Potential improvements:
- Machine learning-based categorization
- Code embedding generation
- Dependency graph visualization
- Similarity clustering
- Automated refactoring suggestions
- Integration with code quality tools

## 📄 License

Free to use and modify.

