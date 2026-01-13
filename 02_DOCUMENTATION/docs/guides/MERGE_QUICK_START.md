# ⚡ MERGE QUICK START GUIDE

## 🚀 3-Step Quick Merge (20 Minutes)

### Step 1: Backup (5 min)
```bash
cd ~
tar -czf AVATARARTS_backup_$(date +%Y%m%d_%H%M%S).tar.gz AVATARARTS
```

### Step 2: Merge Documents/HTML → AVATARARTS (15 min)
```bash
# Create destination
mkdir -p ~/AVATARARTS/html-assets

# Merge (safe - uses rsync)
rsync -av --progress ~/Documents/HTML/ ~/AVATARARTS/html-assets/

# Verify
diff -r ~/Documents/HTML ~/AVATARARTS/html-assets | head -20
```

### Step 3: Done! ✅
Keep `~/Documents/HTML` as backup for 30 days, then remove.

---

## 📊 Top 5 Merge Opportunities

| # | Merge | Savings | Time | Priority |
|---|-------|---------|------|----------|
| 1 | Documents/HTML → AVATARARTS | 163 MB | 15 min | ⭐⭐⭐⭐⭐ |
| 2 | DALL-E Images (remove duplicate) | 91 MB | 5 min | ⭐⭐⭐⭐⭐ |
| 3 | SEO Backup (compress) | 100 MB | 10 min | ⭐⭐⭐⭐ |
| 4 | HTML in ai-sites (consolidate) | 50 MB | 15 min | ⭐⭐⭐ |
| 5 | Archive consolidation | 50 MB | 20 min | ⭐⭐⭐ |

**Total: ~454 MB in 65 minutes**

---

## 🔧 Available Merge Tools

### 1. Find Duplicates
```bash
python3 ~/AVATARARTS/dedupe_merge_diff_tool.py find --max-size 50
```

### 2. Compare Directories
```bash
python3 ~/AVATARARTS/dedupe_merge_diff_tool.py diff --dirs dir1 dir2
```

### 3. Merge Directories
```bash
python3 ~/AVATARARTS/dedupe_merge_diff_tool.py merge --dirs dir1 dir2 --strategy overwrite
```

---

## 🛡️ Safety Checklist

- [ ] Backup created
- [ ] Verified disk space
- [ ] Used rsync (not mv)
- [ ] Verified merge result
- [ ] Kept source as backup

---

**Full Strategy:** See `MERGE_STRATEGY_2026.md`

