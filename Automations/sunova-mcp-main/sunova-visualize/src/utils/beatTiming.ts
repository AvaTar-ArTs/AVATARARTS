interface SceneLike {
  id: string;
  startTime: number;
  endTime: number;
}

const MIN_DURATION_SECONDS = 0.5;

const sanitizeBeats = (beatMap: number[] | undefined, duration?: number): number[] => {
  if (!Array.isArray(beatMap) || beatMap.length === 0) {
    return duration ? [0, duration] : [];
  }

  const filtered = beatMap
    .filter((value) => Number.isFinite(value))
    .map((value) => Math.max(0, Number(value)))
    .sort((a, b) => a - b);

  const deduped: number[] = [];
  let lastValue: number | null = null;
  for (const value of filtered) {
    if (lastValue === null || Math.abs(value - lastValue) > 0.01) {
      deduped.push(value);
      lastValue = value;
    }
  }

  if (duration && duration > 0) {
    if (deduped.length === 0 || deduped[0] > 0.05) {
      deduped.unshift(0);
    }
    if (deduped[deduped.length - 1] < duration - 0.05) {
      deduped.push(duration);
    }
  }

  return deduped;
};

const computeSecondsPerBeat = (beats: number[], tempo?: number, duration?: number): number => {
  if (tempo && tempo > 0) {
    return 60 / tempo;
  }
  if (beats.length > 1) {
    const deltas = beats.slice(1).map((value, index) => Math.max(value - beats[index], MIN_DURATION_SECONDS));
    const average = deltas.reduce((sum, value) => sum + value, 0) / deltas.length;
    if (Number.isFinite(average) && average > 0) {
      return average;
    }
  }
  if (duration && duration > 0 && beats.length > 0) {
    return Math.max(duration / beats.length, MIN_DURATION_SECONDS);
  }
  return 2.5;
};

const snapForward = (beats: number[], time: number): number | null => {
  for (const beat of beats) {
    if (beat >= time - 0.01) {
      return beat;
    }
  }
  return beats.length ? beats[beats.length - 1] : null;
};

const snapClosest = (beats: number[], time: number): number => {
  if (beats.length === 0) return time;
  let closest = beats[0];
  let smallestDiff = Math.abs(closest - time);
  for (const beat of beats) {
    const diff = Math.abs(beat - time);
    if (diff < smallestDiff) {
      closest = beat;
      smallestDiff = diff;
    }
  }
  return closest;
};

const clamp = (value: number, min: number, max: number): number => {
  if (value < min) return min;
  if (value > max) return max;
  return value;
};

export const alignScenesToBeats = <T extends SceneLike>(
  scenes: T[],
  beatMap: number[] | undefined,
  duration?: number,
  tempo?: number
): T[] => {
  if (!Array.isArray(scenes) || scenes.length === 0) {
    return scenes;
  }

  const beats = sanitizeBeats(beatMap, duration);
  if (beats.length < 2) {
    return scenes;
  }

  const secondsPerBeat = computeSecondsPerBeat(beats, tempo, duration);
  let lastEnd = 0;

  return scenes.map((scene, index) => {
    const startGuess = Math.max(scene.startTime ?? 0, lastEnd);
    const snappedStart = snapForward(beats, startGuess) ?? startGuess;
    const minimumEnd = Math.max(snappedStart + MIN_DURATION_SECONDS, startGuess + secondsPerBeat);
    const desiredEnd = Math.max(scene.endTime ?? minimumEnd, minimumEnd);
    let snappedEnd = snapForward(beats, desiredEnd) ?? desiredEnd;

    if (duration) {
      snappedEnd = Math.min(snappedEnd, duration);
    }

    if (snappedEnd <= snappedStart) {
      snappedEnd = clamp(snappedStart + secondsPerBeat, snappedStart + MIN_DURATION_SECONDS, duration ?? snappedStart + secondsPerBeat);
    }

    if (index === scenes.length - 1 && duration) {
      snappedEnd = Math.max(snappedEnd, duration);
    }

    lastEnd = snappedEnd;

    return {
      ...scene,
      startTime: snappedStart,
      endTime: snappedEnd,
    };
  });
};

interface ShotLike {
  id: string;
  sceneId: string;
  start_time: number;
  end_time: number;
}

export const alignShotsToBeats = <T extends ShotLike>(
  shots: T[],
  beatMap: number[] | undefined,
  scenes: SceneLike[],
  duration?: number,
  tempo?: number
): T[] => {
  if (!Array.isArray(shots) || shots.length === 0) {
    return shots;
  }

  const beats = sanitizeBeats(beatMap, duration);
  if (beats.length < 2) {
    return shots;
  }

  const secondsPerBeat = computeSecondsPerBeat(beats, tempo, duration);
  const scenesById = new Map<string, SceneLike>();
  scenes.forEach((scene) => scenesById.set(scene.id, scene));

  const grouped = shots.reduce<Record<string, T[]>>((acc, shot) => {
    const sceneId = shot.sceneId || shots[0]?.sceneId || 'scene-1';
    acc[sceneId] = acc[sceneId] ? [...acc[sceneId], shot] : [shot];
    return acc;
  }, {});

  const updatedShots: T[] = [];

  Object.entries(grouped).forEach(([sceneId, sceneShots]) => {
    const scene = scenesById.get(sceneId);
    if (!scene) {
      updatedShots.push(...sceneShots);
      return;
    }

    const sceneBeats = beats.filter((beat) => beat >= scene.startTime - 0.01 && beat <= scene.endTime + 0.01);
    if (sceneBeats.length < 2) {
      updatedShots.push(...sceneShots);
      return;
    }

    let previousEnd = scene.startTime;
    const orderedShots = [...sceneShots].sort((a, b) => a.start_time - b.start_time);

    orderedShots.forEach((shot, index) => {
    const startGuess = Math.max(previousEnd, shot.start_time, scene.startTime);
    let snappedStart = snapClosest(sceneBeats, startGuess);
    snappedStart = clamp(snappedStart, scene.startTime, scene.endTime);
    snappedStart = Math.max(snappedStart, previousEnd);

    const minimumEnd = snappedStart + Math.max(secondsPerBeat, MIN_DURATION_SECONDS);
      const desiredEnd = Math.max(shot.end_time, minimumEnd);
      let snappedEnd = snapForward(sceneBeats, desiredEnd) ?? desiredEnd;
      snappedEnd = clamp(snappedEnd, snappedStart + MIN_DURATION_SECONDS, scene.endTime);

      if (index === orderedShots.length - 1) {
        snappedEnd = scene.endTime;
      }

      if (snappedEnd <= snappedStart) {
        snappedEnd = clamp(snappedStart + secondsPerBeat, snappedStart + MIN_DURATION_SECONDS, scene.endTime);
      }

      previousEnd = snappedEnd;

      updatedShots.push({
        ...shot,
        start_time: snappedStart,
        end_time: snappedEnd,
      });
    });
  });

  return updatedShots.sort((a, b) => a.start_time - b.start_time);
};

export const summarizeBeats = (beatMap: number[] | undefined): { totalBeats: number; averageSpacing: number | null } => {
  if (!Array.isArray(beatMap) || beatMap.length < 2) {
    return { totalBeats: Array.isArray(beatMap) ? beatMap.length : 0, averageSpacing: null };
  }
  let total = 0;
  for (let i = 0; i < beatMap.length - 1; i++) {
    total += Math.max(beatMap[i + 1] - beatMap[i], 0);
  }
  return {
    totalBeats: beatMap.length,
    averageSpacing: total / (beatMap.length - 1),
  };
};

export type { SceneLike, ShotLike };
