# Merge and Combine Tool - Quick Guide

**Tool**: `merge_and_combine.py`  
**Purpose**: Intelligently merge and combine duplicate/similar directories and files

---

## 🚀 Quick Start

### Basic Usage
```bash
python3 merge_and_combine.py [COMMAND] [OPTIONS]
```

---

## 📊 Commands

### 1. Plan - View Merge Opportunities
```bash
# Show all merge opportunities
python3 merge_and_combine.py plan

# Show top 10 merge opportunities
python3 merge_and_combine.py plan --limit 10
```

**Shows:**
- Merge groups identified
- Target directories
- Source directories to merge
- Total size of each merge
- Similarity percentages

**Current Status:**
- **257 merge groups** found
- **504 items** to merge
- **Top opportunities:**
  - `avatararts.org` projects (55.71 MB)
  - Music files in `disco/mp3/` (29.57 MB)
  - Analysis visualizations (27.70 MB)

---

### 2. Execute - Run Merge Plan

#### Dry Run (Preview)
```bash
python3 merge_and_combine.py execute
```
Shows what would be merged without actually doing it.

#### Execute Merge
```bash
python3 merge_and_combine.py execute --execute
```
**⚠️ WARNING**: Actually merges directories!

#### Limit Number of Merges
```bash
# Merge only first 10 groups
python3 merge_and_combine.py execute --execute --limit 10
```

#### Merge Strategies

**copy_unique** (default):
- Only copies files that don't exist in target
- Skips identical files
- Best for avoiding duplicates

```bash
python3 merge_and_combine.py execute --execute --strategy copy_unique
```

**overwrite**:
- Overwrites existing files
- Use with caution

```bash
python3 merge_and_combine.py execute --execute --strategy overwrite
```

**skip**:
- Skips files that already exist
- Preserves target files

```bash
python3 merge_and_combine.py execute --execute --strategy skip
```

**rename**:
- Renames conflicting files
- Keeps both versions

```bash
python3 merge_and_combine.py execute --execute --strategy rename
```

---

### 3. Merge - Merge Specific Directories

#### Merge Two Directories
```bash
# Dry run
python3 merge_and_combine.py merge --source dir1/ --target dir2/

# Execute
python3 merge_and_combine.py merge --source dir1/ --target dir2/ --execute
```

**Example:**
```bash
python3 merge_and_combine.py merge \
  --source ai-sites/AvaTarArTs/avatararts.org \
  --target ARCHIVES_BACKUPS/archive/system/advanced-systems/SITES-AND-PROJECTS/READY-TO-LAUNCH/avatararts/avatararts.org \
  --execute
```

---

### 4. Combine - Combine Multiple Files

#### Combine Files
```bash
# Dry run
python3 merge_and_combine.py combine --files file1.txt file2.txt file3.txt --output merged.txt

# Execute
python3 merge_and_combine.py combine --files file1.txt file2.txt --output merged.txt --execute
```

#### Combine Strategies

**concatenate** (default):
- Combines all files with separators
- Preserves all content

```bash
python3 merge_and_combine.py combine --files file1.txt file2.txt --output merged.txt --strategy concatenate --execute
```

**unique_lines**:
- Removes duplicate lines
- Keeps only unique content

```bash
python3 merge_and_combine.py combine --files file1.txt file2.txt --output merged.txt --strategy unique_lines --execute
```

**newest**:
- Uses the newest file
- Ignores older files

```bash
python3 merge_and_combine.py combine --files file1.txt file2.txt --output merged.txt --strategy newest --execute
```

---

### 5. Consolidate - Find Duplicate Directories

#### Find All Duplicate Directories
```bash
python3 merge_and_combine.py consolidate
```

#### Find Specific Patterns
```bash
# Find directories with "heavenlyHands" in name
python3 merge_and_combine.py consolidate --patterns heavenlyHands

# Find multiple patterns
python3 merge_and_combine.py consolidate --patterns ai-sites disco
```

---

## 📈 Current Merge Opportunities

Based on `dedupe_mapping.csv`:

### Top 10 Merge Groups:

1. **avatararts.org** (55.71 MB)
   - 3 duplicate projects
   - Target: `ARCHIVES_BACKUPS/archive/.../avatararts.org`

2. **Kings and Queens of Litter** (29.57 MB)
   - 5 music file versions
   - Target: `CONTENT_ASSETS/ai-sites/ai-sites/disco/mp3/...`

3. **Analysis Visualizations** (27.70 MB)
   - 3 duplicate directories
   - Target: `BUSINESS/monetization/.../analysis_visualizations`

4. **avatararts-portfolio** (22.84 MB)
   - 3 duplicate projects
   - Target: `ARCHIVES_BACKUPS/archive/.../avatararts-portfolio`

5. **Willow_whispers-feelers-chill** (19.78 MB)
   - 10 music file versions
   - Target: `CONTENT_ASSETS/ai-sites/ai-sites/disco/mp3/...`

---

## 💡 Common Use Cases

### 1. Preview Merge Plan
```bash
# See what will be merged
python3 merge_and_combine.py plan

# See top 10
python3 merge_and_combine.py plan --limit 10
```

### 2. Merge Large Duplicates First
```bash
# Preview
python3 merge_and_combine.py execute --limit 10

# Execute top 10 merges
python3 merge_and_combine.py execute --execute --limit 10
```

### 3. Merge Specific Directories
```bash
# Merge ai-sites into CONTENT_ASSETS
python3 merge_and_combine.py merge \
  --source ai-sites/AvaTarArTs/avatararts.org \
  --target CONTENT_ASSETS/ai-sites/AvaTarArTs/avatararts.org \
  --execute
```

### 4. Combine Similar Files
```bash
# Combine multiple README files
python3 merge_and_combine.py combine \
  --files README1.md README2.md README3.md \
  --output README_merged.md \
  --execute
```

### 5. Find Duplicate Directories
```bash
# Find all duplicates
python3 merge_and_combine.py consolidate

# Find specific duplicates
python3 merge_and_combine.py consolidate --patterns heavenlyHands
```

---

## ⚠️ Safety Features

1. **Dry Run by Default** - No changes unless `--execute` is used
2. **Confirmation Required** - Asks for confirmation before merging
3. **Conflict Detection** - Shows conflicts before merging
4. **Multiple Strategies** - Choose how to handle conflicts
5. **Error Handling** - Continues even if some merges fail

---

## 🎯 Recommended Workflow

### Step 1: Analyze
```bash
python3 merge_and_combine.py plan
```

### Step 2: Preview Specific Merges
```bash
# Preview top 10
python3 merge_and_combine.py plan --limit 10

# Preview execution
python3 merge_and_combine.py execute --limit 10
```

### Step 3: Test with Small Merge
```bash
# Merge one small directory first
python3 merge_and_combine.py merge \
  --source small_dir1/ \
  --target small_dir2/ \
  --execute
```

### Step 4: Execute Large Merges
```bash
# Start with top 10
python3 merge_and_combine.py execute --execute --limit 10

# Then continue with more
python3 merge_and_combine.py execute --execute --limit 50
```

---

## 📝 Options Reference

| Option | Description | Example |
|--------|-------------|---------|
| `--root` | Root directory | `--root /path/to/project` |
| `--mapping` | Dedupe mapping file | `--mapping custom_mapping.csv` |
| `--strategy` | Merge strategy | `--strategy copy_unique` |
| `--execute` | Actually perform operations | `--execute` |
| `--limit` | Limit number of items | `--limit 10` |
| `--source` | Source directory | `--source dir1/` |
| `--target` | Target directory | `--target dir2/` |
| `--files` | Files to combine | `--files file1.txt file2.txt` |
| `--output` | Output file/path | `--output merged.txt` |
| `--patterns` | Directory patterns | `--patterns pattern1 pattern2` |

---

## 🔧 Merge Strategies Explained

### copy_unique (Recommended)
- **Best for**: Most cases
- **Behavior**: Only copies files that don't exist or are different
- **Result**: No duplicates, preserves unique content

### overwrite
- **Best for**: When target is outdated
- **Behavior**: Replaces existing files
- **Result**: Target gets updated with source content

### skip
- **Best for**: When target is preferred
- **Behavior**: Keeps existing files, skips conflicts
- **Result**: Target preserved, new files added

### rename
- **Best for**: When you want to keep both versions
- **Behavior**: Renames conflicting files
- **Result**: Both versions kept with different names

---

## 📊 Statistics

**Current Merge Opportunities:**
- **257 merge groups**
- **504 items** to merge
- **Largest group**: 55.71 MB (avatararts.org)
- **Total potential**: ~500+ MB of consolidation

---

**Tool Location**: `/Users/steven/AVATARARTS/merge_and_combine.py`  
**Status**: ✅ Ready to use  
**Last Updated**: January 3, 2026
