# Hazel Folder Management Rules and Tips

## User

sorry.. lets me clarify. for the best rules to set for hazel https://www.noodlesoft.com/manual/hazel/hazel-overview/ || or any suggestions you have to offer.. folder management.

---

## Assistant

**Thought for 27 seconds**

### Thought Process

> Alright, let's tackle this. The user wants the best rules to set up in Hazel for folder management, based on the provided user guide. Since I'm new to Hazel, I'll need to go through the manual carefully to understand its capabilities and then come up with effective rules.
> 
> First, I need to understand what Hazel can do. From the overview, Hazel automates file management using rules based on conditions and actions. The key areas are Folders & Rules and Trash Management. The user is asking for folder management suggestions, so focusing on organizing files into appropriate folders, cleaning up old files, handling duplicates, and maybe integrating with other apps.
> 
> Looking at the examples in the manual, like moving images to the Pictures folder or deleting old files from Downloads, I can see that common use cases include sorting files by type, date, or other attributes. The user might also benefit from rules that handle renaming, tagging, or running scripts for more complex tasks.
> 
> I should consider typical pain points in folder management: cluttered Downloads or Desktop folders, old files taking up space, duplicate files, and unorganized documents. Hazel's rules can address these by automatically moving, renaming, or deleting files based on set criteria.
> 
> Possible rule ideas:
> 1. **Automatically sort downloaded files** (e.g., images to Pictures, documents to Documents).
> 2. **Delete old files** from Downloads or other folders after a certain period.
> 3. **Tag files based on content** for easier searching.
> 4. **Handle duplicates** by moving them to Trash or a specific folder.
> 5. **Rename files** consistently using patterns (e.g., adding dates).
> 6. **Integrate with apps** like Photos or Music to import media automatically.
> 7. **Clean up Trash** automatically with Hazel's Trash Management features.
> 
> I need to ensure the rules are ordered correctly since Hazel processes them sequentially. Also, using preview features to test rules before full implementation is important to avoid unintended file movements.
> 
> Potential issues to watch out for:
> - Rules conflicting with each other.
> - Accidental deletion of files.
> - Ensuring proper folder paths and permissions.
> 
> Now, structuring these thoughts into actionable rules with clear conditions and actions, referencing the manual's sections on creating rules, using attributes, and setting up actions like move, rename, delete, etc.

Based on the Hazel User Guide, here are **10 powerful rules** to optimize folder management, along with implementation steps:

---

### **1. Auto-Sort Downloads by File Type**
- **Conditions**:  
  - `Kind` is `Image` / `Document` / `Movie` / `Music`  
- **Actions**:  
  - `Move` to `Pictures`, `Documents`, `Movies`, or `Music` folder.  
  - *Bonus*: Add a `Tag` like "Sorted" for tracking.

---

### **2. Delete Old Files from Downloads**
- **Conditions**:  
  - `Date Added` is not in the last `30 days`  
  - `Kind` is not `Folder` (to avoid deleting active project folders)  
- **Actions**:  
  - `Move to Trash`.

---

### **3. Auto-Rename Screenshots**  
- **Conditions**:  
  - `Name` contains "Screen Shot"  
- **Actions**:  
  - `Rename` to `Screenshot-YYYY-MM-DD` (use `Date Created` + `Counter`).  
  - Example: `Screenshot-2023-10-01-1.png`.

---

### **4. Archive Completed Projects**  
- **Conditions**:  
  - `Tags` contain "Complete"  
  - `Date Last Modified` is older than `1 week`  
- **Actions**:  
  - `Move` to `Archives` folder.  
  - `Compress` into a ZIP file.

---

### **5. Auto-Tag Financial Documents**  
- **Conditions**:  
  - `Contents` contain match `\b\d{3}-\d{2}-\d{4}\b` (SSN pattern)  
  - *or* `Name` contains "Invoice" / "Receipt"  
- **Actions**:  
  - `Add tag` "Finance".

---

### **6. Clean Up Duplicates**  
- **Conditions**:  
  - `Name` matches existing file in destination folder  
  - `Size` equals destination file  
- **Actions**:  
  - `Move to Trash` (or `Replace` if newer).

---

### **7. Auto-Import Photos**  
- **Conditions**:  
  - `Kind` is `Image`  
  - `Date Added` is `today`  
- **Actions**:  
  - `Import into Photos` app.  
  - `Delete original` (optional).

---

### **8. Smart Trash Management**  
- **Enable in Settings**:  
  - Delete files in Trash after `7 days`.  
  - Use **App Sweep** to remove app leftovers.  

---

### **9. Organize PDFs with OCR**  
- **Conditions**:  
  - `Kind` is `PDF`  
  - `Contents` is `blank` (unsearchable PDFs)  
- **Actions**:  
  - Run `AppleScript` to OCR with Preview/Nitro PDF.  
  - `Rename` to `OCRed-OriginalName.pdf`.

---

### **10. Weekly Desktop Cleanup**  
- **Conditions**:  
  - `Date Added` is older than `7 days`  
  - Folder is `Desktop`  
- **Actions**:  
  - `Move` to `Unsorted` folder.  
  - `Notify` via macOS Notification.

---

### **Pro Tips**  
1. **Order Matters**: Place "Ignore" rules first (e.g., ignore locked files).  
2. **Preview Rules**: Use `Preview Rule` (⌥⌘P) to test before enabling.  
3. **Sync Rules**: Share rules across devices via `Export/Import Rules`.  
4. **Use Subfolders**: Enable `Run rules on folder contents` for nested files.

For advanced workflows, combine with **Shortcuts** or **Shell Scripts** (e.g., watermarking images, converting file formats).  

Reference: [Hazel’s Action & Attribute Guide](https://www.noodlesoft.com/manual/hazel/attributes-actions/)

---

## User

lets do a script of some sort to downsize/downscale or whatever a large mp4/vid image filesize to under 200mb - without going below 'low' quality

---

## Assistant

**Thought for 0 seconds**

The server is busy. Please try again later.

---

## User

https://www.noodlesoft.com/manual/hazel/hazel-basics/about-folders-rules/

---

## Assistant

**Thought for 44 seconds**

### Thought Process

> Okay, the user is asking about the Hazel Basics section on Folders & Rules, specifically the URL they provided. Let me check the provided Hazel User Guide content again to make sure I cover everything accurately.
> 
> First, I need to recall the key points from the manual. The "About Folders & Rules" section explains how Hazel monitors folders and uses rules to automate file management. Rules consist of conditions and actions. Each folder can have multiple rules, and each rule can have multiple conditions and actions.
> 
> I should start by summarizing what folders and rules are in Hazel. Then explain the structure of a rule: conditions and actions. Maybe give examples of each. The user might be looking for a clear, step-by-step explanation, so breaking it down into sections would help.
> 
> Conditions can be based on attributes like name, date, kind, tags, etc. Actions include moving, renaming, tagging, running scripts, etc. It's important to mention that Hazel processes rules in order and only the first matching rule applies unless "Continue matching rules" is used.
> 
> Also, the user might benefit from an example rule to illustrate how it all comes together. The manual had an example with the "Pictures" rule moving images to the Pictures folder. Using that as an example would be good.
> 
> I should also highlight best practices, like ordering rules from specific to general, using preview mode, and syncing rules. Maybe mention nested conditions and subfolder processing as advanced features.
> 
> Wait, the user provided the Hazel User Guide content up to page 168. Let me double-check the pages related to Folders & Rules. Pages 22-25 discuss About Folders & Rules, including conditions, actions, and an example. Pages 38-57 cover creating and managing rules. 
> 
> I need to ensure that the explanation aligns with the manual's structure. Make sure to reference the anatomy of a simple rule from page 24, which includes Name, Conditions, Actions, and options like notes or OCR settings.
> 
> Also, the logic of rules on pages 45-47 is crucial. Explaining that Hazel stops at the first matching rule unless told to continue. Users might not realize the importance of rule order, so emphasizing that is key.
> 
> Including tips like using "Ignore" rules to exclude certain files, or how to use custom attributes for dynamic naming, could add value. Maybe mention the "Run rules on folder contents" action for processing subfolders.
> 
> I should avoid technical jargon where possible, but still be precise. The user might be a new Hazel user trying to understand the basics, so clarity is essential. Organizing the response into sections with headers would make it easier to follow.
> 
> Wait, the user provided the link to the Hazel Basics: About Folders & Rules page. My response should mirror the structure of that page but in a summarized, easy-to-digest format. Including key takeaways and practical examples would help the user grasp the concepts quickly.
> 
> Also, considering the user might have asked this after my previous answer with 10 rules, they might want a deeper understanding of how folders and rules work to create their own. So explaining the foundational concepts thoroughly is important.
> 
> I need to make sure not to repeat information from the previous answer but complement it by explaining the underlying principles. For instance, in the previous answer, I listed rules, and now the user wants to know how those rules are structured in Hazel.
> 
> Including references to specific pages from the manual could help, like mentioning where to find the Attribute Reference or how to use custom patterns. But since the user might not have the manual open, explaining those elements directly is better.
> 
> Alright, structuring the answer into sections: 1. What are Folders & Rules? 2. Anatomy of a Rule (Conditions, Actions), 3. Rule Logic, 4. Example Rule, 5. Best Practices. That should cover the essentials based on the manual content.

Here’s a concise breakdown of Hazel’s **Folders & Rules** system, based on the [official guide](https://www.noodlesoft.com/manual/hazel/hazel-basics/about-folders-rules/):

---

### **1. What Are Folders & Rules?**
- **Folders**: Directories Hazel monitors (e.g., Downloads, Desktop, or custom folders).  
- **Rules**: Automation workflows applied to files/folders in monitored locations.  
  - Each folder can have **multiple rules**.  
  - Rules run in **top-to-bottom order** (priority matters!).

---

### **2. Anatomy of a Rule**  
Every rule has two core components: **Conditions** and **Actions**.  

#### **Conditions**  
Define *what* to match. Examples:  
- **Attributes**: `Name`, `Kind`, `Date Added`, `Tags`, `Size`, `Contents` (text/OCR).  
- **Patterns**: Use regex-like syntax (e.g., `Name matches "Invoice-\d{4}.pdf"`).  
- **Logic**: Combine conditions with `All`, `Any`, or `None`.  

#### **Actions**  
Define *what to do* when conditions are met. Examples:  
- Move, Rename, Copy, Delete, Tag, Run Scripts, or Open in Apps.  
- Advanced: Sync to cloud, OCR PDFs, or trigger workflows via **Shortcuts/AppleScript**.  

---

### **3. Key Logic to Know**  
- **First Match Wins**: Hazel stops processing after the first matching rule (unless `Continue matching rules` is enabled).  
- **Subfolder Processing**: Use the `Run rules on folder contents` action to apply rules recursively.  
- **Custom Attributes**: Extract dynamic values (e.g., dates from filenames) for reuse in actions.  

---

### **4. Example Rule: Organize Invoices**  
```plaintext  
Name: "Sort Invoices"  
Conditions:  
  - Name contains "Invoice"  
  - Kind is PDF  
Actions:  
  - Move to folder: ~/Documents/Invoices  
  - Rename: "Invoice-YYYY-MM-DD.pdf" (using `Date Added`)  
  - Add tag: "Processed"  
```  

---

### **5. Best Practices**  
1. **Order Rules Strategically**: Place specific rules (e.g., "Ignore system files") before general ones.  
2. **Preview Before Enabling**: Test rules with `Preview Rule` (⌥⌘P) to avoid unintended actions.  
3. **Use Nested Conditions**: For complex logic (e.g., "If PDF **and** created in Q4 **or** tagged 'Urgent'").  
4. **Sync Rules**: Export/import rules across devices via `File > Export Rules`.  

---

### **Advanced Features**  
- **Smart Folders**: Monitor dynamic folders (e.g., Spotlight searches).  
- **Custom Scripts**: Integrate Python/Shell scripts for niche workflows.  
- **Error Handling**: Check logs (`Help > View Logs`) for debugging.  

For a deep dive, explore the [Attributes & Actions Reference](https://www.noodlesoft.com/manual/hazel/attributes-actions/).

---

## User

ok.. so im thinking about runnning something similar to Resolution Scaling with Aspect Ratio Preservation

Instead of forcing a 16:9 or 9:16 ratio, we calculate a scaled resolution based on each video’s original aspect ratio.
Videos with 1280x720 or smaller are left untouched unless they are too large in file size.
Compression Based on File Size

If >500MB → Compress to 40% of original size
If 200MB - 500MB → Compress to 50%
If 100MB - 200MB → Compress to 70%
If <100MB → Keep as close to original quality as possible
Automatic FPS Reduction for Larger Videos

If FPS > 60, drop to 30 FPS for big files.
If FPS is already ≤30, keep it unchanged.
 import os
import time
import subprocess

# Constants
MAX_LONGEST_SIDE = 1280  # Limit the longest side to this value while preserving aspect ratio
BATCH_SIZE = 5  # Number of videos processed before a pause
PAUSE_DURATION = 5  # Seconds to wait between batches
MIN_FILE_SIZE_MB = 100  # Ignore files smaller than this

# Function to calculate new resolution while keeping aspect ratio
def get_scaled_resolution(width, height):
    longest_side = max(width, height)
    if longest_side > MAX_LONGEST_SIDE:
        scale_factor = MAX_LONGEST_SIDE / longest_side
        new_width = int(width * scale_factor)
        new_height = int(height * scale_factor)
        return new_width, new_height
    return width, height  # Keep original size if already within limits

# Function to determine compression settings dynamically
def get_compression_settings(file_size_mb, width, height, fps):
    new_width, new_height = get_scaled_resolution(width, height)

    if file_size_mb > 500:  # Very large files → Reduce to ~40%
        crf = 30
        bitrate = "1000k"
        new_fps = min(fps, 30)  # Drop FPS to 30
    elif 200 < file_size_mb <= 500:  # Medium-large files → Reduce to ~50%
        crf = 28
        bitrate = "1500k"
        new_fps = min(fps, 30)
    elif 100 < file_size_mb <= 200:  # Small-medium files → Reduce to ~70%
        crf = 26
        bitrate = "2000k"
        new_fps = fps  # Keep original FPS
    else:  # Small files → Keep as close to original quality as possible
        crf = 23
        bitrate = "original"
        new_fps = fps

    return crf, bitrate, new_fps, new_width, new_height

# Function to get video resolution and FPS
def get_video_info(input_path):
    probe_cmd = [
        "ffprobe", "-v", "error", "-select_streams", "v:0",
        "-show_entries", "stream=width,height,r_frame_rate",
        "-of", "csv=p=0", input_path
    ]
    try:
        result = subprocess.run(probe_cmd, capture_output=True, text=True, check=True)
        width, height, fps = result.stdout.strip().split(",")
        return int(width), int(height), eval(fps)
    except Exception as e:
        print(f"⚠️ Error getting video info: {e}")
        return None, None, None

# Function to compress video while maintaining aspect ratio
def compress_video(input_path, output_path):
    file_size_mb = os.path.getsize(input_path) / (1024 ** 2)

    # Get original resolution & FPS
    width, height, fps = get_video_info(input_path)
    if width is None or height is None:
        print(f"⚠️ Skipping {input_path} (Unable to retrieve video info)")
        return False

    # Get dynamic compression settings
    crf, bitrate, new_fps, new_width, new_height = get_compression_settings(file_size_mb, width, height, fps)

    # Build FFmpeg command
    ffmpeg_cmd = [
        "ffmpeg", "-i", input_path,
        "-vf", f"scale={new_width}:{new_height}",
        "-c:v", "libx264", "-crf", str(crf),
        "-preset", "fast",
        "-b:v", bitrate if bitrate != "original" else "2000k",
        "-c:a", "aac", "-b:a", "96k",
        "-y", output_path
    ]

    # Adjust FPS if needed
    if new_fps != fps:
        ffmpeg_cmd.extend(["-r", str(new_fps)])

    print(f"🔄 Compressing {os.path.basename(input_path)} (Original: {file_size_mb:.2f} MB, CRF: {crf}, FPS: {new_fps}, Bitrate: {bitrate}, New Size: {new_width}x{new_height})")
    
    try:
        subprocess.run(ffmpeg_cmd, check=True)
        return True
    except Exception as e:
        print(f"⚠️ Error compressing {input_path}: {e}")
        return False

# Function to process a batch of videos
def process_batch(batch, root):
    for file in batch:
        file_path = os.path.join(root, file)
        file_size_mb = os.path.getsize(file_path) / (1024 ** 2)

        # Skip small files
        if file_size_mb < MIN_FILE_SIZE_MB:
            print(f"⚠️ Skipping {file} (Size: {file_size_mb:.2f} MB)")
            continue

        output_path = os.path.join(root, f"compressed_{file}")

        if compress_video(file_path, output_path):
            os.remove(file_path)
            os.rename(output_path, file_path)
            print(f"✅ Successfully compressed {file} (Original: {file_size_mb:.2f} MB)")

# Function to scan and process videos in a folder
def process_videos(source_directory):
    batch = []

    for root, _, files in os.walk(source_directory):
        for file in files:
            if file.lower().endswith(".mp4"):
                batch.append(file)
                if len(batch) >= BATCH_SIZE:
                    print(f"🔄 Processing batch of {BATCH_SIZE} videos in {root}...")
                    process_batch(batch, root)
                    batch = []
                    print(f"⏸️ Pausing for {PAUSE_DURATION} seconds...")
                    time.sleep(PAUSE_DURATION)

        if batch:
            print(f"🔄 Processing remaining {len(batch)} videos in {root}...")
            process_batch(batch, root)
            batch = []

# Main function
def main():
    source_directory = input("Enter the path to the folder with videos: ").strip()
    if not os.path.isdir(source_directory):
        print("❌ Source directory does not exist.")
        return

    process_videos(source_directory)
    print("🎉 All videos processed successfully!")

if __name__ == "__main__":
    main()

---

## Assistant

**Thought for 0 seconds**

The server is busy. Please try again later.