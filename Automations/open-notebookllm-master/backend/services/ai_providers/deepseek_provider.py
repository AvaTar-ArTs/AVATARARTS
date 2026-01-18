"""
DeepSeek Provider - supports reasoning models.
"""
import logging
import json
from typing import Optional, Generator, List

from .base_provider import BaseTextProvider

logger = logging.getLogger(__name__)


class DeepSeekProvider(BaseTextProvider):
    """DeepSeek Provider - reasoning model support (R1)."""

    # Available models
    AVAILABLE_MODELS = [
        "deepseek-chat",        # DeepSeek-V3 chat model
        "deepseek-reasoner",    # DeepSeek-R1 reasoning model
    ]

    API_BASE = "https://api.deepseek.com"

    def __init__(
        self,
        api_key: str,
        model: str = "deepseek-chat",
        max_tokens: int = 4096
    ):
        self.api_key = api_key
        self.model = model
        self.max_tokens = max_tokens
        self._client = None

    @property
    def client(self):
        """Lazily initialize client (OpenAI-compatible API)."""
        if self._client is None:
            try:
                from openai import OpenAI
                self._client = OpenAI(
                    api_key=self.api_key,
                    base_url=f"{self.API_BASE}/v1"
                )
            except ImportError:
                raise ImportError("openai package not installed. Run: pip install openai")
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

            content = response.choices[0].message.content

            # Reasoning models may include reasoning traces
            if hasattr(response.choices[0].message, 'reasoning_content'):
                reasoning = response.choices[0].message.reasoning_content
                if reasoning:
                    logger.debug(f"Reasoning trace: {reasoning[:200]}...")

            return content

        except Exception as e:
            logger.error(f"DeepSeek generation failed: {e}")
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
            logger.error(f"DeepSeek stream generation failed: {e}")
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

    def generate_with_reasoning(
        self,
        prompt: str,
        system_prompt: Optional[str] = None
    ) -> dict:
        """
        Generate with a reasoning model and return reasoning traces.

        Returns:
            {"content": "final answer", "reasoning": "reasoning trace"}
        """
        try:
            # Use reasoning model
            original_model = self.model
            self.model = "deepseek-reasoner"

            messages = []
            if system_prompt:
                messages.append({"role": "system", "content": system_prompt})
            messages.append({"role": "user", "content": prompt})

            response = self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                max_tokens=self.max_tokens
            )

            self.model = original_model

            result = {
                "content": response.choices[0].message.content,
                "reasoning": None
            }

            # Extract reasoning traces
            if hasattr(response.choices[0].message, 'reasoning_content'):
                result["reasoning"] = response.choices[0].message.reasoning_content

            return result

        except Exception as e:
            logger.error(f"DeepSeek reasoning generation failed: {e}")
            self.model = original_model
            raise

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
            logger.error(f"DeepSeek chat failed: {e}")
            raise

    @classmethod
    def list_models(cls) -> List[str]:
        """List available models."""
        return cls.AVAILABLE_MODELS
