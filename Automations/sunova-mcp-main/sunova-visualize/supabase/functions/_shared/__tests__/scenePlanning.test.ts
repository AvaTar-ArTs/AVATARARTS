import { describe, expect, it } from 'vitest';
import { deriveScenePlanningHeuristics } from '../scenePlanning';

describe('deriveScenePlanningHeuristics', () => {
  it('recommends multiple scenes for long songs with rich storylines', () => {
    const concept = {
      concept_summary: 'A cross-country adventure following a band on tour.',
      storyline: [
        { phase: 'beginning', events: ['Band loads gear in a neon-lit rehearsal space', 'Night drive through the city'] },
        { phase: 'middle', events: ['Sunrise diner stop in the desert', 'Flashback to childhood home'] },
        { phase: 'end', events: ['Final performance on rooftop stage under fireworks'] },
      ],
    };
    const analysis = { duration: 210 };
    const characters = Array.from({ length: 6 }).map((_, index) => ({ name: `Character ${index + 1}` }));

    const heuristics = deriveScenePlanningHeuristics(concept, analysis, characters);

    expect(heuristics.recommendedMinScenes).toBeGreaterThanOrEqual(4);
    expect(heuristics.singleLocationEmphasis).toBe(false);
    expect(heuristics.notes.join(' ')).toContain('Recommended scenes');
  });

  it('keeps single location emphasis to one scene when concept explicitly says so', () => {
    const concept = {
      concept_summary: 'An intimate one-take performance in a single room as the camera rotates.',
      storyline: [
        { phase: 'beginning', events: ['Artist adjusts microphone in the same room'] },
        { phase: 'middle', events: ['Camera orbits the artist in the same room'] },
        { phase: 'end', events: ['Song ends with lights dimming in the same room'] },
      ],
    };
    const analysis = { duration: 200 };

    const heuristics = deriveScenePlanningHeuristics(concept, analysis, []);

    expect(heuristics.recommendedMinScenes).toBe(1);
    expect(heuristics.singleLocationEmphasis).toBe(true);
    expect(heuristics.notes.some((note) => note.includes('single-location'))).toBe(true);
  });

  it('falls back to default heuristics when metadata is sparse', () => {
    const heuristics = deriveScenePlanningHeuristics(undefined, undefined, undefined);

    expect(heuristics.recommendedMinScenes).toBe(1);
    expect(heuristics.recommendedMaxScenes).toBe(15);
    expect(heuristics.notes[0]).toContain('unknown');
  });
});
