#!/bin/bash

# Integrate Legacy Projects with Creative AI Empire
echo "🔗 Integrating Legacy Projects with Creative AI Empire..."

# Integrate Python projects
echo "🐍 Integrating Python projects..."
python3 /Users/steven/ai-sites/automation/integrate_python_projects.py

# Integrate HTML projects
echo "🌐 Integrating HTML projects..."
python3 /Users/steven/ai-sites/automation/integrate_html_projects.py

# Create legacy project index
echo "📋 Creating legacy project index..."
cat > /Users/steven/ai-sites/legacy-projects/README.md << 'EOL'
# Legacy Projects Integration

This directory contains integrated legacy projects from your existing development environment.

## Python Projects
- **AI Tools**: Integrated AI-related Python projects
- **Automation**: Integrated automation scripts
- **Production**: Integrated production-ready scripts
- **Experiments**: Integrated experimental projects
- **Utilities**: Integrated utility scripts

## HTML Projects
- **Portfolios**: Integrated portfolio and gallery projects
- **Landing Pages**: Integrated landing page projects
- **Tools**: Integrated tool and utility projects
- **Misc**: Integrated miscellaneous projects

## Usage
These projects are now accessible through the Creative AI Empire automation system.
Use the empire commands to manage and deploy these projects.

## Integration Status
- Python Projects: Integrated
- HTML Projects: Integrated
- PDF Documents: Available for content analysis
- Claude Projects: Available for skill development

EOL

echo "✅ Legacy projects integration complete!"
echo "📁 Legacy projects available at: /Users/steven/ai-sites/legacy-projects/"
