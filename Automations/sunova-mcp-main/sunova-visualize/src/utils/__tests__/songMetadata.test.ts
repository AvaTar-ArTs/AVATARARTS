import { describe, expect, it } from 'vitest';
import {
  extractSongMetadataUpdates,
  normalizeSongMetadataUpdates,
  type SongMetadataUpdates
} from '../songMetadata';

describe('extractSongMetadataUpdates', () => {
  it('detects tempo, key, genre, and lyrics updates from mixed text', () => {
    const text = 'Can you set the tempo to 128 bpm, switch the key to F# minor, genre to electronic dance, and lyrics: We rise tonight';
    expect(extractSongMetadataUpdates(text)).toEqual({
      tempo: 128,
      key: 'F# minor',
      genre: 'Electronic Dance',
      lyrics: 'We rise tonight'
    });
  });

  it('ignores out of range tempo values', () => {
    const text = 'tempo 12 bpm please';
    expect(extractSongMetadataUpdates(text)).toEqual({});
  });

  it('handles quoted lyrics', () => {
    const text = 'lyrics should be "Shine bright\nAcross the sky"';
    expect(extractSongMetadataUpdates(text)).toEqual({
      lyrics: 'Shine bright\nAcross the sky'
    });
  });
});

describe('normalizeSongMetadataUpdates', () => {
  const current: SongMetadataUpdates = {
    tempo: 112,
    key: 'C major',
    genre: 'Unknown',
    lyrics: 'Old lyrics'
  };

  it('returns sanitized updates with summary', () => {
    const proposed: SongMetadataUpdates = {
      tempo: 123,
      key: 'f minor',
      genre: 'electronic dance',
      lyrics: 'New hook line'
    };

    const result = normalizeSongMetadataUpdates(current, proposed);
    expect(result).toEqual({
      updates: {
        tempo: 123,
        key: 'F minor',
        genre: 'Electronic Dance',
        lyrics: 'New hook line'
      },
      summary: 'Song metadata updated: tempo set to 123 BPM, key set to F minor, genre set to Electronic Dance, lyrics updated.'
    });
  });

  it('returns null when no meaningful changes are detected', () => {
    const result = normalizeSongMetadataUpdates(current, {});
    expect(result).toBeNull();
  });
});
