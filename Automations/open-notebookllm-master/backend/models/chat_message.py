"""
Chat message model.
"""
from datetime import datetime
from . import db, generate_uuid


class ChatMessage(db.Model):
    """Chat message."""
    __tablename__ = 'chat_messages'

    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    notebook_id = db.Column(db.String(36), db.ForeignKey('notebooks.id'), nullable=False)

    # Roles: user, assistant
    role = db.Column(db.String(20), nullable=False)
    content = db.Column(db.Text, nullable=False)

    # Source refs (JSON): [{"source_id": "xxx", "chunk_text": "..."}]
    source_refs = db.Column(db.JSON, nullable=True)

    # Used source ID list
    used_source_ids = db.Column(db.JSON, nullable=True)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        """Convert to dict."""
        return {
            'id': self.id,
            'notebook_id': self.notebook_id,
            'role': self.role,
            'content': self.content,
            'source_refs': self.source_refs,
            'used_source_ids': self.used_source_ids,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }

    def __repr__(self):
        return f'<ChatMessage {self.role}: {self.content[:50]}...>'
