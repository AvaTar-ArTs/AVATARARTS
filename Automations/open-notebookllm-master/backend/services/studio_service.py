"""
Studio output generation service.
"""
import json
import logging
from typing import Dict, Any, List, Optional

from .ai_service_manager import get_ai_service
from .prompts import StudioPrompts
from models import Source

logger = logging.getLogger(__name__)

# Attempt to import the PPTX builder.
try:
    from utils.pptx_builder import PPTXBuilder, is_pptx_available
    PPTX_EXPORT_AVAILABLE = is_pptx_available()
except ImportError:
    PPTX_EXPORT_AVAILABLE = False
    logger.warning("PPTX export is unavailable")


class StudioService:
    """Studio output generation service."""

    def get_sources_content(self, source_ids: Optional[List[str]] = None, notebook_id: Optional[str] = None) -> str:
        """
        Get source content.

        Args:
            source_ids: Selected source ID list.
            notebook_id: Notebook ID.

        Returns:
            Merged source content.
        """
        if source_ids:
            sources = Source.query.filter(Source.id.in_(source_ids)).all()
        elif notebook_id:
            sources = Source.query.filter_by(notebook_id=notebook_id).all()
        else:
            return ""

        content_parts = []
        for source in sources:
            content_parts.append(f"### Source: {source.name}\n\n{source.content}")

        return "\n\n---\n\n".join(content_parts)

    def generate_summary(self, source_ids: Optional[List[str]] = None, notebook_id: Optional[str] = None) -> Dict[str, Any]:
        """Generate a summary."""
        content = self.get_sources_content(source_ids, notebook_id)
        if not content:
            return {"error": "No source content available"}

        ai_service = get_ai_service()
        prompt = StudioPrompts.SUMMARY.format(content=content)

        try:
            summary = ai_service.generate(prompt)
            return {"summary": summary, "type": "summary"}
        except Exception as e:
            logger.error(f"Summary generation failed: {e}")
            return {"error": str(e)}

    def generate_mindmap(self, source_ids: Optional[List[str]] = None, notebook_id: Optional[str] = None) -> Dict[str, Any]:
        """Generate a mind map (JSON and Mermaid formats)."""
        content = self.get_sources_content(source_ids, notebook_id)
        if not content:
            return {"error": "No source content available"}

        ai_service = get_ai_service()
        prompt = StudioPrompts.MINDMAP.format(content=content)

        try:
            result = ai_service.generate_json(prompt)

            # Convert to Mermaid format.
            mermaid_code = self._convert_to_mermaid(result)
            result["mermaid"] = mermaid_code

            # Backward compatibility for legacy format.
            if "central" in result and isinstance(result["central"], dict):
                result["central_text"] = result["central"].get("text", "")
            elif "central" in result and isinstance(result["central"], str):
                result["central_text"] = result["central"]

            return {"data": result, "type": "mindmap"}
        except Exception as e:
            logger.error(f"Mind map generation failed: {e}")
            return {"error": str(e)}

    def _convert_to_mermaid(self, mindmap_data: Dict) -> str:
        """Convert mind map JSON to Mermaid format."""
        lines = ["mindmap"]

        # Handle the central node.
        central = mindmap_data.get("central", {})
        if isinstance(central, dict):
            central_text = central.get("text", "Central Topic")
        else:
            central_text = str(central)

        lines.append(f"  root(({central_text}))")

        # Handle branches.
        branches = mindmap_data.get("branches", [])
        for branch in branches:
            self._add_mermaid_node(lines, branch, indent=2)

        return "\n".join(lines)

    def _add_mermaid_node(self, lines: list, node: Dict, indent: int = 2):
        """Recursively add Mermaid nodes."""
        # Get node text (supports legacy formats).
        text = node.get("text") or node.get("name", "")
        if not text:
            return

        # Build indentation.
        prefix = "  " * indent

        # Add node (rounded rectangle).
        lines.append(f"{prefix}{text}")

        # Handle children.
        children = node.get("children", [])
        for child in children:
            self._add_mermaid_node(lines, child, indent + 1)

    def generate_flashcards(
        self,
        count: int = 10,
        source_ids: Optional[List[str]] = None,
        notebook_id: Optional[str] = None,
        difficulty: str = "mixed"
    ) -> Dict[str, Any]:
        """
        Generate flashcards.

        Args:
            count: Number of cards.
            source_ids: Source ID list.
            notebook_id: Notebook ID.
            difficulty: Difficulty ("easy", "medium", "hard", "mixed").

        Returns:
            Flashcard data.
        """
        content = self.get_sources_content(source_ids, notebook_id)
        if not content:
            return {"error": "No source content available"}

        # Difficulty description mapping.
        difficulty_desc = {
            "easy": "Easy - focus on basic definitions and factual recall",
            "medium": "Medium - include concept application and comparison",
            "hard": "Hard - emphasize synthesis, evaluation, and problem solving",
            "mixed": "Mixed - include all levels: easy 30%, medium 50%, hard 20%"
        }

        ai_service = get_ai_service()
        prompt = StudioPrompts.FLASHCARDS.format(
            content=content,
            count=count,
            difficulty=difficulty_desc.get(difficulty, difficulty_desc["mixed"])
        )

        try:
            result = ai_service.generate_json(prompt)

            # Ensure required fields are present (backward compatible).
            if "cards" in result:
                for card in result["cards"]:
                    if "difficulty" not in card:
                        card["difficulty"] = "medium"
                    if "category" not in card:
                        card["category"] = "General"
                    if "cognitive_level" not in card:
                        card["cognitive_level"] = "understand"

            return {"data": result, "type": "flashcards"}
        except Exception as e:
            logger.error(f"Flashcard generation failed: {e}")
            return {"error": str(e)}

    def generate_quiz(
        self,
        count: int = 10,
        source_ids: Optional[List[str]] = None,
        notebook_id: Optional[str] = None,
        difficulty: str = "mixed"
    ) -> Dict[str, Any]:
        """
        Generate a quiz.

        Args:
            count: Number of questions.
            source_ids: Source ID list.
            notebook_id: Notebook ID.
            difficulty: Difficulty ("easy", "medium", "hard", "mixed").

        Returns:
            Quiz data.
        """
        content = self.get_sources_content(source_ids, notebook_id)
        if not content:
            return {"error": "No source content available"}

        # Difficulty description mapping.
        difficulty_desc = {
            "easy": "Easy - focus on remember/understand questions",
            "medium": "Medium - include apply/analyze questions",
            "hard": "Hard - emphasize evaluate/create questions",
            "mixed": "Mixed - include all levels: easy 30%, medium 50%, hard 20%"
        }

        ai_service = get_ai_service()
        prompt = StudioPrompts.QUIZ.format(
            content=content,
            count=count,
            difficulty=difficulty_desc.get(difficulty, difficulty_desc["mixed"])
        )

        try:
            result = ai_service.generate_json(prompt)

            # Ensure required fields are present (backward compatible).
            if "questions" in result:
                for i, q in enumerate(result["questions"]):
                    if "id" not in q:
                        q["id"] = i + 1
                    if "difficulty" not in q:
                        q["difficulty"] = "medium"
                    if "cognitive_level" not in q:
                        q["cognitive_level"] = "understand"
                    if "points" not in q:
                        q["points"] = 10

            return {"data": result, "type": "quiz"}
        except Exception as e:
            logger.error(f"Quiz generation failed: {e}")
            return {"error": str(e)}

    def generate_report(self, source_ids: Optional[List[str]] = None, notebook_id: Optional[str] = None) -> Dict[str, Any]:
        """Generate a report."""
        content = self.get_sources_content(source_ids, notebook_id)
        if not content:
            return {"error": "No source content available"}

        ai_service = get_ai_service()
        prompt = StudioPrompts.REPORT.format(content=content)

        try:
            report = ai_service.generate(prompt)
            return {"content": report, "type": "report"}
        except Exception as e:
            logger.error(f"Report generation failed: {e}")
            return {"error": str(e)}

    def generate_datatable(self, source_ids: Optional[List[str]] = None, notebook_id: Optional[str] = None) -> Dict[str, Any]:
        """Generate a data table."""
        content = self.get_sources_content(source_ids, notebook_id)
        if not content:
            return {"error": "No source content available"}

        ai_service = get_ai_service()
        prompt = StudioPrompts.DATATABLE.format(content=content)

        try:
            result = ai_service.generate_json(prompt)
            return {"data": result, "type": "datatable"}
        except Exception as e:
            logger.error(f"Data table generation failed: {e}")
            return {"error": str(e)}

    def generate_presentation(
        self,
        source_ids: Optional[List[str]] = None,
        notebook_id: Optional[str] = None,
        slide_count: int = 8,
        with_images: bool = True,
        export_pptx: bool = False
    ) -> Dict[str, Any]:
        """
        Generate a professional presentation.

        Args:
            source_ids: Source ID list.
            notebook_id: Notebook ID.
            slide_count: Number of slides.
            with_images: Whether to generate images.
            export_pptx: Whether to export a PPTX file.

        Returns:
            Presentation data including text and images.
        """
        content = self.get_sources_content(source_ids, notebook_id)
        if not content:
            return {"error": "No source content available"}

        ai_service = get_ai_service()

        try:
            # Step 1: Generate the outline.
            logger.info("Step 1: Generate presentation outline")
            outline = self._generate_presentation_outline(content, slide_count, ai_service)

            # Step 2: Flatten outline into pages.
            pages = self._flatten_outline(outline)
            logger.info(f"Outline expanded to {len(pages)} pages")

            # Step 3: Generate page descriptions.
            logger.info("Step 2: Generate per-page descriptions")
            page_descriptions = self._generate_page_descriptions(content, outline, pages, ai_service)

            # Step 4: Build presentation data.
            presentation_data = self._build_presentation_data(outline, pages, page_descriptions)

            # Step 5: Generate images if requested.
            if with_images:
                logger.info("Step 3: Generate slide images")
                presentation_data = self._generate_professional_slide_images(
                    presentation_data, outline, ai_service
                )

            # Step 6: Export PPTX if requested.
            if export_pptx and PPTX_EXPORT_AVAILABLE:
                logger.info("Step 4: Export PPTX file")
                pptx_base64 = self._export_to_pptx(presentation_data)
                presentation_data["pptx_file"] = pptx_base64

            return {"data": presentation_data, "type": "presentation"}

        except Exception as e:
            logger.error(f"Presentation generation failed: {e}")
            return {"error": str(e)}

    def _generate_presentation_outline(self, content: str, slide_count: int, ai_service) -> List[Dict]:
        """Generate a presentation outline."""
        prompt = StudioPrompts.PRESENTATION_OUTLINE.format(
            content=content,
            slide_count=slide_count
        )
        outline = ai_service.generate_json(prompt)
        return outline

    def _flatten_outline(self, outline: List[Dict]) -> List[Dict]:
        """Flatten the outline into a page list."""
        pages = []
        for item in outline:
            if "part" in item and "pages" in item:
                # This is a section; expand its pages.
                for page in item["pages"]:
                    page_with_part = page.copy()
                    page_with_part["part"] = item["part"]
                    pages.append(page_with_part)
            else:
                # This is a direct page.
                pages.append(item)
        return pages

    def _generate_page_descriptions(self, content: str, outline: List[Dict],
                                     pages: List[Dict], ai_service) -> List[str]:
        """Generate detailed descriptions for each slide."""
        descriptions = []
        outline_json = json.dumps(outline, ensure_ascii=False, indent=2)

        for i, page in enumerate(pages):
            page_index = i + 1
            page_outline = json.dumps(page, ensure_ascii=False)

            # Determine whether this is the first page.
            is_first_page = (page_index == 1)
            first_page_note = (
                "**Unless specified otherwise, the first slide should be minimal: only title, subtitle, and speaker.**"
                if is_first_page else ""
            )
            subtitle_example = "Subtitle: Presentation subtitle" if is_first_page else ""

            # Get section info.
            part_info = f"This page belongs to: {page.get('part', '')}" if 'part' in page else ""

            prompt = StudioPrompts.PRESENTATION_PAGE_DESCRIPTION.format(
                content=content[:5000],  # Limit content length.
                outline=outline_json,
                part_info=part_info,
                page_index=page_index,
                page_outline=page_outline,
                first_page_note=first_page_note,
                example_title=page.get('title', 'Example Title'),
                subtitle_example=subtitle_example
            )

            try:
                description = ai_service.generate(prompt)
                descriptions.append(description.strip())
                logger.debug(f"Slide {page_index} description generated")
            except Exception as e:
                logger.error(f"Slide {page_index} description failed: {e}")
                descriptions.append(
                    f"Page title: {page.get('title', 'Untitled')}\n\n"
                    "Page content:\n- Content pending..."
                )

        return descriptions

    def _build_presentation_data(self, outline: List[Dict], pages: List[Dict],
                                  descriptions: List[str]) -> Dict[str, Any]:
        """Build presentation data."""
        # Determine the presentation title.
        title = "Presentation"
        if pages and pages[0].get('title'):
            title = pages[0]['title']

        slides = []
        for i, (page, description) in enumerate(zip(pages, descriptions)):
            slide_data = {
                "slide_number": i + 1,
                "title": page.get('title', ''),
                "type": "title" if i == 0 else "content",
                "points": page.get('points', []),
                "description": description,
                "part": page.get('part', ''),
                "image": None
            }

            # Parse description content.
            content_lines = []
            for line in description.split('\n'):
                line = line.strip()
                if line.startswith('- ') or line.startswith('• '):
                    content_lines.append(line)
                elif line.startswith('Page content:'):
                    continue
                elif not line.startswith('Page title:') and line:
                    content_lines.append(line)

            slide_data["content"] = '\n'.join(content_lines[:10])  # Max 10 lines.
            slides.append(slide_data)

        return {
            "title": title,
            "slides": slides,
            "outline": outline,
            "total_pages": len(slides)
        }

    def _generate_professional_slide_images(self, presentation_data: Dict,
                                             outline: List[Dict], ai_service) -> Dict:
        """Generate slide images using professional prompts."""
        slides = presentation_data.get("slides", [])
        outline_text = self._generate_outline_text(outline)

        for slide in slides:
            page_index = slide.get("slide_number", 1)
            page_desc = slide.get("description", "")

            # Get current section.
            current_section = slide.get("part", "") or slide.get("title", "")

            # Determine whether this is the title slide.
            is_title_page = (page_index == 1)
            first_page_design_note = StudioPrompts.PRESENTATION_TITLE_PAGE_DESIGN if is_title_page else ""

            # Build the image prompt.
            image_prompt = StudioPrompts.PRESENTATION_IMAGE_GENERATION.format(
                page_desc=page_desc,
                outline_text=outline_text,
                current_section=current_section,
                first_page_design_note=first_page_design_note
            )

            try:
                # Generate image.
                image_base64 = ai_service.generate_image(
                    image_prompt,
                    size="1792x1024",  # 16:9 ratio.
                    style="vivid"
                )

                slide["image"] = image_base64
                slide["image_prompt"] = image_prompt
                logger.info(f"Slide {page_index} image generated")

            except Exception as e:
                logger.error(f"Slide {page_index} image generation failed: {e}")
                slide["image"] = None
                slide["image_error"] = str(e)

        return presentation_data

    def _generate_outline_text(self, outline: List[Dict]) -> str:
        """Convert the outline to text."""
        text_parts = []
        for i, item in enumerate(outline, 1):
            if "part" in item and "pages" in item:
                text_parts.append(f"{i}. {item['part']}")
            else:
                text_parts.append(f"{i}. {item.get('title', 'Untitled')}")
        return "\n".join(text_parts)

    def _export_to_pptx(self, presentation_data: Dict) -> Optional[str]:
        """Export as a PPTX file."""
        if not PPTX_EXPORT_AVAILABLE:
            logger.warning("PPTX export is unavailable")
            return None

        try:
            builder = PPTXBuilder()
            builder.build_from_presentation_data(presentation_data)
            return builder.save_to_base64()
        except Exception as e:
            logger.error(f"PPTX export failed: {e}")
            return None

    def _generate_slide_images(self, presentation_data: Dict, ai_service) -> Dict:
        """
        Generate slide images (legacy method, kept for compatibility).

        Args:
            presentation_data: Presentation data.
            ai_service: AI service instance.

        Returns:
            Presentation data with images.
        """
        slides = presentation_data.get("slides", [])
        title = presentation_data.get("title", "Presentation")

        for slide in slides:
            image_prompt = slide.get("image_prompt", "")

            # Skip slides without image_prompt.
            if not image_prompt:
                slide["image"] = None
                continue

            try:
                # Enhance the image prompt.
                enhanced_prompt = self._enhance_image_prompt(
                    image_prompt,
                    title,
                    slide.get("content", ""),
                    ai_service
                )

                # Generate image.
                image_base64 = ai_service.generate_image(
                    enhanced_prompt,
                    size="1792x1024",  # Common 16:9 ratio for slides.
                    style="vivid"
                )

                slide["image"] = image_base64
                slide["enhanced_prompt"] = enhanced_prompt
                logger.info(f"Slide {slide.get('slide_number')} image generated")

            except Exception as e:
                logger.error(f"Slide {slide.get('slide_number')} image generation failed: {e}")
                slide["image"] = None
                slide["image_error"] = str(e)

        return presentation_data

    def _enhance_image_prompt(
        self,
        original_prompt: str,
        topic: str,
        slide_content: str,
        ai_service
    ) -> str:
        """Enhance image generation prompt."""
        try:
            prompt = StudioPrompts.IMAGE_PROMPT_ENHANCE.format(
                original_prompt=original_prompt,
                topic=topic,
                slide_content=slide_content[:200]  # Limit content length.
            )
            enhanced = ai_service.generate(prompt)
            return enhanced.strip()
        except Exception as e:
            logger.warning(f"Prompt enhancement failed, using original prompt: {e}")
            return original_prompt

    def generate_infographic(
        self,
        source_ids: Optional[List[str]] = None,
        notebook_id: Optional[str] = None,
        with_ai_image: bool = False
    ) -> Dict[str, Any]:
        """
        Generate an infographic (Chart.js visualization).

        Args:
            source_ids: Source ID list.
            notebook_id: Notebook ID.
            with_ai_image: Whether to generate an extra AI image.

        Returns:
            Infographic data including Chart.js config and insights.
        """
        content = self.get_sources_content(source_ids, notebook_id)
        if not content:
            return {"error": "No source content available"}

        ai_service = get_ai_service()

        try:
            # Generate Chart.js config with infographic prompt.
            prompt = StudioPrompts.INFOGRAPHIC.format(content=content)
            result = ai_service.generate_json(prompt)

            # Validate and fill required fields.
            if "charts" not in result:
                result["charts"] = []

            if "title" not in result:
                result["title"] = "Infographic"

            if "summary" not in result:
                result["summary"] = {
                    "key_findings": [],
                    "recommendations": []
                }

            # Add defaults for each chart config.
            for i, chart in enumerate(result.get("charts", [])):
                if "id" not in chart:
                    chart["id"] = f"chart{i + 1}"
                if "type" not in chart:
                    chart["type"] = "bar"
                if "config" not in chart:
                    # Create a basic config.
                    chart["config"] = {
                        "type": chart.get("type", "bar"),
                        "data": {
                            "labels": [],
                            "datasets": []
                        },
                        "options": {
                            "responsive": True,
                            "maintainAspectRatio": False
                        }
                    }

            # Optional: generate a decorative AI image.
            ai_image = None
            if with_ai_image:
                try:
                    title = result.get("title", "Infographic")
                    chart_types = result.get("metadata", {}).get("chart_types", [])
                    image_prompt = f"Professional data visualization infographic about {title}, featuring {', '.join(chart_types) if chart_types else 'charts and graphs'}, modern flat design, clean layout, business style, abstract data elements"

                    ai_image = ai_service.generate_image(
                        image_prompt,
                        size="1024x1024",
                        style="vivid"
                    )
                except Exception as img_error:
                    logger.warning(f"AI image generation failed: {img_error}")

            return {
                "data": result,
                "charts": result.get("charts", []),
                "summary": result.get("summary", {}),
                "image": ai_image,
                "type": "infographic"
            }

        except Exception as e:
            logger.error(f"Infographic generation failed: {e}")
            # Fall back to legacy method (datatable + AI image).
            try:
                return self._generate_infographic_fallback(source_ids, notebook_id, ai_service)
            except Exception as fallback_error:
                logger.error(f"Infographic fallback also failed: {fallback_error}")
                return {"error": str(e)}

    def _generate_infographic_fallback(
        self,
        source_ids: Optional[List[str]],
        notebook_id: Optional[str],
        ai_service
    ) -> Dict[str, Any]:
        """
        Fallback infographic generation (datatable + AI image).
        """
        datatable_result = self.generate_datatable(source_ids, notebook_id)
        if "error" in datatable_result:
            return datatable_result

        data = datatable_result.get("data", {})
        title = data.get("title", "Infographic")

        # Convert the datatable to basic bar chart config.
        charts = []
        if data.get("rows") and data.get("columns"):
            columns = data["columns"]
            rows = data["rows"]

            # Assume the first column is labels, others are values.
            if len(columns) >= 2:
                label_key = columns[0]["key"]
                labels = [row.get(label_key, "") for row in rows]

                for col in columns[1:]:
                    col_key = col["key"]
                    values = []
                    for row in rows:
                        val = row.get(col_key, 0)
                        # Try to convert to a number.
                        if isinstance(val, str):
                            try:
                                val = float(val.replace(",", "").replace("%", ""))
                            except ValueError:
                                val = 0
                        values.append(val)

                    charts.append({
                        "id": f"chart_{col_key}",
                        "title": col["label"],
                        "type": "bar",
                        "config": {
                            "type": "bar",
                            "data": {
                                "labels": labels,
                                "datasets": [{
                                    "label": col["label"],
                                    "data": values,
                                    "backgroundColor": "rgba(54, 162, 235, 0.8)",
                                    "borderColor": "rgba(54, 162, 235, 1)",
                                    "borderWidth": 1
                                }]
                            },
                            "options": {
                                "responsive": True,
                                "plugins": {
                                    "legend": {"position": "top"},
                                    "title": {"display": True, "text": col["label"]}
                                },
                                "scales": {"y": {"beginAtZero": True}}
                            }
                        }
                    })

        # Generate AI image.
        try:
            image_prompt = f"Professional infographic about {title}, data visualization, charts and graphs, modern flat design, clean layout, business style"
            image_base64 = ai_service.generate_image(
                image_prompt,
                size="1024x1024",
                style="vivid"
            )
        except Exception:
            image_base64 = None

        return {
            "data": {
                "title": title,
                "description": data.get("description", ""),
                "charts": charts,
                "datatable": data,
                "summary": {
                    "key_findings": ["Data has been converted into charts"],
                    "recommendations": []
                }
            },
            "charts": charts,
            "image": image_base64,
            "type": "infographic",
            "fallback": True
        }


    def generate_flowchart(
        self,
        source_ids: Optional[List[str]] = None,
        notebook_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Generate a flowchart (draw.io format).

        Args:
            source_ids: Source ID list.
            notebook_id: Notebook ID.

        Returns:
            Flowchart data including draw.io XML.
        """
        content = self.get_sources_content(source_ids, notebook_id)
        if not content:
            return {"error": "No source content available"}

        ai_service = get_ai_service()

        try:
            prompt = StudioPrompts.FLOWCHART.format(content=content)
            result = ai_service.generate_json(prompt)

            # Validate required fields.
            if "xml" not in result:
                return {"error": "Flowchart generation failed: missing XML data"}

            if "title" not in result:
                result["title"] = "Flowchart"

            if "elements" not in result:
                result["elements"] = {"nodes": 0, "edges": 0, "decisions": 0}

            return {
                "data": result,
                "xml": result.get("xml", ""),
                "title": result.get("title", "Flowchart"),
                "description": result.get("description", ""),
                "type": "flowchart"
            }

        except Exception as e:
            logger.error(f"Flowchart generation failed: {e}")
            return {"error": str(e)}

    def generate_diagram(
        self,
        source_ids: Optional[List[str]] = None,
        notebook_id: Optional[str] = None,
        diagram_type: str = "auto"
    ) -> Dict[str, Any]:
        """
        Generate an architecture/system diagram (draw.io format).

        Args:
            source_ids: Source ID list.
            notebook_id: Notebook ID.
            diagram_type: Diagram type (auto/layered/microservices/client-server/network).

        Returns:
            Diagram data including draw.io XML.
        """
        content = self.get_sources_content(source_ids, notebook_id)
        if not content:
            return {"error": "No source content available"}

        ai_service = get_ai_service()

        try:
            prompt = StudioPrompts.DIAGRAM.format(content=content)

            # Add a type hint when specified.
            if diagram_type != "auto":
                type_hints = {
                    "layered": "Generate a layered architecture diagram (top to bottom).",
                    "microservices": "Generate a microservices diagram (left to right).",
                    "client-server": "Generate a client-server architecture diagram.",
                    "network": "Generate a network topology diagram."
                }
                if diagram_type in type_hints:
                    prompt = f"{type_hints[diagram_type]}\n\n{prompt}"

            result = ai_service.generate_json(prompt)

            # Validate required fields.
            if "xml" not in result:
                return {"error": "Diagram generation failed: missing XML data"}

            if "title" not in result:
                result["title"] = "Architecture Diagram"

            if "components" not in result:
                result["components"] = []

            if "connections" not in result:
                result["connections"] = []

            return {
                "data": result,
                "xml": result.get("xml", ""),
                "title": result.get("title", "Architecture Diagram"),
                "description": result.get("description", ""),
                "diagram_type": result.get("diagram_type", diagram_type),
                "type": "diagram"
            }

        except Exception as e:
            logger.error(f"Diagram generation failed: {e}")
            return {"error": str(e)}


# Global instance.
_studio_service: Optional[StudioService] = None


def get_studio_service() -> StudioService:
    """Get the studio service instance."""
    global _studio_service
    if _studio_service is None:
        _studio_service = StudioService()
    return _studio_service
