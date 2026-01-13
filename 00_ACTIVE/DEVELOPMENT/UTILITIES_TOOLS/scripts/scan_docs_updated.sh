#!/bin/bash

# Updated standalone script to scan documents with auto-detection of organizer directory
# This addresses the issue when files may have moved to different locations

# Function to find the clean-organizer directory automatically
find_organizer_dir() {
    # Try common locations in order of preference
    local possible_paths=(
        "$HOME/pythons/clean-organizer"
        "$HOME/pythons/clean-organizer_1"
        "$HOME/GitHub/06_utilities/file_organizers/clean_organizer"
        "$HOME/GitHub/AvaTarArTs-Suite/utilities/organizers/clean_organizer"
        "$HOME/Documents/pythons/clean-organizer"  # Alternative location
    )
    
    for path in "${possible_paths[@]}"; do
        if [ -d "$path" ] && [ -f "$path/docs.py" ] && [ -f "$path/audio.py" ]; then
            echo "$path"
            return 0
        fi
    done
    
    # If none of the standard locations work, try a broader search
    local found_dir=$(find "$HOME" -path "*/clean-organizer" -type d -exec test -f '{}/docs.py' \; -print -quit 2>/dev/null)
    if [ -n "$found_dir" ]; then
        echo "$found_dir"
        return 0
    fi
    
    echo ""  # Return empty if nothing found
    return 1
}

# Find the actual location
ORGANIZER_DIR=$(find_organizer_dir)

if [ -z "$ORGANIZER_DIR" ]; then
    echo "❌ Could not find clean-organizer directory with the required Python scripts."
    echo "Please ensure you have the clean-organizer directory with docs.py, audio.py, etc."
    exit 1
fi

echo "📁 Found organizer directory at: $ORGANIZER_DIR"

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

    # Check if docs.py exists in the found organizer directory
    if [ ! -f "$ORGANIZER_DIR/docs.py" ]; then
        echo "❌ docs.py not found in: $ORGANIZER_DIR"
        return 1
    fi

    echo "📂 Scanning documents in: $dir"
    
    # Generate CSV filename: <dirname>-scan-docs-<date>.csv
    local dirname="$(basename "$dir")"
    local date_suffix="$(date +%Y-%m-%d)"
    local output_csv="${dir}/${dirname}-scan-docs-${date_suffix}.csv"

    echo "💾 Output will be saved as: $output_csv"

    # Run the docs.py script
    python "$ORGANIZER_DIR/docs.py" -d "$dir" -o "$output_csv"
}

# Execute the function with the provided argument
scan_docs "$@"