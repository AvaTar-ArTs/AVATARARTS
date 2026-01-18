def validate_input(data, validators):
    """
    Validate input data with comprehensive checks.

    Args:
        data: Dictionary of data to validate
        validators: Dictionary mapping field names to validator functions

    Returns:
        True if validation passes

    Raises:
        ValueError: If validation fails

    Source: common_imports.py, quality_monitor.py
    """
    if not isinstance(data, dict):
        raise ValueError("Input must be a dictionary")

    for field, validator in validators.items():
        if field not in data:
            raise ValueError(f"Missing required field: {field}")

        try:
            if not validator(data[field]):
                raise ValueError(f"Invalid value for field {field}: {data[field]}")
        except Exception as e:
            raise ValueError(f"Validation error for field {field}: {e}")

    return True


def sanitize_string(value, max_length=1000):
    """
    Sanitize string input to prevent injection attacks.

    Removes potentially dangerous characters and limits length.

    Source: common_imports.py, security patterns
    """
    if not isinstance(value, str):
        raise ValueError("Input must be a string")

    # Remove potentially dangerous characters
    dangerous_chars = ['<', '>', '"', "'", '&', ';', '(', ')', '{', '}']
    for char in dangerous_chars:
        value = value.replace(char, '')

    # Limit length
    if len(value) > max_length:
        value = value[:max_length]

    return value.strip()
