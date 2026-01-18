"""
AI provider abstraction layer supporting multiple providers.
"""
from .base_provider import BaseTextProvider, BaseEmbeddingProvider, BaseImageProvider
from .gemini_provider import GeminiProvider
from .openai_provider import OpenAIProvider
from .anthropic_provider import AnthropicProvider
from .ollama_provider import OllamaProvider
from .groq_provider import GroqProvider
from .deepseek_provider import DeepSeekProvider

__all__ = [
    # Base classes
    'BaseTextProvider',
    'BaseEmbeddingProvider',
    'BaseImageProvider',
    # Providers
    'GeminiProvider',
    'OpenAIProvider',
    'AnthropicProvider',
    'OllamaProvider',
    'GroqProvider',
    'DeepSeekProvider',
]

# Provider map
PROVIDER_MAP = {
    'gemini': GeminiProvider,
    'openai': OpenAIProvider,
    'anthropic': AnthropicProvider,
    'ollama': OllamaProvider,
    'groq': GroqProvider,
    'deepseek': DeepSeekProvider,
}
