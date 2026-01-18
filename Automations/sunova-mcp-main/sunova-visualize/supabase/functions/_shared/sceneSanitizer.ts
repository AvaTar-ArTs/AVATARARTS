import type { SceneTiming } from './storyboardQuality.ts';
import { normalizeSceneTimings, resolveSongDuration } from './storyboardQuality.ts';

export interface RawScene {
  id?: string;
  title?: string;
  overview?: string;
  start_time?: number;
  end_time?: number;
  has_character?: boolean;
  characters?: unknown;
  visual_prompt?: string;
  style?: string;
  camera?: string;
  environment?: string;
  subject?: string;
  elements?: string;
  lighting?: string;
  colors?: string;
  motion?: string;
  mood?: string;
}

const toStringArray = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === 'string');
  }
  return [];
};

const buildScene = (raw: RawScene, index: number): SceneTiming & RawScene => {
  const base: SceneTiming = {
    id: raw.id && typeof raw.id === 'string' ? raw.id : `scene-${index + 1}`,
    title: raw.title && typeof raw.title === 'string' ? raw.title : `Scene ${index + 1}`,
    overview: raw.overview && typeof raw.overview === 'string' ? raw.overview : '',
    start_time: typeof raw.start_time === 'number' ? raw.start_time : index * 10,
    end_time: typeof raw.end_time === 'number' ? raw.end_time : (index + 1) * 10,
    has_character: Boolean(raw.has_character),
    characters: toStringArray(raw.characters),
    visual_prompt:
      raw.visual_prompt && typeof raw.visual_prompt === 'string'
        ? raw.visual_prompt
        : raw.overview && typeof raw.overview === 'string'
          ? raw.overview
          : `Visualize scene ${index + 1}`,
  };

  return {
    ...raw,
    ...base,
    characters: base.characters,
    visual_prompt: base.visual_prompt,
  };
};

export type SanitizedScene = SceneTiming & RawScene;

export const sanitizeScenes = (rawScenes: RawScene[]): SanitizedScene[] =>
  rawScenes
    .map((scene, index) => buildScene(scene, index) as SanitizedScene)
    .sort((a, b) => a.start_time - b.start_time);

export const sanitizeAndNormalizeScenes = (
  rawScenes: RawScene[],
  analysis: unknown,
): SanitizedScene[] => {
  const sanitized = sanitizeScenes(rawScenes);
  const totalDuration = resolveSongDuration(analysis, sanitized);
  const normalized = normalizeSceneTimings(sanitized, totalDuration);
  return normalized as SanitizedScene[];
};
