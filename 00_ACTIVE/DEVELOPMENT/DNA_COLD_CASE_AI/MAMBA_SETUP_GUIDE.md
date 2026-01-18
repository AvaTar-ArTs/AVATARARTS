# Miniforge/Mamba Setup Guide
**DNA Cold Case AI - Development Environment**

---

## Quick Start (Recommended)

### Option 1: Automated Setup (Easiest)

```bash
cd ~/AVATARARTS/DNA_COLD_CASE_AI
./setup_mamba.sh
```

This script will:
- Detect your OS and architecture
- Install Miniforge (if not already installed)
- Create the `dna-cold-case-ai` conda environment
- Install all dependencies

### Option 2: Manual Setup

```bash
# 1. Install Miniforge (if not already installed)
# See "Manual Installation" section below

# 2. Create environment
mamba env create -f environment.yml

# 3. Activate environment
mamba activate dna-cold-case-ai

# 4. Verify installation
python -c "import numpy, scipy, pandas, sklearn, xgboost; print('✓ All imports successful')"
```

---

## Manual Installation

### macOS (Apple Silicon - M1/M2/M3)

```bash
# Download Miniforge
curl -L -O https://github.com/conda-forge/miniforge/releases/latest/download/Miniforge3-MacOSX-arm64.sh

# Install
bash Miniforge3-MacOSX-arm64.sh -b -p $HOME/miniforge3

# Initialize shell
$HOME/miniforge3/bin/conda init zsh  # or bash

# Restart terminal or source config
source ~/.zshrc  # or ~/.bashrc

# Verify installation
mamba --version
```

### macOS (Intel)

```bash
# Download Miniforge
curl -L -O https://github.com/conda-forge/miniforge/releases/latest/download/Miniforge3-MacOSX-x86_64.sh

# Install
bash Miniforge3-MacOSX-x86_64.sh -b -p $HOME/miniforge3

# Initialize shell
$HOME/miniforge3/bin/conda init zsh  # or bash

# Restart terminal or source config
source ~/.zshrc  # or ~/.bashrc

# Verify installation
mamba --version
```

### Linux (x86_64)

```bash
# Download Miniforge
curl -L -O https://github.com/conda-forge/miniforge/releases/latest/download/Miniforge3-Linux-x86_64.sh

# Install
bash Miniforge3-Linux-x86_64.sh -b -p $HOME/miniforge3

# Initialize shell
$HOME/miniforge3/bin/conda init bash

# Restart terminal or source config
source ~/.bashrc

# Verify installation
mamba --version
```

### Linux (ARM64)

```bash
# Download Miniforge
curl -L -O https://github.com/conda-forge/miniforge/releases/latest/download/Miniforge3-Linux-aarch64.sh

# Install
bash Miniforge3-Linux-aarch64.sh -b -p $HOME/miniforge3

# Initialize shell
$HOME/miniforge3/bin/conda init bash

# Restart terminal or source config
source ~/.bashrc

# Verify installation
mamba --version
```

---

## Environment Management

### Activate Environment

```bash
mamba activate dna-cold-case-ai
# or
conda activate dna-cold-case-ai
```

### Deactivate Environment

```bash
mamba deactivate
# or
conda deactivate
```

### Update Environment

```bash
# Update from environment.yml (recommended after pulling updates)
mamba env update -n dna-cold-case-ai -f environment.yml --prune

# Update specific package
mamba update -n dna-cold-case-ai numpy

# Update all packages
mamba update -n dna-cold-case-ai --all
```

### Remove Environment

```bash
mamba env remove -n dna-cold-case-ai
```

### Export Environment

```bash
# Export exact package versions (for reproducibility)
mamba env export -n dna-cold-case-ai > environment_exact.yml

# Export without builds (more portable)
mamba env export -n dna-cold-case-ai --no-builds > environment_portable.yml
```

### List Environments

```bash
mamba env list
# or
conda env list
```

### List Installed Packages

```bash
mamba list
# or
conda list
```

---

## Verification & Testing

### Basic Verification

```bash
# Activate environment
mamba activate dna-cold-case-ai

# Check Python version
python --version
# Expected: Python 3.11.x

# Test core imports
python -c "
import numpy as np
import scipy
import pandas as pd
import sklearn
import xgboost as xgb
import lightgbm as lgb
import shap
import Bio
print('✓ All core packages imported successfully')
print(f'NumPy: {np.__version__}')
print(f'Pandas: {pd.__version__}')
print(f'Scikit-learn: {sklearn.__version__}')
print(f'XGBoost: {xgb.__version__}')
"
```

### Full System Test

```bash
# Run demo script
python demo.py

# Run tests (if available)
pytest tests/ -v

# Run specific module
python src/dna_cold_case_ai.py
```

---

## Package Details

### Core Scientific Computing
- **numpy** (≥1.24.0): Array operations, linear algebra
- **scipy** (≥1.10.0): Scientific computing, optimization
- **pandas** (≥2.0.0): Data structures, analysis
- **matplotlib** (≥3.7.0): Plotting, visualization
- **seaborn** (≥0.12.0): Statistical visualization

### Machine Learning
- **scikit-learn** (≥1.3.0): ML algorithms (Random Forest, Gradient Boosting)
- **xgboost** (≥2.0.0): Gradient boosting (for ensemble)
- **lightgbm** (≥4.0.0): Fast gradient boosting
- **shap** (≥0.42.0): Explainable AI (court admissibility)

### Bioinformatics & Genomics
- **biopython** (≥1.81): Biological computation, sequence analysis
- **pysam** (≥0.21.0): SAM/BAM file handling
- **cyvcf2** (≥0.30.0): VCF file parsing

### Performance & Optimization
- **numba** (≥0.57.0): JIT compilation for Python
- **cython** (≥3.0.0): C-extensions compilation

### Blockchain & Security
- **web3** (≥6.0.0): Ethereum blockchain interaction
- **cryptography** (≥41.0.0): Encryption, hashing

### Development Tools
- **pytest** (≥7.4.0): Testing framework
- **black** (≥23.0.0): Code formatting
- **flake8** (≥6.0.0): Linting
- **mypy** (≥1.4.0): Type checking

---

## Troubleshooting

### Issue: Mamba not found after installation

**Solution:**
```bash
# Reinitialize shell
$HOME/miniforge3/bin/conda init $(basename $SHELL)

# Restart terminal
exec $SHELL

# Or source config manually
source ~/.zshrc  # or ~/.bashrc
```

### Issue: Environment creation fails

**Solution 1: Clear cache**
```bash
mamba clean --all
mamba env create -f environment.yml
```

**Solution 2: Update mamba**
```bash
mamba update -n base mamba
mamba env create -f environment.yml
```

**Solution 3: Use conda instead**
```bash
conda env create -f environment.yml
```

### Issue: Package conflicts

**Solution:**
```bash
# Remove environment and recreate
mamba env remove -n dna-cold-case-ai
mamba env create -f environment.yml

# Or create with strict channel priority
mamba env create -f environment.yml --strict-channel-priority
```

### Issue: Slow package solving

**Why mamba is faster:**
- Mamba uses parallel dependency resolution
- C++ implementation vs Python (conda)
- Typically 5-10x faster than conda

**If still slow:**
```bash
# Use libmamba solver (faster)
conda install -n base conda-libmamba-solver
conda config --set solver libmamba

# Or use mamba exclusively
mamba install -n base mamba
```

### Issue: Import errors after installation

**Solution:**
```bash
# Ensure environment is activated
mamba activate dna-cold-case-ai

# Check which Python is being used
which python
# Should be: ~/miniforge3/envs/dna-cold-case-ai/bin/python

# Reinstall problematic package
mamba reinstall <package-name>
```

### Issue: Apple Silicon (M1/M2/M3) specific issues

**Most packages now support ARM64 natively, but if you encounter issues:**

```bash
# Option 1: Use Rosetta 2 (Intel emulation)
# Install Intel version of Miniforge instead

# Option 2: Force ARM64 packages
conda config --env --set subdir osx-arm64

# Option 3: Allow fallback to x86_64 if needed
conda config --env --set subdir osx-64
```

---

## Performance Optimization

### Parallel Processing

```bash
# Set number of threads for NumPy/SciPy
export OMP_NUM_THREADS=4
export MKL_NUM_THREADS=4
export OPENBLAS_NUM_THREADS=4

# Add to ~/.zshrc or ~/.bashrc for persistence
echo 'export OMP_NUM_THREADS=4' >> ~/.zshrc
```

### Memory Settings

```bash
# For large DNA datasets, increase memory limits
export NUMBA_NUM_THREADS=4
export NUMEXPR_MAX_THREADS=4
```

---

## Alternative: Docker Container (Future)

For production deployment, consider Docker:

```dockerfile
# Future: Dockerfile
FROM condaforge/miniforge3:latest

WORKDIR /app
COPY environment.yml .
RUN mamba env create -f environment.yml

COPY . .
CMD ["mamba", "run", "-n", "dna-cold-case-ai", "python", "src/dna_cold_case_ai.py"]
```

---

## Integration with IDE

### VS Code

1. Install Python extension
2. Select interpreter:
   - `Cmd+Shift+P` → "Python: Select Interpreter"
   - Choose: `~/miniforge3/envs/dna-cold-case-ai/bin/python`

3. Add to `.vscode/settings.json`:
```json
{
    "python.defaultInterpreterPath": "~/miniforge3/envs/dna-cold-case-ai/bin/python",
    "python.terminal.activateEnvironment": true
}
```

### PyCharm

1. Settings → Project → Python Interpreter
2. Add Interpreter → Conda Environment
3. Select existing environment: `dna-cold-case-ai`

### Jupyter

```bash
# Install Jupyter kernel for this environment
mamba activate dna-cold-case-ai
python -m ipykernel install --user --name dna-cold-case-ai --display-name "DNA Cold Case AI"

# Launch Jupyter
jupyter lab
```

---

## CI/CD Integration

### GitHub Actions

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [ubuntu-latest, macos-latest]
        python-version: [3.11]

    steps:
    - uses: actions/checkout@v3

    - name: Setup Miniforge
      uses: conda-incubator/setup-miniconda@v2
      with:
        miniforge-version: latest
        activate-environment: dna-cold-case-ai
        environment-file: environment.yml
        python-version: ${{ matrix.python-version }}
        auto-activate-base: false

    - name: Run tests
      shell: bash -l {0}
      run: |
        pytest tests/ -v
```

---

## Environment Variables

Create `.env` file for configuration:

```bash
# .env (DO NOT COMMIT - add to .gitignore)
DNA_AI_ENV=development
DNA_AI_LOG_LEVEL=INFO
DNA_AI_DATA_DIR=~/AVATARARTS/DNA_COLD_CASE_AI/data
DNA_AI_MODELS_DIR=~/AVATARARTS/DNA_COLD_CASE_AI/models

# Database (for production)
DATABASE_URL=postgresql://user:pass@localhost:5432/dna_cold_case

# API Keys (if needed)
ANTHROPIC_API_KEY=sk-...
OPENAI_API_KEY=sk-...

# Blockchain (for chain of custody)
ETHEREUM_RPC_URL=https://mainnet.infura.io/v3/...
ETHEREUM_PRIVATE_KEY=0x...
```

Load in Python:
```python
from dotenv import load_dotenv
import os

load_dotenv()
log_level = os.getenv('DNA_AI_LOG_LEVEL', 'INFO')
```

---

## Best Practices

### 1. Always activate environment before working

```bash
mamba activate dna-cold-case-ai
```

### 2. Update regularly

```bash
# Weekly or after pulling updates
mamba env update -f environment.yml --prune
```

### 3. Pin critical versions

In `environment.yml`:
```yaml
dependencies:
  - numpy==1.24.3  # Pin exact version
  - scipy>=1.10.0  # Allow minor updates
```

### 4. Export exact environment for reproducibility

```bash
# Before important milestones (patents, demos)
mamba env export --no-builds > environment_v1.0.yml
```

### 5. Use .condarc for configuration

```bash
# ~/.condarc
channels:
  - conda-forge
  - bioconda
  - defaults

channel_priority: strict
auto_activate_base: false
```

---

## Uninstallation

### Remove environment only

```bash
mamba env remove -n dna-cold-case-ai
```

### Remove Miniforge completely

```bash
# Remove miniforge directory
rm -rf ~/miniforge3

# Remove initialization from shell config
# Edit ~/.zshrc or ~/.bashrc and remove conda/mamba lines

# Or use uninstall script
~/miniforge3/bin/conda-uninstall
```

---

## Additional Resources

- **Miniforge**: https://github.com/conda-forge/miniforge
- **Mamba docs**: https://mamba.readthedocs.io/
- **Conda-forge**: https://conda-forge.org/
- **Bioconda**: https://bioconda.github.io/

---

## Quick Reference

```bash
# Environment creation
mamba env create -f environment.yml

# Activation
mamba activate dna-cold-case-ai

# Update
mamba env update -f environment.yml --prune

# List packages
mamba list

# Install new package
mamba install <package-name>

# Deactivate
mamba deactivate

# Remove environment
mamba env remove -n dna-cold-case-ai
```

---

**Version**: 1.0
**Last Updated**: 2026-01-03
**Maintainer**: DNA Cold Case AI Team
