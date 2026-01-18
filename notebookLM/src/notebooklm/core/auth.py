"""Authentication management for NotebookLM."""

import json
import time
from datetime import datetime
from pathlib import Path
from typing import Optional, Dict, Any

from .browser import Browser
from ..models.config import BrowserConfig
from ..utils.logger import get_logger
from ..utils.helpers import timer
from ..exceptions import (
    AuthenticationError,
    AuthenticationTimeoutError,
    InvalidCredentialsError,
)

logger = get_logger(__name__)


class AuthManager:
    """
    Manages Google authentication for NotebookLM.

    Features:
    - Interactive Google login
    - Browser state persistence
    - Session restoration
    - Authentication status checking
    """

    NOTEBOOKLM_URL = "https://notebooklm.google.com"
    AUTH_TIMEOUT = 600  # 10 minutes

    def __init__(
        self,
        browser_config: BrowserConfig,
        browser_state_dir: Path,
        state_file: Path,
        auth_info_file: Path,
    ) -> None:
        """
        Initialize authentication manager.

        Args:
            browser_config: Browser configuration
            browser_state_dir: Directory for browser profile
            state_file: Path to state.json
            auth_info_file: Path to auth_info.json
        """
        self.browser_config = browser_config
        self.browser_state_dir = browser_state_dir
        self.state_file = state_file
        self.auth_info_file = auth_info_file

        # Ensure directories exist
        self.browser_state_dir.mkdir(parents=True, exist_ok=True)
        self.state_file.parent.mkdir(parents=True, exist_ok=True)

    def is_authenticated(self) -> bool:
        """
        Check if valid authentication exists.

        Returns:
            True if authenticated, False otherwise
        """
        if not self.state_file.exists():
            logger.debug("State file not found")
            return False

        # Check state file age (consider stale after 7 days)
        age_days = (time.time() - self.state_file.stat().st_mtime) / 86400

        if age_days > 7:
            logger.warning(f"Browser state is {age_days:.1f} days old")
            return False

        return True

    def get_auth_info(self) -> Dict[str, Any]:
        """
        Get authentication information.

        Returns:
            Dictionary with auth status and metadata
        """
        info: Dict[str, Any] = {
            "authenticated": self.is_authenticated(),
            "state_file": str(self.state_file),
            "state_exists": self.state_file.exists(),
            "timestamp": datetime.now().isoformat(),
        }

        # Load saved auth info if available
        if self.auth_info_file.exists():
            try:
                with open(self.auth_info_file) as f:
                    saved_info = json.load(f)
                    info.update(saved_info)
            except Exception as e:
                logger.warning(f"Could not load auth info: {e}")

        # Add state file age if it exists
        if info["state_exists"]:
            age_hours = (time.time() - self.state_file.stat().st_mtime) / 3600
            info["state_age_hours"] = round(age_hours, 2)
            info["state_age_days"] = round(age_hours / 24, 2)

        return info

    @timer
    def setup_auth(
        self,
        headless: bool = False,
        timeout_minutes: int = 10,
    ) -> bool:
        """
        Perform interactive authentication setup.

        Args:
            headless: Run browser in headless mode (False for login)
            timeout_minutes: Maximum time to wait for login

        Returns:
            True if authentication successful

        Raises:
            AuthenticationTimeoutError: If login times out
            AuthenticationError: If authentication fails
        """
        logger.info("🔐 Starting authentication setup...")
        logger.info(f"Timeout: {timeout_minutes} minutes")

        # Override headless for interactive login
        config = self.browser_config.model_copy(update={"headless": headless})

        browser = Browser(
            config=config,
            user_data_dir=self.browser_state_dir,
            state_file=self.state_file,
        )

        try:
            # Launch browser
            browser.launch()
            page = browser.new_page()

            # Navigate to NotebookLM
            logger.info("📖 Opening NotebookLM...")
            browser.goto(self.NOTEBOOKLM_URL)

            # Wait for user to complete login
            logger.info("")
            logger.info("⌛ Waiting for authentication...")
            logger.info("   Please complete Google login in the browser window")
            logger.info("   You have %d minutes", timeout_minutes)
            logger.info("")

            timeout_ms = timeout_minutes * 60 * 1000
            start_time = time.time()

            # Wait for authenticated page indicators
            authenticated = False
            while time.time() - start_time < timeout_minutes * 60:
                try:
                    # Check for various authenticated page indicators
                    if page.query_selector('[data-testid="notebook-list"]') or \
                       page.query_selector('button[aria-label*="New notebook"]') or \
                       page.url.startswith(f"{self.NOTEBOOKLM_URL}/notebook"):
                        authenticated = True
                        break

                    time.sleep(2)

                except Exception as e:
                    logger.debug(f"Check failed: {e}")
                    time.sleep(2)

            if not authenticated:
                raise AuthenticationTimeoutError(
                    f"Authentication timed out after {timeout_minutes} minutes"
                )

            logger.info("✅ Authentication successful!")

            # Save authentication state
            browser.save_state()

            # Save auth info
            self._save_auth_info({
                "authenticated": True,
                "authenticated_at": datetime.now().isoformat(),
                "method": "interactive",
            })

            return True

        except AuthenticationTimeoutError:
            raise

        except Exception as e:
            logger.error(f"Authentication failed: {e}", exc_info=True)
            raise AuthenticationError(f"Authentication failed: {e}")

        finally:
            browser.close()

    def _save_auth_info(self, info: Dict[str, Any]) -> None:
        """
        Save authentication info to file.

        Args:
            info: Authentication information dictionary
        """
        try:
            self.auth_info_file.parent.mkdir(parents=True, exist_ok=True)

            with open(self.auth_info_file, "w") as f:
                json.dump(info, f, indent=2)

            logger.debug(f"Saved auth info to {self.auth_info_file}")

        except Exception as e:
            logger.warning(f"Could not save auth info: {e}")

    def clear_auth(self) -> None:
        """Clear all authentication data."""
        try:
            # Remove state file
            if self.state_file.exists():
                self.state_file.unlink()
                logger.info("Removed state file")

            # Remove auth info
            if self.auth_info_file.exists():
                self.auth_info_file.unlink()
                logger.info("Removed auth info file")

            # Clear browser state directory
            import shutil
            if self.browser_state_dir.exists():
                shutil.rmtree(self.browser_state_dir, ignore_errors=True)
                self.browser_state_dir.mkdir(parents=True, exist_ok=True)
                logger.info("Cleared browser state directory")

            logger.info("✅ Authentication data cleared")

        except Exception as e:
            logger.error(f"Failed to clear auth data: {e}", exc_info=True)
            raise AuthenticationError(f"Failed to clear auth data: {e}")

    def refresh_auth(self) -> bool:
        """
        Refresh authentication by opening NotebookLM.

        Returns:
            True if still authenticated

        Raises:
            AuthenticationError: If not authenticated
        """
        if not self.is_authenticated():
            raise AuthenticationError("Not authenticated")

        logger.info("🔄 Refreshing authentication...")

        browser = Browser(
            config=self.browser_config,
            user_data_dir=self.browser_state_dir,
            state_file=self.state_file,
        )

        try:
            browser.launch()
            page = browser.new_page()
            browser.goto(self.NOTEBOOKLM_URL)

            # Check if still authenticated
            time.sleep(3)

            authenticated = (
                page.query_selector('[data-testid="notebook-list"]') is not None or
                page.query_selector('button[aria-label*="New notebook"]') is not None
            )

            if authenticated:
                logger.info("✅ Authentication still valid")
                browser.save_state()
                return True
            else:
                logger.warning("⚠️  Authentication expired")
                return False

        except Exception as e:
            logger.error(f"Failed to refresh auth: {e}", exc_info=True)
            raise AuthenticationError(f"Failed to refresh auth: {e}")

        finally:
            browser.close()
