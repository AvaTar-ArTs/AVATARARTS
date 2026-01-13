# Merge Plan - Consolidating All Projects into AVATARARTS

**Created:** 2026-01-11  
**Goal:** Merge all discovered projects, tools, and files into AVATARARTS

---

## Merge Strategy

### 1. AvaTarArTs-Suite → AVATARARTS/tools/
**Source:** `~/GitHub/AvaTarArTs-Suite/` (272MB)  
**Target:** `~/AVATARARTS/tools/`  
**Reason:** This is a toolkit, should be organized as tools/utilities

### 2. heavenlyHands copy → heavenlyHands
**Source:** `~/AVATARARTS/ai-sites/heavenlyHands copy/`  
**Target:** `~/AVATARARTS/ai-sites/heavenlyHands/`  
**Action:** Compare and merge unique files

### 3. iCloud QuantumForgeLabs 2 → quantumforge-complete
**Source:** `~/Library/Mobile Documents/com~apple~CloudDocs/QuantumForgeLabs 2/`  
**Target:** `~/AVATARARTS/quantumforge-complete/`  
**Action:** Compare and merge

### 4. iCloud heavenly-hands → heavenlyhands-complete
**Source:** `~/Library/Mobile Documents/com~apple~CloudDocs/heavenly-hands-cleaning-site/`  
**Target:** `~/AVATARARTS/heavenlyhands-complete/`  
**Action:** Compare and merge

### 5. Archives → AVATARARTS/archive/backups/
**Sources:** Various zip files  
**Target:** `~/AVATARARTS/archive/backups/2026-01-11/`

### 6. Message Attachments → heavenlyhands-complete/assets/
**Sources:** `~/Library/Messages/Attachments/*/heavenlyhands-jingle*.mp3`  
**Target:** `~/AVATARARTS/heavenlyhands-complete/assets/audio/jingles/`

---

## Execution Order

1. Create target directories
2. Merge AvaTarArTs-Suite (largest)
3. Merge duplicate directories
4. Merge iCloud projects
5. Organize archives
6. Move message attachments
7. Clean up empty directories
8. Update documentation
