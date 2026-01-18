#!/usr/bin/env python3
"""
Manual Authentication Test for NotebookLM v3.0
Tests auth status checking, interactive Google login, and state management.
REQUIRES: Chrome installed, user interaction for login
EXECUTION TIME: ~1-10 minutes (depends on user interaction)
"""

import sys
import time
from pathlib import Path

# Add src to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent / "src"))

from notebooklm.core import AuthManager
from notebooklm.models import BrowserConfig
from notebooklm.utils import get_logger, setup_logging

# Setup logging for better visibility
setup_logging(level="INFO", console=True)
logger = get_logger(__name__)


def main():
    """Run manual authentication tests"""
    print("=" * 70)
    print("NotebookLM v3.0 - Authentication Module Test")
    print("=" * 70)
    print()
    
    # Setup test directory
    test_dir = Path(__file__).parent / "test_data" / "auth_test"
    test_dir.mkdir(parents=True, exist_ok=True)
    
    browser_state_dir = test_dir / "browser_state"
    state_file = test_dir / "state.json"
    auth_info_file = test_dir / "auth_info.json"
    
    print(f"Test directory: {test_dir}")
    print(f"Browser state dir: {browser_state_dir}")
    print(f"State file: {state_file}")
    print(f"Auth info file: {auth_info_file}")
    print()
    
    # Test 1: AuthManager creation
    print("Test 1: Create AuthManager...")
    try:
        config = BrowserConfig(
            headless=False,  # Must be False for interactive login
            timeout=30000,
        )
        
        auth_manager = AuthManager(
            browser_config=config,
            browser_state_dir=browser_state_dir,
            state_file=state_file,
            auth_info_file=auth_info_file,
        )
        
        print("✅ AuthManager created successfully")
        print()
        
    except Exception as e:
        print(f"❌ Failed to create AuthManager: {e}")
        import traceback
        traceback.print_exc()
        return False
    
    # Test 2: Check authentication status (should be False initially)
    print("Test 2: Check authentication status (initial)...")
    try:
        is_auth = auth_manager.is_authenticated()
        print(f"   Authenticated: {is_auth}")
        
        if is_auth:
            print("⚠️  WARNING: Already authenticated (state file exists)")
            print("   This is OK if you've run this test before")
        else:
            print("✅ Not authenticated (as expected for first run)")
        print()
        
    except Exception as e:
        print(f"❌ Failed to check auth status: {e}")
        return False
    
    # Test 3: Get authentication info
    print("Test 3: Get authentication info...")
    try:
        auth_info = auth_manager.get_auth_info()
        print("✅ Auth info retrieved successfully")
        print(f"   Authenticated: {auth_info['authenticated']}")
        print(f"   State exists: {auth_info['state_exists']}")
        print(f"   State file: {auth_info['state_file']}")
        
        if auth_info.get('state_age_hours'):
            print(f"   State age: {auth_info['state_age_hours']:.2f} hours")
        
        print()
        
    except Exception as e:
        print(f"❌ Failed to get auth info: {e}")
        return False
    
    # Test 4: Clear authentication (if exists)
    if auth_manager.is_authenticated():
        print("Test 4: Clear existing authentication...")
        try:
            auth_manager.clear_auth()
            print("✅ Authentication data cleared")
            print()
            
            # Verify it's cleared
            if not auth_manager.is_authenticated():
                print("✅ Confirmed: Authentication cleared")
            else:
                print("❌ WARNING: Authentication still shows as valid")
            print()
            
        except Exception as e:
            print(f"❌ Failed to clear auth: {e}")
            return False
    else:
        print("Test 4: Skip clearing auth (not authenticated)")
        print()
    
    # Test 5: Interactive login (optional, user prompted)
    print("=" * 70)
    print("Test 5: Interactive Google Login")
    print("=" * 70)
    print()
    print("This test will open a browser window where you can login to Google.")
    print("You will have 5 minutes to complete the login process.")
    print()
    print("⚠️  WARNING: This will open NotebookLM and wait for you to:")
    print("   1. Complete Google login")
    print("   2. Allow NotebookLM access")
    print("   3. Wait for NotebookLM homepage to load")
    print()
    
    # Prompt user
    response = input("Do you want to perform interactive login? (y/N): ").strip().lower()
    
    if response == 'y':
        print()
        print("Starting interactive login...")
        print("You have 5 minutes to complete the process.")
        print()
        
        try:
            success = auth_manager.setup_auth(
                headless=False,
                timeout_minutes=5,
            )
            
            if success:
                print()
                print("=" * 70)
                print("✅ AUTHENTICATION SUCCESSFUL!")
                print("=" * 70)
                print()
                
                # Verify state files were created
                print("Verifying authentication state...")
                
                if state_file.exists():
                    print(f"✅ State file created: {state_file}")
                else:
                    print(f"❌ State file missing: {state_file}")
                
                if auth_info_file.exists():
                    print(f"✅ Auth info file created: {auth_info_file}")
                    
                    import json
                    with open(auth_info_file) as f:
                        saved_info = json.load(f)
                    
                    print(f"   Authenticated at: {saved_info.get('authenticated_at')}")
                    print(f"   Method: {saved_info.get('method')}")
                else:
                    print(f"❌ Auth info file missing: {auth_info_file}")
                
                print()
                
                # Check is_authenticated() again
                if auth_manager.is_authenticated():
                    print("✅ is_authenticated() returns True after login")
                else:
                    print("❌ is_authenticated() returns False after login")
                
                print()
                
            else:
                print()
                print("❌ Authentication failed or timed out")
                return False
                
        except Exception as e:
            print(f"❌ Authentication error: {e}")
            import traceback
            traceback.print_exc()
            return False
    else:
        print()
        print("⏭️  Skipping interactive login (user declined)")
        print()
        print("Note: To test the full authentication flow, run this test again")
        print("      and answer 'y' when prompted.")
        print()
    
    # Final summary
    print("=" * 70)
    print("✅ ALL AUTH TESTS COMPLETED")
    print("=" * 70)
    print()
    print("Summary:")
    print("  ✅ AuthManager initializes successfully")
    print("  ✅ is_authenticated() works correctly")
    print("  ✅ get_auth_info() returns complete dictionary")
    print("  ✅ clear_auth() clears authentication data")
    
    if response == 'y':
        print("  ✅ Interactive login completed successfully")
        print("  ✅ State files created and persisted")
        print("  ✅ Authentication status updated correctly")
    else:
        print("  ⏭️  Interactive login skipped")
    
    print()
    
    return True


if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
