#!/bin/bash
# AI Voice Agents Environment Activation Script

echo "🎙️ Activating AI Voice Agents Environment"
echo "=========================================="

# Navigate to the project directory
cd "$(dirname "$0")"

# Initialize mamba and activate seo environment
eval "$(mamba shell hook --shell bash)" 2>/dev/null || true
mamba activate seo 2>/dev/null || {
    echo "⚠️  Mamba not available, trying conda..."
    conda activate seo 2>/dev/null || {
        echo "❌ Could not activate seo environment"
        echo "Please ensure mamba/conda is installed and seo environment exists"
        exit 1
    }
}

echo "✅ Environment activated!"
echo ""
echo "🧠 Advanced Intelligence Tools Available:"
echo "  python code_intelligence_engine.py      # AST-based code analysis"
echo "  python intelligent_project_analyzer.py  # Comprehensive project analysis"
echo ""
echo "🎙️ Voice Agent Tools:"
echo "  python openai_voice_agent.py demo        # Interactive voice agent demo"
echo "  python lead_generator.py <industry> <location>  # Generate leads via Google Maps"
echo "  python local_seo_gainesville.py <industry> [area]  # Local SEO lead generation"
echo "  python vapi_demo_generator.py list      # List Vapi.ai demo templates"
echo ""
echo "Example usage:"
echo "  python lead_generator.py dentist \"Gainesville, FL\" 5"
echo "  python local_seo_gainesville.py hvac gainesville"
echo "  python code_intelligence_engine.py      # Analyze code intelligence"
echo ""
echo "Type 'mamba deactivate' to exit the environment"
echo ""

# Start bash in the activated environment
exec bash
