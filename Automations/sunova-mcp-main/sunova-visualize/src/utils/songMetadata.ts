export interface SongMetadataUpdates {
  tempo?: number;
  key?: string;
  genre?: string;
  lyrics?: string;
}

const TEMPO_REGEX = /(?:tempo|bpm)\s*(?:is|=|to)?\s*(\d{2,3})/i;
const KEY_REGEX = /key\s*(?:is|=|to)?\s*([A-G](?:#|b)?(?:\s*(?:major|minor))?)/i;
const GENRE_REGEX = /genre\s*(?:is|=|to|should\s+be|should\s+feel\s+like|should\s+sound\s+like)?\s*([a-z0-9&/'"-\s]+)/i;
const LYRICS_REGEX = /lyrics\s*(?:are|is|to|=|:|should\s+be|should\s+say)?\s*([\s\S]+)/i;

const clampTempo = (tempo: number) => {
  if (!Number.isFinite(tempo)) return undefined;
  const rounded = Math.round(tempo);
  if (rounded < 40 || rounded > 300) {
    return undefined;
  }
  return rounded;
};

const normalizeKey = (rawKey: string) => {
  const trimmed = rawKey.trim();
  if (!trimmed) return undefined;
  const keyMatch = trimmed.match(/^([A-Ga-g])(#{1}|b{1})?\s*(major|minor)?$/);
  if (!keyMatch) return undefined;
  const [, letter, accidental = '', quality] = keyMatch;
  const upperLetter = letter.toUpperCase();
  const accidentalSymbol = accidental === '#' ? '#' : accidental === 'b' ? 'b' : '';
  const qualityText = quality ? `${quality.toLowerCase()}` : '';
  return qualityText ? `${upperLetter}${accidentalSymbol} ${qualityText}` : `${upperLetter}${accidentalSymbol}`;
};

const normalizeGenre = (rawGenre: string) => {
  const trimmed = rawGenre.trim();
  if (!trimmed) return undefined;
  const cleaned = trimmed
    .split(/[.!?]/)[0]
    .replace(/[^a-z0-9&/'"\-\s]/gi, '')
    .trim();
  if (!cleaned) return undefined;
  return cleaned
    .split(/\s+/)
    .map(word => {
      if (!word) return word;
      if (word.length <= 3 && word.toUpperCase() === word) {
        return word.toUpperCase();
      }
      const [first, ...rest] = word;
      return `${first.toUpperCase()}${rest.join('').toLowerCase()}`;
    })
    .join(' ');
};

const normalizeLyrics = (rawLyrics: string) => {
  const trimmed = rawLyrics.trim();
  if (!trimmed) return undefined;
  const normalized = trimmed.replace(/^"|"$/g, '').replace(/^“|”$/g, '').trim();
  if (!normalized) return undefined;
  return normalized;
};

export function extractSongMetadataUpdates(text: string): SongMetadataUpdates {
  const lowerBoundText = text || '';
  const updates: SongMetadataUpdates = {};

  const tempoMatch = lowerBoundText.match(TEMPO_REGEX);
  if (tempoMatch) {
    const tempo = clampTempo(Number.parseInt(tempoMatch[1], 10));
    if (tempo !== undefined) {
      updates.tempo = tempo;
    }
  }

  const keyMatch = lowerBoundText.match(KEY_REGEX);
  if (keyMatch) {
    const key = normalizeKey(keyMatch[1]);
    if (key) {
      updates.key = key;
    }
  }

  const genreMatch = lowerBoundText.match(GENRE_REGEX);
  if (genreMatch) {
    const genre = normalizeGenre(genreMatch[1]);
    if (genre) {
      updates.genre = genre;
    }
  }

  const lyricsMatch = lowerBoundText.match(LYRICS_REGEX);
  if (lyricsMatch) {
    const lyrics = normalizeLyrics(lyricsMatch[1]);
    if (lyrics) {
      updates.lyrics = lyrics;
    }
  }

  return updates;
}

export interface NormalizedSongMetadataUpdates {
  updates: SongMetadataUpdates;
  summary: string;
}

export function normalizeSongMetadataUpdates(
  current: SongMetadataUpdates,
  proposed: SongMetadataUpdates
): NormalizedSongMetadataUpdates | null {
  const sanitized: SongMetadataUpdates = {};
  const summaryParts: string[] = [];

  if (typeof proposed.tempo === 'number') {
    const tempo = clampTempo(proposed.tempo);
    if (tempo !== undefined && tempo !== current.tempo) {
      sanitized.tempo = tempo;
      summaryParts.push(`tempo set to ${tempo} BPM`);
    }
  }

  if (typeof proposed.key === 'string') {
    const key = normalizeKey(proposed.key);
    if (key && key !== current.key) {
      sanitized.key = key;
      summaryParts.push(`key set to ${key}`);
    }
  }

  if (typeof proposed.genre === 'string') {
    const genre = normalizeGenre(proposed.genre);
    if (genre && genre.toLowerCase() !== (current.genre || '').toLowerCase()) {
      sanitized.genre = genre;
      summaryParts.push(`genre set to ${genre}`);
    }
  }

  if (typeof proposed.lyrics === 'string') {
    const lyrics = normalizeLyrics(proposed.lyrics);
    if (lyrics && lyrics !== (current.lyrics || '').trim()) {
      sanitized.lyrics = lyrics;
      summaryParts.push('lyrics updated');
    }
  }

  if (summaryParts.length === 0) {
    return null;
  }

  return {
    updates: sanitized,
    summary: `Song metadata updated: ${summaryParts.join(', ')}.`
  };
}
