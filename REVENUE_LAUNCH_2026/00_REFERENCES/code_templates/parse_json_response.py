def parse_json_response(response_text, fallback=None):
    """
    Parse JSON response with cleanup and error handling.

    Handles common AI response formats (code blocks, extra whitespace, etc.)

    Source: enhanced_recipe_generator.py, ai_recipe_generator.py
    """
    import json
    import logging

    logger = logging.getLogger(__name__)

    try:
        # Clean the response
        cleaned = response_text.strip()

        # Remove markdown code blocks if present
        if cleaned.startswith('```json'):
            cleaned = cleaned[7:]
        elif cleaned.startswith('```'):
            cleaned = cleaned[3:]

        if cleaned.endswith('```'):
            cleaned = cleaned[:-3]

        # Parse JSON
        return json.loads(cleaned.strip())

    except json.JSONDecodeError as e:
        logger.error(f"JSON parsing error: {e}")
        logger.error(f"Response content (first 500 chars): {response_text[:500]}...")

        if fallback is not None:
            logger.warning("Returning fallback value due to parsing error")
            return fallback

        raise ValueError(f"Failed to parse JSON response: {e}")
