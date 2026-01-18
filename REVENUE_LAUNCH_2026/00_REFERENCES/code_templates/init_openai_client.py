def init_openai_client(api_key=None):
    """
    Initialize OpenAI client with comprehensive error handling.

    Priority: 1) Explicit parameter, 2) Environment variable, 3) .env.d fallback

    Source: enhanced_recipe_generator.py, ai_receptionist.py
    """
    from openai import OpenAI
    from pathlib import Path
    import os

    if not api_key:
        api_key = os.getenv('OPENAI_API_KEY')

    if not api_key:
        # Try to load from .env.d directory
        env_file = Path.home() / '.env.d' / 'llm-apis.env'
        if env_file.exists():
            try:
                from dotenv import load_dotenv
                load_dotenv(env_file)
                api_key = os.getenv('OPENAI_API_KEY')
            except ImportError:
                pass

    if not api_key:
        raise ValueError(
            "OpenAI API key not found. Set OPENAI_API_KEY environment variable "
            "or provide as parameter."
        )

    try:
        client = OpenAI(api_key=api_key)
        # Test the client with a simple call if needed
        return client
    except Exception as e:
        raise ValueError(f"Failed to initialize OpenAI client: {e}")
