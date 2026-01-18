### Dynamically generate the filename of the output CSV based on the current date


To dynamically generate the filename of the output CSV based on the current date, you can use Python's `datetime` module. I'll modify your code to include the current date in the filename, helping to uniquely identify when each CSV was created. Here's how you can do it:

```python
import json
import pandas as pd
import os
from glob import glob
from datetime import datetime

# Define the root directory path where JSON files are stored
ROOT_DIR = "/Users/steven/Library/Application Support/WhisperTranscribe/library"

# Recursively find all JSON files in subdirectories
json_files = sorted(
    glob(os.path.join(ROOT_DIR, "**/*.json"), recursive=True),
    key=lambda x: int(''.join(filter(str.isdigit, x))) if any(c.isdigit() for c in x) else 0
)

data_list = []

# Define the headers we want in the CSV
HEADERS = [
    "Title", "Summary", "Quotes", "Chapters", "Show Notes", 
    "Newsletter", "Blog post", "LinkedIn", "Instagram", 
    "X [Twitter]", "youtube seo info", "short youtube seo", 
    "seo-trendy", "Typog", "creative youtube seo", "trans", 
    "Origins", "Img-typog", "seo-title-keys"
]

# Process each JSON file
for file in json_files:
    try:
        with open(file, 'r', encoding='utf-8') as f:
            data = json.load(f)
            
        # Create a map for each piece of content
        content_map = {}
        for entry in data:
            if isinstance(entry, dict) and 'name' in entry and 'results' in entry:
                # Extract the name and content
                name = entry['name']
                content = entry['results'][0]['body'] if entry['results'] else ""
                content_map[name] = content
        
        # Create a row for each file
        row_data = {col: content_map.get(col, "") for col in HEADERS}
        data_list.append(row_data)
        
    except json.JSONDecodeError:
        print(f"Error: Failed to decode JSON from file: {file}")
    except Exception as e:
        print(f"An unexpected error occurred while processing file {file}: {e}")

# Convert the list of data to a DataFrame
df = pd.DataFrame(data_list, columns=HEADERS)

# Get the current date and format it
current_date = datetime.now().strftime("%Y-%m-%d")

# Define the output CSV path, incorporating the current date
output_csv = os.path.join(ROOT_DIR, f"combined_output_{current_date}.csv")

# Save the DataFrame as a CSV
try:
    df.to_csv(output_csv, index=False, encoding='utf-8-sig')
    print(f"Success! Created combined CSV with {len(df)} rows at: {output_csv}")
except Exception as e:
    print(f"Failed to save the CSV file: {e}")
```

### Key Changes:

- **Datetime Module**: Imported and used the `datetime` module to obtain the current date.
- **Dynamic Filename**: Used `datetime.now().strftime("%Y-%m-%d")` to format the date and incorporate it into the CSV filename, ensuring the output file is named with the format `combined_output_YYYY-MM-DD.csv`.

This approach will generate a unique filename based on the current date each time the script is run. Let me know if you need further tweaks!

---

###    WhisperText Content-json to Csv

```python
### outputcsv dated generated import json

import pandas as pd
import os
from glob import glob

# Define the root directory path where JSON files are stored

ROOT_DIR = "/Users/steven/Library/Application Support/WhisperTranscribe/library"

# Recursively find all JSON files in subdirectories

json_files = sorted(
    glob(os.path.join(ROOT_DIR, "**/*.json"), recursive=True),
    key=lambda x: int(''.join(filter(str.isdigit, x))) if any(c.isdigit() for c in x) else 0
)

data_list = []

# Define the updated headers we want in the CSV

HEADERS = [
    "Title", "Summary", "Quotes", "Chapters", "Show Notes", "Newsletter",
    "Blog post", "LinkedIn", "Instagram", "X [Twitter]",
    "youtube seo info", "short youtube seo", "seo-trendy",
    "Typog", "creative youtube seo", "trans", "Origins", "Img-typog", "seo-title-keys"
]

# Process JSON files

for file in json_files:
    with open(file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    

    content_map = {}
    for entry in data:
        if isinstance(entry, dict) and 'name' in entry and 'results' in entry:
            name = entry['name']
            content = entry['results'][0]['body'] if entry['results'] else ""
            content_map[name] = content
    
    row_data = {col: content_map.get(col, "") for col in HEADERS}
    data_list.append(row_data)

# Convert to DataFrame

df = pd.DataFrame(data_list, columns=HEADERS)

# Save as CSV

output_csv = os.path.join(ROOT_DIR, "combined_output.csv")
df.to_csv(output_csv, index=False, encoding='utf-8-sig')

print(f"Success! Created combined CSV with {len(df)} rows at: {output_csv}")
```

It looks like you've taken the task of merging JSON data into a structured CSV quite seriously! I can imagine a scenario where this setup might involve whimsical or themed designs. Here are some creative and playful filenames and YouTube titles for this data processing endeavor:



---



---

### organize your JSON data into a combined CSV file

Sure! Let's rewrite the given Python script to organize your JSON data into a combined CSV file. I'll also try and improve it by adding better error handling and some comments for clarity:

```python
import json
import pandas as pd
import os
from glob import glob

# Define the root directory path where JSON files are stored
ROOT_DIR = "/Users/steven/Library/Application Support/WhisperTranscribe/library"

# Recursively find all JSON files in subdirectories
json_files = sorted(
    glob(os.path.join(ROOT_DIR, "**/*.json"), recursive=True),
    key=lambda x: int(''.join(filter(str.isdigit, x))) if any(c.isdigit() for c in x) else 0
)

data_list = []

# Define the headers we want in the CSV
HEADERS = [
    "Title", "Summary", "Quotes", "Chapters", "Show Notes", 
    "Newsletter", "Blog post", "LinkedIn", "Instagram", 
    "X [Twitter]", "youtube seo info", "short youtube seo", 
    "seo-trendy", "Typog", "creative youtube seo", "trans", 
    "Origins", "Img-typog", "seo-title-keys"
]

# Process each JSON file
for file in json_files:
    try:
        with open(file, 'r', encoding='utf-8') as f:
            data = json.load(f)
            
        # Create a map for each piece of content
        content_map = {}
        for entry in data:
            if isinstance(entry, dict) and 'name' in entry and 'results' in entry:
                # Extract the name and content
                name = entry['name']
                content = entry['results'][0]['body'] if entry['results'] else ""
                content_map[name] = content
        
        # Create a row for each file
        row_data = {col: content_map.get(col, "") for col in HEADERS}
        data_list.append(row_data)
        
    except json.JSONDecodeError:
        print(f"Error: Failed to decode JSON from file: {file}")
    except Exception as e:
        print(f"An unexpected error occurred while processing file {file}: {e}")

# Convert the list of data to a DataFrame
df = pd.DataFrame(data_list, columns=HEADERS)

# Define the output CSV path
output_csv = os.path.join(ROOT_DIR, "combined_output.csv")

# Save the DataFrame as a CSV
try:
    df.to_csv(output_csv, index=False, encoding='utf-8-sig')
    print(f"Success! Created combined CSV with {len(df)} rows at: {output_csv}")
except Exception as e:
    print(f"Failed to save the CSV file: {e}")
```

### Key Changes and Improvements:
1. **Error Handling**: Added specific error handling for JSON decode errors and unexpected exceptions.
2. **Comments**: Added descriptive comments throughout the script to make the purpose of each part clear.
3. **Maintainability**: Ensured the code is clean and organized for easier maintenance and adjustment.

Feel free to ask for any further modifications or explanations!

---



---



### 
