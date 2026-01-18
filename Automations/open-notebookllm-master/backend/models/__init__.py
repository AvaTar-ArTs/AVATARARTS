"""
NoteBookLLM database models.
"""
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import uuid

db = SQLAlchemy()


def generate_uuid():
    """Generate a UUID."""
    return str(uuid.uuid4())


# Export all models
from .folder import Folder
from .notebook import Notebook
from .source import Source
from .embedding import Embedding
from .chat_message import ChatMessage
from .note import Note
from .studio_output import StudioOutput

__all__ = [
    'db',
    'generate_uuid',
    'Folder',
    'Notebook',
    'Source',
    'Embedding',
    'ChatMessage',
    'Note',
    'StudioOutput'
]
