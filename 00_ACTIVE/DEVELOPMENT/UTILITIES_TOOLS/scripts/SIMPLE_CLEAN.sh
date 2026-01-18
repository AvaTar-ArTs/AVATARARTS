#!/bin/bash

# ?? SIMPLE Workspace Cleanup
# No deep nesting, just flat and organized

set -e
cd ~/workspace

echo "?? Simple Workspace Cleanup..."
echo "=============================="
echo ""

# 1. Move job search
echo "?? Job Search..."
if [ -d "JOB_SEARCH_2025" ]; then
    mv JOB_SEARCH_2025 job-search 2>/dev/null && echo "  ? JOB_SEARCH_2025 ? job-search"
fi
echo ""

# 2. Create projects/ and move all projects
echo "?? Projects..."
mkdir -p projects

for proj in music-empire cleanconnect-complete avatararts-complete \
            quantumforge-complete retention-suite-complete \
            heavenlyhands-complete passive-income-empire; do
    if [ -d "$proj" ]; then
        newname=${proj%-complete}
        mv "$proj" "projects/$newname" 2>/dev/null && echo "  ? $proj ? projects/$newname"
    fi
done
echo ""

# 3. Create automation/ and move all scripts
echo "?? Automation..."
mkdir -p automation

# Move loose Python scripts
for script in *.py; do
    if [ -f "$script" ]; then
        mv "$script" automation/ 2>/dev/null && echo "  ? $script"
    fi
done

# Move loose shell scripts (except this one)
for script in *.sh; do
    if [ -f "$script" ] && [ "$script" != "SIMPLE_CLEAN.sh" ]; then
        mv "$script" automation/ 2>/dev/null && echo "  ? $script"
    fi
done

# Move script folders
if [ -d "organize" ]; then
    mv organize automation/ 2>/dev/null && echo "  ? organize/"
fi
if [ -d "scripts" ]; then
    mv scripts automation/ 2>/dev/null && echo "  ? scripts/"
fi
echo ""

# 4. Create data/ and move data files
echo "?? Data..."
mkdir -p data

# Move CSV files
for csv in *.csv; do
    if [ -f "$csv" ]; then
        mv "$csv" data/ 2>/dev/null && echo "  ? $csv"
    fi
done

# Move csvs-consolidated
if [ -d "csvs-consolidated" ]; then
    mv csvs-consolidated data/ 2>/dev/null && echo "  ? csvs-consolidated/"
fi
echo ""

# 5. Create docs/ and move documentation
echo "?? Documentation..."
mkdir -p docs

# Move markdown files (except START_HERE.md and SIMPLE_*.md)
for md in *.md; do
    if [ -f "$md" ] && [ "$md" != "START_HERE.md" ] && [[ "$md" != SIMPLE_*.md ]]; then
        mv "$md" docs/ 2>/dev/null && echo "  ? $md"
    fi
done

# Move existing docs folder if different
if [ -d "docs.backup" ]; then
    cp -r docs.backup/* docs/ 2>/dev/null && echo "  ? Merged old docs"
fi
echo ""

# 6. Handle archive
echo "?? Archive..."
if [ -d "archive" ]; then
    mv archive old-archive 2>/dev/null && echo "  ? archive ? old-archive"
fi
echo ""

# 7. Create temp/ for misc files
echo "?? Temp files..."
mkdir -p temp

for txt in *.txt; do
    if [ -f "$txt" ]; then
        mv "$txt" temp/ 2>/dev/null && echo "  ? $txt"
    fi
done
echo ""

# 8. Create START_HERE.md
echo "?? Creating START_HERE.md..."
cat > START_HERE.md << 'EOF'
# ?? Workspace - Start Here

**Your workspace, simplified.**

---

## ?? What's Where:

### ?? **Active Work**

**job-search/**  
Complete job search system - applications, cover letters, research, tracking

**projects/**  
All your active projects:
- music-empire - Music distribution (783 songs!)
- cleanconnect - Marketplace platform
- avatararts - Gallery system
- quantumforge - Media processing
- retention-suite - Vue.js app
- heavenlyhands - Cleaning service
- passive-income - Revenue systems

---

### ?? **Tools & Data**

**automation/**  
All scripts and automation tools

**data/**  
All data files, CSVs, and reports

---

### ?? **Reference**

**docs/**  
All documentation, summaries, guides

**education/**  
Learning materials

**marketplace/**  
Business projects

**music-analysis/**  
Music analysis work

**old-archive/**  
Archived files

**temp/**  
Temporary/scratch files

---

## ?? Quick Navigation:

```bash
# Job search (PRIORITY!)
cd ~/workspace/job-search
open THE_COMPLETE_STORY.md

# Projects
cd ~/workspace/projects/music-empire
cd ~/workspace/projects/cleanconnect

# Scripts
cd ~/workspace/automation

# Data
cd ~/workspace/data
```

---

## ?? Next Steps:

1. **Job Search:** Go to `job-search/` and apply to Suno!
2. **Projects:** Check `projects/` for your active work
3. **Tools:** Find scripts in `automation/`

---

**Everything is organized. Everything is accessible.** ?

Last updated: $(date +%Y-%m-%d)
EOF

echo "  ? Created START_HERE.md"
echo ""

# 9. Final report
echo "? WORKSPACE REORGANIZED!"
echo "========================="
echo ""
echo "?? New structure:"
echo ""
ls -d */ 2>/dev/null | grep -v "^projects/" | sed 's|/$||' | while read dir; do
    echo "  ?? $dir"
done
echo ""
echo "?? Read: START_HERE.md"
echo ""
echo "?? Your workspace is now clean and simple!"
