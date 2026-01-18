"""
NoteBookLLM controllers.
"""
from flask import Blueprint

# Create blueprints.
notebook_bp = Blueprint('notebook', __name__, url_prefix='/api/notebooks')
folder_bp = Blueprint('folder', __name__, url_prefix='/api/folders')
source_bp = Blueprint('source', __name__, url_prefix='/api')
chat_bp = Blueprint('chat', __name__, url_prefix='/api/notebooks')
studio_bp = Blueprint('studio', __name__, url_prefix='/api/notebooks')
note_bp = Blueprint('note', __name__, url_prefix='/api')
settings_bp = Blueprint('settings', __name__, url_prefix='/api/settings')

# Import routes.
from . import notebook_controller
from . import folder_controller
from . import source_controller
from . import chat_controller
from . import studio_controller
from . import note_controller
from . import settings_controller
