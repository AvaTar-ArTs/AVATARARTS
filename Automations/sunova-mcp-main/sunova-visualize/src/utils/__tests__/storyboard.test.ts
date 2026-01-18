import { describe, expect, it } from 'vitest';
import { buildCharacterOptions, ensureCharacterMention, serializeStoryboard, hasStoryboardConcept } from '../storyboard';

describe('ensureCharacterMention', () => {
  it('appends mention when missing', () => {
    const prompt = 'A dramatic rooftop performance';
    expect(ensureCharacterMention(prompt, '@hero')).toContain('@hero');
  });

  it('avoids duplicate mentions', () => {
    const prompt = 'Scene with @hero in the spotlight.';
    expect(ensureCharacterMention(prompt, '@hero')).toBe(prompt);
  });

  it('normalizes mention without prefix', () => {
    const prompt = 'Slow motion close-up';
    expect(ensureCharacterMention(prompt, 'villain')).toContain('@villain');
  });
});

describe('buildCharacterOptions', () => {
  it('maps characters with assessments', () => {
    const options = buildCharacterOptions({
      characters: {
        '@hero': 'https://example.com/hero.png',
      },
      assessments: [
        {
          reference: 'Hero',
          imageUrl: 'https://example.com/hero.png',
          attributes: { role: 'lead' },
        },
      ],
    });

    expect(options).toHaveLength(1);
    expect(options[0].mention).toBe('@hero');
    expect(options[0].name).toBe('Hero');
  });

  it('returns empty array when no characters', () => {
    expect(buildCharacterOptions(undefined)).toEqual([]);
  });
});

describe('serializeStoryboard', () => {
  it('normalizes scene and shot timing and characters', () => {
    const serialized = serializeStoryboard(
      [
        {
          id: 'scene-1',
          title: 'Opening',
          overview: 'Intro scene',
          start_time: 0.2,
          end_time: 9.7,
          has_character: true,
          characters: ['@hero', '@hero'],
          prompt: 'A bold opening',
          keyframe_image: 'https://example.com/frame.png',
          reference_image: 'https://example.com/reference.png',
        },
      ],
      [
        {
          id: 'shot-1',
          scene_id: 'scene-1',
          scene_index: 0,
          title: 'Wide shot',
          description: 'Wide of the band',
          start_time: 0.1,
          end_time: 4.9,
          image_prompt: 'Band performing on rooftop',
          video_prompt: 'Dynamic sweeping motion',
          has_character: true,
          characters: ['@hero', '@hero'],
          camera_direction: 'Push in',
          shot_type: 'wide',
          keyframe_image: 'https://example.com/frame.png',
          generated_image: 'https://example.com/generated.png',
          generated_video: 'https://example.com/generated.mp4',
          cost: 2.5,
        },
      ],
    );

    expect(serialized.scenes[0].start_time).toBe(0);
    expect(serialized.scenes[0].end_time).toBeGreaterThanOrEqual(serialized.scenes[0].start_time);
    expect(serialized.scenes[0].characters).toEqual(['@hero']);
    expect(serialized.scenes[0].reference_image).toBe('https://example.com/reference.png');
    expect(serialized.scenes[0].keyframe_image).toBe('https://example.com/frame.png');
    expect(serialized.shots[0].generated_image).toBe('https://example.com/generated.png');
    expect(serialized.shots[0].generated_video).toBe('https://example.com/generated.mp4');
    expect(serialized.shots[0].characters).toEqual(['@hero']);
  });
});

describe('hasStoryboardConcept', () => {
  it('returns false when concept data is missing or empty', () => {
    expect(hasStoryboardConcept(undefined)).toBe(false);
    expect(hasStoryboardConcept(null)).toBe(false);
    expect(hasStoryboardConcept({})).toBe(false);
    expect(hasStoryboardConcept({ storyline: [] })).toBe(false);
  });

  it('detects valid concepts with storyline or multiple attributes', () => {
    expect(hasStoryboardConcept({
      storyline: [{ phase: 'beginning', events: ['Intro'] }],
    })).toBe(true);

    expect(hasStoryboardConcept({
      concept_summary: 'High-level idea',
      mood: 'moody',
    })).toBe(true);
  });
});
