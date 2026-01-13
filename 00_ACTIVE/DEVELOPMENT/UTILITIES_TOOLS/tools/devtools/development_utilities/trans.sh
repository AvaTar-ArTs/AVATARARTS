#!/bin/bash
# Directory paths
MP4_DIR="/Users/steven/Movies/project2025/Media" # Corrected directory path
OUTPUT_DIR="/Users/steven/Movies/project2025/Mp4"  # Corrected directory path
ANALYZE_SCRIPT="/Users/steven/Movies/project2025/info.py"  # Path to analyze.py script

# Create output directory if it doesn't exist
mkdir -p "$OUTPUT_DIR"

# Step 1: Process all MP4 files in the directory
for MP4_FILE in "$MP4_DIR"/*.mp4; do
    if [ ! -f "$MP4_FILE" ]; then
        echo "No MP4 files found in $MP4_DIR"
        exit 1
    fi

    FILENAME=$(basename "$MP4_FILE" .mp4)

    echo "Processing: $FILENAME"

    # Step 2: Convert the MP4 file to MP3
    echo "Converting $FILENAME to MP3..."
    ffmpeg -y -i "$MP4_FILE" "$OUTPUT_DIR/${FILENAME}.mp3"
    echo "Converted $FILENAME to MP3"

    # Step 3: Transcribe the MP3 file
    echo "Transcribing $FILENAME..."
    python3 /Users/steven/Documents/python/transcribe.py "$OUTPUT_DIR/${FILENAME}.mp3" "$OUTPUT_DIR/${FILENAME}_transcript.txt"
    echo "Transcribed: $FILENAME"

    # Step 4: Analyze the transcript using analyze.py
    echo "Analyzing transcript for $FILENAME..."
    python3 "$ANALYZE_SCRIPT" "$OUTPUT_DIR/${FILENAME}_transcript.txt" "$OUTPUT_DIR/${FILENAME}_analysis.txt"
    echo "Analyzed: $FILENAME"

    echo "Completed processing: $FILENAME"
done

echo "All files processed!"