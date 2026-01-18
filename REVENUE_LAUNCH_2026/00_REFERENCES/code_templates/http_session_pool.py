def get_session():
    """
    Get a configured requests session with connection pooling and retry strategy.

    Features:
    - Connection pooling for better performance
    - Automatic retry on transient failures (429, 500, 502, 503, 504)
    - Exponential backoff

    Usage:
        session = get_session()
        response = session.get('https://api.example.com/data')

    Source: advanced_quality_enhancer.py, test_framework.py
    """
    import requests
    from requests.adapters import HTTPAdapter
    from urllib3.util.retry import Retry

    session = requests.Session()

    # Configure retry strategy
    retry_strategy = Retry(
        total=3,
        backoff_factor=1,
        status_forcelist=[429, 500, 502, 503, 504],
    )

    # Mount adapter with retry strategy
    adapter = HTTPAdapter(max_retries=retry_strategy)
    session.mount("http://", adapter)
    session.mount("https://", adapter)

    return session
