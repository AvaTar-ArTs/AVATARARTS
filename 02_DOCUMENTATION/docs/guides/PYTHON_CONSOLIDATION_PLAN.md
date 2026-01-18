# Python File Consolidation Plan

## Overview

You have **115 organize Python files** and **80 clean Python files** scattered across your system. This plan identifies consolidation opportunities and provides a roadmap for merging similar functionality.

## Consolidation Opportunities

### 1. Music Organization Files
**Files to Consolidate:**
- `/Users/steven/Music/nocTurneMeLoDieS/SCRIPTS/organize_into_albums.py`
- `/Users/steven/Music/nocTurneMeLoDieS/SCRIPTS/smart_organize_with_metadata.py`
- `/Users/steven/Music/nocTurneMeLoDieS/SCRIPTS/music_library_organizer.py`

**Consolidation Strategy:**
- Create `~/pythons/music-organizer.py` with modular architecture
- Support both filename-based and metadata-based classification
- Include album pattern detection and duplicate handling

### 2. General File Organization
**Files to Consolidate:**
- `/Users/steven/organize/organize.py` (CSV-based file copying)
- `/Users/steven/organize/organize_files.py` (file type-based organization)
- `/Users/steven/organize/organize_albums.py`
- `/Users/steven/organize/organize copy.py`

**Consolidation Strategy:**
- Create `~/pythons/file-organizer.py` with multiple organization modes:
  - File type-based (extensions)
  - CSV-based (structured moves)
  - Content-based (file analysis)
  - Metadata-based (ID3, EXIF, etc.)

### 3. Cleanup Scripts
**Files to Consolidate:**
- `/Users/steven/Music/nocTurneMeLoDieS/SCRIPTS/cleanup_duplicates.py`
- `/Users/steven/Music/nocTurneMeLoDieS/SCRIPTS/execute_cleanup.py`
- `/Users/steven/Music/nocTurneMeLoDieS/SCRIPTS/standardize_folders_and_cleanup.py`

**Consolidation Strategy:**
- Create `~/pythons/file-cleaner.py` with:
  - Duplicate detection (hash-based, filename-based, content-based)
  - Folder standardization
  - Safe deletion with backup options

## Consolidation Architecture

### Proposed Consolidated Scripts

#### 1. `~/pythons/unified-organizer.py`
```python
class UnifiedOrganizer:
    def organize_by_filetype(self, directory):
        # File extension-based organization
        pass

    def organize_by_csv(self, csv_file, destination):
        # CSV-based structured organization
        pass

    def organize_music_by_albums(self, music_dir, metadata_csv=None):
        # Music-specific album organization
        pass

    def organize_by_content(self, directory):
        # Content analysis-based organization
        pass
```

#### 2. `~/pythons/intelligent-cleaner.py`
```python
class IntelligentCleaner:
    def find_duplicates(self, directory, method='hash'):
        # Multiple duplicate detection methods
        pass

    def cleanup_folders(self, directory, patterns):
        # Folder standardization
        pass

    def remove_empty_dirs(self, directory):
        # Clean empty directories
        pass
```

#### 3. `~/pythons/music-manager.py`
```python
class MusicManager:
    def organize_albums(self, music_dir, strategy='filename'):
        # Album organization with multiple strategies
        pass

    def standardize_metadata(self, music_dir):
        # ID3 tag standardization
        pass

    def detect_duplicates(self, music_dir):
        # Music-specific duplicate detection
        pass
```

## Immediate Consolidation Actions

### Phase 1: Music Files (High Priority)
1. **Merge music organization scripts** into `~/pythons/music-organizer.py`
2. **Preserve functionality** from all three music scripts
3. **Add configuration options** for different organization strategies

### Phase 2: General Organization Files
1. **Merge file organization scripts** into `~/pythons/file-organizer.py`
2. **Support multiple organization modes** in single interface
3. **Add dry-run and preview modes** for safety

### Phase 3: Cleanup Scripts
1. **Merge cleanup scripts** into `~/pythons/file-cleaner.py`
2. **Implement multiple duplicate detection methods**
3. **Add safety features** (backup, confirmation prompts)

## File Migration Strategy

### Keep (Preserve as-is)
- `~/pythons/` - Main consolidated scripts
- `~/.harbor/` - Harbor LLM toolkit (already organized)
- `~/workspace/` - Project-specific scripts (keep context)

### Archive (Move to `~/pythons/_archives/`)
- Duplicate organize/clean scripts
- Old versions with "copy" in name
- Experimental scripts

### Delete (After verification)
- Exact duplicates
- Broken/unused scripts
- Temporary test files

## Implementation Steps

### Step 1: Analysis
```bash
# Find all organize/clean files
find ~ -name "*organize*.py" -type f > organize_files.txt
find ~ -name "*clean*.py" -type f > clean_files.txt

# Analyze duplicates
python3 ~/pythons/analyze_duplicate_scripts.py
```

### Step 2: Create Consolidated Scripts
```bash
# Create unified organizer
cp ~/Music/nocTurneMeLoDieS/SCRIPTS/smart_organize_with_metadata.py ~/pythons/unified-organizer.py

# Add functionality from other scripts
# Merge organize_files.py features
# Merge organize.py CSV features
```

### Step 3: Test and Verify
```bash
# Test on sample directories
python3 ~/pythons/unified-organizer.py --dry-run ~/Music/test_dir
python3 ~/pythons/unified-organizer.py --mode filetype ~/Downloads
```

### Step 4: Archive Old Files
```bash
# Create archives
mkdir -p ~/pythons/_archives/organize_scripts/
mv ~/organize/*.py ~/pythons/_archives/organize_scripts/

# Keep only consolidated versions
```

## Benefits of Consolidation

1. **Reduced Maintenance** - Fewer files to update
2. **Consistent Interface** - Single way to organize files
3. **Feature Integration** - All organization methods available
4. **Better Documentation** - Single comprehensive guide
5. **Easier Discovery** - Clear location for organization tools

## Risk Mitigation

- **Backup before deletion** - Keep archives of old scripts
- **Test thoroughly** - Verify consolidated scripts work correctly
- **Keep project-specific scripts** - Don't break existing workflows
- **Document migration** - Track what was consolidated where

## Next Steps

1. **Start with music organization** - Highest duplication
2. **Create unified interface** - Single command for all organization
3. **Add configuration files** - Preserve different organization patterns
4. **Document consolidated scripts** - Update CLAUDE.md files
5. **Clean up archives** - Remove truly obsolete files after verification

This consolidation will transform your 195+ scattered organization scripts into 3-5 powerful, well-documented tools that cover all your file management needs.