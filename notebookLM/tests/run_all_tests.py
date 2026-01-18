#!/usr/bin/env python3
"""
Master Test Runner for NotebookLM v3.0
Executes all test phases in sequence with progress reporting.
"""

import sys
import time
import subprocess
from pathlib import Path

# Colors for terminal output
class Colors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'


def print_header(text):
    """Print a header with formatting."""
    print()
    print(f"{Colors.BOLD}{Colors.HEADER}{'=' * 70}{Colors.ENDC}")
    print(f"{Colors.BOLD}{Colors.HEADER}{text.center(70)}{Colors.ENDC}")
    print(f"{Colors.BOLD}{Colors.HEADER}{'=' * 70}{Colors.ENDC}")
    print()


def print_phase(number, name):
    """Print phase header."""
    print()
    print(f"{Colors.BOLD}{Colors.OKCYAN}▶ Phase {number}: {name}{Colors.ENDC}")
    print(f"{Colors.OKCYAN}{'─' * 70}{Colors.ENDC}")
    print()


def run_test(script_path, description):
    """
    Run a test script and return success status.
    
    Args:
        script_path: Path to the test script
        description: Description of the test
    
    Returns:
        tuple: (success, duration)
    """
    print(f"{Colors.OKBLUE}Running: {description}{Colors.ENDC}")
    print(f"Script: {script_path}")
    print()
    
    start_time = time.time()
    
    try:
        # Run the test script
        result = subprocess.run(
            [sys.executable, str(script_path)],
            cwd=script_path.parent.parent,
            capture_output=False,  # Show output in real-time
            text=True,
        )
        
        duration = time.time() - start_time
        
        if result.returncode == 0:
            print()
            print(f"{Colors.OKGREEN}✅ {description} PASSED{Colors.ENDC}")
            print(f"{Colors.OKGREEN}Duration: {duration:.2f}s{Colors.ENDC}")
            return True, duration
        else:
            print()
            print(f"{Colors.FAIL}❌ {description} FAILED{Colors.ENDC}")
            print(f"{Colors.FAIL}Exit code: {result.returncode}{Colors.ENDC}")
            return False, duration
            
    except Exception as e:
        duration = time.time() - start_time
        print()
        print(f"{Colors.FAIL}❌ Error running {description}: {e}{Colors.ENDC}")
        return False, duration


def main():
    """Run all tests in sequence."""
    print_header("NotebookLM v3.0 - Complete Test Suite")
    
    print(f"{Colors.BOLD}This will run all test phases in sequence:{Colors.ENDC}")
    print("  1. Quick Import Tests (10 unit tests)")
    print("  2. Browser Module Tests (browser automation)")
    print("  3. Auth Module Tests (authentication flow)")
    print()
    print(f"{Colors.WARNING}Note: Browsers will open during tests. This is normal.{Colors.ENDC}")
    print()
    
    # Ask for confirmation
    response = input(f"{Colors.BOLD}Ready to run all tests? (y/N): {Colors.ENDC}").strip().lower()
    
    if response != 'y':
        print()
        print(f"{Colors.WARNING}Test run cancelled by user.{Colors.ENDC}")
        return
    
    # Test suite configuration
    tests_dir = Path(__file__).parent
    
    test_suite = [
        {
            "phase": 1,
            "name": "Quick Import Tests",
            "script": tests_dir / "quick_test.py",
            "description": "Unit tests for imports and models",
        },
        {
            "phase": 2,
            "name": "Browser Module Test",
            "script": tests_dir / "manual_test_browser.py",
            "description": "Browser automation integration tests",
        },
        {
            "phase": 3,
            "name": "Auth Module Test",
            "script": tests_dir / "manual_test_auth.py",
            "description": "Authentication flow tests",
        },
    ]
    
    # Track results
    results = []
    total_duration = 0
    overall_start = time.time()
    
    # Run each test phase
    for test in test_suite:
        print_phase(test["phase"], test["name"])
        
        success, duration = run_test(test["script"], test["description"])
        
        results.append({
            "name": test["name"],
            "success": success,
            "duration": duration,
        })
        
        total_duration += duration
        
        # Stop if a test fails
        if not success:
            print()
            print(f"{Colors.FAIL}⚠️  Test suite stopped due to failure.{Colors.ENDC}")
            break
        
        # Small delay between tests
        time.sleep(1)
    
    overall_duration = time.time() - overall_start
    
    # Print summary
    print_header("Test Suite Summary")
    
    passed = sum(1 for r in results if r["success"])
    total = len(results)
    
    print(f"{Colors.BOLD}Results:{Colors.ENDC}")
    print()
    
    for i, result in enumerate(results, 1):
        status = f"{Colors.OKGREEN}✅ PASSED" if result["success"] else f"{Colors.FAIL}❌ FAILED"
        print(f"  Phase {i}: {result['name']:<30} {status}{Colors.ENDC} ({result['duration']:.2f}s)")
    
    print()
    print(f"{Colors.BOLD}Statistics:{Colors.ENDC}")
    print(f"  Tests Passed: {passed}/{total}")
    print(f"  Success Rate: {(passed/total)*100:.0f}%")
    print(f"  Total Duration: {overall_duration:.2f}s")
    print()
    
    if passed == total:
        print(f"{Colors.BOLD}{Colors.OKGREEN}{'=' * 70}{Colors.ENDC}")
        print(f"{Colors.BOLD}{Colors.OKGREEN}{'🎉 ALL TESTS PASSED! 🎉'.center(70)}{Colors.ENDC}")
        print(f"{Colors.BOLD}{Colors.OKGREEN}{'=' * 70}{Colors.ENDC}")
        print()
        print(f"{Colors.OKGREEN}✅ NotebookLM v3.0 core modules are production-ready!{Colors.ENDC}")
        print()
        
        # Offer to run interactive auth test
        print(f"{Colors.BOLD}{'─' * 70}{Colors.ENDC}")
        print()
        print(f"{Colors.BOLD}Optional: Test Interactive Authentication{Colors.ENDC}")
        print()
        print("The authentication test above skipped the interactive login.")
        print("You can now test the full Google login flow interactively.")
        print()
        print(f"{Colors.WARNING}This will:{Colors.ENDC}")
        print("  • Open a browser window")
        print("  • Navigate to NotebookLM")
        print("  • Wait for you to complete Google login")
        print("  • Save authentication state")
        print()
        
        auth_response = input(f"{Colors.BOLD}Run interactive authentication test? (y/N): {Colors.ENDC}").strip().lower()
        
        if auth_response == 'y':
            print()
            print(f"{Colors.OKCYAN}Starting interactive authentication test...{Colors.ENDC}")
            print(f"{Colors.OKCYAN}You will have 5 minutes to complete the login.{Colors.ENDC}")
            print()
            
            # Run auth test again, but user can interact
            subprocess.run(
                [sys.executable, str(tests_dir / "manual_test_auth.py")],
                cwd=tests_dir.parent,
            )
        
        print()
        return 0
    else:
        print(f"{Colors.FAIL}{'=' * 70}{Colors.ENDC}")
        print(f"{Colors.FAIL}{'❌ SOME TESTS FAILED'.center(70)}{Colors.ENDC}")
        print(f"{Colors.FAIL}{'=' * 70}{Colors.ENDC}")
        print()
        return 1


if __name__ == "__main__":
    sys.exit(main())
