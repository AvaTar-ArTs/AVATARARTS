import type { SupabaseClient } from '@supabase/supabase-js';

type GenericSupabaseClient = SupabaseClient<Record<string, unknown>>;

interface GenerationTaskRow {
  id: string;
  status: 'pending' | 'completed' | 'failed' | 'timeout';
  result_url: string | null;
  error_message: string | null;
  generation_type: 'video' | 'keyframe';
}

interface WaitForGenerationTaskOptions {
  supabase: GenericSupabaseClient;
  taskId?: string | null;
  shotId?: string | null;
  pollIntervalMs?: number;
  maxAttempts?: number;
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const waitForGenerationTaskCompletion = async ({
  supabase,
  taskId,
  shotId,
  pollIntervalMs = 3000,
  maxAttempts = 90,
}: WaitForGenerationTaskOptions): Promise<GenerationTaskRow> => {
  if (!taskId && !shotId) {
    throw new Error('waitForGenerationTaskCompletion requires a taskId or shotId');
  }

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    let query = supabase
      .from('generation_tasks')
      .select('id, status, result_url, error_message, generation_type')
      .limit(1);

    if (taskId) {
      query = query.eq('id', taskId);
    } else if (shotId) {
      query = query.eq('shot_id', shotId).order('created_at', { ascending: false });
    }

    const { data, error } = await query.maybeSingle();

    if (error) {
      throw new Error(`Failed to fetch generation task: ${error.message}`);
    }

    if (data) {
      if (data.status === 'completed' && data.result_url) {
        return data as GenerationTaskRow;
      }

      if (data.status === 'failed' || data.status === 'timeout') {
        throw new Error(data.error_message ?? 'Segmind generation failed');
      }
    }

    await delay(pollIntervalMs);
  }

  throw new Error('Segmind generation timed out');
};
