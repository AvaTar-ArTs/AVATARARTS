"""Configuration models for NotebookLM."""

from pathlib import Path
from typing import Optional
from pydantic import BaseModel, Field, field_validator


class BrowserConfig(BaseModel):
    """Browser configuration settings."""

    headless: bool = Field(default=False, description="Run browser in headless mode")
    timeout: int = Field(default=30000, description="Browser timeout in milliseconds")
    user_agent: Optional[str] = Field(
        default=None, description="Custom user agent string"
    )
    viewport_width: int = Field(default=1920, description="Browser viewport width")
    viewport_height: int = Field(default=1080, description="Browser viewport height")
    slow_mo: int = Field(
        default=0, description="Slow down operations by milliseconds"
    )
    devtools: bool = Field(default=False, description="Open DevTools on browser launch")

    @field_validator("timeout")
    @classmethod
    def validate_timeout(cls, v: int) -> int:
        """Validate timeout is positive."""
        if v <= 0:
            raise ValueError("Timeout must be positive")
        return v


class PathsConfig(BaseModel):
    """File system paths configuration."""

    data_dir: Path = Field(default=Path("data"), description="Data directory path")
    profiles_dir: Path = Field(
        default=Path("data/profiles"), description="Profiles directory path"
    )
    cache_dir: Path = Field(
        default=Path("data/cache"), description="Cache directory path"
    )
    logs_dir: Path = Field(default=Path("logs"), description="Logs directory path")

    @field_validator("data_dir", "profiles_dir", "cache_dir", "logs_dir", mode="after")
    @classmethod
    def resolve_path(cls, v: Path) -> Path:
        """Resolve and create path if it doesn't exist."""
        path = v.expanduser().resolve()
        path.mkdir(parents=True, exist_ok=True)
        return path


class LoggingConfig(BaseModel):
    """Logging configuration settings."""

    level: str = Field(default="INFO", description="Log level")
    format: str = Field(
        default="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        description="Log format string",
    )
    file: Optional[str] = Field(default=None, description="Log file path")
    console: bool = Field(default=True, description="Enable console logging")
    rotation: Optional[str] = Field(
        default="10 MB", description="Log file rotation size"
    )

    @field_validator("level")
    @classmethod
    def validate_level(cls, v: str) -> str:
        """Validate log level."""
        valid_levels = ["DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"]
        v_upper = v.upper()
        if v_upper not in valid_levels:
            raise ValueError(f"Invalid log level. Must be one of: {valid_levels}")
        return v_upper


class Config(BaseModel):
    """Main configuration for NotebookLM."""

    # Application settings
    env: str = Field(default="production", description="Environment name")
    debug: bool = Field(default=False, description="Enable debug mode")
    default_profile: str = Field(
        default="default", description="Default profile name"
    )

    # Sub-configurations
    browser: BrowserConfig = Field(
        default_factory=BrowserConfig, description="Browser configuration"
    )
    paths: PathsConfig = Field(
        default_factory=PathsConfig, description="Paths configuration"
    )
    logging: LoggingConfig = Field(
        default_factory=LoggingConfig, description="Logging configuration"
    )

    # Performance settings
    max_retries: int = Field(default=3, description="Maximum number of retries")
    retry_delay: int = Field(default=1, description="Delay between retries in seconds")
    query_timeout: int = Field(default=60, description="Query timeout in seconds")

    # Feature flags
    enable_analytics: bool = Field(default=False, description="Enable analytics")
    enable_telemetry: bool = Field(default=False, description="Enable telemetry")
    enable_auto_update: bool = Field(default=False, description="Enable auto-update")

    class Config:
        """Pydantic configuration."""

        extra = "allow"
        validate_assignment = True

    @classmethod
    def from_env(cls) -> "Config":
        """
        Load configuration from environment variables.

        Returns:
            Config object populated from environment variables
        """
        import os
        from dotenv import load_dotenv

        load_dotenv()

        return cls(
            env=os.getenv("NOTEBOOKLM_ENV", "production"),
            debug=os.getenv("NOTEBOOKLM_DEBUG", "false").lower() == "true",
            default_profile=os.getenv("NOTEBOOKLM_DEFAULT_PROFILE", "default"),
            browser=BrowserConfig(
                headless=os.getenv("NOTEBOOKLM_BROWSER_HEADLESS", "false").lower()
                == "true",
                timeout=int(os.getenv("NOTEBOOKLM_BROWSER_TIMEOUT", "30000")),
                user_agent=os.getenv("NOTEBOOKLM_BROWSER_USER_AGENT"),
            ),
            paths=PathsConfig(
                data_dir=Path(os.getenv("NOTEBOOKLM_DATA_DIR", "data")),
                profiles_dir=Path(
                    os.getenv("NOTEBOOKLM_PROFILES_DIR", "data/profiles")
                ),
                cache_dir=Path(os.getenv("NOTEBOOKLM_CACHE_DIR", "data/cache")),
            ),
            logging=LoggingConfig(
                level=os.getenv("NOTEBOOKLM_LOG_LEVEL", "INFO"),
                file=os.getenv("NOTEBOOKLM_LOG_FILE"),
                format=os.getenv(
                    "NOTEBOOKLM_LOG_FORMAT",
                    "%(asctime)s - %(name)s - %(levelname)s - %(message)s",
                ),
            ),
            max_retries=int(os.getenv("NOTEBOOKLM_MAX_RETRIES", "3")),
            retry_delay=int(os.getenv("NOTEBOOKLM_RETRY_DELAY", "1")),
            query_timeout=int(os.getenv("NOTEBOOKLM_QUERY_TIMEOUT", "60")),
            enable_analytics=os.getenv("NOTEBOOKLM_ENABLE_ANALYTICS", "false").lower()
            == "true",
            enable_telemetry=os.getenv("NOTEBOOKLM_ENABLE_TELEMETRY", "false").lower()
            == "true",
            enable_auto_update=os.getenv(
                "NOTEBOOKLM_ENABLE_AUTO_UPDATE", "false"
            ).lower()
            == "true",
        )

    @classmethod
    def from_file(cls, config_path: Path) -> "Config":
        """
        Load configuration from YAML file.

        Args:
            config_path: Path to configuration file

        Returns:
            Config object populated from file
        """
        import yaml

        with open(config_path) as f:
            data = yaml.safe_load(f)

        return cls(**data)

    def save_to_file(self, config_path: Path) -> None:
        """
        Save configuration to YAML file.

        Args:
            config_path: Path to save configuration to
        """
        import yaml

        with open(config_path, "w") as f:
            yaml.dump(self.model_dump(), f, default_flow_style=False, sort_keys=False)
