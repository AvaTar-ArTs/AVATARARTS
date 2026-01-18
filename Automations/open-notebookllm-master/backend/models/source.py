"""
Source model.
"""
from datetime import datetime
from . import db, generate_uuid


class Source(db.Model):
    """Source."""
    __tablename__ = 'sources'

    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    notebook_id = db.Column(db.String(36), db.ForeignKey('notebooks.id'), nullable=False)

    # Source types: pdf, txt, docx, web, youtube, gdocs, text
    type = db.Column(db.String(20), nullable=False)
    name = db.Column(db.String(500), nullable=False)
    url = db.Column(db.String(2000), nullable=True)
    content = db.Column(db.Text, nullable=False)  # Extracted text content
    file_path = db.Column(db.String(500), nullable=True)  # Original file path

    # Metadata (JSON)
    source_metadata = db.Column(db.JSON, nullable=True)

    # Processing status: pending, processing, completed, failed
    status = db.Column(db.String(20), default='completed')
    error_message = db.Column(db.Text, nullable=True)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    embeddings = db.relationship('Embedding', backref='source', lazy='dynamic', cascade='all, delete-orphan')

    def to_dict(self, include_content=False):
        """Convert to dict."""
        data = {
            'id': self.id,
            'notebook_id': self.notebook_id,
            'type': self.type,
            'name': self.name,
            'url': self.url,
            'file_path': self.file_path,
            'metadata': self.source_metadata,
            'status': self.status,
            'error_message': self.error_message,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'content_length': len(self.content) if self.content else 0,
        }
        if include_content:
            data['content'] = self.content
        return data

    def __repr__(self):
        return f'<Source {self.name} ({self.type})>'
