export interface CharacterOption {
  mention: string;
  name: string;
  imageUrl?: string;
  description?: string;
}

/**
 * Ensures a scene prompt includes an @character mention exactly once.
 */
export const ensureCharacterMention = (prompt: string, character: string): string => {
  if (!character.trim()) {
    return prompt;
  }

  const normalizedMention = character.trim().startsWith("@")
    ? character.trim()
    : `@${character.trim()}`;

  const escapedMention = normalizedMention.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const mentionPattern = new RegExp(`(^|[^@])${escapedMention}(?![A-Za-z0-9_@])`, "i");
  if (mentionPattern.test(prompt)) {
    return prompt;
  }

  const suffix = prompt.trim().endsWith(".") ? "" : ".";
  return `${prompt.trim()}${suffix} Feature ${normalizedMention} prominently.`;
};

/**
 * Maps character assessment data into quick lookup objects.
 */
export const buildCharacterOptions = (
  characters?: {
    characters: Record<string, string>;
    assessments: Array<{ reference: string; imageUrl: string; attributes?: Record<string, unknown> }>;
  }
): CharacterOption[] => {
  if (!characters) {
    return [];
  }

  return Object.entries(characters.characters).map(([mention, imageUrl]) => {
    const assessment = characters.assessments.find((item) => item.imageUrl === imageUrl);
    return {
      mention,
      name: assessment?.reference || mention.replace(/^@/, ""),
      imageUrl,
      description: assessment?.attributes ? JSON.stringify(assessment.attributes) : undefined,
    };
  });
};

export interface SceneForSave {
  id: string;
  title: string;
  overview: string;
  start_time: number;
  end_time: number;
  has_character: boolean;
  characters: string[];
  prompt: string;
  keyframe_image?: string;
  reference_image?: string;
}

export interface ShotForSave {
  id: string;
  scene_id: string;
  scene_index: number;
  title: string;
  description: string;
  start_time: number;
  end_time: number;
  image_prompt: string;
  video_prompt: string;
  has_character: boolean;
  characters: string[];
  camera_direction?: string;
  shot_type?: string;
  keyframe_image?: string;
  generated_image?: string;
  generated_video?: string;
  cost?: number;
}

export const serializeStoryboard = (
  scenes: SceneForSave[],
  shots: ShotForSave[],
  promptHashes?: Record<string, string>
) => ({
  scenes: scenes.map((scene) => ({
    ...scene,
    start_time: Math.max(0, Math.round(scene.start_time)),
    end_time: Math.max(Math.round(scene.start_time), Math.round(scene.end_time)),
    characters: Array.from(new Set(scene.characters)),
  })),
  shots: shots.map((shot) => ({
    ...shot,
    start_time: Math.max(0, Math.round(shot.start_time)),
    end_time: Math.max(Math.round(shot.start_time), Math.round(shot.end_time)),
    characters: Array.from(new Set(shot.characters)),
  })),
  ...(promptHashes && { promptHashes }),
});

export const hasStoryboardConcept = (concept: unknown): concept is Record<string, unknown> => {
  if (!concept || typeof concept !== 'object') {
    return false;
  }

  const entries = Object.entries(concept as Record<string, unknown>).filter(([, value]) => value !== undefined && value !== null);
  if (entries.length === 0) {
    return false;
  }

  const hasStoryline = entries.some(([key, value]) =>
    key.toLowerCase().includes('story') && Array.isArray(value) && value.length > 0,
  );

  return hasStoryline || entries.length > 1;
};
