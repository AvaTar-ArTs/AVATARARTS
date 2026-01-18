#!/bin/bash

# Automation Resources Extraction Script
# This script extracts all .zip files and organizes them into categories

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Current directory
AUTOMATIONS_DIR="/Users/steven/AVATARARTS/Automations"
cd "$AUTOMATIONS_DIR" || exit 1

echo -e "${BLUE}================================================${NC}"
echo -e "${BLUE}  Automation Resources Extraction Script${NC}"
echo -e "${BLUE}================================================${NC}"
echo ""

# Create organized directory structure
echo -e "${YELLOW}Creating organized directories...${NC}"
mkdir -p NotebookLM
mkdir -p YouTube
mkdir -p ContentGeneration/{Podcasts,Videos,Comics}
mkdir -p MCP-Servers
mkdir -p Research
mkdir -p LLM-Tools
mkdir -p Archives

echo -e "${GREEN}✓ Directories created${NC}"
echo ""

# Function to extract and move
extract_and_move() {
    local zip_file="$1"
    local target_dir="$2"
    local category="$3"

    if [ -f "$zip_file" ]; then
        echo -e "${YELLOW}Extracting: $zip_file${NC}"

        # Extract to temporary location
        unzip -q "$zip_file" -d "$target_dir"

        # Move zip to Archives
        mv "$zip_file" Archives/

        echo -e "${GREEN}✓ Extracted to: $target_dir${NC}"
        return 0
    else
        echo -e "${RED}✗ Not found: $zip_file${NC}"
        return 1
    fi
}

# Counter for statistics
total_files=0
extracted_files=0
skipped_files=0

# NotebookLM Projects
echo -e "${BLUE}[1/8] Extracting NotebookLM Projects...${NC}"
notebooklm_files=(
    "notebooklm-mcp-main.zip"
    "notebooklm-mcp-secure-main.zip"
    "automated-notebooklm-main.zip"
    "Local-NotebookLM-main.zip"
    "notebooklm-py-main.zip"
    "notebookllama-main.zip"
    "notebooklm-kit-main.zip"
    "notebooklm-anki-extension-main.zip"
    "notebooklm-categorizer-main.zip"
    "notebookLM-citation-main.zip"
    "NotebookLM-Examples-main.zip"
    "notebooklm-latex-renderer-main.zip"
    "notebooklm-skill-master.zip"
    "notebook-cat-main.zip"
    "notebooklm_exporter-main.zip"
    "NotebookLM_Youtube_Automator-main.zip"
    "open-notebookllm-master.zip"
    "NotebookLM_JulianGoldie_Notes_Bundle.zip"
)

for file in "${notebooklm_files[@]}"; do
    total_files=$((total_files + 1))
    if extract_and_move "$file" "NotebookLM" "NotebookLM"; then
        extracted_files=$((extracted_files + 1))
    else
        skipped_files=$((skipped_files + 1))
    fi
done
echo ""

# YouTube Projects
echo -e "${BLUE}[2/8] Extracting YouTube Projects...${NC}"
youtube_files=(
    "youtube-bot-main.zip"
    "youtube-enhancer_merged_deduped.zip"
)

for file in "${youtube_files[@]}"; do
    total_files=$((total_files + 1))
    if extract_and_move "$file" "YouTube" "YouTube"; then
        extracted_files=$((extracted_files + 1))
    else
        skipped_files=$((skipped_files + 1))
    fi
done
echo ""

# Podcast Projects
echo -e "${BLUE}[3/8] Extracting Podcast Projects...${NC}"
podcast_files=(
    "AI-podcast-generator-main.zip"
    "DIY-Podcast-Generator-main.zip"
    "podcastfy-main.zip"
    "tiny-openai-whisper-api-main.zip"
)

for file in "${podcast_files[@]}"; do
    total_files=$((total_files + 1))
    if extract_and_move "$file" "ContentGeneration/Podcasts" "Podcasts"; then
        extracted_files=$((extracted_files + 1))
    else
        skipped_files=$((skipped_files + 1))
    fi
done
echo ""

# Video Projects
echo -e "${BLUE}[4/8] Extracting Video Projects...${NC}"
video_files=(
    "open-video-overview-main.zip"
    "vidgen-main.zip"
    "Simli_NotebookLM-main.zip"
    "Ethical_Hacking_Video_Course-main.zip"
)

for file in "${video_files[@]}"; do
    total_files=$((total_files + 1))
    if extract_and_move "$file" "ContentGeneration/Videos" "Videos"; then
        extracted_files=$((extracted_files + 1))
    else
        skipped_files=$((skipped_files + 1))
    fi
done
echo ""

# Comic Projects
echo -e "${BLUE}[5/8] Extracting Comic Projects...${NC}"
comic_files=(
    "ComicBook-AI-main.zip"
    "Comicfy.ai-main.zip"
    "comics_generator-master.zip"
    "cobber-ml-synthesizer-main.zip"
)

for file in "${comic_files[@]}"; do
    total_files=$((total_files + 1))
    if extract_and_move "$file" "ContentGeneration/Comics" "Comics"; then
        extracted_files=$((extracted_files + 1))
    else
        skipped_files=$((skipped_files + 1))
    fi
done
echo ""

# MCP Servers
echo -e "${BLUE}[6/8] Extracting MCP Servers...${NC}"
mcp_files=(
    "sunova-mcp-main.zip"
    "skill-main.zip"
)

for file in "${mcp_files[@]}"; do
    total_files=$((total_files + 1))
    if extract_and_move "$file" "MCP-Servers" "MCP"; then
        extracted_files=$((extracted_files + 1))
    else
        skipped_files=$((skipped_files + 1))
    fi
done
echo ""

# Research & Knowledge Tools
echo -e "${BLUE}[7/8] Extracting Research Tools...${NC}"
research_files=(
    "knowledge-generator-main.zip"
    "KnowNote-main.zip"
    "auto-paper-digest-main.zip"
    "ainews-source-extractor-master.zip"
    "lyra-exporter-main.zip"
    "SurfSense-main.zip"
    "how-to-data-science-main.zip"
)

for file in "${research_files[@]}"; do
    total_files=$((total_files + 1))
    if extract_and_move "$file" "Research" "Research"; then
        extracted_files=$((extracted_files + 1))
    else
        skipped_files=$((skipped_files + 1))
    fi
done
echo ""

# LLM Tools
echo -e "${BLUE}[8/8] Extracting LLM Tools...${NC}"
llm_files=(
    "Awesome-LLM-main.zip"
    "axolotl-main.zip"
    "self-hosted-ai-starter-kit-main.zip"
    "PageLM-main.zip"
    "insights-lm-public-main.zip"
    "OhOnePro-main.zip"
    "versatile_bot_project-main.zip"
    "whisperX-main.zip"
)

for file in "${llm_files[@]}"; do
    total_files=$((total_files + 1))
    if extract_and_move "$file" "LLM-Tools" "LLM"; then
        extracted_files=$((extracted_files + 1))
    else
        skipped_files=$((skipped_files + 1))
    fi
done
echo ""

# Other files (move to Archives without extracting)
echo -e "${BLUE}Moving other files to Archives...${NC}"
other_files=(
    "Offensive-Security-Forensics-Portfolio-v1.8.zip"
    "jobs_companies_resumes_MERGED.zip"
    "Google AI Studio-20251228T182143Z-3-001.zip"
    "Programming_Books-main.zip"
)

for file in "${other_files[@]}"; do
    if [ -f "$file" ]; then
        mv "$file" Archives/
        echo -e "${GREEN}✓ Moved to Archives: $file${NC}"
    fi
done
echo ""

# Move already extracted folders to appropriate directories
echo -e "${BLUE}Organizing already extracted folders...${NC}"

# Move notebooklm-youtube-skill-main if not already in NotebookLM
if [ -d "notebooklm-youtube-skill-main" ] && [ ! -d "NotebookLM/notebooklm-youtube-skill-main" ]; then
    mv notebooklm-youtube-skill-main NotebookLM/
    echo -e "${GREEN}✓ Moved: notebooklm-youtube-skill-main → NotebookLM/${NC}"
fi

# Move NotebookLM_JulianGoldie_Notes_Bundle if not already in NotebookLM
if [ -d "NotebookLM_JulianGoldie_Notes_Bundle" ] && [ ! -d "NotebookLM/NotebookLM_JulianGoldie_Notes_Bundle" ]; then
    mv NotebookLM_JulianGoldie_Notes_Bundle NotebookLM/
    echo -e "${GREEN}✓ Moved: NotebookLM_JulianGoldie_Notes_Bundle → NotebookLM/${NC}"
fi

# Move sunova-mcp-main if not already in MCP-Servers
if [ -d "sunova-mcp-main" ] && [ ! -d "MCP-Servers/sunova-mcp-main" ]; then
    mv sunova-mcp-main MCP-Servers/
    echo -e "${GREEN}✓ Moved: sunova-mcp-main → MCP-Servers/${NC}"
fi

# Move youtube-bot-main if not already in YouTube
if [ -d "youtube-bot-main" ] && [ ! -d "YouTube/youtube-bot-main" ]; then
    mv youtube-bot-main YouTube/
    echo -e "${GREEN}✓ Moved: youtube-bot-main → YouTube/${NC}"
fi

echo ""

# Summary
echo -e "${BLUE}================================================${NC}"
echo -e "${BLUE}  Extraction Complete!${NC}"
echo -e "${BLUE}================================================${NC}"
echo ""
echo -e "${GREEN}Total files processed: $total_files${NC}"
echo -e "${GREEN}Successfully extracted: $extracted_files${NC}"
echo -e "${YELLOW}Skipped (not found): $skipped_files${NC}"
echo ""

# Display new directory structure
echo -e "${BLUE}New directory structure:${NC}"
echo ""
tree -L 2 -d --dirsfirst || ls -lah
echo ""

echo -e "${GREEN}✓ All files extracted and organized!${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Review: cat AUTOMATION_RESOURCES_REVIEW.md"
echo "2. Quick Start: cat QUICK_START_GUIDE.md"
echo "3. Begin with: cd NotebookLM/notebooklm-youtube-skill-main"
echo ""
echo -e "${BLUE}Original .zip files have been moved to: Archives/${NC}"
