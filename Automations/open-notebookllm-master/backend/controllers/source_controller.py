"""
Source controller - supports multiple source types.
"""
import os
import uuid
from flask import request, jsonify, current_app
from werkzeug.utils import secure_filename
from . import source_bp, notebook_bp
from models import db, Notebook, Source
from services.file_parser_service import get_file_parser
from services.rag_service import get_rag_service
from services.search_service import get_search_service
from services.web_scraper_service import get_web_scraper
from services.youtube_service import get_youtube_service
from services.audio_service import get_audio_service

# Supported audio formats.
AUDIO_EXTENSIONS = {'mp3', 'mp4', 'mpeg', 'mpga', 'm4a', 'wav', 'webm', 'ogg', 'flac'}


def allowed_file(filename):
    """Check whether a file is allowed to upload."""
    ext = filename.rsplit('.', 1)[1].lower() if '.' in filename else ''
    all_extensions = current_app.config['ALLOWED_EXTENSIONS'] | AUDIO_EXTENSIONS
    return ext in all_extensions


@notebook_bp.route('/<notebook_id>/sources', methods=['GET'])
def list_sources(notebook_id):
    """Get all sources for a notebook."""
    notebook = Notebook.query.get(notebook_id)
    if not notebook:
        return jsonify({'success': False, 'error': 'Notebook not found'}), 404

    sources = Source.query.filter_by(notebook_id=notebook_id).order_by(Source.created_at.desc()).all()

    return jsonify({
        'success': True,
        'data': [s.to_dict() for s in sources]
    })


@notebook_bp.route('/<notebook_id>/sources/upload', methods=['POST'])
def upload_source(notebook_id):
    """Upload a file source (supports files and audio)."""
    notebook = Notebook.query.get(notebook_id)
    if not notebook:
        return jsonify({'success': False, 'error': 'Notebook not found'}), 404

    if 'file' not in request.files:
        return jsonify({'success': False, 'error': 'No file uploaded'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'success': False, 'error': 'No file selected'}), 400

    if not allowed_file(file.filename):
        return jsonify({'success': False, 'error': 'Unsupported file format'}), 400

    # Save file.
    filename = secure_filename(file.filename)
    unique_filename = f"{uuid.uuid4()}_{filename}"
    file_path = os.path.join(current_app.config['UPLOAD_FOLDER'], unique_filename)

    os.makedirs(os.path.dirname(file_path), exist_ok=True)
    file.save(file_path)

    # Determine file type.
    ext = filename.rsplit('.', 1)[1].lower()

    # If audio, run speech-to-text.
    if ext in AUDIO_EXTENSIONS:
        audio_service = get_audio_service()
        stt_provider = request.form.get('stt_provider', 'openai')
        language = request.form.get('language')

        content, metadata, error = audio_service.transcribe_file(
            file_path, language=language, provider=stt_provider
        )

        if error:
            os.remove(file_path)
            return jsonify({'success': False, 'error': error}), 400

        source = Source(
            notebook_id=notebook_id,
            type='audio',
            name=filename,
            content=content,
            file_path=file_path,
            metadata={
                'original_filename': filename,
                'file_size': os.path.getsize(file_path),
                'duration': metadata.get('duration'),
                'language': metadata.get('language'),
                'stt_provider': stt_provider
            }
        )
    else:
        # Parse file.
        file_parser = get_file_parser()
        content, error = file_parser.parse_file(file_path, filename)

        if error:
            os.remove(file_path)
            return jsonify({'success': False, 'error': error}), 400

        type_map = {
            'pdf': 'pdf',
            'txt': 'text',
            'md': 'text',
            'docx': 'gdocs',
            'doc': 'gdocs',
            'xlsx': 'gdocs',
            'xls': 'gdocs',
            'csv': 'gdocs'
        }

        source = Source(
            notebook_id=notebook_id,
            type=type_map.get(ext, 'text'),
            name=filename,
            content=content,
            file_path=file_path,
            metadata={
                'original_filename': filename,
                'file_size': os.path.getsize(file_path)
            }
        )

    db.session.add(source)
    db.session.commit()

    # Build vector embeddings and full-text index.
    try:
        rag_service = get_rag_service()
        rag_service.process_source(source)

        search_service = get_search_service()
        search_service.index_source(source)
    except Exception as e:
        current_app.logger.error(f"Index build failed: {e}")

    return jsonify({
        'success': True,
        'data': source.to_dict()
    }), 201


@notebook_bp.route('/<notebook_id>/sources/url', methods=['POST'])
def add_url_source(notebook_id):
    """Add a URL source (improved web scraper)."""
    notebook = Notebook.query.get(notebook_id)
    if not notebook:
        return jsonify({'success': False, 'error': 'Notebook not found'}), 404

    data = request.get_json()
    url = data.get('url')

    if not url:
        return jsonify({'success': False, 'error': 'url is required'}), 400

    try:
        web_scraper = get_web_scraper()
        content, metadata, error = web_scraper.scrape_url(url)

        if error:
            return jsonify({'success': False, 'error': error}), 400

        title = metadata.get('title') or url[:100]

        # Create source.
        source = Source(
            notebook_id=notebook_id,
            type='web',
            name=title[:200],
            url=url,
            content=content,
            metadata=metadata
        )

        db.session.add(source)
        db.session.commit()

        # Build vector embeddings and full-text index.
        try:
            rag_service = get_rag_service()
            rag_service.process_source(source)

            search_service = get_search_service()
            search_service.index_source(source)
        except Exception as e:
            current_app.logger.error(f"Index build failed: {e}")

        return jsonify({
            'success': True,
            'data': source.to_dict()
        }), 201

    except Exception as e:
        return jsonify({'success': False, 'error': f'Web scrape failed: {str(e)}'}), 400


@notebook_bp.route('/<notebook_id>/sources/youtube', methods=['POST'])
def add_youtube_source(notebook_id):
    """Add a YouTube source (improved YouTube service)."""
    notebook = Notebook.query.get(notebook_id)
    if not notebook:
        return jsonify({'success': False, 'error': 'Notebook not found'}), 404

    data = request.get_json()
    url = data.get('url')

    if not url:
        return jsonify({'success': False, 'error': 'YouTube url is required'}), 400

    try:
        youtube_service = get_youtube_service()
        content, metadata, error = youtube_service.process_youtube_url(url)

        if error:
            return jsonify({'success': False, 'error': error}), 400

        title = metadata.get('title') or f"YouTube Video ({metadata.get('video_id', 'unknown')})"

        # Create source.
        source = Source(
            notebook_id=notebook_id,
            type='youtube',
            name=title[:200],
            url=url,
            content=content,
            metadata=metadata
        )

        db.session.add(source)
        db.session.commit()

        # Build vector embeddings and full-text index.
        try:
            rag_service = get_rag_service()
            rag_service.process_source(source)

            search_service = get_search_service()
            search_service.index_source(source)
        except Exception as e:
            current_app.logger.error(f"Index build failed: {e}")

        return jsonify({
            'success': True,
            'data': source.to_dict()
        }), 201

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400


@notebook_bp.route('/<notebook_id>/sources/text', methods=['POST'])
def add_text_source(notebook_id):
    """Add a plain text source."""
    notebook = Notebook.query.get(notebook_id)
    if not notebook:
        return jsonify({'success': False, 'error': 'Notebook not found'}), 404

    data = request.get_json()
    name = data.get('name', 'Untitled text')
    content = data.get('content')

    if not content:
        return jsonify({'success': False, 'error': 'content is required'}), 400

    source = Source(
        notebook_id=notebook_id,
        type='text',
        name=name,
        content=content
    )

    db.session.add(source)
    db.session.commit()

    # Build vector embeddings.
    try:
        rag_service = get_rag_service()
        rag_service.process_source(source)
    except Exception as e:
        current_app.logger.error(f"Embedding creation failed: {e}")

    return jsonify({
        'success': True,
        'data': source.to_dict()
    }), 201


@source_bp.route('/sources/<source_id>', methods=['GET'])
def get_source(source_id):
    """Get a single source."""
    source = Source.query.get(source_id)
    if not source:
        return jsonify({'success': False, 'error': 'Source not found'}), 404

    return jsonify({
        'success': True,
        'data': source.to_dict(include_content=True)
    })


@source_bp.route('/sources/<source_id>', methods=['DELETE'])
def delete_source(source_id):
    """Delete a source."""
    source = Source.query.get(source_id)
    if not source:
        return jsonify({'success': False, 'error': 'Source not found'}), 404

    # Delete file.
    if source.file_path and os.path.exists(source.file_path):
        os.remove(source.file_path)

    # Delete embeddings.
    rag_service = get_rag_service()
    rag_service.delete_source_embeddings(source_id)

    # Delete full-text index.
    search_service = get_search_service()
    search_service.remove_source_index(source_id)

    db.session.delete(source)
    db.session.commit()

    return jsonify({
        'success': True,
        'message': 'Source deleted'
    })


# ==================== Search API ====================

@notebook_bp.route('/<notebook_id>/search', methods=['POST'])
def search_sources(notebook_id):
    """Search sources in a notebook (hybrid search)."""
    notebook = Notebook.query.get(notebook_id)
    if not notebook:
        return jsonify({'success': False, 'error': 'Notebook not found'}), 404

    data = request.get_json()
    query = data.get('query', '')
    search_type = data.get('type', 'hybrid')  # 'hybrid', 'fulltext', 'vector'
    top_k = data.get('top_k', 10)
    source_ids = data.get('source_ids')  # Optional: limit search scope.

    if not query:
        return jsonify({'success': False, 'error': 'search query is required'}), 400

    search_service = get_search_service()

    if search_type == 'fulltext':
        results = search_service.fulltext_search(
            query, source_ids=source_ids, notebook_id=notebook_id, limit=top_k
        )
    elif search_type == 'vector':
        rag_service = get_rag_service()
        raw_results = rag_service.retrieve(
            query, source_ids=source_ids, notebook_id=notebook_id, top_k=top_k
        )
        results = [
            {
                "source_id": r[2],
                "source_name": r[3],
                "snippet": r[0][:200] + "..." if len(r[0]) > 200 else r[0],
                "score": r[1],
                "search_type": "vector"
            }
            for r in raw_results
        ]
    else:  # hybrid
        results = search_service.hybrid_search(
            query, source_ids=source_ids, notebook_id=notebook_id, top_k=top_k
        )

    return jsonify({
        'success': True,
        'data': {
            'query': query,
            'type': search_type,
            'results': results
        }
    })


@source_bp.route('/sources/reindex', methods=['POST'])
def reindex_sources():
    """Rebuild full-text search index."""
    data = request.get_json() or {}
    notebook_id = data.get('notebook_id')

    search_service = get_search_service()
    count = search_service.reindex_all(notebook_id)

    return jsonify({
        'success': True,
        'message': f'Rebuilt indexes for {count} sources'
    })
