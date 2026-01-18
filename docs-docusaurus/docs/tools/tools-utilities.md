# Tools & Utilities

Comprehensive guide to tools and utilities available in the AVATARARTS workspace.

## Location

**Main Directory:** `01_TOOLS/`

## Analysis Tools

### Structure Analysis

**Script:** `01_TOOLS/scripts/analyze_structure.py`

Analyzes workspace structure and organization.

```bash
python3 01_TOOLS/scripts/analyze_structure.py
```

### Income Opportunity Analysis

**Script:** `01_TOOLS/scripts/analyze_income_opportunities.py`

Analyzes income opportunities across the workspace.

```bash
python3 01_TOOLS/scripts/analyze_income_opportunities.py
```

### Unlimited Depth Search

**Script:** `01_TOOLS/scripts/unlimited_depth_search.py`

Deep search functionality across the entire workspace.

```bash
python3 01_TOOLS/scripts/unlimited_depth_search.py --help
```

**Features:**
- Search by name pattern (regex supported)
- Search by file type/extension
- Search by size (min/max)
- Search by content
- Export results to CSV/JSON

### Merge, Diff, and Dedupe

**Script:** `01_TOOLS/scripts/merge_diff_dedupe.py`

File deduplication and comparison tools.

```bash
python3 01_TOOLS/scripts/merge_diff_dedupe.py --help
```

### List All Files

**Script:** `01_TOOLS/scripts/list_all_folders_files.py`

Generate comprehensive file listings.

```bash
python3 01_TOOLS/scripts/list_all_folders_files.py --format tree
```

## Dashboards

### Master Revenue Dashboard

**Script:** `01_TOOLS/dashboards/master_revenue_dashboard.py`

Revenue tracking and analytics dashboard.

```bash
python3 01_TOOLS/dashboards/master_revenue_dashboard.py
```

**Features:**
- Real-time revenue tracking
- Performance analytics
- Goal tracking
- Optimization recommendations

## Deep Analysis Tools

### Deep Comprehensive Analysis

**Script:** `01_TOOLS/scripts/deep_comprehensive_analysis.py`

Unlimited depth workspace analysis.

```bash
python3 01_TOOLS/scripts/deep_comprehensive_analysis.py
```

**Output:**
- Complete directory structure
- File type analysis
- Large directory identification
- System connections
- Duplicate detection

### Find Large Files

**Script:** `01_TOOLS/scripts/find_large_files.py`

Find and report large files in the workspace.

```bash
python3 01_TOOLS/scripts/find_large_files.py . 10
```

**Features:**
- Find files larger than specified size
- Group by file type
- Generate reports

## Data Files

**Location:** `01_TOOLS/data/`

Contains analysis outputs and data files:

- `all_folders_files.csv` - Complete file listing
- `directory_analysis.json` - Directory analysis results
- `income_opportunities.csv` - Income opportunity data
- Various analysis outputs

## Usage Examples

### Analyze Workspace Structure

```bash
cd /Users/steven/AVATARARTS
python3 01_TOOLS/scripts/analyze_structure.py
```

### Search for Python Files

```bash
python3 01_TOOLS/scripts/unlimited_depth_search.py \
  --type py \
  --pattern "revenue" \
  --export results.json
```

### Find Large Files

```bash
python3 01_TOOLS/scripts/find_large_files.py . 50
```

### View Revenue Dashboard

```bash
python3 01_TOOLS/dashboards/master_revenue_dashboard.py
```

## Related Documentation

- [Workspace Overview](../getting-started/workspace-overview.md)
- [Active Projects](../projects/active-projects.md)
- [Directory Structure](../projects/directory-structure.md)
