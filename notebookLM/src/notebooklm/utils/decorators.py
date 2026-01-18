"""Useful decorators for NotebookLM."""

import functools
from typing import Any, Callable, TypeVar
from ..exceptions import ProfileNotFoundError, NotebookNotFoundError
from ..utils.logger import get_logger

logger = get_logger(__name__)

T = TypeVar("T")


def require_profile(func: Callable[..., T]) -> Callable[..., T]:
    """
    Decorator to ensure a profile is loaded before executing function.

    Args:
        func: Function to decorate

    Returns:
        Decorated function

    Raises:
        ProfileNotFoundError: If no profile is loaded
    """

    @functools.wraps(func)
    def wrapper(self: Any, *args: Any, **kwargs: Any) -> T:
        if not hasattr(self, "current_profile") or self.current_profile is None:
            raise ProfileNotFoundError("No profile loaded. Please switch to a profile first.")

        return func(self, *args, **kwargs)

    return wrapper


def require_notebook(func: Callable[..., T]) -> Callable[..., T]:
    """
    Decorator to ensure a notebook is selected before executing function.

    Args:
        func: Function to decorate

    Returns:
        Decorated function

    Raises:
        NotebookNotFoundError: If no notebook is selected
    """

    @functools.wraps(func)
    def wrapper(self: Any, *args: Any, **kwargs: Any) -> T:
        if not hasattr(self, "active_notebook") or self.active_notebook is None:
            raise NotebookNotFoundError(
                "No notebook selected. Please select a notebook first."
            )

        return func(self, *args, **kwargs)

    return wrapper


def require_auth(func: Callable[..., T]) -> Callable[..., T]:
    """
    Decorator to ensure authentication before executing function.

    Args:
        func: Function to decorate

    Returns:
        Decorated function

    Raises:
        AuthenticationError: If not authenticated
    """

    @functools.wraps(func)
    def wrapper(self: Any, *args: Any, **kwargs: Any) -> T:
        from ..exceptions import AuthenticationError

        if not hasattr(self, "is_authenticated") or not self.is_authenticated():
            raise AuthenticationError(
                "Not authenticated. Please authenticate first."
            )

        return func(self, *args, **kwargs)

    return wrapper


def log_execution(func: Callable[..., T]) -> Callable[..., T]:
    """
    Decorator to log function execution.

    Args:
        func: Function to decorate

    Returns:
        Decorated function
    """

    @functools.wraps(func)
    def wrapper(*args: Any, **kwargs: Any) -> T:
        func_name = func.__qualname__
        logger.info(f"Executing {func_name}")

        try:
            result = func(*args, **kwargs)
            logger.info(f"Completed {func_name}")
            return result
        except Exception as e:
            logger.error(f"Failed {func_name}: {e}", exc_info=True)
            raise

    return wrapper


def deprecated(reason: str) -> Callable[[Callable[..., T]], Callable[..., T]]:
    """
    Decorator to mark function as deprecated.

    Args:
        reason: Reason for deprecation

    Returns:
        Decorator function
    """

    def decorator(func: Callable[..., T]) -> Callable[..., T]:
        @functools.wraps(func)
        def wrapper(*args: Any, **kwargs: Any) -> T:
            import warnings

            warnings.warn(
                f"{func.__name__} is deprecated: {reason}",
                category=DeprecationWarning,
                stacklevel=2,
            )
            logger.warning(f"Deprecated function called: {func.__name__} - {reason}")

            return func(*args, **kwargs)

        return wrapper

    return decorator
