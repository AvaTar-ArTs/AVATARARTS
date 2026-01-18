def load_env_d():
    """
    Load all .env files from ~/.env.d directory.

    Production-ready pattern: Works in hosted environments, optional local dev support.
    Priority order: llm-apis.env first, then MASTER_CONSOLIDATED.env, then others alphabetically.

    Source: /Users/steven/Music/nocTurneMeLoDieS/create_missing_transcripts.py
    """
    import os
    from pathlib import Path

    env_d_path = Path.home() / ".env.d"
    if not env_d_path.exists():
        return  # Silently fail if ~/.env.d doesn't exist (normal in production)

    # Collect all .env files
    all_env_files = list(env_d_path.glob("*.env"))

    # Sort files with priority: llm-apis.env first, then MASTER_CONSOLIDATED.env, then others
    priority_files = []
    other_files = []

    for env_file in all_env_files:
        if env_file.name == "llm-apis.env":
            priority_files.insert(0, env_file)
        elif env_file.name == "MASTER_CONSOLIDATED.env":
            priority_files.append(env_file)
        else:
            other_files.append(env_file)

    # Sort other files alphabetically
    other_files.sort(key=lambda x: x.name)

    # Process files in order: priority first, then others
    for env_file in priority_files + other_files:
        try:
            with open(env_file, encoding="utf-8") as f:
                for line_num, line in enumerate(f, 1):
                    line = line.strip()
                    # Skip empty lines and comments
                    if not line or line.startswith("#"):
                        continue

                    # Handle 'export KEY=value' format
                    if line.startswith("export "):
                        line = line[7:].strip()  # Remove 'export '

                    # Skip source commands
                    if line.startswith("source "):
                        continue

                    # Parse KEY=value
                    if "=" in line:
                        key, value = line.split("=", 1)
                        key = key.strip()
                        value = value.strip()

                        # Remove quotes if present
                        if value.startswith('"') and value.endswith('"'):
                            value = value[1:-1]
                        elif value.startswith("'") and value.endswith("'"):
                            value = value[1:-1]

                        # Set environment variable (empty values are allowed)
                        if key and not key.startswith("#"):
                            os.environ[key] = value
        except Exception:
            # Silently skip files that can't be read (or use logging if available)
            pass
