import { describe, expect, it } from 'vitest';
import {
  buildSegmindGenerationPayload,
  mapToSupportedDuration,
  SUPPORTED_SHOT_DURATIONS,
} from '../shotDuration';

describe('mapToSupportedDuration', () => {
  const cases = [
    { input: 4.9, expected: 5 },
    { input: 5, expected: 5 },
    { input: 6.4, expected: 5 },
    { input: 7.5, expected: 10 },
    { input: 8.9, expected: 10 },
    { input: 10, expected: 10 },
    { input: 12, expected: 10 },
  ] as const;

  cases.forEach(({ input, expected }) => {
    it(`maps ${input} seconds to ${expected}`, () => {
      expect(mapToSupportedDuration(input)).toBe(expected);
    });
  });

  it('falls back to the shortest duration when given NaN', () => {
    expect(mapToSupportedDuration(Number.NaN)).toBe(SUPPORTED_SHOT_DURATIONS[0]);
  });
});

describe('buildSegmindGenerationPayload', () => {
  it('normalizes shot video requests', () => {
    const payload = buildSegmindGenerationPayload(
      {
        id: 'shot-1',
        mode: 'shot_video',
        sceneId: 'scene-1',
        duration: 8.2,
        videoPrompt: 'Camera pushes through fog',
        imagePrompt: 'Foggy forest at dawn',
        audioUrl: 'https://example.com/shot.mp3',
        characterImage: 'https://example.com/character.png',
        keyframeImage: 'https://example.com/keyframe.png',
      },
      {
        projectId: 'project-123',
        resolution: '4k',
      }
    );

    expect(payload).toEqual({
      mode: 'shot_video',
      requestId: 'shot-1',
      projectId: 'project-123',
      sceneId: 'scene-1',
      shotId: 'shot-1',
      video_prompt: 'Camera pushes through fog',
      image_prompt: 'Foggy forest at dawn',
      shot_audio: 'https://example.com/shot.mp3',
      shot_duration: 10,
      shot_character: 'https://example.com/character.png',
      shot_keyframe: 'https://example.com/keyframe.png',
      Resolution: '4k',
      generation_type: 'video',
    });
  });

  it('normalizes scene image requests', () => {
    const payload = buildSegmindGenerationPayload(
      {
        id: 'scene-42',
        mode: 'scene_image',
        prompt: 'A neon-lit alleyway at night',
        characterImages: ['https://example.com/character1.png', 'https://example.com/character2.png'],
      },
      {
        projectId: 'project-123',
        resolution: '2k',
        generationType: 'keyframe',
      }
    );

    expect(payload).toEqual({
      mode: 'scene_image',
      requestId: 'scene-42',
      projectId: 'project-123',
      sceneId: 'scene-42',
      shotId: 'scene-42',
      video_prompt: 'A neon-lit alleyway at night',
      image_prompt: 'A neon-lit alleyway at night',
      shot_audio: '',
      shot_duration: 5,
      scene_character: ['https://example.com/character1.png', 'https://example.com/character2.png'],
      Resolution: '2k',
      generation_type: 'keyframe',
    });
  });
});
