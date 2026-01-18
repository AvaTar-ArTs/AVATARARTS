def format_timestamp(seconds):
    """
    Convert seconds into the format MM:SS.

    Source: /Users/steven/Music/nocTurneMeLoDieS/create_missing_transcripts.py
    """
    minutes = int(seconds // 60)
    seconds = seconds % 60
    return f"{minutes:02d}:{int(seconds):02d}"
