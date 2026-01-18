"""Input validation utilities."""

import re
from typing import Optional
from ..exceptions import InvalidURLError, InvalidInputError


def validate_url(url: str) -> bool:
    """
    Validate URL format.

    Args:
        url: URL to validate

    Returns:
        True if valid

    Raises:
        InvalidURLError: If URL is invalid
    """
    if not url or not url.strip():
        raise InvalidURLError("URL cannot be empty")

    url = url.strip()

    # Basic URL pattern
    url_pattern = re.compile(
        r"^https?://"  # http:// or https://
        r"(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+[A-Z]{2,6}\.?|"  # domain
        r"localhost|"  # localhost
        r"\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})"  # IP
        r"(?::\d+)?"  # optional port
        r"(?:/?|[/?]\S+)$",
        re.IGNORECASE,
    )

    if not url_pattern.match(url):
        raise InvalidURLError(f"Invalid URL format: {url}")

    return True


def validate_notebooklm_url(url: str) -> bool:
    """
    Validate NotebookLM URL format.

    Args:
        url: URL to validate

    Returns:
        True if valid

    Raises:
        InvalidURLError: If URL is invalid
    """
    validate_url(url)

    if not url.startswith("https://notebooklm.google.com/"):
        raise InvalidURLError("URL must be a valid NotebookLM URL")

    return True


def validate_email(email: str) -> bool:
    """
    Validate email format.

    Args:
        email: Email to validate

    Returns:
        True if valid

    Raises:
        InvalidInputError: If email is invalid
    """
    if not email or not email.strip():
        raise InvalidInputError("Email cannot be empty")

    email = email.strip()

    # Basic email pattern
    email_pattern = re.compile(r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$")

    if not email_pattern.match(email):
        raise InvalidInputError(f"Invalid email format: {email}")

    return True


def validate_notebook_id(notebook_id: str) -> bool:
    """
    Validate notebook ID format.

    Args:
        notebook_id: Notebook ID to validate

    Returns:
        True if valid

    Raises:
        InvalidInputError: If ID is invalid
    """
    if not notebook_id or not notebook_id.strip():
        raise InvalidInputError("Notebook ID cannot be empty")

    notebook_id = notebook_id.strip()

    # Allow alphanumeric, hyphens, underscores
    if not re.match(r"^[a-zA-Z0-9_-]+$", notebook_id):
        raise InvalidInputError(
            f"Invalid notebook ID format: {notebook_id}. "
            "Only alphanumeric characters, hyphens, and underscores are allowed."
        )

    return True


def validate_profile_id(profile_id: str) -> bool:
    """
    Validate profile ID format.

    Args:
        profile_id: Profile ID to validate

    Returns:
        True if valid

    Raises:
        InvalidInputError: If ID is invalid
    """
    if not profile_id or not profile_id.strip():
        raise InvalidInputError("Profile ID cannot be empty")

    profile_id = profile_id.strip()

    # Allow alphanumeric, hyphens, underscores
    if not re.match(r"^[a-zA-Z0-9_-]+$", profile_id):
        raise InvalidInputError(
            f"Invalid profile ID format: {profile_id}. "
            "Only alphanumeric characters, hyphens, and underscores are allowed."
        )

    return True
