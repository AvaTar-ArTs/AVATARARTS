def retry_with_backoff(func, *args, max_attempts=4, base_delay=1.0, cap=10.0, **kwargs):
    """
    Exponential backoff with full jitter for API calls.

    Pattern adapted from reference scripts. Prevents thundering herd,
    handles transient failures gracefully.

    Args:
        func: Function to call
        *args: Positional arguments for func
        max_attempts: Maximum number of attempts (default: 4)
        base_delay: Base delay in seconds (default: 1.0)
        cap: Maximum delay cap in seconds (default: 10.0)
        **kwargs: Keyword arguments for func

    Returns:
        Result of func(*args, **kwargs)

    Raises:
        Exception: The last exception if all attempts fail

    Source: podcast_to_shorts_ai_ENHANCED.py, reference scripts
    """
    import random
    import time

    for attempt in range(1, max_attempts + 1):
        try:
            return func(*args, **kwargs)
        except Exception as e:
            if attempt == max_attempts:
                raise
            sleep_time = min(cap, base_delay * (2 ** (attempt - 1)))
            sleep_time = random.uniform(0, sleep_time)  # Full jitter
            print(
                f"⚠️  Attempt {attempt} failed with {e!r}; waiting {sleep_time:.2f}s before retry."
            )
            time.sleep(sleep_time)
