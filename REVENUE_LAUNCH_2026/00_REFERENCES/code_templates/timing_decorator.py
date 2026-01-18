def timing_decorator(func):
    """
    Decorator to measure function execution time.

    Usage:
        @timing_decorator
        def my_function():
            # ... code ...

    Source: advanced_quality_improver.py
    """
    import time
    from functools import wraps

    @wraps(func)
    def wrapper(*args, **kwargs):
        start_time = time.time()
        result = func(*args, **kwargs)
        end_time = time.time()
        print(f"{func.__name__} executed in {end_time - start_time:.2f} seconds")
        return result

    return wrapper
