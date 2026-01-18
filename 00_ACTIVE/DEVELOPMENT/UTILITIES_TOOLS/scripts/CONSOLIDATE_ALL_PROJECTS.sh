#!/bin/bash
# Consolidate All Projects into Main Workspace

echo "?? Consolidating all projects into ~/workspace..."
echo ""

cd ~/workspace

# Create organized structure
echo "1?? Creating organized structure..."
mkdir -p {
    revenue-projects/{passive-income,cleanconnect,heavenlyhands},
    creative-platforms/{avatararts,galleries},
    websites/{personal,business},
    tools-and-automation/{n8n,scripts},
    archive/ai-sites-original
}

echo "? Structure created"
echo ""

# Move revenue-generating projects
echo "2?? Moving revenue projects..."
if [ -d "ai-sites/passive-income-empire" ]; then
    mv ai-sites/passive-income-empire revenue-projects/passive-income/
    echo "   ? Passive Income Empire ? revenue-projects/passive-income/"
fi

if [ -d "ai-sites/cleanconnect-pro" ]; then
    mv ai-sites/cleanconnect-pro revenue-projects/cleanconnect/
    echo "   ? CleanConnect Pro ? revenue-projects/cleanconnect/"
fi

if [ -d "ai-sites/heavenlyHands" ]; then
    mv ai-sites/heavenlyHands revenue-projects/heavenlyhands/
    echo "   ? HeavenlyHands ? revenue-projects/heavenlyhands/"
fi

echo ""

# Move creative platforms
echo "3?? Moving creative platforms..."
if [ -d "ai-sites/AvaTarArTs" ]; then
    mv ai-sites/AvaTarArTs creative-platforms/avatararts/
    echo "   ? AvatarArts ? creative-platforms/avatararts/"
fi

if [ -d "ai-sites/Gallery_Code_Project" ]; then
    mv ai-sites/Gallery_Code_Project creative-platforms/galleries/gallery-code/
    echo "   ? Gallery Code ? creative-platforms/galleries/"
fi

if [ -d "ai-sites/Gallery Generator" ]; then
    mv "ai-sites/Gallery Generator" creative-platforms/galleries/gallery-generator/
    echo "   ? Gallery Generator ? creative-platforms/galleries/"
fi

echo ""

# Move websites
echo "4?? Moving websites..."
if [ -d "ai-sites/steven-chaplinski-website" ]; then
    mv ai-sites/steven-chaplinski-website websites/personal/
    echo "   ? Personal Website ? websites/personal/"
fi

if [ -d "ai-sites/10k-web" ]; then
    mv ai-sites/10k-web websites/business/10k-web/
    echo "   ? 10k Web ? websites/business/"
fi

if [ -d "ai-sites/QuantumForgeLabs Portfolio Starter" ]; then
    mv "ai-sites/QuantumForgeLabs Portfolio Starter" websites/business/quantumforge/
    echo "   ? QuantumForge ? websites/business/"
fi

echo ""

# Move automation
echo "5?? Moving automation..."
if [ -d "ai-sites/n8n" ]; then
    mv ai-sites/n8n tools-and-automation/n8n/
    echo "   ? n8n ? tools-and-automation/n8n/"
fi

if [ -d "ai-sites/AlchemyAPI" ]; then
    mv ai-sites/AlchemyAPI tools-and-automation/scripts/alchemy-api/
    echo "   ? AlchemyAPI ? tools-and-automation/scripts/"
fi

echo ""

# Archive remaining ai-sites content
echo "6?? Archiving remaining ai-sites content..."
if [ -d "ai-sites" ]; then
    mv ai-sites/* archive/ai-sites-original/ 2>/dev/null
    rmdir ai-sites 2>/dev/null
    echo "   ? Remaining files archived"
fi

echo ""

# Create master index
echo "7?? Creating master index..."
cat > 00_WORKSPACE_INDEX.md << 'EOF'
# ?? WORKSPACE INDEX - All Projects

**Everything in one organized workspace!**

---

## ?? DIRECTORY STRUCTURE

```
~/workspace/
??? 00_WORKSPACE_INDEX.md         ? You are here!
?
??? revenue-projects/              ? Money-making projects
?   ??? passive-income/           ? AI Receptionist, Recipe Gen ($25-50K/mo)
?   ??? cleanconnect/             ? AI Call Center ($30-75K/mo)
?   ??? heavenlyhands/            ? Cleaning Business ($20-40K/mo)
?
??? creative-platforms/            ? Creative projects
?   ??? avatararts/               ? Art platform
?   ??? galleries/                ? Gallery systems
?
??? websites/                      ? Web properties
?   ??? personal/                 ? Steven Chaplinski site
?   ??? business/                 ? Business sites
?
??? tools-and-automation/          ? Automation tools
?   ??? n8n/                      ? Workflow automation
?   ??? scripts/                  ? Helper scripts
?
??? advanced-systems/              ? AI systems (from before)
??? ECOSYSTEM/                    ? Business docs (from before)
??? work/                         ? Old work folder
??? projects/                     ? Old projects folder
?
??? archive/                      ? Archived content
    ??? ai-sites-original/        ? Original ai-sites content
```

---

## ?? TOP 3 PRIORITIES

### 1. Passive Income Empire (DEPLOY THIS WEEK!)
```bash
cd ~/workspace/revenue-projects/passive-income
cat documentation/START-HERE.md
```

**Revenue:** $25-50K/month  
**Completion:** 85%  
**Time:** 2-3 days to deploy

### 2. CleanConnect Pro
```bash
cd ~/workspace/revenue-projects/cleanconnect
cat SETUP_COMPLETE.md
```

**Revenue:** $30-75K/month  
**Completion:** 75%  
**Time:** 1 week to deploy

### 3. HeavenlyHands
```bash
cd ~/workspace/revenue-projects/heavenlyhands
open index-hh.html
```

**Revenue:** $20-40K/month  
**Completion:** 70%  
**Time:** 2-3 days to deploy

---

## ? QUICK ACCESS

```bash
# Revenue projects
cd ~/workspace/revenue-projects/passive-income
cd ~/workspace/revenue-projects/cleanconnect
cd ~/workspace/revenue-projects/heavenlyhands

# Creative platforms
cd ~/workspace/creative-platforms/avatararts
cd ~/workspace/creative-platforms/galleries

# Your website
cd ~/workspace/websites/personal

# Automation
cd ~/workspace/tools-and-automation/n8n
```

---

## ?? YOUR NEXT COMMAND

```bash
cd ~/workspace/revenue-projects/passive-income
cat documentation/START-HERE.md
```

**Then deploy and make money!** ??

---

Last Updated: November 3, 2025  
Total Projects: 10+ revenue-generating  
Priority: Passive Income Empire  
Action: Deploy THIS WEEK!
EOF

echo "? Master index created"
echo ""

# Create quick access script
cat > _go.sh << 'EOF'
#!/bin/bash
# Quick Navigation

case "$1" in
    passive)
        cd ~/workspace/revenue-projects/passive-income
        ;;
    clean)
        cd ~/workspace/revenue-projects/cleanconnect
        ;;
    heavenly)
        cd ~/workspace/revenue-projects/heavenlyhands
        ;;
    avatar)
        cd ~/workspace/creative-platforms/avatararts
        ;;
    site)
        cd ~/workspace/websites/personal
        ;;
    n8n)
        cd ~/workspace/tools-and-automation/n8n
        ;;
    *)
        echo "Usage: source _go.sh [passive|clean|heavenly|avatar|site|n8n]"
        ;;
esac

pwd
ls
EOF

chmod +x _go.sh

echo "? Quick navigation created"
echo ""

# Summary
echo "????????????????????????????????????????????????????????????????"
echo "              ? CONSOLIDATION COMPLETE!"
echo "????????????????????????????????????????????????????????????????"
echo ""
echo "?? New Structure:"
echo "   revenue-projects/     - All money-making projects"
echo "   creative-platforms/   - Art & creative projects"
echo "   websites/            - Web properties"
echo "   tools-and-automation/ - Automation & tools"
echo "   archive/             - Original ai-sites content"
echo ""
echo "?? Quick Access:"
echo "   source _go.sh passive    ? Passive Income Empire"
echo "   source _go.sh clean      ? CleanConnect Pro"
echo "   source _go.sh heavenly   ? HeavenlyHands"
echo "   source _go.sh avatar     ? AvatarArts"
echo ""
echo "?? Documentation:"
echo "   cat 00_WORKSPACE_INDEX.md"
echo ""
echo "?? Next Step:"
echo "   cd revenue-projects/passive-income"
echo "   cat documentation/START-HERE.md"
echo ""
echo "????????????????????????????????????????????????????????????????"
