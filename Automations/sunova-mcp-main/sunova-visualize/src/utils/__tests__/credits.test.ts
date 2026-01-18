import { describe, expect, it } from 'vitest';
import { formatCredits, getGenerationCost, IMAGE_GENERATION_COST, VIDEO_GENERATION_COST } from '../credits';

describe('getGenerationCost', () => {
  it('returns the image cost for keyframe generations', () => {
    expect(getGenerationCost('keyframe')).toBe(IMAGE_GENERATION_COST);
  });

  it('returns the video cost for video generations', () => {
    expect(getGenerationCost('video')).toBe(VIDEO_GENERATION_COST);
  });
});

describe('formatCredits', () => {
  it('formats a positive balance with two decimals', () => {
    expect(formatCredits(12.5)).toBe('$12.50');
  });

  it('handles zero balance', () => {
    expect(formatCredits(0)).toBe('$0.00');
  });

  it('guards against non-finite values', () => {
    expect(formatCredits(Number.POSITIVE_INFINITY)).toBe('$0.00');
  });
});
