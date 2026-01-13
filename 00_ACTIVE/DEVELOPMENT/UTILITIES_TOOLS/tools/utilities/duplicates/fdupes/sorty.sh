#!/bin/bash

# Function to run a script
run_script() {
    local script_path=$1
    echo "Running $script_path"
    python3 "$script_path"
    if [ $? -ne 0 ]; then
        echo "Failed to run $script_path"
        exit 1
    else
        echo "Successfully ran $script_path"
    fi
}

# List of scripts to run
scripts=(
    "/Users/steven/Documents/Python/fdupes/audio.py"
    "/Users/steven/Documents/Python/fdupes/docs.py"
    "/Users/steven/Documents/Python/fdupes/img.py"
    "/Users/steven/Documents/Python/fdupes/vids.py"
    "/Users/steven/Documents/Python/fdupes/other.py"
)

# Prompt user for each script
for script in "${scripts[@]}"; do
    read -p "Do you want to run $script? (Y/N): " response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        run_script "$script"
    else
        echo "Skipped $script"
    fi
done

echo "All scripts processed."
