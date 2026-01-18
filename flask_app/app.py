import os
import uuid
from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename

app = Flask(__name__)

# Configuration
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'}
MAX_FILE_SIZE = 16 * 1024 * 1024  # 16 MB

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = MAX_FILE_SIZE

# Ensure upload folder exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def handle_upload(file, user_id):
    # Validate file type
    if not allowed_file(file.filename):
        return {"error": "Invalid file type"}, 400
    
    # Validate file size
    # Note: Flask's MAX_CONTENT_LENGTH handles this automatically, but we can do additional checks
    # Get file size by saving current position, seeking to end, then back
    file.seek(0, 2)  # Seek to end
    file_size = file.tell()
    file.seek(0)  # Reset file pointer
    if file_size > MAX_FILE_SIZE:
        return {"error": "File too large"}, 400
    
    # Process: create a safe, unique filename
    original_filename = secure_filename(file.filename)
    unique_filename = f"{user_id}_{uuid.uuid4().hex}_{original_filename}"
    
    # Store the file
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
    file.save(file_path)
    
    # Return reference
    file_url = f"/uploads/{unique_filename}"
    return {"success": True, "url": file_url, "filename": unique_filename}, 200

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    # In a real app, get user_id from session or authentication
    # For now, we'll use a placeholder
    user_id = "user123"
    
    result, status_code = handle_upload(file, user_id)
    return jsonify(result), status_code

@app.route('/')
def index():
    return '''
    <!doctype html>
    <title>Upload File</title>
    <h1>Upload File</h1>
    <form method=post enctype=multipart/form-data action="/upload">
      <input type=file name=file>
      <input type=submit value=Upload>
    </form>
    '''
