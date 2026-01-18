#!/usr/bin/env python3
"""
Trend Pulse OS - Streamlit Web Application Example

This is an example of how Trend Pulse OS could be packaged as a user-friendly
web application using Streamlit. Users would just open a browser, no command line needed!

To run this:
1. Install Streamlit: pip install streamlit
2. Run: streamlit run streamlit_app_example.py
3. Opens automatically in browser at http://localhost:8501

Or host online for users to access via URL (no installation needed).
"""

import streamlit as st
import pandas as pd
import sys
import os
from io import StringIO

# Add parent directory to path to import modules
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from core.trend_parser import load_trends, filter_trends
from core.trend_score import score_batch, score_trend
from core.keyword_cluster import cluster_keywords, get_top_clusters
from core.export_engine import export_csv, export_json
from workflows.ai_video_generator import generate_batch_ideas
from workflows.ai_for_teachers import generate_lesson_plan
from workflows.ai_image_enhancer import generate_enhancement_strategy
from workflows.ai_personal_assistant import generate_assistant_workflow

# Page configuration
st.set_page_config(
    page_title="Trend Pulse OS",
    page_icon="📊",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for better styling
st.markdown("""
<style>
    .main-header {
        font-size: 3rem;
        font-weight: bold;
        background: linear-gradient(90deg, #10b981, #14b8a6);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin-bottom: 0.5rem;
    }
    .stButton>button {
        background-color: #10b981;
        color: white;
        font-weight: bold;
        border-radius: 0.5rem;
        padding: 0.5rem 1.5rem;
    }
    .stButton>button:hover {
        background-color: #059669;
    }
    .success-box {
        padding: 1rem;
        border-radius: 0.5rem;
        background-color: #d1fae5;
        border-left: 4px solid #10b981;
        margin: 1rem 0;
    }
</style>
""", unsafe_allow_html=True)

# Header
st.markdown('<h1 class="main-header">📊 Trend Pulse OS</h1>', unsafe_allow_html=True)
st.markdown("**Analyze trends, score opportunities, and generate content ideas - All in your browser!**")

# Sidebar navigation
st.sidebar.title("📚 Navigation")
page = st.sidebar.radio(
    "Choose a section",
    [
        "🏠 Home",
        "📈 Trend Analysis",
        "🎬 Content Generation",
        "📚 Workflows",
        "📖 About"
    ]
)

# Home Page
if page == "🏠 Home":
    st.header("Welcome to Trend Pulse OS!")
    st.markdown("""
    Trend Pulse OS helps you:
    - **Analyze trending topics** - Find out what's popular and why
    - **Score opportunities** - See which trends are worth pursuing
    - **Generate content ideas** - Create video ideas, blog posts, product ideas, and more
    - **Export results** - Save your analysis to files you can use elsewhere

    ### 🚀 Quick Start

    1. Go to **Trend Analysis** to analyze your trends
    2. Use **Content Generation** to create video ideas, lesson plans, and more
    3. Explore **Workflows** for automated content generation

    ### 📁 Sample Data

    We've included sample data to get you started. Just click "Use Sample Data" in the Trend Analysis section!
    """)

    col1, col2, col3 = st.columns(3)
    with col1:
        st.metric("Sample Trends", "5", "Ready to use")
    with col2:
        st.metric("Workflows", "4", "Available")
    with col3:
        st.metric("Examples", "5", "Included")

# Trend Analysis Page
elif page == "📈 Trend Analysis":
    st.header("📈 Trend Analysis")
    st.markdown("Upload your trends CSV file or use the sample data to get started.")

    # File upload
    col1, col2 = st.columns([2, 1])
    with col1:
        uploaded_file = st.file_uploader("Upload your trends CSV file", type=['csv'])
    with col2:
        use_sample = st.button("📁 Use Sample Data", type="primary")

    # Load data
    trends = None
    if use_sample or uploaded_file:
        try:
            if use_sample:
                # Use sample data
                data_path = os.path.join(os.path.dirname(__file__), 'data', 'trends_sample.csv')
                trends = load_trends(data_path)
                st.success(f"✅ Loaded {len(trends)} trends from sample data")
            elif uploaded_file:
                # Save uploaded file temporarily
                with open("temp_trends.csv", "wb") as f:
                    f.write(uploaded_file.getbuffer())
                trends = load_trends("temp_trends.csv")
                st.success(f"✅ Loaded {len(trends)} trends from uploaded file")
        except Exception as e:
            st.error(f"❌ Error loading trends: {str(e)}")
            trends = None

    if trends:
        # Settings
        st.subheader("⚙️ Analysis Settings")
        col1, col2, col3 = st.columns(3)
        with col1:
            include_aeo = st.checkbox("Include AEO Scoring", value=True)
        with col2:
            min_score = st.slider("Minimum Score Filter", 0, 100, 70)
        with col3:
            filter_intent = st.selectbox(
                "Filter by Intent",
                ["All", "creator", "education", "productivity", "hardware"]
            )

        # Analyze button
        if st.button("🔍 Analyze Trends", type="primary", use_container_width=True):
            with st.spinner("Analyzing trends..."):
                # Score trends
                scored_trends = score_batch(trends, include_aeo=include_aeo)

                # Filter by score
                filtered = [t for t in scored_trends if t['score'] >= min_score]

                # Filter by intent if selected
                if filter_intent != "All":
                    filtered = [t for t in filtered if t.get('intent', '').lower() == filter_intent.lower()]

                # Display results
                st.subheader("📊 Results")
                col1, col2, col3, col4 = st.columns(4)
                with col1:
                    st.metric("Total Trends", len(trends))
                with col2:
                    st.metric("High-Scoring (≥70)", len([t for t in scored_trends if t['score'] >= 70]))
                with col3:
                    st.metric("Filtered Results", len(filtered))
                with col4:
                    avg_score = sum(t['score'] for t in filtered) / len(filtered) if filtered else 0
                    st.metric("Avg Score", f"{avg_score:.1f}")

                if filtered:
                    # Show results as table
                    df = pd.DataFrame(filtered)
                    st.dataframe(df, use_container_width=True, height=400)

                    # Download buttons
                    st.subheader("💾 Download Results")
                    col1, col2 = st.columns(2)
                    with col1:
                        csv = df.to_csv(index=False)
                        st.download_button(
                            "📥 Download CSV",
                            csv,
                            "trend_analysis_results.csv",
                            "text/csv",
                            use_container_width=True
                        )
                    with col2:
                        json_str = df.to_json(orient='records', indent=2)
                        st.download_button(
                            "📥 Download JSON",
                            json_str,
                            "trend_analysis_results.json",
                            "application/json",
                            use_container_width=True
                        )
                else:
                    st.warning("No trends match your filters. Try adjusting the settings.")

        # Preview data
        with st.expander("👁️ Preview Your Data"):
            preview_df = pd.DataFrame(trends[:10])
            st.dataframe(preview_df, use_container_width=True)

# Content Generation Page
elif page == "🎬 Content Generation":
    st.header("🎬 Content Generation")
    st.markdown("Generate video ideas, lesson plans, and more from trends.")

    # File upload or sample data
    col1, col2 = st.columns([2, 1])
    with col1:
        uploaded_file = st.file_uploader("Upload trends CSV", type=['csv'])
    with col2:
        use_sample = st.button("📁 Use Sample Data", type="primary")

    trends = None
    if use_sample or uploaded_file:
        try:
            if use_sample:
                data_path = os.path.join(os.path.dirname(__file__), 'data', 'trends_sample.csv')
                trends = load_trends(data_path)
            elif uploaded_file:
                with open("temp_trends.csv", "wb") as f:
                    f.write(uploaded_file.getbuffer())
                trends = load_trends("temp_trends.csv")
        except Exception as e:
            st.error(f"Error: {str(e)}")

    if trends:
        # Score trends
        scored_trends = score_batch(trends)
        top_trend = scored_trends[0] if scored_trends else None

        if top_trend:
            # Content type selection
            content_type = st.selectbox(
                "What would you like to generate?",
                [
                    "Video Ideas",
                    "Lesson Plans",
                    "Image Enhancement Strategies",
                    "Personal Assistant Workflows"
                ]
            )

            if st.button("✨ Generate Content", type="primary", use_container_width=True):
                with st.spinner("Generating content..."):
                    if content_type == "Video Ideas":
                        video_style = st.selectbox("Video Style", ["tutorial", "news", "review", "comparison"])
                        ideas = generate_batch_ideas([top_trend], style=video_style)

                        for idea in ideas:
                            st.subheader(idea['title'])
                            st.write(f"**Hook:** {idea['hook']}")
                            st.write(f"**Description:** {idea['description']}")
                            st.write(f"**Tags:** {', '.join(idea['tags'][:10])}")
                            st.write(f"**Estimated Views:** {idea['estimated_views']}")
                            st.write(f"**Target Audience:** {idea['target_audience']}")
                            st.divider()

                    elif content_type == "Lesson Plans":
                        grade_level = st.selectbox("Grade Level", ["elementary", "middle", "high", "college"])
                        plan = generate_lesson_plan(top_trend, grade_level=grade_level)

                        st.subheader(plan['title'])
                        st.write(f"**Description:** {plan['description']}")
                        st.write("**Learning Objectives:**")
                        for obj in plan['learning_objectives']:
                            st.write(f"- {obj}")
                        st.write("**Activities:**")
                        for activity in plan['activities']:
                            st.write(f"- **{activity['name']}** ({activity['duration']}): {activity['description']}")

                    elif content_type == "Image Enhancement Strategies":
                        image_type = st.selectbox("Image Type", ["photography", "artwork", "design", "product", "portrait"])
                        strategy = generate_enhancement_strategy(top_trend, image_type=image_type)

                        st.subheader(strategy['title'])
                        st.write(f"**Description:** {strategy['description']}")
                        st.write("**Enhancement Techniques:**")
                        for technique in strategy['enhancement_techniques']:
                            st.write(f"- **{technique['name']}**: {technique['description']}")

                    elif content_type == "Personal Assistant Workflows":
                        task_type = st.selectbox("Task Type", ["productivity", "communication", "scheduling", "research", "automation"])
                        workflow = generate_assistant_workflow(top_trend, task_type=task_type)

                        st.subheader(workflow['title'])
                        st.write(f"**Description:** {workflow['description']}")
                        st.write("**Workflow Steps:**")
                        for step in workflow['workflow_steps']:
                            st.write(f"**Step {step['step']}: {step['name']}**")
                            st.write(f"{step['description']}")

# Workflows Page
elif page == "📚 Workflows":
    st.header("📚 Available Workflows")
    st.markdown("Trend Pulse OS includes several pre-built workflows for different use cases.")

    workflow_tabs = st.tabs(["Video Generator", "For Teachers", "Image Enhancer", "Personal Assistant"])

    with workflow_tabs[0]:
        st.subheader("🎬 AI Video Generator")
        st.markdown("""
        Generate video ideas from trends with:
        - Video titles and hooks
        - Descriptions and tags
        - Estimated views
        - Target audience analysis
        """)
        st.code("""
        from workflows.ai_video_generator import generate_video_ideas

        trend = {'keyword': 'AI Video Generator', 'score': 89.5}
        idea = generate_video_ideas(trend, style='tutorial')
        print(idea['title'])
        """, language="python")

    with workflow_tabs[1]:
        st.subheader("👨‍🏫 AI for Teachers")
        st.markdown("""
        Create lesson plans with:
        - Learning objectives
        - Activities and assessments
        - Grade-level targeting
        - Educational content
        """)
        st.code("""
        from workflows.ai_for_teachers import generate_lesson_plan

        trend = {'keyword': 'AI in Education', 'score': 90}
        plan = generate_lesson_plan(trend, grade_level='middle')
        print(plan['title'])
        """, language="python")

    with workflow_tabs[2]:
        st.subheader("🎨 AI Image Enhancer")
        st.markdown("""
        Generate image enhancement strategies with:
        - Enhancement techniques
        - Tool recommendations
        - Presets and settings
        - Step-by-step guides
        """)

    with workflow_tabs[3]:
        st.subheader("🤖 AI Personal Assistant")
        st.markdown("""
        Create automation workflows with:
        - Workflow steps
        - Use cases
        - Best practices
        - Automation ideas
        """)

# About Page
elif page == "📖 About":
    st.header("📖 About Trend Pulse OS")
    st.markdown("""
    ### What is Trend Pulse OS?

    Trend Pulse OS is a trend analysis engine that helps you:
    - Identify trending topics
    - Score opportunities
    - Generate actionable workflows
    - Export results for further use

    ### Features

    - **Trend Parsing** - Load trends from CSV or JSON
    - **Smart Scoring** - Multi-factor scoring with AEO compatibility
    - **Keyword Clustering** - Group trends by intent, similarity, or score
    - **Export Engine** - Export to CSV, JSON, or custom formats
    - **Workflow Generation** - Create AI-powered workflows from trends

    ### Getting Started

    See the **COMPLETE_BEGINNER_GUIDE.md** for detailed instructions on how to get started.

    ### Documentation

    - **README.md** - Overview and API documentation
    - **USER_GUIDE.md** - Detailed user guide
    - **COMPLETE_BEGINNER_GUIDE.md** - Step-by-step guide for beginners
    - **DISTRIBUTION_OPTIONS.md** - Alternative distribution methods

    ### Examples

    Check the `examples/` directory for runnable examples demonstrating all features.

    ### License

    MIT License - see LICENSE file for details.
    """)

# Footer
st.divider()
st.markdown(
    """
    <div style='text-align: center; color: #64748b; padding: 2rem;'>
        <p>Trend Pulse OS - <strong>Trend → Action → Revenue</strong></p>
        <p>Built with ❤️ using Streamlit</p>
    </div>
    """,
    unsafe_allow_html=True
)
