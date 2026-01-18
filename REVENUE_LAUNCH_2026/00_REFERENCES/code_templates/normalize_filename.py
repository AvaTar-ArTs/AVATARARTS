def normalize_filename(name):
    """
    Normalize filename for comparison - flexible matching.

    Removes extensions, suffixes, version numbers, and normalizes for fuzzy matching.

    Source: /Users/steven/Music/nocTurneMeLoDieS/create_missing_transcripts.py
    """
    import re
    from pathlib import Path

    # Remove extensions
    name = Path(name).stem
    # Remove transcript/analysis suffixes
    name = re.sub(r"_transcript$", "", name, flags=re.IGNORECASE)
    name = re.sub(r"_analysis$", "", name, flags=re.IGNORECASE)
    name = re.sub(r" transcript$", "", name, flags=re.IGNORECASE)
    name = re.sub(r" analysis$", "", name, flags=re.IGNORECASE)
    # Remove version numbers and common suffixes
    name = re.sub(r"[-_]v\d+", "", name, flags=re.IGNORECASE)
    name = re.sub(r"[-_]remastered", "", name, flags=re.IGNORECASE)
    name = re.sub(r"[-_]\(remastered\)", "", name, flags=re.IGNORECASE)
    name = re.sub(r"[-_]live", "", name, flags=re.IGNORECASE)
    name = re.sub(r"[-_]og", "", name, flags=re.IGNORECASE)
    name = re.sub(r"[-_]cut", "", name, flags=re.IGNORECASE)
    name = re.sub(r"[-_]acoustic", "", name, flags=re.IGNORECASE)
    name = re.sub(r"[-_]cover", "", name, flags=re.IGNORECASE)
    name = re.sub(r"[-_]remix", "", name, flags=re.IGNORECASE)
    # Remove trailing numbers and parentheses
    name = re.sub(r"[-_]?\d+$", "", name)
    name = re.sub(r"[-_]?\(\d+\)$", "", name)
    name = re.sub(r"[-_]?\s*\([^)]*\)$", "", name)  # Remove any trailing parentheses
    # Normalize separators and special chars
    name = re.sub(r"[-_\s]+", "_", name)
    name = re.sub(r"[^a-z0-9_]", "", name.lower())
    # Remove common prefixes/suffixes
    name = name.strip("_")
    return name
