"""Main CLI entry point for NotebookLM."""

import json
import click
from pathlib import Path
from rich.console import Console
from rich.panel import Panel
from rich.table import Table
from .. import __version__

console = Console()


def get_profile_dir(profile_name: str = "default") -> Path:
    """Get the profile directory path."""
    base_dir = Path.home() / ".notebooklm" / "profiles" / profile_name
    base_dir.mkdir(parents=True, exist_ok=True)
    return base_dir


def get_library_path(profile_name: str = "default") -> Path:
    """Get the library.json path for a profile."""
    return get_profile_dir(profile_name) / "library.json"


def load_library(profile_name: str = "default"):
    """Load library from file."""
    from ..models import Library
    
    library_path = get_library_path(profile_name)
    
    if library_path.exists():
        try:
            with open(library_path) as f:
                data = json.load(f)
            return Library.from_dict(data)
        except Exception as e:
            console.print(f"[yellow]⚠️  Could not load library: {e}[/yellow]")
            return Library()
    
    return Library()


def save_library(library, profile_name: str = "default"):
    """Save library to file."""
    library_path = get_library_path(profile_name)
    library_path.parent.mkdir(parents=True, exist_ok=True)
    
    try:
        with open(library_path, "w") as f:
            json.dump(library.to_dict(), f, indent=2)
        return True
    except Exception as e:
        console.print(f"[red]❌ Failed to save library: {e}[/red]")
        return False


def get_auth_manager(profile_name: str = "default"):
    """Create an AuthManager instance for the profile."""
    from ..core import AuthManager
    from ..models import BrowserConfig
    
    profile_dir = get_profile_dir(profile_name)
    browser_state_dir = profile_dir / "browser_state"
    state_file = profile_dir / "state.json"
    auth_info_file = profile_dir / "auth_info.json"
    
    config = BrowserConfig(headless=False)
    
    return AuthManager(
        browser_config=config,
        browser_state_dir=browser_state_dir,
        state_file=state_file,
        auth_info_file=auth_info_file,
    )


@click.group()
@click.version_option(version=__version__, prog_name="NotebookLM")
@click.option("--debug", is_flag=True, help="Enable debug mode")
@click.option("--profile", "-p", help="Use specific profile")
@click.pass_context
def cli(ctx: click.Context, debug: bool, profile: str) -> None:
    """
    NotebookLM v3.0 - Enterprise-grade NotebookLM automation.
    
    Automate Google NotebookLM with multi-account support, advanced browser
    automation, and a beautiful CLI interface.
    
    Examples:
    
        # Ask a question
        nlm ask "What is X?"
        
        # List notebooks
        nlm library list
        
        # Switch profiles
        nlm profile switch avatararts
        
        # Get help
        nlm --help
    """
    # Ensure context object exists
    ctx.ensure_object(dict)

    # Store options in context
    ctx.obj["DEBUG"] = debug
    ctx.obj["PROFILE"] = profile

    # Setup logging based on debug flag
    if debug:
        from ..utils.logger import setup_logging

        setup_logging(level="DEBUG")


@cli.command()
def version() -> None:
    """Show version information."""
    console.print(
        Panel(
            f"[bold cyan]NotebookLM[/bold cyan]\n"
            f"Version: [green]{__version__}[/green]\n"
            f"Enterprise Edition",
            title="🚀 Version Info",
            border_style="cyan",
        )
    )


@cli.command()
@click.argument("question")
@click.option("--notebook", "-n", help="Target notebook ID")
@click.option("--interactive", "-i", is_flag=True, help="Interactive mode")
def ask(question: str, notebook: str, interactive: bool) -> None:
    """
    Ask a question to NotebookLM.
    
    Examples:
    
        nlm ask "What is X?"
        nlm ask "How do I Y?" --notebook my-docs
        nlm ask --interactive
    """
    console.print(f"[yellow]Question:[/yellow] {question}")

    if notebook:
        console.print(f"[cyan]Notebook:[/cyan] {notebook}")

    if interactive:
        console.print("[green]Interactive mode enabled[/green]")

    # TODO: Implement actual query logic
    console.print("[red]⚠️  Query functionality not yet implemented in v3.0[/red]")
    console.print("[yellow]This is a placeholder - implementation coming soon[/yellow]")


# Group commands
@cli.group()
def auth() -> None:
    """Authentication commands."""
    pass


@auth.command()
@click.pass_context
def login(ctx: click.Context) -> None:
    """Authenticate with Google."""
    profile_name = ctx.obj.get("PROFILE") or "default"
    
    console.print(f"[cyan]🔐 Starting authentication for profile: {profile_name}[/cyan]")
    console.print()
    
    try:
        auth_manager = get_auth_manager(profile_name)
        
        # Check if already authenticated
        if auth_manager.is_authenticated():
            console.print("[yellow]⚠️  Already authenticated![/yellow]")
            response = console.input("[bold]Re-authenticate? (y/N): [/bold]").strip().lower()
            
            if response != 'y':
                console.print("[cyan]Authentication cancelled.[/cyan]")
                return
            
            # Clear existing auth
            auth_manager.clear_auth()
        
        # Perform interactive login
        console.print("[yellow]A browser window will open for Google login.[/yellow]")
        console.print("[yellow]You have 5 minutes to complete the authentication.[/yellow]")
        console.print()
        
        success = auth_manager.setup_auth(headless=False, timeout_minutes=5)
        
        if success:
            console.print()
            console.print(Panel(
                "[bold green]✅ Authentication successful![/bold green]\n"
                f"Profile: [cyan]{profile_name}[/cyan]",
                title="🎉 Login Complete",
                border_style="green",
            ))
        else:
            console.print("[red]❌ Authentication failed or timed out.[/red]")
            
    except KeyboardInterrupt:
        console.print("\n[yellow]Authentication cancelled by user.[/yellow]")
    except Exception as e:
        console.print(f"[red]❌ Error during authentication: {e}[/red]")


@auth.command()
@click.pass_context
def logout(ctx: click.Context) -> None:
    """Logout current profile."""
    profile_name = ctx.obj.get("PROFILE") or "default"
    
    console.print(f"[cyan]🔓 Logging out profile: {profile_name}[/cyan]")
    
    try:
        auth_manager = get_auth_manager(profile_name)
        
        if not auth_manager.is_authenticated():
            console.print("[yellow]⚠️  Not currently authenticated.[/yellow]")
            return
        
        # Confirm logout
        response = console.input("[bold]Are you sure you want to logout? (y/N): [/bold]").strip().lower()
        
        if response != 'y':
            console.print("[cyan]Logout cancelled.[/cyan]")
            return
        
        # Clear authentication
        auth_manager.clear_auth()
        
        console.print()
        console.print(Panel(
            "[bold green]✅ Logged out successfully![/bold green]\n"
            f"Profile: [cyan]{profile_name}[/cyan]",
            title="👋 Logout Complete",
            border_style="green",
        ))
        
    except Exception as e:
        console.print(f"[red]❌ Error during logout: {e}[/red]")


@auth.command()
@click.pass_context
def status(ctx: click.Context) -> None:
    """Check authentication status."""
    profile_name = ctx.obj.get("PROFILE") or "default"
    
    console.print(f"[cyan]🔍 Checking authentication status for profile: {profile_name}[/cyan]")
    console.print()
    
    try:
        auth_manager = get_auth_manager(profile_name)
        auth_info = auth_manager.get_auth_info()
        
        # Create status table
        table = Table(title="Authentication Status", border_style="cyan")
        table.add_column("Property", style="cyan")
        table.add_column("Value", style="green")
        
        # Authentication status
        is_auth = auth_info["authenticated"]
        status_text = "[green]✅ Authenticated[/green]" if is_auth else "[red]❌ Not Authenticated[/red]"
        table.add_row("Status", status_text)
        
        table.add_row("Profile", profile_name)
        table.add_row("State File", "✅ Exists" if auth_info["state_exists"] else "❌ Not Found")
        
        if auth_info.get("state_age_hours"):
            table.add_row("State Age", f"{auth_info['state_age_hours']:.1f} hours")
        
        if auth_info.get("authenticated_at"):
            table.add_row("Authenticated At", auth_info["authenticated_at"])
        
        console.print(table)
        
        if not is_auth:
            console.print()
            console.print("[yellow]💡 Tip: Run 'nlm auth login' to authenticate[/yellow]")
        
    except Exception as e:
        console.print(f"[red]❌ Error checking status: {e}[/red]")


@cli.group()
def profile() -> None:
    """Profile management commands."""
    pass


@profile.command("list")
def profile_list() -> None:
    """List all profiles."""
    console.print("[cyan]📋 Profiles:[/cyan]")
    console.print("[red]⚠️  Profile functionality not yet implemented in v3.0[/red]")


@profile.command()
@click.argument("name")
@click.option("--email", required=True, help="Profile email")
@click.option("--github", help="GitHub username")
@click.option("--description", help="Profile description")
def create(name: str, email: str, github: str, description: str) -> None:
    """Create a new profile."""
    console.print(f"[cyan]✨ Creating profile: {name}[/cyan]")
    console.print(f"   Email: {email}")

    if github:
        console.print(f"   GitHub: {github}")

    console.print("[red]⚠️  Profile functionality not yet implemented in v3.0[/red]")


@profile.command()
@click.argument("name")
def switch(name: str) -> None:
    """Switch to a different profile."""
    console.print(f"[cyan]🔄 Switching to profile: {name}[/cyan]")
    console.print("[red]⚠️  Profile functionality not yet implemented in v3.0[/red]")


@cli.group()
def library() -> None:
    """Library management commands."""
    pass


@library.command("list")
@click.pass_context
def library_list(ctx: click.Context) -> None:
    """List all notebooks in library."""
    profile_name = ctx.obj.get("PROFILE") or "default"
    
    try:
        lib = load_library(profile_name)
        
        if not lib.notebooks:
            console.print("[yellow]📚 Library is empty[/yellow]")
            console.print()
            console.print("[cyan]💡 Add a notebook with: nlm library add <url>[/cyan]")
            return
        
        table = Table(title=f"📚 NotebookLM Library ({profile_name})", border_style="cyan")
        table.add_column("ID", style="cyan", no_wrap=True)
        table.add_column("Name", style="green")
        table.add_column("Topics", style="yellow")
        table.add_column("Used", style="magenta")
        
        for notebook in lib.notebooks.values():
            topics_str = ", ".join(notebook.topics[:3]) if notebook.topics else "-"
            if len(notebook.topics) > 3:
                topics_str += "..."
            
            table.add_row(
                notebook.id,
                notebook.name,
                topics_str,
                str(notebook.use_count)
            )
        
        console.print(table)
        console.print()
        console.print(f"[cyan]Total notebooks: {len(lib.notebooks)}[/cyan]")
        
        if lib.active_notebook_id:
            console.print(f"[green]Active notebook: {lib.active_notebook_id}[/green]")
        
    except Exception as e:
        console.print(f"[red]❌ Error listing library: {e}[/red]")


@library.command()
@click.argument("url")
@click.option("--name", help="Notebook name")
@click.option("--topics", help="Comma-separated topics")
@click.option("--description", help="Notebook description")
@click.pass_context
def add(ctx: click.Context, url: str, name: str, topics: str, description: str) -> None:
    """Add a notebook to the library."""
    from ..models import Notebook
    from ..utils import validate_url
    from ..exceptions import InvalidURLError
    
    profile_name = ctx.obj.get("PROFILE") or "default"
    
    console.print(f"[cyan]➕ Adding notebook to library ({profile_name})[/cyan]")
    console.print()
    
    try:
        # Validate URL
        try:
            validate_url(url)
        except InvalidURLError as e:
            console.print(f"[red]❌ Invalid URL: {e}[/red]")
            return
        
        # Check if NotebookLM URL
        if not url.startswith("https://notebooklm.google.com/"):
            console.print("[red]❌ URL must be a NotebookLM notebook URL[/red]")
            console.print("[yellow]Expected format: https://notebooklm.google.com/notebook/...[/yellow]")
            return
        
        # Extract notebook ID from URL
        notebook_url_id = url.split("/notebook/")[-1].split("?")[0]
        
        # Generate a friendly ID if name provided, otherwise use URL ID
        if name:
            notebook_id = name.lower().replace(" ", "-")
        else:
            notebook_id = notebook_url_id[:8]  # Use first 8 chars of URL ID
        
        # Use URL ID as name if not provided
        if not name:
            name = f"Notebook {notebook_id}"
        
        # Parse topics
        topics_list = []
        if topics:
            topics_list = [t.strip() for t in topics.split(",")]
        
        # Create notebook
        notebook = Notebook(
            id=notebook_id,
            name=name,
            url=url,
            description=description,
            topics=topics_list,
        )
        
        # Load library and add notebook
        lib = load_library(profile_name)
        
        try:
            lib.add_notebook(notebook)
        except ValueError as e:
            console.print(f"[red]❌ {e}[/red]")
            console.print(f"[yellow]💡 Use a different --name or remove the existing notebook first[/yellow]")
            return
        
        # Save library
        if save_library(lib, profile_name):
            console.print(Panel(
                f"[bold green]✅ Notebook added successfully![/bold green]\n\n"
                f"ID: [cyan]{notebook.id}[/cyan]\n"
                f"Name: [green]{notebook.name}[/green]\n"
                f"URL: [blue]{url}[/blue]" +
                (f"\nTopics: [yellow]{', '.join(topics_list)}[/yellow]" if topics_list else ""),
                title="📚 Library Updated",
                border_style="green",
            ))
        
    except Exception as e:
        console.print(f"[red]❌ Error adding notebook: {e}[/red]")
        import traceback
        if ctx.obj.get("DEBUG"):
            traceback.print_exc()


@library.command()
@click.argument("notebook_id")
@click.pass_context
def remove(ctx: click.Context, notebook_id: str) -> None:
    """Remove a notebook from the library."""
    profile_name = ctx.obj.get("PROFILE") or "default"
    
    console.print(f"[cyan]➖ Removing notebook from library ({profile_name})[/cyan]")
    console.print()
    
    try:
        lib = load_library(profile_name)
        
        # Check if notebook exists
        if notebook_id not in lib.notebooks:
            console.print(f"[red]❌ Notebook '{notebook_id}' not found in library[/red]")
            console.print()
            console.print("[cyan]💡 List notebooks with: nlm library list[/cyan]")
            return
        
        notebook = lib.notebooks[notebook_id]
        
        # Confirm removal
        console.print(f"[yellow]Notebook: {notebook.name}[/yellow]")
        console.print(f"[yellow]URL: {notebook.url}[/yellow]")
        console.print()
        
        response = console.input("[bold]Remove this notebook? (y/N): [/bold]").strip().lower()
        
        if response != 'y':
            console.print("[cyan]Removal cancelled.[/cyan]")
            return
        
        # Remove notebook
        lib.remove_notebook(notebook_id)
        
        # Save library
        if save_library(lib, profile_name):
            console.print()
            console.print(Panel(
                f"[bold green]✅ Notebook removed successfully![/bold green]\n\n"
                f"ID: [cyan]{notebook_id}[/cyan]\n"
                f"Name: [green]{notebook.name}[/green]",
                title="📚 Library Updated",
                border_style="green",
            ))
        
    except Exception as e:
        console.print(f"[red]❌ Error removing notebook: {e}[/red]")


@cli.command()
def doctor() -> None:
    """Check system health and configuration."""
    console.print("[cyan]🏥 Running health check...[/cyan]")

    from rich.table import Table

    table = Table(title="System Health", border_style="green")
    table.add_column("Component", style="cyan")
    table.add_column("Status", style="green")

    # Check Python version
    import sys

    python_version = f"{sys.version_info.major}.{sys.version_info.minor}.{sys.version_info.micro}"
    table.add_row("Python Version", f"✅ {python_version}")

    # Check dependencies
    try:
        import patchright

        table.add_row("Patchright", "✅ Installed")
    except ImportError:
        table.add_row("Patchright", "❌ Not installed")

    try:
        import rich

        table.add_row("Rich", "✅ Installed")
    except ImportError:
        table.add_row("Rich", "❌ Not installed")

    try:
        import pydantic

        table.add_row("Pydantic", "✅ Installed")
    except ImportError:
        table.add_row("Pydantic", "❌ Not installed")

    console.print(table)


if __name__ == "__main__":
    cli(obj={})
