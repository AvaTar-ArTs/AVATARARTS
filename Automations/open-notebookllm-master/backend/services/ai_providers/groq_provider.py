"""
Groq Provider - ultra-fast inference.
"""
import logging
import json
from typing import Optional, Generator, List

from .base_provider import BaseTextProvider

logger = logging.getLogger(__name__)


class GroqProvider(BaseTextProvider):
    """Groq Provider - ultra-fast LLM inference."""

    # Available models
    AVAILABLE_MODELS = [
        "llama-3.3-70b-versatile",
        "llama-3.1-70b-versatile",
        "llama-3.1-8b-instant",
        "llama3-groq-70b-8192-tool-use-preview",
        "llama3-groq-8b-8192-tool-use-preview",
        "mixtral-8x7b-32768",
        "gemma2-9b-it",
        "deepseek-r1-distill-llama-70b",  # DeepSeek R1 distilled
    ]

    def __init__(
        self,
        api_key: str,
        model: str = "llama-3.3-70b-versatile",
        max_tokens: int = 4096
    ):
        self.api_key = api_key
        self.model = model
        self.max_tokens = max_tokens
        self._client = None

    @property
    def client(self):
        """Lazily initialize the client."""
        if self._client is None:
            try:
                from groq import Groq
                self._client = Groq(api_key=self.api_key)
            except ImportError:
                raise ImportError("groq package not installed. Run: pip install groq")
        return self._client

    def generate(self, prompt: str, system_prompt: Optional[str] = None) -> str:
        """Generate text."""
        try:
            messages = []

            if system_prompt:
                messages.append({"role": "system", "content": system_prompt})

            messages.append({"role": "user", "content": prompt})

            response = self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                max_tokens=self.max_tokens
            )

            return response.choices[0].message.content

        except Exception as e:
            logger.error(f"Groq generation failed: {e}")
            raise

    def generate_stream(
        self,
        prompt: str,
        system_prompt: Optional[str] = None
    ) -> Generator[str, None, None]:
        """Stream text generation."""
        try:
            messages = []

            if system_prompt:
                messages.append({"role": "system", "content": system_prompt})

            messages.append({"role": "user", "content": prompt})

            stream = self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                max_tokens=self.max_tokens,
                stream=True
            )

            for chunk in stream:
                if chunk.choices[0].delta.content:
                    yield chunk.choices[0].delta.content

        except Exception as e:
            logger.error(f"Groq stream generation failed: {e}")
            raise

    def generate_json(self, prompt: str, system_prompt: Optional[str] = None) -> dict:
        """Generate JSON."""
        json_system = "You must respond with valid JSON only. Do not add any other text or markdown."
        if system_prompt:
            json_system = f"{system_prompt}\n\n{json_system}"

        response = self.generate(prompt, json_system)

        # Clean response
        response = response.strip()
        if response.startswith("```json"):
            response = response[7:]
        if response.startswith("```"):
            response = response[3:]
        if response.endswith("```"):
            response = response[:-3]

        return json.loads(response.strip())

    def chat(
        self,
        messages: List[dict],
        system_prompt: Optional[str] = None
    ) -> str:
        """Multi-turn chat."""
        try:
            formatted_messages = []

            if system_prompt:
                formatted_messages.append({"role": "system", "content": system_prompt})

            for msg in messages:
                formatted_messages.append({
                    "role": msg.get("role", "user"),
                    "content": msg.get("content", "")
                })

            response = self.client.chat.completions.create(
                model=self.model,
                messages=formatted_messages,
                max_tokens=self.max_tokens
            )

            return response.choices[0].message.content

        except Exception as e:
            logger.error(f"Groq chat failed: {e}")
            raise

    @classmethod
    def list_models(cls) -> List[str]:
        """List available models."""
        return cls.AVAILABLE_MODELS
