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
<<<<<<< HEAD
    "/Users/steven/Documents/python/clean/audio.py"
    "/Users/steven/Documents/python/clean/docs.py"
    "/Users/steven/Documents/python/clean/img.py"
    "/Users/steven/Documents/python/clean/vids.py" 
=======
    "/Users/steven/clean/audio.py"
    "/Users/steven/clean/docs.py"
    "/Users/steven/clean/img.py"
    "/Users/steven/clean/vids.py" 
>>>>>>> bc12fd8e74f34967fcaedc7e1bcdb4b24899a7c5
) 


# Run each script in the list
for script in "${scripts[@]}"; do
    run_script "$script"
done

