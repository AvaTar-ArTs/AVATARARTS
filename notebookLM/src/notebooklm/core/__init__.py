"""Core functionality modules for NotebookLM."""

from .browser import Browser, StealthUtils
from .auth import AuthManager

__all__ = [
    "Browser",
    "StealthUtils",
    "AuthManager",
]
