"""
NoteBookLLM service layer with integrated AI services.
"""
from .ai_service_manager import AIServiceManager, get_ai_service, clear_ai_service
from .rag_service import RAGService, get_rag_service
from .file_parser_service import FileParserService, get_file_parser
from .studio_service import StudioService, get_studio_service
from .search_service import SearchService, get_search_service
from .web_scraper_service import WebScraperService, get_web_scraper
from .youtube_service import YouTubeService, get_youtube_service
from .audio_service import AudioService, get_audio_service
from .podcast_service import PodcastService, get_podcast_service

__all__ = [
    # AI service management
    'AIServiceManager',
    'get_ai_service',
    'clear_ai_service',
    # RAG service
    'RAGService',
    'get_rag_service',
    # File parsing
    'FileParserService',
    'get_file_parser',
    # Studio outputs
    'StudioService',
    'get_studio_service',
    # Search service
    'SearchService',
    'get_search_service',
    # Web scraping
    'WebScraperService',
    'get_web_scraper',
    # YouTube service
    'YouTubeService',
    'get_youtube_service',
    # Audio service
    'AudioService',
    'get_audio_service',
    # Podcast service
    'PodcastService',
    'get_podcast_service',
]
