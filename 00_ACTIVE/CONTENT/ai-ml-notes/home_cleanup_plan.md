# 🏠 Home Directory Cleanup Plan

## Current Issues
1. **Scattered files**: Many files directly in home directory
2. **Inconsistent naming**: Mixed naming conventions
3. **Old backups**: Multiple backup files
4. **Unused directories**: Empty or rarely used folders

## Cleanup Actions

### 1. Move Files to Appropriate Locations
```bash
# Move Python scripts to organized structure
mv ~/complete_file_processor.py ~/Documents/python/00_production/
mv ~/comprehensive_file_processor.py ~/Documents/python/00_production/
mv ~/consolidate_to_dradu.py ~/Documents/python/00_production/
mv ~/final_consolidation.py ~/Documents/python/00_production/

# Move cleanup scripts to utilities
mv ~/tehSiTes_*_cleanup*.py ~/Documents/python/03_utilities/

# Move reports to documentation
mv ~/*_report.json ~/Documents/reports/
mv ~/*_report.md ~/Documents/reports/
```

### 2. Create Proper Directory Structure
```
~/
├── Documents/
│   ├── python/           # Organized Python scripts
│   ├── projects/         # Active projects
│   ├── reports/          # Generated reports
│   └── archives/         # Old files and backups
├── Pictures/             # Organized media
├── Movies/
├── Music/
├── Downloads/            # Temporary downloads
├── Desktop/              # Desktop files
└── .env.d/              # Environment configuration
```

### 3. Remove Unnecessary Files
```bash
# Remove old backup files
rm ~/.env.backup.20251014_*
rm ~/.env-bak
rm ~/.env.zip
rm ~/.envt

# Remove duplicate files
rm ~/AquaTouch\ v3.6.10.bttpreset.zip
rm ~/Miniforge3-Darwin-x86_64.sh

# Remove old reports (after backing up)
mv ~/*_report.json ~/Documents/archives/reports/
```

### 4. Create Maintenance Scripts
```bash
# Create cleanup script
cat > ~/Documents/python/03_utilities/cleanup_home.py << 'EOF'
#!/usr/bin/env python3
"""
Home directory cleanup utility
"""
import os
import shutil
from pathlib import Path

def cleanup_home():
    home = Path.home()
    
    # Move Python files to organized structure
    python_files = list(home.glob("*.py"))
    for file in python_files:
        if file.name.startswith("tehSiTes_"):
            dest = home / "Documents" / "python" / "03_utilities"
        else:
            dest = home / "Documents" / "python" / "00_production"
        
        dest.mkdir(parents=True, exist_ok=True)
        shutil.move(str(file), str(dest / file.name))
        print(f"Moved {file.name} to {dest}")
    
    # Move JSON reports
    json_files = list(home.glob("*_report.json"))
    for file in json_files:
        dest = home / "Documents" / "reports"
        dest.mkdir(parents=True, exist_ok=True)
        shutil.move(str(file), str(dest / file.name))
        print(f"Moved {file.name} to {dest}")

if __name__ == "__main__":
    cleanup_home()
EOF

chmod +x ~/Documents/python/03_utilities/cleanup_home.py
```

## Space Savings Estimate
- **Python scripts organization**: ~2-3GB (removing duplicates)
- **Environment cleanup**: ~50MB (removing old backups)
- **General cleanup**: ~1-2GB (removing unnecessary files)
- **Total estimated savings**: ~3-5GB