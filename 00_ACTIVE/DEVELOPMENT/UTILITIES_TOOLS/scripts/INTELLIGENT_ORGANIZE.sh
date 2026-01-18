#!/bin/bash
# Intelligent Organization - Sort everything logically

echo "?? Intelligent Organization Starting..."
echo ""

cd ~/workspace

# Create clean directory structure
echo "1?? Creating directory structure..."
mkdir -p {
    launch/{scripts,guides,plans},
    setup/{mamba,apis,testing},
    docs/{session,analysis,reference},
    tools/{daily,automation,testing},
    archive/{old-scripts,old-docs}
}

echo "? Structure created"
echo ""

# 2. Move LAUNCH-related files
echo "2?? Organizing launch materials..."
mv *LAUNCH*.md *CAMPAIGN*.md *SALES*.md launch/guides/ 2>/dev/null
mv *EMAIL*.md *PROSPECT*.md launch/plans/ 2>/dev/null
mv find_prospects.py generate_emails.py auto_campaign.py launch/scripts/ 2>/dev/null

# 3. Move SETUP files
echo "3?? Organizing setup files..."
mv *MAMBA*.md *environment*.yml setup/mamba/ 2>/dev/null
mv setup_mamba_env.sh activate_env.sh fix_packages.sh setup/mamba/ 2>/dev/null
mv *API*.md *KEYS*.md setup/apis/ 2>/dev/null
mv test_*.py *TEST*.py setup/testing/ 2>/dev/null

# 4. Move DOCUMENTATION
echo "4?? Organizing documentation..."
mv *SESSION*.md *NARRATIVE*.md *ORGANIZATION*.md docs/session/ 2>/dev/null
mv *SCAN*.md *ANALYSIS*.md *SUGGESTIONS*.md docs/analysis/ 2>/dev/null
mv *GUIDE*.md *REFERENCE*.md *INDEX*.md docs/reference/ 2>/dev/null
mv REALITY_CHECK.md SETUP_BEFORE_SALES.md docs/reference/ 2>/dev/null

# 5. Move TOOLS
echo "5?? Organizing tools..."
mv daily_dashboard.sh revenue_dashboard*.py campaign_stats.py tools/daily/ 2>/dev/null
mv launch.sh wizard.sh install_all.sh backup_workspace.sh tools/automation/ 2>/dev/null
mv quick_*.py test_connections*.py tools/testing/ 2>/dev/null

# 6. Archive old/redundant files
echo "6?? Archiving redundant files..."
mv *MERGE*.sh *merge*.sh *cleanup*.sh archive/old-scripts/ 2>/dev/null
mv *PLAN*.md *ROADMAP*.md archive/old-docs/ 2>/dev/null

# 7. Keep essential files in root
echo "7?? Organizing root files..."
# These stay in root:
# - START.md
# - README.md  
# - READY_TO_LAUNCH.md
# - SMART_ACTIVATION_PLAN.md

# 8. Create master index
echo "8?? Creating master index..."
cat > 00_START_HERE.md << 'EOF'
# ?? START HERE - Your Organized Workspace

**Everything organized and ready to use!**

---

## ?? DIRECTORY STRUCTURE

```
~/workspace/
??? 00_START_HERE.md          ? You are here!
??? START.md                   ? Quick start guide
??? README.md                  ? Overview
?
??? launch/                    ? Revenue generation
?   ??? guides/               ? Sales & campaign guides
?   ??? plans/                ? Campaign plans
?   ??? scripts/              ? Automation scripts
?
??? setup/                     ? Technical setup
?   ??? mamba/                ? Python environment
?   ??? apis/                 ? API configuration
?   ??? testing/              ? Testing tools
?
??? docs/                      ? All documentation
?   ??? session/              ? Today's session docs
?   ??? analysis/             ? System analysis
?   ??? reference/            ? Reference guides
?
??? tools/                     ? Daily tools
?   ??? daily/                ? Dashboards & tracking
?   ??? automation/           ? Helper scripts
?   ??? testing/              ? Test utilities
?
??? work/                      ? Your projects
??? advanced-systems/          ? AI systems
??? ECOSYSTEM/                ? Business docs
?
??? archive/                   ? Old files
    ??? old-scripts/
    ??? old-docs/
```

---

## ? QUICK ACTIONS

### Start Your Day:
```bash
tools/daily/daily_dashboard.sh
```

### Launch Revenue Campaign:
```bash
cd launch/
cat guides/LAUNCH_WITH_WHAT_WORKS.md
```

### Setup Environment:
```bash
cd setup/mamba/
bash setup_mamba_env.sh
```

### Test Everything:
```bash
cd setup/testing/
python test_connections_fixed.py
```

---

## ?? TOP 3 PRIORITIES

1. **Find HeavenlyHands** (proven $20-40K/month)
   - Location: ~/workspace/work/ OR ~/projects/
   - Action: Clone for new clients

2. **Activate Environment**
   - Run: setup/mamba/setup_mamba_env.sh
   - Test: setup/testing/test_everything.py

3. **Choose Revenue Path**
   - Option A: Clone HeavenlyHands (1 week)
   - Option B: Build AvatarArts (3 weeks)
   - Read: docs/reference/SMART_ACTIVATION_PLAN.md

---

## ?? KEY DOCUMENTS

### For Beginners:
- START.md
- launch/guides/LAUNCH_WITH_WHAT_WORKS.md
- setup/mamba/MAMBA_SETUP_GUIDE.md

### For Deep Dive:
- docs/analysis/DEEP_SCAN_RESULTS.md
- docs/session/SESSION_COMPLETE.md
- docs/reference/SMART_ACTIVATION_PLAN.md

### For Technical Setup:
- setup/apis/API_KEYS_SETUP_GUIDE.md
- setup/mamba/MAMBA_SETUP_GUIDE.md
- setup/testing/test_connections_fixed.py

---

## ?? YOUR NEXT COMMAND

```bash
# Find your proven revenue generator
find ~/ -name "*heavenly*" -type d | head -20

# Then clone it for new clients!
```

---

Last Updated: November 3, 2025  
Status: ? ORGANIZED  
Action: Find HeavenlyHands & clone!
EOF

echo "? Master index created"
echo ""

# 9. Create quick access aliases file
cat > _QUICK_ACCESS.sh << 'EOF'
#!/bin/bash
# Quick Access Aliases - Source this file

alias launch="cd ~/workspace/launch && ls"
alias setup="cd ~/workspace/setup && ls"
alias docs="cd ~/workspace/docs && ls"
alias tools="cd ~/workspace/tools && ls"

alias dash="~/workspace/tools/daily/daily_dashboard.sh"
alias test="cd ~/workspace/setup/testing && python test_connections_fixed.py"

echo "? Quick access aliases loaded!"
echo ""
echo "Commands:"
echo "  launch  - Go to launch materials"
echo "  setup   - Go to setup files"
echo "  docs    - Go to documentation"
echo "  tools   - Go to tools"
echo "  dash    - Run daily dashboard"
echo "  test    - Test all connections"
EOF

chmod +x _QUICK_ACCESS.sh

echo "? Quick access created"
echo ""

# 10. Summary
echo "????????????????????????????????????????????????????????????????"
echo "              ? INTELLIGENT ORGANIZATION COMPLETE!"
echo "????????????????????????????????????????????????????????????????"
echo ""
echo "?? Structure:"
echo "   launch/    - Revenue generation materials"
echo "   setup/     - Technical setup"
echo "   docs/      - All documentation"
echo "   tools/     - Daily use tools"
echo "   archive/   - Old files"
echo ""
echo "?? Files organized by:"
echo "   ? Purpose (launch, setup, docs, tools)"
echo "   ? Type (guides, scripts, plans)"
echo "   ? Frequency (daily, one-time, reference)"
echo ""
echo "?? Your next step:"
echo "   cat 00_START_HERE.md"
echo ""
echo "?? Or jump right in:"
echo "   source _QUICK_ACCESS.sh"
echo "   launch"
echo ""
echo "????????????????????????????????????????????????????????????????"
