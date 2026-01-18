#!/bin/bash
# DNA Cold Case AI - Mamba Environment Setup Script
# Supports macOS (Intel & Apple Silicon) and Linux

set -e  # Exit on error

echo "========================================="
echo "DNA Cold Case AI - Mamba Setup"
echo "========================================="
echo ""

# Detect OS and architecture
OS=$(uname -s)
ARCH=$(uname -m)

echo "Detected OS: $OS"
echo "Detected Architecture: $ARCH"
echo ""

# Determine miniforge installer
if [[ "$OS" == "Darwin" ]]; then
    if [[ "$ARCH" == "arm64" ]]; then
        INSTALLER="Miniforge3-MacOSX-arm64.sh"
        PLATFORM="macOS Apple Silicon (M1/M2/M3)"
    else
        INSTALLER="Miniforge3-MacOSX-x86_64.sh"
        PLATFORM="macOS Intel"
    fi
elif [[ "$OS" == "Linux" ]]; then
    if [[ "$ARCH" == "aarch64" ]]; then
        INSTALLER="Miniforge3-Linux-aarch64.sh"
        PLATFORM="Linux ARM64"
    else
        INSTALLER="Miniforge3-Linux-x86_64.sh"
        PLATFORM="Linux x86_64"
    fi
else
    echo "ERROR: Unsupported operating system: $OS"
    exit 1
fi

echo "Platform: $PLATFORM"
echo ""

# Check if mamba is already installed
if command -v mamba &> /dev/null; then
    echo "✓ Mamba is already installed"
    mamba --version
    echo ""
else
    echo "Installing Miniforge (mamba)..."
    echo ""

    # Download miniforge installer
    INSTALLER_URL="https://github.com/conda-forge/miniforge/releases/latest/download/$INSTALLER"

    echo "Downloading from: $INSTALLER_URL"
    curl -L -O "$INSTALLER_URL"

    # Install miniforge
    echo ""
    echo "Running installer..."
    bash "$INSTALLER" -b -p "$HOME/miniforge3"

    # Clean up installer
    rm "$INSTALLER"

    # Initialize shell
    echo ""
    echo "Initializing shell configuration..."
    "$HOME/miniforge3/bin/conda" init "$(basename "$SHELL")"

    echo ""
    echo "✓ Miniforge installed successfully"
    echo ""
    echo "IMPORTANT: Please restart your terminal or run:"
    echo "  source ~/.$(basename "$SHELL")rc"
    echo ""
    echo "Then run this script again to create the environment."
    exit 0
fi

# Create conda environment
echo "Creating dna-cold-case-ai environment..."
echo ""

if mamba env list | grep -q "dna-cold-case-ai"; then
    echo "Environment already exists. Options:"
    echo "  1. Remove and recreate (recommended for updates)"
    echo "  2. Update existing environment"
    echo "  3. Skip environment creation"
    echo ""
    read -p "Choose option (1/2/3): " choice

    case $choice in
        1)
            echo "Removing existing environment..."
            mamba env remove -n dna-cold-case-ai -y
            echo "Creating new environment..."
            mamba env create -f environment.yml
            ;;
        2)
            echo "Updating existing environment..."
            mamba env update -n dna-cold-case-ai -f environment.yml --prune
            ;;
        3)
            echo "Skipping environment creation..."
            ;;
        *)
            echo "Invalid choice. Exiting."
            exit 1
            ;;
    esac
else
    mamba env create -f environment.yml
fi

echo ""
echo "========================================="
echo "✓ Setup Complete!"
echo "========================================="
echo ""
echo "To activate the environment, run:"
echo "  mamba activate dna-cold-case-ai"
echo ""
echo "Or:"
echo "  conda activate dna-cold-case-ai"
echo ""
echo "To verify installation:"
echo "  python --version"
echo "  python -c 'import numpy, scipy, pandas, sklearn, xgboost; print(\"All imports successful\")'"
echo ""
echo "To run the demo:"
echo "  python demo.py"
echo ""
echo "========================================="
