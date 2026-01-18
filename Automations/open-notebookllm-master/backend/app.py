"""
NoteBookLLM Flask app entry.
"""
import os
import logging
from flask import Flask, jsonify
from flask_cors import CORS

from config import get_config
from models import db


def create_app():
    """Create the Flask app."""

    app = Flask(__name__)

    # Load configuration
    config = get_config()
    app.config.from_object(config)

    # Configure logging
    logging.basicConfig(
        level=getattr(logging, config.LOG_LEVEL),
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )

    # Initialize CORS
    CORS(app, origins=config.CORS_ORIGINS, supports_credentials=True)

    # Initialize database
    db.init_app(app)

    # Ensure upload directory exists
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

    # Register blueprints
    from controllers import notebook_bp, folder_bp, source_bp, chat_bp, studio_bp, note_bp, settings_bp

    app.register_blueprint(notebook_bp)
    app.register_blueprint(folder_bp)
    app.register_blueprint(source_bp)
    app.register_blueprint(chat_bp)
    app.register_blueprint(studio_bp)
    app.register_blueprint(note_bp)
    app.register_blueprint(settings_bp)

    # Create database tables
    with app.app_context():
        db.create_all()
        app.logger.info("Database initialization complete")

    # Health check endpoint
    @app.route('/health')
    def health_check():
        return jsonify({
            'status': 'healthy',
            'service': 'NoteBookLLM API'
        })

    # Root route
    @app.route('/')
    def index():
        return jsonify({
            'name': 'NoteBookLLM API',
            'version': '1.0.0',
            'endpoints': {
                'notebooks': '/api/notebooks',
                'folders': '/api/folders',
                'sources': '/api/notebooks/<id>/sources',
                'chat': '/api/notebooks/<id>/chats',
                'studio': '/api/notebooks/<id>/studio',
                'notes': '/api/notebooks/<id>/notes',
                'settings': '/api/settings',
                'health': '/health'
            }
        })

    # Global error handlers
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({
            'success': False,
            'error': 'Resource not found'
        }), 404

    @app.errorhandler(500)
    def server_error(error):
        app.logger.error(f"Server error: {error}")
        return jsonify({
            'success': False,
            'error': 'Internal server error'
        }), 500

    return app


# Create app instance
app = create_app()


if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(
        host='0.0.0.0',
        port=port,
        debug=app.config.get('DEBUG', False)
    )
