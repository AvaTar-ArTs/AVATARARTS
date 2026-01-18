"""
Ollama local model provider.
"""
import logging
import json
from typing import Optional, Generator, List

from .base_provider import BaseTextProvider, BaseEmbeddingProvider

logger = logging.getLogger(__name__)


class OllamaProvider(BaseTextProvider, BaseEmbeddingProvider):
    """Ollama local model provider."""

    def __init__(
        self,
        host: str = "http://localhost:11434",
        model: str = "llama3.2",
        embedding_model: str = "nomic-embed-text"
    ):
        self.host = host.rstrip('/')
        self.model = model
        self.embedding_model = embedding_model
        self._client = None

    @property
    def client(self):
        """Lazily initialize the client."""
        if self._client is None:
            try:
                import ollama
                self._client = ollama.Client(host=self.host)
            except ImportError:
                raise ImportError("ollama package not installed. Run: pip install ollama")
        return self._client

    def generate(self, prompt: str, system_prompt: Optional[str] = None) -> str:
        """Generate text."""
        try:
            messages = []

            if system_prompt:
                messages.append({"role": "system", "content": system_prompt})

            messages.append({"role": "user", "content": prompt})

            response = self.client.chat(
                model=self.model,
                messages=messages
            )

            return response['message']['content']

        except Exception as e:
            logger.error(f"Ollama generation failed: {e}")
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

            stream = self.client.chat(
                model=self.model,
                messages=messages,
                stream=True
            )

            for chunk in stream:
                if 'message' in chunk and 'content' in chunk['message']:
                    yield chunk['message']['content']

        except Exception as e:
            logger.error(f"Ollama stream generation failed: {e}")
            raise

    def generate_json(self, prompt: str, system_prompt: Optional[str] = None) -> dict:
        """Generate JSON."""
        json_system = "You must respond with valid JSON only. Do not add any other text."
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

    def get_embedding(self, text: str) -> List[float]:
        """Get embeddings for text."""
        try:
            response = self.client.embeddings(
                model=self.embedding_model,
                prompt=text
            )
            return response['embedding']

        except Exception as e:
            logger.error(f"Ollama embedding failed: {e}")
            raise

    def get_embeddings(self, texts: List[str]) -> List[List[float]]:
        """Batch embeddings."""
        return [self.get_embedding(text) for text in texts]

    def list_local_models(self) -> List[str]:
        """List locally installed models."""
        try:
            response = self.client.list()
            return [model['name'] for model in response.get('models', [])]
        except Exception as e:
            logger.error(f"Failed to list models: {e}")
            return []

    def pull_model(self, model_name: str) -> bool:
        """Pull model."""
        try:
            self.client.pull(model_name)
            return True
        except Exception as e:
            logger.error(f"Model pull failed: {e}")
            return False

    def is_available(self) -> bool:
        """Check whether the Ollama service is available."""
        try:
            import requests
            response = requests.get(f"{self.host}/api/tags", timeout=5)
            return response.status_code == 200
        except:
            return False
