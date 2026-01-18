#!/bin/bash
# Quick activation script

eval "$(mamba shell hook --shell bash)"
mamba activate sales-empire

echo "? Activated: sales-empire environment"
echo ""
echo "Python: $(python --version)"
echo "Location: $(which python)"
echo ""
