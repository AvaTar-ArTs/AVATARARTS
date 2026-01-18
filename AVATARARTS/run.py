#!/usr/bin/env python3
"""
Wrapper script to run the AvatarArts intelligence stack from the root directory.
"""
import sys
import os

# Add the current directory to the Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from AVATARARTS.main import main

if __name__ == "__main__":
    main()
