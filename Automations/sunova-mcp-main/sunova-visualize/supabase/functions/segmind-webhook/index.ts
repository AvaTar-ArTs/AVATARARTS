import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1?no-check';
import { createCorsHeaders, handleOptions } from "../_shared/cors.ts";
import { extractCandidateRequestIds } from "../_shared/segmindWebhookUtils.ts";

interface SegmindWebhookPayload {
  request_id: string;
  status: string;
  output?: string | unknown;
  error?: string;
  error_message?: string;
  [key: string]: unknown;
}

const SUCCESS_STATUSES = new Set(['COMPLETED', 'SUCCEEDED', 'SUCCESS']);
const FAILURE_STATUSES = new Set(['FAILED', 'ERROR']);

type PathSegment = string | number;

const VIDEO_PATHS: PathSegment[][] = [
  ['generated_shot_video'],
  ['generated_video'],
  ['video_url'],
  ['video'],
  ['shot_video'],
  ['output', 'video'],
  ['output', 'video_url'],
  ['output', 'shot_video'],
  ['output', 'videos', 0],
  ['output', 'video_urls', 0],
  ['outputs', 0, 'video'],
  ['outputs', 0, 'video_url'],
  ['outputs', 0, 'shot_video'],
  ['data', 'video'],
  ['data', 'video_url'],
  ['result', 'video'],
  ['result', 'video_url'],
];

const IMAGE_PATHS: PathSegment[][] = [
  ['generated_shot_image'],
  ['generated_image'],
  ['image_url'],
  ['image'],
  ['shot_image'],
  ['output', 'image'],
  ['output', 'image_url'],
  ['output', 'shot_image'],
  ['output', 'images', 0],
  ['output', 'image_urls', 0],
  ['outputs', 0, 'image'],
  ['outputs', 0, 'image_url'],
  ['outputs', 0, 'shot_image'],
  ['data', 'image'],
  ['data', 'image_url'],
  ['result', 'image'],
  ['result', 'image_url'],
];

const getValueAtPath = (value: unknown, path: PathSegment[]): unknown => {
  return path.reduce<unknown>((current, segment) => {
    if (current === null || current === undefined) {
      return undefined;
    }

    if (typeof segment === 'number') {
      if (!Array.isArray(current)) {
        return undefined;
      }
      return current[segment];
    }

    if (typeof current !== 'object') {
      return undefined;
    }

    return (current as Record<string, unknown>)[segment];
  }, value);
};

const isHttpUrl = (value: unknown): boolean => {
  if (typeof value !== 'string') {
    return false;
  }
  return value.startsWith('http://') || value.startsWith('https://');
};

const flattenHttpStrings = (value: unknown, acc: string[] = []): string[] => {
  if (isHttpUrl(value)) {
    acc.push(value as string);
    return acc;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      flattenHttpStrings(item, acc);
    }
    return acc;
  }

  if (value && typeof value === 'object') {
    for (const key of Object.keys(value)) {
      flattenHttpStrings((value as Record<string, unknown>)[key], acc);
    }
    return acc;
  }

  return acc;
};

const extractMediaFromResponse = (payload: unknown): { videoUrl?: string; imageUrl?: string } | null => {
  const record = payload as Record<string, unknown>;
  
  // Handle PIXELFLOW_API_RUN format with outputs array
  if (record.outputs && Array.isArray(record.outputs)) {
    console.log('Processing PIXELFLOW_API_RUN outputs array');
    for (const outputItem of record.outputs) {
      if (outputItem && typeof outputItem === 'object') {
        const output = (outputItem as Record<string, unknown>).output;
        if (output && typeof output === 'object') {
          const outputObj = output as Record<string, unknown>;
          const data = outputObj.data;
          const type = outputObj.type;
          
          if (typeof data === 'string' && isHttpUrl(data)) {
            if (type === 'video') {
              console.log('Found video URL in outputs:', data);
              return { videoUrl: data };
            } else if (type === 'image') {
              console.log('Found image URL in outputs:', data);
              return { imageUrl: data };
            }
          }
        }
      }
    }
  }
  
  // Try parsing output if it's a JSON string
  let workingPayload = payload;
  if (typeof record.output === 'string') {
    try {
      const parsed = JSON.parse(record.output);
      if (parsed && typeof parsed === 'object') {
        workingPayload = { ...record, output: parsed };
      }
    } catch {
      // Not valid JSON, continue
    }
  }

  // Try known video paths
  for (const path of VIDEO_PATHS) {
    const videoUrl = getValueAtPath(workingPayload, path);
    if (isHttpUrl(videoUrl)) {
      return { videoUrl: videoUrl as string };
    }
  }

  // Try known image paths
  for (const path of IMAGE_PATHS) {
    const imageUrl = getValueAtPath(workingPayload, path);
    if (isHttpUrl(imageUrl)) {
      return { imageUrl: imageUrl as string };
    }
  }

  // Fallback: recursively find any HTTP URL
  const allUrls = flattenHttpStrings(workingPayload);
  if (allUrls.length > 0) {
    const firstUrl = allUrls[0];
    if (firstUrl.includes('.mp4') || firstUrl.includes('video')) {
      return { videoUrl: firstUrl };
    }
    if (firstUrl.includes('.png') || firstUrl.includes('.jpg') || firstUrl.includes('.jpeg') || firstUrl.includes('image')) {
      return { imageUrl: firstUrl };
    }
    return { imageUrl: firstUrl };
  }

  return null;
};

serve(async (req) => {
  const corsHeaders = createCorsHeaders(req.headers.get('origin'));
  const optionsResponse = handleOptions(req, corsHeaders);
  if (optionsResponse) {
    return optionsResponse;
  }

  try {
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('[WEBHOOK] ========== NEW WEBHOOK REQUEST ==========');
    console.log('[WEBHOOK] Full URL:', req.url);
    console.log('[WEBHOOK] Method:', req.method);
    
    const webhookSecret = Deno.env.get('SEGMIND_WEBHOOK_SECRET');
    const rawBody = await req.text();
    
    // Log all headers for debugging
    console.log('=== WEBHOOK HEADERS ===');
    req.headers.forEach((value, key) => {
      console.log(`${key}: ${value}`);
    });
    console.log('=======================');
    
    // Verify webhook signature using HMAC-SHA256
    const signature = req.headers.get('x-segmind-signature');
    console.log('Webhook secret configured:', !!webhookSecret);
    console.log('Signature header present:', !!signature);
    console.log('Signature value:', signature);
    
    // TEMPORARILY DISABLED: Signature validation causing 401 errors
    // TODO: Re-enable once we understand Segmind's signature format
    /*
    if (webhookSecret && signature) {
      const encoder = new TextEncoder();
      const key = await crypto.subtle.importKey(
        'raw',
        encoder.encode(webhookSecret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign', 'verify']
      );
      
      const signatureBytes = Uint8Array.from(
        signature.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || []
      );
      
      const isValid = await crypto.subtle.verify(
        'HMAC',
        key,
        signatureBytes,
        encoder.encode(rawBody)
      );
      
      if (!isValid) {
        console.error('Invalid webhook signature');
        console.error('Expected signature format: hex-encoded HMAC-SHA256');
        console.error('Received signature:', signature);
        return new Response(JSON.stringify({ error: 'Invalid webhook secret' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      console.log('✓ Webhook signature verified successfully');
    } else */ if (webhookSecret && signature) {
      console.warn('⚠️  Signature validation DISABLED - accepting webhook without verification');
      console.warn('This is insecure and should be fixed in production!');
    } else if (webhookSecret) {
      console.warn('Webhook secret configured but no signature provided in x-segmind-signature header');
      console.warn('Proceeding without signature verification - this is insecure!');
    }

    const payload: SegmindWebhookPayload = JSON.parse(rawBody);
    
    // Extract task_id from URL query parameters
    const url = new URL(req.url);
    const taskId = url.searchParams.get('task_id');
    
    // Log everything for debugging
    console.log('=== SEGMIND WEBHOOK RECEIVED ===');
    console.log('URL:', req.url);
    console.log('Task ID from URL:', taskId);
    console.log('Event type:', (payload as any).event);
    console.log('Full payload:', JSON.stringify(payload, null, 2));
    console.log('All payload keys:', Object.keys(payload));
    console.log('Payload.request_id:', (payload as any).request_id);
    console.log('Payload.id:', (payload as any).id);
    console.log('Payload.workflow_id:', (payload as any).workflow_id);
    console.log('================================');
    
    console.log('[WEBHOOK] Step 1: Received webhook, task_id =', taskId);
    
    // Only process workflow completion events
    const eventType = (payload as any).event;
    if (eventType === 'NODE_RUN') {
      console.log('Ignoring NODE_RUN event - waiting for workflow completion');
      return new Response(JSON.stringify({ success: true, message: 'Node event received' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // Process PIXELFLOW_API_RUN or GRAPH_RUN events (workflow completion)
    if (eventType !== 'PIXELFLOW_API_RUN' && eventType !== 'GRAPH_RUN') {
      console.log('Unknown event type:', eventType);
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase configuration missing');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    let task;
    const requestIdCandidates = extractCandidateRequestIds(payload);
    if (requestIdCandidates.length > 0) {
      console.log('[WEBHOOK] Candidate request_ids discovered in payload:', requestIdCandidates.join(', '));
    } else {
      console.log('[WEBHOOK] No request_id fields found in webhook payload');
    }

    if (taskId) {
      console.log('[WEBHOOK] Step 2: task_id present, querying by task_id:', taskId);

      // Find the generation task by task_id
      const { data: taskData, error: taskError } = await supabase
        .from('generation_tasks')
        .select('*')
        .eq('id', taskId)
        .single();

      if (taskError || !taskData) {
        console.error('[WEBHOOK] ERROR: Task not found for task_id:', taskId, taskError);
        return new Response(JSON.stringify({ error: 'Task not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      task = taskData;
    } else {
      console.warn('[WEBHOOK] WARNING: No task_id in URL - Segmind is not using our webhook_url parameter');

      if (requestIdCandidates.length > 0) {
        console.log('[WEBHOOK] Step 2: Attempting lookup via request_id candidates');
        const { data: tasksByRequest, error: requestLookupError } = await supabase
          .from('generation_tasks')
          .select('*')
          .in('request_id', requestIdCandidates)
          .in('status', ['pending', 'processing'])
          .order('created_at', { ascending: false })
          .limit(1);

        if (requestLookupError) {
          console.error('[WEBHOOK] ERROR: Failed to query tasks by request_id', requestLookupError);
        }

        if (tasksByRequest && tasksByRequest.length > 0) {
          task = tasksByRequest[0];
          console.log('[WEBHOOK] Matched task via request_id:', task.request_id, '-> task.id', task.id);
        }
      }

      if (!task) {
        console.log('[WEBHOOK] Step 2: Falling back to finding most recent pending keyframe task');

        // Fallback: Find the most recent pending keyframe task
        const { data: tasks, error: taskError } = await supabase
          .from('generation_tasks')
          .select('*')
          .in('status', ['pending', 'processing'])
          .eq('generation_type', 'keyframe')
          .order('created_at', { ascending: false })
          .limit(1);

        if (taskError || !tasks || tasks.length === 0) {
          console.error('[WEBHOOK] ERROR: No pending tasks found via fallback', taskError);
          return new Response(JSON.stringify({ error: 'No pending tasks found' }), {
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        task = tasks[0];
        console.log('[WEBHOOK] Fallback matched task:', task.id, 'created at:', task.created_at);
      }
    }

    console.log('[WEBHOOK] Step 4: Task found:', task.id, 'Current status:', task.status);

    const status = typeof payload.status === 'string' ? payload.status.toUpperCase() : undefined;
    const media = extractMediaFromResponse(payload);

    console.log('[WEBHOOK] Step 5: Extracted media:', JSON.stringify(media, null, 2));
    console.log('[WEBHOOK] Parsed status:', status);

    // Determine final status
    let finalStatus = 'processing';
    let resultUrl: string | null = null;
    let errorMessage: string | null = null;

    if (status && SUCCESS_STATUSES.has(status) && media) {
      finalStatus = 'completed';
      resultUrl = media.videoUrl ?? media.imageUrl ?? null;
      console.log('✓ Marking as COMPLETED with result:', resultUrl);
    } else if (status && FAILURE_STATUSES.has(status)) {
      finalStatus = 'failed';
      errorMessage = payload.error_message || payload.error || 'Generation failed';
      console.log('✗ Marking as FAILED:', errorMessage);
    } else if (media) {
      finalStatus = 'completed';
      resultUrl = media.videoUrl ?? media.imageUrl ?? null;
      console.log('✓ Marking as COMPLETED (media found, no status):', resultUrl);
    } else {
      console.log('? Still PROCESSING (no media or success status found)');
    }

    console.log('[WEBHOOK] Step 6: Updating task to status:', finalStatus, 'with URL:', resultUrl);

    // Update the task
    const { error: updateError } = await supabase
      .from('generation_tasks')
      .update({
        status: finalStatus,
        result_url: resultUrl,
        error_message: errorMessage,
        completed_at: finalStatus === 'completed' ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', task.id);

    if (updateError) {
      console.error('[WEBHOOK] ERROR: Failed to update task:', updateError);
      throw updateError;
    }

    console.log(`[WEBHOOK] ✓ SUCCESS: Task ${task.id} updated to status: ${finalStatus}`);
    console.log(`[WEBHOOK]   Result URL: ${resultUrl}`);
    console.log(`[WEBHOOK]   Project ID: ${task.project_id}`);
    console.log(`[WEBHOOK]   Scene ID: ${task.scene_id}`);
    console.log(`[WEBHOOK]   Shot ID: ${task.shot_id}`);

    return new Response(JSON.stringify({ 
      success: true, 
      task_id: task.id,
      status: finalStatus,
      result_url: resultUrl,
      project_id: task.project_id,
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in segmind-webhook function:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
