# Miniforge/Mamba Analysis Report

## Summary

- **Directories Analyzed:** 2
- **Total Python Files:** 2
- **Unique Import Modules:** 4

## Directory Breakdown

### pythons

- **Directory:** `/Users/steven/pythons`
- **Python Files:** 1
- **Unique Imports:** 4
- **Environment File:** `pythons_environment.yml`

**Top 20 Most Used Imports:**

- `json` - used in 1 files
- `random` - used in 1 files
- `datetime` - used in 1 files
- `collections` - used in 1 files

### pythons-sort

- **Directory:** `/Users/steven/pythons-sort`
- **Python Files:** 1
- **Unique Imports:** 0
- **Environment File:** `pythons-sort_environment.yml`

**Top 20 Most Used Imports:**


## Combined Analysis

**Top 30 Most Used Imports Across All Projects:**

- `json` - used in 1 files
- `random` - used in 1 files
- `datetime` - used in 1 files
- `collections` - used in 1 files

## Usage Instructions

### Install Miniforge/Mamba

```bash
# Download and install Miniforge from:
# https://github.com/conda-forge/miniforge

# Or install via Homebrew:
brew install miniforge
```

### Create Environments

```bash
# Using mamba (faster):
mamba env create -f pythons_environment.yml
mamba env create -f pythons-sort_environment.yml
mamba env create -f combined_environment.yml

# Using conda:
conda env create -f pythons_environment.yml
conda env create -f pythons-sort_environment.yml
conda env create -f combined_environment.yml
```

### Activate Environment

```bash
mamba activate <environment_name>
# or
conda activate <environment_name>
```

