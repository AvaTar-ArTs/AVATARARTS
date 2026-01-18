import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1?no-check';
import { createCorsHeaders, handleOptions } from "../_shared/cors.ts";

interface CheckTasksRequest {
  project_id: string;
}

serve(async (req) => {
  const corsHeaders = createCorsHeaders(req.headers.get('origin'));
  const optionsResponse = handleOptions(req, corsHeaders);
  if (optionsResponse) {
    return optionsResponse;
  }

  try {
    const segmindApiKey = Deno.env.get('SEGMIND_API_KEY');
    if (!segmindApiKey) {
      throw new Error('SEGMIND_API_KEY not configured');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase configuration missing');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const authHeader = req.headers.get('authorization');

    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Authentication required' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: authData, error: authError } = await supabase.auth.getUser(token);

    if (authError || !authData?.user?.id) {
      return new Response(JSON.stringify({ error: 'Authentication required' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { project_id }: CheckTasksRequest = await req.json();

    // Fetch pending or timed-out tasks
    const { data: pendingTasks, error: tasksError } = await supabase
      .from('generation_tasks')
      .select('*')
      .eq('project_id', project_id)
      .in('status', ['pending', 'timeout'])
      .order('created_at', { ascending: false });

    if (tasksError) {
      throw new Error(`Failed to fetch tasks: ${tasksError.message}`);
    }

    const results = [];

    for (const task of pendingTasks || []) {
      if (!task.request_id) {
        continue;
      }

      try {
        const pollUrl = `https://api.segmind.com/requests/${task.request_id}`;
        const response = await fetch(pollUrl, {
          headers: {
            'x-api-key': segmindApiKey,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          console.log(`Failed to poll task ${task.id}: ${response.status}`);
          continue;
        }

        const data = await response.json();
        const status = typeof data.status === 'string' ? data.status.toUpperCase() : undefined;

        if (status === 'COMPLETED' || status === 'SUCCEEDED' || status === 'SUCCESS') {
          // Extract media URL from response
          let mediaUrl: string | null = null;

          // Parse Segmind output format
          if (data.output && typeof data.output === 'string') {
            try {
              const output = JSON.parse(data.output);
              if (Array.isArray(output)) {
                for (const item of output) {
                  if (item?.value?.data && typeof item.value.data === 'string') {
                    mediaUrl = item.value.data;
                    break;
                  }
                }
              }
            } catch (_) {
              // Ignore parse errors
            }
          }

          if (mediaUrl) {
            // Update task in database
            await supabase
              .from('generation_tasks')
              .update({
                status: 'completed',
                result_url: mediaUrl,
                completed_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              })
              .eq('id', task.id);

            results.push({
              task_id: task.id,
              shot_id: task.shot_id,
              scene_id: task.scene_id,
              generation_type: task.generation_type,
              status: 'completed',
              media_url: mediaUrl,
            });
          }
        } else if (status === 'FAILED' || status === 'ERROR') {
          await supabase
            .from('generation_tasks')
            .update({
              status: 'failed',
              error_message: data.error || data.message || 'Unknown error',
              updated_at: new Date().toISOString(),
            })
            .eq('id', task.id);

          results.push({
            task_id: task.id,
            shot_id: task.shot_id,
            scene_id: task.scene_id,
            generation_type: task.generation_type,
            status: 'failed',
            error: data.error || data.message || 'Unknown error',
          });
        } else {
          // Still processing
          results.push({
            task_id: task.id,
            shot_id: task.shot_id,
            scene_id: task.scene_id,
            generation_type: task.generation_type,
            status: 'processing',
          });
        }
      } catch (error) {
        console.error(`Error checking task ${task.id}:`, error);
        results.push({
          task_id: task.id,
          shot_id: task.shot_id,
          scene_id: task.scene_id,
          generation_type: task.generation_type,
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return new Response(JSON.stringify({ results }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in check-pending-tasks function:', error);

    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : 'Unknown error',
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
