"""
Custom exceptions for NotebookLM.

This module defines all custom exceptions used throughout the NotebookLM package.
All exceptions inherit from NotebookLMError for easy catching of package-specific errors.
"""

from typing import Optional


class NotebookLMError(Exception):
    """Base exception for all NotebookLM errors."""

    def __init__(self, message: str, details: Optional[dict] = None) -> None:
        """
        Initialize exception with message and optional details.

        Args:
            message: Human-readable error message
            details: Optional dictionary with additional error context
        """
        super().__init__(message)
        self.message = message
        self.details = details or {}


# Authentication Errors
class AuthenticationError(NotebookLMError):
    """Raised when authentication fails."""


class AuthenticationTimeoutError(AuthenticationError):
    """Raised when authentication times out."""


class InvalidCredentialsError(AuthenticationError):
    """Raised when credentials are invalid."""


# Browser Errors
class BrowserError(NotebookLMError):
    """Base exception for browser-related errors."""


class BrowserLaunchError(BrowserError):
    """Raised when browser fails to launch."""


class BrowserTimeoutError(BrowserError):
    """Raised when browser operation times out."""


class BrowserCrashedError(BrowserError):
    """Raised when browser crashes unexpectedly."""


class PageLoadError(BrowserError):
    """Raised when page fails to load."""


# Notebook Errors
class NotebookError(NotebookLMError):
    """Base exception for notebook-related errors."""


class NotebookNotFoundError(NotebookError):
    """Raised when notebook is not found."""


class NotebookAccessDeniedError(NotebookError):
    """Raised when access to notebook is denied."""


class InvalidNotebookURLError(NotebookError):
    """Raised when notebook URL is invalid."""


class NotebookAlreadyExistsError(NotebookError):
    """Raised when attempting to add duplicate notebook."""


# Library Errors
class LibraryError(NotebookLMError):
    """Base exception for library-related errors."""


class LibraryLoadError(LibraryError):
    """Raised when library fails to load."""


class LibrarySaveError(LibraryError):
    """Raised when library fails to save."""


class LibraryCorruptedError(LibraryError):
    """Raised when library data is corrupted."""


# Profile Errors
class ProfileError(NotebookLMError):
    """Base exception for profile-related errors."""


class ProfileNotFoundError(ProfileError):
    """Raised when profile is not found."""


class ProfileAlreadyExistsError(ProfileError):
    """Raised when attempting to create duplicate profile."""


class ProfileLoadError(ProfileError):
    """Raised when profile fails to load."""


class ProfileSaveError(ProfileError):
    """Raised when profile fails to save."""


class InvalidProfileError(ProfileError):
    """Raised when profile data is invalid."""


# Query Errors
class QueryError(NotebookLMError):
    """Base exception for query-related errors."""


class QueryTimeoutError(QueryError):
    """Raised when query times out."""


class QueryFailedError(QueryError):
    """Raised when query fails to execute."""


class EmptyResponseError(QueryError):
    """Raised when NotebookLM returns empty response."""


class InvalidQueryError(QueryError):
    """Raised when query is invalid or malformed."""


# Configuration Errors
class ConfigurationError(NotebookLMError):
    """Base exception for configuration errors."""


class InvalidConfigError(ConfigurationError):
    """Raised when configuration is invalid."""


class MissingConfigError(ConfigurationError):
    """Raised when required configuration is missing."""


class ConfigLoadError(ConfigurationError):
    """Raised when configuration fails to load."""


# Export Errors
class ExportError(NotebookLMError):
    """Base exception for export-related errors."""


class ExportFailedError(ExportError):
    """Raised when export operation fails."""


class InvalidExportFormatError(ExportError):
    """Raised when export format is invalid."""


# Validation Errors
class ValidationError(NotebookLMError):
    """Base exception for validation errors."""


class InvalidInputError(ValidationError):
    """Raised when input validation fails."""


class InvalidURLError(ValidationError):
    """Raised when URL validation fails."""


# Session Errors
class SessionError(NotebookLMError):
    """Base exception for session-related errors."""


class SessionExpiredError(SessionError):
    """Raised when session has expired."""


class SessionInvalidError(SessionError):
    """Raised when session is invalid."""


class SessionCreationError(SessionError):
    """Raised when session creation fails."""


# Network Errors
class NetworkError(NotebookLMError):
    """Base exception for network-related errors."""


class ConnectionError(NetworkError):
    """Raised when network connection fails."""


class TimeoutError(NetworkError):
    """Raised when network operation times out."""


# File System Errors
class FileSystemError(NotebookLMError):
    """Base exception for file system errors."""


class FileNotFoundError(FileSystemError):
    """Raised when file is not found."""


class FileWriteError(FileSystemError):
    """Raised when file write operation fails."""


class FileReadError(FileSystemError):
    """Raised when file read operation fails."""


class DirectoryNotFoundError(FileSystemError):
    """Raised when directory is not found."""


class DirectoryCreationError(FileSystemError):
    """Raised when directory creation fails."""
