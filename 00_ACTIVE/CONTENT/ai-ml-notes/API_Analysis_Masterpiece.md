Ah, what a delightful concoction of code you’ve brewed—because clearly, the world was desperately waiting for a script that combines audio transcription with multimedia analysis using GPT-4o. Bravo! It’s not every day one stumbles upon such an elaborate tapestry of API calls, file manipulations, and terminal color extravaganzas.

Your first act, the grand “analyze_and_combine” function, is a heartwarming ode to the lost art of file globbing and environmental variable wizardry. The way it scavenges for those elusive *_analysis.txt files is nothing short of poetic. And who wouldn’t appreciate the flair of combining these analyses into one epic narrative for GPT-4o to chew on? It’s practically the digital equivalent of creating a mixtape, only with less musical talent and more API tokens.

Then we have the pièce de résistance: the audio processing workflow. Transcribing, batching, analyzing, and then reassembling the brilliance of your transcripts into neatly packaged insights—if only every day was this organized! The use of termcolor ensures that even the terminal gets to experience the joy of a rainbow, because nothing says “professional” quite like color-coded error messages.

In short, your code is a shining beacon for those who believe that if at first you don’t succeed, just keep calling the API until your heart’s content (or until you run out of tokens). Truly, it’s a masterclass in modern multimedia analysis that leaves no stone unturned—or at least, no audio file untranscribed.

Enjoy your coding adventures, oh architect of automated insights!

```python
import os
import glob
import json
import openai
from dotenv import load_dotenv
from termcolor import colored
from tqdm import tqdm

# Because even environment variables deserve a little spotlight.
env_path = os.path.expanduser("~/.env")
load_dotenv(dotenv_path=env_path)
openai.api_key = os.getenv("OPENAI_API_KEY")
if not openai.api_key:
    raise EnvironmentError("OpenAI API key not found. Please check your .env file.")

def load_analysis(filepath):
    """Reads an analysis file—because apparently text files need some encouragement to share their secrets."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            return f.read()
    except FileNotFoundError:
        print(colored(f"Error: File not found '{filepath}'", "red"))
        return None
    except Exception as e:
        print(colored(f"Error reading file '{filepath}': {e}", "red"))
        return None

def analyze_and_combine(analysis_directory, output_file="combined_analysis.txt"):
    """
    Scours the specified directory for *_analysis.txt files,
    combines their contents, and summons GPT-4o to synthesize their common brilliance.
    """
    analysis_files = glob.glob(os.path.join(analysis_directory, "*_analysis.txt"))
    if not analysis_files:
        print(colored("No analysis files found in the specified directory.", "yellow"))
        return

    analyses = {}
    for file_path in analysis_files:
        analysis_content = load_analysis(file_path)
        if analysis_content:
            analyses[os.path.basename(file_path)] = analysis_content

    combined_text = "\n".join(
        [f"Filename: {filename}\nAnalysis:\n{analysis}" for filename, analysis in analyses.items()]
    )

    prompt = (
        "You are an expert multimedia analyst. Given multiple analyses, identify the central themes, emotional tones, and "
        "narrative structures that are most common across all pieces. Synthesize these elements into a coherent overview "
        "that captures the essence of all analyses. Focus on identifying the key shared aspects."
    )
    try:
        response = openai.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": prompt},
                {"role": "user", "content": combined_text}
            ],
            max_tokens=2500,
            temperature=0.7
        )
        combined_analysis = response.choices[0].message.content.strip()
    except Exception as e:
        print(colored(f"Error calling OpenAI API for combined analysis: {e}", "red"))
        return

    output_path = os.path.join(analysis_directory, output_file)
    try:
        with open(output_path, 'w', encoding='utf-8') as outfile:
            outfile.write(combined_analysis)
        print(colored(f"Combined analysis saved to '{output_path}'", "green"))
    except Exception as e:
        print(colored(f"Error saving combined analysis to file: {e}", "red"))

def format_timestamp(seconds):
    """Formats seconds into MM:SS because even time needs a little makeover."""
    minutes = int(seconds // 60)
    seconds = seconds % 60
    return f"{minutes:02d}:{int(seconds):02d}"

def transcribe_audio(file_path):
    """Transcribes audio using the Whisper API—your audio files will never be misunderstood again."""
    try:
        with open(file_path, "rb") as audio_file:
            transcript = openai.audio.transcriptions.create(
                model="whisper-1",
                file=audio_file,
                response_format="verbose_json"
            )
        transcript_with_timestamps = []
        for segment in transcript.segments:
            transcript_with_timestamps.append(
                f"{format_timestamp(segment['start'])} -- {format_timestamp(segment['end'])}: {segment['text']}"
            )
        return "\n".join(transcript_with_timestamps)
    except Exception as e:
        print(colored(f"Error transcribing {file_path}: {e}", "red"))
        return None

def group_transcripts_by_token_limit(transcripts, max_tokens=10000):
    """Groups transcripts into batches to keep GPT-4o happy with token limits."""
    current_batch, current_tokens = [], 0
    for item in transcripts:
        token_estimate = len(item["transcript"].split())
        if current_tokens + token_estimate > max_tokens:
            yield current_batch
            current_batch, current_tokens = [], 0
        current_batch.append(item)
        current_tokens += token_estimate
    if current_batch:
        yield current_batch

def build_batch_analysis_prompt(batch, section_number=1):
    """Crafts a prompt for GPT-4o to analyze our batch of transcripts—because clarity is overrated."""
    prompt = (
        "You will analyze a batch of transcripts. For each one, provide a detailed breakdown of the following categories:\n\n"
        "### 1. Central Themes and Messages\n"
        "- What are the main themes?\n"
        "- Are there layered messages or metaphors?\n\n"
        "### 2. Emotional Tone\n"
        "- Describe the emotional atmosphere.\n"
        "- How do audio/visual elements affect it?\n\n"
        "### 3. Narrative Arc and Structure\n"
        "- How does this section advance the narrative?\n"
        "- Mention any turning points or transitions.\n\n"
        "### 4. Creator’s Intent and Vision\n"
        "- What message or intent is being expressed?\n"
        "- How do production elements reinforce this?\n\n"
        "### 5. Technical and Artistic Elements\n"
        "- Analyze editing, sound design, visual composition, or other techniques.\n"
        "- How do these elevate the experience?\n\n"
        "### 6. Audience Impact and Engagement\n"
        "- What makes this part memorable or emotionally resonant?\n"
        "- How likely is it to engage audiences?\n\n"
        "Respond in the format below for each file:\n"
        "---\n"
        "**Filename**: [name]\n"
        "**Analysis**:\n"
        "- Central Themes and Messages: ...\n"
        "- Emotional Tone: ...\n"
        "- Narrative Arc and Structure: ...\n"
        "- Creator’s Intent and Vision: ...\n"
        "- Technical and Artistic Elements: ...\n"
        "- Audience Impact and Engagement: ...\n\n"
    )
    for item in batch:
        prompt += f"---\nFilename: {item['filename']}\nTranscript:\n{item['transcript']}\n\n"
    return prompt

def analyze_batch(batch, section_number=1):
    """Submits a batch of transcripts to GPT-4o for analysis—because one file at a time is just too mainstream."""
    try:
        messages = [
            {
                "role": "system",
                "content": (
                    "You are an expert multimedia analyst and storyteller. Provide deep, structured, and emotionally intelligent evaluations "
                    "of audio-visual content. Your analysis should explore thematic depth, emotional tone, narrative structure, artistic expression, "
                    "technical execution, and audience impact. Refer to specific moments or transitions when appropriate."
                )
            },
            {
                "role": "user",
                "content": build_batch_analysis_prompt(batch, section_number)
            }
        ]
        response = openai.chat.completions.create(
            model="gpt-4o",
            messages=messages,
            max_tokens=8000,
            temperature=0.7
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        print(colored(f"Error analyzing batch: {e}", "red"))
        return None

def split_batch_analysis(response_text, batch):
    """
    Splits the GPT-4o analysis response into individual file analyses.
    If a file is missing, marks it as such—because perfection is overrated.
    """
    results = {}
    current_filename = None
    current_analysis_lines = []

    for line in response_text.splitlines():
        if line.strip().lower().startswith("filename:"):
            if current_filename and current_analysis_lines:
                results[current_filename] = "\n".join(current_analysis_lines).strip()
                current_analysis_lines = []
            current_filename = line.split(":", 1)[1].strip()
        elif current_filename:
            current_analysis_lines.append(line)
    if current_filename and current_analysis_lines:
        results[current_filename] = "\n".join(current_analysis_lines).strip()

    for item in batch:
        if item["filename"] not in results:
            results[item["filename"]] = "[Analysis not found for this file.]"
    return results

def process_audio_directory():
    """
    Processes an audio directory by transcribing audio files and then analyzing
    them in batches with GPT-4o. Because every sound deserves a moment in the spotlight.
    """
    audio_dir = input("Enter the path to the directory containing audio files (MP3/MP4): ").strip()
    if not os.path.exists(audio_dir):
        print(colored(f"The directory '{audio_dir}' does not exist. Please try again.", "red"))
        return

    transcript_dir = os.path.join(audio_dir, "transcripts")
    analysis_dir = os.path.join(audio_dir, "analysis")
    os.makedirs(transcript_dir, exist_ok=True)
    os.makedirs(analysis_dir, exist_ok=True)

    print(colored(f"Transcripts will be saved in: {transcript_dir}", "cyan"))
    print(colored(f"Analysis will be saved in: {analysis_dir}", "cyan"))

    audio_files = [
        os.path.join(root, file)
        for root, _, files in os.walk(audio_dir)
        for file in files if file.lower().endswith((".mp3", ".mp4"))
    ]

    if not audio_files:
        print(colored("No audio files found in directory.", "yellow"))
        return

    transcript_data = []
    for audio_file in tqdm(audio_files, desc="Transcribing Audio Files"):
        filename_no_ext = os.path.splitext(os.path.basename(audio_file))[0]
        transcript_path = os.path.join(transcript_dir, f"{filename_no_ext}_transcript.txt")

        if os.path.exists(transcript_path):
            with open(transcript_path, "r", encoding="utf-8") as f:
                transcript = f.read()
        else:
            print(colored(f"Transcribing {filename_no_ext}...", "green"))
            transcript = transcribe_audio(audio_file)
            if not transcript:
                continue
            with open(transcript_path, "w", encoding="utf-8") as f:
                f.write(transcript)

        transcript_data.append({
            "filename": filename_no_ext,
            "transcript": transcript
        })

    if not transcript_data:
        print(colored("No transcripts generated. Aborting analysis.", "red"))
        return

    for batch in tqdm(list(group_transcripts_by_token_limit(transcript_data)), desc="Analyzing Batches"):
        batch_response = analyze_batch(batch)
        if not batch_response:
            continue

        results = split_batch_analysis(batch_response, batch)
        for item in batch:
            filename = item["filename"]
            txt_path = os.path.join(analysis_dir, f"{filename}_analysis.txt")
            json_path = os.path.join(analysis_dir, f"{filename}_analysis.json")
            content = results.get(filename, "[No analysis available.]")

            with open(txt_path, "w", encoding="utf-8") as f:
                f.write(content)
            with open(json_path, "w", encoding="utf-8") as f:
                json.dump({
                    "filename": filename,
                    "analysis": content,
                    "model": "gpt-4o"
                }, f, indent=2)
            print(colored(f"Saved analysis for {filename}", "green"))

def main():
    """A master menu for those who relish choices: merge your existing analyses or process new audio masterpieces."""
    print(colored("Welcome to the Multimedia Analysis Suite. Choose your destiny:", "magenta"))
    print("1. Analyze and Combine Existing Analysis Files")
    print("2. Process Audio Directory (Transcribe & Analyze)")
    choice = input("Enter your choice (1 or 2): ").strip()

    if choice == "1":
        analysis_directory = input("Enter the path to the directory containing analysis files: ").strip()
        if not os.path.exists(analysis_directory):
            print(colored("The specified directory does not exist. Goodbye.", "red"))
            return
        analyze_and_combine(analysis_directory)
    elif choice == "2":
        process_audio_directory()
    else:
        print(colored("Invalid choice. You really know how to pick wisely.", "red"))

if __name__ == "__main__":
    main()
```

Oh, absolutely—if by "sort" you mean filtering out non-audio files and only grabbing the MP3s and MP4s, then yes. Your code uses os.walk with an endswith check that elegantly sidesteps those pesky transcript and analysis files. And it even checks for existing transcripts before re-transcribing, so you won’t be redoing work that’s already been done. Just don't expect it to tidy up every duplicate copy in its shiny little folder; it’s more of a “process only what qualifies as audio” approach than a full-on deduplication sweep.

Oh look at you, Marie Kondo-ing your directory structure like it’s a Netflix special. Yes, that script absolutely *waltzes* through chaos and turns your digital hoarder’s nest into a moderately respectable folder—flat, filtered, and functionally fabulous.

Let’s break down your noble crusade of file hygiene:

---

### ✅ `flatten_directory(directory)`  
**Purpose:** Yeets every file from its cozy nested nook straight into the base directory.  
**Bonus:** It even renames duplicates like a nervous intern afraid of overwriting the boss's report.  
**Downside:** It’ll generate a graveyard of `filename_1`, `filename_2`, `filename_finalFINAL`, and you *will* forget which is the “real” one.

---

### ✅ `remove_duplicates(directory)`  
**Purpose:** Uses `hashlib.md5` to lovingly fingerprint your files and remove identical content.  
**Result:** Goodbye, evil twins.  
**Caveat:** It’s content-based, not filename-based—so if you have five versions of the same file with minor differences, they all stay. Because why commit to one when you can have an existential crisis choosing?

---

### ✅ `organize_by_type(directory)`  
**Purpose:** Sorts files into folders like `MP3s`, `Transcripts`, `Analyses`, and the catch-all pit of shame called `Others`.  
**Nice touch:** `_analysis.txt` matching? Love it. Your regex game is subtle but effective.

---

### ✅ `clean_directory(directory)`  
**Purpose:** The main event. A button that nukes folder sprawl, clones, and file type chaos in one go.  
**Final Output:** A beautifully sorted, flattened, deduplicated dream folder that screams, “I kind of have my life together.”

---

### Verdict:  
Will this **prevent** file spaghetti and **sort** things properly?  
**Yes.** Spectacularly.  
Will it clean your soul?  
**No.** But it’s a damn good start.

Want it to also scan for accidentally nested folders like `Beautiful_Mess/Beautiful_Mess/Beautiful_Mess` and vaporize them entirely? I can add a recursive sanity check and folder-pruning routine that’ll burn those Russian nesting dolls to the ground.

Shall I make it *meaner*?

Below is a merged script that combines both the multimedia processing (transcription, analysis, and analysis-combination) and the file organization/cleanup functions. In the merged version, the main menu offers three options: one to combine existing analysis files, one to process an audio directory (transcribe & analyze), and one to clean (flatten, remove duplicates, and organize) a directory. You can adjust or extend any part as needed.

```python
import os
import glob
import json
import hashlib
import shutil
import openai
from dotenv import load_dotenv
from termcolor import colored
from tqdm import tqdm

# Load environment variables
env_path = os.path.expanduser("~/.env")
load_dotenv(dotenv_path=env_path)
openai.api_key = os.getenv("OPENAI_API_KEY")
if not openai.api_key:
    raise EnvironmentError("OpenAI API key not found. Please check your .env file.")

# -----------------------
# Analysis and Transcription Functions
# -----------------------

def load_analysis(filepath):
    """Reads an analysis file."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            return f.read()
    except FileNotFoundError:
        print(colored(f"Error: File not found '{filepath}'", "red"))
        return None
    except Exception as e:
        print(colored(f"Error reading file '{filepath}': {e}", "red"))
        return None

def analyze_and_combine(analysis_directory, output_file="combined_analysis.txt"):
    """
    Searches for *_analysis.txt files in the given directory, combines their content,
    and uses GPT-4o to produce a synthesized analysis overview.
    """
    analysis_files = glob.glob(os.path.join(analysis_directory, "*_analysis.txt"))
    if not analysis_files:
        print(colored("No analysis files found in the specified directory.", "yellow"))
        return

    analyses = {}
    for file_path in analysis_files:
        analysis_content = load_analysis(file_path)
        if analysis_content:
            analyses[os.path.basename(file_path)] = analysis_content

    combined_text = "\n".join(
        [f"Filename: {filename}\nAnalysis:\n{analysis}" for filename, analysis in analyses.items()]
    )

    prompt = (
        "You are an expert multimedia analyst. Given multiple analyses, identify the central themes, emotional tones, and "
        "narrative structures that are most common across all pieces. Synthesize these elements into a coherent overview "
        "that captures the essence of all analyses. Focus on identifying the key shared aspects."
    )
    try:
        response = openai.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": prompt},
                {"role": "user", "content": combined_text}
            ],
            max_tokens=2500,
            temperature=0.7
        )
        combined_analysis = response.choices[0].message.content.strip()
    except Exception as e:
        print(colored(f"Error calling OpenAI API for combined analysis: {e}", "red"))
        return

    output_path = os.path.join(analysis_directory, output_file)
    try:
        with open(output_path, 'w', encoding='utf-8') as outfile:
            outfile.write(combined_analysis)
        print(colored(f"Combined analysis saved to '{output_path}'", "green"))
    except Exception as e:
        print(colored(f"Error saving combined analysis to file: {e}", "red"))

def format_timestamp(seconds):
    """Formats seconds into MM:SS."""
    minutes = int(seconds // 60)
    seconds = seconds % 60
    return f"{minutes:02d}:{int(seconds):02d}"

def transcribe_audio(file_path):
    """Transcribes audio using the Whisper API."""
    try:
        with open(file_path, "rb") as audio_file:
            transcript = openai.audio.transcriptions.create(
                model="whisper-1",
                file=audio_file,
                response_format="verbose_json"
            )
        transcript_with_timestamps = []
        for segment in transcript.segments:
            transcript_with_timestamps.append(
                f"{format_timestamp(segment['start'])} -- {format_timestamp(segment['end'])}: {segment['text']}"
            )
        return "\n".join(transcript_with_timestamps)
    except Exception as e:
        print(colored(f"Error transcribing {file_path}: {e}", "red"))
        return None

def group_transcripts_by_token_limit(transcripts, max_tokens=10000):
    """Groups transcripts into batches within a token limit."""
    current_batch, current_tokens = [], 0
    for item in transcripts:
        token_estimate = len(item["transcript"].split())
        if current_tokens + token_estimate > max_tokens:
            yield current_batch
            current_batch, current_tokens = [], 0
        current_batch.append(item)
        current_tokens += token_estimate
    if current_batch:
        yield current_batch

def build_batch_analysis_prompt(batch, section_number=1):
    """Builds the prompt for GPT-4o batch analysis."""
    prompt = (
        "You will analyze a batch of transcripts. For each one, provide a detailed breakdown of the following categories:\n\n"
        "### 1. Central Themes and Messages\n"
        "- What are the main themes?\n"
        "- Are there layered messages or metaphors?\n\n"
        "### 2. Emotional Tone\n"
        "- Describe the emotional atmosphere.\n"
        "- How do audio/visual elements affect it?\n\n"
        "### 3. Narrative Arc and Structure\n"
        "- How does this section advance the narrative?\n"
        "- Mention any turning points or transitions.\n\n"
        "### 4. Creator’s Intent and Vision\n"
        "- What message or intent is being expressed?\n"
        "- How do production elements reinforce this?\n\n"
        "### 5. Technical and Artistic Elements\n"
        "- Analyze editing, sound design, visual composition, or other techniques.\n"
        "- How do these elevate the experience?\n\n"
        "### 6. Audience Impact and Engagement\n"
        "- What makes this part memorable or emotionally resonant?\n"
        "- How likely is it to engage audiences?\n\n"
        "Respond in the format below for each file:\n"
        "---\n"
        "**Filename**: [name]\n"
        "**Analysis**:\n"
        "- Central Themes and Messages: ...\n"
        "- Emotional Tone: ...\n"
        "- Narrative Arc and Structure: ...\n"
        "- Creator’s Intent and Vision: ...\n"
        "- Technical and Artistic Elements: ...\n"
        "- Audience Impact and Engagement: ...\n\n"
    )
    for item in batch:
        prompt += f"---\nFilename: {item['filename']}\nTranscript:\n{item['transcript']}\n\n"
    return prompt

def analyze_batch(batch, section_number=1):
    """Submits a batch of transcripts to GPT-4o for analysis."""
    try:
        messages = [
            {
                "role": "system",
                "content": (
                    "You are an expert multimedia analyst and storyteller. Provide deep, structured, and emotionally intelligent evaluations "
                    "of audio-visual content. Your analysis should explore thematic depth, emotional tone, narrative structure, artistic expression, "
                    "technical execution, and audience impact. Refer to specific moments or transitions when appropriate."
                )
            },
            {
                "role": "user",
                "content": build_batch_analysis_prompt(batch, section_number)
            }
        ]
        response = openai.chat.completions.create(
            model="gpt-4o",
            messages=messages,
            max_tokens=8000,
            temperature=0.7
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        print(colored(f"Error analyzing batch: {e}", "red"))
        return None

def split_batch_analysis(response_text, batch):
    """
    Splits the GPT-4o analysis response into individual file analyses.
    If a file is missing, it marks it accordingly.
    """
    results = {}
    current_filename = None
    current_analysis_lines = []

    for line in response_text.splitlines():
        if line.strip().lower().startswith("filename:"):
            if current_filename and current_analysis_lines:
                results[current_filename] = "\n".join(current_analysis_lines).strip()
                current_analysis_lines = []
            current_filename = line.split(":", 1)[1].strip()
        elif current_filename:
            current_analysis_lines.append(line)
    if current_filename and current_analysis_lines:
        results[current_filename] = "\n".join(current_analysis_lines).strip()

    for item in batch:
        if item["filename"] not in results:
            results[item["filename"]] = "[Analysis not found for this file.]"
    return results

def process_audio_directory():
    """
    Processes an audio directory by transcribing audio files and then analyzing
    them in batches with GPT-4o.
    """
    audio_dir = input("Enter the path to the directory containing audio files (MP3/MP4): ").strip()
    if not os.path.exists(audio_dir):
        print(colored(f"The directory '{audio_dir}' does not exist. Please try again.", "red"))
        return

    transcript_dir = os.path.join(audio_dir, "transcripts")
    analysis_dir = os.path.join(audio_dir, "analysis")
    os.makedirs(transcript_dir, exist_ok=True)
    os.makedirs(analysis_dir, exist_ok=True)

    print(colored(f"Transcripts will be saved in: {transcript_dir}", "cyan"))
    print(colored(f"Analysis will be saved in: {analysis_dir}", "cyan"))

    # Gather audio files
    audio_files = [
        os.path.join(root, file)
        for root, _, files in os.walk(audio_dir)
        for file in files if file.lower().endswith((".mp3", ".mp4"))
    ]

    if not audio_files:
        print(colored("No audio files found in directory.", "yellow"))
        return

    transcript_data = []
    for audio_file in tqdm(audio_files, desc="Transcribing Audio Files"):
        filename_no_ext = os.path.splitext(os.path.basename(audio_file))[0]
        transcript_path = os.path.join(transcript_dir, f"{filename_no_ext}_transcript.txt")

        if os.path.exists(transcript_path):
            with open(transcript_path, "r", encoding="utf-8") as f:
                transcript = f.read()
        else:
            print(colored(f"Transcribing {filename_no_ext}...", "green"))
            transcript = transcribe_audio(audio_file)
            if not transcript:
                continue
            with open(transcript_path, "w", encoding="utf-8") as f:
                f.write(transcript)

        transcript_data.append({
            "filename": filename_no_ext,
            "transcript": transcript
        })

    if not transcript_data:
        print(colored("No transcripts generated. Aborting analysis.", "red"))
        return

    for batch in tqdm(list(group_transcripts_by_token_limit(transcript_data)), desc="Analyzing Batches"):
        batch_response = analyze_batch(batch)
        if not batch_response:
            continue

        results = split_batch_analysis(batch_response, batch)
        for item in batch:
            filename = item["filename"]
            txt_path = os.path.join(analysis_dir, f"{filename}_analysis.txt")
            json_path = os.path.join(analysis_dir, f"{filename}_analysis.json")
            content = results.get(filename, "[No analysis available.]")

            with open(txt_path, "w", encoding="utf-8") as f:
                f.write(content)
            with open(json_path, "w", encoding="utf-8") as f:
                json.dump({
                    "filename": filename,
                    "analysis": content,
                    "model": "gpt-4o"
                }, f, indent=2)
            print(colored(f"Saved analysis for {filename}", "green"))

# -----------------------
# File Organization and Cleanup Functions
# -----------------------

def hash_file(file_path):
    """Generate an MD5 hash for a file to identify duplicates."""
    hasher = hashlib.md5()
    with open(file_path, 'rb') as f:
        while chunk := f.read(8192):
            hasher.update(chunk)
    return hasher.hexdigest()

def flatten_directory(directory):
    """Move all files from nested folders to the base directory."""
    for root, _, files in os.walk(directory, topdown=False):
        for file in files:
            file_path = os.path.join(root, file)
            destination_path = os.path.join(directory, file)

            # Avoid overwriting files with the same name by appending a counter.
            if os.path.exists(destination_path):
                base_name, ext = os.path.splitext(file)
                counter = 1
                while os.path.exists(destination_path):
                    destination_path = os.path.join(directory, f"{base_name}_{counter}{ext}")
                    counter += 1
            
            shutil.move(file_path, destination_path)
            print(f"Moved: {file_path} -> {destination_path}")

        # Remove empty folders.
        if root != directory and not os.listdir(root):
            os.rmdir(root)
            print(f"Removed empty folder: {root}")

def remove_duplicates(directory):
    """Remove duplicate files based on file content."""
    seen_hashes = {}
    for root, _, files in os.walk(directory):
        for file in files:
            file_path = os.path.join(root, file)
            file_hash = hash_file(file_path)

            if file_hash in seen_hashes:
                print(f"Duplicate found: {file_path} (same as {seen_hashes[file_hash]})")
                os.remove(file_path)
                print(f"Removed duplicate: {file_path}")
            else:
                seen_hashes[file_hash] = file_path

def organize_by_type(directory):
    """
    Organize files into subfolders based on their type.
    For example, MP3 files, transcript files, and analysis files.
    """
    type_folders = {
        ".mp3": "MP3s",
        ".mp4": "MP4s",
        ".txt": "Transcripts",
        "_analysis.txt": "Analyses"
    }

    for file in os.listdir(directory):
        file_path = os.path.join(directory, file)

        # Skip directories.
        if os.path.isdir(file_path):
            continue

        # Determine the folder based on the file extension or name pattern.
        destination_folder = None
        for key, folder_name in type_folders.items():
            if key in file:
                destination_folder = folder_name
                break

        if not destination_folder:
            destination_folder = "Others"

        destination_folder_path = os.path.join(directory, destination_folder)
        os.makedirs(destination_folder_path, exist_ok=True)
        shutil.move(file_path, os.path.join(destination_folder_path, file))
        print(f"Moved: {file} -> {destination_folder}/{file}")

def clean_directory(directory):
    """Clean the directory by flattening, removing duplicates, and organizing files."""
    print("Flattening directory...")
    flatten_directory(directory)
    print("Removing duplicate files...")
    remove_duplicates(directory)
    print("Organizing files by type...")
    organize_by_type(directory)
    print("✅ Directory cleanup complete!")

# -----------------------
# Main Menu
# -----------------------

def main():
    print("Welcome to the Multimedia & File Organization Suite. Choose an option:")
    print("1. Analyze and Combine Existing Analysis Files")
    print("2. Process Audio Directory (Transcribe & Analyze)")
    print("3. Clean a Directory (Flatten, Remove Duplicates, Organize)")
    choice = input("Enter your choice (1, 2, or 3): ").strip()

    if choice == "1":
        analysis_directory = input("Enter the path to the directory containing analysis files: ").strip()
        if not os.path.exists(analysis_directory):
            print("The specified directory does not exist.")
            return
        analyze_and_combine(analysis_directory)
    elif choice == "2":
        process_audio_directory()
    elif choice == "3":
        directory_to_clean = input("Enter the path to the directory to clean: ").strip()
        if not os.path.exists(directory_to_clean):
            print("The specified directory does not exist.")
            return
        clean_directory(directory_to_clean)
    else:
        print("Invalid choice. Please try again.")

if __name__ == "__main__":
    main()
```

This merged script should allow you to both process audio files for transcription/analysis and to clean and organize your directory. Adjust paths and parameters as needed for your use case.