#!/bin/bash

# ?? UNDO Workspace Reorganization
# Restore everything back to original locations

set -e

WORKSPACE="$HOME/workspace"
MUSIC_NOCTURNE="$HOME/Music/nocTurneMeLoDieS"

echo "?? UNDOING WORKSPACE REORGANIZATION..."
echo "======================================="
echo ""

cd "$WORKSPACE"

# 1. Restore JOB_SEARCH_2025
echo "?? Restoring JOB_SEARCH_2025..."
if [ -d "job-search" ]; then
    mv job-search JOB_SEARCH_2025
    echo "  ? job-search ? JOB_SEARCH_2025"
fi
echo ""

# 2. Remove symlink and restore music-empire from Music folder
echo "?? Restoring music-empire..."
if [ -L "projects/music-empire" ]; then
    rm projects/music-empire
    echo "  ? Removed symlink"
fi

# Copy music-empire content back from Music folder
if [ -d "$MUSIC_NOCTURNE" ]; then
    # Create music-empire in workspace
    mkdir -p music-empire
    
    # Copy workspace-related content back (scripts, data, docs)
    if [ -d "$MUSIC_NOCTURNE/automation" ]; then
        rsync -av "$MUSIC_NOCTURNE/automation/" music-empire/ 2>/dev/null || true
    fi
    if [ -d "$MUSIC_NOCTURNE/data/merged-catalog" ]; then
        rsync -av "$MUSIC_NOCTURNE/data/merged-catalog" music-empire/ 2>/dev/null || true
    fi
    if [ -d "$MUSIC_NOCTURNE/data/suno-export" ]; then
        rsync -av "$MUSIC_NOCTURNE/data/suno-export" music-empire/ 2>/dev/null || true
    fi
    if [ -d "$MUSIC_NOCTURNE/docs" ]; then
        rsync -av "$MUSIC_NOCTURNE/docs/" music-empire/ 2>/dev/null || true
    fi
    
    # Copy all the project folders that were moved
    for dir in suno-complete-catalog suno-downloads suno-generation \
               nocturnemelodies archive distribution revenue-tracking prompts; do
        if [ -d "$MUSIC_NOCTURNE/$dir" ]; then
            rsync -av "$MUSIC_NOCTURNE/$dir" music-empire/ 2>/dev/null || true
        fi
    done
    
    echo "  ? Restored music-empire content"
fi
echo ""

# 3. Restore projects from projects/ folder
echo "?? Restoring project folders..."
if [ -d "projects" ]; then
    for proj in projects/*/; do
        if [ -d "$proj" ]; then
            dirname=$(basename "$proj")
            # Add -complete suffix back if it was removed
            case $dirname in
                cleanconnect|avatararts|quantumforge|retention-suite|heavenlyhands)
                    mv "$proj" "${dirname}-complete"
                    echo "  ? projects/$dirname ? ${dirname}-complete"
                    ;;
                passive-income-empire|music-empire)
                    if [ "$dirname" != "music-empire" ]; then
                        mv "$proj" "$dirname"
                        echo "  ? projects/$dirname ? $dirname"
                    fi
                    ;;
            esac
        fi
    done
    
    # Remove empty projects folder
    rmdir projects 2>/dev/null && echo "  ? Removed empty projects/" || echo "  ??  projects/ has remaining files"
fi
echo ""

# 4. Restore scripts
echo "?? Restoring scripts..."
if [ -d "automation/python-scripts" ]; then
    mv automation/python-scripts/*.py . 2>/dev/null || true
    echo "  ? Restored Python scripts to root"
fi

if [ -d "automation/shell-scripts" ]; then
    mv automation/shell-scripts/*.sh . 2>/dev/null || true
    echo "  ? Restored shell scripts to root"
fi

if [ -d "automation/organize" ]; then
    mv automation/organize . 2>/dev/null || true
    echo "  ? Restored organize/ folder"
fi

if [ -d "automation/scripts" ]; then
    mv automation/scripts . 2>/dev/null || true
    echo "  ? Restored scripts/ folder"
fi

# Remove automation folder if empty
rmdir automation/python-scripts automation/shell-scripts automation/utilities automation 2>/dev/null || true
echo ""

# 5. Restore data files
echo "?? Restoring data files..."
if [ -d "data/csvs" ]; then
    mv data/csvs/*.csv . 2>/dev/null || true
    echo "  ? Restored CSV files to root"
fi

if [ -d "data/csvs-consolidated" ]; then
    mv data/csvs-consolidated . 2>/dev/null || true
    echo "  ? Restored csvs-consolidated/"
fi

# Remove data folder if empty
rmdir data/csvs data/exports data/reports data 2>/dev/null || true
echo ""

# 6. Restore documentation
echo "?? Restoring documentation..."
if [ -d "docs" ]; then
    # Move markdown files back to root
    find docs -maxdepth 1 -name "*.md" -exec mv {} . \; 2>/dev/null || true
    echo "  ? Restored markdown files to root"
    
    # Remove docs subfolder structure
    rmdir docs/navigation docs/summaries docs/guides docs/archived-docs docs 2>/dev/null || true
fi
echo ""

# 7. Restore archive
echo "?? Restoring archive..."
if [ -d "old-archive" ]; then
    mv old-archive archive
    echo "  ? old-archive ? archive"
fi
echo ""

# 8. Remove temp folder
echo "?? Cleaning up temp folder..."
if [ -d "temp" ]; then
    mv temp/*.txt . 2>/dev/null || true
    rmdir temp 2>/dev/null && echo "  ? Removed temp/" || echo "  ??  temp/ has remaining files"
fi
echo ""

# 9. Remove numbered folders if empty
echo "?? Removing empty folders..."
for dir in 01_ACTIVE_PROJECTS 02_AUTOMATION 03_DATA 04_DOCUMENTATION \
           05_EDUCATION 06_MARKETPLACE 07_ANALYSIS 08_ARCHIVE 09_TEMP; do
    if [ -d "$dir" ]; then
        rmdir "$dir" 2>/dev/null && echo "  ? Removed $dir" || echo "  ??  $dir not empty or doesn't exist"
    fi
done
echo ""

echo "? UNDO COMPLETE!"
echo "================="
echo ""
echo "Your workspace has been restored to its original state."
echo ""
echo "?? Current structure:"
ls -1 | head -20
echo ""
echo "?? Everything should be back where it was!"
