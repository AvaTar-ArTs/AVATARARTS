"""Allow running the package as a module: python -m notebooklm."""

from .cli.main import cli

if __name__ == "__main__":
    cli(obj={})
