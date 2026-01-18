"""
Folder model.
"""
import uuid
from datetime import datetime
from . import db


class Folder(db.Model):
    """Folder model for organizing notebooks."""

    __tablename__ = 'folders'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(100), nullable=False)
    emoji = db.Column(db.String(10), default='📁')  # Folder icon
    color = db.Column(db.String(20), default=None)  # Optional color tag
    order = db.Column(db.Integer, default=0)  # Sort order
    is_expanded = db.Column(db.Boolean, default=True)  # Expanded state
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationship: a folder has many notebooks
    notebooks = db.relationship('Notebook', backref='folder', lazy='dynamic')

    def to_dict(self, include_notebooks=False):
        """Convert to dict."""
        data = {
            'id': self.id,
            'name': self.name,
            'emoji': self.emoji,
            'color': self.color,
            'order': self.order,
            'is_expanded': self.is_expanded,
            'notebook_count': self.notebooks.count(),
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }

        if include_notebooks:
            data['notebooks'] = [nb.to_dict() for nb in self.notebooks.order_by('order', 'created_at')]

        return data

    def __repr__(self):
        return f'<Folder {self.emoji} {self.name}>'
