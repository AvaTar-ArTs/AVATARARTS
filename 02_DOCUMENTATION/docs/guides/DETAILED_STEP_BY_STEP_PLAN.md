# Detailed Step-by-Step Action Plan: Home Directory Organization

**Created:** November 25, 2025  
**Format:** Hierarchical Multi-Level Outline  
**Total Estimated Time:** 4-6 hours

---

## PHASE 1: SECURITY FIRST (Critical - Do Immediately)

**Total Time:** 17 minutes  
**Priority:** 🔴 CRITICAL

---

### Step 1.1: Revoke Exposed API Keys
**Time:** 5 minutes  
**Priority:** 🔴 CRITICAL

#### A. Identify Exposed Keys
1. Open the API audit report:
   ```bash
   open ~/.env.d/API_AUDIT_REPORT.md
   ```
2. Locate the security warnings section
3. Identify exposed keys:
   - a. GOAPI key (exposed in git history)
   - b. Old STABILITY AI key (exposed in git history)
4. Note the service names and key identifiers
5. Document in a temporary file:
   ```bash
   touch ~/.env.d/KEYS_TO_REVOKE.txt
   echo "GOAPI key - exposed in git history" >> ~/.env.d/KEYS_TO_REVOKE.txt
   echo "STABILITY AI key (old) - exposed in git history" >> ~/.env.d/KEYS_TO_REVOKE.txt
   ```

#### B. Revoke Keys in Service Dashboards
1. For GOAPI:
   - a. Navigate to GOAPI dashboard (or service provider)
   - b. Log into your account
   - c. Navigate to API Keys section
   - d. Locate the exposed key
   - e. Click "Revoke" or "Delete"
   - f. Confirm revocation
   - g. Document revocation:
     ```bash
     echo "$(date): GOAPI key revoked" >> ~/.env.d/KEY_ROTATION_LOG.md
     ```

2. For STABILITY AI:
   - a. Navigate to Stability AI dashboard
   - b. Log into your account
   - c. Go to API Keys/Account Settings
   - d. Find the old/exposed key
   - e. Revoke the key
   - f. Confirm action
   - g. Document:
     ```bash
     echo "$(date): STABILITY AI old key revoked" >> ~/.env.d/KEY_ROTATION_LOG.md
     ```

#### C. Generate New Keys
1. For GOAPI:
   - a. In GOAPI dashboard, create new API key
   - b. Copy the new key securely
   - c. Save temporarily (don't commit to git):
     ```bash
     echo "NEW_GOAPI_KEY=<new_key_here>" > ~/.env.d/temp_new_keys.txt
     ```

2. For STABILITY AI:
   - a. In Stability AI dashboard, generate new key
   - b. Copy the new key
   - c. Add to temp file:
     ```bash
     echo "NEW_STABILITY_KEY=<new_key_here>" >> ~/.env.d/temp_new_keys.txt
     ```

#### D. Update Environment Files
1. Locate the env files containing these keys:
   ```bash
   cd ~/.env.d
   grep -r "GOAPI" *.env
   grep -r "STABILITY" *.env
   ```

2. Update each file:
   - a. Open the file:
     ```bash
     nano art-vision.env  # or whichever file contains the key
     ```
   - b. Find the old key line
   - c. Replace with new key from temp file
   - d. Save the file
   - e. Verify update:
     ```bash
     grep "GOAPI\|STABILITY" art-vision.env
     ```

3. Clean up temp file:
   ```bash
   rm ~/.env.d/temp_new_keys.txt
   ```

#### E. Document Rotation
1. Create/update rotation log:
   ```bash
   touch ~/.env.d/KEY_ROTATION_LOG.md
   ```

2. Add entry:
   ```markdown
   ## Key Rotation Log
   
   ### $(date)
   - GOAPI key: Revoked and regenerated (exposed in git history)
   - STABILITY AI key: Revoked and regenerated (exposed in git history)
   - Reason: Security - keys exposed in version control
   - Action: Revoked old keys, generated new ones, updated env files
   ```

**Expected Outcome:** Exposed keys revoked, new keys active, rotation documented

---

### Step 1.2: Secure Backup Files
**Time:** 10 minutes  
**Priority:** 🔴 CRITICAL

#### A. Identify Backup Files
1. Navigate to .env.d directory:
   ```bash
   cd ~/.env.d
   ```

2. List all backup files:
   ```bash
   ls -la *.bak
   ```

3. Count backup files:
   ```bash
   find . -name "*.bak" -type f | wc -l
   ```

4. List backup files with details:
   ```bash
   find . -name "*.bak" -type f -ls
   ```

5. Document what you find:
   ```bash
   find . -name "*.bak" -type f > backup_files_list.txt
   cat backup_files_list.txt
   ```

#### B. Create Secure Archive Structure
1. Create archive directory:
   ```bash
   mkdir -p ~/.env.d/archived/encrypted
   ```

2. Create subdirectories by date:
   ```bash
   mkdir -p ~/.env.d/archived/encrypted/$(date +%Y-%m)
   ```

3. Verify structure:
   ```bash
   tree -L 2 ~/.env.d/archived
   ```

#### C. Move Backup Files
1. Review backup files before moving:
   ```bash
   head -5 *.bak 2>/dev/null | less
   ```

2. Move backup files to archive:
   ```bash
   find . -maxdepth 1 -name "*.bak" -type f -exec mv {} ~/.env.d/archived/encrypted/$(date +%Y-%m)/ \;
   ```

3. Verify move completed:
   ```bash
   ls -la ~/.env.d/archived/encrypted/$(date +%Y-%m)/
   ```

4. Confirm no backups remain in main directory:
   ```bash
   ls -la *.bak 2>/dev/null
   # Should show "No such file or directory"
   ```

#### D. Set Restrictive Permissions
1. Set directory permissions (700 = owner only):
   ```bash
   chmod 700 ~/.env.d/archived
   chmod 700 ~/.env.d/archived/encrypted
   chmod 700 ~/.env.d/archived/encrypted/$(date +%Y-%m)
   ```

2. Set file permissions (600 = owner read/write only):
   ```bash
   chmod 600 ~/.env.d/archived/encrypted/$(date +%Y-%m)/*
   ```

3. Verify permissions:
   ```bash
   ls -la ~/.env.d/archived/encrypted/$(date +%Y-%m)/
   # Should show -rw------- for files, drwx------ for directories
   ```

#### E. Secure Git Configuration
1. Check if .env.d is in a git repository:
   ```bash
   cd ~/.env.d
   git status 2>/dev/null || echo "Not a git repository"
   ```

2. If using git, ensure archived directory is ignored:
   ```bash
   touch ~/.env.d/.gitignore
   echo "archived/" >> ~/.env.d/.gitignore
   echo "*.bak" >> ~/.env.d/.gitignore
   ```

3. Verify .gitignore:
   ```bash
   cat ~/.env.d/.gitignore
   ```

4. If git exists, check git status:
   ```bash
   git status
   # Should not show archived/ directory
   ```

#### F. Document Archive
1. Create archive manifest:
   ```bash
   touch ~/.env.d/archived/ARCHIVE_MANIFEST.md
   ```

2. Document what was archived:
   ```markdown
   # Archive Manifest
   
   Date: $(date)
   
   ## Archived Files
   - Backup files (.bak) moved to encrypted archive
   - Total files: $(ls -1 ~/.env.d/archived/encrypted/$(date +%Y-%m)/ | wc -l)
   - Reason: Security - backup files contain API keys
   - Location: ~/.env.d/archived/encrypted/$(date +%Y-%m)/
   ```

**Expected Outcome:** 30 backup files secured in restricted archive, permissions set, git configured

---

### Step 1.3: Verify .env.d Permissions
**Time:** 2 minutes  
**Priority:** 🔴 CRITICAL

#### A. Check Current Permissions
1. Check .env.d directory permission:
   ```bash
   ls -ld ~/.env.d
   ```

2. Check env file permissions:
   ```bash
   ls -la ~/.env.d/*.env | head -10
   ```

3. Identify files with incorrect permissions:
   ```bash
   ls -la ~/.env.d/*.env | grep -v "^-rw-------"
   ```

#### B. Set Correct Permissions
1. Set directory to 700 (owner only):
   ```bash
   chmod 700 ~/.env.d
   ```

2. Set all .env files to 600 (owner read/write):
   ```bash
   chmod 600 ~/.env.d/*.env
   ```

3. Set other sensitive files:
   ```bash
   chmod 600 ~/.env.d/*.txt 2>/dev/null
   chmod 600 ~/.env.d/*.csv 2>/dev/null
   ```

#### C. Verify Permissions
1. Verify directory:
   ```bash
   ls -ld ~/.env.d
   # Should show: drwx------
   ```

2. Verify files:
   ```bash
   ls -la ~/.env.d/*.env | head -5
   # Should all show: -rw-------
   ```

3. Test that others cannot access:
   ```bash
   # This should fail if permissions are correct
   cat ~/.env.d/*.env 2>&1 | head -1
   # Should work (you're the owner)
   ```

**Expected Outcome:** All env files have secure permissions (600), directory is 700

---

## PHASE 2: API KEY ORGANIZATION (High Priority)

**Total Time:** 30 minutes  
**Priority:** 🟡 HIGH

---

### Step 2.1: Run Smart Organizer (Dry Run)
**Time:** 5 minutes

#### A. Prepare for Analysis
1. Navigate to .env.d directory:
   ```bash
   cd ~/.env.d
   ```

2. Verify smart organizer script exists:
   ```bash
   ls -la smart_organize.py
   ```

3. If missing, verify it was created:
   ```bash
   ls -la ~/.env.d/smart_organize.py
   ```

4. Check script permissions:
   ```bash
   chmod +x ~/.env.d/smart_organize.py
   ```

#### B. Run Dry Run Analysis
1. Execute smart organizer in dry-run mode:
   ```bash
   python3 smart_organize.py
   ```

2. Observe the output:
   - a. Service detection results
   - b. Security issues flagged
   - c. Organization plan
   - d. File movement preview

3. Review service analysis:
   - a. Note which services are detected
   - b. Count files per service
   - c. Identify any unexpected findings

4. Review security analysis:
   - a. Note any security issues
   - b. Review backup file warnings
   - c. Check for exposed keys

#### C. Review Organization Plan
1. Check the generated report:
   ```bash
   cat smart_organization_report.json | python3 -m json.tool
   ```

2. Review proposed structure:
   - a. Active directory organization
   - b. Service categories
   - c. File movements planned

3. Verify the plan makes sense:
   - a. Services are correctly identified
   - b. Categories are logical
   - c. No important files will be misplaced

#### D. Document Findings
1. Create notes file:
   ```bash
   touch ~/.env.d/ORGANIZATION_NOTES.md
   ```

2. Document observations:
   ```markdown
   # Organization Analysis Notes
   
   Date: $(date)
   
   ## Services Detected
   - [List services found]
   
   ## Security Issues
   - [List any issues]
   
   ## Organization Plan
   - [Note the proposed structure]
   
   ## Questions/Concerns
   - [Any items to verify before executing]
   ```

**Expected Outcome:** Understanding of current state and proposed changes, report generated

---

### Step 2.2: Execute Smart Organization
**Time:** 10 minutes

#### A. Final Verification
1. Review dry-run results from Step 2.1
2. Verify you understand the changes
3. Ensure no concerns remain
4. Backup current structure (optional but recommended):
   ```bash
   cp -r ~/.env.d ~/.env.d.backup_$(date +%Y%m%d)
   ```

#### B. Execute Organization
1. Run smart organizer with --live flag:
   ```bash
   cd ~/.env.d
   python3 smart_organize.py --live
   ```

2. Monitor the output:
   - a. Watch for any errors
   - b. Note files being moved
   - c. Verify service detection

3. Wait for completion:
   - a. Script will show progress
   - b. Final summary will display
   - c. Report will be saved

#### C. Verify New Structure
1. Check active directory structure:
   ```bash
   tree -L 2 ~/.env.d/active
   ```

2. If tree not available, use ls:
   ```bash
   ls -la ~/.env.d/active/
   ls -la ~/.env.d/active/*/
   ```

3. Verify files moved correctly:
   - a. Check ai-services directory:
     ```bash
     ls -la ~/.env.d/active/ai-services/
     ```
   - b. Check creative-tools directory:
     ```bash
     ls -la ~/.env.d/active/creative-tools/
     ```
   - c. Check other categories as created

4. Verify no files lost:
   ```bash
   # Count files before (from backup if you made one)
   # Count files after
   find ~/.env.d/active -type f | wc -l
   ```

#### D. Review Organization Report
1. Open the final report:
   ```bash
   cat ~/.env.d/smart_organization_report.json | python3 -m json.tool
   ```

2. Review statistics:
   - a. Total files organized
   - b. Services found
   - c. Security issues (should be fewer now)

3. Save a summary:
   ```bash
   echo "Organization completed: $(date)" >> ~/.env.d/ORGANIZATION_NOTES.md
   ```

**Expected Outcome:** API keys organized into service-based structure, report generated

---

### Step 2.3: Update Environment Variable Loading
**Time:** 15 minutes

#### A. Review Current Loading Method
1. Check your shell configuration:
   ```bash
   echo $SHELL
   # If zsh:
   cat ~/.zshrc | grep -i "env\|\.env" | head -10
   # If bash:
   cat ~/.bashrc | grep -i "env\|\.env" | head -10
   ```

2. Identify current loading mechanism:
   - a. Direct source commands
   - b. Loop through files
   - c. Specific file references
   - d. Other methods

3. Document current approach:
   ```bash
   touch ~/.env.d/LOADING_METHOD.md
   echo "Current method:" >> ~/.env.d/LOADING_METHOD.md
   cat ~/.zshrc | grep -A 5 -B 5 "\.env" >> ~/.env.d/LOADING_METHOD.md
   ```

#### B. Create New Loading Script
1. Create loading script:
   ```bash
   touch ~/.env.d/load_env.sh
   ```

2. Write the script:
   ```bash
   cat > ~/.env.d/load_env.sh << 'EOF'
   #!/bin/bash
   # Load environment variables from organized structure
   
   ENV_DIR="$HOME/.env.d/active"
   
   # Load all env files from active directories
   for env_file in "$ENV_DIR"/*/*.env "$ENV_DIR"/*.env 2>/dev/null; do
       if [ -f "$env_file" ]; then
           # Export variables (handle both KEY=value and export KEY=value)
           set -a
           source "$env_file"
           set +a
       fi
   done
   EOF
   ```

3. Make executable:
   ```bash
   chmod +x ~/.env.d/load_env.sh
   ```

#### C. Update Shell Configuration
1. Backup current config:
   ```bash
   cp ~/.zshrc ~/.zshrc.backup_$(date +%Y%m%d)
   ```

2. Comment out old loading method:
   ```bash
   # Edit .zshrc and comment out old env loading
   nano ~/.zshrc
   # Or use sed to comment:
   # sed -i.bak 's/^source.*\.env/# &/' ~/.zshrc
   ```

3. Add new loading method:
   ```bash
   echo "" >> ~/.zshrc
   echo "# Load environment variables from organized structure" >> ~/.zshrc
   echo "source ~/.env.d/load_env.sh" >> ~/.zshrc
   ```

4. Save and exit

#### D. Test Environment Loading
1. Reload shell configuration:
   ```bash
   source ~/.zshrc
   ```

2. Test key variables:
   ```bash
   echo $OPENAI_API_KEY | head -c 20
   echo $ANTHROPIC_API_KEY | head -c 20
   ```

3. Verify variables are set:
   ```bash
   env | grep -i "api_key" | wc -l
   # Should show multiple API keys
   ```

4. Test in new shell:
   ```bash
   # Open new terminal
   echo $OPENAI_API_KEY | head -c 20
   ```

#### E. Document New Method
1. Update loading method documentation:
   ```bash
   cat >> ~/.env.d/LOADING_METHOD.md << EOF
   
   ## New Method (after organization)
   Date: $(date)
   
   Uses: ~/.env.d/load_env.sh
   Structure: ~/.env.d/active/[category]/[file].env
   
   The script automatically loads all .env files from the active directory structure.
   EOF
   ```

**Expected Outcome:** Environment variables load correctly from new organized structure

---

## PHASE 3: DOCUMENTATION INDEX (Medium Priority)

**Total Time:** 32 minutes  
**Priority:** 🟡 MEDIUM

---

### Step 3.1: Create Documentation Directory
**Time:** 2 minutes

#### A. Create Main Directory Structure
1. Create base docs directory:
   ```bash
   mkdir -p ~/docs
   ```

2. Create knowledge-base subdirectories:
   ```bash
   mkdir -p ~/docs/knowledge-base/{concepts,tutorials,references}
   ```

3. Create project documentation directories:
   ```bash
   mkdir -p ~/docs/projects/{active,archived,templates}
   ```

4. Create guides directory:
   ```bash
   mkdir -p ~/docs/guides
   ```

5. Verify structure:
   ```bash
   tree -L 2 ~/docs
   # Or:
   find ~/docs -type d
   ```

#### B. Create Directory Documentation
1. Create README for docs directory:
   ```bash
   touch ~/docs/README.md
   ```

2. Write directory explanation:
   ```markdown
   # Documentation Hub
   
   This directory contains the master index and organization for all documentation.
   
   ## Structure
   - knowledge-base/ - Core concepts and references
   - projects/ - Project-specific documentation
   - guides/ - How-to guides and tutorials
   ```

3. Save the README

**Expected Outcome:** Documentation directory structure created

---

### Step 3.2: Run Documentation Indexer
**Time:** 10 minutes

#### A. Prepare Indexer Script
1. Verify script exists:
   ```bash
   ls -la ~/docs/create_docs_index.py
   ```

2. If missing, check if it was created:
   ```bash
   find ~ -name "create_docs_index.py" 2>/dev/null
   ```

3. Navigate to docs directory:
   ```bash
   cd ~/docs
   ```

4. Make script executable:
   ```bash
   chmod +x create_docs_index.py
   ```

#### B. Execute Indexer
1. Run the indexer:
   ```bash
   python3 create_docs_index.py
   ```

2. Monitor progress:
   - a. Watch for directories being scanned
   - b. Note file counts
   - c. Watch for any errors

3. Wait for completion:
   - a. Script will process all markdown files
   - b. Will generate index.md
   - c. Will create catalog.json

#### C. Review Generated Files
1. Check index file was created:
   ```bash
   ls -lh ~/docs/index.md
   ```

2. Preview index content:
   ```bash
   head -50 ~/docs/index.md
   ```

3. Check catalog JSON:
   ```bash
   ls -lh ~/docs/catalog.json
   ```

4. Preview catalog structure:
   ```bash
   cat ~/docs/catalog.json | python3 -m json.tool | head -30
   ```

#### D. Verify Index Quality
1. Check total files indexed:
   ```bash
   grep -c "^- \[" ~/docs/index.md
   ```

2. Check categories:
   ```bash
   grep "^###" ~/docs/index.md
   ```

3. Verify file paths are correct:
   ```bash
   head -20 ~/docs/index.md | grep "Path:"
   ```

**Expected Outcome:** Master index and categorized catalog generated

---

### Step 3.3: Review and Refine Index
**Time:** 20 minutes

#### A. Open and Review Index
1. Open index in editor:
   ```bash
   open ~/docs/index.md
   # Or:
   nano ~/docs/index.md
   ```

2. Review structure:
   - a. Check categories make sense
   - b. Verify file groupings
   - c. Look for obvious mis-categorizations

3. Review sample entries:
   - a. Check a few entries from each category
   - b. Verify paths are correct
   - c. Check formatting

#### B. Identify Issues
1. Look for mis-categorized files:
   - a. Projects in wrong category
   - b. Guides misidentified
   - c. References misplaced

2. Check for missing documentation:
   - a. Projects without docs
   - b. Tools without guides
   - c. APIs without references

3. Note duplicates:
   - a. Same doc in multiple places
   - b. Similar docs that could merge
   - c. Outdated versions

#### C. Make Manual Adjustments
1. For mis-categorized files:
   - a. Note the file path
   - b. Determine correct category
   - c. Move file if needed:
     ```bash
     mv ~/path/to/file.md ~/docs/knowledge-base/concepts/
     ```

2. For missing cross-references:
   - a. Identify related docs
   - b. Add links in index
   - c. Update doc files with cross-refs

3. For duplicates:
   - a. Compare duplicate files
   - b. Keep best version
   - c. Archive or delete others

#### D. Update Index
1. Re-run indexer if major changes made:
   ```bash
   python3 ~/docs/create_docs_index.py
   ```

2. Or manually update index.md:
   - a. Add missing entries
   - b. Fix incorrect paths
   - c. Update categories

3. Verify updated index:
   ```bash
   head -50 ~/docs/index.md
   ```

#### E. Test Search Functionality
1. If search is implemented, test it:
   ```bash
   # Test basic search
   grep -i "api" ~/docs/index.md
   grep -i "workflow" ~/docs/index.md
   ```

2. Test finding specific topics:
   ```bash
   grep -i "image generation" ~/docs/index.md
   grep -i "automation" ~/docs/index.md
   ```

3. Verify you can find what you need

**Expected Outcome:** Accurate, usable documentation index with proper categorization

---

## PHASE 4: HTML SITE ORGANIZATION (Medium Priority)

**Total Time:** 2 hours  
**Priority:** 🟡 MEDIUM

---

### Step 4.1: Analyze HTML Files
**Time:** 15 minutes

#### A. Get Overview of HTML Files
1. Count total HTML files:
   ```bash
   find ~ -name "*.html" -type f ! -path "*/Library/*" ! -path "*/.git/*" ! -path "*/node_modules/*" 2>/dev/null | wc -l
   ```

2. Count by main directory:
   ```bash
   find ~/Documents/HTML -name "*.html" -type f 2>/dev/null | wc -l
   find ~/Pictures -name "*.html" -type f 2>/dev/null | wc -l
   find ~/workspace -name "*.html" -type f 2>/dev/null | wc -l
   ```

3. List top directories with HTML:
   ```bash
   find ~ -maxdepth 4 -name "*.html" ! -path "*/Library/*" 2>/dev/null | sed 's|/[^/]*$||' | sort | uniq -c | sort -rn | head -15
   ```

#### B. Categorize HTML Files
1. Identify export files:
   ```bash
   find ~/Documents/HTML/misc-exports -name "*.html" -type f 2>/dev/null | head -10
   ```

2. Identify active sites:
   ```bash
   ls -la ~/sites-navigator/*.html
   ls -la ~/docs_docsify/*.html
   ```

3. Identify galleries:
   ```bash
   find ~/Pictures -name "*.html" -type f 2>/dev/null | head -10
   ```

4. Identify tools:
   ```bash
   find ~/workspace -name "*.html" -type f 2>/dev/null | head -10
   ```

#### C. Create Analysis Document
1. Create analysis file:
   ```bash
   touch ~/HTML_ANALYSIS.md
   ```

2. Document findings:
   ```markdown
   # HTML File Analysis
   
   Date: $(date)
   
   ## Totals
   - Total HTML files: [number]
   - In Documents/HTML: [number]
   - In Pictures: [number]
   - In workspace: [number]
   - Other locations: [number]
   
   ## Categories
   - Export files: [number] (mostly in Documents/HTML/misc-exports)
   - Active sites: [number]
   - Galleries: [number]
   - Tools: [number]
   - Documentation: [number]
   ```

**Expected Outcome:** Clear understanding of HTML file distribution and types

---

### Step 4.2: Archive Export Files
**Time:** 30 minutes

#### A. Create Archive Structure
1. Create main archive directory:
   ```bash
   mkdir -p ~/archives/html-exports
   ```

2. Create subdirectories:
   ```bash
   mkdir -p ~/archives/html-exports/{conversations,portfolios,misc,other}
   ```

3. Create dated subdirectory:
   ```bash
   mkdir -p ~/archives/html-exports/$(date +%Y-%m)
   ```

4. Verify structure:
   ```bash
   tree -L 2 ~/archives/html-exports
   ```

#### B. Move Conversation Exports
1. Identify conversation exports:
   ```bash
   ls -la ~/Documents/HTML/misc-exports/ | head -20
   ```

2. Count files to move:
   ```bash
   find ~/Documents/HTML/misc-exports -name "*.html" -type f 2>/dev/null | wc -l
   ```

3. Move files:
   ```bash
   mv ~/Documents/HTML/misc-exports/*.html ~/archives/html-exports/conversations/ 2>/dev/null
   ```

4. Verify move:
   ```bash
   ls -la ~/archives/html-exports/conversations/ | wc -l
   ls -la ~/Documents/HTML/misc-exports/*.html 2>/dev/null | wc -l
   # Should be 0
   ```

#### C. Move Portfolio Exports
1. Identify portfolio files:
   ```bash
   ls -la ~/Documents/HTML/Portfolio/ | head -20
   ```

2. Count files:
   ```bash
   find ~/Documents/HTML/Portfolio -name "*.html" -type f 2>/dev/null | wc -l
   ```

3. Move files:
   ```bash
   mv ~/Documents/HTML/Portfolio/*.html ~/archives/html-exports/portfolios/ 2>/dev/null
   ```

4. Verify:
   ```bash
   ls -la ~/archives/html-exports/portfolios/ | wc -l
   ```

#### D. Move Miscellaneous Exports
1. Review misc directory:
   ```bash
   ls -la ~/Documents/HTML/misc/ | head -20
   ```

2. Sample files to understand content:
   ```bash
   head -20 ~/Documents/HTML/misc/*.html 2>/dev/null | head -50
   ```

3. Move export-type files:
   ```bash
   # Be selective - review before moving
   # Move obvious exports
   find ~/Documents/HTML/misc -name "*export*.html" -type f -exec mv {} ~/archives/html-exports/misc/ \;
   ```

#### E. Compress Archives
1. Compress conversations:
   ```bash
   cd ~/archives/html-exports
   tar -czf conversations_$(date +%Y%m%d).tar.gz conversations/
   ```

2. Compress portfolios:
   ```bash
   tar -czf portfolios_$(date +%Y%m%d).tar.gz portfolios/
   ```

3. Compress misc:
   ```bash
   tar -czf misc_$(date +%Y%m%d).tar.gz misc/
   ```

4. Verify compression:
   ```bash
   ls -lh ~/archives/html-exports/*.tar.gz
   ```

5. Optionally remove uncompressed directories:
   ```bash
   # After verifying tar files work
   rm -rf ~/archives/html-exports/{conversations,portfolios,misc}
   ```

#### F. Document Archive
1. Create archive manifest:
   ```bash
   touch ~/archives/html-exports/ARCHIVE_MANIFEST.md
   ```

2. Document contents:
   ```markdown
   # HTML Export Archive
   
   Created: $(date)
   
   ## Contents
   - Conversations: [count] files → conversations.tar.gz
   - Portfolios: [count] files → portfolios.tar.gz
   - Misc: [count] files → misc.tar.gz
   
   ## Source
   - Original location: ~/Documents/HTML/
   - Archived to: ~/archives/html-exports/
   ```

**Expected Outcome:** 3,000+ export files archived and compressed

---

### Step 4.3: Organize Active Sites
**Time:** 45 minutes

#### A. Create Site Structure
1. Create main sites directory:
   ```bash
   mkdir -p ~/sites
   ```

2. Create category directories:
   ```bash
   mkdir -p ~/sites/{galleries,tools,documentation,projects,active}
   ```

3. Create gallery subdirectories:
   ```bash
   mkdir -p ~/sites/galleries/{ai-generated,collections,archives}
   ```

4. Verify structure:
   ```bash
   tree -L 2 ~/sites
   ```

#### B. Move Gallery Sites
1. Identify gallery sites in Pictures:
   ```bash
   find ~/Pictures -name "*.html" -type f 2>/dev/null | head -20
   ```

2. Categorize galleries:
   - a. AI-generated (DALL-E, Ideogram, etc.):
     ```bash
     find ~/Pictures -path "*/DALL*" -o -path "*/ideogram*" -o -path "*/sora*" | grep "\.html$"
     ```
   - b. Collections:
     ```bash
     find ~/Pictures -path "*/MyCollection*" -o -path "*/etsy*" | grep "\.html$"
     ```

3. Move AI-generated galleries:
   ```bash
   find ~/Pictures -name "*.html" -path "*/DALL*" -exec mv {} ~/sites/galleries/ai-generated/ \;
   find ~/Pictures -name "*.html" -path "*/ideogram*" -exec mv {} ~/sites/galleries/ai-generated/ \;
   find ~/Pictures -name "*.html" -path "*/sora*" -exec mv {} ~/sites/galleries/ai-generated/ \;
   ```

4. Move collection galleries:
   ```bash
   find ~/Pictures -name "*.html" -path "*/MyCollection*" -exec mv {} ~/sites/galleries/collections/ \;
   find ~/Pictures -name "*.html" -path "*/etsy*" -exec mv {} ~/sites/galleries/collections/ \;
   ```

5. Verify moves:
   ```bash
   ls -la ~/sites/galleries/ai-generated/ | wc -l
   ls -la ~/sites/galleries/collections/ | wc -l
   ```

#### C. Move Documentation Sites
1. Identify documentation sites:
   ```bash
   ls -d ~/docs_* ~/sphinx-docs 2>/dev/null
   ```

2. Copy (don't move) documentation sites:
   ```bash
   cp -r ~/docs_docsify ~/sites/documentation/
   cp -r ~/docs_mkdocs ~/sites/documentation/
   cp -r ~/docs_seo ~/sites/documentation/
   cp -r ~/docs_pdoc ~/sites/documentation/
   cp -r ~/sphinx-docs ~/sites/documentation/
   ```

3. Verify copies:
   ```bash
   ls -la ~/sites/documentation/
   ```

#### D. Move Tool Sites
1. Identify interactive tools:
   ```bash
   find ~/workspace -name "*.html" -type f 2>/dev/null | grep -i "tool\|interface\|chat\|search"
   ```

2. Review each before moving:
   ```bash
   # Check a few files
   head -30 ~/workspace/[path]/tool.html
   ```

3. Move confirmed tools:
   ```bash
   # Move specific tool files
   # (Do this selectively, file by file)
   ```

4. Create tool index:
   ```bash
   touch ~/sites/tools/TOOLS_INDEX.md
   ```

#### E. Organize Project Sites
1. Identify project HTML files:
   ```bash
   find ~/workspace -name "index.html" -o -name "*dashboard*.html" -o -name "*admin*.html" 2>/dev/null
   ```

2. Create project site directories:
   ```bash
   for project in ~/workspace/*/; do
     if [ -f "${project}index.html" ]; then
       proj_name=$(basename "$project")
       mkdir -p ~/sites/projects/$proj_name
       cp "${project}index.html" ~/sites/projects/$proj_name/
     fi
   done
   ```

3. Verify:
   ```bash
   ls -la ~/sites/projects/
   ```

**Expected Outcome:** Active sites organized by purpose in ~/sites/

---

### Step 4.4: Update Sites Navigator
**Time:** 30 minutes

#### A. Review Current Navigator Data
1. Open sites data file:
   ```bash
   nano ~/sites-navigator/js/sites-data.js
   ```

2. Review current entries:
   - a. Count existing sites
   - b. Check categories used
   - c. Note structure

#### B. Add New Sites to Navigator
1. For each organized site category:
   - a. Open sites-data.js
   - b. Add entries for gallery sites:
     ```javascript
     {
         title: "DALL-E Gallery",
         category: "pictures",
         location: "~/sites/galleries/ai-generated/",
         path: "/Users/steven/sites/galleries/ai-generated/dalle-gallery.html",
         description: "DALL-E AI-generated images gallery",
         icon: "fas fa-image",
         type: "Gallery"
     },
     ```
   - c. Add documentation sites
   - d. Add tool sites
   - e. Add project sites

2. Save the file

#### C. Test Navigator
1. Start the server:
   ```bash
   cd ~/sites-navigator
   python3 server.py
   ```

2. Open in browser:
   ```bash
   open http://localhost:8080
   ```

3. Test functionality:
   - a. Verify all sites appear
   - b. Test category filtering
   - c. Test search
   - d. Click links to verify they work

4. Fix any broken links:
   - a. Update incorrect paths
   - b. Fix missing files
   - c. Update descriptions

#### D. Document Updates
1. Create changelog:
   ```bash
   touch ~/sites-navigator/CHANGELOG.md
   ```

2. Document updates:
   ```markdown
   # Sites Navigator Changelog
   
   ## $(date)
   - Added gallery sites from ~/Pictures/
   - Added documentation sites
   - Added tool sites
   - Organized by purpose
   - Total sites: [count]
   ```

**Expected Outcome:** Sites navigator includes all organized sites, fully functional

---

## PHASE 5: PROJECT LIFECYCLE MANAGEMENT (Low Priority)

**Total Time:** 65 minutes  
**Priority:** 🟢 LOW

---

### Step 5.1: Categorize Projects by Status
**Time:** 15 minutes

#### A. Review Current Projects
1. List workspace projects:
   ```bash
   cd ~/workspace
   ls -la
   ```

2. Check project completion status:
   ```bash
   cat README.md | grep -A 10 "PROJECTS"
   ```

3. Document current state:
   ```bash
   touch ~/workspace/PROJECT_STATUS.md
   ```

#### B. Create Lifecycle Directories
1. Create lifecycle structure:
   ```bash
   mkdir -p ~/workspace/{production,development,incubating,archive}
   ```

2. Create subdirectories:
   ```bash
   mkdir -p ~/workspace/production/{deployed,ready}
   mkdir -p ~/workspace/development/{active,on-hold}
   mkdir -p ~/workspace/incubating/{experimental,planning}
   ```

3. Verify structure:
   ```bash
   tree -L 2 ~/workspace
   ```

#### C. Move Projects by Completion %
1. Move production-ready (85-100%):
   ```bash
   # Review first
   ls -la passive-income-empire retention-suite-complete
   
   # Move
   mv passive-income-empire ~/workspace/production/ready/
   mv retention-suite-complete ~/workspace/production/ready/
   ```

2. Move development (50-84%):
   ```bash
   mv cleanconnect-complete ~/workspace/development/active/
   mv heavenlyhands-complete ~/workspace/development/active/
   mv avatararts-complete ~/workspace/development/active/
   ```

3. Move incubating (<50%):
   ```bash
   mv marketplace ~/workspace/incubating/experimental/
   mv education ~/workspace/incubating/experimental/
   mv quantumforge-complete ~/workspace/incubating/experimental/
   ```

4. Verify moves:
   ```bash
   ls -la ~/workspace/production/ready/
   ls -la ~/workspace/development/active/
   ls -la ~/workspace/incubating/experimental/
   ```

#### D. Update Workspace README
1. Open README:
   ```bash
   nano ~/workspace/README.md
   ```

2. Update project locations:
   ```markdown
   ## Project Organization
   
   ### Production Ready (85-100%)
   - ~/workspace/production/ready/passive-income-empire (85%)
   - ~/workspace/production/ready/retention-suite-complete (80%)
   
   ### Active Development (50-84%)
   - ~/workspace/development/active/cleanconnect-complete (75%)
   - ~/workspace/development/active/heavenlyhands-complete (70%)
   - ~/workspace/development/active/avatararts-complete (65%)
   
   ### Incubating (<50%)
   - ~/workspace/incubating/experimental/marketplace (40%)
   - ~/workspace/incubating/experimental/education (40%)
   - ~/workspace/incubating/experimental/quantumforge-complete (40%)
   ```

3. Save README

**Expected Outcome:** Projects organized by lifecycle stage

---

### Step 5.2: Map Project Dependencies
**Time:** 20 minutes

#### A. Create Dependency Mapping File
1. Create mapping file:
   ```bash
   touch ~/workspace/PROJECT_DEPENDENCIES.md
   ```

2. Create template structure:
   ```markdown
   # Project Dependencies Map
   
   Date: $(date)
   
   ## Dependency Categories
   - APIs: Which API keys/services each project uses
   - Code: Which projects share code
   - Documentation: Which docs each project references
   - Tools: Required tools and versions
   ```

#### B. Analyze Each Project
1. For each project, check:
   - a. Environment files:
     ```bash
     find ~/workspace/production/ready/passive-income-empire -name "*.env" -o -name "requirements.txt"
     ```
   - b. Import statements:
     ```bash
     grep -r "import\|from" ~/workspace/production/ready/passive-income-empire/*.py 2>/dev/null | head -10
     ```
   - c. Documentation references:
     ```bash
     grep -r "http\|https\|docs" ~/workspace/production/ready/passive-income-empire/README.md 2>/dev/null
     ```

2. Document findings in PROJECT_DEPENDENCIES.md

#### C. Map API Dependencies
1. Check which APIs each project uses:
   ```bash
   # Check for API references
   grep -r "OPENAI\|ANTHROPIC\|ELEVENLABS" ~/workspace/production/ready/passive-income-empire/ 2>/dev/null
   ```

2. Cross-reference with .env.d files:
   ```bash
   grep -r "passive-income" ~/.env.d/ 2>/dev/null
   ```

3. Document in dependency map:
   ```markdown
   ## passive-income-empire
   - APIs: OpenAI, ElevenLabs
   - Source: ~/.env.d/active/ai-services/llm-apis.env
   - Source: ~/.env.d/active/creative-tools/audio-music.env
   ```

#### D. Map Code Dependencies
1. Check for shared code:
   ```bash
   # Look for common imports
   find ~/workspace -name "*.py" -exec grep -l "shared\|common\|utils" {} \;
   ```

2. Document shared libraries:
   ```markdown
   ## Shared Code
   - utils.py: Used by [projects]
   - common/: Shared by [projects]
   ```

#### E. Create Dependency Graph
1. Create visual representation:
   ```bash
   touch ~/workspace/DEPENDENCY_GRAPH.md
   ```

2. Document relationships:
   ```markdown
   # Dependency Graph
   
   ```
   passive-income-empire
   ├── APIs: OpenAI, ElevenLabs
   ├── Docs: ~/docs/projects/passive-income/
   └── Tools: Python 3.9+
   
   retention-suite-complete
   ├── APIs: [list]
   ├── Depends on: [other projects?]
   └── Tools: [list]
   ```

**Expected Outcome:** Complete dependency map for all projects

---

### Step 5.3: Create Project Dashboard
**Time:** 30 minutes

#### A. Create Dashboard Script
1. Create Python script:
   ```bash
   touch ~/workspace/project_dashboard.py
   ```

2. Write dashboard code:
   ```python
   #!/usr/bin/env python3
   """Project Dashboard - Overview of all projects"""
   
   from pathlib import Path
   from datetime import datetime
   
   workspace = Path.home() / 'workspace'
   
   projects = {
       'production': {
           'passive-income-empire': {'completion': 85, 'revenue': 'high', 'status': 'ready'},
           'retention-suite-complete': {'completion': 80, 'revenue': 'highest', 'status': 'ready'},
       },
       'development': {
           'cleanconnect-complete': {'completion': 75, 'revenue': 'medium', 'status': 'active'},
           'heavenlyhands-complete': {'completion': 70, 'revenue': 'medium', 'status': 'active'},
           'avatararts-complete': {'completion': 65, 'revenue': 'low', 'status': 'active'},
       },
       'incubating': {
           'marketplace': {'completion': 40, 'revenue': 'unknown', 'status': 'experimental'},
           'education': {'completion': 40, 'revenue': 'unknown', 'status': 'experimental'},
           'quantumforge-complete': {'completion': 40, 'revenue': 'unknown', 'status': 'experimental'},
       }
   }
   
   print("=" * 70)
   print("PROJECT DASHBOARD")
   print("=" * 70)
   print(f"\nDate: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
   
   for category, projs in projects.items():
       print(f"\n{category.upper()}:")
       print("-" * 70)
       for name, info in projs.items():
           print(f"  {name:30} {info['completion']:>3}%  Revenue: {info['revenue']:10}  Status: {info['status']}")
   ```

3. Make executable:
   ```bash
   chmod +x ~/workspace/project_dashboard.py
   ```

#### B. Test Dashboard
1. Run dashboard:
   ```bash
   python3 ~/workspace/project_dashboard.py
   ```

2. Verify output:
   - a. All projects listed
   - b. Correct completion %
   - c. Status accurate

3. Refine if needed

#### C. Add Advanced Features
1. Add next steps tracking:
   ```python
   # Add to each project
   'next_steps': [
       'Deploy to production',
       'Set up monitoring',
       'Create user documentation'
   ]
   ```

2. Add dependency display:
   ```python
   # Show which APIs each project uses
   ```

3. Add time estimates:
   ```python
   'time_to_completion': '2-3 days'
   ```

#### D. Schedule Regular Reviews
1. Create review script:
   ```bash
   touch ~/workspace/weekly_review.sh
   ```

2. Add to script:
   ```bash
   #!/bin/bash
   echo "Weekly Project Review - $(date)"
   python3 ~/workspace/project_dashboard.py
   echo ""
   echo "Review each project's status and update completion %"
   ```

3. Make executable:
   ```bash
   chmod +x ~/workspace/weekly_review.sh
   ```

4. Add to calendar/reminders

**Expected Outcome:** Functional project dashboard showing all projects at a glance

---

## PHASE 6: CONFIGURATION CLEANUP (Low Priority)

**Total Time:** 35 minutes  
**Priority:** 🟢 LOW

---

### Step 6.1: Identify Active Configs
**Time:** 20 minutes

#### A. Check Modification Dates
1. Find recently modified configs (last 30 days):
   ```bash
   find ~/.config -type f -mtime -30 | wc -l
   ```

2. List recently modified:
   ```bash
   find ~/.config -type f -mtime -30 -ls | sort -k9 | head -20
   ```

3. Find old configs (6+ months):
   ```bash
   find ~/.config -type f -mtime +180 | wc -l
   ```

4. List old configs:
   ```bash
   find ~/.config -type f -mtime +180 -ls | sort -k9 | head -20
   ```

#### B. Check Application Installation
1. For each config directory, check if app is installed:
   ```bash
   # Example: Check if Spicetify is installed
   which spicetify
   
   # Check if Raycast is installed
   ls /Applications/Raycast.app 2>/dev/null
   ```

2. Document findings:
   ```bash
   touch ~/.config/CONFIG_AUDIT.md
   ```

3. Create audit list:
   ```markdown
   # Configuration Audit
   
   Date: $(date)
   
   ## Active Configs (modified in last 30 days)
   - [list configs]
   
   ## Potentially Unused (not modified in 6+ months)
   - [list configs]
   
   ## Applications Not Installed
   - [list configs for missing apps]
   ```

#### C. Identify Duplicates
1. Find duplicate config files:
   ```bash
   find ~/.config -type f -name "*.json" -exec md5 {} \; | sort | uniq -d -w 32
   ```

2. Find similar configs:
   ```bash
   # Look for configs with similar names
   find ~/.config -type f -name "*config*" -o -name "*settings*"
   ```

3. Document duplicates

#### D. Categorize Configs
1. Create categories:
   ```bash
   touch ~/.config/CONFIG_CATEGORIES.md
   ```

2. Categorize:
   ```markdown
   # Config Categories
   
   ## Essential (Core Tools)
   - [list]
   
   ## Active (Regularly Used)
   - [list]
   
   ## Inactive (Rarely Used)
   - [list]
   
   ## Unused (Can Archive)
   - [list]
   ```

**Expected Outcome:** Clear understanding of which configs are active vs. unused

---

### Step 6.2: Archive Unused Configs
**Time:** 15 minutes

#### A. Create Archive Structure
1. Create dated archive:
   ```bash
   mkdir -p ~/.config/archived/$(date +%Y-%m)
   ```

2. Create subdirectories:
   ```bash
   mkdir -p ~/.config/archived/$(date +%Y-%m)/{unused,duplicates,old-apps}
   ```

3. Verify structure:
   ```bash
   tree -L 2 ~/.config/archived
   ```

#### B. Archive Unused Configs
1. Review list from Step 6.1
2. For each unused config:
   - a. Verify it's safe to archive
   - b. Move to archive:
     ```bash
     mv ~/.config/[config-file] ~/.config/archived/$(date +%Y-%m)/unused/
     ```
   - c. Document move:
     ```bash
     echo "$(date): Archived [config-file]" >> ~/.config/ARCHIVE_LOG.md
     ```

3. Archive duplicates:
   ```bash
   # Keep one, archive others
   # (Do this carefully, one at a time)
   ```

4. Archive old app configs:
   ```bash
   # Move configs for uninstalled apps
   ```

#### C. Verify Archive
1. Check archived files:
   ```bash
   ls -la ~/.config/archived/$(date +%Y-%m)/*/
   ```

2. Verify original configs still work:
   ```bash
   # Test applications still function
   ```

3. Count archived:
   ```bash
   find ~/.config/archived -type f | wc -l
   ```

#### D. Document Archive
1. Update archive manifest:
   ```bash
   touch ~/.config/archived/ARCHIVE_MANIFEST.md
   ```

2. Document contents:
   ```markdown
   # Configuration Archive
   
   Date: $(date)
   
   ## Archived Items
   - Unused configs: [count]
   - Duplicates: [count]
   - Old app configs: [count]
   
   ## Can Be Deleted After
   - Review date: [date + 6 months]
   ```

**Expected Outcome:** Unused configs archived, active configs clear

---

## PHASE 7: MAINTENANCE & AUTOMATION (Ongoing)

**Total Time:** 20 minutes setup  
**Priority:** 🟢 LOW (but important for long-term)

---

### Step 7.1: Set Up Regular Audits
**Time:** 10 minutes

#### A. Create Audit Script
1. Create weekly audit script:
   ```bash
   touch ~/scripts/weekly_audit.sh
   ```

2. Write audit script:
   ```bash
   #!/bin/bash
   # Weekly Organization Audit
   
   echo "=========================================="
   echo "Weekly Organization Audit"
   echo "Date: $(date)"
   echo "=========================================="
   echo ""
   
   echo "1. API Key Security Check:"
   ls -la ~/.env.d/*.env | grep -v "^-rw-------" && echo "  ⚠️  Permission issues found" || echo "  ✅ Permissions OK"
   echo ""
   
   echo "2. Documentation Updates:"
   find ~/docs -name "*.md" -mtime -7 | wc -l | xargs echo "  New/updated docs this week:"
   echo ""
   
   echo "3. Site Health:"
   # Add site checking logic
   echo ""
   
   echo "4. Project Status:"
   python3 ~/workspace/project_dashboard.py 2>/dev/null || echo "  Dashboard not available"
   echo ""
   ```

3. Make executable:
   ```bash
   chmod +x ~/scripts/weekly_audit.sh
   ```

#### B. Test Audit Script
1. Run manually:
   ```bash
   ~/scripts/weekly_audit.sh
   ```

2. Review output
3. Refine script as needed

#### C. Schedule Weekly Run
1. Add to crontab (if desired):
   ```bash
   crontab -e
   # Add: 0 9 * * 1 ~/scripts/weekly_audit.sh >> ~/audit_log.txt 2>&1
   ```

2. Or set calendar reminder
3. Or add to weekly routine manually

**Expected Outcome:** Automated weekly health checks

---

### Step 7.2: Create Maintenance Checklist
**Time:** 10 minutes

#### A. Create Maintenance File
1. Create checklist:
   ```bash
   touch ~/ORGANIZATION_MAINTENANCE.md
   ```

2. Write maintenance schedule:
   ```markdown
   # Organization Maintenance Checklist
   
   ## Weekly Tasks
   - [ ] Run weekly audit script
   - [ ] Review new files added
   - [ ] Update documentation index if needed
   - [ ] Check sites navigator for new sites
   
   ## Monthly Tasks
   - [ ] Security audit (API keys)
   - [ ] Config cleanup review
   - [ ] Archive old files
   - [ ] Update project status
   - [ ] Review and update dependency map
   
   ## Quarterly Tasks
   - [ ] Full directory analysis
   - [ ] Review organization structure
   - [ ] Archive completed projects
   - [ ] Update maintenance procedures
   - [ ] Review and optimize
   ```

#### B. Set Up Reminders
1. Add to calendar:
   - Weekly: Monday 9 AM - Weekly audit
   - Monthly: 1st of month - Monthly maintenance
   - Quarterly: First of quarter - Full review

2. Or create reminder file:
   ```bash
   touch ~/REMINDERS.md
   ```

#### C. Document Maintenance Procedures
1. Add procedures to maintenance file:
   ```markdown
   ## Procedures
   
   ### Weekly Audit
   1. Run: ~/scripts/weekly_audit.sh
   2. Review output
   3. Address any issues
   4. Update checklist
   
   ### Monthly Maintenance
   1. Review audit logs
   2. Check for security issues
   3. Clean up configs
   4. Update documentation
   5. Review project status
   ```

**Expected Outcome:** Clear maintenance schedule and procedures

---

## QUICK REFERENCE: All Commands

### Security Commands
```bash
# Revoke keys (manual in dashboards)
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
# Move files as documented above

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

# Check projects
python3 ~/workspace/project_dashboard.py
```

---

## Progress Tracking Checklist

### Phase 1: Security
- [ ] 1.1.A: Identified exposed keys
- [ ] 1.1.B: Revoked GOAPI key
- [ ] 1.1.C: Revoked STABILITY key
- [ ] 1.1.D: Generated new keys
- [ ] 1.1.E: Updated env files
- [ ] 1.2.A: Identified backup files
- [ ] 1.2.B: Created archive structure
- [ ] 1.2.C: Moved backup files
- [ ] 1.2.D: Set permissions
- [ ] 1.2.E: Configured git
- [ ] 1.2.F: Documented archive
- [ ] 1.3.A: Checked permissions
- [ ] 1.3.B: Set correct permissions
- [ ] 1.3.C: Verified permissions

### Phase 2: API Organization
- [ ] 2.1.A: Prepared for analysis
- [ ] 2.1.B: Ran dry run
- [ ] 2.1.C: Reviewed plan
- [ ] 2.1.D: Documented findings
- [ ] 2.2.A: Final verification
- [ ] 2.2.B: Executed organization
- [ ] 2.2.C: Verified structure
- [ ] 2.2.D: Reviewed report
- [ ] 2.3.A: Reviewed current loading
- [ ] 2.3.B: Created loading script
- [ ] 2.3.C: Updated shell config
- [ ] 2.3.D: Tested loading
- [ ] 2.3.E: Documented method

### Phase 3: Documentation
- [ ] 3.1.A: Created directory structure
- [ ] 3.1.B: Created documentation
- [ ] 3.2.A: Prepared indexer
- [ ] 3.2.B: Executed indexer
- [ ] 3.2.C: Reviewed generated files
- [ ] 3.2.D: Verified quality
- [ ] 3.3.A: Opened and reviewed index
- [ ] 3.3.B: Identified issues
- [ ] 3.3.C: Made adjustments
- [ ] 3.3.D: Updated index
- [ ] 3.3.E: Tested search

### Phase 4: HTML Sites
- [ ] 4.1.A: Got overview
- [ ] 4.1.B: Categorized files
- [ ] 4.1.C: Created analysis doc
- [ ] 4.2.A: Created archive structure
- [ ] 4.2.B: Moved conversations
- [ ] 4.2.C: Moved portfolios
- [ ] 4.2.D: Moved misc exports
- [ ] 4.2.E: Compressed archives
- [ ] 4.2.F: Documented archive
- [ ] 4.3.A: Created site structure
- [ ] 4.3.B: Moved galleries
- [ ] 4.3.C: Moved documentation sites
- [ ] 4.3.D: Moved tool sites
- [ ] 4.3.E: Organized project sites
- [ ] 4.4.A: Reviewed navigator data
- [ ] 4.4.B: Added new sites
- [ ] 4.4.C: Tested navigator
- [ ] 4.4.D: Documented updates

### Phase 5: Projects
- [ ] 5.1.A: Reviewed projects
- [ ] 5.1.B: Created lifecycle dirs
- [ ] 5.1.C: Moved projects
- [ ] 5.1.D: Updated README
- [ ] 5.2.A: Created mapping file
- [ ] 5.2.B: Analyzed each project
- [ ] 5.2.C: Mapped API dependencies
- [ ] 5.2.D: Mapped code dependencies
- [ ] 5.2.E: Created dependency graph
- [ ] 5.3.A: Created dashboard script
- [ ] 5.3.B: Tested dashboard
- [ ] 5.3.C: Added advanced features
- [ ] 5.3.D: Scheduled reviews

### Phase 6: Configs
- [ ] 6.1.A: Checked modification dates
- [ ] 6.1.B: Checked app installation
- [ ] 6.1.C: Identified duplicates
- [ ] 6.1.D: Categorized configs
- [ ] 6.2.A: Created archive structure
- [ ] 6.2.B: Archived unused configs
- [ ] 6.2.C: Verified archive
- [ ] 6.2.D: Documented archive

### Phase 7: Maintenance
- [ ] 7.1.A: Created audit script
- [ ] 7.1.B: Tested script
- [ ] 7.1.C: Scheduled weekly run
- [ ] 7.2.A: Created maintenance file
- [ ] 7.2.B: Set up reminders
- [ ] 7.2.C: Documented procedures

---

## Time Estimates Summary

| Phase | Steps | Sub-steps | Total Time |
|-------|-------|-----------|------------|
| Phase 1: Security | 3 | 15 | 17 min |
| Phase 2: API Keys | 3 | 14 | 30 min |
| Phase 3: Documentation | 3 | 13 | 32 min |
| Phase 4: HTML Sites | 4 | 24 | 2 hours |
| Phase 5: Projects | 3 | 13 | 65 min |
| Phase 6: Configs | 2 | 8 | 35 min |
| Phase 7: Maintenance | 2 | 6 | 20 min |
| **TOTAL** | **20** | **93** | **~4.5 hours** |

---

## Priority Execution Order

1. **Today (17 min):** Phase 1 - Security (CRITICAL)
2. **Today (30 min):** Phase 2 - API Keys (HIGH)
3. **This Week (32 min):** Phase 3 - Documentation (MEDIUM)
4. **Next Week (2 hours):** Phase 4 - HTML Sites (MEDIUM)
5. **Next Week (65 min):** Phase 5 - Projects (LOW)
6. **When Time (35 min):** Phase 6 - Configs (LOW)
7. **Ongoing (20 min):** Phase 7 - Maintenance (LOW)

---

## Notes & Warnings

### ⚠️ Important Warnings
- **Backup First:** Always backup before major moves
- **Test Incrementally:** Test each phase before proceeding
- **Verify Paths:** Double-check file paths before moving
- **Keep Notes:** Document what you change and why

### 💡 Tips
- Work in small sessions (30-60 min)
- Take breaks between phases
- Review progress regularly
- Ask for help if stuck

### 📝 Documentation
- Keep notes of changes
- Update README files
- Document new structures
- Maintain changelogs

---

**START HERE: Phase 1, Step 1.1 - Revoke Exposed API Keys (5 minutes, CRITICAL)**
