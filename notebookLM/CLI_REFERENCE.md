# NotebookLM v3.0 - CLI Reference

**Status:** ✅ Fully Functional  
**Date:** January 14, 2026

---

## Authentication Commands

### Check Auth Status
```bash
nlm auth status
```
Shows authentication status, profile info, and state file age.

### Login (Interactive)
```bash
nlm auth login
```
Opens browser for Google authentication. You have 5 minutes to complete login.

### Logout
```bash
nlm auth logout
```
Clears authentication data for the current profile (asks for confirmation).

**Data Location:** `~/.notebooklm/profiles/default/`
- `state.json` - Browser cookies and session
- `auth_info.json` - Authentication metadata
- `browser_state/` - Browser profile data

---

## Library Commands

### List Notebooks
```bash
nlm library list
```
Shows all notebooks in your library with ID, name, topics, and usage count.

### Add Notebook
```bash
nlm library add <url> [OPTIONS]
```

**Options:**
- `--name TEXT` - Notebook name (optional)
- `--topics TEXT` - Comma-separated topics (optional)
- `--description TEXT` - Notebook description (optional)

**Examples:**
```bash
# Basic add
nlm library add "https://notebooklm.google.com/notebook/abc123"

# With metadata
nlm library add "https://notebooklm.google.com/notebook/abc123" \
  --name "My Research" \
  --topics "ai,ml,research" \
  --description "AI research notes"
```

### Remove Notebook
```bash
nlm library remove <notebook-id>
```
Removes a notebook from the library (asks for confirmation).

**Example:**
```bash
nlm library remove my-notebooklm
```

**Data Location:** `~/.notebooklm/profiles/default/library.json`

---

## System Commands

### Version Info
```bash
nlm --version          # Short version
nlm version            # Detailed version with Rich UI
```

### Health Check
```bash
nlm doctor
```
Checks Python version and all dependencies.

### Help
```bash
nlm --help             # Main help
nlm auth --help        # Auth commands help
nlm library --help     # Library commands help
nlm profile --help     # Profile commands help
```

---

## Profile Support

All commands support profiles via the `--profile` / `-p` flag:

```bash
nlm -p work auth status
nlm -p personal library list
nlm -p avatararts library add <url>
```

**Profile Structure:**
```
~/.notebooklm/profiles/
├── default/
│   ├── library.json
│   ├── state.json
│   ├── auth_info.json
│   └── browser_state/
├── work/
│   └── ...
└── personal/
    └── ...
```

---

## Debug Mode

Enable debug logging with `--debug`:

```bash
nlm --debug auth login
nlm --debug library add <url>
```

---

## Complete Example Workflow

### 1. Check if authenticated
```bash
nlm auth status
```

### 2. Login if needed
```bash
nlm auth login
```

### 3. Add your notebook
```bash
nlm library add "https://notebooklm.google.com/notebook/a4e7ab9a-e603-4f82-9858-b925b6590d27" \
  --name "My NotebookLM" \
  --topics "ai,notes,research"
```

### 4. View your library
```bash
nlm library list
```

### 5. Remove a notebook (if needed)
```bash
nlm library remove my-notebooklm
```

### 6. Logout (when done)
```bash
nlm auth logout
```

---

## Current Implementation Status

### ✅ Fully Implemented
- `nlm auth status` - Check authentication status
- `nlm auth login` - Interactive Google login
- `nlm auth logout` - Clear authentication
- `nlm library list` - List all notebooks
- `nlm library add` - Add notebook with metadata
- `nlm library remove` - Remove notebook
- `nlm version` - Show version info
- `nlm doctor` - System health check
- Profile support (`--profile` / `-p`)
- Debug mode (`--debug`)

### 🚧 Not Yet Implemented
- `nlm ask` - Query notebooks (requires Phase 2: session.py, query.py)
- `nlm profile create` - Create new profiles
- `nlm profile list` - List all profiles
- `nlm profile switch` - Switch active profile
- Export functionality

---

## Data Files

### Library File Format (`library.json`)
```json
{
  "notebooks": {
    "my-notebooklm": {
      "id": "my-notebooklm",
      "name": "My NotebookLM",
      "url": "https://notebooklm.google.com/notebook/...",
      "description": "My workspace",
      "topics": ["ai", "notes", "research"],
      "tags": [],
      "created_at": "2026-01-14T...",
      "updated_at": "2026-01-14T...",
      "use_count": 0,
      "last_used": null
    }
  },
  "active_notebook_id": "my-notebooklm",
  "updated_at": "2026-01-14T...",
  "version": "1.0"
}
```

### Auth Info File Format (`auth_info.json`)
```json
{
  "authenticated": true,
  "authenticated_at": "2026-01-14T...",
  "method": "interactive"
}
```

---

## Tips & Tricks

### Multiple Profiles
Use profiles to separate work/personal notebooks:
```bash
nlm -p work library add <work-url>
nlm -p personal library add <personal-url>
```

### Quick Status Check
```bash
nlm auth status && nlm library list
```

### Backup Your Library
```bash
cp ~/.notebooklm/profiles/default/library.json ~/library-backup.json
```

### View Raw Library Data
```bash
cat ~/.notebooklm/profiles/default/library.json | python -m json.tool
```

---

## Troubleshooting

### "Not Authenticated" Error
Run `nlm auth login` to authenticate.

### "Notebook Already Exists" Error
Use a different `--name` or remove the existing notebook first:
```bash
nlm library remove <existing-id>
nlm library add <url> --name "New Name"
```

### Browser Won't Open
Check Chrome installation:
```bash
nlm doctor
.venv/bin/patchright install chrome
```

### Can't Find Notebook ID
List notebooks to see IDs:
```bash
nlm library list
```

---

## Next Steps

The CLI now supports all core authentication and library management functions!

**Coming Soon:**
- Query notebooks with `nlm ask`
- Profile management commands
- Export functionality
- Interactive query sessions

**Want to Help?**
Check out the implementation in:
- `src/notebooklm/cli/main.py` - CLI commands
- `src/notebooklm/core/auth.py` - Authentication
- `src/notebooklm/models/notebook.py` - Notebook models
