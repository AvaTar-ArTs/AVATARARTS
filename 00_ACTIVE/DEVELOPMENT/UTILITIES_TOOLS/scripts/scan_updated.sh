#!/bin/bash

# Updated standalone scan script that automatically finds the clean-organizer directory
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

scan() {
  local type="${1:-all}"
  local dir="${2:-.}"

  # Expand ~ to $HOME if present
  dir="${dir/#\~/$HOME}"
  
  # Convert to absolute path
  if [[ "$dir" != /* ]]; then
    dir="$(cd "$dir" 2>/dev/null && pwd)" || {
      echo "❌ Directory not found: $dir"
      return 1
    }
  fi

  # Map type to script name
  local script=""
  local type_label=""
  case "$type" in
    audio|a)
      script="audio.py"
      type_label="audio"
      ;;
    docs|d)
      script="docs.py"
      type_label="docs"
      ;;
    images|img|i)
      script="img.py"
      type_label="images"
      ;;
    videos|vids|v)
      script="vids.py"
      type_label="videos"
      ;;
    other|o)
      script="other.py"
      type_label="other"
      ;;
    all)
      echo "🔍 Scanning all file types in: $dir"
      scan audio "$dir"
      scan docs "$dir"
      scan images "$dir"
      scan videos "$dir"
      scan other "$dir"
      return 0
      ;;
    help|--help|-h)
      echo "Usage: $0 <type> [directory]"
      echo ""
      echo "Types:"
      echo "  audio, a       - Scan audio files"
      echo "  docs, d        - Scan document files"
      echo "  images, img, i - Scan image files"
      echo "  videos, vids, v - Scan video files"
      echo "  other, o       - Scan other files"
      echo "  all            - Scan all types (default)"
      echo ""
      echo "CSV files are automatically saved in the scanned directory."
      echo ""
      echo "Examples:"
      echo "  $0 audio /Volumes/2T-Xx"
      echo "  $0 images ~/Pictures"
      echo "  $0 all /Volumes/Backup"
      echo ""
      echo "Output: <directory>/<basename>-scan-<type>-<date>.csv"
      return 0
      ;;
    *)
      echo "❌ Unknown type: $type"
      echo "Valid types: audio, docs, images, videos, other, all"
      echo "Run '$0 help' for usage"
      return 1
      ;;
  esac

  # Check if the required script exists in the found organizer directory
  if [ ! -f "$ORGANIZER_DIR/$script" ]; then
    echo "❌ Script not found: $ORGANIZER_DIR/$script"
    return 1
  fi

  # Generate CSV filename: <dirname>-scan-<type>-<date>.csv
  local dirname="$(basename "$dir")"
  local date_suffix="$(date +%Y-%m-%d)"
  local output_csv="${dir}/${dirname}-scan-${type_label}-${date_suffix}.csv"

  echo "📂 Scanning: $dir"
  echo "💾 Output: $output_csv"

  # Run the appropriate script with auto-generated output
  python "$ORGANIZER_DIR/$script" -d "$dir" -o "$output_csv"
}

# Handle command line arguments
scan "$@"