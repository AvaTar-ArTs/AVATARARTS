import { describe, expect, it } from 'vitest';
import {
  normalizeSceneTimings,
  resolveSongDuration,
  type SceneTiming,
} from '../../../supabase/functions/_shared/storyboardQuality.ts';

describe('resolveSongDuration', () => {
  it('prefers explicit analysis duration but falls back to scenes when missing', () => {
    const scenes: SceneTiming[] = [
      {
        id: 'scene-1',
        title: 'One',
        overview: 'Intro',
        start_time: 0,
        end_time: 25,
        has_character: true,
        characters: ['@a'],
        visual_prompt: 'Intro beat',
      },
      {
        id: 'scene-2',
        title: 'Two',
        overview: 'Verse',
        start_time: 25,
        end_time: 60,
        has_character: true,
        characters: ['@a'],
        visual_prompt: 'Verse energy',
      },
    ];

    expect(resolveSongDuration({ duration: 140 }, scenes)).toBe(140);
    expect(resolveSongDuration({}, scenes)).toBeGreaterThanOrEqual(60);
  });
});

describe('normalizeSceneTimings', () => {
  const buildScene = (overrides: Partial<SceneTiming>, index: number): SceneTiming => ({
    id: `scene-${index + 1}`,
    title: `Scene ${index + 1}`,
    overview: 'Overview',
    start_time: index * 10,
    end_time: (index + 1) * 10,
    has_character: false,
    characters: [],
    visual_prompt: 'Prompt',
    ...overrides,
  });

  it('evenly redistributes scenes when timings overlap or collapse', () => {
    const rawScenes: SceneTiming[] = [
      buildScene({ start_time: 0, end_time: 21 }, 0),
      buildScene({ start_time: 21, end_time: 41 }, 1),
      buildScene({ start_time: 41, end_time: 159 }, 2),
      buildScene({ start_time: 159, end_time: 159 }, 3),
      buildScene({ start_time: 159, end_time: 159 }, 4),
      buildScene({ start_time: 159, end_time: 159 }, 5),
    ];

    const totalDuration = resolveSongDuration({ duration: 159 }, rawScenes);
    const normalized = normalizeSceneTimings(rawScenes, totalDuration);

    expect(normalized).toHaveLength(rawScenes.length);
    expect(normalized[0].start_time).toBe(0);
    expect(normalized.at(-1)?.end_time).toBe(totalDuration);

    const durations = normalized.map((scene) => scene.end_time - scene.start_time);
    expect(Math.min(...durations)).toBeGreaterThanOrEqual(20);
    expect(Math.max(...durations)).toBeLessThanOrEqual(50);
    expect(new Set(normalized.map((scene) => scene.start_time)).size).toBe(rawScenes.length);
  });

  it('preserves sensible timings while enforcing monotonic order', () => {
    const rawScenes: SceneTiming[] = [
      buildScene({ start_time: 0, end_time: 28 }, 0),
      buildScene({ start_time: 28, end_time: 56 }, 1),
      buildScene({ start_time: 56, end_time: 86 }, 2),
      buildScene({ start_time: 86, end_time: 120 }, 3),
    ];

    const totalDuration = resolveSongDuration({ duration: 120 }, rawScenes);
    const normalized = normalizeSceneTimings(rawScenes, totalDuration);

    expect(normalized.at(-1)?.end_time).toBe(120);
    const durations = normalized.map((scene) => scene.end_time - scene.start_time);
    expect(Math.max(...durations) - Math.min(...durations)).toBeLessThanOrEqual(12);
  });
});
