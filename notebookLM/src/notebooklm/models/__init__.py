"""
Data models for NotebookLM.

This module provides Pydantic models for all data structures used in NotebookLM,
ensuring type safety, validation, and serialization/deserialization.
"""

from .config import Config, BrowserConfig, LoggingConfig, PathsConfig
from .notebook import Notebook, NotebookMetadata, Library
from .profile import Profile, ProfileMetadata
from .query import Query, QueryResult, QueryHistory

__all__ = [
    "Config",
    "BrowserConfig",
    "LoggingConfig",
    "PathsConfig",
    "Notebook",
    "NotebookMetadata",
    "Library",
    "Profile",
    "ProfileMetadata",
    "Query",
    "QueryResult",
    "QueryHistory",
]
