"""Configuration management utilities."""

from pathlib import Path
from typing import Optional
from ..models.config import Config

# Global config instance
_config: Optional[Config] = None


def get_config() -> Config:
    """
    Get the global configuration instance.

    Returns:
        Config instance

    Raises:
        RuntimeError: If configuration not loaded
    """
    global _config

    if _config is None:
        # Try to load from environment
        _config = Config.from_env()

    return _config


def load_config(config_path: Optional[Path] = None) -> Config:
    """
    Load configuration from file or environment.

    Args:
        config_path: Optional path to config file

    Returns:
        Config instance
    """
    global _config

    if config_path and config_path.exists():
        _config = Config.from_file(config_path)
    else:
        _config = Config.from_env()

    return _config


def save_config(config: Config, config_path: Path) -> None:
    """
    Save configuration to file.

    Args:
        config: Config instance to save
        config_path: Path to save configuration
    """
    config.save_to_file(config_path)


def set_config(config: Config) -> None:
    """
    Set the global configuration instance.

    Args:
        config: Config instance to set
    """
    global _config
    _config = config
