export interface SceneTiming {
  id: string;
  title: string;
  overview: string;
  start_time: number;
  end_time: number;
  has_character: boolean;
  characters: string[];
  visual_prompt: string;
}

const PREFERRED_MIN_DURATION = 20;
const PREFERRED_MAX_DURATION = 50;
const FALLBACK_DURATION_PER_SCENE = 30;

const DURATION_KEYS = [
  'duration',
  'audio_duration',
  'total_duration',
  'length_seconds',
  'length',
];

const toFiniteNumber = (value: unknown): number | null => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string') {
    const parsed = Number.parseFloat(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }
  return null;
};

const sanitizeSceneTiming = (scene: SceneTiming): SceneTiming => ({
  ...scene,
  start_time: Number.isFinite(scene.start_time) ? Math.max(0, Math.round(scene.start_time)) : 0,
  end_time: Number.isFinite(scene.end_time) ? Math.max(0, Math.round(scene.end_time)) : 0,
  characters: Array.isArray(scene.characters) ? scene.characters : [],
});

const distributeEvenly = (scenes: SceneTiming[], totalDuration: number): SceneTiming[] => {
  if (scenes.length === 0) {
    return scenes;
  }

  const sanitizedTotal = Math.max(1, Math.round(totalDuration));
  const step = sanitizedTotal / scenes.length;

  return scenes.map((scene, index) => {
    const start = Math.round(step * index);
    const end = index === scenes.length - 1 ? sanitizedTotal : Math.round(step * (index + 1));

    return {
      ...scene,
      start_time: Math.min(start, sanitizedTotal),
      end_time: Math.max(Math.min(end, sanitizedTotal), Math.min(start, sanitizedTotal) + 1),
    };
  });
};

const enforceProgressiveTiming = (scenes: SceneTiming[], totalDuration: number): SceneTiming[] => {
  if (scenes.length === 0) {
    return scenes;
  }

  const sanitizedTotal = Math.max(1, Math.round(totalDuration));
  const baseDuration = sanitizedTotal / scenes.length;
  let minDuration = Math.max(1, Math.round(baseDuration * 0.6));
  let maxDuration = Math.max(minDuration + 5, Math.round(baseDuration * 1.4));

  if (minDuration * scenes.length > sanitizedTotal) {
    minDuration = Math.max(1, Math.floor(sanitizedTotal / scenes.length));
  }
  if (maxDuration < minDuration + 1) {
    maxDuration = minDuration + 1;
  }

  let cursor = 0;

  return scenes.map((scene, index) => {
    const start = index === 0 ? 0 : Math.max(cursor, scene.start_time);
    const remainingScenes = scenes.length - index - 1;
    const remainingMin = remainingScenes * minDuration;
    const maxAllowedEnd = sanitizedTotal - remainingMin;

    const rawDuration = Math.max(scene.end_time - scene.start_time, minDuration);
    let duration = Math.min(Math.max(rawDuration, minDuration), maxDuration);

    if (start + duration > maxAllowedEnd) {
      duration = Math.max(minDuration, maxAllowedEnd - start);
    }

    let end = start + duration;

    if (index === scenes.length - 1) {
      end = sanitizedTotal;
    }

    if (end <= start) {
      end = Math.min(sanitizedTotal, start + Math.max(1, Math.round(baseDuration)));
    }

    cursor = end;

    return {
      ...scene,
      start_time: start,
      end_time: Math.max(end, start + 1),
    };
  });
};

export const resolveSongDuration = (analysis: unknown, scenes: SceneTiming[]): number => {
  const candidates: number[] = [];

  if (analysis && typeof analysis === 'object') {
    const record = analysis as Record<string, unknown>;
    for (const key of DURATION_KEYS) {
      const candidate = toFiniteNumber(record[key]);
      if (candidate && candidate > 0) {
        candidates.push(candidate);
      }
    }

    const beatMap = record.beatMap ?? record.beat_map;
    if (Array.isArray(beatMap) && beatMap.length > 0) {
      const numericBeats = beatMap
        .map((value) => (typeof value === 'number' && Number.isFinite(value) ? value : null))
        .filter((value): value is number => value !== null);

      if (numericBeats.length > 0) {
        candidates.push(Math.max(...numericBeats));
      }
    }
  }

  const maxSceneTime = scenes.reduce((max, scene) => {
    const times = [scene.start_time, scene.end_time];
    for (const time of times) {
      if (Number.isFinite(time) && time > max) {
        max = time;
      }
    }
    return max;
  }, 0);

  if (maxSceneTime > 0) {
    candidates.push(maxSceneTime);
  }

  const fallback = scenes.length > 0 ? scenes.length * FALLBACK_DURATION_PER_SCENE : 180;
  const resolved = Math.max(...candidates, fallback);
  return Math.max(1, Math.round(resolved));
};

export const normalizeSceneTimings = (scenes: SceneTiming[], totalDuration: number): SceneTiming[] => {
  if (!Array.isArray(scenes) || scenes.length === 0) {
    return [];
  }

  const sanitizedScenes = scenes.map(sanitizeSceneTiming)
    .sort((a, b) => {
      if (a.start_time === b.start_time) {
        return a.end_time - b.end_time;
      }
      return a.start_time - b.start_time;
    });

  const sanitizedTotal = Math.max(1, Math.round(totalDuration));
  const durations = sanitizedScenes.map((scene) => Math.max(0, scene.end_time - scene.start_time));
  const averageDuration = sanitizedTotal / sanitizedScenes.length;

  const hasZeroOrNegative = durations.some((duration) => duration <= 0);
  const hasOverlap = sanitizedScenes.some((scene, index) => {
    if (index === 0) {
      return false;
    }
    return scene.start_time < sanitizedScenes[index - 1].end_time;
  });

  const isAverageInPreferredRange = averageDuration >= PREFERRED_MIN_DURATION && averageDuration <= PREFERRED_MAX_DURATION;
  const violatesPreferredRange = isAverageInPreferredRange && (
    durations.some((duration) => duration < PREFERRED_MIN_DURATION) ||
    durations.some((duration) => duration > PREFERRED_MAX_DURATION)
  );

  const variance = Math.max(...durations) - Math.min(...durations);
  const isHighlyImbalanced = isAverageInPreferredRange && variance > 20;

  if (hasZeroOrNegative || hasOverlap || violatesPreferredRange || isHighlyImbalanced) {
    return distributeEvenly(sanitizedScenes, sanitizedTotal);
  }

  return enforceProgressiveTiming(sanitizedScenes, sanitizedTotal);
};
