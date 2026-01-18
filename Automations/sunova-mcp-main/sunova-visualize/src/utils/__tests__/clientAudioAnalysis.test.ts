import { describe, expect, it } from 'vitest';

import { buildAnalysisSamples, buildTempoSamples } from '../clientAudioAnalysis';

describe('buildTempoSamples', () => {
  it('downsamples to the target rate while cleaning invalid values', () => {
    const samples = new Float32Array([0, 1, 2, 3, 4, 5, 6, NaN, Infinity]);

    const result = buildTempoSamples(samples, 48000);

    expect(Array.from(result.samples)).toEqual([0, 4, 0]);
    expect(result.sampleRate).toBe(12000);
  });

  it('returns the original sample rate when already below the target', () => {
    const samples = new Float32Array([0.5, -0.5, 0.25]);

    const result = buildTempoSamples(samples, 8000);

    expect(Array.from(result.samples)).toEqual([0.5, -0.5, 0.25]);
    expect(result.sampleRate).toBe(8000);
  });
});

describe('buildAnalysisSamples', () => {
  it('downsamples using the expected factor', () => {
    const samples = new Float32Array([0, 1, 2, 3, 4]);

    const result = buildAnalysisSamples(samples, 44100);

    expect(Array.from(result.samples)).toEqual([0, 2, 4]);
    expect(result.sampleRate).toBe(22050);
  });

  it('handles empty input gracefully', () => {
    const result = buildAnalysisSamples(new Float32Array(), 44100);

    expect(Array.from(result.samples)).toEqual([]);
    expect(result.sampleRate).toBe(22050);
  });
});
