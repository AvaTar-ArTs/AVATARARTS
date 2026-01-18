export interface ConceptStorylinePhase {
  phase?: string;
  description?: string;
  events?: string[];
}

export interface ScenePlanningHeuristics {
  durationSeconds: number | null;
  recommendedMinScenes: number;
  recommendedMaxScenes: number;
  storylinePhaseCount: number;
  storylineEventCount: number;
  characterCount: number;
  singleLocationEmphasis: boolean;
  notes: string[];
}

const SINGLE_LOCATION_KEYWORDS = [
  'single location',
  'one location',
  'same location',
  'single room',
  'same room',
  'one room',
  'single set',
  'one continuous shot',
  'continuous shot',
  'one-take',
  'one take',
  'locked-off performance',
  'live performance on one stage',
  'performance-only video',
];

const clamp = (value: number, min: number, max: number) => {
  if (value < min) return min;
  if (value > max) return max;
  return value;
};

const coercePositiveInteger = (value: unknown): number | null => {
  if (typeof value === 'number' && Number.isFinite(value) && value > 0) {
    return value;
  }
  if (typeof value === 'string') {
    const parsed = Number.parseFloat(value);
    if (Number.isFinite(parsed) && parsed > 0) {
      return parsed;
    }
  }
  return null;
};

const extractDurationSeconds = (analysis: unknown): number | null => {
  if (!analysis || typeof analysis !== 'object') {
    return null;
  }
  const record = analysis as Record<string, unknown>;
  const direct = coercePositiveInteger(record.duration);
  if (direct) {
    return direct;
  }
  const nested = record.songData as Record<string, unknown> | undefined;
  if (nested) {
    const nestedDuration = coercePositiveInteger(nested.duration);
    if (nestedDuration) {
      return nestedDuration;
    }
  }
  const analysisDuration = (record.audio_analysis as Record<string, unknown> | undefined)?.duration;
  if (analysisDuration && typeof analysisDuration === 'number') {
    return analysisDuration;
  }
  return null;
};

const normalizeStoryline = (concept: unknown): ConceptStorylinePhase[] => {
  if (!concept || typeof concept !== 'object') {
    return [];
  }
  const storyline = (concept as Record<string, unknown>).storyline;
  if (!Array.isArray(storyline)) {
    return [];
  }
  return storyline
    .map((phase) => {
      if (!phase || typeof phase !== 'object') {
        return null;
      }
      const record = phase as Record<string, unknown>;
      const events = Array.isArray(record.events)
        ? record.events.filter((event) => typeof event === 'string')
        : [];
      return {
        phase: typeof record.phase === 'string' ? record.phase : undefined,
        description: typeof record.description === 'string' ? record.description : undefined,
        events,
      } satisfies ConceptStorylinePhase;
    })
    .filter((value): value is ConceptStorylinePhase => Boolean(value));
};

const countCharacters = (characters: unknown): number => {
  if (!Array.isArray(characters)) {
    return 0;
  }
  return characters.filter((character) => character && typeof character === 'object').length;
};

const detectSingleLocationIntent = (concept: unknown): boolean => {
  if (!concept || typeof concept !== 'object') {
    return false;
  }
  const record = concept as Record<string, unknown>;
  const summary = typeof record.concept_summary === 'string' ? record.concept_summary : '';
  const storyline = normalizeStoryline(concept);
  const textFragments = [summary];
  storyline.forEach((phase) => {
    if (phase.description) {
      textFragments.push(phase.description);
    }
    if (phase.events) {
      textFragments.push(...phase.events);
    }
  });
  const haystack = textFragments.join(' ').toLowerCase();
  return SINGLE_LOCATION_KEYWORDS.some((keyword) => haystack.includes(keyword));
};

const buildNotes = (params: {
  durationSeconds: number | null;
  storylinePhaseCount: number;
  storylineEventCount: number;
  characterCount: number;
  singleLocationEmphasis: boolean;
  recommendedMinScenes: number;
  recommendedMaxScenes: number;
}): string[] => {
  const {
    durationSeconds,
    storylinePhaseCount,
    storylineEventCount,
    characterCount,
    singleLocationEmphasis,
    recommendedMinScenes,
    recommendedMaxScenes,
  } = params;
  const notes: string[] = [];
  if (durationSeconds) {
    notes.push(`Song duration: ${Math.round(durationSeconds)} seconds.`);
  } else {
    notes.push('Song duration unknown; default heuristics applied.');
  }
  notes.push(`Storyline phases detected: ${storylinePhaseCount}.`);
  notes.push(`Storyline events detected: ${storylineEventCount}.`);
  if (characterCount > 0) {
    notes.push(`Featured characters supplied: ${characterCount}.`);
  }
  if (singleLocationEmphasis) {
    notes.push('Concept highlights a single-location or one-take approach; only split into additional scenes when the narrative explicitly moves to a new location or time.');
  } else {
    notes.push(`Recommended scenes: ${recommendedMinScenes} to ${recommendedMaxScenes}.`);
  }
  return notes;
};

export const deriveScenePlanningHeuristics = (
  concept: unknown,
  analysis: unknown,
  characters?: unknown
): ScenePlanningHeuristics => {
  const durationSeconds = extractDurationSeconds(analysis);
  const storyline = normalizeStoryline(concept);
  const storylinePhaseCount = storyline.length;
  const storylineEventCount = storyline.reduce((total, phase) => total + (phase.events?.length ?? 0), 0);
  const characterCount = countCharacters(characters);
  const singleLocationEmphasis = detectSingleLocationIntent(concept);

  let recommendedMinScenes = 1;
  if (!singleLocationEmphasis) {
    if (durationSeconds && durationSeconds >= 105) {
      recommendedMinScenes = 2;
    }
    if (durationSeconds && durationSeconds >= 150) {
      recommendedMinScenes = Math.max(recommendedMinScenes, 3);
    }
    if (durationSeconds && durationSeconds >= 210) {
      recommendedMinScenes = Math.max(recommendedMinScenes, 4);
    }
    if (storylinePhaseCount >= 3) {
      recommendedMinScenes = Math.max(recommendedMinScenes, storylinePhaseCount);
    }
    if (storylineEventCount >= 6) {
      recommendedMinScenes = Math.max(recommendedMinScenes, 3);
    }
    if (storylineEventCount >= 10) {
      recommendedMinScenes = Math.max(recommendedMinScenes, 4);
    }
    if (characterCount >= 5) {
      recommendedMinScenes = Math.max(recommendedMinScenes, 3);
    }
    if (characterCount >= 8) {
      recommendedMinScenes = Math.max(recommendedMinScenes, 4);
    }
  }

  const roughMax = durationSeconds ? Math.ceil(durationSeconds / 20) : 15;
  const recommendedMaxScenes = clamp(Math.max(recommendedMinScenes, roughMax), recommendedMinScenes, 15);

  const notes = buildNotes({
    durationSeconds,
    storylinePhaseCount,
    storylineEventCount,
    characterCount,
    singleLocationEmphasis,
    recommendedMinScenes,
    recommendedMaxScenes,
  });

  return {
    durationSeconds,
    recommendedMinScenes,
    recommendedMaxScenes,
    storylinePhaseCount,
    storylineEventCount,
    characterCount,
    singleLocationEmphasis,
    notes,
  };
};
