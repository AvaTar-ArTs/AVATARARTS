"""
Audio service - STT (speech-to-text) and TTS (text-to-speech).
"""
import logging
import os
import tempfile
import base64
from typing import Optional, Tuple, Dict, Any, List, Generator
from pathlib import Path

logger = logging.getLogger(__name__)


class AudioService:
    """Audio service for STT and TTS."""

    SUPPORTED_AUDIO_FORMATS = {
        'mp3', 'mp4', 'mpeg', 'mpga', 'm4a', 'wav', 'webm', 'ogg', 'flac'
    }

    def __init__(self):
        self._whisper_model = None

    # ==================== STT (Speech-to-Text) ====================

    def transcribe_file(
        self,
        file_path: str,
        language: str = None,
        provider: str = 'openai'
    ) -> Tuple[Optional[str], Optional[Dict[str, Any]], Optional[str]]:
        """
        Transcribe audio to text.

        Args:
            file_path: audio file path
            language: language code (e.g. 'zh', 'en', 'ja')
            provider: service provider ('openai', 'groq', 'local')

        Returns:
            (transcript text, metadata, error message)
        """
        if not os.path.exists(file_path):
            return None, None, "File not found"

        ext = Path(file_path).suffix.lower().lstrip('.')
        if ext not in self.SUPPORTED_AUDIO_FORMATS:
            return None, None, f"Unsupported audio format: {ext}"

        if provider == 'openai':
            return self._transcribe_openai(file_path, language)
        elif provider == 'groq':
            return self._transcribe_groq(file_path, language)
        elif provider == 'local':
            return self._transcribe_local(file_path, language)
        else:
            return None, None, f"Unsupported STT provider: {provider}"

    def _transcribe_openai(
        self,
        file_path: str,
        language: str = None
    ) -> Tuple[Optional[str], Optional[Dict[str, Any]], Optional[str]]:
        """Transcribe using OpenAI Whisper API."""
        try:
            from openai import OpenAI
            from config import get_config

            config = get_config()
            if not config.OPENAI_API_KEY:
                return None, None, "OpenAI API key not set"

            client = OpenAI(api_key=config.OPENAI_API_KEY)

            with open(file_path, 'rb') as audio_file:
                params = {
                    'model': 'whisper-1',
                    'file': audio_file,
                    'response_format': 'verbose_json',
                }
                if language:
                    params['language'] = language

                response = client.audio.transcriptions.create(**params)

            metadata = {
                'duration': getattr(response, 'duration', None),
                'language': getattr(response, 'language', language),
                'provider': 'openai'
            }

            return response.text, metadata, None

        except ImportError:
            return None, None, "openai package not installed. Run: pip install openai"
        except Exception as e:
            logger.error(f"OpenAI transcription failed: {e}")
            return None, None, f"Transcription failed: {str(e)}"

    def _transcribe_groq(
        self,
        file_path: str,
        language: str = None
    ) -> Tuple[Optional[str], Optional[Dict[str, Any]], Optional[str]]:
        """Transcribe using Groq Whisper API (faster)."""
        try:
            from groq import Groq
            from config import get_config

            config = get_config()
            groq_key = os.getenv('GROQ_API_KEY', '')
            if not groq_key:
                return None, None, "Groq API key not set"

            client = Groq(api_key=groq_key)

            with open(file_path, 'rb') as audio_file:
                params = {
                    'model': 'whisper-large-v3',
                    'file': audio_file,
                    'response_format': 'verbose_json',
                }
                if language:
                    params['language'] = language

                response = client.audio.transcriptions.create(**params)

            metadata = {
                'duration': getattr(response, 'duration', None),
                'language': getattr(response, 'language', language),
                'provider': 'groq'
            }

            return response.text, metadata, None

        except ImportError:
            return None, None, "groq package not installed. Run: pip install groq"
        except Exception as e:
            logger.error(f"Groq transcription failed: {e}")
            return None, None, f"Transcription failed: {str(e)}"

    def _transcribe_local(
        self,
        file_path: str,
        language: str = None
    ) -> Tuple[Optional[str], Optional[Dict[str, Any]], Optional[str]]:
        """Transcribe using local Whisper model."""
        try:
            import whisper

            if self._whisper_model is None:
                logger.info("Loading local Whisper model...")
                self._whisper_model = whisper.load_model("base")

            result = self._whisper_model.transcribe(
                file_path,
                language=language,
                verbose=False
            )

            metadata = {
                'language': result.get('language'),
                'duration': result.get('duration'),
                'provider': 'local'
            }

            return result['text'], metadata, None

        except ImportError:
            return None, None, "whisper package not installed. Run: pip install openai-whisper"
        except Exception as e:
            logger.error(f"Local transcription failed: {e}")
            return None, None, f"Transcription failed: {str(e)}"

    # ==================== TTS (Text-to-Speech) ====================

    def text_to_speech(
        self,
        text: str,
        voice: str = 'alloy',
        provider: str = 'openai',
        output_format: str = 'mp3'
    ) -> Tuple[Optional[bytes], Optional[str]]:
        """
        Convert text to speech.

        Args:
            text: input text
            voice: voice selection
            provider: service provider ('openai', 'google')
            output_format: output format

        Returns:
            (audio bytes, error message)
        """
        if provider == 'openai':
            return self._tts_openai(text, voice, output_format)
        elif provider == 'google':
            return self._tts_google(text, voice, output_format)
        else:
            return None, f"Unsupported TTS provider: {provider}"

    def _tts_openai(
        self,
        text: str,
        voice: str = 'alloy',
        output_format: str = 'mp3'
    ) -> Tuple[Optional[bytes], Optional[str]]:
        """Use OpenAI TTS."""
        try:
            from openai import OpenAI
            from config import get_config

            config = get_config()
            if not config.OPENAI_API_KEY:
                return None, "OpenAI API key not set"

            client = OpenAI(api_key=config.OPENAI_API_KEY)

            # OpenAI TTS voices: alloy, echo, fable, onyx, nova, shimmer
            valid_voices = ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer']
            if voice not in valid_voices:
                voice = 'alloy'

            response = client.audio.speech.create(
                model='tts-1',
                voice=voice,
                input=text,
                response_format=output_format
            )

            return response.content, None

        except ImportError:
            return None, "openai package not installed"
        except Exception as e:
            logger.error(f"OpenAI TTS failed: {e}")
            return None, f"TTS failed: {str(e)}"

    def _tts_google(
        self,
        text: str,
        voice: str = 'zh-TW-Standard-A',
        output_format: str = 'mp3'
    ) -> Tuple[Optional[bytes], Optional[str]]:
        """Use Google Cloud TTS."""
        try:
            from google.cloud import texttospeech

            client = texttospeech.TextToSpeechClient()

            synthesis_input = texttospeech.SynthesisInput(text=text)

            # Parse voice name
            lang_code = '-'.join(voice.split('-')[:2]) if '-' in voice else 'zh-TW'

            voice_params = texttospeech.VoiceSelectionParams(
                language_code=lang_code,
                name=voice
            )

            audio_config = texttospeech.AudioConfig(
                audio_encoding=texttospeech.AudioEncoding.MP3
            )

            response = client.synthesize_speech(
                input=synthesis_input,
                voice=voice_params,
                audio_config=audio_config
            )

            return response.audio_content, None

        except ImportError:
            return None, "google-cloud-texttospeech package not installed"
        except Exception as e:
            logger.error(f"Google TTS failed: {e}")
            return None, f"TTS failed: {str(e)}"

    def text_to_speech_stream(
        self,
        text: str,
        voice: str = 'alloy',
        provider: str = 'openai'
    ) -> Generator[bytes, None, None]:
        """
        Stream text-to-speech.

        Args:
            text: input text
            voice: voice selection
            provider: service provider

        Yields:
            Audio data chunks
        """
        try:
            from openai import OpenAI
            from config import get_config

            config = get_config()
            if not config.OPENAI_API_KEY:
                return

            client = OpenAI(api_key=config.OPENAI_API_KEY)

            with client.audio.speech.with_streaming_response.create(
                model='tts-1',
                voice=voice,
                input=text,
            ) as response:
                for chunk in response.iter_bytes(chunk_size=4096):
                    yield chunk

        except Exception as e:
            logger.error(f"TTS stream failed: {e}")

    def save_audio(self, audio_data: bytes, output_path: str) -> bool:
        """Save audio data to a file."""
        try:
            with open(output_path, 'wb') as f:
                f.write(audio_data)
            return True
        except Exception as e:
            logger.error(f"Failed to save audio: {e}")
            return False

    def audio_to_base64(self, audio_data: bytes) -> str:
        """Convert audio data to Base64."""
        return base64.b64encode(audio_data).decode('utf-8')


# Global instance
_audio_service: Optional[AudioService] = None


def get_audio_service() -> AudioService:
    """Get audio service instance."""
    global _audio_service
    if _audio_service is None:
        _audio_service = AudioService()
    return _audio_service
