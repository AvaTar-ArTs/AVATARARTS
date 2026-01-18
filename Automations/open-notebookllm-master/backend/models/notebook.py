"""
Notebook model.
"""
from datetime import datetime
from . import db, generate_uuid


class Notebook(db.Model):
    """Notebook."""
    __tablename__ = 'notebooks'

    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    folder_id = db.Column(db.String(36), db.ForeignKey('folders.id'), nullable=True)  # Folder ownership
    order = db.Column(db.Integer, default=0)  # Order within folder
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    sources = db.relationship('Source', backref='notebook', lazy='dynamic', cascade='all, delete-orphan')
    messages = db.relationship('ChatMessage', backref='notebook', lazy='dynamic', cascade='all, delete-orphan')
    notes = db.relationship('Note', backref='notebook', lazy='dynamic', cascade='all, delete-orphan')
    studio_outputs = db.relationship('StudioOutput', backref='notebook', lazy='dynamic', cascade='all, delete-orphan')

    def to_dict(self, include_sources=False):
        """Convert to dict."""
        data = {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'folder_id': self.folder_id,
            'order': self.order,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'source_count': self.sources.count(),
            'note_count': self.notes.count(),
        }
        if include_sources:
            data['sources'] = [s.to_dict() for s in self.sources.all()]
        return data

    def __repr__(self):
        return f'<Notebook {self.name}>'
