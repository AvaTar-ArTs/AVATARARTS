# ✅ env + pclean Workflow

**Date:** 2026-01-13
**Status:** ✅ VERIFIED

---

## 🔄 Complete Workflow

### Create Virtual Environment
```bash
# Create .venv with Python 3.12 (default)
env 3.12

# Create .venv with Python 3.11
env 3.11

# Or use venv directly
venv 3.12
venv 3.11
```

### Clean Up Virtual Environment
```bash
# Remove .venv and return to base environment
pclean .

# Or specify directory
pclean /path/to/project
```

---

## 📋 Usage Examples

### Quick Test Workflow
```bash
# 1. Create test directory
mkdir test_project && cd test_project

# 2. Create virtual environment
env 3.12

# 3. Install packages, test, etc.
pip install package

# 4. Clean up when done
pclean .

# 5. Remove test directory
cd .. && rmdir test_project
```

### Project Workflow
```bash
# Start new project
cd my-project
env 3.12              # Create .venv
pip install -r requirements.txt

# Work on project...

# Clean up when switching projects
pclean .              # Removes .venv, deactivates, returns to base
```

---

## ✅ What pclean Does

1. **Deactivates** virtual environment if active
2. **Removes** `.venv` directory
3. **Returns to base** environment (clears all language envs)
4. **Optional**: Removes `requirements.txt` with `--remove-reqs` flag

---

## 🎯 Commands Summary

| Command | Purpose |
|---------|---------|
| `env 3.12` | Create .venv with Python 3.12 |
| `env 3.11` | Create .venv with Python 3.11 |
| `venv` | Same as `env 3.12` (default) |
| `pclean .` | Remove .venv and return to base |
| `pclean . --remove-reqs` | Remove .venv and requirements.txt |

---

## ✅ Verification

**Test Results:**
- ✅ `env 3.12` creates `.venv` correctly
- ✅ `pclean .` removes `.venv` correctly
- ✅ Returns to base environment
- ✅ No orphaned test directories

---

**Workflow verified!** Use `env 3.12` to create and `pclean .` to clean up! 🎉
