# Miniforge/Mamba Environment Analysis

## Summary

- **pythons directory:** 354 unique modules
- **pythons-sort directory:** 340 unique modules
- **Combined:** 370 unique modules

## Top Modules Found

### pythons
- `00_shared_libraries`
- `AI_ORCHESTRATOR_ULTIMATE`
- `ASCII`
- `IPython`
- `ImageCreator`
- `InquirerPy`
- `InstagramAPI`
- `OpenSSL`
- `PIL`
- `PrNdOwN`
- `PyPDF2`
- `PyQt5`
- `Python_Duplicate_Cleaner`
- `RedditScrape`
- `Smart_Duplicate_Cleaner`
- `TTS`
- `TextToSpeech`
- `TikTokAPI`
- `UNIFIED_CONTENT_ORCHESTRATOR`
- `VideoEdit`
- `__future__`
- `_ssl`
- `abc`
- `about`
- `ace_tools`
- `advanced_toolkit`
- `agents`
- `aiohttp`
- `anthropic`
- `apiclient`

### pythons-sort
- `00_shared_libraries`
- `AI_ORCHESTRATOR_ULTIMATE`
- `ASCII`
- `IPython`
- `ImageCreator`
- `InquirerPy`
- `InstagramAPI`
- `OpenSSL`
- `PIL`
- `PrNdOwN`
- `PyPDF2`
- `PyQt5`
- `RedditScrape`
- `TTS`
- `TextToSpeech`
- `TikTokAPI`
- `UNIFIED_CONTENT_ORCHESTRATOR`
- `VideoEdit`
- `__future__`
- `_ssl`
- `abc`
- `about`
- `advanced_toolkit`
- `agents`
- `aiohttp`
- `anthropic`
- `apiclient`
- `argparse`
- `art`
- `assemblyai`

### Combined
- `00_shared_libraries`
- `AI_ORCHESTRATOR_ULTIMATE`
- `ASCII`
- `ConfigParser`
- `HTMLParser`
- `IPython`
- `ImageCreator`
- `InquirerPy`
- `InstagramAPI`
- `OTHER`
- `OpenSSL`
- `PIL`
- `PrNdOwN`
- `PyPDF2`
- `PyQt5`
- `Python_Duplicate_Cleaner`
- `RedditScrape`
- `Smart_Duplicate_Cleaner`
- `Sphinx`
- `TTS`
- `TextToSpeech`
- `TikTokAPI`
- `UNIFIED_CONTENT_ORCHESTRATOR`
- `VideoEdit`
- `__future__`
- `_ssl`
- `abc`
- `about`
- `ace_tools`
- `advanced_toolkit`
- `agents`
- `aiohttp`
- `anthropic`
- `apiclient`
- `argparse`
- `art`
- `assemblyai`
- `ast`
- `async_lru`
- `asyncio`
- `atexit`
- `attr`
- `audio_chunker`
- `audio_transcriber`
- `audiocraft`
- `autodownloader`
- `backoff`
- `backup_system`
- `bark`
- `base64`

## Installation Instructions

```bash
# Install Miniforge (includes mamba)
brew install miniforge
# or download from: https://github.com/conda-forge/miniforge

# Create environments
mamba env create -f pythons_environment.yml
mamba env create -f pythons_sort_environment.yml
mamba env create -f combined_environment.yml

# Activate environment
mamba activate pythons
# or
conda activate pythons
```
