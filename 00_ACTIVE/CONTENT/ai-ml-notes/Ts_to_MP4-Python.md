### 			Ts to MP4 - Python

To convert `.ts` video files to `.mp4` format, you can use a command-line tool called FFmpeg. It’s a powerful and widely-used application for processing multimedia files and streams. Here’s a step-by-step guide to help you convert your `.ts` files to `.mp4`:

### Install FFmpeg

1. **Install via Homebrew (macOS)**:

   - Open Terminal and enter the following command if you haven't installed FFmpeg:

     ```bash
     brew install ffmpeg
     ```

2. **Install on Linux**:

   - On Ubuntu or Debian-based systems, use:

     ```bash
     sudo apt update
     sudo apt install ffmpeg
     ```

3. **Install on Windows**:

   - Download the FFmpeg executable from the [official website](https://ffmpeg.org/download.html). Follow the instructions specific to Windows to install.

### Convert TS to MP4

Once you have FFmpeg installed, you can use the following commands to convert your files. Open Terminal (or Command Prompt) and execute the commands:

1. **Single File Conversion**:
   To convert a single `.ts` file to `.mp4`, use the following command:

   ```bash
   ffmpeg -i "/Volumes/DeVonDaTa/rawR/newRaWr/Double Penetration No Holes Spared Gay Porn Video - TheGay.com.ts" -c:v copy -c:a aac -strict experimental "/Volumes/DeVonDaTa/rawR/newRaWr/Double Penetration No Holes Spared Gay Porn Video - TheGay.com.mp4"
   ```

2. **Batch Conversion with a Loop**:
   To convert multiple files at once, you can use a shell script or loop directly in Terminal:

   ```bash
   for file in /Volumes/DeVonDaTa/rawR/newRaWr/*.ts; do
       ffmpeg -i "$file" -c:v copy -c:a aac -strict experimental "${file%.ts}.mp4"
   done
   ```

   This loop will:

   - Iterate over each `.ts` file in the specified directory.
   - Convert each file into the `.mp4` format without re-encoding the video stream (`-c:v copy`), using AAC for the audio codec (`-c:a aac`).

### Optional: Adjust the Conversion Command

If you need further customization, such as re-encoding with a specific bitrate, you may also adjust the command options:

```bash
ffmpeg -i "source.ts" -c:v libx264 -preset fast -crf 22 -c:a aac -b:a 192k "output.mp4"
```

- **libx264**: Encoder for H.264 video, ensuring widely compatible video output.
- **-preset fast**: Sets the encoding speed (adjustable from ultrafast to veryslow, balancing speed and quality).
- **-crf 22**: Constant Rate Factor for quality; lower numbers mean better quality.

These steps should effectively convert your `.ts` files to `.mp4` while maintaining quality. Let me know if you have any specific requirements or run into issues!