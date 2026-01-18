"""
Gemini AI provider.
Supports text generation, embeddings, and image generation (multimodal model).
"""
import base64
import io
import json
import logging
from typing import Generator, List, Optional

import google.generativeai as genai
from tenacity import retry, stop_after_attempt, wait_exponential

from .base_provider import BaseTextProvider, BaseEmbeddingProvider, BaseImageProvider

logger = logging.getLogger(__name__)

# Attempt to import the new SDK
try:
    from google import genai as genai_client
    from google.genai import types as genai_types
    HAS_NEW_SDK = True
except ImportError:
    HAS_NEW_SDK = False
    logger.warning("New google-genai SDK not installed; image generation may be limited.")


class GeminiProvider(BaseTextProvider, BaseEmbeddingProvider, BaseImageProvider):
    """Gemini AI provider."""

    def __init__(
        self,
        api_key: str,
        model: str = "gemini-2.0-flash",
        embedding_model: str = "models/embedding-001",
        image_model: str = "gemini-2.0-flash-exp-image-generation"
    ):
        """
        Initialize the Gemini provider.

        Args:
            api_key: Gemini API Key
            model: text generation model name
            embedding_model: embedding model name
            image_model: image generation model (multimodal)
        """
        genai.configure(api_key=api_key)
        self.api_key = api_key
        self.model = genai.GenerativeModel(model)
        self.model_name = model
        self.embedding_model = embedding_model
        self.image_model = image_model

        # Initialize new SDK client (for image generation)
        self._genai_client = None
        if HAS_NEW_SDK:
            try:
                self._genai_client = genai_client.Client(api_key=api_key)
                logger.info(f"New GenAI client initialized, image model: {image_model}")
            except Exception as e:
                logger.warning(f"New GenAI client initialization failed: {e}")

        logger.info(f"Gemini provider initialized, text model: {model}, image model: {image_model}")

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=2, max=10)
    )
    def generate(self, prompt: str, system_prompt: Optional[str] = None) -> str:
        """Generate text synchronously."""
        try:
            messages = []

            if system_prompt:
                # Gemini uses conversation-style system prompts
                messages.append({"role": "user", "parts": [system_prompt]})
                messages.append({"role": "model", "parts": ["Understood. I will follow the instructions."]})

            messages.append({"role": "user", "parts": [prompt]})

            response = self.model.generate_content(messages)
            return response.text

        except Exception as e:
            logger.error(f"Gemini generation failed: {e}")
            raise

    def generate_stream(self, prompt: str, system_prompt: Optional[str] = None) -> Generator[str, None, None]:
        """Stream text generation."""
        try:
            messages = []

            if system_prompt:
                messages.append({"role": "user", "parts": [system_prompt]})
                messages.append({"role": "model", "parts": ["Understood. I will follow the instructions."]})

            messages.append({"role": "user", "parts": [prompt]})

            response = self.model.generate_content(messages, stream=True)

            for chunk in response:
                if chunk.text:
                    yield chunk.text

        except Exception as e:
            logger.error(f"Gemini stream generation failed: {e}")
            raise

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=2, max=10)
    )
    def generate_json(self, prompt: str, system_prompt: Optional[str] = None) -> dict:
        """Generate a JSON response."""
        json_prompt = f"""Respond in JSON only. Do not include any other text or markdown.

{prompt}"""

        if system_prompt:
            system_prompt = f"{system_prompt}\n\nImportant: respond in pure JSON."
        else:
            system_prompt = "Important: respond in pure JSON and nothing else."

        response = self.generate(json_prompt, system_prompt)

        # Clean response, remove possible markdown fences
        response = response.strip()
        if response.startswith("```json"):
            response = response[7:]
        if response.startswith("```"):
            response = response[3:]
        if response.endswith("```"):
            response = response[:-3]
        response = response.strip()

        try:
            return json.loads(response)
        except json.JSONDecodeError as e:
            logger.error(f"JSON parse failed: {e}, raw response: {response}")
            raise

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=2, max=10)
    )
    def get_embedding(self, text: str) -> List[float]:
        """Get embeddings for text."""
        try:
            result = genai.embed_content(
                model=self.embedding_model,
                content=text,
                task_type="retrieval_document"
            )
            return result['embedding']

        except Exception as e:
            logger.error(f"Gemini embedding generation failed: {e}")
            raise

    def get_embeddings(self, texts: List[str]) -> List[List[float]]:
        """Batch embeddings for texts."""
        embeddings = []
        for text in texts:
            embedding = self.get_embedding(text)
            embeddings.append(embedding)
        return embeddings

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
        Generate images using Gemini multimodal model.

        Args:
            prompt: image prompt
            size: image size (e.g. "1024x1024", "1920x1080")
            style: image style

        Returns:
            Base64-encoded image.
        """
        if not HAS_NEW_SDK or not self._genai_client:
            logger.error("New google-genai SDK not installed or failed to initialize")
            raise Exception("Image generation requires google-genai: pip install google-genai")

        try:
            # Build prompt
            full_prompt = prompt
            if style:
                full_prompt = f"{prompt}, {style} style"

            # Parse size and get aspect ratio
            width, height = map(int, size.split('x'))
            aspect_ratio = self._get_aspect_ratio(width, height)

            logger.info(f"Generating image with multimodal model: {self.image_model}, aspect ratio: {aspect_ratio}")
            logger.debug(f"Prompt: {full_prompt[:100]}...")

            # Generate image with multimodal model
            response = self._genai_client.models.generate_content(
                model=self.image_model,
                contents=[full_prompt],
                config=genai_types.GenerateContentConfig(
                    response_modalities=['TEXT', 'IMAGE'],
                    image_config=genai_types.ImageConfig(
                        aspect_ratio=aspect_ratio
                    )
                )
            )

            # Extract image from response
            last_image = None
            for i, part in enumerate(response.parts):
                if part.text is not None:
                    logger.debug(f"Part {i}: TEXT - {part.text[:50] if len(part.text) > 50 else part.text}")
                else:
                    try:
                        image = part.as_image()
                        if image:
                            logger.debug(f"Extracted image from part {i}")
                            last_image = image
                    except Exception as e:
                        logger.debug(f"Part {i}: image extraction failed - {str(e)}")

            if last_image:
                # Convert PIL Image to Base64
                buffer = io.BytesIO()
                last_image.save(buffer, format='PNG')
                buffer.seek(0)
                return base64.b64encode(buffer.read()).decode('utf-8')

            raise Exception("Image generation failed: no image found in response")

        except Exception as e:
            logger.error(f"Gemini image generation failed: {e}")
            raise

    def _get_aspect_ratio(self, width: int, height: int) -> str:
        """Return aspect ratio from size."""
        ratio = width / height
        if abs(ratio - 1.0) < 0.1:
            return "1:1"
        elif abs(ratio - 16/9) < 0.1:
            return "16:9"
        elif abs(ratio - 9/16) < 0.1:
            return "9:16"
        elif abs(ratio - 4/3) < 0.1:
            return "4:3"
        elif abs(ratio - 3/4) < 0.1:
            return "3:4"
        else:
            return "1:1"

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
