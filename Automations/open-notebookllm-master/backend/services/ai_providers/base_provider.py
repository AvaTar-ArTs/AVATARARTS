"""
Base classes for AI providers.
"""
from abc import ABC, abstractmethod
from typing import Generator, List, Optional


class BaseTextProvider(ABC):
    """Abstract base class for text-generation providers."""

    @abstractmethod
    def generate(self, prompt: str, system_prompt: Optional[str] = None) -> str:
        """
        Generate text synchronously.

        Args:
            prompt: user prompt
            system_prompt: system prompt (optional)

        Returns:
            Generated text.
        """
        pass

    @abstractmethod
    def generate_stream(self, prompt: str, system_prompt: Optional[str] = None) -> Generator[str, None, None]:
        """
        Stream text generation.

        Args:
            prompt: user prompt
            system_prompt: system prompt (optional)

        Yields:
            Text chunks.
        """
        pass

    @abstractmethod
    def generate_json(self, prompt: str, system_prompt: Optional[str] = None) -> dict:
        """
        Generate a JSON response.

        Args:
            prompt: user prompt
            system_prompt: system prompt (optional)

        Returns:
            Parsed JSON dict.
        """
        pass


class BaseEmbeddingProvider(ABC):
    """Abstract base class for embedding providers."""

    @abstractmethod
    def get_embedding(self, text: str) -> List[float]:
        """
        Get embeddings for text.

        Args:
            text: input text

        Returns:
            Embedding vector list.
        """
        pass

    @abstractmethod
    def get_embeddings(self, texts: List[str]) -> List[List[float]]:
        """
        Batch embeddings for text list.

        Args:
            texts: list of input texts

        Returns:
            List of embedding vectors.
        """
        pass


class BaseImageProvider(ABC):
    """Abstract base class for image-generation providers."""

    @abstractmethod
    def generate_image(
        self,
        prompt: str,
        size: str = "1024x1024",
        style: Optional[str] = None
    ) -> str:
        """
        Generate an image.

        Args:
            prompt: image prompt
            size: image size (e.g. "1024x1024", "1792x1024")
            style: image style (e.g. "vivid", "natural")

        Returns:
            Base64 image data or URL.
        """
        pass

    @abstractmethod
    def generate_images(
        self,
        prompts: List[str],
        size: str = "1024x1024",
        style: Optional[str] = None
    ) -> List[str]:
        """
        Generate images in batch.

        Args:
            prompts: list of image prompts
            size: image size
            style: image style

        Returns:
            List of Base64 images or URLs.
        """
        pass
