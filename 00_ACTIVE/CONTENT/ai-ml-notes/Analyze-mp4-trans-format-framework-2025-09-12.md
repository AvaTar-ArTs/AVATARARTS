# Analyze and format framework

**Platform:** ChatGPT
**Exported:** 2025-09-12
**Messages:** 4

---

## 👤 Human

analyze and format

---

## 🤖 ChatGPT

import logging import os import sys from pathlib import Path import openai from dotenv import load_dotenv # Setup logging logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s") # Load environment variables env_path = Path("/Users/steven/.env") load_dotenv(dotenv_path=env_path) openai.api_key = os.getenv("OPENAI_API_KEY") # Base config config = {"base_dir": ""} if not config.get("base_dir"): base_dir_input = input("Enter base directory (leave blank for current): ").strip() config["base_dir"] = base_dir_input or os.getcwd() BASE_DIR = Path(config["base_dir"]).resolve() if not BASE_DIR.is_dir(): logging.error(f"Directory '{BASE_DIR}' does not exist. Exiting.") sys.exit(1) # Output directories TRANSCRIPT_DIR = BASE_DIR / "trans" ANALYSIS_DIR = BASE_DIR / "analysis" TRANSCRIPT_DIR.mkdir(parents=True, exist_ok=True) ANALYSIS_DIR.mkdir(parents=True, exist_ok=True) def format_timestamp(seconds: float) -> str: minutes = int(seconds // 60) secs = int(seconds % 60) return f"{minutes:02d}:{secs:02d}" def transcribe_audio(file_path: Path) -> str: """Transcribe MP4 using Whisper.""" with open(file_path, "rb") as audio_file: transcript_data = openai.Audio.transcribe("whisper-1", audio_file, response_format="verbose_json") return "\n".join( f"{format_timestamp(seg['start'])} -- {format_timestamp(seg['end'])}: {seg['text']}" for seg in transcript_data.segments ) def analyze_text(text: str, section_number: str) -> str: """Deep multimedia analysis with ChatGPT.""" response = openai.ChatCompletion.create( model="gpt-4o-mini", # upgrade model messages=[ {"role": "system", "content": "You are an expert in multimedia analysis and storytelling. Provide a highly detailed breakdown of themes, emotions, narrative, technical elements, and audience impact."}, {"role": "user", "content": f"Analyze section {section_number}:\n{text}"} ], max_tokens=1800, temperature=0.7, ) return response.choices[0].message.content.strip() def process_media_directory(media_dir: Path): """Process MP4s: transcribe + analyze.""" for file_path in media_dir.rglob("*.mp4"): filename_no_ext = file_path.stem logging.info(f"Transcribing {file_path.name}...") transcript = transcribe_audio(file_path) (TRANSCRIPT_DIR / f"{filename_no_ext}_transcript.txt").write_text(transcript) logging.info(f"Analyzing {file_path.name}...") analysis = analyze_text(transcript, filename_no_ext) (ANALYSIS_DIR / f"{filename_no_ext}_analysis.txt").write_text(analysis) logging.info(f"Completed {file_path.name}") if __name__ == "__main__": process_media_directory(BASE_DIR)

---

## 👤 Human

anything else you didn't exgtract?

---

## 🤖 ChatGPT

printf "file '%s'\n" \ '/Users/steven/Music/SUNO/8-1/…a48 (1).mp4' \ '/Users/steven/Music/SUNO/8-1/…a48.mp4' \ '/Users/steven/Music/SUNO/8-1/…2ea3 (1).mp4' \ … \ > /Users/steven/Music/SUNO/8-1/list.txt

