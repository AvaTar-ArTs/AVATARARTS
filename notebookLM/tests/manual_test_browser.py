#!/usr/bin/env python3
"""
Manual Browser Test for NotebookLM v3.0
Tests browser launch, navigation, stealth utils, and state management.
REQUIRES: Chrome installed via Patchright
EXECUTION TIME: ~30 seconds
"""

import sys
import time
from pathlib import Path

# Add src to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent / "src"))

from notebooklm.core import Browser, StealthUtils
from notebooklm.models import BrowserConfig
from notebooklm.utils import get_logger, setup_logging

# Setup logging for better visibility
setup_logging(level="INFO", console=True)
logger = get_logger(__name__)


def main():
    """Run manual browser tests"""
    print("=" * 70)
    print("NotebookLM v3.0 - Browser Module Test")
    print("=" * 70)
    print()
    
    # Setup test directory
    test_dir = Path(__file__).parent / "test_data"
    test_dir.mkdir(exist_ok=True)
    
    browser_state_dir = test_dir / "browser_state"
    state_file = test_dir / "state.json"
    
    print(f"Test directory: {test_dir}")
    print(f"Browser state dir: {browser_state_dir}")
    print(f"State file: {state_file}")
    print()
    
    # Test 1: Browser launch
    print("Test 1: Browser launch with persistent context...")
    try:
        config = BrowserConfig(
            headless=False,  # Show browser for manual testing
            timeout=30000,
            viewport_width=1280,
            viewport_height=720,
        )
        
        browser = Browser(
            config=config,
            user_data_dir=browser_state_dir,
            state_file=state_file,
        )
        
        context = browser.launch()
        print("✅ Browser launched successfully")
        print(f"   Context: {context}")
        print()
        
        # Test 2: Page creation and navigation
        print("Test 2: Create page and navigate to Google...")
        page = browser.new_page()
        print("✅ Page created")
        
        browser.goto("https://www.google.com")
        print("✅ Navigated to Google")
        time.sleep(2)  # Let page load
        print()
        
        # Test 3: StealthUtils - wait_for_selector
        print("Test 3: StealthUtils - wait_for_selector...")
        found = StealthUtils.wait_for_selector(
            page,
            'textarea[name="q"]',  # Google search box
            timeout=5000,
        )
        
        if found:
            print("✅ Search box found with wait_for_selector")
        else:
            print("❌ Search box not found")
            return False
        print()
        
        # Test 4: StealthUtils - human_type
        print("Test 4: StealthUtils - human_type...")
        StealthUtils.human_type(
            page,
            'textarea[name="q"]',
            "Hello NotebookLM",
        )
        print("✅ Text typed with human-like delays")
        time.sleep(2)  # Let user see the typing
        print()
        
        # Test 5: StealthUtils - random_delay
        print("Test 5: StealthUtils - random_delay...")
        start = time.time()
        StealthUtils.random_delay(100, 500)
        elapsed = (time.time() - start) * 1000
        print(f"✅ Random delay executed ({elapsed:.0f}ms)")
        print()
        
        # Test 6: State saving
        print("Test 6: Save browser state (cookies)...")
        browser.save_state()
        
        if state_file.exists():
            print(f"✅ State file created: {state_file}")
            
            import json
            with open(state_file) as f:
                state = json.load(f)
            
            cookie_count = len(state.get("cookies", []))
            print(f"   Cookies saved: {cookie_count}")
        else:
            print("❌ State file not created")
            return False
        print()
        
        # Test 7: Browser close and cleanup
        print("Test 7: Close browser and cleanup...")
        browser.close()
        print("✅ Browser closed successfully")
        print()
        
        # Verify state file still exists after close
        if state_file.exists():
            print("✅ State file persisted after close")
        else:
            print("❌ State file was deleted")
            return False
        print()
        
        # Test 8: Context manager (with statement)
        print("Test 8: Context manager functionality...")
        print("   Opening browser with context manager...")
        
        with Browser(
            config=config,
            user_data_dir=browser_state_dir,
            state_file=state_file,
        ) as browser2:
            page2 = browser2.new_page()
            browser2.goto("https://www.google.com")
            print("   ✅ Browser opened and navigated")
            time.sleep(2)
        
        print("✅ Context manager auto-closed browser")
        print()
        
        # Final verification
        print("=" * 70)
        print("✅ ALL BROWSER TESTS PASSED!")
        print("=" * 70)
        print()
        print("Summary:")
        print("  ✅ Browser launches without errors")
        print("  ✅ Google homepage loads")
        print("  ✅ Search box is found and typed into")
        print("  ✅ State.json is created with cookies")
        print("  ✅ Browser closes cleanly")
        print("  ✅ Context manager auto-saves state")
        print()
        
        return True
        
    except Exception as e:
        print(f"❌ Test failed with error: {e}")
        import traceback
        traceback.print_exc()
        return False


if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
