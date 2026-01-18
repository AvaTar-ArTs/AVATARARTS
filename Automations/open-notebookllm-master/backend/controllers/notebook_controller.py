"""
Notebook controller.
"""
from flask import request, jsonify
from . import notebook_bp
from models import db, Notebook


@notebook_bp.route('', methods=['GET'])
def list_notebooks():
    """Get all notebooks."""
    notebooks = Notebook.query.order_by(Notebook.updated_at.desc()).all()
    return jsonify({
        'success': True,
        'data': [nb.to_dict() for nb in notebooks]
    })


@notebook_bp.route('', methods=['POST'])
def create_notebook():
    """Create a notebook."""
    data = request.get_json()

    if not data or not data.get('name'):
        return jsonify({'success': False, 'error': 'Notebook name is required'}), 400

    notebook = Notebook(
        name=data['name'],
        description=data.get('description', '')
    )

    db.session.add(notebook)
    db.session.commit()

    return jsonify({
        'success': True,
        'data': notebook.to_dict()
    }), 201


@notebook_bp.route('/<notebook_id>', methods=['GET'])
def get_notebook(notebook_id):
    """Get a single notebook."""
    notebook = Notebook.query.get(notebook_id)

    if not notebook:
        return jsonify({'success': False, 'error': 'Notebook not found'}), 404

    return jsonify({
        'success': True,
        'data': notebook.to_dict(include_sources=True)
    })


@notebook_bp.route('/<notebook_id>', methods=['PUT'])
def update_notebook(notebook_id):
    """Update a notebook."""
    notebook = Notebook.query.get(notebook_id)

    if not notebook:
        return jsonify({'success': False, 'error': 'Notebook not found'}), 404

    data = request.get_json()

    if data.get('name'):
        notebook.name = data['name']
    if 'description' in data:
        notebook.description = data['description']

    db.session.commit()

    return jsonify({
        'success': True,
        'data': notebook.to_dict()
    })


@notebook_bp.route('/<notebook_id>', methods=['DELETE'])
def delete_notebook(notebook_id):
    """Delete a notebook."""
    notebook = Notebook.query.get(notebook_id)

    if not notebook:
        return jsonify({'success': False, 'error': 'Notebook not found'}), 404

    db.session.delete(notebook)
    db.session.commit()

    return jsonify({
        'success': True,
        'message': 'Notebook deleted'
    })
