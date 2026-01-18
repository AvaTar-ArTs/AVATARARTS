"""
Anthropic Claude AI Provider
"""
import logging
from typing import Optional, Generator, List

from .base_provider import BaseTextProvider

logger = logging.getLogger(__name__)


class AnthropicProvider(BaseTextProvider):
    """Anthropic Claude AI Provider"""

    # Available models
    AVAILABLE_MODELS = [
        "claude-opus-4-5-20251101",
        "claude-sonnet-4-20250514",
        "claude-3-5-sonnet-20241022",
        "claude-3-5-haiku-20241022",
        "claude-3-opus-20240229",
        "claude-3-sonnet-20240229",
        "claude-3-haiku-20240307",
    ]

    def __init__(
        self,
        api_key: str,
        model: str = "claude-sonnet-4-20250514",
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
                import anthropic
                self._client = anthropic.Anthropic(api_key=self.api_key)
            except ImportError:
                raise ImportError("anthropic package not installed. Run: pip install anthropic")
        return self._client

    def generate(self, prompt: str, system_prompt: Optional[str] = None) -> str:
        """Generate text."""
        try:
            messages = [{"role": "user", "content": prompt}]

            kwargs = {
                "model": self.model,
                "max_tokens": self.max_tokens,
                "messages": messages
            }

            if system_prompt:
                kwargs["system"] = system_prompt

            response = self.client.messages.create(**kwargs)
            return response.content[0].text

        except Exception as e:
            logger.error(f"Anthropic generation failed: {e}")
            raise

    def generate_stream(
        self,
        prompt: str,
        system_prompt: Optional[str] = None
    ) -> Generator[str, None, None]:
        """Stream text generation."""
        try:
            messages = [{"role": "user", "content": prompt}]

            kwargs = {
                "model": self.model,
                "max_tokens": self.max_tokens,
                "messages": messages,
                "stream": True
            }

            if system_prompt:
                kwargs["system"] = system_prompt

            with self.client.messages.stream(**kwargs) as stream:
                for text in stream.text_stream:
                    yield text

        except Exception as e:
            logger.error(f"Anthropic stream generation failed: {e}")
            raise

    def generate_json(self, prompt: str, system_prompt: Optional[str] = None) -> dict:
        """Generate JSON."""
        import json

        # System prompt to force JSON-only output
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
            # Convert message format
            formatted_messages = []
            for msg in messages:
                role = msg.get("role", "user")
                if role == "system":
                    continue  # Anthropic uses a separate system parameter
                formatted_messages.append({
                    "role": role,
                    "content": msg.get("content", "")
                })

            kwargs = {
                "model": self.model,
                "max_tokens": self.max_tokens,
                "messages": formatted_messages
            }

            if system_prompt:
                kwargs["system"] = system_prompt

            response = self.client.messages.create(**kwargs)
            return response.content[0].text

        except Exception as e:
            logger.error(f"Anthropic chat failed: {e}")
            raise

    @classmethod
    def list_models(cls) -> List[str]:
        """List available models."""
        return cls.AVAILABLE_MODELS
