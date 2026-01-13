# 🔍 Fluid Adaptive Analysis Toolkit

A comprehensive, intelligent code analysis system that adapts to your codebase and provides actionable insights.

## 📦 What's Included

### Core Tools

1. **`fluid_adaptive_analyzer.py`** - Main analysis engine
   - Intelligent context detection
   - Adaptive strategy selection
   - Multi-language support
   - Security, quality, and best practice insights

2. **`analyze_multiple_dirs.py`** - Batch analysis wrapper
   - Analyze multiple directories at once
   - Comparative reports
   - Aggregated statistics
   - Master summary generation

3. **`analysis_config.json`** - Configuration file
   - Customize directories to analyze
   - Set analysis strategies
   - Configure exclusions
   - Enable/disable specific checks

## 🚀 Quick Start

### Single File Analysis
```bash
# Adaptive analysis (recommended)
python3 fluid_adaptive_analyzer.py /path/to/file.py

# Quick scan
python3 fluid_adaptive_analyzer.py /path/to/file.py quick

# Deep analysis
python3 fluid_adaptive_analyzer.py /path/to/file.py deep
```

### Single Directory Analysis
```bash
# Analyze a directory
python3 fluid_adaptive_analyzer.py ~/Documents/python

# Deep analysis of directory
python3 fluid_adaptive_analyzer.py ~/Documents/python deep
```

### Multi-Directory Analysis
```bash
# Use default config
python3 analyze_multiple_dirs.py

# Use custom config
python3 analyze_multiple_dirs.py my_config.json

# Non-interactive mode
python3 analyze_multiple_dirs.py --yes
```

## 📋 Configuration

Edit `analysis_config.json` to customize:

```json
{
  "directories": [
    "~/Documents/python",
    "~/ai-sites"
  ],
  "strategy": "adaptive",
  "output_dir": "~/analysis_reports",
  "exclude_patterns": [
    "**/node_modules/**",
    "**/__pycache__/**"
  ],
  "custom_checks": {
    "check_todos": true,
    "check_security": true
  }
}
```

## 🎯 Analysis Strategies

### Adaptive (Default)
Automatically chooses the best strategy based on file content:
- **Quick**: Small/simple files (<500 lines)
- **Medium**: Standard files
- **Deep**: Complex files (>10 functions, >3 classes)

### Quick
Fast analysis for:
- Configuration files
- Small scripts
- Data files
- When speed matters

### Medium
Balanced analysis for:
- Regular code files
- Documentation
- Most use cases

### Deep
Comprehensive analysis for:
- Large codebases
- Critical applications
- Libraries
- Security audits

## 📊 Output Files

### Single Analysis
- `fluid_analysis_YYYYMMDD_HHMMSS.json` - Full JSON results

### Multi-Directory Analysis
Creates a timestamped directory with:
- `master_report.json` - Aggregated results
- `MASTER_REPORT.md` - Human-readable summary
- `<directory>_analysis.json` - Individual results per directory

## 🔍 What It Detects

### Languages
- Python, JavaScript, TypeScript
- Shell scripts (bash, zsh)
- YAML, JSON, Markdown
- HTML, CSS
- Go, Rust, Ruby

### Frameworks
- **Frontend**: React, Vue, Next.js
- **Backend**: Django, Flask, FastAPI, Express
- **Data**: Pandas, NumPy
- **ML**: TensorFlow, PyTorch
- **Tools**: Alfred workflows, GitHub Actions

### Insights Categories

#### 🔴 Critical
- Hardcoded credentials
- SQL injection risks
- Security vulnerabilities

#### 🟠 High
- Missing error handling
- Dangerous function usage (eval)
- Security issues

#### 🟡 Medium
- Missing type hints
- Missing docstrings
- Code organization
- Outdated patterns

#### 🟢 Low
- Magic numbers
- Long lines
- TODO comments
- Style improvements

## 💡 Examples

### Example 1: Analyze Your Python Projects
```bash
# Create config
cat > python_projects.json << 'EOF'
{
  "directories": [
    "~/Documents/python",
    "~/projects/api",
    "~/projects/scripts"
  ],
  "strategy": "deep"
}
EOF

# Run analysis
python3 analyze_multiple_dirs.py python_projects.json
```

### Example 2: Quick Security Scan
```bash
# Deep analysis focused on security
python3 fluid_adaptive_analyzer.py ~/production/api deep
```

### Example 3: Documentation Check
```bash
# Check all markdown files
python3 fluid_adaptive_analyzer.py ~/docs quick
```

## 🎨 Customization

### Add Custom Checks

Edit the analyzer to add your own insight generators:

```python
def _custom_insights(self, context: Dict, content: str) -> List[Dict]:
    """Your custom checks"""
    insights = []

    # Your logic here
    if 'your_pattern' in content:
        insights.append({
            'type': 'custom',
            'priority': 'medium',
            'title': 'Custom Check',
            'message': 'Found custom pattern'
        })

    return insights
```

### Exclude Patterns

Add patterns to `analysis_config.json`:

```json
{
  "exclude_patterns": [
    "**/tests/**",
    "**/node_modules/**",
    "**/*.min.js"
  ]
}
```

## 📈 Best Practices

### For Daily Use
```bash
# Morning code review
python3 fluid_adaptive_analyzer.py ~/projects/current

# Check before commit
python3 fluid_adaptive_analyzer.py $(git diff --name-only) deep
```

### For Team Use
```bash
# Weekly codebase audit
python3 analyze_multiple_dirs.py team_config.json

# Share reports
cp -r analysis_reports ~/Dropbox/team/
```

### For CI/CD
```bash
# In your CI pipeline
python3 fluid_adaptive_analyzer.py . deep
# Parse JSON output for critical issues
```

## 🔧 Troubleshooting

### Issue: Too many files
**Solution**: Adjust `max_files_per_directory` in config:
```json
{
  "max_files_per_directory": 50
}
```

### Issue: Wrong language detected
**Solution**: The analyzer uses multiple signals. Ensure:
- File extensions are correct
- File content matches the language

### Issue: Too many/few insights
**Solution**: Adjust strategy:
- Too many: Use `quick` strategy
- Too few: Use `deep` strategy

## 🚀 Advanced Usage

### Integration with Git
```bash
# Analyze changed files
git diff --name-only | xargs -I {} python3 fluid_adaptive_analyzer.py {}

# Analyze branch differences
git diff main...feature --name-only | xargs -I {} python3 fluid_adaptive_analyzer.py {}
```

### Scheduled Analysis (cron)
```bash
# Add to crontab
0 9 * * 1 cd ~/Documents/analyze-scripts && python3 analyze_multiple_dirs.py
```

### Export to HTML
```python
# Custom script to generate HTML from JSON
import json
from pathlib import Path

results = json.loads(Path('analysis.json').read_text())
# Generate HTML...
```

## 📚 Output Examples

### Critical Security Issue
```
🔴 CRITICAL: Hardcoded Credentials
  Found password='secret123' in config.py:42
  → Action: Use environment variables
  Impact: Critical security risk
```

### High Priority Issue
```
🟠 HIGH: Missing Error Handling
  File operations without try/except in utils.py
  → Action: Add error handling around file I/O
  Impact: Prevents crashes
```

### Improvement Suggestion
```
🟡 MEDIUM: Add Type Hints
  15 functions without type hints in api.py
  → Action: Add type annotations
  Impact: Improves maintainability
```

## 🤝 Contributing

Want to improve the analyzer?

1. Add new language support in `FluidContextDetector`
2. Add insight generators in `AdaptiveInsightsEngine`
3. Customize checks in config
4. Share your improvements!

## 📝 Version History

### v1.0 (Current)
- Fluid adaptive analysis
- Multi-language support
- Security, quality, and best practice checks
- Multi-directory batch analysis
- JSON/Markdown reports

## 🎯 Roadmap

- [ ] HTML report generation
- [ ] Interactive dashboard
- [ ] GitHub integration
- [ ] Slack notifications
- [ ] Custom rule engine
- [ ] Performance profiling
- [ ] Code metrics tracking

## 💬 Support

Issues? Questions? Suggestions?
- Check the troubleshooting section
- Review example configs
- Experiment with different strategies

---

**Happy Analyzing!** 🔍✨
