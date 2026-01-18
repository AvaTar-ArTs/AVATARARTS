#!/usr/bin/env python3
"""
Quick Import Tests for NotebookLM v3.0
Tests module imports, Pydantic models, config loading, and validators.
NO BROWSER REQUIRED - Fast execution (~2 seconds)
"""

import sys
from pathlib import Path

# Add src to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent / "src"))


def test_imports():
    """Test 1: Core module imports"""
    print("Test 1: Core module imports...", end=" ")
    try:
        from notebooklm.core import Browser, AuthManager, StealthUtils
        
        assert Browser is not None
        assert AuthManager is not None
        assert StealthUtils is not None
        print("✅ PASSED")
        return True
    except Exception as e:
        print(f"❌ FAILED: {e}")
        return False


def test_model_imports():
    """Test 2: Model imports"""
    print("Test 2: Model imports...", end=" ")
    try:
        from notebooklm.models import (
            Config,
            BrowserConfig,
            Notebook,
            Library,
            Profile,
            Query,
        )
        
        assert Config is not None
        assert BrowserConfig is not None
        assert Notebook is not None
        assert Library is not None
        assert Profile is not None
        assert Query is not None
        print("✅ PASSED")
        return True
    except Exception as e:
        print(f"❌ FAILED: {e}")
        return False


def test_utils_imports():
    """Test 3: Utils imports"""
    print("Test 3: Utils imports...", end=" ")
    try:
        from notebooklm.utils import (
            get_config,
            get_logger,
            validate_url,
            retry,
            timer,
        )
        
        assert get_config is not None
        assert get_logger is not None
        assert validate_url is not None
        assert retry is not None
        assert timer is not None
        print("✅ PASSED")
        return True
    except Exception as e:
        print(f"❌ FAILED: {e}")
        return False


def test_exception_imports():
    """Test 4: Exception imports"""
    print("Test 4: Exception imports...", end=" ")
    try:
        from notebooklm.exceptions import (
            NotebookLMError,
            BrowserError,
            AuthenticationError,
            NotebookError,
            QueryError,
        )
        
        assert NotebookLMError is not None
        assert BrowserError is not None
        assert AuthenticationError is not None
        assert NotebookError is not None
        assert QueryError is not None
        print("✅ PASSED")
        return True
    except Exception as e:
        print(f"❌ FAILED: {e}")
        return False


def test_browser_config_creation():
    """Test 5: BrowserConfig creation with Pydantic validation"""
    print("Test 5: BrowserConfig creation...", end=" ")
    try:
        from notebooklm.models import BrowserConfig
        
        # Create valid config
        config = BrowserConfig(
            headless=True,
            timeout=30000,
            viewport_width=1920,
            viewport_height=1080,
        )
        
        assert config.headless is True
        assert config.timeout == 30000
        assert config.viewport_width == 1920
        assert config.viewport_height == 1080
        
        # Test validator - timeout must be positive
        try:
            invalid_config = BrowserConfig(timeout=-1)
            print(f"❌ FAILED: Validator did not catch negative timeout")
            return False
        except ValueError:
            # Expected to fail
            pass
        
        print("✅ PASSED")
        return True
    except Exception as e:
        print(f"❌ FAILED: {e}")
        return False


def test_notebook_model_creation():
    """Test 6: Notebook model creation and validation"""
    print("Test 6: Notebook model creation...", end=" ")
    try:
        from notebooklm.models import Notebook
        
        # Create valid notebook
        notebook = Notebook(
            id="test-notebook",
            name="Test Notebook",
            url="https://notebooklm.google.com/notebook/abc123",
            description="A test notebook",
            topics=["testing", "demo"],
            tags=["test"],
        )
        
        assert notebook.id == "test-notebook"
        assert notebook.name == "Test Notebook"
        assert "testing" in notebook.topics
        assert "test" in notebook.tags
        
        # Test URL validator - must be NotebookLM URL
        try:
            invalid_notebook = Notebook(
                id="invalid",
                name="Invalid",
                url="https://google.com",  # Invalid URL
            )
            print(f"❌ FAILED: Validator did not catch invalid URL")
            return False
        except ValueError:
            # Expected to fail
            pass
        
        print("✅ PASSED")
        return True
    except Exception as e:
        print(f"❌ FAILED: {e}")
        return False


def test_library_operations():
    """Test 7: Library operations (add/retrieve notebooks)"""
    print("Test 7: Library operations...", end=" ")
    try:
        from notebooklm.models import Library, Notebook
        
        # Create library
        library = Library()
        
        # Create and add notebook
        notebook = Notebook(
            id="nb1",
            name="Notebook 1",
            url="https://notebooklm.google.com/notebook/test1",
        )
        
        library.add_notebook(notebook)
        
        assert len(library.notebooks) == 1
        assert library.get_notebook("nb1") is not None
        assert library.active_notebook_id == "nb1"  # First notebook becomes active
        
        # Test duplicate prevention
        try:
            library.add_notebook(notebook)  # Same ID
            print(f"❌ FAILED: Library allowed duplicate notebook")
            return False
        except ValueError:
            # Expected to fail
            pass
        
        print("✅ PASSED")
        return True
    except Exception as e:
        print(f"❌ FAILED: {e}")
        return False


def test_config_loading():
    """Test 8: Config loading from environment"""
    print("Test 8: Config loading from environment...", end=" ")
    try:
        from notebooklm.models import Config
        
        # Load config from environment
        config = Config.from_env()
        
        assert config is not None
        assert config.browser is not None
        assert config.paths is not None
        assert config.logging is not None
        assert config.env in ["production", "development", "test"]
        assert config.max_retries >= 1
        
        print("✅ PASSED")
        return True
    except Exception as e:
        print(f"❌ FAILED: {e}")
        return False


def test_logger_setup():
    """Test 9: Logger setup and usage"""
    print("Test 9: Logger setup and usage...", end=" ")
    try:
        from notebooklm.utils import get_logger, setup_logging
        
        # Setup logging
        setup_logging(level="INFO", console=False)
        
        # Get logger
        logger = get_logger("test")
        
        assert logger is not None
        assert logger.name == "test"
        
        # Test logging (shouldn't crash)
        logger.info("Test log message")
        logger.debug("Debug message")
        logger.warning("Warning message")
        
        print("✅ PASSED")
        return True
    except Exception as e:
        print(f"❌ FAILED: {e}")
        return False


def test_url_validator():
    """Test 10: URL validator functionality"""
    print("Test 10: URL validator functionality...", end=" ")
    try:
        from notebooklm.utils import validate_url
        from notebooklm.exceptions import InvalidURLError
        
        # Valid URLs
        assert validate_url("https://google.com") is True
        assert validate_url("http://localhost:8000") is True
        assert validate_url("https://notebooklm.google.com/notebook/123") is True
        
        # Invalid URLs should raise InvalidURLError
        try:
            validate_url("")
            print(f"❌ FAILED: Validator accepted empty URL")
            return False
        except InvalidURLError:
            pass  # Expected
        
        try:
            validate_url("not-a-url")
            print(f"❌ FAILED: Validator accepted invalid URL")
            return False
        except InvalidURLError:
            pass  # Expected
        
        print("✅ PASSED")
        return True
    except Exception as e:
        print(f"❌ FAILED: {e}")
        return False


def main():
    """Run all tests"""
    print("=" * 60)
    print("NotebookLM v3.0 - Quick Import Tests")
    print("=" * 60)
    print()
    
    tests = [
        test_imports,
        test_model_imports,
        test_utils_imports,
        test_exception_imports,
        test_browser_config_creation,
        test_notebook_model_creation,
        test_library_operations,
        test_config_loading,
        test_logger_setup,
        test_url_validator,
    ]
    
    results = []
    for test in tests:
        results.append(test())
    
    print()
    print("=" * 60)
    
    passed = sum(results)
    total = len(results)
    
    print(f"Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("✅ ALL TESTS PASSED!")
    else:
        print(f"❌ {total - passed} tests failed")
        sys.exit(1)
    
    print("=" * 60)


if __name__ == "__main__":
    main()
