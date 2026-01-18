import { describe, expect, it } from 'vitest';
import { sanitizeShots, type RawShot } from '../../../supabase/functions/_shared/shotSanitizer.ts';

describe('shot sanitizer', () => {
  const options = { defaultSceneId: 'scene-1', defaultSceneIndex: 0 };

  it('fills defaults and enforces positive durations', () => {
    const rawShots: RawShot[] = [
      {
        id: undefined,
        title: '',
        description: undefined,
        start_time: -5,
        end_time: 0,
        characters: ['@hero', 42],
      },
      {
        scene_id: 'scene-2',
        start_time: 10.2,
        end_time: 13.7,
        has_character: true,
      },
    ];

    const sanitized = sanitizeShots(rawShots, options);
    expect(sanitized).toHaveLength(2);
    expect(sanitized[0].id).toBe('shot-1');
    expect(sanitized[0].start_time).toBeGreaterThanOrEqual(0);
    expect(sanitized[0].end_time).toBeGreaterThan(sanitized[0].start_time);
    expect(sanitized[0].characters).toEqual(['@hero']);
    expect(sanitized[1].scene_id).toBe('scene-2');
    expect(sanitized[1].start_time).toBe(10);
    expect(sanitized[1].end_time).toBe(14);
  });

  it('sorts shots by start time regardless of input order', () => {
    const rawShots: RawShot[] = [
      { id: 'b', start_time: 5, end_time: 9 },
      { id: 'a', start_time: 1, end_time: 3 },
    ];

    const sanitized = sanitizeShots(rawShots, options);
    expect(sanitized.map((shot) => shot.id)).toEqual(['a', 'b']);
  });
});

