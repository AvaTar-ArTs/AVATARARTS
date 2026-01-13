# Step-by-Step Action Plan: Home Directory Organization

**Created:** November 25, 2025  
**Based on:** Deep Content-Aware Analysis

---

## Overview

This is a practical, step-by-step guide to organizing your home directory. Each step includes:
- What to do
- Why it matters
- How long it takes
- Expected outcome

**Total Estimated Time:** 4-6 hours (spread over multiple sessions)

---

## PHASE 1: SECURITY FIRST (Critical - Do Immediately)

### Step 1.1: Revoke Exposed API Keys
**Time:** 5 minutes  
**Priority:** 🔴 CRITICAL

**Actions:**
1. Open `~/.env.d/API_AUDIT_REPORT.md`
2. Identify exposed keys:
   - GOAPI key (in git history)
   - Old STABILITY AI key (in git history)
3. Log into each service dashboard
4. Revoke the exposed keys
5. Generate new keys
6. Update your environment files with new keys
7. Document the rotation in `~/.env.d/KEY_ROTATION_LOG.md`

**Why:** Exposed keys in git history are permanent security risks

**Expected Outcome:** Exposed keys revoked, new keys active

---

### Step 1.2: Secure Backup Files
**Time:** 10 minutes  
**Priority:** 🔴 CRITICAL

**Actions:**
1. Navigate to `~/.env.d/`
2. List all backup files:
   ```bash
   cd ~/.env.d
   ls -la *.bak
   ```
3. Create secure archive directory:
   ```bash
   mkdir -p ~/.env.d/archived/encrypted
   ```
4. Move backup files to archive:
   ```bash
   mv *.bak ~/.env.d/archived/encrypted/
   ```
5. Set restrictive permissions:
   ```bash
   chmod 700 ~/.env.d/archived
   chmod 600 ~/.env.d/archived/encrypted/*
   ```
6. Add to `.gitignore` if using git:
   ```bash
   echo "archived/" >> ~/.env.d/.gitignore
   ```

**Why:** Backup files contain real API keys and pose security risk

**Expected Outcome:** 30 backup files secured in restricted archive

---

### Step 1.3: Verify .env.d Permissions
**Time:** 2 minutes  
**Priority:** 🔴 CRITICAL

**Actions:**
1. Check current permissions:
   ```bash
   ls -la ~/.env.d/*.env
   ```
2. Set correct permissions (600 = read/write owner only):
   ```bash
   chmod 600 ~/.env.d/*.env
   chmod 700 ~/.env.d
   ```
3. Verify:
   ```bash
   ls -la ~/.env.d/ | head -10
   ```

**Why:** Prevents unauthorized access to API keys

**Expected Outcome:** All env files have secure permissions

---

## PHASE 2: API KEY ORGANIZATION (High Priority)

### Step 2.1: Run Smart Organizer (Dry Run)
**Time:** 5 minutes

**Actions:**
1. Navigate to `.env.d`:
   ```bash
   cd ~/.env.d
   ```
2. Run smart organizer in dry-run mode:
   ```bash
   python3 smart_organize.py
   ```
3. Review the output:
   - See which services are detected
   - Check security issues flagged
   - Review organization plan
4. Read the report:
   ```bash
   cat smart_organization_report.json
   ```

**Why:** Understand what changes will be made before executing

**Expected Outcome:** Report showing current state and proposed organization

---

### Step 2.2: Execute Smart Organization
**Time:** 10 minutes

**Actions:**
1. Review the dry-run results from Step 2.1
2. If satisfied, run with `--live` flag:
   ```bash
   python3 smart_organize.py --live
   ```
3. Verify new structure:
   ```bash
   tree -L 2 ~/.env.d/active
   ```
4. Check that files moved correctly:
   ```bash
   ls -la ~/.env.d/active/*/
   ```

**Why:** Organizes API keys by actual service type, not just filename

**Expected Outcome:** API keys organized into: ai-services, creative-tools, analytics, automation, infrastructure

---

### Step 2.3: Update Environment Variable Loading
**Time:** 15 minutes

**Actions:**
1. Review your shell config (`~/.zshrc` or `~/.bashrc`)
2. Update environment loading to use new structure:
   ```bash
   # Example for zshrc
   for env_file in ~/.env.d/active/*/*.env; do
     [ -f "$env_file" ] && source "$env_file"
   done
   ```
3. Test loading:
   ```bash
   source ~/.zshrc
   echo $OPENAI_API_KEY  # Should still work
   ```
4. Document the new structure in `~/.env.d/README.md`

**Why:** Ensures your environment variables still load correctly

**Expected Outcome:** Environment variables load from new organized structure

---

## PHASE 3: DOCUMENTATION INDEX (Medium Priority)

### Step 3.1: Create Documentation Directory
**Time:** 2 minutes

**Actions:**
1. Create main docs directory:
   ```bash
   mkdir -p ~/docs/{knowledge-base,projects,guides,references}
   ```
2. Create subdirectories:
   ```bash
   mkdir -p ~/docs/knowledge-base/{concepts,tutorials,references}
   mkdir -p ~/docs/projects/{active,archived,templates}
   ```

**Why:** Establishes structure for centralized documentation

**Expected Outcome:** Documentation directory structure created

---

### Step 3.2: Run Documentation Indexer
**Time:** 10 minutes

**Actions:**
1. Navigate to docs directory:
   ```bash
   cd ~/docs
   ```
2. Run the indexer:
   ```bash
   python3 create_docs_index.py
   ```
3. Review the generated index:
   ```bash
   cat index.md | head -50
   ```
4. Check the JSON catalog:
   ```bash
   cat catalog.json | python3 -m json.tool | head -30
   ```

**Why:** Creates searchable index of all 3,354 markdown files

**Expected Outcome:** Master index and categorized catalog of all documentation

---

### Step 3.3: Review and Refine Index
**Time:** 20 minutes

**Actions:**
1. Open the index:
   ```bash
   open ~/docs/index.md
   ```
2. Review categories:
   - Are projects correctly categorized?
   - Are guides properly identified?
   - Are references complete?
3. Manually adjust if needed:
   - Move mis-categorized files
   - Add missing documentation
   - Update cross-references
4. Test search functionality (if implemented)

**Why:** Ensures index accurately reflects your documentation

**Expected Outcome:** Accurate, usable documentation index

---

## PHASE 4: HTML SITE ORGANIZATION (Medium Priority)

### Step 4.1: Analyze HTML Files
**Time:** 15 minutes

**Actions:**
1. Run HTML analysis:
   ```bash
   cd ~/Documents/HTML
   find . -name "*.html" -type f | wc -l
   ```
2. Identify export files:
   ```bash
   ls -la misc-exports/ | head -20
   ```
3. Identify active sites:
   ```bash
   # Check sites-navigator
   ls -la ~/sites-navigator/
   # Check documentation sites
   ls -la ~/docs_*/*.html
   ```
4. Create organization plan:
   - List active sites
   - List export files
   - List galleries
   - List tools

**Why:** Understand what you have before organizing

**Expected Outcome:** Clear picture of HTML file types and purposes

---

### Step 4.2: Archive Export Files
**Time:** 30 minutes

**Actions:**
1. Create archive structure:
   ```bash
   mkdir -p ~/archives/html-exports/{conversations,portfolios,misc}
   ```
2. Move conversation exports:
   ```bash
   mv ~/Documents/HTML/misc-exports/* ~/archives/html-exports/conversations/ 2>/dev/null
   ```
3. Move portfolio exports:
   ```bash
   mv ~/Documents/HTML/Portfolio/* ~/archives/html-exports/portfolios/ 2>/dev/null
   ```
4. Compress archives:
   ```bash
   cd ~/archives/html-exports
   tar -czf conversations.tar.gz conversations/
   tar -czf portfolios.tar.gz portfolios/
   ```
5. Verify:
   ```bash
   ls -lh ~/archives/html-exports/*.tar.gz
   ```

**Why:** Removes 3,000+ export files from active workspace

**Expected Outcome:** Exports archived and compressed, active workspace cleaner

---

### Step 4.3: Organize Active Sites
**Time:** 45 minutes

**Actions:**
1. Create site structure:
   ```bash
   mkdir -p ~/sites/{galleries,tools,documentation,projects}
   ```
2. Move gallery sites:
   ```bash
   # Move from Pictures directories
   find ~/Pictures -name "*.html" -type f -exec mv {} ~/sites/galleries/ \;
   ```
3. Move documentation sites:
   ```bash
   cp -r ~/docs_docsify ~/sites/documentation/
   cp -r ~/docs_mkdocs ~/sites/documentation/
   cp -r ~/docs_seo ~/sites/documentation/
   ```
4. Move tool sites:
   ```bash
   # Identify and move interactive HTML tools
   # (Review each before moving)
   ```
5. Update sites-navigator:
   ```bash
   cd ~/sites-navigator
   # Add new site locations to js/sites-data.js
   ```

**Why:** Organizes active sites by purpose

**Expected Outcome:** Active sites organized, easy to find and maintain

---

### Step 4.4: Update Sites Navigator
**Time:** 30 minutes

**Actions:**
1. Open sites-navigator data file:
   ```bash
   nano ~/sites-navigator/js/sites-data.js
   ```
2. Add newly organized sites:
   - Add gallery sites from `~/sites/galleries/`
   - Add documentation sites from `~/sites/documentation/`
   - Add tool sites from `~/sites/tools/`
3. Test navigator:
   ```bash
   cd ~/sites-navigator
   python3 server.py
   # Open http://localhost:8080 in browser
   ```
4. Verify all sites accessible

**Why:** Single access point for all sites

**Expected Outcome:** Sites navigator includes all organized sites

---

## PHASE 5: PROJECT LIFECYCLE MANAGEMENT (Low Priority)

### Step 5.1: Categorize Projects by Status
**Time:** 15 minutes

**Actions:**
1. Review workspace projects:
   ```bash
   cd ~/workspace
   ls -la
   ```
2. Create lifecycle directories:
   ```bash
   mkdir -p ~/workspace/{production,development,incubating,archive}
   ```
3. Move projects by completion %:
   ```bash
   # Production (85-100%)
   mv passive-income-empire production/
   mv retention-suite-complete production/
   
   # Development (50-84%)
   mv cleanconnect-complete development/
   mv heavenlyhands-complete development/
   mv avatararts-complete development/
   
   # Incubating (<50%)
   mv marketplace incubating/
   mv education incubating/
   mv quantumforge-complete incubating/
   ```
4. Update workspace README:
   ```bash
   nano ~/workspace/README.md
   # Document new structure
   ```

**Why:** Clear project status helps prioritize work

**Expected Outcome:** Projects organized by lifecycle stage

---

### Step 5.2: Map Project Dependencies
**Time:** 20 minutes

**Actions:**
1. Create dependency mapping file:
   ```bash
   touch ~/workspace/PROJECT_DEPENDENCIES.md
   ```
2. For each project, document:
   - Which API keys it uses
   - Which other projects it depends on
   - Which tools it requires
   - Documentation locations
3. Example format:
   ```markdown
   ## passive-income-empire
   - APIs: OpenAI, ElevenLabs
   - Dependencies: None
   - Tools: Python 3.9+
   - Docs: ~/workspace/production/passive-income-empire/docs/
   ```
4. Review and update regularly

**Why:** Understand project relationships and resource needs

**Expected Outcome:** Clear dependency map for all projects

---

### Step 5.3: Create Project Dashboard
**Time:** 30 minutes

**Actions:**
1. Create dashboard script:
   ```bash
   touch ~/workspace/project_dashboard.py
   ```
2. Script should show:
   - Project name
   - Completion %
   - Status (production/development/incubating)
   - Dependencies
   - Next steps
   - Revenue potential
3. Run dashboard:
   ```bash
   python3 ~/workspace/project_dashboard.py
   ```
4. Schedule regular reviews (weekly)

**Why:** Visual overview helps with prioritization

**Expected Outcome:** Dashboard showing all projects at a glance

---

## PHASE 6: CONFIGURATION CLEANUP (Low Priority)

### Step 6.1: Identify Active Configs
**Time:** 20 minutes

**Actions:**
1. Check config modification dates:
   ```bash
   find ~/.config -type f -mtime -30 | wc -l
   ```
2. List recently modified configs:
   ```bash
   find ~/.config -type f -mtime -30 -ls | sort -k9
   ```
3. Identify unused configs:
   ```bash
   # Configs not modified in 6+ months
   find ~/.config -type f -mtime +180 | head -20
   ```
4. Document findings:
   ```bash
   touch ~/.config/CONFIG_AUDIT.md
   ```

**Why:** Identify what's actually being used

**Expected Outcome:** List of active vs. potentially unused configs

---

### Step 6.2: Archive Unused Configs
**Time:** 15 minutes

**Actions:**
1. Create archive:
   ```bash
   mkdir -p ~/.config/archived/$(date +%Y-%m)
   ```
2. Move old configs (carefully):
   ```bash
   # Review each before moving
   find ~/.config -type f -mtime +180 -exec ls -lh {} \;
   # Move only if sure they're unused
   ```
3. Document what was archived:
   ```bash
   echo "Archived on $(date)" >> ~/.config/CONFIG_AUDIT.md
   ```

**Why:** Reduces clutter, improves performance

**Expected Outcome:** Unused configs archived, active configs clear

---

## PHASE 7: MAINTENANCE & AUTOMATION (Ongoing)

### Step 7.1: Set Up Regular Audits
**Time:** 10 minutes

**Actions:**
1. Create audit script:
   ```bash
   touch ~/scripts/weekly_audit.sh
   ```
2. Script should check:
   - API key security
   - Documentation updates
   - Site functionality
   - Project status
3. Schedule weekly run:
   ```bash
   # Add to crontab
   crontab -e
   # Add: 0 9 * * 1 ~/scripts/weekly_audit.sh
   ```

**Why:** Maintain organization over time

**Expected Outcome:** Automated weekly health checks

---

### Step 7.2: Create Maintenance Checklist
**Time:** 10 minutes

**Actions:**
1. Create checklist file:
   ```bash
   touch ~/ORGANIZATION_MAINTENANCE.md
   ```
2. Include:
   - Weekly: Review new files, update indexes
   - Monthly: Security audit, config cleanup
   - Quarterly: Full directory analysis
3. Set reminders in calendar

**Why:** Keep system organized long-term

**Expected Outcome:** Clear maintenance schedule

---

## QUICK REFERENCE: Command Summary

### Security Commands
```bash
# Revoke exposed keys (manual - do in service dashboards)
# Secure backups
cd ~/.env.d && mv *.bak archived/encrypted/ && chmod 700 archived
chmod 600 ~/.env.d/*.env && chmod 700 ~/.env.d
```

### Organization Commands
```bash
# API keys
cd ~/.env.d && python3 smart_organize.py --live

# Documentation
mkdir -p ~/docs && cd ~/docs && python3 create_docs_index.py

# HTML sites
mkdir -p ~/sites/{galleries,tools,docs} ~/archives/html-exports
# Move files as needed

# Projects
cd ~/workspace && mkdir -p {production,development,incubating,archive}
# Move projects by completion %
```

### Verification Commands
```bash
# Check security
ls -la ~/.env.d/*.env | grep -v "^-rw-------"

# Check organization
tree -L 2 ~/.env.d/active
ls -la ~/docs/
ls -la ~/sites/
```

---

## Progress Tracking

Use this checklist to track your progress:

### Phase 1: Security
- [ ] Step 1.1: Revoked exposed API keys
- [ ] Step 1.2: Secured backup files
- [ ] Step 1.3: Verified permissions

### Phase 2: API Organization
- [ ] Step 2.1: Ran smart organizer (dry run)
- [ ] Step 2.2: Executed organization
- [ ] Step 2.3: Updated environment loading

### Phase 3: Documentation
- [ ] Step 3.1: Created docs directory
- [ ] Step 3.2: Ran documentation indexer
- [ ] Step 3.3: Reviewed and refined index

### Phase 4: HTML Sites
- [ ] Step 4.1: Analyzed HTML files
- [ ] Step 4.2: Archived export files
- [ ] Step 4.3: Organized active sites
- [ ] Step 4.4: Updated sites navigator

### Phase 5: Projects
- [ ] Step 5.1: Categorized by status
- [ ] Step 5.2: Mapped dependencies
- [ ] Step 5.3: Created dashboard

### Phase 6: Configs
- [ ] Step 6.1: Identified active configs
- [ ] Step 6.2: Archived unused configs

### Phase 7: Maintenance
- [ ] Step 7.1: Set up regular audits
- [ ] Step 7.2: Created maintenance checklist

---

## Time Estimates by Phase

- **Phase 1 (Security):** 17 minutes - DO FIRST
- **Phase 2 (API Keys):** 30 minutes
- **Phase 3 (Documentation):** 32 minutes
- **Phase 4 (HTML Sites):** 2 hours
- **Phase 5 (Projects):** 65 minutes
- **Phase 6 (Configs):** 35 minutes
- **Phase 7 (Maintenance):** 20 minutes

**Total:** ~4.5 hours (can be spread over multiple days)

---

## Priority Order

1. **Today:** Phase 1 (Security) - 17 minutes
2. **This Week:** Phase 2 (API Keys) - 30 minutes
3. **This Week:** Phase 3 (Documentation) - 32 minutes
4. **Next Week:** Phase 4 (HTML Sites) - 2 hours
5. **Next Week:** Phase 5 (Projects) - 65 minutes
6. **When Time Permits:** Phase 6 (Configs) - 35 minutes
7. **Ongoing:** Phase 7 (Maintenance) - 20 minutes setup

---

## Notes

- **Backup First:** Before making major changes, backup important files
- **Test Incrementally:** Test each phase before moving to next
- **Document Changes:** Keep notes on what you changed and why
- **Ask Questions:** If unsure about a step, review the "Why" section

---

**Start with Phase 1 (Security) - it's critical and only takes 17 minutes!**
