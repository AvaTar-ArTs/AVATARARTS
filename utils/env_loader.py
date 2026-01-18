"""
Environment Configuration Loader

This module provides utilities to load environment variables
from the ~/.env.d/ directory structure.
"""

import os
import json
import yaml
from pathlib import Path
from typing import Dict, Any, Optional
import logging

logger = logging.getLogger(__name__)

class EnvLoader:
    """Load environment configurations from ~/.env.d/ directory"""
    
    def __init__(self, env_name: str = None):
        """
        Initialize the environment loader.
        
        Args:
            env_name: Environment name (development, production, testing).
                     If None, uses ENVIRONMENT environment variable or 'development'
        """
        self.env_name = env_name or os.getenv('ENVIRONMENT', 'development')
        self.base_dir = Path.home() / '.env.d'
        
        if not self.base_dir.exists():
            logger.warning(f"Environment directory not found: {self.base_dir}")
            self.base_dir.mkdir(parents=True, exist_ok=True)
    
    def load_all(self) -> Dict[str, Any]:
        """
        Load all configurations for the current environment.
        
        Returns:
            Dictionary containing all configuration values
        """
        config = {}
        
        # Load base configurations first
        base_dir = self.base_dir / 'base'
        if base_dir.exists():
            config.update(self._load_directory(base_dir))
        
        # Load environment-specific configurations (overrides base)
        env_dir = self.base_dir / self.env_name
        if env_dir.exists():
            config.update(self._load_directory(env_dir))
        
        # Set environment variables
        for key, value in config.items():
            if isinstance(value, (str, int, float, bool)):
                os.environ[key] = str(value)
        
        return config
    
    def _load_directory(self, directory: Path) -> Dict[str, Any]:
        """Load all configuration files from a directory"""
        config = {}
        
        for file_path in directory.iterdir():
            if file_path.is_file():
                file_config = self._load_file(file_path)
                config.update(file_config)
        
        return config
    
    def _load_file(self, file_path: Path) -> Dict[str, Any]:
        """Load configuration from a single file based on its extension"""
        if file_path.suffix == '.env':
            return self._load_env_file(file_path)
        elif file_path.suffix == '.json':
            return self._load_json_file(file_path)
        elif file_path.suffix in ['.yaml', '.yml']:
            return self._load_yaml_file(file_path)
        else:
            logger.warning(f"Unsupported file type: {file_path}")
            return {}
    
    def _load_env_file(self, file_path: Path) -> Dict[str, Any]:
        """Load environment variables from .env file"""
        config = {}
        
        try:
            with open(file_path, 'r') as f:
                for line in f:
                    line = line.strip()
                    # Skip empty lines and comments
                    if not line or line.startswith('#'):
                        continue
                    
                    # Parse KEY=VALUE
                    if '=' in line:
                        key, value = line.split('=', 1)
                        key = key.strip()
                        value = value.strip()
                        
                        # Remove quotes if present
                        if (value.startswith('"') and value.endswith('"')) or \
                           (value.startswith("'") and value.endswith("'")):
                            value = value[1:-1]
                        
                        config[key] = value
        except Exception as e:
            logger.error(f"Error loading .env file {file_path}: {e}")
        
        return config
    
    def _load_json_file(self, file_path: Path) -> Dict[str, Any]:
        """Load configuration from JSON file"""
        try:
            with open(file_path, 'r') as f:
                return json.load(f)
        except Exception as e:
            logger.error(f"Error loading JSON file {file_path}: {e}")
            return {}
    
    def _load_yaml_file(self, file_path: Path) -> Dict[str, Any]:
        """Load configuration from YAML file"""
        try:
            with open(file_path, 'r') as f:
                return yaml.safe_load(f)
        except Exception as e:
            logger.error(f"Error loading YAML file {file_path}: {e}")
            return {}
    
    def get(self, key: str, default: Any = None) -> Any:
        """
        Get a configuration value.
        
        Args:
            key: Configuration key
            default: Default value if key not found
            
        Returns:
            Configuration value or default
        """
        # First check environment variables
        value = os.getenv(key)
        if value is not None:
            return value
        
        # Try to load from files if not in environment
        config = self.load_all()
        return config.get(key, default)

# Global instance for easy access
loader = EnvLoader()

def load_config(env_name: str = None) -> Dict[str, Any]:
    """
    Convenience function to load configuration.
    
    Args:
        env_name: Environment name
        
    Returns:
        Configuration dictionary
    """
    return EnvLoader(env_name).load_all()

def get_config(key: str, default: Any = None) -> Any:
    """
    Convenience function to get a configuration value.
    
    Args:
        key: Configuration key
        default: Default value
        
    Returns:
        Configuration value
    """
    return loader.get(key, default)
