# Audio/Video Transcription and Analysis Tool

A comprehensive Python tool that converts MP4 videos to MP3, transcribes audio with timestamps, and provides AI-powered analysis using GPT-4o.

## Features

- **MP4 to MP3 Conversion**: Automatically converts MP4 videos to MP3 audio
- **Timestamped Transcription**: Uses OpenAI Whisper for accurate transcription with timestamps
- **AI Analysis**: Leverages GPT-4o for comprehensive transcript analysis
- **Organized Output**: Creates structured folders with all generated files
- **Batch Processing**: Process multiple files at once
- **Multiple Formats**: Supports both MP3 and MP4 input files

## Installation

1. **Clone or download this repository**
2. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up OpenAI API key**:
   - Add your OpenAI API key to your `~/.env` file:
     ```bash
     echo 'OPENAI_API_KEY=your_openai_api_key_here' >> ~/.env
     ```

## Usage

### Single File Processing

Process a single audio or video file:

```bash
python transcription_analyzer.py path/to/your/file.mp4
python transcription_analyzer.py path/to/your/file.mp3
```

### Batch Processing

Process all MP3 and MP4 files in a directory:

```bash
python batch_process.py path/to/directory/
```

## Output Structure

For each processed file, the tool creates a timestamped folder with the following structure:

```
filename_analysis_YYYYMMDD_HHMMSS/
├── transcripts/
│   ├── filename_transcript.txt          # Plain transcript
│   └── filename_timestamped.txt         # Transcript with timestamps
├── analysis/
│   └── filename_analysis.json           # GPT-4o analysis
├── audio/
│   └── filename.mp3                     # Converted audio (MP4 files only)
└── filename_summary.txt                 # Processing summary
```

## Analysis Features

The GPT-4o analysis includes:

1. **Summary**: Concise overview of main topics
2. **Key Points**: 5-7 most important insights
3. **Topics/Themes**: Main themes and subjects
4. **Sentiment**: Overall tone and emotional context
5. **Action Items**: Tasks, decisions, or next steps mentioned
6. **Questions Raised**: Important questions asked or unanswered
7. **Technical Terms**: Specialized vocabulary or concepts
8. **Duration Analysis**: Notable patterns in pacing or content

## Example Output

### Timestamped Transcript
```
[00:00 - 00:15] Welcome to today's meeting. We'll be discussing the quarterly results.
[00:15 - 00:30] First, let me go over our revenue numbers for Q3.
[00:30 - 00:45] We've seen a 15% increase compared to last quarter.
```

### Analysis JSON
```json
{
  "Summary": "Quarterly business review meeting covering Q3 financial results...",
  "Key Points": [
    "15% revenue increase in Q3",
    "New product launch planned for Q4",
    "Budget concerns raised by finance team"
  ],
  "Topics/Themes": ["Financial Results", "Product Development", "Budget Planning"],
  "Sentiment": "Generally positive with some concerns about budget constraints",
  "Action Items": [
    "Prepare detailed budget proposal",
    "Schedule product launch meeting",
    "Review Q4 projections"
  ]
}
```

## Requirements

- Python 3.8+
- OpenAI API key
- FFmpeg (for video processing)
- Sufficient disk space for audio conversion

## Troubleshooting

### Common Issues

1. **"OPENAI_API_KEY not found"**
   - Ensure your `~/.env` file exists and contains your API key
   - Check that the API key is properly formatted in your `~/.env` file

2. **"No module named 'whisper'"**
   - Run `pip install -r requirements.txt` to install all dependencies

3. **Video conversion errors**
   - Ensure FFmpeg is installed on your system
   - Check that the input video file is not corrupted

4. **Memory issues with large files**
   - Consider using a smaller Whisper model (change "base" to "tiny" in the code)
   - Process files individually rather than in batch

### Performance Tips

- For faster processing, use the "tiny" Whisper model for less accurate but faster transcription
- Process files individually for better error handling and memory management
- Ensure stable internet connection for OpenAI API calls

## License

This project is open source and available under the MIT License.

## Support

For issues or questions, please check the troubleshooting section above or create an issue in the repository.