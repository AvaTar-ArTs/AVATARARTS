# 🔄 RENAME GUIDE

**File Renaming Utility for AVATARARTS**

---

## 🛠️ RENAME TOOL

**Location:** `~/AVATARARTS/rename_files.py`

---

## 📋 USAGE

### Standardize File Names:
```bash
# Dry run (preview only)
python3 ~/AVATARARTS/rename_files.py ~/AVATARARTS/INDEXES --standardize

# Actually rename
python3 ~/AVATARARTS/rename_files.py ~/AVATARARTS/INDEXES --standardize --execute
```

### Pattern-Based Renaming:
```bash
# Replace spaces with underscores (dry run)
python3 ~/AVATARARTS/rename_files.py ~/AVATARARTS/ --pattern ' ' --replace '_'

# Actually rename
python3 ~/AVATARARTS/rename_files.py ~/AVATARARTS/ --pattern ' ' --replace '_' --execute
```

---

## 🎯 COMMON RENAMING TASKS

### 1. Standardize All Names:
- Converts to lowercase
- Replaces spaces with underscores
- Removes special characters
- Removes duplicate underscores

### 2. Replace Spaces:
```bash
python3 ~/AVATARARTS/rename_files.py <directory> --pattern ' ' --replace '_' --execute
```

### 3. Remove Special Characters:
```bash
python3 ~/AVATARARTS/rename_files.py <directory> --pattern '[^a-zA-Z0-9._-]' --replace '' --execute
```

---

## ⚠️ SAFETY

- **Default mode is DRY RUN** - Shows what would be renamed
- Use `--execute` to actually rename files
- Always test on a small directory first

---

## ✅ READY TO USE

**Tool created and ready!** 🔄
