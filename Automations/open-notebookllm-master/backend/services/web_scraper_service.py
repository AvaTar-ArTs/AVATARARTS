"""
Web scraping service - convert URLs to source content.
"""
import logging
import re
from typing import Optional, Tuple, Dict, Any
from urllib.parse import urlparse, urljoin
import requests
from bs4 import BeautifulSoup

logger = logging.getLogger(__name__)


class WebScraperService:
    """Web scraping service."""

    # Common unwanted element selectors
    REMOVE_SELECTORS = [
        'script', 'style', 'noscript', 'iframe', 'svg',
        'nav', 'footer', 'header', 'aside',
        '.nav', '.navigation', '.menu', '.sidebar',
        '.footer', '.header', '.advertisement', '.ads',
        '.cookie-banner', '.popup', '.modal',
        '#nav', '#navigation', '#menu', '#sidebar',
        '#footer', '#header', '#comments'
    ]

    # Main content selectors (priority order)
    CONTENT_SELECTORS = [
        'article',
        'main',
        '[role="main"]',
        '.post-content',
        '.article-content',
        '.entry-content',
        '.content',
        '#content',
        '.post',
        '.article'
    ]

    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
        })

    def scrape_url(self, url: str, timeout: int = 30) -> Tuple[Optional[str], Optional[Dict[str, Any]], Optional[str]]:
        """
        Scrape page content.

        Args:
            url: page URL
            timeout: request timeout

        Returns:
            (extracted text, metadata, error message)
        """
        # Validate URL
        if not self._is_valid_url(url):
            return None, None, "Invalid URL"

        try:
            # Send request
            response = self.session.get(url, timeout=timeout, allow_redirects=True)
            response.raise_for_status()

            # Detect encoding
            response.encoding = response.apparent_encoding or 'utf-8'

            # Parse HTML
            soup = BeautifulSoup(response.text, 'html.parser')

            # Extract metadata
            metadata = self._extract_metadata(soup, url)

            # Remove unwanted elements
            self._remove_unwanted_elements(soup)

            # Extract main content
            content = self._extract_content(soup)

            if not content or len(content.strip()) < 100:
                return None, metadata, "Unable to extract valid content"

            return content, metadata, None

        except requests.Timeout:
            return None, None, "Request timed out"
        except requests.RequestException as e:
            return None, None, f"Request failed: {str(e)}"
        except Exception as e:
            logger.error(f"Web scraping failed: {e}")
            return None, None, f"Scraping failed: {str(e)}"

    def _is_valid_url(self, url: str) -> bool:
        """Validate URL format."""
        try:
            result = urlparse(url)
            return all([result.scheme in ('http', 'https'), result.netloc])
        except Exception:
            return False

    def _extract_metadata(self, soup: BeautifulSoup, url: str) -> Dict[str, Any]:
        """Extract page metadata."""
        metadata = {
            'url': url,
            'domain': urlparse(url).netloc
        }

        # Title
        title = None
        if soup.title:
            title = soup.title.string
        if not title:
            og_title = soup.find('meta', property='og:title')
            if og_title:
                title = og_title.get('content')
        metadata['title'] = title.strip() if title else None

        # Description
        description = None
        meta_desc = soup.find('meta', attrs={'name': 'description'})
        if meta_desc:
            description = meta_desc.get('content')
        if not description:
            og_desc = soup.find('meta', property='og:description')
            if og_desc:
                description = og_desc.get('content')
        metadata['description'] = description.strip() if description else None

        # Author
        author = None
        meta_author = soup.find('meta', attrs={'name': 'author'})
        if meta_author:
            author = meta_author.get('content')
        metadata['author'] = author.strip() if author else None

        # Published date
        pub_date = None
        for attr in ['article:published_time', 'datePublished', 'pubdate']:
            meta_date = soup.find('meta', property=attr) or soup.find('meta', attrs={'name': attr})
            if meta_date:
                pub_date = meta_date.get('content')
                break
        metadata['published_date'] = pub_date

        # Image
        og_image = soup.find('meta', property='og:image')
        if og_image:
            image_url = og_image.get('content')
            if image_url and not image_url.startswith('http'):
                image_url = urljoin(url, image_url)
            metadata['image'] = image_url

        return metadata

    def _remove_unwanted_elements(self, soup: BeautifulSoup):
        """Remove unwanted elements."""
        for selector in self.REMOVE_SELECTORS:
            for element in soup.select(selector):
                element.decompose()

    def _extract_content(self, soup: BeautifulSoup) -> str:
        """Extract main content."""
        content_element = None

        # Try to find main content
        for selector in self.CONTENT_SELECTORS:
            content_element = soup.select_one(selector)
            if content_element:
                break

        # Fallback to body
        if not content_element:
            content_element = soup.body or soup

        # Extract text
        text_parts = []

        for element in content_element.find_all(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'li', 'td', 'th', 'blockquote', 'pre', 'code']):
            text = element.get_text(strip=True)
            if text and len(text) > 1:
                # Format based on tag type
                tag = element.name
                if tag.startswith('h'):
                    level = int(tag[1])
                    text = '#' * level + ' ' + text
                elif tag == 'li':
                    text = '• ' + text
                elif tag == 'blockquote':
                    text = '> ' + text
                elif tag in ('pre', 'code'):
                    text = '```\n' + text + '\n```'

                text_parts.append(text)

        content = '\n\n'.join(text_parts)

        # Normalize whitespace
        content = re.sub(r'\n{3,}', '\n\n', content)
        content = re.sub(r' {2,}', ' ', content)

        return content.strip()

    def get_page_title(self, url: str) -> Optional[str]:
        """Quickly get page title."""
        try:
            response = self.session.get(url, timeout=10)
            soup = BeautifulSoup(response.text, 'html.parser')

            if soup.title:
                return soup.title.string.strip()

            og_title = soup.find('meta', property='og:title')
            if og_title:
                return og_title.get('content', '').strip()

            return None
        except Exception:
            return None


# Global instance
_web_scraper: Optional[WebScraperService] = None


def get_web_scraper() -> WebScraperService:
    """Get web scraper service instance."""
    global _web_scraper
    if _web_scraper is None:
        _web_scraper = WebScraperService()
    return _web_scraper
