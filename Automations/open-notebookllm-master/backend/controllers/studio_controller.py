"""
Studio controller - supports multiple content generators (including podcasts).
"""
from flask import request, jsonify, Response
from . import studio_bp
from models import db, Notebook, StudioOutput
from services.studio_service import get_studio_service
from services.podcast_service import get_podcast_service
from services.audio_service import get_audio_service


@studio_bp.route('/<notebook_id>/studio/outputs', methods=['GET'])
def list_outputs(notebook_id):
    """Get the list of studio outputs."""
    notebook = Notebook.query.get(notebook_id)
    if not notebook:
        return jsonify({'success': False, 'error': 'Notebook not found'}), 404

    outputs = StudioOutput.query.filter_by(notebook_id=notebook_id).order_by(StudioOutput.created_at.desc()).all()

    return jsonify({
        'success': True,
        'data': [o.to_dict() for o in outputs]
    })


@studio_bp.route('/<notebook_id>/studio/summary', methods=['POST'])
def generate_summary(notebook_id):
    """Generate a summary."""
    notebook = Notebook.query.get(notebook_id)
    if not notebook:
        return jsonify({'success': False, 'error': 'Notebook not found'}), 404

    data = request.get_json() or {}
    source_ids = data.get('source_ids')

    studio_service = get_studio_service()
    result = studio_service.generate_summary(source_ids=source_ids, notebook_id=notebook_id)

    if 'error' in result:
        return jsonify({'success': False, 'error': result['error']}), 400

    # Save output.
    output = StudioOutput(
        notebook_id=notebook_id,
        type='summary',
        title='Summary',
        data=result,
        source_ids=source_ids
    )
    db.session.add(output)
    db.session.commit()

    return jsonify({
        'success': True,
        'data': output.to_dict()
    })


@studio_bp.route('/<notebook_id>/studio/mindmap', methods=['POST'])
def generate_mindmap(notebook_id):
    """Generate a mind map."""
    notebook = Notebook.query.get(notebook_id)
    if not notebook:
        return jsonify({'success': False, 'error': 'Notebook not found'}), 404

    data = request.get_json() or {}
    source_ids = data.get('source_ids')

    studio_service = get_studio_service()
    result = studio_service.generate_mindmap(source_ids=source_ids, notebook_id=notebook_id)

    if 'error' in result:
        return jsonify({'success': False, 'error': result['error']}), 400

    output = StudioOutput(
        notebook_id=notebook_id,
        type='mindmap',
        title='Mind Map',
        data=result,
        source_ids=source_ids
    )
    db.session.add(output)
    db.session.commit()

    return jsonify({
        'success': True,
        'data': output.to_dict()
    })


@studio_bp.route('/<notebook_id>/studio/flashcards', methods=['POST'])
def generate_flashcards(notebook_id):
    """
    Generate flashcards.

    Request body:
    {
        "source_ids": ["id1", "id2"],  // Optional, specify sources
        "count": 10,                    // Optional, number of cards
        "difficulty": "mixed"           // Optional: easy/medium/hard/mixed
    }
    """
    notebook = Notebook.query.get(notebook_id)
    if not notebook:
        return jsonify({'success': False, 'error': 'Notebook not found'}), 404

    data = request.get_json() or {}
    source_ids = data.get('source_ids')
    count = data.get('count', 10)
    difficulty = data.get('difficulty', 'mixed')

    studio_service = get_studio_service()
    result = studio_service.generate_flashcards(
        count=count,
        source_ids=source_ids,
        notebook_id=notebook_id,
        difficulty=difficulty
    )

    if 'error' in result:
        return jsonify({'success': False, 'error': result['error']}), 400

    # Include difficulty in the title.
    difficulty_labels = {'easy': 'Easy', 'medium': 'Medium', 'hard': 'Hard', 'mixed': 'Mixed'}
    title = f"Flashcards ({difficulty_labels.get(difficulty, 'Mixed')} difficulty)"

    output = StudioOutput(
        notebook_id=notebook_id,
        type='flashcards',
        title=title,
        data=result,
        source_ids=source_ids
    )
    db.session.add(output)
    db.session.commit()

    return jsonify({
        'success': True,
        'data': output.to_dict()
    })


@studio_bp.route('/<notebook_id>/studio/quiz', methods=['POST'])
def generate_quiz(notebook_id):
    """
    Generate a quiz.

    Request body:
    {
        "source_ids": ["id1", "id2"],  // Optional, specify sources
        "count": 10,                    // Optional, number of questions
        "difficulty": "mixed"           // Optional: easy/medium/hard/mixed
    }
    """
    notebook = Notebook.query.get(notebook_id)
    if not notebook:
        return jsonify({'success': False, 'error': 'Notebook not found'}), 404

    data = request.get_json() or {}
    source_ids = data.get('source_ids')
    count = data.get('count', 10)
    difficulty = data.get('difficulty', 'mixed')

    studio_service = get_studio_service()
    result = studio_service.generate_quiz(
        count=count,
        source_ids=source_ids,
        notebook_id=notebook_id,
        difficulty=difficulty
    )

    if 'error' in result:
        return jsonify({'success': False, 'error': result['error']}), 400

    # Include difficulty in the title.
    difficulty_labels = {'easy': 'Easy', 'medium': 'Medium', 'hard': 'Hard', 'mixed': 'Mixed'}
    title = f"Quiz ({difficulty_labels.get(difficulty, 'Mixed')} difficulty)"

    output = StudioOutput(
        notebook_id=notebook_id,
        type='quiz',
        title=title,
        data=result,
        source_ids=source_ids
    )
    db.session.add(output)
    db.session.commit()

    return jsonify({
        'success': True,
        'data': output.to_dict()
    })


@studio_bp.route('/<notebook_id>/studio/report', methods=['POST'])
def generate_report(notebook_id):
    """Generate a report."""
    notebook = Notebook.query.get(notebook_id)
    if not notebook:
        return jsonify({'success': False, 'error': 'Notebook not found'}), 404

    data = request.get_json() or {}
    source_ids = data.get('source_ids')

    studio_service = get_studio_service()
    result = studio_service.generate_report(source_ids=source_ids, notebook_id=notebook_id)

    if 'error' in result:
        return jsonify({'success': False, 'error': result['error']}), 400

    output = StudioOutput(
        notebook_id=notebook_id,
        type='report',
        title='Report',
        data=result,
        source_ids=source_ids
    )
    db.session.add(output)
    db.session.commit()

    return jsonify({
        'success': True,
        'data': output.to_dict()
    })


@studio_bp.route('/<notebook_id>/studio/datatable', methods=['POST'])
def generate_datatable(notebook_id):
    """Generate a data table."""
    notebook = Notebook.query.get(notebook_id)
    if not notebook:
        return jsonify({'success': False, 'error': 'Notebook not found'}), 404

    data = request.get_json() or {}
    source_ids = data.get('source_ids')

    studio_service = get_studio_service()
    result = studio_service.generate_datatable(source_ids=source_ids, notebook_id=notebook_id)

    if 'error' in result:
        return jsonify({'success': False, 'error': result['error']}), 400

    output = StudioOutput(
        notebook_id=notebook_id,
        type='datatable',
        title='Data Table',
        data=result,
        source_ids=source_ids
    )
    db.session.add(output)
    db.session.commit()

    return jsonify({
        'success': True,
        'data': output.to_dict()
    })


@studio_bp.route('/<notebook_id>/studio/presentation', methods=['POST'])
def generate_presentation(notebook_id):
    """Generate a presentation (with images)."""
    notebook = Notebook.query.get(notebook_id)
    if not notebook:
        return jsonify({'success': False, 'error': 'Notebook not found'}), 404

    data = request.get_json() or {}
    source_ids = data.get('source_ids')
    slide_count = data.get('slide_count', 8)
    with_images = data.get('with_images', True)

    studio_service = get_studio_service()
    result = studio_service.generate_presentation(
        source_ids=source_ids,
        notebook_id=notebook_id,
        slide_count=slide_count,
        with_images=with_images
    )

    if 'error' in result:
        return jsonify({'success': False, 'error': result['error']}), 400

    output = StudioOutput(
        notebook_id=notebook_id,
        type='presentation',
        title='Presentation',
        data=result,
        source_ids=source_ids
    )
    db.session.add(output)
    db.session.commit()

    return jsonify({
        'success': True,
        'data': output.to_dict()
    })


@studio_bp.route('/<notebook_id>/studio/infographic', methods=['POST'])
def generate_infographic(notebook_id):
    """
    Generate an infographic (Chart.js visualization).

    Request body:
    {
        "source_ids": ["id1", "id2"],  // Optional, specify sources
        "with_ai_image": false          // Optional, generate an AI decorative image
    }

    Response:
    {
        "data": {
            "title": "Chart title",
            "description": "Chart description",
            "charts": [
                {
                    "id": "chart1",
                    "title": "Subchart title",
                    "type": "bar/line/pie/radar/...",
                    "config": { /* Chart.js config */ }
                }
            ],
            "summary": {
                "key_findings": ["Finding 1", "Finding 2"],
                "recommendations": ["Recommendation 1"]
            }
        }
    }
    """
    notebook = Notebook.query.get(notebook_id)
    if not notebook:
        return jsonify({'success': False, 'error': 'Notebook not found'}), 404

    data = request.get_json() or {}
    source_ids = data.get('source_ids')
    with_ai_image = data.get('with_ai_image', False)

    studio_service = get_studio_service()
    result = studio_service.generate_infographic(
        source_ids=source_ids,
        notebook_id=notebook_id,
        with_ai_image=with_ai_image
    )

    if 'error' in result:
        return jsonify({'success': False, 'error': result['error']}), 400

    # Get chart count and types.
    charts = result.get('charts', [])
    chart_types = list(set([c.get('type', 'bar') for c in charts]))
    title = result.get('data', {}).get('title', 'Infographic')

    output = StudioOutput(
        notebook_id=notebook_id,
        type='infographic',
        title=f"{title} ({len(charts)} charts)",
        data=result,
        source_ids=source_ids
    )
    db.session.add(output)
    db.session.commit()

    return jsonify({
        'success': True,
        'data': output.to_dict()
    })


@studio_bp.route('/<notebook_id>/studio/flowchart', methods=['POST'])
def generate_flowchart(notebook_id):
    """
    Generate a flowchart (draw.io format).

    Request body:
    {
        "source_ids": ["id1", "id2"]  // Optional, specify sources
    }

    Response:
    {
        "data": {
            "title": "Flowchart title",
            "description": "Description",
            "xml": "<mxGraphModel>...</mxGraphModel>",
            "type": "flowchart"
        }
    }
    """
    notebook = Notebook.query.get(notebook_id)
    if not notebook:
        return jsonify({'success': False, 'error': 'Notebook not found'}), 404

    data = request.get_json() or {}
    source_ids = data.get('source_ids')

    studio_service = get_studio_service()
    result = studio_service.generate_flowchart(
        source_ids=source_ids,
        notebook_id=notebook_id
    )

    if 'error' in result:
        return jsonify({'success': False, 'error': result['error']}), 400

    title = result.get('title', 'Flowchart')

    output = StudioOutput(
        notebook_id=notebook_id,
        type='flowchart',
        title=title,
        data=result,
        source_ids=source_ids
    )
    db.session.add(output)
    db.session.commit()

    return jsonify({
        'success': True,
        'data': output.to_dict()
    })


@studio_bp.route('/<notebook_id>/studio/diagram', methods=['POST'])
def generate_diagram(notebook_id):
    """
    Generate an architecture/system diagram (draw.io format).

    Request body:
    {
        "source_ids": ["id1", "id2"],  // Optional, specify sources
        "diagram_type": "auto"          // Optional: auto/architecture/sequence/class/er/network
    }

    Response:
    {
        "data": {
            "title": "Diagram title",
            "description": "Description",
            "xml": "<mxGraphModel>...</mxGraphModel>",
            "type": "diagram",
            "diagram_type": "architecture"
        }
    }
    """
    notebook = Notebook.query.get(notebook_id)
    if not notebook:
        return jsonify({'success': False, 'error': 'Notebook not found'}), 404

    data = request.get_json() or {}
    source_ids = data.get('source_ids')
    diagram_type = data.get('diagram_type', 'auto')

    studio_service = get_studio_service()
    result = studio_service.generate_diagram(
        source_ids=source_ids,
        notebook_id=notebook_id,
        diagram_type=diagram_type
    )

    if 'error' in result:
        return jsonify({'success': False, 'error': result['error']}), 400

    title = result.get('title', 'Architecture Diagram')
    actual_type = result.get('diagram_type', diagram_type)
    type_labels = {
        'architecture': 'Architecture',
        'sequence': 'Sequence',
        'class': 'Class',
        'er': 'ER Diagram',
        'network': 'Network',
        'auto': 'System'
    }

    output = StudioOutput(
        notebook_id=notebook_id,
        type='diagram',
        title=f"{title} ({type_labels.get(actual_type, actual_type)})",
        data=result,
        source_ids=source_ids
    )
    db.session.add(output)
    db.session.commit()

    return jsonify({
        'success': True,
        'data': output.to_dict()
    })


@studio_bp.route('/<notebook_id>/studio/generate', methods=['POST'])
def generate_output(notebook_id):
    """Generic generation endpoint."""
    notebook = Notebook.query.get(notebook_id)
    if not notebook:
        return jsonify({'success': False, 'error': 'Notebook not found'}), 404

    data = request.get_json() or {}
    output_type = data.get('type')
    source_ids = data.get('source_ids')

    if not output_type:
        return jsonify({'success': False, 'error': 'Please specify an output type'}), 400

    studio_service = get_studio_service()

    # Call the matching method by type.
    difficulty = data.get('difficulty', 'mixed')
    type_methods = {
        'summary': lambda: studio_service.generate_summary(source_ids=source_ids, notebook_id=notebook_id),
        'mindmap': lambda: studio_service.generate_mindmap(source_ids=source_ids, notebook_id=notebook_id),
        'flashcards': lambda: studio_service.generate_flashcards(count=data.get('count', 10), source_ids=source_ids, notebook_id=notebook_id, difficulty=difficulty),
        'quiz': lambda: studio_service.generate_quiz(count=data.get('count', 10), source_ids=source_ids, notebook_id=notebook_id, difficulty=difficulty),
        'report': lambda: studio_service.generate_report(source_ids=source_ids, notebook_id=notebook_id),
        'datatable': lambda: studio_service.generate_datatable(source_ids=source_ids, notebook_id=notebook_id),
        'presentation': lambda: studio_service.generate_presentation(source_ids=source_ids, notebook_id=notebook_id, slide_count=data.get('slide_count', 8), with_images=data.get('with_images', True)),
        'infographic': lambda: studio_service.generate_infographic(source_ids=source_ids, notebook_id=notebook_id, with_ai_image=data.get('with_ai_image', False)),
        'flowchart': lambda: studio_service.generate_flowchart(source_ids=source_ids, notebook_id=notebook_id),
        'diagram': lambda: studio_service.generate_diagram(source_ids=source_ids, notebook_id=notebook_id, diagram_type=data.get('diagram_type', 'auto')),
    }

    if output_type not in type_methods:
        return jsonify({'success': False, 'error': f'Unsupported output type: {output_type}'}), 400

    result = type_methods[output_type]()

    if 'error' in result:
        return jsonify({'success': False, 'error': result['error']}), 400

    # Save output.
    type_titles = {
        'summary': 'Summary',
        'mindmap': 'Mind Map',
        'flashcards': 'Flashcards',
        'quiz': 'Quiz',
        'report': 'Report',
        'datatable': 'Data Table',
        'presentation': 'Presentation',
        'infographic': 'Infographic',
        'flowchart': 'Flowchart',
        'diagram': 'Architecture Diagram',
    }

    output = StudioOutput(
        notebook_id=notebook_id,
        type=output_type,
        title=type_titles.get(output_type, output_type),
        data=result,
        source_ids=source_ids
    )
    db.session.add(output)
    db.session.commit()

    return jsonify({
        'success': True,
        'data': output.to_dict()
    })


@studio_bp.route('/<notebook_id>/studio/outputs/<output_id>', methods=['GET'])
def get_output(notebook_id, output_id):
    """Get a single output."""
    output = StudioOutput.query.filter_by(id=output_id, notebook_id=notebook_id).first()

    if not output:
        return jsonify({'success': False, 'error': 'Output not found'}), 404

    return jsonify({
        'success': True,
        'data': output.to_dict()
    })


@studio_bp.route('/<notebook_id>/studio/outputs/<output_id>', methods=['DELETE'])
def delete_output(notebook_id, output_id):
    """Delete an output."""
    output = StudioOutput.query.filter_by(id=output_id, notebook_id=notebook_id).first()

    if not output:
        return jsonify({'success': False, 'error': 'Output not found'}), 404

    db.session.delete(output)
    db.session.commit()

    return jsonify({
        'success': True,
        'message': 'Output deleted'
    })


# ==================== Podcast API ====================

@studio_bp.route('/<notebook_id>/studio/podcast', methods=['POST'])
def generate_podcast(notebook_id):
    """
    Generate a podcast (script + optional audio).

    Request body:
    {
        "source_ids": ["id1", "id2"],  // Optional, specify sources
        "speakers": [                   // Optional, speaker settings
            {"name": "Alex", "role": "host", "personality": "enthusiastic and curious"},
            {"name": "Jamie", "role": "co-host", "personality": "professional and thoughtful"}
        ],
        "duration_minutes": 10,         // Optional, target duration
        "style": "conversational",      // Optional, style
        "with_audio": true,             // Optional, generate audio
        "speaker_voices": {             // Optional, voice mapping
            "Alex": "onyx",
            "Jamie": "nova"
        }
    }
    """
    notebook = Notebook.query.get(notebook_id)
    if not notebook:
        return jsonify({'success': False, 'error': 'Notebook not found'}), 404

    data = request.get_json() or {}
    source_ids = data.get('source_ids')
    speakers = data.get('speakers')
    duration_minutes = data.get('duration_minutes', 10)
    style = data.get('style', 'conversational')
    with_audio = data.get('with_audio', False)
    speaker_voices = data.get('speaker_voices')

    # Get source content.
    from services.studio_service import get_studio_service
    studio_service = get_studio_service()
    content = studio_service.get_sources_content(source_ids=source_ids, notebook_id=notebook_id)

    if not content:
        return jsonify({'success': False, 'error': 'No source content available'}), 400

    podcast_service = get_podcast_service()

    # Generate full podcast.
    result = podcast_service.generate_full_podcast(
        content=content,
        speakers=speakers,
        duration_minutes=duration_minutes,
        style=style,
        with_audio=with_audio,
        speaker_voices=speaker_voices
    )

    if result.get('error') and not result.get('script'):
        return jsonify({'success': False, 'error': result['error']}), 400

    # Save output (exclude audio data because it is large).
    output_data = {
        'type': 'podcast',
        'script': result.get('script'),
        'has_audio': result.get('audio') is not None,
        'error': result.get('error')
    }

    output = StudioOutput(
        notebook_id=notebook_id,
        type='podcast',
        title=result.get('script', {}).get('title', 'Podcast'),
        data=output_data,
        source_ids=source_ids
    )
    db.session.add(output)
    db.session.commit()

    # Include audio_base64 in response when present.
    response_data = output.to_dict()
    if result.get('audio_base64'):
        response_data['audio_base64'] = result['audio_base64']

    return jsonify({
        'success': True,
        'data': response_data
    })


@studio_bp.route('/<notebook_id>/studio/podcast/script', methods=['POST'])
def generate_podcast_script(notebook_id):
    """Generate a podcast script only (no audio)."""
    notebook = Notebook.query.get(notebook_id)
    if not notebook:
        return jsonify({'success': False, 'error': 'Notebook not found'}), 404

    data = request.get_json() or {}
    source_ids = data.get('source_ids')
    speakers = data.get('speakers')
    duration_minutes = data.get('duration_minutes', 10)
    style = data.get('style', 'conversational')

    # Get source content.
    from services.studio_service import get_studio_service
    studio_service = get_studio_service()
    content = studio_service.get_sources_content(source_ids=source_ids, notebook_id=notebook_id)

    if not content:
        return jsonify({'success': False, 'error': 'No source content available'}), 400

    podcast_service = get_podcast_service()
    script, error = podcast_service.generate_podcast_script(
        content=content,
        speakers=speakers,
        duration_minutes=duration_minutes,
        style=style
    )

    if error:
        return jsonify({'success': False, 'error': error}), 400

    return jsonify({
        'success': True,
        'data': {
            'script': script
        }
    })


@studio_bp.route('/<notebook_id>/studio/podcast/audio', methods=['POST'])
def generate_podcast_audio(notebook_id):
    """Generate podcast audio from a script."""
    notebook = Notebook.query.get(notebook_id)
    if not notebook:
        return jsonify({'success': False, 'error': 'Notebook not found'}), 404

    data = request.get_json() or {}
    script = data.get('script')
    speaker_voices = data.get('speaker_voices')

    if not script:
        return jsonify({'success': False, 'error': 'script is required'}), 400

    podcast_service = get_podcast_service()
    audio_data, error = podcast_service.generate_podcast_audio(
        script=script,
        speaker_voices=speaker_voices
    )

    if error:
        return jsonify({'success': False, 'error': error}), 400

    import base64
    audio_base64 = base64.b64encode(audio_data).decode('utf-8')

    return jsonify({
        'success': True,
        'data': {
            'audio_base64': audio_base64,
            'format': 'mp3'
        }
    })


@studio_bp.route('/<notebook_id>/studio/podcast/voices', methods=['GET'])
def get_podcast_voices(notebook_id):
    """Get available podcast voices."""
    podcast_service = get_podcast_service()

    return jsonify({
        'success': True,
        'data': {
            'voices': podcast_service.get_available_voices(),
            'styles': podcast_service.get_style_options()
        }
    })


# ==================== TTS API ====================

@studio_bp.route('/<notebook_id>/studio/tts', methods=['POST'])
def text_to_speech(notebook_id):
    """Text-to-speech."""
    data = request.get_json() or {}
    text = data.get('text')
    voice = data.get('voice', 'alloy')
    provider = data.get('provider', 'openai')

    if not text:
        return jsonify({'success': False, 'error': 'text is required'}), 400

    audio_service = get_audio_service()
    audio_data, error = audio_service.text_to_speech(
        text=text,
        voice=voice,
        provider=provider
    )

    if error:
        return jsonify({'success': False, 'error': error}), 400

    import base64
    audio_base64 = base64.b64encode(audio_data).decode('utf-8')

    return jsonify({
        'success': True,
        'data': {
            'audio_base64': audio_base64,
            'format': 'mp3'
        }
    })


@studio_bp.route('/<notebook_id>/studio/tts/stream', methods=['POST'])
def text_to_speech_stream(notebook_id):
    """Text-to-speech (streaming)."""
    data = request.get_json() or {}
    text = data.get('text')
    voice = data.get('voice', 'alloy')

    if not text:
        return jsonify({'success': False, 'error': 'text is required'}), 400

    audio_service = get_audio_service()

    def generate():
        for chunk in audio_service.text_to_speech_stream(text, voice):
            yield chunk

    return Response(
        generate(),
        mimetype='audio/mpeg',
        headers={
            'Content-Disposition': 'attachment; filename=speech.mp3'
        }
    )
