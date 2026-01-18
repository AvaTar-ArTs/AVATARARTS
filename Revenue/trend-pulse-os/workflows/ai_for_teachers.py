"""
AI for Teachers Workflow

Generates AEO-optimized, top 1-5% SEO educational content and lesson plans from trending topics.
Optimized for educational search, answer engines (ChatGPT, Perplexity, Google AI Overview),
and hot rising trends (300%+ YoY growth) in education.
"""

from datetime import datetime
from typing import Any, Dict, List


def generate_lesson_plan(
    trend: Dict[str, Any], grade_level: str = "middle", duration: str = "45min"
) -> Dict[str, Any]:
    """
    Generate a comprehensive lesson plan from a trend.

    Args:
        trend: Dictionary containing trend data
        grade_level: Target grade level ('elementary', 'middle', 'high', 'college')
        duration: Lesson duration ('30min', '45min', '60min', '90min')

    Returns:
        Dictionary with lesson plan details

    Example:
        >>> trend = {'keyword': 'AI in Education', 'score': 92, 'intent': 'education'}
        >>> plan = generate_lesson_plan(trend, grade_level='middle')
        >>> 'title' in plan
        True
    """
    keyword = trend.get("keyword", "Topic")
    score = trend.get("score", 0)
    intent = trend.get("intent", "general")

    # AEO-Optimized: Lesson plans answer "how to teach" questions
    # Top 1-5% SEO: Educational keywords, grade-level targeting
    title = f"Teaching {keyword}: Complete {grade_level.title()} Lesson Plan"  # AEO: Direct answer format

    description = f"Complete lesson plan for teaching {keyword} to {grade_level} students. This comprehensive guide includes learning objectives, activities, assessments, and resources. Learn how to effectively teach {keyword} with engaging, standards-aligned content."  # AEO: Answers what/how

    objectives = [
        f"Students will understand what {keyword} is",
        f"Students will explain how {keyword} works",
        f"Students will analyze the importance of {keyword}",
        f"Students will apply {keyword} concepts in real-world scenarios",
    ]

    activities = [
        {
            "name": f"Introduction to {keyword}",
            "duration": "10min",
            "description": f"Engage students with an interactive introduction to {keyword}, using visual aids and real-world examples.",
        },
        {
            "name": f"{keyword} Exploration",
            "duration": "20min",
            "description": f"Hands-on activity where students explore {keyword} through guided discovery and collaborative learning.",
        },
        {
            "name": f"{keyword} Application",
            "duration": "10min",
            "description": f"Students apply their understanding of {keyword} to solve problems or complete tasks.",
        },
        {
            "name": "Assessment & Reflection",
            "duration": "5min",
            "description": f"Quick assessment to check understanding of {keyword} concepts, followed by reflection.",
        },
    ]

    tags = [
        keyword,
        "lesson plan",
        "education",
        grade_level,
        f"teaching {keyword}",
        f"{keyword} lesson",
        f"how to teach {keyword}",
        keyword.replace(" ", ""),
        "educational resources",
        "curriculum",
        "teacher resources",
        duration,
        "standards-aligned",
    ]

    return {
        "title": title,  # AEO: Keyword in first 30 chars
        "description": description,  # AEO: Direct answer format
        "grade_level": grade_level,
        "duration": duration,
        "learning_objectives": objectives,  # AEO: Structured information
        "activities": activities,
        "assessment": f"Formative and summative assessments for {keyword}",
        "resources": f"Additional resources for teaching {keyword}",
        "tags": tags,  # Top 1-5% SEO: 10-15 educational tags
        "trend_score": score,
        "intent": intent,
        "generated_at": datetime.now().isoformat(),
        "seo_optimized": True,
        "aeo_optimized": True,
        "keyword_in_title": keyword in title[:30],
    }


def generate_batch_lesson_plans(
    trends: List[Dict[str, Any]], grade_level: str = "middle"
) -> List[Dict[str, Any]]:
    """
    Generate lesson plans for multiple trends.

    Args:
        trends: List of trend dictionaries
        grade_level: Target grade level for all plans

    Returns:
        List of lesson plan dictionaries
    """
    return [generate_lesson_plan(trend, grade_level) for trend in trends]


def generate_educational_content(
    trend: Dict[str, Any], content_type: str = "worksheet"
) -> Dict[str, Any]:
    """
    Generate educational content from a trend.

    Args:
        trend: Dictionary containing trend data
        content_type: Type of content ('worksheet', 'quiz', 'activity', 'presentation')

    Returns:
        Dictionary with educational content details
    """
    keyword = trend.get("keyword", "Topic")
    score = trend.get("score", 0)

    content_templates = {
        "worksheet": {
            "title": f"{keyword} Worksheet: Practice Exercises",
            "description": f"Comprehensive worksheet on {keyword} with practice exercises, examples, and answer key.",
            "sections": [
                f"Introduction to {keyword}",
                f"{keyword} Examples",
                f"Practice Problems on {keyword}",
                f"{keyword} Application Exercises",
            ],
        },
        "quiz": {
            "title": f"{keyword} Quiz: Assessment",
            "description": f"Quiz on {keyword} to assess student understanding with multiple-choice, short-answer, and application questions.",
            "sections": [
                f"{keyword} Definition Questions",
                f"{keyword} Concept Questions",
                f"{keyword} Application Questions",
            ],
        },
        "activity": {
            "title": f"{keyword} Activity: Hands-On Learning",
            "description": f"Interactive activity on {keyword} designed for hands-on learning and student engagement.",
            "sections": [
                f"{keyword} Introduction",
                f"{keyword} Exploration",
                f"{keyword} Application",
            ],
        },
        "presentation": {
            "title": f"{keyword} Presentation: Teaching Slides",
            "description": f"Presentation slides on {keyword} for classroom instruction with visual aids and key concepts.",
            "sections": [
                f"What is {keyword}?",
                f"How does {keyword} work?",
                f"Why is {keyword} important?",
                f"{keyword} Examples",
            ],
        },
    }

    template = content_templates.get(content_type, content_templates["worksheet"])

    tags = [
        keyword,
        content_type,
        "education",
        "teacher resources",
        f"{keyword} {content_type}",
        f"teaching {keyword}",
        keyword.replace(" ", ""),
        "educational content",
        "classroom resources",
    ]

    return {
        "title": template["title"],
        "description": template["description"],
        "content_type": content_type,
        "sections": template["sections"],
        "tags": tags,
        "trend_score": score,
        "generated_at": datetime.now().isoformat(),
        "seo_optimized": True,
        "aeo_optimized": True,
    }
