# AVATARARTS Workspace Cleanup - Action Plan
**Created:** 2026-01-14
**Status:** Ready to Execute
**Estimated Space Recovery:** 2-3GB
**Estimated Time:** 2-4 hours

---

## Summary

| Pain Point | Items | Space | Priority |
|-----------|-------|-------|----------|
| Duplicates | 726 files | ~1-1.5GB | 🔴 HIGH |
| Node.js bloat | 331 node_modules | ~800MB-1GB | 🔴 HIGH |
| Doc systems | 4 systems | ~397MB → 15MB | 🟡 MEDIUM |
| Script sprawl | 16,282 scripts | Organization | 🟢 LOW |

**Total Recovery Potential:** 2.5-3GB (~32-38% of workspace)

---

## Phase 1: Safe Deduplication (HIGH PRIORITY)

### Current State
- **726 duplicate entries** in dedupe_mapping.csv
- **257 merge groups** (groups of similar/identical files)
- **Categories:**
  - 100% identical files (MP3 duplicates, exact copies)
  - 96-99% similar (website versions with minor differences)
  - Nested duplicates (CODE_PROJECTS/CODE_PROJECTS)

### Duplicate Breakdown
```
MP3 Files (disco/mp3/):        ~300 duplicates @ 6-12MB each = 600MB+
Website Projects:              ~50 duplicates @ 10-20MB each = 500MB+
Code Projects:                 ~200 duplicates @ 1-5MB each = 300MB+
Analysis Visualizations:       ~25 duplicates @ 9MB each = 225MB+
Misc Files:                    ~150 duplicates varying = 200MB+
────────────────────────────────────────────────────────────
TOTAL ESTIMATED RECOVERY:                           1.8GB
```

### Action Steps

#### Step 1: Validate Deduplication Script
```bash
# Check if safe_dedupe_script.py exists and is working
python3 /Users/steven/AVATARARTS/01_TOOLS/scripts/safe_dedupe_script.py --help
```

#### Step 2: Dry Run (REQUIRED FIRST)
```bash
# Preview what will be deleted WITHOUT actually deleting
python3 /Users/steven/AVATARARTS/01_TOOLS/scripts/safe_dedupe_script.py \
  --mapping /Users/steven/AVATARARTS/01_TOOLS/data/dedupe_mapping.csv \
  --dry-run > /Users/steven/AVATARARTS/dedupe_dry_run_report.txt
```

#### Step 3: Review Dry Run Results
```bash
# Review the report
cat /Users/steven/AVATARARTS/dedupe_dry_run_report.txt

# Look for:
# - Files marked for deletion
# - Space to be recovered
# - Any unexpected deletions
```

#### Step 4: Backup Critical Files (SAFETY)
```bash
# Create backup of mapping
cp /Users/steven/AVATARARTS/01_TOOLS/data/dedupe_mapping.csv \
   /Users/steven/AVATARARTS/dedupe_mapping_backup_$(date +%Y%m%d).csv

# Optional: Create full backup
# (Skip if confident in dry-run results)
```

#### Step 5: Execute Deduplication
```bash
# ONLY after reviewing dry-run results
python3 /Users/steven/AVATARARTS/01_TOOLS/scripts/safe_dedupe_script.py \
  --mapping /Users/steven/AVATARARTS/01_TOOLS/data/dedupe_mapping.csv \
  --execute > /Users/steven/AVATARARTS/dedupe_execution_log.txt
```

#### Step 6: Verify Results
```bash
# Check space saved
du -sh /Users/steven/AVATARARTS

# Review execution log
cat /Users/steven/AVATARARTS/dedupe_execution_log.txt
```

### Expected Outcome
- ✅ ~1.8GB space recovered
- ✅ 726 duplicate files removed
- ✅ Cleaner project structure
- ✅ Faster searches and indexing

---

## Phase 2: Node.js Cleanup (HIGH PRIORITY)

### Current State
- **331 node_modules directories** across workspace
- **Estimated size:** 800MB - 1GB
- **Problem:** Most are in archives or inactive projects

### Node.js Projects Identified
```
docs-docusaurus/node_modules/     ~270MB  (ACTIVE - Keep)
docs-vitepress/node_modules/      ~80MB   (REDUNDANT - Remove)
docs-sphinx/                      ~14MB   (Python, no node_modules)
docs-mkdocs/                      ~3MB    (Python, no node_modules)

03_ARCHIVES/**/node_modules/      ~450MB  (ARCHIVED - Remove ALL)
Other projects/node_modules/      ~50MB   (Review case-by-case)
```

### Action Steps

#### Step 1: Identify All node_modules
```bash
# Create inventory
find /Users/steven/AVATARARTS -type d -name "node_modules" \
  -exec du -sh {} \; > /Users/steven/AVATARARTS/node_modules_inventory.txt

# Count and total size
echo "Total node_modules directories:"
find /Users/steven/AVATARARTS -type d -name "node_modules" | wc -l
echo "Total size:"
du -shc $(find /Users/steven/AVATARARTS -type d -name "node_modules") | tail -1
```

#### Step 2: Safe Cleanup - Archives (IMMEDIATE)
```bash
# Remove ALL node_modules from archives (safe, always recoverable)
find /Users/steven/AVATARARTS/03_ARCHIVES -type d -name "node_modules" \
  -exec rm -rf {} + 2>/dev/null

# Expected recovery: ~450MB
```

#### Step 3: Safe Cleanup - Redundant Doc Systems
```bash
# Remove node_modules from VitePress (keeping Docusaurus)
rm -rf /Users/steven/AVATARARTS/docs-vitepress/node_modules

# Expected recovery: ~80MB
```

#### Step 4: Review Remaining node_modules
```bash
# List non-archive, non-docs node_modules
find /Users/steven/AVATARARTS -type d -name "node_modules" \
  ! -path "*/03_ARCHIVES/*" \
  ! -path "*/docs-docusaurus/*" \
  -exec echo {} \;

# Review each manually - may be active projects
```

#### Step 5: Create .gitignore for node_modules
```bash
# Prevent future bloat
cat >> /Users/steven/AVATARARTS/.gitignore << 'EOF'

# Node.js
node_modules/
npm-debug.log
yarn-error.log
.pnpm-debug.log

# Python
__pycache__/
*.pyc
*.pyo
.venv/
venv/

# OS
.DS_Store
Thumbs.db
EOF
```

### Expected Outcome
- ✅ ~530MB recovered immediately (archives + vitepress)
- ✅ ~800MB+ total if all inactive removed
- ✅ .gitignore prevents future bloat
- ✅ Faster filesystem operations

---

## Phase 3: Documentation Consolidation (MEDIUM PRIORITY)

### Current State
```
docs-docusaurus/    287MB  (React, extensive ecosystem)
docs-vitepress/      93MB  (Vue, lightweight)
docs-sphinx/         14MB  (Python, traditional)
docs-mkdocs/        2.7MB  (Python, simple)
────────────────────────────
TOTAL:              397MB
```

### Recommendation: Keep Docusaurus

**Why Docusaurus?**
- ✅ Most feature-rich
- ✅ Best SEO support
- ✅ Largest community
- ✅ Already largest investment (287MB suggests active development)
- ✅ React ecosystem (aligns with modern web)
- ✅ Built-in versioning, search, i18n

**Migration Plan:**

#### Step 1: Audit Content in Each System
```bash
# Docusaurus
find /Users/steven/AVATARARTS/docs-docusaurus/docs -name "*.md" | wc -l

# VitePress
find /Users/steven/AVATARARTS/docs-vitepress -name "*.md" | wc -l

# Sphinx
find /Users/steven/AVATARARTS/docs-sphinx -name "*.rst" -o -name "*.md" | wc -l

# MkDocs
find /Users/steven/AVATARARTS/docs-mkdocs -name "*.md" | wc -l
```

#### Step 2: Extract Unique Content
```bash
# For each non-Docusaurus system:
# 1. Find .md/.rst files
# 2. Check if content exists in Docusaurus
# 3. Copy unique content to Docusaurus
# 4. Convert .rst to .md if needed (Sphinx)

# Script to find unique content (create this)
# We'll build this in next phase
```

#### Step 3: Migrate Unique Content to Docusaurus
```bash
# Manual review recommended for quality
# - Check for duplicate topics
# - Standardize formatting
# - Update internal links
# - Verify images/assets copied
```

#### Step 4: Archive Old Systems
```bash
# After migration complete
mkdir -p /Users/steven/AVATARARTS/03_ARCHIVES/old_docs_systems

# Archive VitePress
mv /Users/steven/AVATARARTS/docs-vitepress \
   /Users/steven/AVATARARTS/03_ARCHIVES/old_docs_systems/

# Archive Sphinx
mv /Users/steven/AVATARARTS/docs-sphinx \
   /Users/steven/AVATARARTS/03_ARCHIVES/old_docs_systems/

# Archive MkDocs
mv /Users/steven/AVATARARTS/docs-mkdocs \
   /Users/steven/AVATARARTS/03_ARCHIVES/old_docs_systems/
```

#### Step 5: Update References
```bash
# Find any scripts/files referencing old doc systems
grep -r "docs-vitepress" /Users/steven/AVATARARTS --exclude-dir=03_ARCHIVES
grep -r "docs-sphinx" /Users/steven/AVATARARTS --exclude-dir=03_ARCHIVES
grep -r "docs-mkdocs" /Users/steven/AVATARARTS --exclude-dir=03_ARCHIVES

# Update to point to Docusaurus
```

### Expected Outcome
- ✅ Single documentation system (Docusaurus)
- ✅ ~110MB space saved (after archiving others)
- ✅ Easier maintenance
- ✅ No content loss (all migrated)
- ✅ Better discoverability

---

## Phase 4: Script Consolidation (LOWER PRIORITY)

### Current State
- **16,282 Python scripts** scattered across workspace
- **No central registry** or catalog
- **Multiple similar scripts** (9 dedupe scripts found!)

### Strategy: Create Central CLI

#### Goals
1. **Discover** all scripts
2. **Categorize** by function
3. **Identify** duplicates/similar
4. **Create** central command interface
5. **Document** each script

#### Implementation Plan

**Step 1: Create Script Registry**
```python
# 01_TOOLS/cli/scripts_registry.json
{
  "revenue": {
    "dashboard": {
      "path": "01_TOOLS/dashboards/master_revenue_dashboard.py",
      "description": "Cross-system revenue tracking and analytics",
      "tags": ["revenue", "analytics", "dashboard"],
      "dependencies": ["openai", "pandas"]
    },
    "analyze": {
      "path": "01_TOOLS/scripts/analyze_income_opportunities.py",
      "description": "Income opportunity analysis",
      "tags": ["revenue", "analysis"]
    }
  },
  "workspace": {
    "dedupe": {
      "path": "01_TOOLS/scripts/safe_dedupe_script.py",
      "description": "Safe deduplication with dry-run",
      "tags": ["cleanup", "deduplication"],
      "preferred": true  # Mark canonical version
    },
    "analyze": {
      "path": "01_TOOLS/scripts/deep_comprehensive_analysis.py",
      "description": "Unlimited depth workspace analysis",
      "tags": ["analysis", "workspace"]
    }
  },
  "seo": {
    "trends": {
      "path": "06_SEO_MARKETING/scripts/trend_analyzer.py",
      "description": "SEO trend analysis for Trend Pulse Pro",
      "tags": ["seo", "trends", "content"]
    }
  }
}
```

**Step 2: Build CLI Framework**
```python
# 01_TOOLS/cli/avatararts.py
#!/usr/bin/env python3
"""
AVATARARTS CLI - Unified command interface
Usage:
    avatararts revenue dashboard
    avatararts workspace dedupe --dry-run
    avatararts seo trends --topic "AI automation"
"""

import json
import subprocess
import sys
from pathlib import Path

class AvatarArtsCLI:
    def __init__(self):
        self.root = Path(__file__).parent.parent.parent
        registry_path = Path(__file__).parent / "scripts_registry.json"
        with open(registry_path) as f:
            self.registry = json.load(f)

    def run_command(self, category, command, args):
        script_info = self.registry.get(category, {}).get(command)
        if not script_info:
            print(f"❌ Unknown command: {category} {command}")
            self.show_help()
            sys.exit(1)

        script_path = self.root / script_info['path']
        cmd = [sys.executable, str(script_path)] + args
        subprocess.run(cmd)

    def show_help(self):
        print("\n🎨 AVATARARTS CLI\n")
        for category, commands in self.registry.items():
            print(f"{category}:")
            for cmd, info in commands.items():
                print(f"  {cmd:15} - {info['description']}")
            print()

if __name__ == "__main__":
    cli = AvatarArtsCLI()
    if len(sys.argv) < 3:
        cli.show_help()
    else:
        cli.run_command(sys.argv[1], sys.argv[2], sys.argv[3:])
```

**Step 3: Script Discovery Tool**
```bash
# Create tool to find and categorize all scripts
# We'll build this after deduplication
```

**Step 4: Make CLI Available**
```bash
# Add to PATH
echo 'export PATH="$PATH:/Users/steven/AVATARARTS/01_TOOLS/cli"' >> ~/.zshrc
chmod +x /Users/steven/AVATARARTS/01_TOOLS/cli/avatararts.py

# Create symlink
ln -s /Users/steven/AVATARARTS/01_TOOLS/cli/avatararts.py \
      /Users/steven/AVATARARTS/01_TOOLS/cli/avatararts

# Reload shell
source ~/.zshrc
```

### Expected Outcome
- ✅ Unified command interface
- ✅ Discoverable scripts
- ✅ Duplicate identification
- ✅ Consistent usage patterns
- ✅ Documentation built-in

---

## Execution Timeline

### Day 1: High-Priority Cleanup (2-3 hours)

**Morning (1-1.5 hours):**
1. ✅ Run deduplication dry-run
2. ✅ Review results
3. ✅ Execute deduplication
4. ✅ Verify results

**Afternoon (1-1.5 hours):**
5. ✅ Clean node_modules from archives
6. ✅ Clean node_modules from redundant docs
7. ✅ Create .gitignore
8. ✅ Verify space savings

**Expected Recovery:** 2-2.5GB

### Day 2: Documentation Consolidation (2-3 hours)

**Morning (1.5-2 hours):**
1. ✅ Audit content in each doc system
2. ✅ Identify unique content
3. ✅ Migrate to Docusaurus

**Afternoon (0.5-1 hour):**
4. ✅ Archive old systems
5. ✅ Update references
6. ✅ Test documentation site

**Expected Recovery:** 110MB

### Week 2: Script Consolidation (Ongoing)

**Incremental work:**
1. ✅ Build script registry (1 hour)
2. ✅ Create CLI framework (2 hours)
3. ✅ Add 10-20 most-used scripts (2 hours)
4. ✅ Document usage patterns (1 hour)
5. ✅ Expand registry over time (ongoing)

---

## Safety Measures

### Before ANY Deletion

1. **Git Commit Current State**
   ```bash
   cd /Users/steven/AVATARARTS
   git add -A
   git commit -m "Pre-cleanup snapshot - $(date +%Y%m%d_%H%M%S)"
   ```

2. **Create Backup of Critical Data**
   ```bash
   # Backup deduplication mapping
   cp 01_TOOLS/data/dedupe_mapping.csv \
      01_TOOLS/data/dedupe_mapping_backup_$(date +%Y%m%d).csv

   # Backup script registry (if created)
   # cp 01_TOOLS/cli/scripts_registry.json ...
   ```

3. **Dry-Run Everything**
   - NEVER execute deletion without dry-run first
   - ALWAYS review dry-run results
   - CHECK for unexpected files

### Rollback Plan

If something goes wrong:

```bash
# Git rollback
git reset --hard HEAD~1

# Restore from Time Machine (if available)
# macOS: System Preferences → Time Machine → Enter Time Machine

# Re-clone from remote (if pushed)
# git clone <remote-url> AVATARARTS_restore
```

---

## Success Metrics

### Immediate (After Phases 1-2)

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Total Size | 7.8GB | ~5.3GB | -2.5GB (-32%) |
| Duplicate Files | 726 | 0 | -726 |
| node_modules Dirs | 331 | ~10 | -321 (-97%) |
| Disk I/O Speed | Baseline | +15-20% | Fewer files |

### Medium-Term (After Phase 3)

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Doc Systems | 4 | 1 | -3 |
| Doc Size | 397MB | ~287MB | -110MB |
| Doc Maintenance | 4x effort | 1x effort | -75% |

### Long-Term (After Phase 4)

| Metric | Before | After | Goal |
|--------|--------|-------|------|
| Script Discoverability | Low | High | Central CLI |
| Command Usage | Varies | Unified | `avatararts X Y` |
| Script Documentation | Scattered | Centralized | Registry |

---

## Next Steps

Ready to execute? Here's the order:

1. **IMMEDIATE** - Review this plan
2. **TODAY** - Phase 1: Deduplication (1-2 hours)
3. **TODAY** - Phase 2: Node.js cleanup (30 min)
4. **THIS WEEK** - Phase 3: Doc consolidation (2-3 hours)
5. **NEXT WEEK** - Phase 4: Script CLI (ongoing)

**Recommend starting with:** Phase 1 (Deduplication) - highest impact, safest with existing tools.

---

## Questions Before Proceeding?

- Review dry-run results together?
- Backup strategy sufficient?
- Timeline realistic?
- Any concerns about deletions?

**Ready to execute Phase 1?** 🚀
