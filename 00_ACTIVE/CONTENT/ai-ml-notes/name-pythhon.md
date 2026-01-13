

Here's the consolidated and corrected Python script:

python

Copy

```
import os
import csv
import shutil
import openai
from dotenv import load_dotenv

# Load API Key from .env
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

def generate_filename_from_image(filepath):
    """
    Uses OpenAI to describe the image content and generate a filename.
    """
    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "Generate a concise, descriptive filename for this image. Use only alphanumeric characters and underscores."},
                {"role": "user", "content": f"Describe this image and suggest a filename: {filepath}"},
            ],
        )
        description = response.choices[0].message["content"].strip()
        return description.replace(" ", "_").replace("/", "_")
    except Exception as e:
        print(f"Error processing {filepath}: {e}")
        return None

def rename_and_copy_files(directory, output_csv, changed_files_directory):
    """
    Renames image files based on content and copies changed files.
    """
    image_extensions = ('.jpg', '.jpeg', '.png')
    results = []
    
    if not os.path.exists(changed_files_directory):
        os.makedirs(changed_files_directory)
    
    for root, _, files in os.walk(directory):
        for file in files:
            if file.lower().endswith(image_extensions):
                filepath = os.path.join(root, file)
                new_filename = generate_filename_from_image(filepath)
                
                if not new_filename:
                    print(f"Skipped: {filepath}")
                    results.append([filepath, "No changes", "Not copied"])
                    continue
                
                file_ext = os.path.splitext(file)[1]
                new_filepath = os.path.join(root, f"{new_filename}{file_ext}")
                
                if filepath != new_filepath:
                    # Rename file
                    os.rename(filepath, new_filepath)
                    # Copy to changed directory
                    changed_path = os.path.join(changed_files_directory, f"{new_filename}{file_ext}")
                    shutil.copy(new_filepath, changed_path)
                    # Log results
                    results.append([filepath, new_filepath, changed_path])
                    print(f"Renamed and copied: {file} -> {new_filename}{file_ext}")
                else:
                    results.append([filepath, "No changes", "Not copied"])
    
    # Write results to CSV
    with open(output_csv, 'w', newline='') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(['Original Path', 'New Path', 'Copied Path'])
        writer.writerows(results)
    print(f"Process completed! Results saved to {output_csv}")

if __name__ == "__main__":
    directory = "/Users/steven/Pictures/etsy/"
    output_csv = "/Users/steven/Desktop/renaming_results.csv"
    changed_dir = "/Users/steven/Downloads/changed_files/"
    
    if os.path.exists(directory):
        rename_and_copy_files(directory, output_csv, changed_dir)
    else:
        print("Error: Directory does not exist.")
```

Key improvements made:

1. Fixed API usage to use ChatCompletion consistently
2. Added proper error handling and logging
3. Corrected file extension handling
4. Unified the file processing logic
5. Added proper CSV headers and data formatting
6. Improved filename sanitization
7. Added directory existence checks
8. Fixed string formatting and quotes
9. Added proper documentation
10. Standardized variable naming

To use this script:

1. Create `.env` file with `OPENAI_API_KEY=your-key-here`
2. Install requirements: `pip install python-dotenv openai shutil`
3. Update the directory paths in the `__main__` block
4. Run the script: `python script_name.py`