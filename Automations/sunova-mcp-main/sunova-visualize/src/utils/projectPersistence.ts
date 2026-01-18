import type { SupabaseClient } from '@supabase/supabase-js';
import type { ConceptPayload } from '@/types/concept';

export interface PersistConceptParams {
  supabase: SupabaseClient<any, 'public', any>;
  projectId: string;
  concept: ConceptPayload;
  analysis: Record<string, unknown>;
}

export interface PersistConceptResult {
  error: unknown;
  data: unknown;
  payload: Record<string, unknown>;
}

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value));

export const buildConceptUpdatePayload = (
  concept: ConceptPayload,
  analysis: Record<string, unknown>,
): Record<string, unknown> => {
  const updatedAnalysis = {
    ...analysis,
    concept,
  };

  return {
    concept_notes: JSON.stringify(concept),
    audio_analysis: clone(updatedAnalysis),
    status: 'ready_for_storyboard',
    updated_at: new Date().toISOString(),
  };
};

export const persistConceptToProject = async ({
  supabase,
  projectId,
  concept,
  analysis,
}: PersistConceptParams): Promise<PersistConceptResult> => {
  const payload = buildConceptUpdatePayload(concept, analysis);
  const { error, data } = await supabase
    .from('projects')
    .update(payload)
    .eq('id', projectId);

  return { error, data, payload };
};

