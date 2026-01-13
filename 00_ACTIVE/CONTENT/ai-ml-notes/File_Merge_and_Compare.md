Merging or comparing multiple files can be approached in several ways, depending on what exactly you need to do (i.e., comparing differences, merging changes, or consolidating code into a single file). Here are some methods and tools you can consider:

### 1. **Using Version Control (Git)**
- **Initialize a Git Repository:**  
  Place all the files in a directory and initialize a Git repository. This way, you can commit the original versions, make changes, and use Git’s diff and merge tools to compare changes.
  ```bash
  cd /Users/steven/Documents/analyze/
  git init
  git add *.py
  git commit -m "Initial commit"
  ```
- **Branching and Merging:**  
  If you want to integrate changes from different versions, consider using branches for each version and then merging them. Git will help highlight conflicts and let you resolve them manually.

### 2. **Command-Line Diff Tools**
- **diff and vimdiff:**  
  For a quick comparison between two files, you can use:
  ```bash
  diff "analyze 11.py" "analyzer.py"
  ```
  If you prefer a visual side-by-side comparison:
  ```bash
  vimdiff "analyze 11.py" "analyzer.py"
  ```
- **diff3:**  
  For three-way merges (if you have a common ancestor), `diff3` can be used to merge changes:
  ```bash
  diff3 -m file1.py file2.py file3.py > merged.py
  ```

### 3. **Graphical Merge Tools**
- **Meld:**  
  Meld is a user-friendly, graphical diff and merge tool that can compare multiple files. You can launch it from the command line:
  ```bash
  meld "analyze 11.py" "analyze 3.py" "analyzer.py"
  ```
- **Beyond Compare or KDiff3:**  
  These are alternative graphical tools that offer similar functionality, especially useful if you’re comparing more than two files.

### 4. **Text Editors/IDEs with Built-in Diff**
- **VSCode or Sublime Text:**  
  Both offer plugins or built-in functionality to compare files side-by-side. In VSCode, for example, you can right-click a file and choose “Select for Compare” and then choose another file.
- **PyCharm:**  
  Provides robust diff and merge tools as well.

### 5. **Scripting the Process**
If you have a large number of files and want to automate comparisons:
- **Bash/Python Script:**  
  You can write a script that loops through all the files and runs `diff` (or a similar tool) between pairs or groups. For example, a simple bash loop:
  ```bash
  for file in analyze\ *.py; do
      diff "analyze.py" "$file"
  done
  ```
  This script compares each `analyze X.py` file with a reference file like `analyze.py`.

### Summary
- **For simple comparisons:** Use command-line tools like `diff` or `vimdiff`.
- **For graphical visualization:** Use Meld, Beyond Compare, or an IDE with diff capabilities.
- **For merging changes:** Consider using Git branches or three-way merge tools like `diff3`.
- **For automation:** Write a custom script in Bash or Python.

Choose the method that best fits your workflow and the complexity of the changes you’re handling. If your files are largely similar and you’re trying to consolidate similar functionalities, a combination of diff tools and manual review will likely be the most effective approach.

Below are several examples using different methods and tools to compare and merge your Python files.

---

### 1. Using Command-Line Diff Tools

**a. Simple Diff**

You can use the built-in `diff` command to compare two files. For example, to compare **analyze 11.py** with **analyzer.py**:

```bash
diff "/Users/steven/Documents/analyze/analyze 11.py" "/Users/steven/Documents/analyze/analyzer.py"
```

This will print the differences line by line.

**b. Visual Diff with vimdiff**

If you prefer a side-by-side visual comparison, you can use `vimdiff`:

```bash
vimdiff "/Users/steven/Documents/analyze/analyze 11.py" "/Users/steven/Documents/analyze/analyzer.py"
```

---

### 2. Using a Graphical Merge Tool

**Meld Example**

Meld is a graphical tool that makes it easy to compare multiple files. To launch Meld with three files (for instance, comparing **analyze 11.py**, **analyze 3.py**, and **analyzer.py**):

```bash
meld "/Users/steven/Documents/analyze/analyze 11.py" "/Users/steven/Documents/analyze/analyze 3.py" "/Users/steven/Documents/analyze/analyzer.py"
```

You can add as many files as you need.

---

### 3. Using Git for Merging and Comparison

**a. Initialize a Git Repository**

Place all your files in the same directory and initialize Git:

```bash
cd /Users/steven/Documents/analyze/
git init
git add *.py
git commit -m "Initial commit of all analysis scripts"
```

**b. Create Branches for Each File Version (if needed)**

If you’re merging different versions, you can create branches:

```bash
git checkout -b version-analyze11
# Make changes or work on analyze 11.py

git checkout master
git checkout -b version-analyzer
# Work on analyzer.py
```

Then, you can merge branches and resolve any conflicts:

```bash
git merge version-analyze11
git merge version-analyzer
```

Git’s diff and merge tools will help you track changes and resolve conflicts.

---

### 4. Scripting Comparisons with Python

You can write a Python script using the `difflib` module to compare two files. Here’s an example:

```python
import difflib

def compare_files(file1, file2):
    with open(file1, 'r') as f1:
        lines1 = f1.readlines()
    with open(file2, 'r') as f2:
        lines2 = f2.readlines()
    diff = difflib.unified_diff(lines1, lines2,
                                fromfile=file1,
                                tofile=file2,
                                lineterm='')
    return '\n'.join(diff)

# Example usage:
file1 = '/Users/steven/Documents/analyze/analyze 11.py'
file2 = '/Users/steven/Documents/analyze/analyzer.py'
difference = compare_files(file1, file2)
print(difference)
```

This script prints a unified diff that highlights the differences between the two files.

---

### 5. Bash Script for Automated Comparisons

If you have many files and want to compare each one against a base file (say **analyze.py**), you can use a bash loop:

```bash
#!/bin/bash
base="/Users/steven/Documents/analyze/analyze.py"
for file in /Users/steven/Documents/analyze/analyze*.py; do
    # Skip the base file itself if it matches the pattern
    if [ "$file" != "$base" ]; then
        echo "Comparing $base with $file:"
        diff "$base" "$file"
        echo "---------------------------------"
    fi
done
```

Save this as `compare_all.sh`, make it executable with `chmod +x compare_all.sh`, and run it. It will compare the base file with every other file that matches the pattern.

---

These examples should help you choose the method that best fits your workflow for merging or comparing your Python files. Feel free to modify the commands or scripts to suit your specific needs.

When you’re dealing with multiple versions that only differ subtly, the goal is to preserve the best parts of each version while minimizing redundancy and potential conflicts. Here are some suggestions:

### 1. **Visual Comparison First**
- **Use a graphical diff tool** (like Meld, Beyond Compare, or even VSCode’s side-by-side diff) to inspect differences.  
  These tools allow you to see the variations line by line, helping you decide which changes are improvements or necessary modifications.

### 2. **Leverage Version Control**
- **Initialize a Git repository** for your files.  
  By committing each version to its own branch, you can merge changes incrementally. Git’s conflict resolution tools make it easier to handle subtle differences without losing track of modifications.

### 3. **Refactor into Modular Code**
- **Extract common functionality into functions or classes.**  
  If the differences are slight, it might be that all files are trying to solve a similar problem. Refactor the shared code into one central module, then use parameters or configuration to manage the variations.

### 4. **Automated Diff Analysis**
- **Write a script with Python’s `difflib`** to generate unified diffs.  
  This can help highlight exactly where the changes are and even quantify them. With that information, you can decide if certain differences are stylistic or if they represent functional improvements.

### 5. **Testing for Behavioral Differences**
- **Create or run tests** on each version.  
  If subtle differences affect behavior (for example, edge cases or performance optimizations), automated tests can help confirm which version works best under your use cases.

### In Summary
Based on the subtle differences you mentioned, I’d suggest:
- **Start with a detailed visual diff** to understand the exact changes.
- **Merge the versions incrementally using Git,** so you can backtrack if any issues occur.
- **Refactor common elements** to keep your codebase clean, using parameterization or modular functions to handle the differences.
- **Use automated testing** to verify that merging changes doesn’t introduce any regressions.

This approach should help you harness the best aspects of each file while ensuring the final, merged version is both clean and robust.

Based on the subtle differences between your versions, here are some suggestions to combine the strengths of each while keeping the overall flow and error handling robust:

---

### 1. **Keep the Core Functionality**
Both versions perform the same primary tasks:
- Loading environment variables and initializing the API client.
- Transcribing audio and analyzing text.
- Reading from an input (a file or a directory) and outputting results.

Keep these core tasks, but ensure that common functions (like `analyze_text` or transcription functions) are written once and reused.

---

### 2. **Enhance Error Handling and Logging**
The second version introduces logging and retry mechanisms which can greatly help in a production scenario:
- **Incorporate Logging:** Use a consistent logging configuration for both transcription and analysis steps.
- **Implement Retry Mechanisms:** Retrying when encountering errors (as in your advanced version) is a good idea to handle transient API issues.

---

### 3. **Modularize the Code**
Break down the scripts into smaller, reusable functions:
- **Environment Setup:** Create a single function to load environment variables and initialize the API client.
- **Transcription & Analysis Functions:** Keep the functions `transcribe_audio` and `analyze_text_for_section` as the backbone for both single file and batch processing.
- **File I/O and Directory Handling:** Have separate functions for handling a single file versus processing an entire directory.

This modular approach allows you to mix and match features based on your needs (e.g., single file test runs vs. directory batch processing).

---

### 4. **Offer Both Modes via Command-Line Arguments**
Consider adding a command-line flag or configuration setting to switch between single-file processing and batch processing:
- **Single File Mode:** For quick tests or one-off analyses.
- **Batch Mode:** For processing multiple files in a directory, using the ThreadPoolExecutor and progress feedback.

This way, you can run a test run with just one file while having the robust directory processing ready for larger tasks.

---

### 5. **User Feedback and Robustness**
Incorporate the interactive user prompts (e.g., checking if the directory exists, printing colored feedback) to improve the user experience, but ensure that they are optional or configurable for automation scenarios.

---

### Example of a Unified Approach

Here’s a brief sketch of how you might structure the merged code:

```python
import os
import sys
import logging
import time
from concurrent.futures import ThreadPoolExecutor
from dotenv import load_dotenv
from termcolor import colored
from tqdm import tqdm
from openai import OpenAI

# Load environment variables
load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Configure logging
logging.basicConfig(filename='analysis_errors.log', level=logging.ERROR,
                    format='%(asctime)s - %(levelname)s - %(message)s')

# Common utility functions
def format_timestamp(seconds):
    minutes = int(seconds // 60)
    seconds = int(seconds % 60)
    return f"{minutes:02d}:{seconds:02d}"

def transcribe_audio(file_path, max_attempts=3):
    # Transcription logic with retries and logging...
    # (similar to your advanced version)
    pass

def analyze_text_for_section(text, max_attempts=3):
    # Analysis logic with retries and logging...
    pass

def parse_transcript(transcript_text):
    segments = []
    for line in transcript_text.split("\n"):
        if "--" in line:
            parts = line.split(": ")
            if len(parts) == 2:
                timestamp, text = parts[0], parts[1]
                segments.append({"timestamp": timestamp, "text": text})
    return segments

def link_timestamps_to_analysis(transcript_segments, analysis_text):
    linked_analysis = analysis_text
    for segment in transcript_segments:
        if any(word in analysis_text for word in segment['text'].split()):
            linked_analysis = linked_analysis.replace(
                segment['text'],
                f"{segment['text']} [{segment['timestamp']}]"
            )
    return linked_analysis

def process_single_file(audio_file, transcript_dir, analysis_dir):
    filename_no_ext = os.path.splitext(os.path.basename(audio_file))[0]
    print(colored(f"Processing {filename_no_ext}...", "blue"))
    transcript = transcribe_audio(audio_file)
    if transcript:
        transcript_file_path = os.path.join(transcript_dir, f"{filename_no_ext}_transcript.txt")
        with open(transcript_file_path, "w") as f:
            f.write(transcript)
        transcript_segments = parse_transcript(transcript)
        analysis = analyze_text_for_section(transcript)
        if analysis:
            linked_analysis = link_timestamps_to_analysis(transcript_segments, analysis)
            analysis_file_path = os.path.join(analysis_dir, f"{filename_no_ext}_analysis.txt")
            with open(analysis_file_path, "w") as f:
                f.write(f"# Analysis of {filename_no_ext}\n\n" + linked_analysis)
        else:
            print(colored(f"Skipping analysis for {filename_no_ext} due to error.", "yellow"))
    else:
        print(colored(f"Skipping {filename_no_ext} due to transcription error.", "yellow"))

def process_audio_directory(audio_dir):
    transcript_dir = os.path.join(audio_dir, "transcript")
    analysis_dir = os.path.join(audio_dir, "analysis")
    os.makedirs(transcript_dir, exist_ok=True)
    os.makedirs(analysis_dir, exist_ok=True)
    audio_files = [os.path.join(root, f) for root, _, files in os.walk(audio_dir) if f.lower().endswith(".mp3")]
    if not audio_files:
        print(colored("No MP3 files found in the directory.", "red"))
        return
    print(colored(f"Found {len(audio_files)} audio files. Starting processing...", "green"))
    with ThreadPoolExecutor() as executor:
        list(tqdm(executor.map(lambda f: process_single_file(f, transcript_dir, analysis_dir), audio_files),
                  total=len(audio_files), desc="Processing MP3 files"))

if __name__ == "__main__":
    # Option to choose mode based on command-line args or user input
    if len(sys.argv) == 3:
        # Single file mode: script.py <audio_file> <output_file>
        audio_file = sys.argv[1]
        output_file = sys.argv[2]
        # Process single file and save output accordingly...
    else:
        # Batch mode: prompt user for directory
        audio_dir = input("Enter the full path to the audio directory: ")
        if os.path.isdir(audio_dir):
            process_audio_directory(audio_dir)
        else:
            print(colored("Invalid directory path.", "red"))
```

---

### Final Thoughts
By merging the two approaches:
- You get a simple, testable mode as well as a robust, scalable mode.
- You ensure better error handling with logging and retries.
- Your code remains modular and maintainable.

This unified approach should make it easier to test, debug, and eventually deploy your application for both one-off analyses and bulk processing.

When it comes to merging the user or content prompts across these versions, here are some suggestions:

### 1. **Clarify the Purpose**
- **Determine Your Use Case:**  
  Do you need a simple, fast analysis or a deep, structured breakdown? The first version offers a straightforward analysis, while the second provides a detailed, multi-part breakdown.

### 2. **Merge the Prompts Thoughtfully**
- **Combine Key Elements:**  
  Create a unified prompt that covers the essential details from both:
  - **System Message:** Set up the role clearly (e.g., “You are an experienced language and music expert.”).
  - **User Message:** Include both a brief summary and detailed instructions, such as:
    - A request for an overall analysis.
    - Specific sections like central themes, emotional tone, artist intent, and notable imagery.

### 3. **Make It Configurable**
- **Parameterize the Depth of Analysis:**  
  Allow a flag or parameter that toggles between a “quick” vs. “deep” analysis. For instance, you could define two modes:
  ```python
  def analyze_text(text, deep_analysis=False):
      system_message = (
          "You are an experienced language and music expert. "
          "Your role is to provide an in-depth analysis of song lyrics." if deep_analysis else
          "You are a helpful assistant that analyzes song lyrics."
      )
      user_message = (
          f"Please provide a thorough analysis of the following song transcript, covering: "
          f"(1) Central Themes, (2) Emotional Tone, (3) Artist's Intent, and (4) Notable Imagery. "
          f"Transcript: {text}" if deep_analysis else
          f"Analyze the following song transcript and extract the main themes, emotions, and keywords: {text}"
      )
      response = client.chat.completions.create(
          model="gpt-3.5-turbo",
          messages=[
              {"role": "system", "content": system_message},
              {"role": "user", "content": user_message},
          ],
          max_tokens=deep_analysis and 1500 or 150,
          temperature=0.7,
      )
      return response.choices[0].message.content.strip()
  ```
- **Flexibility:**  
  This approach means you can run a test (quick analysis) or a more comprehensive review by changing a parameter.

### 4. **Maintain Consistency Across Modes**
- **Unified Structure:**  
  Even if you offer multiple levels of analysis, try to keep the output structured in a similar format (e.g., bullet points or numbered sections). This makes it easier to compare and merge results later.
- **Error Handling and Logging:**  
  Since both versions include error-handling mechanisms, integrate logging into your unified function so that any issues during either type of analysis are captured consistently.

### 5. **Testing and User Feedback**
- **Iterate on the Prompt:**  
  Use sample transcripts to test both modes. Adjust the language and token limits based on the quality of the returned analysis.
- **User Control:**  
  Optionally, allow users to provide custom instructions to further refine the analysis, ensuring that the assistant’s response meets their expectations.

By consolidating these elements, you can support both quick and detailed analyses within the same codebase, ensuring that the differences in user and content prompts enhance rather than complicate your workflow.

You can definitely set up your system so that it offers multiple prompt choices for analysis. This lets you dynamically switch between different analysis styles or image generation prompts based on your needs. Here are a few approaches you might consider:

---

### 1. **Parameterization in Code**

Create a configuration or parameter that selects a prompt “mode.” For example, in your analysis function, you can add an argument like `prompt_mode` that picks the corresponding system and user messages.

```python
def analyze_text(text, prompt_mode="quick"):
    if prompt_mode == "detailed":
        system_message = (
            "You are an experienced language and music expert. Your role is to provide an in-depth, structured analysis of song lyrics. "
            "Focus on uncovering the central context, emotional nuances, narrative arc, and deeper meanings. Analyze the emotional tone, "
            "narrative journey, and underlying themes, while highlighting any significant metaphors, symbols, and imagery. "
            "Explain how these elements interconnect and contribute to the overall emotional and narrative impact."
        )
        user_message = (
            f"Please provide a thorough analysis of the following song transcript, structured as follows: "
            f"(1) **Central Themes and Meaning**: Describe the main themes and message. "
            f"(2) **Emotional Tone**: Highlight any shifts and nuances. "
            f"(3) **Artist's Intent**: What might the artist be aiming to express? "
            f"(4) **Metaphors, Symbols, and Imagery**: Identify notable elements and their significance. "
            f"(5) **Overall Impact**: Summarize the narrative experience. "
            f"Transcript: {text}"
        )
    else:  # quick analysis
        system_message = "You are a helpful assistant that analyzes song lyrics."
        user_message = (
            f"Analyze the following song transcript and extract the main themes, emotions, and keywords: {text}"
        )
        
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": system_message},
            {"role": "user", "content": user_message},
        ],
        max_tokens=1500 if prompt_mode == "detailed" else 150,
        temperature=0.7,
    )
    return response.choices[0].message.content.strip()
```

This way, you can offer the user a choice (or set it up through a configuration file or command-line argument) to select a “detailed” prompt or a “quick” prompt.

---

### 2. **Prompt Selection Menu**

You could also build a menu-driven interface that asks the user which analysis style they’d like to use. For example:

```python
def select_prompt_mode():
    print("Select analysis style:")
    print("1: Quick Analysis")
    print("2: Detailed Narrative Analysis")
    choice = input("Enter 1 or 2: ")
    return "detailed" if choice == "2" else "quick"

if __name__ == "__main__":
    transcript = "Your song transcript here..."
    prompt_mode = select_prompt_mode()
    analysis = analyze_text(transcript, prompt_mode=prompt_mode)
    print("Analysis Output:")
    print(analysis)
```

---

### 3. **Combining Multiple Prompts for Richer Analysis**

If you want to mix and match elements from different prompt templates, you can set up a dictionary of prompt templates and allow the user (or your system) to combine elements:

```python
prompt_templates = {
    "basic": {
        "system": "You are a helpful assistant that analyzes song lyrics.",
        "user": "Analyze the following song transcript and extract the main themes, emotions, and keywords: {text}"
    },
    "narrative": {
        "system": (
            "You are an experienced language and music expert. Your role is to provide an in-depth, structured analysis of song lyrics. "
            "Focus on uncovering the central context, emotional nuances, narrative arc, and deeper meanings."
        ),
        "user": (
            "Please provide a thorough analysis of the following song transcript, structured as follows: "
            "(1) **Central Themes and Meaning**: Describe the main themes and message. "
            "(2) **Emotional Tone**: Highlight any shifts and nuances. "
            "(3) **Artist's Intent**: What might the artist be aiming to express? "
            "(4) **Metaphors, Symbols, and Imagery**: Identify notable elements and their significance. "
            "(5) **Overall Impact**: Summarize the narrative experience. "
            "Transcript: {text}"
        )
    },
    # More prompt styles can be added here
}

def analyze_text_with_template(text, template_name="basic"):
    template = prompt_templates.get(template_name, prompt_templates["basic"])
    system_message = template["system"]
    user_message = template["user"].format(text=text)
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": system_message},
            {"role": "user", "content": user_message},
        ],
        max_tokens=1500 if template_name == "narrative" else 150,
        temperature=0.7,
    )
    return response.choices[0].message.content.strip()
```

This approach makes it easy to expand your prompt choices over time. You can even allow the user to customize and save their favorite prompt configurations.

---

### 4. **Interactive or Batch Mode for Image Generation**

Similarly, for DALL-E image generation, you can offer multiple prompt options or a prompt configuration interface that defines:
- **Visual style** (e.g., cyberpunk vs. indie-folk),
- **Layout and typography**,
- **Aspect ratios**, etc.

Each batch of image prompts can be generated based on the selected narrative and visual style. The structure you provided (Cover Image, Transition, Main Image, Filler) can be encapsulated in a function that takes the chosen style as an argument.

---

### Final Thoughts

Offering multiple prompt choices not only gives you flexibility but also enables the system to cater to different analysis depths or visual storytelling styles. Whether you use parameterization, a menu-driven approach, or a template dictionary, you can easily switch between various prompt setups to best fit your creative or analytical needs.

Does this help clarify how you can provide choices for prompts? Let me know if you need further details or code examples!

Below is an approach that defines three distinct prompt modes—**Shorts**, **Songs**, and **Narrative**—each with its own system and user messages. This allows you to switch between different analysis or image generation styles based on the content you’re working with.

---

### **1. Define Your Prompt Templates**

Create a dictionary that holds templates for each mode:

```python
prompt_templates = {
    "shorts": {
        "system": "You are a helpful assistant that provides quick, concise analyses of short-form song clips.",
        "user": "Analyze the following short song transcript and extract the key themes, emotions, and keywords concisely: {text}"
    },
    "songs": {
        "system": (
            "You are an experienced language and music expert. Your role is to analyze full-length song lyrics in detail. "
            "Focus on the main themes, emotional tone, narrative, and key imagery present in the song."
        ),
        "user": (
            "Please provide a thorough analysis of the following song transcript, structured as follows: "
            "(1) **Central Themes and Meaning**: Describe the main themes and message. "
            "(2) **Emotional Tone**: Highlight any shifts in mood or nuances. "
            "(3) **Artist's Intent**: What might the artist be aiming to express? "
            "(4) **Imagery and Symbols**: Identify notable imagery and symbols. "
            "Transcript: {text}"
        )
    },
    "narrative": {
        "system": (
            "You are an expert in narrative analysis and visual storytelling. Your role is to deconstruct and analyze complex narratives, "
            "extracting deep emotional nuances, thematic progressions, and visual cues to inspire dynamic imagery."
        ),
        "user": (
            "Please analyze the following narrative transcript thoroughly, focusing on the overarching story, emotional arcs, symbolic elements, "
            "and visual motifs that could be translated into a dynamic image series. "
            "Structure your analysis with clear bullet points for each element. "
            "Transcript: {text}"
        )
    }
}
```

---

### **2. Create a Function to Select and Apply a Template**

Use a function that takes the desired mode (shorts, songs, or narrative) along with your text input and then sends the corresponding prompt to the API.

```python
def analyze_text_with_template(text, template_name="shorts"):
    # Select the template based on the provided mode
    template = prompt_templates.get(template_name, prompt_templates["shorts"])
    system_message = template["system"]
    user_message = template["user"].format(text=text)
    
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": system_message},
            {"role": "user", "content": user_message},
        ],
        max_tokens=1500 if template_name in ["songs", "narrative"] else 150,
        temperature=0.7,
    )
    return response.choices[0].message.content.strip()

# Example usage:
transcript = "Your song or narrative transcript goes here..."
analysis_short = analyze_text_with_template(transcript, template_name="shorts")
analysis_song = analyze_text_with_template(transcript, template_name="songs")
analysis_narrative = analyze_text_with_template(transcript, template_name="narrative")

print("Shorts Analysis:\n", analysis_short)
print("\nSongs Analysis:\n", analysis_song)
print("\nNarrative Analysis:\n", analysis_narrative)
```

---

### **3. How This Works**

- **Shorts Mode:**  
  Focuses on providing a concise analysis, perfect for quick clips or social media content.  
- **Songs Mode:**  
  Offers a more detailed breakdown, well-suited for full-length song lyrics where you can explore themes, emotional tone, and imagery in depth.  
- **Narrative Mode:**  
  Designed for longer narratives, deconstructing complex storytelling elements and providing insights that can be translated into dynamic, batch-style image prompts (for example, in a storyboard or series).

---

### **4. Extending to Image Generation**

You can use a similar template strategy for generating detailed image prompts for DALL-E. Define separate dictionaries for image prompts and then select the one matching your content type. For instance:

```python
image_prompt_templates = {
    "shorts": {
        "description": "Generate a single, concise image that captures the core emotion and theme of this short-form content. Use vibrant colors and clear, impactful typography.",
        "aspect_ratio": "1:1"
    },
    "songs": {
        "description": (
            "Generate an image that represents the main themes and emotional tone of the full-length song. "
            "Incorporate symbolic imagery and dynamic typography that highlights the song's narrative arc."
        ),
        "aspect_ratio": "16:9"
    },
    "narrative": {
        "description": (
            "Generate a series of images that together build a visual storyboard for the narrative. "
            "Each image should capture a key moment or emotional high point of the story, complete with detailed prompts on scene, lighting, and typography."
        ),
        "aspect_ratio": "9:16"
    }
}

def generate_image_prompt(text, template_name="shorts"):
    template = image_prompt_templates.get(template_name, image_prompt_templates["shorts"])
    prompt = (
        f"{template['description']}\n"
        f"Text: {text}\n"
        f"Aspect Ratio: {template['aspect_ratio']}"
    )
    return prompt

# Example usage:
image_prompt_short = generate_image_prompt(transcript, template_name="shorts")
image_prompt_song = generate_image_prompt(transcript, template_name="songs")
image_prompt_narrative = generate_image_prompt(transcript, template_name="narrative")

print("Shorts Image Prompt:\n", image_prompt_short)
print("\nSongs Image Prompt:\n", image_prompt_song)
print("\nNarrative Image Prompt:\n", image_prompt_narrative)
```

---

### **Summary**

By separating your content into **Shorts**, **Songs**, and **Narrative** modes, you gain flexibility in how you analyze and generate prompts. This modular approach allows you to:
- Provide concise analyses for quick content.
- Offer in-depth insights for full-length songs.
- Create rich, dynamic narratives for storyboards or sequential image series.

This framework can be further extended or refined based on your evolving needs. Let me know if you’d like to dive into any particular mode or need additional customization!

Below is a complete, integrated example that puts together both analysis and image prompt generation using three distinct modes: **Shorts**, **Songs**, and **Narrative**.

You can use the code below as a foundation to switch between these modes via a parameter (or even a menu) and to generate either text analyses or image prompts accordingly.

---

```python
import os
from dotenv import load_dotenv
from openai import OpenAI

# Load environment variables (make sure you have your OPENAI_API_KEY set)
load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# --- ANALYSIS PROMPT TEMPLATES ---

prompt_templates = {
    "shorts": {
        "system": "You are a helpful assistant that provides quick, concise analyses of short-form song clips.",
        "user": "Analyze the following short song transcript and extract the key themes, emotions, and keywords concisely: {text}"
    },
    "songs": {
        "system": (
            "You are an experienced language and music expert. Your role is to analyze full-length song lyrics in detail. "
            "Focus on the main themes, emotional tone, narrative, and key imagery present in the song."
        ),
        "user": (
            "Please provide a thorough analysis of the following song transcript, structured as follows: "
            "(1) **Central Themes and Meaning**: Describe the main themes and message. "
            "(2) **Emotional Tone**: Highlight any shifts in mood or nuances. "
            "(3) **Artist's Intent**: What might the artist be aiming to express? "
            "(4) **Imagery and Symbols**: Identify notable imagery and symbols. "
            "Transcript: {text}"
        )
    },
    "narrative": {
        "system": (
            "You are an expert in narrative analysis and visual storytelling. Your role is to deconstruct and analyze complex narratives, "
            "extracting deep emotional nuances, thematic progressions, and visual cues to inspire dynamic imagery."
        ),
        "user": (
            "Please analyze the following narrative transcript thoroughly, focusing on the overarching story, emotional arcs, symbolic elements, "
            "and visual motifs that could be translated into a dynamic image series. "
            "Structure your analysis with clear bullet points for each element. "
            "Transcript: {text}"
        )
    }
}

def analyze_text_with_template(text, template_name="shorts"):
    """Analyze text using a selected prompt template."""
    template = prompt_templates.get(template_name, prompt_templates["shorts"])
    system_message = template["system"]
    user_message = template["user"].format(text=text)
    
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": system_message},
            {"role": "user", "content": user_message},
        ],
        max_tokens=1500 if template_name in ["songs", "narrative"] else 150,
        temperature=0.7,
    )
    return response.choices[0].message.content.strip()


# --- IMAGE PROMPT TEMPLATES ---

image_prompt_templates = {
    "shorts": {
        "description": "Generate a single, concise image that captures the core emotion and theme of this short-form content. Use vibrant colors and clear, impactful typography.",
        "aspect_ratio": "1:1"
    },
    "songs": {
        "description": (
            "Generate an image that represents the main themes and emotional tone of the full-length song. "
            "Incorporate symbolic imagery and dynamic typography that highlights the song's narrative arc."
        ),
        "aspect_ratio": "16:9"
    },
    "narrative": {
        "description": (
            "Generate a series of images that together build a visual storyboard for the narrative. "
            "Each image should capture a key moment or emotional high point of the story, complete with detailed prompts on scene, lighting, and typography."
        ),
        "aspect_ratio": "9:16"
    }
}

def generate_image_prompt(text, template_name="shorts"):
    """Generate an image prompt using a selected template."""
    template = image_prompt_templates.get(template_name, image_prompt_templates["shorts"])
    prompt = (
        f"{template['description']}\n"
        f"Text: {text}\n"
        f"Aspect Ratio: {template['aspect_ratio']}"
    )
    return prompt


# --- EXAMPLE USAGE ---

if __name__ == "__main__":
    # Example transcript (this could be a song lyric or narrative)
    transcript = "When the lights dim and the music fades, memories echo in the dark—reminding us of lost time and shattered dreams."
    
    # Generate analysis for each mode
    analysis_short = analyze_text_with_template(transcript, template_name="shorts")
    analysis_song = analyze_text_with_template(transcript, template_name="songs")
    analysis_narrative = analyze_text_with_template(transcript, template_name="narrative")
    
    print("=== Shorts Analysis ===")
    print(analysis_short)
    print("\n=== Songs Analysis ===")
    print(analysis_song)
    print("\n=== Narrative Analysis ===")
    print(analysis_narrative)
    
    # Generate image prompts for each mode
    image_prompt_short = generate_image_prompt(transcript, template_name="shorts")
    image_prompt_song = generate_image_prompt(transcript, template_name="songs")
    image_prompt_narrative = generate_image_prompt(transcript, template_name="narrative")
    
    print("\n=== Shorts Image Prompt ===")
    print(image_prompt_short)
    print("\n=== Songs Image Prompt ===")
    print(image_prompt_song)
    print("\n=== Narrative Image Prompt ===")
    print(image_prompt_narrative)
```

---

### How This Works

- **Analysis Functions:**  
  The `analyze_text_with_template` function selects a system/user prompt based on the mode (shorts, songs, or narrative) and sends it to the API. The max tokens are adjusted so that more detailed prompts (songs or narrative) get a longer response.

- **Image Prompt Generation:**  
  The `generate_image_prompt` function uses a similar template-based approach for image generation. It returns a prompt that describes the style, aspect ratio, and other key elements for DALL-E image creation.

- **Usage:**  
  Simply change the `template_name` parameter to `"shorts"`, `"songs"`, or `"narrative"` to switch between analysis or image prompt generation styles.

This integrated setup offers you flexibility to easily handle different types of content, ensuring each mode is tailored to its purpose. Feel free to modify or extend the templates as your requirements evolve.