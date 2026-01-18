# Mamba Setup Guide for CleanConnect Pro Enhanced 🚀

## Why Mamba + conda-forge? 🎯

### Benefits Over Pip

| Feature                   | pip                      | Mamba + conda-forge             |
| ------------------------- | ------------------------ | ------------------------------- |
| **Dependency Resolution** | Sequential, can fail     | **Parallel & intelligent** ✅    |
| **Binary Compilation**    | Often slow/fails         | **Pre-compiled binaries** ✅     |
| **ML Package Speed**      | Very slow                | **10-100x faster** ✅            |
| **Cross-platform**        | Platform-specific issues | **Works everywhere** ✅          |
| **Version Conflicts**     | Common                   | **Automatically resolved** ✅    |
| **Memory Usage**          | Light                    | **Slightly heavier (worth it)** |

### Why This Project Benefits Most

Your `requirements-ai.txt` contains:
- **PyTorch & TensorFlow** - Massive binary dependencies
- **OpenCV & MediaPipe** - C++ libraries requiring compilation
- **Scientific Stack** - numpy, scipy, pandas heavily optimized in conda

**Result**: Installation time reduces from **30-60 minutes → 5-10 minutes** ⚡

---

## Installation Steps 📦

### 1. Install Mamba (if not already installed)

#### macOS
```bash
brew install mambaforge
# or
brew install miniforge
```

#### Linux
```bash
curl -L -O https://github.com/conda-forge/miniforge/releases/latest/download/Mambaforge-Linux-x86_64.sh
bash Mambaforge-Linux-x86_64.sh
```

#### Windows
Download from: https://github.com/conda-forge/miniforge/releases

### 2. Verify Installation
```bash
mamba --version
# Should output: mamba X.X.X
```

### 3. Create Environment
```bash
cd /path/to/cleanconnect-pro-enhanced
mamba env create -f environment.yml
```

### 4. Activate Environment
```bash
mamba activate cleanconnect-pro-enhanced
```

### 5. Verify Installation
```bash
python --version
# Should show Python 3.11.x

pip list | head -20
# Should show all packages installed
```

---

## Quick Commands 🔧

### Create environment
```bash
mamba env create -f environment.yml
```

### Update environment
```bash
mamba env update -f environment.yml
```

### Activate environment
```bash
mamba activate cleanconnect-pro-enhanced
```

### Deactivate environment
```bash
mamba deactivate
```

### List all environments
```bash
mamba env list
```

### Remove environment
```bash
mamba env remove -n cleanconnect-pro-enhanced
```

### Export current environment
```bash
mamba env export > environment-current.yml
```

---

## Using Both Node.js and Python 🎭

### Development Workflow

**Terminal 1 - Node.js Services:**
```bash
cd /path/to/cleanconnect-pro-enhanced
yarn install
yarn dev
```

**Terminal 2 - Python AI Services:**
```bash
cd /path/to/cleanconnect-pro-enhanced
mamba activate cleanconnect-pro-enhanced
python -m uvicorn ai-services.main:app --reload
```

---

## Troubleshooting 🔍

### Issue: "mamba: command not found"
**Solution**: Initialize conda/mamba in your shell
```bash
mamba init zsh  # or bash, fish, etc.
exec zsh
```

### Issue: "CUDA not found" on GPU systems
**Solution**: The environment.yml includes `pytorch-cuda=12.1`. If you need a different CUDA version, modify:
```yaml
- pytorch::pytorch-cuda=11.8  # for CUDA 11.8
# or
- pytorch::cpuonly=2023.12    # for CPU-only
```

### Issue: Environment creation fails
**Solution**: Update mamba and try again
```bash
mamba update -n base -c conda-forge mamba
mamba clean -a  # Clear cache
mamba env create -f environment.yml
```

### Issue: Slow installation on first run
**This is normal!** conda-forge packages are being downloaded and cached. Subsequent installs will be much faster.

---

## Performance Comparison ⚡

### Installation Time (Approximate)

#### Pip (with pip install -r requirements-ai.txt)
- Dependency resolution: 5-10 min
- PyTorch compilation: 10-20 min
- TensorFlow compilation: 15-30 min
- **Total: 30-60+ minutes** ⏱️

#### Mamba (with mamba env create)
- Dependency resolution: 1-2 min
- Binary downloads: 3-5 min
- Installation: 1-2 min
- **Total: 5-10 minutes** ⚡

### Disk Space
- pip install: ~15-20 GB
- mamba env: ~10-15 GB (same or less)

---

## Integration with Docker 🐳

If you're containerizing this project, use conda-forge in your Dockerfile:

```dockerfile
FROM mambaorg/micromamba:latest

COPY environment.yml /tmp/environment.yml
RUN micromamba env create -f /tmp/environment.yml

ENV PATH="/opt/conda/envs/cleanconnect-pro-enhanced/bin:$PATH"
```

---

## Next Steps 🚀

1. ✅ Install Mamba
2. ✅ Run: `mamba env create -f environment.yml`
3. ✅ Run: `mamba activate cleanconnect-pro-enhanced`
4. ✅ Start developing!

Happy coding! 🎉
