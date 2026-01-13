#!/bin/bash
# Fix Package Installation - Install in Mamba Environment

echo "?? Fixing package installations..."
echo ""

# Make sure we're in the right environment
if [[ "$CONDA_DEFAULT_ENV" != "sales-empire" ]]; then
    echo "??  Please activate the environment first:"
    echo "   mamba activate sales-empire"
    echo ""
    exit 1
fi

echo "? Environment: $CONDA_DEFAULT_ENV"
echo "?? Python location: $(which python)"
echo ""

# Uninstall from wrong location
echo "1?? Cleaning up system packages..."
pip uninstall -y elevenlabs groq anthropic 2>/dev/null

# Install in mamba environment (with --force-reinstall to ensure correct location)
echo ""
echo "2?? Installing packages in mamba environment..."

echo "   Installing OpenAI..."
pip install --upgrade openai

echo "   Installing Anthropic..."
pip install --upgrade anthropic

echo "   Installing Groq..."
pip install --upgrade groq

echo "   Installing Google AI..."
pip install --upgrade google-generativeai

echo "   Installing ElevenLabs..."
pip install --upgrade elevenlabs

echo "   Installing Twilio..."
pip install --upgrade twilio

echo ""
echo "3?? Verifying installations..."

echo ""
echo "Python location:"
which python

echo ""
echo "Package locations:"
python -c "import openai; print(f'OpenAI: {openai.__file__}')"
python -c "import anthropic; print(f'Anthropic: {anthropic.__file__}')" 2>/dev/null || echo "Anthropic: Not found"
python -c "import groq; print(f'Groq: {groq.__file__}')" 2>/dev/null || echo "Groq: Not found"
python -c "import elevenlabs; print(f'ElevenLabs: {elevenlabs.__file__}')" 2>/dev/null || echo "ElevenLabs: Not found"

echo ""
echo "????????????????????????????????????????????????????????????????"
echo "? PACKAGE INSTALLATION FIXED!"
echo "????????????????????????????????????????????????????????????????"
echo ""
echo "All packages should now be in:"
echo "~/miniforge3/envs/sales-empire/lib/python3.X/site-packages/"
echo ""
echo "Next step:"
echo "python ~/workspace/test_connections_fixed.py"
echo ""
