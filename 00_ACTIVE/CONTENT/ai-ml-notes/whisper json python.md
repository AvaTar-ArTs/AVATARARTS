---
title: whisper-json-python
date: 2025-09-05
source: https://www.perplexity.ai/search/whisper-json-python-L6nK9JK8SDCG6Z08EqDOWQ
---

**User:** ### import jsonimport pandas as pdimport osfrom glob import glob# Define the root directory path where JSON files are storedROOT_DIR = "/Users/steven/Library/Application Support/WhisperTranscribe/library"# Recursively find all JSON files in subdirectoriesjson_files = sorted(    glob(os.path.join(ROOT_DIR, "**/*.json"), recursive=True),    key=lambda x: int(''.join(filter(str.isdigit, x))) if any(c.isdigit() for c in x) else 0)data_list = []# Define the updated headers we want in the CSVHEADERS = [    "Title", "Summary", "Quotes", "Chapters", "Show Notes", "Newsletter",    "Blog post", "LinkedIn", "Instagram", "X [Twitter]",    "youtube seo info", "short youtube seo", "seo-trendy",    "Typog", "creative youtube seo", "trans", "Origins", "Img-typog", "seo-title-keys"]# Process JSON filesfor file in json_files:    with open(file, 'r', encoding='utf-8') as f:        data = json.load(f)        content_map = {}    for entry in data:        if isinstance(entry, dict) and 'name' in entry and 'results' in entry:            name = entry['name']            content = entry['results'][0]['body'] if entry['results'] else ""            content_map[name] = content        row_data = {col: content_map.get(col, "") for col in HEADERS}    data_list.append(row_data)# Convert to DataFramedf = pd.DataFrame(data_list, columns=HEADERS)# Save as CSVoutput_csv = os.path.join(ROOT_DIR, "combined_output.csv")df.to_csv(output_csv, index=False, encoding='utf-8-sig')print(f"Success! Created combined CSV with {len(df)} rows at: {output_csv}")

---

**User:** import jsonimport pandas as pdimport osfrom glob import globfrom datetime import datetime# Define the root directory path where JSON files are storedROOT_DIR = "/Users/steven/Library/Application Support/WhisperTranscribe/library"# Recursively find all JSON files in subdirectoriesjson_files = sorted(    glob(os.path.join(ROOT_DIR, "**/*.json"), recursive=True),    key=lambda x: int(''.join(filter(str.isdigit, x))) if any(c.isdigit() for c in x) else 0)data_list = []# Define the headers we want in the CSVHEADERS = [    "Title", "Summary", "Quotes", "Chapters", "Show Notes",     "Newsletter", "Blog post", "LinkedIn", "Instagram",     "X [Twitter]", "youtube seo info", "short youtube seo",     "seo-trendy", "Typog", "creative youtube seo", "trans",     "Origins", "Img-typog", "seo-title-keys"]# Process each JSON filefor file in json_files:    try:        with open(file, 'r', encoding='utf-8') as f:            data = json.load(f)                    # Create a map for each piece of content        content_map = {}        for entry in data:            if isinstance(entry, dict) and 'name' in entry and 'results' in entry:                # Extract the name and content                name = entry['name']                content = entry['results'][0]['body'] if entry['results'] else ""                content_map[name] = content                # Create a row for each file        row_data = {col: content_map.get(col, "") for col in HEADERS}        data_list.append(row_data)            except json.JSONDecodeError:        print(f"Error: Failed to decode JSON from file: {file}")    except Exception as e:        print(f"An unexpected error occurred while processing file {file}: {e}")# Convert the list of data to a DataFramedf = pd.DataFrame(data_list, columns=HEADERS)# Get the current date and format itcurrent_date = datetime.now().strftime("%Y-%m-%d")# Define the output CSV path, incorporating the current dateoutput_csv = os.path.join(ROOT_DIR, f"combined_output_{current_date}.csv")# Save the DataFrame as a CSVtry:    df.to_csv(output_csv, index=False, encoding='utf-8-sig')    print(f"Success! Created combined CSV with {len(df)} rows at: {output_csv}")except Exception as e:    print(f"Failed to save the CSV file: {e}")

---

**Assistant:** Your Python script is well-written and aims to process JSON files from a specified directory, extract relevant data based on predefined headers, and save the consolidated data into a CSV file. Below is an explanation of the script's functionality and potential improvements:
## **Script Overview**
- **Import Required Libraries:**
`json`: For parsing JSON files.
- `pandas`: For handling tabular data and creating the CSV file.
- `os` and `glob`: To navigate the file system and locate JSON files recursively.
- **Define Directory:**
The script sets `ROOT_DIR` as the path where JSON files are stored.
- **Locate JSON Files:**
The `glob` function retrieves all `.json` files recursively from subdirectories under `ROOT_DIR`.
- Files are sorted based on numeric values in their filenames (if present).
- **Process JSON Files:**
Each JSON file is read, and its content is parsed.
- The script extracts specific fields (`name` and `results`) and maps them to predefined headers (`HEADERS`).
- **Create DataFrame:**
Data is aggregated into a list of dictionaries (`data_list`) and converted into a Pandas DataFrame.
- **Save to CSV:**
The DataFrame is saved as a CSV file named `combined_output.csv` in the same directory (`ROOT_DIR`).
- **Output Success Message:**
A message is printed indicating the number of rows in the generated CSV file.
## **Potential Improvements**
## 1. **Error Handling**
Add error handling for scenarios like missing keys in JSON, empty files, or invalid formats.
pythontry:
with open(file, 'r', encoding='utf-8') as f:
data = json.load(f)
except (json.JSONDecodeError, FileNotFoundError) as e:
print(f"Error processing file {file}: {e}")
continue
## 2. **Dynamic Header Extraction**
If headers vary across files, consider dynamically extracting them from the JSON structure instead of hardcoding `HEADERS`.
python# Extract headers dynamically based on all JSON files
all_headers = set()
for file in json_files:
with open(file, 'r', encoding='utf-8') as f:
data = json.load(f)
for entry in data:
if isinstance(entry, dict) and 'name' in entry:
all_headers.add(entry['name'])
HEADERS = sorted(all_headers)
## 3. **File Sorting Logic**
The current sorting logic assumes filenames contain numeric values. If filenames have inconsistent formats, this could cause issues. Consider logging skipped files for debugging.
## 4. **Logging**
Implement logging instead of printing messages to track progress and errors.
pythonimport logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logging.info(f"Processing file: {file}")
## 5. **Performance Optimization**
For large datasets, you can process files in chunks or use multiprocessing for faster execution.
## 6. **Validation of Results**
Before saving the CSV, validate the DataFrame contents to ensure no critical data is missing.
pythonif df.empty:
print("Warning: No data found to write to CSV.")
else:
df.to_csv(output_csv, index=False, encoding='utf-8-sig')
## **Final Script with Improvements**
Here’s an updated version of your script incorporating some improvements:
pythonimport json
import pandas as pd
import os
from glob import glob
import logging
# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
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
try:
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
logging.info(f"Successfully processed: {file}")
except Exception as e:
logging.error(f"Error processing file {file}: {e}")
continue
# Convert to DataFrame
df = pd.DataFrame(data_list, columns=HEADERS)
# Save as CSV
output_csv = os.path.join(ROOT_DIR, "combined_output.csv")
if not df.empty:
df.to_csv(output_csv, index=False, encoding='utf-8-sig')
logging.info(f"Success! Created combined CSV with {len(df)} rows at: {output_csv}")
else:
logging.warning("No data found to write to CSV.")
This version adds robustness through error handling, logging, and validation while maintaining readability and functionality.

---

**Assistant:** Your updated script is well-structured and incorporates some useful features like error handling and dynamic file naming based on the current date. Below is a breakdown of its functionality, along with suggestions for further improvement:
## **Script Overview**
- **Importing Libraries:**
`json`, `pandas`, `os`, and `glob` are used for file handling, data processing, and directory traversal.
- `datetime` is used to generate a timestamp for the output CSV file.
- **Locating JSON Files:**
The script recursively searches for all `.json` files under the `ROOT_DIR` directory.
- Files are sorted based on numeric values in their filenames (if present).
- **Processing JSON Files:**
Each JSON file is opened and parsed.
- The script extracts specific fields (`name` and `results`) from the JSON structure and maps them to predefined headers (`HEADERS`).
- If a file cannot be decoded or another error occurs, an appropriate message is printed.
- **Creating a DataFrame:**
The extracted data is stored in a list of dictionaries (`data_list`) and converted into a Pandas DataFrame.
- **Saving the DataFrame as a CSV:**
The output CSV filename includes the current date (e.g., `combined_output_2025-04-07.csv`).
- The script attempts to save the DataFrame as a CSV file, printing a success or failure message.
## **Strengths**
- **Error Handling**: The script gracefully handles JSON decoding errors and unexpected exceptions.
- **Dynamic Output Filename**: Including the current date in the output filename ensures that each run generates a unique file, preventing overwrites.
- **Readable Code: The code is clean, modular, and easy to follow.**
## **Suggestions for Improvement**
## 1. **Logging Instead of Print Statements**
Replace `print()` statements with Python's built-in `logging` module for better control over logging levels and output.
pythonimport logging
# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
# Example usage
logging.info(f"Processing file: {file}")
logging.error(f"Error decoding JSON from file: {file}")
## 2. **File Sorting Logic**
The sorting logic assumes filenames contain numeric values. For filenames without numbers, this could cause unexpected behavior. Consider using natural sorting (e.g., via the `natsort` library) for better handling of mixed filenames.
bashpip install natsort
pythonfrom natsort import natsorted
json_files = natsorted(
glob(os.path.join(ROOT_DIR, "**/*.json"), recursive=True)
)
## 3. **Handling Missing Keys**
If some JSON files do not contain all the expected keys in `HEADERS`, you might want to log this information or handle it explicitly.
pythonif not content_map.get(col):
logging.warning(f"Missing key '{col}' in file: {file}")
## 4. **Empty Data Validation**
Before saving the CSV, check if the DataFrame is empty to avoid creating an invalid or empty file.
pythonif df.empty:
logging.warning("No data found to write to CSV.")
else:
df.to_csv(output_csv, index=False, encoding='utf-8-sig')
logging.info(f"Success! Created combined CSV with {len(df)} rows at: {output_csv}")
## 5. **Performance Optimization**
For large datasets or many files, consider processing files in parallel using libraries like `concurrent.futures`.
pythonfrom concurrent.futures import ProcessPoolExecutor
def process_file(file):
try:
with open(file, 'r', encoding='utf-8') as f:
data = json.load(f)
# Process data here...
return row_data  # Return processed row
except Exception as e:
logging.error(f"Error processing file {file}: {e}")
return None
with ProcessPoolExecutor() as executor:
results = list(executor.map(process_file, json_files))
# Filter out None results
data_list = [result for result in results if result]
## 6. **Improved Success Message**
Include more detailed information in the success message, such as the total number of files processed and skipped.
pythonprocessed_files = len(data_list)
skipped_files = len(json_files) - processed_files
logging.info(f"Processed {processed_files} files successfully.")
logging.info(f"Skipped {skipped_files} files due to errors.")
logging.info(f"Combined CSV saved at: {output_csv}")
## **Final Improved Script**
Here’s an improved version of your script with these suggestions incorporated:
pythonimport json
import pandas as pd
import os
from glob import glob
from datetime import datetime
import logging
# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
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
logging.info(f"Successfully processed: {file}")
except json.JSONDecodeError:
logging.error(f"Error decoding JSON from file: {file}")
except Exception as e:
logging.error(f"An unexpected error occurred while processing file {file}: {e}")
# Convert the list of data to a DataFrame
df = pd.DataFrame(data_list, columns=HEADERS)
# Get the current date and format it
current_date = datetime.now().strftime("%Y-%m-%d")
# Define the output CSV path, incorporating the current date
output_csv = os.path.join(ROOT_DIR, f"combined_output_{current_date}.csv")
# Save the DataFrame as a CSV if it contains data
if not df.empty:
try:
df.to_csv(output_csv, index=False, encoding='utf-8-sig')
logging.info(f"Success! Created combined CSV with {len(df)} rows at: {output_csv}")
except Exception as e:
logging.error(f"Failed to save the CSV file: {e}")
else:
logging.warning("No data found to write to CSV.")
This version improves robustness and provides better feedback during execution while maintaining clarity and functionality.