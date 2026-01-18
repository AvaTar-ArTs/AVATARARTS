"""
NotebookLM v3.0 - Enterprise-grade NotebookLM automation.

This package provides a comprehensive toolkit for automating Google NotebookLM
with multi-account support, advanced browser automation, and rich CLI interface.

Example:
    >>> from notebooklm import NotebookLM
    >>> nlm = NotebookLM()
    >>> notebooks = nlm.library.list_notebooks()
    >>> answer = nlm.query("What is X?", notebook_id="my-notebook")

Modules:
    core: Core functionality (auth, browser, session, query)
    models: Data models (notebook, profile, config)
    managers: Business logic (notebook, profile, library, export)
    cli: Command-line interface
    utils: Utility functions and helpers
"""

from importlib.metadata import version, PackageNotFoundError

try:
    __version__ = version("notebooklm")
except PackageNotFoundError:
    __version__ = "3.0.0"

__author__ = "AvaTar-ArTs"
__email__ = "me@avatararts.org"
__license__ = "MIT"
__all__ = [
    "__version__",
    "__author__",
    "__email__",
]
