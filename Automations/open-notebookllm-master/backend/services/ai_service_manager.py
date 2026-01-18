"""
AI service manager supporting multiple providers.
"""
import logging
import os
from threading import Lock
from typing import Optional, Union, Dict, Any, List

from config import get_config
from .ai_providers import (
    GeminiProvider, OpenAIProvider, AnthropicProvider,
    OllamaProvider, GroqProvider, DeepSeekProvider,
    BaseTextProvider, BaseEmbeddingProvider, BaseImageProvider,
    PROVIDER_MAP
)

logger = logging.getLogger(__name__)

# Global singleton
_instance: Optional['AIServiceManager'] = None
_lock = Lock()


class AIServiceManager:
    """
    AI service manager for initializing and switching providers.
    """

    # Supported provider list
    SUPPORTED_PROVIDERS = ['gemini', 'openai', 'anthropic', 'ollama', 'groq', 'deepseek']

    def __init__(self):
        self._text_provider: Optional[BaseTextProvider] = None
        self._embedding_provider: Optional[BaseEmbeddingProvider] = None
        self._image_provider: Optional[BaseImageProvider] = None
        self._provider_type: Optional[str] = None
        self._provider_configs: Dict[str, Dict[str, Any]] = {}
        self._initialize_providers()

    def _initialize_providers(self):
        """Initialize AI providers."""
        config = get_config()
        provider_type = config.AI_PROVIDER.lower()

        # Load provider configs
        self._load_provider_configs()

        # Initialize default provider
        if provider_type == 'openai':
            self._init_openai_provider(config)
        elif provider_type == 'anthropic':
            self._init_anthropic_provider()
        elif provider_type == 'ollama':
            self._init_ollama_provider()
        elif provider_type == 'groq':
            self._init_groq_provider()
        elif provider_type == 'deepseek':
            self._init_deepseek_provider()
        else:
            self._init_gemini_provider(config)

        self._provider_type = provider_type

    def _load_provider_configs(self):
        """Load provider configs."""
        self._provider_configs = {
            'gemini': {
                'api_key': os.getenv('GEMINI_API_KEY', ''),
                'model': os.getenv('GEMINI_MODEL', 'gemini-2.0-flash'),
                'embedding_model': os.getenv('GEMINI_EMBEDDING_MODEL', 'models/embedding-001'),
            },
            'openai': {
                'api_key': os.getenv('OPENAI_API_KEY', ''),
                'model': os.getenv('OPENAI_MODEL', 'gpt-4o'),
                'embedding_model': os.getenv('OPENAI_EMBEDDING_MODEL', 'text-embedding-3-small'),
            },
            'anthropic': {
                'api_key': os.getenv('ANTHROPIC_API_KEY', ''),
                'model': os.getenv('ANTHROPIC_MODEL', 'claude-sonnet-4-20250514'),
            },
            'ollama': {
                'host': os.getenv('OLLAMA_HOST', 'http://localhost:11434'),
                'model': os.getenv('OLLAMA_MODEL', 'llama3.2'),
                'embedding_model': os.getenv('OLLAMA_EMBEDDING_MODEL', 'nomic-embed-text'),
            },
            'groq': {
                'api_key': os.getenv('GROQ_API_KEY', ''),
                'model': os.getenv('GROQ_MODEL', 'llama-3.3-70b-versatile'),
            },
            'deepseek': {
                'api_key': os.getenv('DEEPSEEK_API_KEY', ''),
                'model': os.getenv('DEEPSEEK_MODEL', 'deepseek-chat'),
            },
        }

    def _init_gemini_provider(self, config):
        """Initialize Gemini provider."""
        if not config.GEMINI_API_KEY:
            logger.warning("Gemini API key not set")
            return

        try:
            provider = GeminiProvider(
                api_key=config.GEMINI_API_KEY,
                model=config.GEMINI_MODEL,
                embedding_model=config.GEMINI_EMBEDDING_MODEL,
                image_model=config.GEMINI_IMAGE_MODEL
            )
            self._text_provider = provider
            self._embedding_provider = provider
            self._image_provider = provider
            logger.info("Gemini provider initialized")
        except Exception as e:
            logger.error(f"Gemini provider initialization failed: {e}")

    def _init_openai_provider(self, config):
        """Initialize OpenAI provider."""
        if not config.OPENAI_API_KEY:
            logger.warning("OpenAI API key not set")
            return

        try:
            provider = OpenAIProvider(
                api_key=config.OPENAI_API_KEY,
                model=config.OPENAI_MODEL,
                embedding_model=config.OPENAI_EMBEDDING_MODEL,
                image_model=config.OPENAI_IMAGE_MODEL
            )
            self._text_provider = provider
            self._embedding_provider = provider
            self._image_provider = provider
            logger.info("OpenAI provider initialized")
        except Exception as e:
            logger.error(f"OpenAI provider initialization failed: {e}")

    def _init_anthropic_provider(self):
        """Initialize Anthropic provider."""
        api_key = os.getenv('ANTHROPIC_API_KEY', '')
        if not api_key:
            logger.warning("Anthropic API key not set")
            return

        try:
            provider = AnthropicProvider(
                api_key=api_key,
                model=os.getenv('ANTHROPIC_MODEL', 'claude-sonnet-4-20250514')
            )
            self._text_provider = provider
            # Anthropic doesn't support embeddings; use a fallback provider
            self._init_fallback_embedding()
            logger.info("Anthropic provider initialized")
        except Exception as e:
            logger.error(f"Anthropic provider initialization failed: {e}")

    def _init_ollama_provider(self):
        """Initialize Ollama provider."""
        try:
            provider = OllamaProvider(
                host=os.getenv('OLLAMA_HOST', 'http://localhost:11434'),
                model=os.getenv('OLLAMA_MODEL', 'llama3.2'),
                embedding_model=os.getenv('OLLAMA_EMBEDDING_MODEL', 'nomic-embed-text')
            )

            if not provider.is_available():
                logger.warning("Ollama service unavailable")
                return

            self._text_provider = provider
            self._embedding_provider = provider
            logger.info("Ollama provider initialized")
        except Exception as e:
            logger.error(f"Ollama provider initialization failed: {e}")

    def _init_groq_provider(self):
        """Initialize Groq provider."""
        api_key = os.getenv('GROQ_API_KEY', '')
        if not api_key:
            logger.warning("Groq API key not set")
            return

        try:
            provider = GroqProvider(
                api_key=api_key,
                model=os.getenv('GROQ_MODEL', 'llama-3.3-70b-versatile')
            )
            self._text_provider = provider
            # Groq doesn't support embeddings; use a fallback provider
            self._init_fallback_embedding()
            logger.info("Groq provider initialized")
        except Exception as e:
            logger.error(f"Groq provider initialization failed: {e}")

    def _init_deepseek_provider(self):
        """Initialize DeepSeek provider."""
        api_key = os.getenv('DEEPSEEK_API_KEY', '')
        if not api_key:
            logger.warning("DeepSeek API key not set")
            return

        try:
            provider = DeepSeekProvider(
                api_key=api_key,
                model=os.getenv('DEEPSEEK_MODEL', 'deepseek-chat')
            )
            self._text_provider = provider
            # DeepSeek doesn't support embeddings; use a fallback provider
            self._init_fallback_embedding()
            logger.info("DeepSeek provider initialized")
        except Exception as e:
            logger.error(f"DeepSeek provider initialization failed: {e}")

    def _init_fallback_embedding(self):
        """Initialize fallback embedding provider."""
        config = get_config()

        # Prefer OpenAI embeddings
        if config.OPENAI_API_KEY:
            try:
                self._embedding_provider = OpenAIProvider(
                    api_key=config.OPENAI_API_KEY,
                    model=config.OPENAI_MODEL,
                    embedding_model=config.OPENAI_EMBEDDING_MODEL
                )
                logger.info("Using OpenAI as embedding fallback")
                return
            except:
                pass

        # Then try Gemini
        if config.GEMINI_API_KEY:
            try:
                self._embedding_provider = GeminiProvider(
                    api_key=config.GEMINI_API_KEY,
                    model=config.GEMINI_MODEL,
                    embedding_model=config.GEMINI_EMBEDDING_MODEL
                )
                logger.info("Using Gemini as embedding fallback")
                return
            except:
                pass

        # Finally try Ollama
        try:
            ollama = OllamaProvider()
            if ollama.is_available():
                self._embedding_provider = ollama
                logger.info("Using Ollama as embedding fallback")
        except:
            logger.warning("Failed to initialize embedding provider")

    @property
    def text_provider(self) -> Optional[BaseTextProvider]:
        """Get the text generation provider."""
        return self._text_provider

    @property
    def embedding_provider(self) -> Optional[BaseEmbeddingProvider]:
        """Get the embedding provider."""
        return self._embedding_provider

    @property
    def image_provider(self) -> Optional[BaseImageProvider]:
        """Get the image generation provider."""
        return self._image_provider

    @property
    def provider_type(self) -> Optional[str]:
        """Get the current provider type."""
        return self._provider_type

    @property
    def is_ready(self) -> bool:
        """Check whether the provider is ready."""
        return self._text_provider is not None

    def switch_provider(
        self,
        provider_type: str,
        api_key: Optional[str] = None,
        model: Optional[str] = None,
        **kwargs
    ):
        """
        Switch AI provider.

        Args:
            provider_type: provider type
            api_key: API Key
            model: model name (optional)
            **kwargs: provider-specific parameters
        """
        provider_type = provider_type.lower()

        if provider_type not in self.SUPPORTED_PROVIDERS:
            raise ValueError(f"Unsupported provider: {provider_type}")

        config = get_config()

        if provider_type == 'gemini':
            key = api_key or config.GEMINI_API_KEY
            provider = GeminiProvider(
                api_key=key,
                model=model or config.GEMINI_MODEL,
                embedding_model=config.GEMINI_EMBEDDING_MODEL,
                image_model=config.GEMINI_IMAGE_MODEL
            )
            self._text_provider = provider
            self._embedding_provider = provider
            self._image_provider = provider

        elif provider_type == 'openai':
            key = api_key or config.OPENAI_API_KEY
            provider = OpenAIProvider(
                api_key=key,
                model=model or config.OPENAI_MODEL,
                embedding_model=config.OPENAI_EMBEDDING_MODEL,
                image_model=config.OPENAI_IMAGE_MODEL
            )
            self._text_provider = provider
            self._embedding_provider = provider
            self._image_provider = provider

        elif provider_type == 'anthropic':
            key = api_key or os.getenv('ANTHROPIC_API_KEY', '')
            provider = AnthropicProvider(
                api_key=key,
                model=model or os.getenv('ANTHROPIC_MODEL', 'claude-sonnet-4-20250514')
            )
            self._text_provider = provider
            self._init_fallback_embedding()

        elif provider_type == 'ollama':
            provider = OllamaProvider(
                host=kwargs.get('host', os.getenv('OLLAMA_HOST', 'http://localhost:11434')),
                model=model or os.getenv('OLLAMA_MODEL', 'llama3.2'),
                embedding_model=kwargs.get('embedding_model', 'nomic-embed-text')
            )
            self._text_provider = provider
            self._embedding_provider = provider

        elif provider_type == 'groq':
            key = api_key or os.getenv('GROQ_API_KEY', '')
            provider = GroqProvider(
                api_key=key,
                model=model or os.getenv('GROQ_MODEL', 'llama-3.3-70b-versatile')
            )
            self._text_provider = provider
            self._init_fallback_embedding()

        elif provider_type == 'deepseek':
            key = api_key or os.getenv('DEEPSEEK_API_KEY', '')
            provider = DeepSeekProvider(
                api_key=key,
                model=model or os.getenv('DEEPSEEK_MODEL', 'deepseek-chat')
            )
            self._text_provider = provider
            self._init_fallback_embedding()

        self._provider_type = provider_type
        logger.info(f"Switched to {provider_type} provider")

    def generate(self, prompt: str, system_prompt: Optional[str] = None) -> str:
        """Generate text."""
        if not self._text_provider:
            raise RuntimeError("AI provider not initialized")
        return self._text_provider.generate(prompt, system_prompt)

    def generate_stream(self, prompt: str, system_prompt: Optional[str] = None):
        """Stream text generation."""
        if not self._text_provider:
            raise RuntimeError("AI provider not initialized")
        return self._text_provider.generate_stream(prompt, system_prompt)

    def generate_json(self, prompt: str, system_prompt: Optional[str] = None) -> dict:
        """Generate JSON."""
        if not self._text_provider:
            raise RuntimeError("AI provider not initialized")
        return self._text_provider.generate_json(prompt, system_prompt)

    def get_embedding(self, text: str):
        """Get embeddings for text."""
        if not self._embedding_provider:
            raise RuntimeError("Embedding provider not initialized")
        return self._embedding_provider.get_embedding(text)

    def get_embeddings(self, texts: list):
        """Batch embeddings for texts."""
        if not self._embedding_provider:
            raise RuntimeError("Embedding provider not initialized")
        return self._embedding_provider.get_embeddings(texts)

    def generate_image(self, prompt: str, size: str = "1024x1024", style: Optional[str] = None) -> str:
        """Generate image."""
        if not self._image_provider:
            raise RuntimeError("Image provider not initialized")
        return self._image_provider.generate_image(prompt, size, style)

    def generate_images(self, prompts: list, size: str = "1024x1024", style: Optional[str] = None) -> list:
        """Generate images in batch."""
        if not self._image_provider:
            raise RuntimeError("Image provider not initialized")
        return self._image_provider.generate_images(prompts, size, style)

    def get_available_providers(self) -> List[Dict[str, Any]]:
        """Get list of available providers."""
        config = get_config()
        providers = []

        # Gemini
        providers.append({
            'id': 'gemini',
            'name': 'Google Gemini',
            'available': bool(config.GEMINI_API_KEY),
            'supports_embedding': True,
            'supports_image': True,
            'models': ['gemini-2.5-flash', 'gemini-2.5-pro', 'gemini-2.0-flash', 'gemini-1.5-pro']
        })

        # OpenAI
        providers.append({
            'id': 'openai',
            'name': 'OpenAI',
            'available': bool(config.OPENAI_API_KEY),
            'supports_embedding': True,
            'supports_image': True,
            'models': ['gpt-4o', 'gpt-4.1', 'gpt-4-turbo', 'gpt-3.5-turbo']
        })

        # Anthropic
        providers.append({
            'id': 'anthropic',
            'name': 'Anthropic Claude',
            'available': bool(os.getenv('ANTHROPIC_API_KEY', '')),
            'supports_embedding': False,
            'supports_image': False,
            'models': AnthropicProvider.AVAILABLE_MODELS
        })

        # Ollama
        ollama_available = False
        try:
            ollama = OllamaProvider()
            ollama_available = ollama.is_available()
        except:
            pass

        providers.append({
            'id': 'ollama',
            'name': 'Ollama (Local)',
            'available': ollama_available,
            'supports_embedding': True,
            'supports_image': False,
            'models': ['llama3.2', 'llama3.1', 'mistral', 'mixtral', 'qwen2.5']
        })

        # Groq
        providers.append({
            'id': 'groq',
            'name': 'Groq (Fast)',
            'available': bool(os.getenv('GROQ_API_KEY', '')),
            'supports_embedding': False,
            'supports_image': False,
            'models': GroqProvider.AVAILABLE_MODELS
        })

        # DeepSeek
        providers.append({
            'id': 'deepseek',
            'name': 'DeepSeek (Reasoning)',
            'available': bool(os.getenv('DEEPSEEK_API_KEY', '')),
            'supports_embedding': False,
            'supports_image': False,
            'models': DeepSeekProvider.AVAILABLE_MODELS
        })

        return providers

    def get_current_config(self) -> Dict[str, Any]:
        """Get current config."""
        return {
            'provider': self._provider_type,
            'is_ready': self.is_ready,
            'has_embedding': self._embedding_provider is not None,
            'has_image': self._image_provider is not None,
        }


def get_ai_service(force_new: bool = False) -> AIServiceManager:
    """
    Get the AI service manager singleton.

    Args:
        force_new: force creation of a new instance

    Returns:
        AIServiceManager instance
    """
    global _instance

    if force_new:
        with _lock:
            _instance = None
            logger.info("Force re-creating AI service manager")

    if _instance is None:
        with _lock:
            if _instance is None:
                _instance = AIServiceManager()
                logger.info("AI service manager initialized")

    return _instance


def clear_ai_service():
    """Clear the AI service manager singleton."""
    global _instance
    with _lock:
        _instance = None
        logger.info("AI service manager cleared")
