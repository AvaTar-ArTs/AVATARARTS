"""
Prompt templates
"""


class ChatPrompts:
    """Chat prompts."""

    SYSTEM = """You are the NoteBookLLM assistant. Answer questions using only the provided sources.

## Answering rules

1. **Source-based**: Only answer from the provided sources. Do not invent information.
2. **Be explicit**: If the sources do not contain relevant info, clearly state: "Based on the provided sources, no relevant information was found."
3. **Cite sources**: Cite sources in the format "According to [Source Name]..."
4. **Use English**: All responses must be in English.
5. **Clear structure**: Use headings and lists to organize the response.
6. **Accurate and concise**: Provide accurate, useful answers without unnecessary length.

## Answer format

- Use Markdown
- Use headings (##, ###) when helpful
- Use lists for multiple points
- Cite sources with "According to [Source Name]"
"""

    RAG_TEMPLATE = """Please answer the question using the sources below.

## Sources

{context}

---

## User question

{question}

---

Provide a detailed, accurate answer based on the sources above. If the sources do not contain relevant information, say so clearly."""

    SUGGESTED_QUESTIONS = """Based on the sources below, generate 3-5 questions a user might ask.

## Sources

{context}

---

Generate specific, meaningful questions that:
1. Are directly related to the source content
2. Help deepen understanding of the material
3. Cover different aspects of the topic

Return a JSON array, for example:
["Question 1?", "Question 2?", "Question 3?"]"""


class StudioPrompts:
    """Studio output prompts."""

    SUMMARY = """Create a clear, well-structured summary of the content below.

## Source content

{content}

---

## Summary requirements

1. Cover all key points
2. Keep a logical structure
3. Use English
4. Moderate length (300-500 words)
5. Suitable for spoken narration (for voice summaries)

Provide only the summary in Markdown format."""

    MINDMAP = """Generate a professional mind map structure based on the content below.

## Source content

{content}

---

Return the mind map as JSON in the following format:

```json
{{
    "central": {{
        "text": "Central Topic",
        "description": "Short topic description",
        "icon": "lightbulb"
    }},
    "branches": [
        {{
            "text": "Main Branch 1",
            "description": "Branch description (optional)",
            "color": "#4CAF50",
            "icon": "folder",
            "children": [
                {{
                    "text": "Subnode 1-1",
                    "description": "Node description (optional)",
                    "children": []
                }},
                {{
                    "text": "Subnode 1-2",
                    "children": [
                        {{"text": "Third-level node", "children": []}}
                    ]
                }}
            ]
        }},
        {{
            "text": "Main Branch 2",
            "color": "#2196F3",
            "icon": "star",
            "children": []
        }}
    ],
    "metadata": {{
        "title": "Mind Map Title",
        "totalNodes": 10,
        "maxDepth": 3
    }}
}}
```

## Color suggestions (use different colors for each main branch)
- Greens: #4CAF50, #8BC34A, #CDDC39
- Blues: #2196F3, #03A9F4, #00BCD4
- Purples: #9C27B0, #673AB7, #3F51B5
- Oranges: #FF9800, #FF5722, #F44336
- Teals: #009688, #00BCD4, #4DD0E1

## Icon suggestions (choose icons based on content)
- Concepts: lightbulb, idea, brain, puzzle
- Data: folder, file, database, chart
- Action: rocket, flag, target, check
- People: user, users, team, person
- Objects: star, heart, bookmark, tag

## Notes
1. **All text must be in English**
2. The central topic should be concise (5-15 words)
3. 3-6 main branches
4. 2-5 children per branch
5. Max depth 4 (center -> branch -> child -> third level)
6. Use different colors for main branches
7. Use description sparingly (10-30 words)
8. Keep hierarchy logical and coherent"""

    FLASHCARDS = """Generate {count} flashcards based on the content below. Difficulty: {difficulty}.

## Source content

{content}

---

## Bloom's taxonomy guidance

Design questions based on difficulty:

**Easy** - Remember/Understand:
- What is the definition of ...?
- List/describe ...
- Explain the meaning of ...

**Medium** - Apply/Analyze:
- How would you apply ...?
- Compare ... and ...
- Analyze the causes of ...

**Hard** - Evaluate/Create:
- Evaluate the pros and cons of ...
- What would happen if ...?
- Design a plan for ...

---

Return flashcards in this JSON format:

```json
{{
    "cards": [
        {{
            "front": "Question or concept",
            "back": "Answer or explanation",
            "difficulty": "easy/medium/hard",
            "category": "Category label",
            "cognitive_level": "remember/understand/apply/analyze/evaluate/create",
            "hint": "Hint (optional)"
        }}
    ],
    "metadata": {{
        "total_cards": 10,
        "difficulty_distribution": {{
            "easy": 3,
            "medium": 4,
            "hard": 3
        }},
        "categories": ["Category 1", "Category 2"],
        "recommended_study_order": [0, 1, 2, 3]
    }}
}}
```

## Flashcard design requirements

1. **All content must be in English**
2. **Question design**:
   - One concept per card
   - Clear, specific questions
   - Use question or fill-in-the-blank formats
3. **Answer design**:
   - Concise but complete
   - Include keywords and key points
   - Use bullets for complex answers
4. **Difficulty distribution**:
   - Easy: core definitions and facts
   - Medium: application and comparison
   - Hard: synthesis, analysis, evaluation
5. **Categories**: group by topic
6. **Hints**: provide for hard questions (optional)"""

    QUIZ = """Generate {count} quiz questions from the content below. Difficulty: {difficulty}.

## Source content

{content}

---

## Question types

Use a mix of these types:

### 1. Multiple choice (multiple_choice)
- Single answer, 4 options
- Good for concept understanding and facts

### 2. True/false (true_false)
- Evaluate statement accuracy
- Good for detail comprehension

### 3. Fill in the blank (fill_blank)
- Fill in the correct term or concept
- Good for key terms

### 4. Matching (matching)
- Match items on the left with items on the right
- Good for relationships between concepts

### 5. Short answer (short_answer)
- Brief response (self-practice only)
- Good for synthesized understanding

---

## Bloom's taxonomy and difficulty

**Easy** - Remember/Understand:
- Question types: definitions, listing, basic concepts
- Cognitive levels: remember, understand

**Medium** - Apply/Analyze:
- Question types: scenarios, comparisons, cause/effect
- Cognitive levels: apply, analyze

**Hard** - Evaluate/Create:
- Question types: judgments, synthesis, problem solving
- Cognitive levels: evaluate, create

---

Return the quiz in this JSON format:

```json
{{
    "quiz_title": "Quiz Title",
    "description": "Quiz description",
    "questions": [
        {{
            "id": 1,
            "type": "multiple_choice",
            "difficulty": "easy/medium/hard",
            "cognitive_level": "remember/understand/apply/analyze/evaluate/create",
            "category": "Category label",
            "question": "Question text?",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correct": "A",
            "explanation": "Explain why the answer is correct",
            "hint": "Hint (optional)",
            "points": 10
        }},
        {{
            "id": 2,
            "type": "true_false",
            "difficulty": "easy",
            "cognitive_level": "understand",
            "category": "Category label",
            "question": "This is a true/false statement.",
            "correct": true,
            "explanation": "Explanation",
            "points": 5
        }},
        {{
            "id": 3,
            "type": "fill_blank",
            "difficulty": "medium",
            "cognitive_level": "apply",
            "category": "Category label",
            "question": "______ refers to a system used for version control in software development.",
            "correct": "Git",
            "alternatives": ["git", "GIT"],
            "explanation": "Git is the most popular distributed version control system.",
            "points": 10
        }},
        {{
            "id": 4,
            "type": "matching",
            "difficulty": "medium",
            "cognitive_level": "analyze",
            "category": "Category label",
            "question": "Match the following concepts with their definitions",
            "left_items": ["Item 1", "Item 2", "Item 3"],
            "right_items": ["Definition A", "Definition B", "Definition C"],
            "correct_pairs": {{"Item 1": "Definition A", "Item 2": "Definition B", "Item 3": "Definition C"}},
            "explanation": "Matching explanation",
            "points": 15
        }},
        {{
            "id": 5,
            "type": "short_answer",
            "difficulty": "hard",
            "cognitive_level": "evaluate",
            "category": "Category label",
            "question": "Briefly describe the pros and cons of ...",
            "sample_answer": "Reference answer points: 1. ... 2. ... 3. ...",
            "key_points": ["Point 1", "Point 2", "Point 3"],
            "explanation": "Scoring guidance",
            "points": 20
        }}
    ],
    "metadata": {{
        "total_questions": 10,
        "total_points": 100,
        "time_limit_minutes": 15,
        "passing_score": 60,
        "difficulty_distribution": {{
            "easy": 3,
            "medium": 4,
            "hard": 3
        }},
        "type_distribution": {{
            "multiple_choice": 4,
            "true_false": 2,
            "fill_blank": 2,
            "matching": 1,
            "short_answer": 1
        }},
        "categories": ["Category 1", "Category 2"]
    }}
}}
```

## Quiz design requirements

1. **All content must be in English**
2. **Question design**:
   - Based on sources, no invented facts
   - Clear, unambiguous wording
   - Options should be similar length, avoid giveaways
   - Wrong options should be plausible
3. **Difficulty distribution**:
   - Easy: 30% (basic concepts)
   - Medium: 50% (apply and analyze)
   - Hard: 20% (evaluate and synthesize)
4. **Type distribution**:
   - Multiple choice dominant (40-50%)
   - Mix in other types for variety
5. **Explanations**:
   - Every question must include an explanation
   - Explain why the answer is correct
   - Mention common traps when relevant"""

    REPORT = """Generate a detailed research report based on the content below.

## Source content

{content}

---

## Report format

Use the following structure (Markdown format):

# Report Title

## Summary
(Brief overview of the main points and conclusions)

## Background and Purpose
(Introduce context and the report purpose)

## Key Findings
(Detailed analysis of important findings)

### Finding 1
...

### Finding 2
...

## Detailed Analysis
(Deep dive into each major topic)

## Conclusions and Recommendations
(Summarize and propose recommendations)

## Sources
(List the sources used)

---

Report requirements:
1. Accurate, based on sources
2. Clear structure and logical flow
3. Professional tone in English
4. Moderate length (1,000-2,000 words)"""

    DATATABLE = """Extract structured data from the content below and generate a data table.

## Source content

{content}

---

Analyze the content and return structured data in this JSON format:

```json
{{
    "title": "Table Title",
    "description": "Table description",
    "columns": [
        {{"key": "column1", "label": "Column 1"}},
        {{"key": "column2", "label": "Column 2"}},
        {{"key": "column3", "label": "Column 3"}}
    ],
    "rows": [
        {{"column1": "Value 1", "column2": "Value 2", "column3": "Value 3"}},
        {{"column1": "Value 4", "column2": "Value 5", "column3": "Value 6"}}
    ]
}}
```

Requirements:
1. **All content must be in English**
2. Identify data that can be structured
3. Use clear column names
4. Keep data accurate and complete"""

    INFOGRAPHIC = """Analyze the content below and generate an infographic configuration suitable for visualization.

## Source content

{content}

---

## Task

Extract data suitable for visualization and choose the most appropriate chart types.

## Chart type selection guide

Choose the best chart based on data characteristics:

| Data characteristic | Recommended chart | Use case |
|--------------------|------------------|---------|
| Category comparison | bar | Compare values across categories |
| Time series | line | Trends over time |
| Proportion | pie/doughnut | Parts of a whole |
| Multi-dimensional | radar | Compare multiple dimensions |
| Distribution | scatter | Relationship between two variables |
| Process/Hierarchy | stacked bar | Composition structure |

## Output format

Return JSON compatible with Chart.js:

```json
{{
    "title": "Infographic Title",
    "description": "Chart description (2-3 sentences of insights)",
    "data_source": "Data source description",
    "charts": [
        {{
            "id": "chart1",
            "title": "Chart 1 Title",
            "type": "bar",
            "description": "This chart shows ...",
            "insights": ["Insight 1", "Insight 2"],
            "config": {{
                "type": "bar",
                "data": {{
                    "labels": ["Category 1", "Category 2", "Category 3", "Category 4"],
                    "datasets": [
                        {{
                            "label": "Dataset 1",
                            "data": [12, 19, 3, 5],
                            "backgroundColor": [
                                "rgba(54, 162, 235, 0.8)",
                                "rgba(255, 99, 132, 0.8)",
                                "rgba(255, 206, 86, 0.8)",
                                "rgba(75, 192, 192, 0.8)"
                            ],
                            "borderColor": [
                                "rgba(54, 162, 235, 1)",
                                "rgba(255, 99, 132, 1)",
                                "rgba(255, 206, 86, 1)",
                                "rgba(75, 192, 192, 1)"
                            ],
                            "borderWidth": 1
                        }}
                    ]
                }},
                "options": {{
                    "responsive": true,
                    "plugins": {{
                        "legend": {{
                            "position": "top"
                        }},
                        "title": {{
                            "display": true,
                            "text": "Chart 1 Title"
                        }}
                    }},
                    "scales": {{
                        "y": {{
                            "beginAtZero": true
                        }}
                    }}
                }}
            }}
        }},
        {{
            "id": "chart2",
            "title": "Chart 2 Title",
            "type": "pie",
            "description": "This chart shows proportions ...",
            "insights": ["Insight 1"],
            "config": {{
                "type": "pie",
                "data": {{
                    "labels": ["Item A", "Item B", "Item C"],
                    "datasets": [
                        {{
                            "data": [30, 50, 20],
                            "backgroundColor": [
                                "rgba(255, 99, 132, 0.8)",
                                "rgba(54, 162, 235, 0.8)",
                                "rgba(255, 206, 86, 0.8)"
                            ]
                        }}
                    ]
                }},
                "options": {{
                    "responsive": true,
                    "plugins": {{
                        "legend": {{
                            "position": "right"
                        }}
                    }}
                }}
            }}
        }}
    ],
    "summary": {{
        "key_findings": [
            "Key finding 1",
            "Key finding 2",
            "Key finding 3"
        ],
        "recommendations": [
            "Recommendation 1",
            "Recommendation 2"
        ]
    }},
    "metadata": {{
        "total_charts": 2,
        "chart_types": ["bar", "pie"],
        "data_points": 10
    }}
}}
```

## Design requirements

1. **All text must be in English**
2. **Data accuracy**:
   - Use only data explicitly mentioned in sources
   - If no exact numbers, infer relative proportions
   - Cite data sources
3. **Chart selection**:
   - Choose the most informative chart type
   - Prefer clarity over novelty
   - Generate 1-3 charts if needed
4. **Color palette**:
   - Professional, coordinated colors
   - High contrast for readability
   - Preferred palettes: blues, greens, oranges
5. **Insights**:
   - Provide 1-3 key insights per chart
   - Summarize overall findings and recommendations

## Common color palette

```
Blue: rgba(54, 162, 235, 0.8)
Red: rgba(255, 99, 132, 0.8)
Yellow: rgba(255, 206, 86, 0.8)
Green: rgba(75, 192, 192, 0.8)
Purple: rgba(153, 102, 255, 0.8)
Orange: rgba(255, 159, 64, 0.8)
Gray: rgba(201, 203, 207, 0.8)
```"""

    PRESENTATION = """Generate a professional presentation outline based on the content below.

## Source content

{content}

---

Generate a {slide_count}-slide presentation and return it in this JSON format:

```json
{{
    "title": "Presentation Title",
    "subtitle": "Subtitle (optional)",
    "slides": [
        {{
            "slide_number": 1,
            "title": "Title Slide",
            "type": "title",
            "content": "Presentation topic introduction",
            "image_prompt": "A professional title slide background with abstract business elements, modern and clean design"
        }},
        {{
            "slide_number": 2,
            "title": "Agenda",
            "type": "toc",
            "content": "1. Chapter One\\n2. Chapter Two\\n3. Chapter Three",
            "image_prompt": ""
        }},
        {{
            "slide_number": 3,
            "title": "Section Title",
            "type": "content",
            "content": "• Point one\\n• Point two\\n• Point three",
            "speaker_notes": "Speaker notes",
            "image_prompt": "Illustration representing [topic keywords], professional business style, clean background"
        }},
        {{
            "slide_number": 4,
            "title": "Conclusion",
            "type": "conclusion",
            "content": "Summary points",
            "image_prompt": "Professional conclusion slide with success and achievement theme"
        }}
    ]
}}
```

Presentation requirements:
1. **All text content must be in English** (title, content, speaker_notes)
2. Content must be grounded in sources
3. Each slide focuses on one key point
4. Use bullets
5. Concise text, suitable for spoken delivery
6. image_prompt must be English (for AI image generation)
7. image_prompt should describe style and content clearly
8. Agenda slide (toc) needs no image, leave image_prompt empty"""

    IMAGE_PROMPT_ENHANCE = """Improve the presentation image description below into a more specific AI image prompt.

Original description: {original_prompt}
Presentation topic: {topic}
Slide content: {slide_content}

Generate a concrete, detailed English prompt that includes:
1. Specific visual elements
2. Style descriptors (e.g., modern, professional, minimalist)
3. Color suggestions
4. Composition guidance

Return only the improved English prompt, nothing else."""

    # ============ Professional presentation prompts ============

    PRESENTATION_OUTLINE = """Generate a professional PPT outline based on the content below.

## Source content

{content}

---

You can use two formats:

1. Simple format (short decks, no major sections):
[{{"title": "Title 1", "points": ["Point 1", "Point 2"]}}, {{"title": "Title 2", "points": ["Point 1", "Point 2"]}}]

2. Sectioned format (longer decks with sections):
[
    {{
    "part": "Part 1: Introduction",
    "pages": [
        {{"title": "Welcome", "points": ["Point 1", "Point 2"]}},
        {{"title": "Overview", "points": ["Point 1", "Point 2"]}}
    ]
    }},
    {{
    "part": "Part 2: Main Content",
    "pages": [
        {{"title": "Topic 1", "points": ["Point 1", "Point 2"]}},
        {{"title": "Topic 2", "points": ["Point 1", "Point 2"]}}
    ]
    }}
]

Choose the best format for the content. Use the sectioned format only when the deck has clear major sections.
Unless requested otherwise, the first slide should be minimal (title, subtitle, speaker).

Generate an outline of about {slide_count} slides. Output JSON only, no extra text.
**All content must be in English**"""

    PRESENTATION_PAGE_DESCRIPTION = """We are generating a page description for each PPT slide.

## Source content

{content}

---

## Full outline

{outline}

{part_info}

---

Now generate the description for slide {page_index}:
{page_outline}

{first_page_note}

[Important] The "page content" will be rendered directly on the slide. Please ensure:
1. Concise text, each bullet 15-25 words max
2. Clear structure using lists
3. Avoid long sentences and complex phrasing
4. Strong readability for presentation
5. Do not include extra commentary or annotations

Output example:
Page title: {example_title}
{subtitle_example}

Page content:
- Point one: concise, strong statement
- Point two: clear content description
- Point three: key information

**All content must be in English**"""

    PRESENTATION_IMAGE_GENERATION = """You are an expert UI/UX presentation designer focused on producing polished PPT slides.

Current slide description:
<page_description>
{page_desc}
</page_description>

<reference_information>
Full PPT outline:
{outline_text}

Current section: {current_section}
</reference_information>

<design_guidelines>
- Text must be crisp; output is 4K resolution, 16:9 ratio
- Professional business style for color and design language
- Automatically design the best layout and render all text from the page description
- Avoid markdown symbols (#, *, etc.) unless necessary
- Use decorative shapes or illustrations to fill whitespace
- Keep background clean and professional
</design_guidelines>

{first_page_design_note}

All on-slide text must be in English."""

    PRESENTATION_TITLE_PAGE_DESIGN = """**Note: This slide is the cover page. Use professional cover design principles. Emphasize the title clearly, establish hierarchy, and grab attention immediately.**"""

    # ============ Draw.io flowchart/diagram prompts ============

    FLOWCHART = """Generate a flowchart from the content below using draw.io mxGraph XML format.

## Source content

{content}

---

## Task

Analyze the content, identify steps or decision logic, and create a flowchart.

## draw.io XML format

### Basic structure
The XML must be a complete mxGraphModel:

```xml
<mxGraphModel>
  <root>
    <mxCell id="0"/>
    <mxCell id="1" parent="0"/>
    <!-- Shapes start from id="2" -->
  </root>
</mxGraphModel>
```

### Shape types

1. **Rectangle (step/process)**
```xml
<mxCell id="2" value="Step name" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#dae8fc;strokeColor=#6c8ebf;" vertex="1" parent="1">
  <mxGeometry x="100" y="100" width="120" height="60" as="geometry"/>
</mxCell>
```

2. **Diamond (decision)**
```xml
<mxCell id="3" value="Condition?" style="rhombus;whiteSpace=wrap;html=1;fillColor=#fff2cc;strokeColor=#d6b656;" vertex="1" parent="1">
  <mxGeometry x="100" y="200" width="80" height="80" as="geometry"/>
</mxCell>
```

3. **Ellipse (start/end)**
```xml
<mxCell id="4" value="Start" style="ellipse;whiteSpace=wrap;html=1;fillColor=#d5e8d4;strokeColor=#82b366;" vertex="1" parent="1">
  <mxGeometry x="100" y="50" width="80" height="40" as="geometry"/>
</mxCell>
```

4. **Parallelogram (input/output)**
```xml
<mxCell id="5" value="Data input" style="shape=parallelogram;perimeter=parallelogramPerimeter;whiteSpace=wrap;html=1;fillColor=#e1d5e7;strokeColor=#9673a6;" vertex="1" parent="1">
  <mxGeometry x="100" y="300" width="120" height="50" as="geometry"/>
</mxCell>
```

### Connectors

```xml
<mxCell id="10" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;" edge="1" parent="1" source="2" target="3">
  <mxGeometry relative="1" as="geometry"/>
</mxCell>
```

Labeled connector:
```xml
<mxCell id="11" value="Yes" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;" edge="1" parent="1" source="3" target="4">
  <mxGeometry relative="1" as="geometry"/>
</mxCell>
```

### Layout rules

1. **Coordinate range**: x 50-750, y 50-550
2. **Spacing**: vertical 80-100px, horizontal 150-200px
3. **Alignment**: keep peers aligned
4. **Flow**: top-to-bottom; decisions branch left/right

### Color palette

| Type | fillColor | strokeColor |
|------|-----------|-------------|
| Start/End | #d5e8d4 | #82b366 |
| Step/Process | #dae8fc | #6c8ebf |
| Decision | #fff2cc | #d6b656 |
| Input/Output | #e1d5e7 | #9673a6 |
| Document | #f8cecc | #b85450 |

---

## Output format

Return JSON:

```json
{{
    "title": "Flowchart Title",
    "description": "Flow description",
    "xml": "<mxGraphModel>...</mxGraphModel>",
    "elements": {{
        "nodes": 8,
        "edges": 7,
        "decisions": 2
    }},
    "legend": [
        {{"shape": "ellipse", "meaning": "Start/End"}},
        {{"shape": "rectangle", "meaning": "Process step"}},
        {{"shape": "diamond", "meaning": "Decision"}}
    ]
}}
```

## Design requirements

1. **All node text must be in English**
2. **Correct logic**: valid flow order and branches
3. **Readable**: avoid line crossings
4. **Complete**: include clear start and end nodes
5. **Appropriate complexity**: 5-15 nodes based on content"""

    DIAGRAM = """Generate an architecture/system diagram from the content below using draw.io mxGraph XML.

## Source content

{content}

---

## Task

Identify system architecture, component relationships, or hierarchy, then create a diagram.

## draw.io XML format

### Basic structure
```xml
<mxGraphModel>
  <root>
    <mxCell id="0"/>
    <mxCell id="1" parent="0"/>
    <!-- Shapes start from id="2" -->
  </root>
</mxGraphModel>
```

### Common shapes

1. **Rectangle container (system/module)**
```xml
<mxCell id="2" value="System Name" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#dae8fc;strokeColor=#6c8ebf;fontSize=14;fontStyle=1;" vertex="1" parent="1">
  <mxGeometry x="100" y="100" width="160" height="80" as="geometry"/>
</mxCell>
```

2. **Swimlane container (group)**
```xml
<mxCell id="3" value="Group Name" style="swimlane;fontStyle=1;childLayout=stackLayout;horizontal=1;startSize=30;horizontalStack=0;resizeParent=1;resizeParentMax=0;resizeLast=0;collapsible=1;marginBottom=0;fillColor=#f5f5f5;strokeColor=#666666;" vertex="1" parent="1">
  <mxGeometry x="50" y="50" width="200" height="150" as="geometry"/>
</mxCell>
```

3. **Cylinder (database)**
```xml
<mxCell id="4" value="Database" style="shape=cylinder3;whiteSpace=wrap;html=1;boundedLbl=1;backgroundOutline=1;size=15;fillColor=#f8cecc;strokeColor=#b85450;" vertex="1" parent="1">
  <mxGeometry x="100" y="200" width="80" height="100" as="geometry"/>
</mxCell>
```

4. **Cloud (external service)**
```xml
<mxCell id="5" value="Cloud Service" style="ellipse;shape=cloud;whiteSpace=wrap;html=1;fillColor=#fff2cc;strokeColor=#d6b656;" vertex="1" parent="1">
  <mxGeometry x="300" y="100" width="120" height="80" as="geometry"/>
</mxCell>
```

5. **Hexagon (microservice/API)**
```xml
<mxCell id="6" value="API" style="shape=hexagon;perimeter=hexagonPerimeter2;whiteSpace=wrap;html=1;fixedSize=1;fillColor=#d5e8d4;strokeColor=#82b366;" vertex="1" parent="1">
  <mxGeometry x="200" y="150" width="100" height="60" as="geometry"/>
</mxCell>
```

6. **Document shape**
```xml
<mxCell id="7" value="Document" style="shape=document;whiteSpace=wrap;html=1;boundedLbl=1;fillColor=#e1d5e7;strokeColor=#9673a6;" vertex="1" parent="1">
  <mxGeometry x="100" y="300" width="80" height="60" as="geometry"/>
</mxCell>
```

### Connector types

1. **Solid arrow (data flow)**
```xml
<mxCell id="20" value="" style="endArrow=classic;html=1;rounded=0;" edge="1" parent="1" source="2" target="4">
  <mxGeometry relative="1" as="geometry"/>
</mxCell>
```

2. **Dashed arrow (dependency)**
```xml
<mxCell id="21" value="" style="endArrow=classic;html=1;dashed=1;rounded=0;" edge="1" parent="1" source="2" target="3">
  <mxGeometry relative="1" as="geometry"/>
</mxCell>
```

3. **Bidirectional arrow (two-way communication)**
```xml
<mxCell id="22" value="" style="endArrow=classic;startArrow=classic;html=1;rounded=0;" edge="1" parent="1" source="2" target="5">
  <mxGeometry relative="1" as="geometry"/>
</mxCell>
```

### Layout modes

1. **Layered architecture** (top to bottom)
   - UI layer (top)
   - Business logic layer (middle)
   - Data access layer (bottom)

2. **Microservices architecture** (left to right)
   - Gateway on the left
   - Services aligned horizontally
   - Database on the right or bottom

3. **Client-server architecture**
   - Client on the left
   - Server on the right
   - Protocols shown in the middle

### Color palette

| Type | fillColor | strokeColor | Use |
|------|-----------|-------------|-----|
| Frontend/UI | #dae8fc | #6c8ebf | User interface |
| Backend/API | #d5e8d4 | #82b366 | Server logic |
| Database | #f8cecc | #b85450 | Data storage |
| External services | #fff2cc | #d6b656 | Third-party services |
| Middleware | #e1d5e7 | #9673a6 | Queues, brokers |
| Security/Auth | #f5f5f5 | #666666 | Security components |

---

## Output format

Return JSON:

```json
{{
    "title": "Architecture Diagram Title",
    "description": "Architecture description (2-3 sentences)",
    "diagram_type": "layered/microservices/client-server/network",
    "xml": "<mxGraphModel>...</mxGraphModel>",
    "components": [
        {{"name": "Component Name", "type": "frontend/backend/database/service", "description": "Component description"}}
    ],
    "connections": [
        {{"from": "Component A", "to": "Component B", "type": "data/request/event", "description": "Connection description"}}
    ]
}}
```

## Design requirements

1. **All text must be in English**
2. **Clear architecture**: obvious layers and relationships
3. **Appropriate grouping**: related components together
4. **Connection rules**:
   - Solid line for data flow or direct calls
   - Dashed line for dependency or optional connections
   - Arrow direction indicates flow
5. **Legend**: include necessary component/connection meanings
6. **Coordinate range**: keep within x 50-750, y 50-550"""


class PodcastPrompts:
    """Podcast script prompts."""

    SCRIPT_GENERATION = """You are a professional podcast script writer skilled at engaging, natural dialogue.

## Source content
<source_content>
{content}
</source_content>

## Speaker settings
{speakers_desc}

## Show settings
- Style: {style_guide}
- Target duration: about {duration_minutes} minutes (about {target_words} words)
- Language: English

## Script structure

### Opening (about 10%)
- Host intro and topic overview
- Create a relaxed, engaging tone
- Briefly preview key discussion points

### Main section (about 80%)
- Deeply discuss the core points from sources
- Natural dialogue with:
  - Questions and answers
  - Examples
  - Personal insights
  - Occasional light humor
- Ensure each speaker has sufficient airtime
- Use transitions between topics

### Closing (about 10%)
- Summarize key takeaways
- Provide listener action items or reflection prompts
- Teaser or sign-off

## Dialogue guidelines
1. **Natural flow**: include fillers like "well", "right", "wow" where appropriate
2. **Interactive**: speakers respond to each other realistically
3. **Balanced pacing**: avoid long monologues
4. **Emotional range**: match tone to content (curious, surprised, reflective)
5. **Accessible**: explain complex ideas simply with examples or analogies

## Output format
Return JSON only, all text in English:

```json
{{
    "title": "Podcast Title",
    "description": "Show description (2-3 sentences)",
    "segments": [
        {{
            "speaker": "Speaker name",
            "text": "What the speaker says (natural conversational tone)",
            "emotion": "emotion label"
        }}
    ],
    "keywords": ["keyword1", "keyword2"],
    "summary": "Show summary"
}}
```

Emotion labels: neutral, excited, curious, thoughtful, surprised, amused, serious, warm

Output JSON only, no extra text."""

    SCRIPT_CONTINUATION = """You are continuing a podcast dialogue script.

## Original source content
<source_content>
{content}
</source_content>

## Speaker settings
{speakers_desc}

## Previous dialogue (maintain continuity)
<previous_dialogue>
{previous_dialogue}
</previous_dialogue>

## Topic for this segment
<current_section>
{current_section}
</current_section>

## Requirements
1. Continue the style and tone from previous dialogue
2. Transition naturally to the new topic
3. Maintain speaker personality consistency
4. Target length: about {target_words} words

Return the dialogue for this segment using the same JSON segments format, output only the segments array:

```json
[
    {{
        "speaker": "Speaker name",
        "text": "What the speaker says",
        "emotion": "emotion label"
    }}
]
```"""

    STYLE_GUIDES = {
        "conversational": """[Conversational]
- Casual chat between friends
- Light jokes and playful teasing
- Share personal experiences and feelings
- Build on each other's ideas""",

        "educational": """[Educational]
- One explains, one learns
- The learner asks questions
- The explainer uses clear, simple language
- Include recap and review""",

        "debate": """[Debate]
- Present different viewpoints
- Argue with evidence
- Respectful but firm
- End with consensus or summary of differences""",

        "interview": """[Interview]
- Host guides the conversation
- Expert/guest shares deep insights
- Follow-up questions on details and stories
- Summarize key points for listeners""",

        "storytelling": """[Storytelling]
- Narrative structure
- Build scene and atmosphere
- Clear beginning, middle, end
- Create emotional resonance""",

        "panel": """[Panel]
- Multiple experts share perspectives
- Host moderates and summarizes
- Same topic from different angles
- Cross-pollination of ideas"""
    }

    SPEAKER_PERSONALITY_TEMPLATES = {
        "host": "Warm, upbeat, great at guiding the conversation and giving everyone airtime",
        "co-host": "Supportive, adds context, playful banter at times",
        "expert": "Professional and precise, explains clearly with examples",
        "guest": "Shares personal experiences and unique perspectives with sincerity",
        "curious": "Highly curious, asks questions on behalf of listeners",
        "skeptic": "Rational, questions assumptions, offers alternative viewpoints"
    }
