#!/usr/bin/env python3
"""
Automated Test Runner for NotebookLM v3.0
Executes all test phases automatically (non-interactive).
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


def run_test(script_path, description, skip_interactive=False):
    """
    Run a test script and return success status.
    
    Args:
        script_path: Path to the test script
        description: Description of the test
        skip_interactive: If True, pipe "N" to skip interactive prompts
    
    Returns:
        tuple: (success, duration)
    """
    print(f"{Colors.OKBLUE}Running: {description}{Colors.ENDC}")
    print(f"Script: {script_path}")
    print()
    
    start_time = time.time()
    
    try:
        # Run the test script
        if skip_interactive:
            # Provide "N" for any interactive prompts
            result = subprocess.run(
                [sys.executable, str(script_path)],
                cwd=script_path.parent.parent,
                input="N\n",
                capture_output=False,
                text=True,
            )
        else:
            result = subprocess.run(
                [sys.executable, str(script_path)],
                cwd=script_path.parent.parent,
                capture_output=False,
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
        import traceback
        traceback.print_exc()
        return False, duration


def main():
    """Run all tests in sequence."""
    print_header("NotebookLM v3.0 - Automated Test Suite")
    
    print(f"{Colors.BOLD}Running all test phases automatically:{Colors.ENDC}")
    print("  ✅ Phase 1: Quick Import Tests (10 unit tests)")
    print("  ✅ Phase 2: Browser Module Tests (browser automation)")
    print("  ✅ Phase 3: Auth Module Tests (non-interactive)")
    print()
    print(f"{Colors.WARNING}Note: Browsers will open during tests. This is normal.{Colors.ENDC}")
    print(f"{Colors.WARNING}      Interactive auth login will be skipped.{Colors.ENDC}")
    print()
    
    # Test suite configuration
    tests_dir = Path(__file__).parent
    
    test_suite = [
        {
            "phase": 1,
            "name": "Quick Import Tests",
            "script": tests_dir / "quick_test.py",
            "description": "Unit tests for imports and models",
            "skip_interactive": False,
        },
        {
            "phase": 2,
            "name": "Browser Module Test",
            "script": tests_dir / "manual_test_browser.py",
            "description": "Browser automation integration tests",
            "skip_interactive": False,
        },
        {
            "phase": 3,
            "name": "Auth Module Test",
            "script": tests_dir / "manual_test_auth.py",
            "description": "Authentication flow tests (non-interactive)",
            "skip_interactive": True,  # Skip interactive login
        },
    ]
    
    # Track results
    results = []
    overall_start = time.time()
    
    # Run each test phase
    for test in test_suite:
        print_phase(test["phase"], test["name"])
        
        success, duration = run_test(
            test["script"], 
            test["description"],
            skip_interactive=test["skip_interactive"]
        )
        
        results.append({
            "name": test["name"],
            "success": success,
            "duration": duration,
        })
        
        # Continue even if a test fails to see all results
        time.sleep(0.5)
    
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
        print(f"{Colors.BOLD}Test Files Created:{Colors.ENDC}")
        print(f"  • tests/quick_test.py - Fast unit tests")
        print(f"  • tests/manual_test_browser.py - Browser integration tests")
        print(f"  • tests/manual_test_auth.py - Auth integration tests")
        print(f"  • tests/TEST_RESULTS.md - Comprehensive test report")
        print(f"  • tests/EXECUTION_LOG.md - Detailed execution timeline")
        print()
        print(f"{Colors.BOLD}Next Steps:{Colors.ENDC}")
        print(f"  • Test interactive login: .venv/bin/python tests/manual_test_auth.py")
        print(f"  • Proceed to Phase 2 implementation (session.py, query.py)")
        print(f"  • Review: tests/TEST_RESULTS.md")
        print()
        return 0
    else:
        print(f"{Colors.FAIL}{'=' * 70}{Colors.ENDC}")
        print(f"{Colors.FAIL}{'❌ SOME TESTS FAILED'.center(70)}{Colors.ENDC}")
        print(f"{Colors.FAIL}{'=' * 70}{Colors.ENDC}")
        print()
        print(f"{Colors.WARNING}Review the errors above and check:{Colors.ENDC}")
        print(f"  • Python environment: .venv is active")
        print(f"  • Dependencies: All packages installed")
        print(f"  • Chrome: Installed via patchright")
        print()
        return 1


if __name__ == "__main__":
    sys.exit(main())
