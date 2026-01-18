import { describe, expect, it } from 'vitest';
import { buildConceptUpdatePayload, persistConceptToProject } from '../projectPersistence';

const concept = {
  concept_summary: 'High-energy rooftop performance',
  storyline: [
    { phase: 'beginning', events: ['Artist arrives'] },
    { phase: 'middle', events: ['Crowd builds'] },
    { phase: 'end', events: ['Final chorus'] },
  ],
  visual_themes: ['neon', 'city skyline'],
  character_roles: { '@artist': 'Lead performer' },
  status: 'draft',
};

const analysis = {
  tempo: 128,
  key: 'A minor',
  duration: 180,
  genre: 'electropop',
};

class SupabaseStub {
  public lastTable?: string;
  public lastPayload?: Record<string, unknown>;
  public lastEq?: { column: string; value: unknown };
  public response = { error: null, data: [{ id: 'project-123' }] };

  from(table: string) {
    this.lastTable = table;
    return {
      update: (payload: Record<string, unknown>) => {
        this.lastPayload = payload;
        return {
          eq: async (column: string, value: unknown) => {
            this.lastEq = { column, value };
            return this.response;
          },
        };
      },
    };
  }
}

describe('project persistence', () => {
  it('builds a concept payload with serialized notes and merged analysis', () => {
    const payload = buildConceptUpdatePayload(concept as any, analysis);
    expect(payload.status).toBe('ready_for_storyboard');
    expect(typeof payload.updated_at).toBe('string');
    expect(payload.concept_notes).toEqual(JSON.stringify(concept));
    expect(payload.audio_analysis).toMatchObject({ tempo: 128, concept });
    // Ensure clone prevents mutation side effects
    expect(payload.audio_analysis).not.toBe(analysis);
  });

  it('persists concept update to projects table', async () => {
    const client = new SupabaseStub();
    const result = await persistConceptToProject({
      supabase: client as any,
      projectId: 'project-123',
      concept: concept as any,
      analysis,
    });

    expect(client.lastTable).toBe('projects');
    expect(client.lastEq).toEqual({ column: 'id', value: 'project-123' });
    expect(client.lastPayload).toMatchObject({ status: 'ready_for_storyboard' });
    expect(client.lastPayload?.concept_notes).toEqual(JSON.stringify(concept));
    expect(client.lastPayload?.audio_analysis).toMatchObject({ concept });
    expect(result.error).toBeNull();
    expect(result.payload).toEqual(client.lastPayload);
  });
});

