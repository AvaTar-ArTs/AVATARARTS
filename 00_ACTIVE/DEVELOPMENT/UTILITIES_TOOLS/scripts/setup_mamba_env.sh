#!/bin/bash
# Setup Mamba Environment for Universal Sales Empire

echo "?? Setting up Mamba Environment for Universal Sales Empire..."
echo ""

ENV_NAME="sales-empire"
PYTHON_VERSION="3.11"

# Check if mamba is installed
if ! command -v mamba &> /dev/null; then
    echo "? Mamba not found!"
    echo ""
    echo "Install Miniforge (includes mamba):"
    echo "  https://github.com/conda-forge/miniforge"
    echo ""
    echo "Or if you have conda:"
    echo "  conda install -c conda-forge mamba"
    exit 1
fi

echo "? Mamba found"
echo ""

# Check if environment already exists
if mamba env list | grep -q "^$ENV_NAME "; then
    echo "??  Environment '$ENV_NAME' already exists"
    read -p "Remove and recreate? (y/n): " recreate
    if [ "$recreate" = "y" ]; then
        mamba env remove -n $ENV_NAME -y
        echo "? Removed old environment"
    else
        echo "Keeping existing environment"
        exit 0
    fi
fi

echo "Creating environment: $ENV_NAME (Python $PYTHON_VERSION)"
echo ""

# Create environment
mamba create -n $ENV_NAME python=$PYTHON_VERSION -y

echo ""
echo "? Environment created"
echo ""

# Activate and install packages
echo "?? Installing packages..."
echo ""

# Activate environment
eval "$(mamba shell hook --shell bash)"
mamba activate $ENV_NAME

# Core packages
echo "Installing core packages..."
mamba install -c conda-forge -y \
    pip \
    requests \
    pandas \
    numpy

# AI/ML packages
echo "Installing AI packages..."
pip install --quiet \
    openai \
    anthropic \
    google-generativeai \
    groq

# Voice AI
echo "Installing voice AI..."
pip install --quiet \
    elevenlabs \
    assemblyai

# Communications
echo "Installing communication tools..."
pip install --quiet \
    twilio \
    python-dotenv

# Web scraping
echo "Installing web scraping..."
pip install --quiet \
    beautifulsoup4 \
    selenium \
    playwright

# Data & Vector
echo "Installing data tools..."
pip install --quiet \
    chromadb \
    sentence-transformers

# NLP
echo "Installing NLP tools..."
pip install --quiet \
    textblob \
    spacy

# Utilities
echo "Installing utilities..."
pip install --quiet \
    pydantic \
    tenacity \
    aiohttp

echo ""
echo "????????????????????????????????????????????????????????????????"
echo "? MAMBA ENVIRONMENT SETUP COMPLETE!"
echo "????????????????????????????????????????????????????????????????"
echo ""
echo "?? Environment: $ENV_NAME"
echo "?? Python: $PYTHON_VERSION"
echo ""
echo "To activate:"
echo "  mamba activate $ENV_NAME"
echo ""
echo "Or add to your script:"
echo "  eval \"\$(mamba shell hook --shell bash)\""
echo "  mamba activate $ENV_NAME"
echo ""
echo "Auto-activate (add to ~/.zshrc):"
echo "  echo 'mamba activate $ENV_NAME' >> ~/.zshrc"
echo ""
echo "????????????????????????????????????????????????????????????????"
echo ""

# Create activation helper
cat > ~/workspace/activate_env.sh << 'ACTIVATE'
#!/bin/bash
# Quick activation script

eval "$(mamba shell hook --shell bash)"
mamba activate sales-empire

echo "? Activated: sales-empire environment"
echo ""
echo "Python: $(python --version)"
echo "Location: $(which python)"
echo ""
ACTIVATE

chmod +x ~/workspace/activate_env.sh

echo "Quick activation: source ~/workspace/activate_env.sh"
echo ""
