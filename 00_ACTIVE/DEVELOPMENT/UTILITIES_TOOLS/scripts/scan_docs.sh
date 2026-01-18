#!/bin/bash

# Standalone script to scan documents in a directory
# This addresses the issue where the scan function from .zshrc doesn't work in bash

scan_docs() {
    local dir="${1:-.}"

    # Expand ~ to $HOME if present
    dir="${dir/#\~/$HOME}"
    
    # Convert to absolute path
    if [[ "$dir" != /* ]]; then
        dir="$(cd "$dir" 2>/dev/null && pwd)" || {
            echo "❌ Directory not found: $dir"
            return 1
        }
    fi

    if [ ! -d "$dir" ]; then
        echo "❌ Directory does not exist: $dir"
        return 1
    fi

    # Check if clean-organizer directory exists
    local organizer_dir="$HOME/pythons/clean-organizer"
    if [ ! -d "$organizer_dir" ]; then
        echo "❌ Organizer directory not found: $organizer_dir"
        return 1
    fi

    # Check if docs.py exists
    if [ ! -f "$organizer_dir/docs.py" ]; then
        echo "❌ docs.py not found in: $organizer_dir"
        return 1
    fi

    echo "📂 Scanning documents in: $dir"
    
    # Generate CSV filename: <dirname>-scan-docs-<date>.csv
    local dirname="$(basename "$dir")"
    local date_suffix="$(date +%Y-%m-%d)"
    local output_csv="${dir}/${dirname}-scan-docs-${date_suffix}.csv"

    echo "💾 Output will be saved as: $output_csv"

    # Run the docs.py script
    python "$organizer_dir/docs.py" -d "$dir" -o "$output_csv"
}

# Execute the function with the provided argument
scan_docs "$@"