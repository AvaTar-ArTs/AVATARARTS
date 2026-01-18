/**
 * Structured prompt builder for consistent video/image generation prompts.
 * Implements 10-slot ordered prompt structure for optimal model performance.
 */

export interface PromptSlots {
  style_tag: string;
  camera_angle: string;
  environment: string;
  primary_subject: string;
  supporting_elements: string;
  lighting: string;
  color_emphasis: string;
  dynamic_line?: string; // Optional for stills
  mood: string;
  reference_directive: string; // Mandatory
}

const DEFAULT_REFERENCE_DIRECTIVE = 
  "Preserve composition/lighting. Transfer the visual style of input images; last two images are style inspiration.";

export class PromptBuilder {
  private slots: PromptSlots;

  constructor(slots: Partial<PromptSlots>) {
    this.slots = {
      style_tag: slots.style_tag || "",
      camera_angle: slots.camera_angle || "",
      environment: slots.environment || "",
      primary_subject: slots.primary_subject || "",
      supporting_elements: slots.supporting_elements || "",
      lighting: slots.lighting || "",
      color_emphasis: slots.color_emphasis || "",
      dynamic_line: slots.dynamic_line,
      mood: slots.mood || "",
      reference_directive: slots.reference_directive || DEFAULT_REFERENCE_DIRECTIVE,
    };
  }

  /**
   * Renders the prompt as a single-line string with ordered slots.
   * Skips empty slots except reference_directive which is mandatory.
   */
  render(includeMotion = true): string {
    const parts: string[] = [];

    // Slot 1: Style tag
    if (this.slots.style_tag) parts.push(this.slots.style_tag);

    // Slot 2: Camera angle
    if (this.slots.camera_angle) parts.push(this.slots.camera_angle);

    // Slot 3: Environment
    if (this.slots.environment) parts.push(this.slots.environment);

    // Slot 4: Primary subject
    if (this.slots.primary_subject) parts.push(this.slots.primary_subject);

    // Slot 5: Supporting elements
    if (this.slots.supporting_elements) parts.push(this.slots.supporting_elements);

    // Slot 6: Lighting
    if (this.slots.lighting) parts.push(this.slots.lighting);

    // Slot 7: Color emphasis
    if (this.slots.color_emphasis) parts.push(this.slots.color_emphasis);

    // Slot 8: Dynamic line (optional, skip for stills)
    if (includeMotion && this.slots.dynamic_line) {
      parts.push(this.slots.dynamic_line);
    }

    // Slot 9: Mood
    if (this.slots.mood) parts.push(this.slots.mood);

    // Slot 10: Reference directive (always included)
    parts.push(this.slots.reference_directive);

    return parts.join(" ");
  }

  /**
   * Renders a static image prompt (excludes dynamic_line).
   */
  renderImage(): string {
    return this.render(false);
  }

  /**
   * Renders a video prompt (includes dynamic_line).
   */
  renderVideo(): string {
    return this.render(true);
  }

  /**
   * Gets the raw slots for debugging/auditing.
   */
  getSlots(): PromptSlots {
    return { ...this.slots };
  }
}

/**
 * Helper to extract prompt slots from AI-generated content.
 * Parses structured data into PromptSlots format.
 */
export function extractPromptSlots(data: {
  style?: string;
  camera?: string;
  environment?: string;
  subject?: string;
  elements?: string;
  lighting?: string;
  colors?: string;
  motion?: string;
  mood?: string;
  characters?: string[];
}): Partial<PromptSlots> {
  return {
    style_tag: data.style || "",
    camera_angle: data.camera || "",
    environment: data.environment || "",
    primary_subject: data.subject || "",
    supporting_elements: data.elements || "",
    lighting: data.lighting || "",
    color_emphasis: data.colors || "",
    dynamic_line: data.motion || "",
    mood: data.mood || "",
  };
}
