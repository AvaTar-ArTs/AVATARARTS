# Advanced Python Analyzer

This script analyzes Python files in a specified directory, producing:

- An HTML report with embedded path visualization
- A CSV summary of metrics and issues
- A standalone PNG visualization of file relationships

## Setup

It's recommended to work inside a virtual environment:

```bash
python3 -m venv .venv
source .venv/bin/activate
```

Install required dependencies:

```bash
pip install -r requirements.txt
```

Alternatively, install the package and its dependencies via pip:
```bash
pip install .
```

Once installed, run the analyzer with the console script:
```bash
deepseek-python <directory> [output_dir]
```

## Usage

### Via console script

```bash
deepseek-python <directory> [output_dir]
```

### Directly with Python

```bash
python deepseek_python.py <directory> [output_dir]
```

- `<directory>`: Path to the folder containing `.py` files to analyze.
- `[output_dir]`: (Optional) Directory where reports will be saved (default: `python_analysis_reports`).

After running, open the generated HTML report (`python_analysis_report.html`) in the output folder to view the results.