"""Browser automation core module with anti-detection features."""

import json
import random
import time
from pathlib import Path
from typing import Optional, Dict, Any, List
from patchright.sync_api import sync_playwright, Playwright, BrowserContext, Page

from ..models.config import BrowserConfig
from ..utils.logger import get_logger
from ..utils.helpers import retry, ensure_dir
from ..exceptions import (
    BrowserError,
    BrowserLaunchError,
    BrowserTimeoutError,
    BrowserCrashedError,
    PageLoadError,
)

logger = get_logger(__name__)


class Browser:
    """
    Browser automation manager with anti-detection features.

    Provides persistent browser contexts, cookie management, and stealth utilities
    for interacting with NotebookLM.
    """

    def __init__(
        self,
        config: BrowserConfig,
        user_data_dir: Path,
        state_file: Path,
    ) -> None:
        """
        Initialize browser manager.

        Args:
            config: Browser configuration
            user_data_dir: Directory for browser profile data
            state_file: Path to state.json for cookie persistence
        """
        self.config = config
        self.user_data_dir = ensure_dir(user_data_dir)
        self.state_file = state_file

        self._playwright: Optional[Playwright] = None
        self._context: Optional[BrowserContext] = None
        self._page: Optional[Page] = None

    @retry(max_attempts=3, delay=2.0)
    def launch(self) -> BrowserContext:
        """
        Launch browser with persistent context and anti-detection.

        Returns:
            Browser context

        Raises:
            BrowserLaunchError: If browser fails to launch
        """
        try:
            logger.info("Launching browser...")

            # Start Playwright
            self._playwright = sync_playwright().start()

            # Launch persistent context with Chrome
            logger.debug(f"User data dir: {self.user_data_dir}")
            logger.debug(f"Headless: {self.config.headless}")

            self._context = self._playwright.chromium.launch_persistent_context(
                user_data_dir=str(self.user_data_dir),
                channel="chrome",  # Use real Chrome
                headless=self.config.headless,
                no_viewport=True,
                ignore_default_args=["--enable-automation"],
                user_agent=self.config.user_agent,
                viewport={
                    "width": self.config.viewport_width,
                    "height": self.config.viewport_height,
                }
                if not self.config.headless
                else None,
                args=[
                    "--disable-blink-features=AutomationControlled",
                    "--disable-dev-shm-usage",
                    "--no-sandbox",
                ],
                slow_mo=self.config.slow_mo,
                devtools=self.config.devtools,
            )

            # Inject cookies from state file (Playwright bug workaround)
            self._inject_cookies()

            logger.info("Browser launched successfully")
            return self._context

        except Exception as e:
            logger.error(f"Failed to launch browser: {e}", exc_info=True)
            self.close()
            raise BrowserLaunchError(f"Failed to launch browser: {e}")

    def _inject_cookies(self) -> None:
        """
        Inject cookies from state file.

        Workaround for Playwright bug #36139 where session cookies
        (expires=-1) don't persist in user_data_dir automatically.
        """
        if not self.state_file.exists():
            logger.debug("No state file found for cookie injection")
            return

        if not self._context:
            logger.warning("No context available for cookie injection")
            return

        try:
            with open(self.state_file) as f:
                state = json.load(f)

            cookies = state.get("cookies", [])
            if cookies:
                self._context.add_cookies(cookies)
                logger.debug(f"Injected {len(cookies)} cookies from state file")

        except Exception as e:
            logger.warning(f"Could not inject cookies: {e}")

    def save_state(self) -> None:
        """Save browser state (cookies) to state file."""
        if not self._context:
            logger.warning("No context available to save state")
            return

        try:
            # Get cookies from all origins
            cookies = self._context.cookies()

            # Save to state file
            state = {"cookies": cookies}
            self.state_file.parent.mkdir(parents=True, exist_ok=True)

            with open(self.state_file, "w") as f:
                json.dump(state, f, indent=2)

            logger.debug(f"Saved {len(cookies)} cookies to state file")

        except Exception as e:
            logger.error(f"Failed to save browser state: {e}", exc_info=True)

    def new_page(self) -> Page:
        """
        Create a new page in the browser context.

        Returns:
            New page

        Raises:
            BrowserError: If context not available
        """
        if not self._context:
            raise BrowserError("Browser context not available")

        try:
            self._page = self._context.new_page()
            logger.debug("Created new page")
            return self._page

        except Exception as e:
            logger.error(f"Failed to create new page: {e}", exc_info=True)
            raise BrowserError(f"Failed to create new page: {e}")

    def goto(self, url: str, timeout: Optional[int] = None) -> None:
        """
        Navigate to URL.

        Args:
            url: URL to navigate to
            timeout: Optional timeout in milliseconds

        Raises:
            PageLoadError: If page fails to load
        """
        if not self._page:
            self._page = self.new_page()

        timeout = timeout or self.config.timeout

        try:
            logger.info(f"Navigating to: {url}")
            self._page.goto(url, timeout=timeout, wait_until="domcontentloaded")
            logger.debug("Page loaded successfully")

        except Exception as e:
            logger.error(f"Failed to load page: {e}", exc_info=True)
            raise PageLoadError(f"Failed to load page: {e}")

    def close(self) -> None:
        """Close browser and cleanup resources."""
        try:
            # Save state before closing
            if self._context:
                self.save_state()

            # Close context
            if self._context:
                self._context.close()
                self._context = None
                logger.debug("Browser context closed")

            # Stop playwright
            if self._playwright:
                self._playwright.stop()
                self._playwright = None
                logger.debug("Playwright stopped")

            logger.info("Browser closed successfully")

        except Exception as e:
            logger.error(f"Error closing browser: {e}", exc_info=True)

    @property
    def page(self) -> Optional[Page]:
        """Get current page."""
        return self._page

    @property
    def context(self) -> Optional[BrowserContext]:
        """Get browser context."""
        return self._context

    def __enter__(self) -> "Browser":
        """Context manager entry."""
        self.launch()
        return self

    def __exit__(self, exc_type: Any, exc_val: Any, exc_tb: Any) -> None:
        """Context manager exit."""
        self.close()


class StealthUtils:
    """Utilities for human-like browser interactions."""

    @staticmethod
    def random_delay(min_ms: int = 100, max_ms: int = 500) -> None:
        """
        Add random delay between actions.

        Args:
            min_ms: Minimum delay in milliseconds
            max_ms: Maximum delay in milliseconds
        """
        delay_seconds = random.uniform(min_ms / 1000, max_ms / 1000)
        time.sleep(delay_seconds)

    @staticmethod
    def human_type(
        page: Page,
        selector: str,
        text: str,
        wpm_min: int = 320,
        wpm_max: int = 480,
    ) -> None:
        """
        Type text with human-like speed and pauses.

        Args:
            page: Playwright page
            selector: Element selector
            text: Text to type
            wpm_min: Minimum words per minute
            wpm_max: Maximum words per minute
        """
        element = page.query_selector(selector)

        if not element:
            # Try waiting if not immediately found
            try:
                element = page.wait_for_selector(selector, timeout=2000)
            except Exception:
                logger.warning(f"Element not found for typing: {selector}")
                return

        if not element:
            logger.warning(f"Element not found: {selector}")
            return

        # Click to focus
        element.click()

        # Type with random delays
        for char in text:
            element.type(char, delay=random.uniform(25, 75))

            # Occasional longer pause (thinking)
            if random.random() < 0.05:
                time.sleep(random.uniform(0.15, 0.4))

    @staticmethod
    def realistic_click(page: Page, selector: str) -> None:
        """
        Click element with realistic movement.

        Args:
            page: Playwright page
            selector: Element selector
        """
        element = page.query_selector(selector)

        if not element:
            logger.warning(f"Element not found for click: {selector}")
            return

        # Get element position
        box = element.bounding_box()

        if box:
            # Move to element position with slight randomness
            x = box["x"] + box["width"] / 2 + random.uniform(-5, 5)
            y = box["y"] + box["height"] / 2 + random.uniform(-5, 5)

            page.mouse.move(x, y)
            StealthUtils.random_delay(50, 150)

        # Click
        element.click()
        StealthUtils.random_delay(100, 300)

    @staticmethod
    def wait_for_selector(
        page: Page,
        selector: str,
        timeout: int = 5000,
        state: str = "visible",
    ) -> bool:
        """
        Wait for element with timeout.

        Args:
            page: Playwright page
            selector: Element selector
            timeout: Timeout in milliseconds
            state: Element state to wait for

        Returns:
            True if element found, False otherwise
        """
        try:
            page.wait_for_selector(selector, timeout=timeout, state=state)
            return True
        except Exception as e:
            logger.debug(f"Element not found: {selector} - {e}")
            return False
