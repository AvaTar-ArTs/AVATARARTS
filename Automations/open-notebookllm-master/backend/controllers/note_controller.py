"""
Note controller.
"""
from flask import request, jsonify
from . import note_bp, notebook_bp
from models import db, Notebook, Note, ChatMessage


@notebook_bp.route('/<notebook_id>/notes', methods=['GET'])
def list_notes(notebook_id):
    """Get all notes for a notebook."""
    notebook = Notebook.query.get(notebook_id)
    if not notebook:
        return jsonify({'success': False, 'error': 'Notebook not found'}), 404

    notes = Note.query.filter_by(notebook_id=notebook_id).order_by(Note.updated_at.desc()).all()

    return jsonify({
        'success': True,
        'data': [n.to_dict() for n in notes]
    })


@notebook_bp.route('/<notebook_id>/notes', methods=['POST'])
def create_note(notebook_id):
    """Create a note."""
    notebook = Notebook.query.get(notebook_id)
    if not notebook:
        return jsonify({'success': False, 'error': 'Notebook not found'}), 404

    data = request.get_json()

    if not data or not data.get('content'):
        return jsonify({'success': False, 'error': 'Note content is required'}), 400

    note = Note(
        notebook_id=notebook_id,
        title=data.get('title'),
        content=data['content'],
        from_message_id=data.get('from_message_id')
    )

    db.session.add(note)
    db.session.commit()

    return jsonify({
        'success': True,
        'data': note.to_dict()
    }), 201


@notebook_bp.route('/<notebook_id>/notes/from-message', methods=['POST'])
def save_message_to_note(notebook_id):
    """Save a chat message as a note."""
    notebook = Notebook.query.get(notebook_id)
    if not notebook:
        return jsonify({'success': False, 'error': 'Notebook not found'}), 404

    data = request.get_json()
    message_id = data.get('message_id')

    if not message_id:
        return jsonify({'success': False, 'error': 'message_id is required'}), 400

    message = ChatMessage.query.get(message_id)
    if not message:
        return jsonify({'success': False, 'error': 'Message not found'}), 404

    # Create note.
    note = Note(
        notebook_id=notebook_id,
        title=data.get('title', 'Saved from conversation'),
        content=message.content,
        from_message_id=message_id
    )

    db.session.add(note)
    db.session.commit()

    return jsonify({
        'success': True,
        'data': note.to_dict()
    }), 201


@note_bp.route('/notes/<note_id>', methods=['GET'])
def get_note(note_id):
    """Get a single note."""
    note = Note.query.get(note_id)

    if not note:
        return jsonify({'success': False, 'error': 'Note not found'}), 404

    return jsonify({
        'success': True,
        'data': note.to_dict()
    })


@note_bp.route('/notes/<note_id>', methods=['PUT'])
def update_note(note_id):
    """Update a note."""
    note = Note.query.get(note_id)

    if not note:
        return jsonify({'success': False, 'error': 'Note not found'}), 404

    data = request.get_json()

    if 'title' in data:
        note.title = data['title']
    if 'content' in data:
        note.content = data['content']

    db.session.commit()

    return jsonify({
        'success': True,
        'data': note.to_dict()
    })


@note_bp.route('/notes/<note_id>', methods=['DELETE'])
def delete_note(note_id):
    """Delete a note."""
    note = Note.query.get(note_id)

    if not note:
        return jsonify({'success': False, 'error': 'Note not found'}), 404

    db.session.delete(note)
    db.session.commit()

    return jsonify({
        'success': True,
        'message': 'Note deleted'
    })
