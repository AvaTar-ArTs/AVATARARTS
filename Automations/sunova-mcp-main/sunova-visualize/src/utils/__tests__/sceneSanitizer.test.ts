import { describe, expect, it } from 'vitest';
import {
  sanitizeAndNormalizeScenes,
  sanitizeScenes,
  type RawScene,
} from '../../../supabase/functions/_shared/sceneSanitizer.ts';

const buildRawScene = (overrides: Partial<RawScene>, index: number): RawScene => ({
  id: undefined,
  title: undefined,
  overview: 'Overview',
  start_time: undefined,
  end_time: undefined,
  has_character: false,
  characters: ['@hero', 42, null],
  visual_prompt: undefined,
  ...overrides,
  style: 'Neon Noir',
  camera: 'Wide shot',
});

describe('scene sanitizer', () => {
  it('fills in missing metadata and sorts by start time', () => {
    const rawScenes: RawScene[] = [
      buildRawScene({ overview: 'Second scene', start_time: 15, end_time: 30 }, 1),
      buildRawScene({ overview: 'First scene', start_time: 0, end_time: 15 }, 0),
    ];

    const sanitized = sanitizeScenes(rawScenes);
    expect(sanitized).toHaveLength(2);
    expect(new Set(sanitized.map((scene) => scene.id))).toEqual(new Set(['scene-1', 'scene-2']));
    expect(sanitized[0].characters).toEqual(['@hero']);
    expect(sanitized[0].start_time).toBeLessThanOrEqual(sanitized[1].start_time);
    expect(sanitized[0].visual_prompt).toBeDefined();
  });

  it('normalizes timings to cover the full song duration', () => {
    const rawScenes: RawScene[] = Array.from({ length: 6 }).map((_, index) =>
      buildRawScene({ start_time: 0, end_time: 0 }, index),
    );

    const normalized = sanitizeAndNormalizeScenes(rawScenes, { duration: 180 });
    expect(normalized).toHaveLength(6);
    expect(normalized[0].start_time).toBe(0);
    expect(normalized.at(-1)?.end_time).toBe(180);

    const durations = normalized.map((scene) => scene.end_time - scene.start_time);
    durations.forEach((duration) => {
      expect(duration).toBeGreaterThan(0);
    });

    // Ensure custom fields survive normalization
    expect(normalized[0]).toHaveProperty('style');
    expect(normalized[0]).toHaveProperty('camera');
  });
});
