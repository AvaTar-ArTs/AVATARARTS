"""Pytest configuration and fixtures for NotebookLM tests."""

import pytest
from pathlib import Path
from datetime import datetime
from notebooklm.models import Notebook, Profile, Library, Query, QueryResult


@pytest.fixture
def sample_notebook() -> Notebook:
    """Create a sample notebook for testing."""
    return Notebook(
        id="test-notebook",
        name="Test Notebook",
        url="https://notebooklm.google.com/notebook/test-id",
        description="A test notebook",
        topics=["testing", "development"],
        tags=["test", "dev"],
    )


@pytest.fixture
def sample_profile(tmp_path: Path) -> Profile:
    """Create a sample profile for testing."""
    profile_dir = tmp_path / "profiles" / "test-profile"
    profile_dir.mkdir(parents=True, exist_ok=True)

    return Profile(
        id="test-profile",
        name="Test Profile",
        email="test@example.com",
        description="A test profile",
        github_username="testuser",
        profile_dir=profile_dir,
    )


@pytest.fixture
def sample_library(sample_notebook: Notebook) -> Library:
    """Create a sample library for testing."""
    library = Library()
    library.add_notebook(sample_notebook)
    return library


@pytest.fixture
def sample_query() -> Query:
    """Create a sample query for testing."""
    return Query(
        question="What is the purpose of this notebook?",
        notebook_id="test-notebook",
        max_retries=3,
        timeout=60,
    )


@pytest.fixture
def sample_query_result() -> QueryResult:
    """Create a sample query result for testing."""
    return QueryResult(
        question="What is the purpose of this notebook?",
        answer="This notebook is for testing purposes.",
        notebook_id="test-notebook",
        notebook_name="Test Notebook",
        timestamp=datetime.now(),
        response_time=1.5,
        success=True,
    )


@pytest.fixture
def mock_browser(mocker):
    """Mock browser for testing."""
    return mocker.patch("notebooklm.core.browser.Browser")


@pytest.fixture
def mock_auth(mocker):
    """Mock authentication for testing."""
    return mocker.patch("notebooklm.core.auth.AuthManager")


@pytest.fixture
def temp_data_dir(tmp_path: Path) -> Path:
    """Create a temporary data directory for testing."""
    data_dir = tmp_path / "data"
    data_dir.mkdir(parents=True, exist_ok=True)

    # Create subdirectories
    (data_dir / "profiles").mkdir(exist_ok=True)
    (data_dir / "cache").mkdir(exist_ok=True)

    return data_dir


@pytest.fixture
def mock_config(mocker, temp_data_dir: Path):
    """Mock configuration for testing."""
    from notebooklm.models import Config, BrowserConfig, PathsConfig, LoggingConfig

    config = Config(
        env="test",
        debug=True,
        browser=BrowserConfig(headless=True, timeout=10000),
        paths=PathsConfig(
            data_dir=temp_data_dir,
            profiles_dir=temp_data_dir / "profiles",
            cache_dir=temp_data_dir / "cache",
        ),
        logging=LoggingConfig(level="DEBUG", console=False),
    )

    mocker.patch("notebooklm.utils.config.get_config", return_value=config)
    return config
