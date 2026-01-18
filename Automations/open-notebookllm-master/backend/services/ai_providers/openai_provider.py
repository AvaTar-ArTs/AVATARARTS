"""
OpenAI AI Provider
"""
import json
import logging
from typing import Generator, List, Optional

from openai import OpenAI
from tenacity import retry, stop_after_attempt, wait_exponential

from .base_provider import BaseTextProvider, BaseEmbeddingProvider, BaseImageProvider

logger = logging.getLogger(__name__)


class OpenAIProvider(BaseTextProvider, BaseEmbeddingProvider, BaseImageProvider):
    """OpenAI AI provider."""

    def __init__(
        self,
        api_key: str,
        model: str = "gpt-5.1",
        embedding_model: str = "text-embedding-3-small",
        image_model: str = "dall-e-3",
        base_url: Optional[str] = None
    ):
        """
        Initialize the OpenAI provider.

        Args:
            api_key: OpenAI API Key
            model: text generation model name
            embedding_model: embedding model name
            image_model: image generation model name
            base_url: API base URL (proxy)
        """
        self.client = OpenAI(
            api_key=api_key,
            base_url=base_url,
            timeout=300.0,
            max_retries=2
        )
        self.model = model
        self.embedding_model = embedding_model
        self.image_model = image_model
        logger.info(f"OpenAI provider initialized, text model: {model}, image model: {image_model}")

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=2, max=10)
    )
    def generate(self, prompt: str, system_prompt: Optional[str] = None) -> str:
        """Generate text synchronously."""
        try:
            messages = []

            if system_prompt:
                messages.append({"role": "system", "content": system_prompt})

            messages.append({"role": "user", "content": prompt})

            response = self.client.chat.completions.create(
                model=self.model,
                messages=messages
            )

            return response.choices[0].message.content

        except Exception as e:
            logger.error(f"OpenAI generation failed: {e}")
            raise

    def generate_stream(self, prompt: str, system_prompt: Optional[str] = None) -> Generator[str, None, None]:
        """Stream text generation."""
        try:
            messages = []

            if system_prompt:
                messages.append({"role": "system", "content": system_prompt})

            messages.append({"role": "user", "content": prompt})

            stream = self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                stream=True
            )

            for chunk in stream:
                if chunk.choices[0].delta.content:
                    yield chunk.choices[0].delta.content

        except Exception as e:
            logger.error(f"OpenAI stream generation failed: {e}")
            raise

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=2, max=10)
    )
    def generate_json(self, prompt: str, system_prompt: Optional[str] = None) -> dict:
        """Generate a JSON response."""
        try:
            messages = []

            json_system = "Respond with pure JSON only; do not include any other text or markdown."
            if system_prompt:
                messages.append({"role": "system", "content": f"{system_prompt}\n\n{json_system}"})
            else:
                messages.append({"role": "system", "content": json_system})

            messages.append({"role": "user", "content": prompt})

            response = self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                response_format={"type": "json_object"}
            )

            content = response.choices[0].message.content
            return json.loads(content)

        except json.JSONDecodeError as e:
            logger.error(f"JSON parse failed: {e}")
            raise
        except Exception as e:
            logger.error(f"OpenAI JSON generation failed: {e}")
            raise

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=2, max=10)
    )
    def get_embedding(self, text: str) -> List[float]:
        """Get embeddings for text."""
        try:
            response = self.client.embeddings.create(
                model=self.embedding_model,
                input=text
            )
            return response.data[0].embedding

        except Exception as e:
            logger.error(f"OpenAI embedding generation failed: {e}")
            raise

    def get_embeddings(self, texts: List[str]) -> List[List[float]]:
        """Batch embeddings for texts."""
        try:
            response = self.client.embeddings.create(
                model=self.embedding_model,
                input=texts
            )
            return [item.embedding for item in response.data]

        except Exception as e:
            logger.error(f"OpenAI batch embedding generation failed: {e}")
            raise

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=2, max=10)
    )
    def generate_image(
        self,
        prompt: str,
        size: str = "1024x1024",
        style: Optional[str] = None
    ) -> str:
        """
        Generate images with DALL-E.

        Args:
            prompt: image prompt
            size: image size (1024x1024, 1792x1024, 1024x1792)
            style: image style (vivid, natural)

        Returns:
            Base64 image or URL.
        """
        try:
            # DALL-E 3 supported sizes
            valid_sizes = ["1024x1024", "1792x1024", "1024x1792"]
            if size not in valid_sizes:
                size = "1024x1024"

            # Default style
            image_style = style if style in ["vivid", "natural"] else "vivid"

            response = self.client.images.generate(
                model=self.image_model,
                prompt=prompt,
                size=size,
                style=image_style,
                response_format="b64_json",
                n=1
            )

            # Return Base64
            return response.data[0].b64_json

        except Exception as e:
            logger.error(f"OpenAI image generation failed: {e}")
            raise

    def generate_images(
        self,
        prompts: List[str],
        size: str = "1024x1024",
        style: Optional[str] = None
    ) -> List[str]:
        """Generate images in batch."""
        images = []
        for prompt in prompts:
            try:
                image = self.generate_image(prompt, size, style)
                images.append(image)
            except Exception as e:
                logger.error(f"Batch image generation failed: {e}")
                images.append("")
        return images
