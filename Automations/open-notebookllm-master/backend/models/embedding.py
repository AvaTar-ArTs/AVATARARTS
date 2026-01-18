"""
Vector embedding model.
"""
from datetime import datetime
from . import db, generate_uuid


class Embedding(db.Model):
    """Vector embedding."""
    __tablename__ = 'embeddings'

    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    source_id = db.Column(db.String(36), db.ForeignKey('sources.id'), nullable=False)

    chunk_index = db.Column(db.Integer, nullable=False)  # Chunk index
    chunk_text = db.Column(db.Text, nullable=False)  # Chunk text
    embedding = db.Column(db.LargeBinary, nullable=False)  # Embedding (serialized numpy array)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        """Convert to dict."""
        return {
            'id': self.id,
            'source_id': self.source_id,
            'chunk_index': self.chunk_index,
            'chunk_text': self.chunk_text,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }

    def __repr__(self):
        return f'<Embedding {self.source_id}:{self.chunk_index}>'
