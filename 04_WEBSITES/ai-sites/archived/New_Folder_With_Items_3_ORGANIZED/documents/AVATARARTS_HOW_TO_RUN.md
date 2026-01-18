# 🚀 How to Run AvatarArts Projects

**Date**: October 24, 2025
**Version**: 1.0
**Status**: 🟢 Ready to Execute

---

## 📋 Quick Start Guide

### Prerequisites
```bash
# Check Node.js/npm installed
node --version  # v14+ required
npm --version   # 6+ required

# Check Git available
git --version

# Optional: Check for build tools
yarn --version
bun --version
```

---

## 🎯 Running Verification & Automation Scripts

### 1. **Verify Structure** ✅
```bash
cd /Users/steven/tehSiTes

# Run verification
bash AVATARARTS_RESTRUCTURE_VERIFY.sh

# Output: 41 checks, all passing
# Shows structure completeness and integration health
```

**Expected Output:**
```
✅ All 6 directories restructured
✓ 41/41 checks passed
✓ All directories verified
✓ External reference aligned
```

### 2. **Re-run Restructuring** (If needed)
```bash
cd /Users/steven/tehSiTes

# Run master setup script
bash AVATARARTS_RESTRUCTURING_MASTER.sh

# This recreates directory structure
# Safe to run multiple times
```

---

## 🎨 Project 1: AvatarArts_MERGED

**Purpose**: Master archive and data repository
**Role**: Central backup and source data

### Setup
```bash
cd /Users/steven/tehSiTes/AvatarArts_MERGED

# This is a data repository, not a web app
# Browse structure
tree -L 2

# View what's in each category
ls -la 01_Web_Assets/
ls -la 02_AI_Tools/
ls -la 08_Creative_Assets/
```

### Operations
```bash
# Count files by category
for dir in 0*/; do
  count=$(find "$dir" -type f | wc -l)
  echo "$dir: $count files"
done

# Backup the archive
tar -czf AvatarArts_MERGED_backup_$(date +%Y%m%d).tar.gz *

# Search for specific files
find . -name "*.py" -type f
find . -name "*.md" -type f | head -20
```

### Integration
```bash
# Used as source by other projects
# Symlink to other projects:
ln -s /Users/steven/tehSiTes/AvatarArts_MERGED/08_Creative_Assets \
      ./avatararts-gallery/03_Content/Images_Shared
```

---

## 🖼️ Project 2: avatararts-gallery

**Purpose**: Image management and gallery displays
**Port**: 3001 (default)

### Setup
```bash
cd /Users/steven/tehSiTes/avatararts-gallery

# Install dependencies
npm install
# or
yarn install
# or (fastest)
bun install

# View structure
tree -L 2 src/
tree -L 2 01_Gallery_Systems/
```

### Development
```bash
# Start dev server
npm run dev

# Server runs at: http://localhost:3000
# (or http://localhost:3001 if configured)

# In another terminal, monitor:
npm run watch

# Run tests
npm run test
```

### Build & Deploy
```bash
# Build for production
npm run build

# Output in: dist/ or .next/

# Preview production build
npm run preview

# Deploy to hosting
npm run deploy
```

### Content Management
```bash
# Add new gallery
cp -r 01_Gallery_Systems/Simple_Gallery 01_Gallery_Systems/My_Gallery

# Process images
npm run optimize:images

# Generate gallery index
npm run generate:index

# Sync with archive
npm run sync:archive
```

---

## 🌐 Project 3: avatararts-hub

**Purpose**: Central dashboard and command center
**Port**: 3000 (default)

### Setup
```bash
cd /Users/steven/tehSiTes/avatararts-hub

# Install dependencies
npm install

# Check environment
cat .env.example
cp .env.example .env.local
# Edit .env.local with your settings
```

### Development
```bash
# Start hub development
npm run dev

# Runs at: http://localhost:3000

# In separate terminal, watch changes
npm run watch

# View logs
npm run logs
```

### Integration Testing
```bash
# Test gallery integration
npm run test:gallery-integration

# Test portfolio integration
npm run test:portfolio-integration

# Test tools integration
npm run test:tools-integration

# Full integration test
npm run test:integration:full
```

### Build & Deploy
```bash
# Build hub
npm run build

# Start production server
npm run start

# Deploy hub
npm run deploy:hub

# Deploy to staging
npm run deploy:staging
```

### Dashboard Features
```bash
# Refresh dashboard data
npm run refresh:dashboard

# Sync all projects
npm run sync:all

# Generate reports
npm run generate:reports

# Monitor health
npm run monitor:health
```

---

## 💼 Project 4: avatararts-portfolio

**Purpose**: Professional portfolio showcase
**Port**: 3002 (default)

### Setup
```bash
cd /Users/steven/tehSiTes/avatararts-portfolio

# Install
npm install

# Setup portfolio data
npm run init:portfolio
```

### Development
```bash
# Start portfolio dev
npm run dev

# Runs at: http://localhost:3002

# Watch for changes
npm run watch
```

### Portfolio Management
```bash
# Add new project
npm run add:project
# Prompts for: title, description, images, results

# Edit project
npm run edit:project <project_id>

# Delete project
npm run remove:project <project_id>

# List all projects
npm run list:projects

# Feature project
npm run feature:project <project_id>
```

### Content Generation
```bash
# Generate descriptions from archive
npm run generate:descriptions

# Process project images
npm run optimize:portfolio-images

# Generate analytics
npm run generate:analytics

# Create case studies
npm run generate:case-studies
```

### Build & Deploy
```bash
# Build portfolio
npm run build

# Deploy
npm run deploy

# Sync with hub
npm run sync:hub
```

---

## 🛠️ Project 5: avatararts-tools

**Purpose**: Development utilities and AI automation
**Port**: 3003 (default)

### Setup
```bash
cd /Users/steven/tehSiTes/avatararts-tools

# Install
npm install

# Setup tools
npm run init:tools
```

### Development
```bash
# Start tools server
npm run dev

# Runs at: http://localhost:3003

# Watch for changes
npm run watch
```

### Running AI Agents
```bash
# List available agents
npm run agents:list

# Run specific agent
npm run agent:run image-processor

# Run workflow
npm run workflow:execute content-generation

# Monitor agent status
npm run agents:monitor

# Stop running agents
npm run agents:stop
```

### Content Tools
```bash
# Generate content
npm run generate:content

# Process images
npm run process:images

# Validate data
npm run validate:data

# Export content
npm run export:content --format=json
npm run export:content --format=csv
```

### Build Tools
```bash
# Build all projects
npm run build:all

# Build specific project
npm run build:gallery
npm run build:hub
npm run build:portfolio

# Optimize assets
npm run optimize:all

# Bundle for deployment
npm run bundle:all
```

### Configuration
```bash
# View current config
npm run config:show

# Update config
npm run config:set key value

# Environment setup
npm run setup:env

# Initialize deployment
npm run init:deployment
```

---

## 🌍 Project 6: avatararts.org

**Purpose**: Main organization website
**Port**: 3004 (default)

### Setup
```bash
cd /Users/steven/tehSiTes/avatararts.org

# Install
npm install

# Configure domain
npm run configure:domain

# Setup SSL
npm run configure:ssl
```

### Development
```bash
# Start main site dev
npm run dev

# Runs at: http://localhost:3000
# or: http://avatararts.local:3000

# Watch changes
npm run watch
```

### Content Management
```bash
# Add article
npm run add:article
# Prompts for: title, slug, content, category

# Edit article
npm run edit:article <slug>

# Publish article
npm run publish:article <slug>

# List articles
npm run list:articles

# Add resource
npm run add:resource
```

### Community Features
```bash
# Initialize forums
npm run init:forums

# Create discussion thread
npm run create:discussion

# Moderate content
npm run moderate:content
```

### SEO & Analytics
```bash
# Generate sitemap
npm run generate:sitemap

# Update robots.txt
npm run update:robots

# Optimize for SEO
npm run optimize:seo

# View analytics
npm run analytics:view
```

### Deployment
```bash
# Build for production
npm run build

# Deploy to production
npm run deploy:prod

# Deploy to staging
npm run deploy:staging

# Monitor deployment
npm run monitor:deploy
```

---

## 🔗 Running All Projects Together

### Complete Startup Sequence
```bash
# Terminal 1: Archive (no startup needed, just data)
cd /Users/steven/tehSiTes/AvatarArts_MERGED
echo "Archive ready"

# Terminal 2: Tools (start first for automation)
cd /Users/steven/tehSiTes/avatararts-tools
npm run dev  # Runs on :3003

# Terminal 3: Gallery
cd /Users/steven/tehSiTes/avatararts-gallery
npm run dev  # Runs on :3001

# Terminal 4: Portfolio
cd /Users/steven/tehSiTes/avatararts-portfolio
npm run dev  # Runs on :3002

# Terminal 5: Hub
cd /Users/steven/tehSiTes/avatararts-hub
npm run dev  # Runs on :3000

# Terminal 6: Main Site
cd /Users/steven/tehSiTes/avatararts.org
npm run dev  # Runs on :3000 (or :3004 if configured)
```

### Integration Testing
```bash
# Test all integrations
bash AVATARARTS_INTEGRATION_TEST.sh

# Or run individual tests
npm run test:integration

# Monitor integration health
npm run monitor:integration

# View integration report
cat reports/integration_health_$(date +%Y%m%d).json
```

---

## ⚡ Quick Commands Reference

### Run All Dev Servers (Parallel)
```bash
# Install concurrently
npm install -g concurrently

# Run all at once
cd /Users/steven/tehSiTes && \
concurrently \
  "cd avatararts-tools && npm run dev" \
  "cd avatararts-gallery && npm run dev" \
  "cd avatararts-portfolio && npm run dev" \
  "cd avatararts-hub && npm run dev" \
  "cd avatararts.org && npm run dev"
```

### Run Verification Only
```bash
# Quick check
bash AVATARARTS_RESTRUCTURE_VERIFY.sh 2>&1 | tail -20

# Full report
bash AVATARARTS_RESTRUCTURE_VERIFY.sh > verify_report_$(date +%Y%m%d_%H%M%S).txt
```

### Deploy Everything
```bash
# Build all
for dir in avatar*/; do
  cd "$dir"
  npm run build
  cd ..
done

# Deploy all
for dir in avatar*/; do
  cd "$dir"
  npm run deploy
  cd ..
done
```

---

## 🔍 Monitoring & Debugging

### Check Services Status
```bash
# Check if ports are in use
lsof -i :3000
lsof -i :3001
lsof -i :3002
lsof -i :3003
lsof -i :3004

# Kill service on port
kill -9 $(lsof -t -i:3000)
```

### View Logs
```bash
# Recent logs
npm run logs

# Follow logs
npm run logs:follow

# Filter logs
npm run logs | grep ERROR

# Save logs
npm run logs > logs_$(date +%Y%m%d).txt
```

### Test Endpoints
```bash
# Test gallery API
curl http://localhost:3001/api/galleries

# Test hub API
curl http://localhost:3000/api/hub/dashboard

# Test portfolio API
curl http://localhost:3002/api/projects

# Test tools API
curl http://localhost:3003/api/tools/status
```

---

## 📊 Performance Monitoring

### Monitor Resources
```bash
# Monitor in real-time
npm run monitor:resources

# Profile performance
npm run profile

# Generate performance report
npm run report:performance

# View metrics
npm run metrics:view
```

### Optimize
```bash
# Optimize all assets
npm run optimize:all

# Minimize bundle size
npm run minimize

# Clean up
npm run clean

# Clear cache
npm run cache:clear
```

---

## 🚨 Troubleshooting

### Port Already in Use
```bash
# Find process using port
lsof -i :3000

# Kill it
kill -9 <PID>

# Or use different port
PORT=3005 npm run dev
```

### Dependencies Issue
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Or
yarn install --fresh
```

### Integration Issues
```bash
# Check environment variables
echo $GALLERY_API
echo $HUB_API

# Verify services running
curl http://localhost:3000/api/status
curl http://localhost:3001/api/status

# Re-run verification
bash AVATARARTS_RESTRUCTURE_VERIFY.sh
```

### Build Failures
```bash
# Clean build
npm run clean:build
npm run build

# Debug build
npm run build -- --verbose

# Check for errors
npm run lint

# Fix auto-fixable issues
npm run lint -- --fix
```

---

## 📚 Documentation by Project

| Project   | Dev Port | Build           | Deploy           | Docs                                                   |
| --------- | -------- | --------------- | ---------------- | ------------------------------------------------------ |
| Gallery   | 3001     | `npm run build` | `npm run deploy` | [README](./avatararts-gallery/README_RESTRUCTURE.md)   |
| Hub       | 3000     | `npm run build` | `npm run deploy` | [README](./avatararts-hub/README_RESTRUCTURE.md)       |
| Portfolio | 3002     | `npm run build` | `npm run deploy` | [README](./avatararts-portfolio/README_RESTRUCTURE.md) |
| Tools     | 3003     | `npm run build` | `npm run deploy` | [README](./avatararts-tools/README_RESTRUCTURE.md)     |
| Main Site | 3004     | `npm run build` | `npm run deploy` | [README](./avatararts.org/README_RESTRUCTURE.md)       |

---

## ✅ Verification Checklist

After running projects:
- [ ] All 6 services running without errors
- [ ] Ports accessible (3000-3004)
- [ ] Integration tests passing
- [ ] Data syncing properly
- [ ] No console errors
- [ ] Performance acceptable
- [ ] Logs show normal operation

---

## 🎯 Common Workflows

### New Development Session
```bash
# 1. Verify structure
bash AVATARARTS_RESTRUCTURE_VERIFY.sh

# 2. Update dependencies
npm install --all

# 3. Start development servers
npm run dev:all

# 4. View dashboard
open http://localhost:3000
```

### Deployment Workflow
```bash
# 1. Test everything
npm run test:all

# 2. Build projects
npm run build:all

# 3. Verify builds
npm run verify:builds

# 4. Deploy
npm run deploy:all

# 5. Monitor
npm run monitor:deploy
```

### Integration Testing
```bash
# 1. Start all services
npm run dev:all

# 2. Run integration tests
npm run test:integration:full

# 3. Check results
npm run report:integration

# 4. Fix issues if needed
npm run fix:integration
```

---

## 🎉 You're Ready!

All projects are now ready to run. Choose your workflow:

**For Development:**
```bash
bash AVATARARTS_RESTRUCTURE_VERIFY.sh && npm run dev:all
```

**For Testing:**
```bash
bash AVATARARTS_RESTRUCTURE_VERIFY.sh && npm run test:all
```

**For Deployment:**
```bash
npm run build:all && npm run deploy:all
```

---

**Status**: 🟢 Ready to Execute
**Last Updated**: October 24, 2025
**All Systems GO!** 🚀
