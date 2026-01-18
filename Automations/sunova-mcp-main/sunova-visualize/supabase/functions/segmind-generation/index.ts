import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1?no-check';
import { createCorsHeaders, handleOptions } from "../_shared/cors.ts";

type GenerationMode = 'scene_image' | 'shot_video';
type GenerationType = 'video' | 'keyframe';

interface GenerationRequest {
  mode?: GenerationMode;
  requestId?: string;
  projectId?: string;
  sceneId?: string;
  shotId?: string;
  sceneIndex?: number;
  video_prompt: string;
  Resolution: 'FHD' | '2k' | '4k';
  shot_character?: string | string[];
  scene_character?: string | string[];
  shot_duration: 5 | 10;
  shot_audio?: string;
  image_prompt: string;
  shot_keyframe?: string;
  generation_type?: GenerationType;
  first_shot_video?: string;
}

interface PollRequest {
  request_id: string;
}

interface WorkflowResponse {
  poll_url?: string;
  request_id?: string;
  status?: string;
  [key: string]: unknown;
}

interface CompletedResponse {
  videoUrl?: string;
  imageUrl?: string;
  raw: unknown;
}

const SUCCESS_STATUSES = new Set(['COMPLETED', 'SUCCEEDED', 'SUCCESS']);
const FAILURE_STATUSES = new Set(['FAILED', 'ERROR']);

const IMAGE_GENERATION_COST = 0.25;
const VIDEO_GENERATION_COST = 1.0;

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

    if (typeof current === 'object' && segment in (current as Record<string, unknown>)) {
      return (current as Record<string, unknown>)[segment];
    }

    return undefined;
  }, value);
};

const isHttpUrl = (value: unknown): value is string => {
  return typeof value === 'string' && /^https?:\/\//i.test(value);
};

const flattenHttpStrings = (value: unknown): string[] => {
  if (isHttpUrl(value)) {
    return [value];
  }

  if (Array.isArray(value)) {
    return value.flatMap(flattenHttpStrings);
  }

  if (value && typeof value === 'object') {
    return Object.values(value).flatMap(flattenHttpStrings);
  }

  return [];
};

const extractMediaFromResponse = (payload: unknown): { videoUrl?: string; imageUrl?: string } | null => {
  if (!payload || typeof payload !== 'object') {
    return null;
  }

  const record = payload as Record<string, unknown>;
  let videoUrl: string | undefined;
  let imageUrl: string | undefined;

  // Check for webhook format: outputs[0].output.data
  if (record.outputs && Array.isArray(record.outputs) && record.outputs.length > 0) {
    const firstOutput = record.outputs[0];
    if (firstOutput && typeof firstOutput === 'object') {
      const outputObj = firstOutput as Record<string, unknown>;
      if (outputObj.output && typeof outputObj.output === 'object') {
        const output = outputObj.output as Record<string, unknown>;
        const data = output.data;
        const type = output.type;
        
        if (typeof data === 'string' && isHttpUrl(data)) {
          if (type === 'image') {
            imageUrl = data;
          } else if (type === 'video') {
            videoUrl = data;
          }
        }
      }
    }
  }

  // If we found media from webhook format, return it
  if (videoUrl || imageUrl) {
    return { videoUrl, imageUrl };
  }

  // Check for direct scene_image/video fields (v2 workflow format)
  if (record.scene_image && isHttpUrl(record.scene_image)) {
    imageUrl = record.scene_image as string;
  }
  if (record.scene_video && isHttpUrl(record.scene_video)) {
    videoUrl = record.scene_video as string;
  }

  // If we found media directly, return it
  if (videoUrl || imageUrl) {
    return { videoUrl, imageUrl };
  }

  // Next, try to parse the output field if it's a JSON string (Segmind format)
  if (record.output && typeof record.output === 'string') {
    try {
      const parsedOutput = JSON.parse(record.output);
      if (Array.isArray(parsedOutput)) {
        for (const item of parsedOutput) {
          if (item && typeof item === 'object') {
            const keyname = (item as Record<string, unknown>).keyname;
            const value = (item as Record<string, unknown>).value;
            
            if (value && typeof value === 'object') {
              const valueObj = value as Record<string, unknown>;
              const data = valueObj.data;
              
              if (typeof data === 'string' && isHttpUrl(data)) {
                if (keyname === 'scene_image' || keyname === 'image') {
                  imageUrl = data;
                } else if (keyname === 'video' || keyname === 'scene_video') {
                  videoUrl = data;
                }
              }
            }
          }
        }
      }
    } catch (e) {
      console.log('Failed to parse output as JSON:', e);
    }
  }

  // If we found media from the output field, return it
  if (videoUrl || imageUrl) {
    return { videoUrl, imageUrl };
  }

  // Otherwise, fall back to the original path-based extraction
  for (const path of VIDEO_PATHS) {
    const candidate = getValueAtPath(payload, path);
    if (isHttpUrl(candidate)) {
      videoUrl = candidate;
      break;
    }
  }

  for (const path of IMAGE_PATHS) {
    const candidate = getValueAtPath(payload, path);
    if (isHttpUrl(candidate)) {
      imageUrl = candidate;
      break;
    }
  }

  if (!videoUrl || !imageUrl) {
    const urls = flattenHttpStrings(payload);

    if (!videoUrl) {
      videoUrl = urls.find((url) => /\.(mp4|mov|webm)(\?|$)/i.test(url));
    }

    if (!imageUrl) {
      imageUrl = urls.find((url) => /\.(png|jpe?g|webp|gif)(\?|$)/i.test(url));
    }
  }

  if (!videoUrl && !imageUrl) {
    return null;
  }

  return { videoUrl, imageUrl };
};

const cleanPayload = (payload: Record<string, unknown>) =>
  Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined && value !== null)
  );

// Resolve workflow URL based on generation type
const resolveWorkflowUrl = (generationType: GenerationType, isFirstShot: boolean = false): string => {
  const sceneImageWorkflow = Deno.env.get('SEGMIND_SCENE_IMAGE_WORKFLOW_URL');
  const firstShotWorkflow = Deno.env.get('SEGMIND_FIRST_SHOT_WORKFLOW_URL');
  const remainingShotWorkflow = Deno.env.get('SEGMIND_REMAINING_SHOT_WORKFLOW_URL');
  
  // For scene images/keyframes
  if (generationType === 'keyframe') {
    if (!sceneImageWorkflow) {
      throw new Error('SEGMIND_SCENE_IMAGE_WORKFLOW_URL not configured');
    }
    return sceneImageWorkflow;
  }
  
  // For first shots of scenes
  if (isFirstShot) {
    if (!firstShotWorkflow) {
      throw new Error('SEGMIND_FIRST_SHOT_WORKFLOW_URL not configured');
    }
    return firstShotWorkflow;
  }

  // For remaining shots
  if (!remainingShotWorkflow) {
    throw new Error('SEGMIND_REMAINING_SHOT_WORKFLOW_URL not configured');
  }
  return remainingShotWorkflow;
};

async function pollForCompletion(pollUrl: string, segmindApiKey: string, maxAttempts = 90, delayMs = 3000): Promise<CompletedResponse> {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    console.log(`Polling attempt ${attempt + 1}/${maxAttempts}`);

    const response = await fetch(pollUrl, {
      headers: {
        'x-api-key': segmindApiKey,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Polling failed: ${response.status}`);
    }

    const data = await response.json();
    console.log('Poll response:', data);

    const status = typeof data.status === 'string' ? data.status.toUpperCase() : undefined;
    const media = extractMediaFromResponse(data);

    if (media && (!status || SUCCESS_STATUSES.has(status))) {
      return {
        ...media,
        raw: data,
      };
    }

    if (status && FAILURE_STATUSES.has(status)) {
      // Extract error from Segmind response - could be string or nested object
      let errorMsg = 'Unknown error';
      if (data.error_message) {
        if (typeof data.error_message === 'string') {
          errorMsg = data.error_message;
        } else if (typeof data.error_message === 'object') {
          errorMsg = data.error_message.error_message || data.error_message.details || data.error_message.error || JSON.stringify(data.error_message);
        }
      } else if (data.error) {
        errorMsg = data.error;
      } else if (data.message) {
        errorMsg = data.message;
      }
      throw new Error(`Generation failed: ${errorMsg}`);
    }

    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }

  throw new Error('Generation timed out after maximum polling attempts');
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

    const url = new URL(req.url);
    const pathname = url.pathname;

    if (pathname.includes('/poll') && req.method === 'POST') {
      const { request_id }: PollRequest = await req.json();
      const pollUrl = `https://api.segmind.com/requests/${request_id}`;

      try {
        const result = await pollForCompletion(pollUrl, segmindApiKey, 1);
        return new Response(JSON.stringify({
          status: 'COMPLETED',
          video_url: result.videoUrl ?? null,
          image_url: result.imageUrl ?? null,
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (_error) {
        return new Response(JSON.stringify({
          status: 'PROCESSING',
          message: 'Still generating...'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Input validation schema
    const GenerationRequestSchema = z.object({
      mode: z.enum(['scene_image', 'shot_video']).optional(),
      requestId: z.string().optional(), // Accept any string (scene IDs may not be UUIDs)
      projectId: z.string().uuid().optional(),
      sceneId: z.string().max(200).optional(),
      shotId: z.string().max(200).optional(),
      sceneIndex: z.number().int().min(0).optional(),
      video_prompt: z.string().min(1).max(5000),
      Resolution: z.enum(['FHD', '2k', '4k']),
      shot_character: z.union([z.string(), z.array(z.string())]).optional(),
      scene_character: z.union([z.string(), z.array(z.string())]).optional(),
      shot_duration: z.union([z.literal(5), z.literal(10)]),
      shot_audio: z.string().optional(), // Accept any string (empty for keyframes, URL for videos)
      image_prompt: z.string().min(1).max(5000),
      shot_keyframe: z.string().url().optional(),
      generation_type: z.enum(['video', 'keyframe']).optional(),
      first_shot_video: z.string().url().optional(),
    });

    const validationResult = GenerationRequestSchema.safeParse(await req.json());
    
    if (!validationResult.success) {
      console.error('Validation error:', validationResult.error);
      return new Response(
        JSON.stringify({ error: 'Invalid input', details: validationResult.error.issues }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body = validationResult.data;
    console.log('Generation request:', body);

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase configuration missing');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const authHeader = req.headers.get('authorization');

    if (!authHeader) {
      return new Response(JSON.stringify({ success: false, error: 'Authentication required' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: authData, error: authError } = await supabase.auth.getUser(token);

    if (authError || !authData?.user?.id) {
      console.error('Failed to authenticate user', authError);
      return new Response(JSON.stringify({ success: false, error: 'Authentication required' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const userId = authData.user.id;
    const userEmail = authData.user.email ?? null;

    const { data: existingProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('id, credit_balance, is_admin, subscription_tier')
      .eq('id', userId)
      .maybeSingle();

    if (profileError) {
      throw new Error(`Failed to load user profile: ${profileError.message}`);
    }

    let profile = existingProfile;

    if (!profile) {
      const { data: createdProfile, error: createProfileError } = await supabase
        .from('user_profiles')
        .insert({
          id: userId,
          user_email: userEmail ?? '',
        })
        .select('id, credit_balance, is_admin, subscription_tier')
        .single();

      if (createProfileError) {
        throw new Error(`Failed to create user profile: ${createProfileError.message}`);
      }

      profile = createdProfile;
    }

    const inferredMode: GenerationMode = body.mode ?? (body.generation_type === 'keyframe' ? 'scene_image' : 'shot_video');
    const generationType: GenerationType = body.generation_type === 'keyframe' || inferredMode === 'scene_image'
      ? 'keyframe'
      : 'video';

    const baseCost = generationType === 'keyframe' ? IMAGE_GENERATION_COST : VIDEO_GENERATION_COST;
    const isAdmin = Boolean(profile?.is_admin) || profile?.subscription_tier === 'admin';
    const requiredCredits = isAdmin ? 0 : baseCost;

    let spendTransaction: { id: string; balance_after: number } | null = null;
    let remainingCredits: number | null = profile?.credit_balance ?? null;

    if (requiredCredits > 0) {
      const { data: spendData, error: spendError } = await supabase.rpc('spend_credits', {
        p_user_id: userId,
        p_amount: requiredCredits,
        p_reason: generationType,
        p_metadata: {
          projectId: body.projectId ?? null,
          shotId: body.shotId ?? body.requestId ?? null,
          resolution: body.Resolution,
        },
      });

      if (spendError) {
        console.error('Failed to spend credits', spendError);
        const message = `${spendError.message ?? ''} ${spendError.details ?? ''}`;
        if (message.includes('INSUFFICIENT_CREDITS')) {
          return new Response(JSON.stringify({ success: false, error: 'Insufficient credits' }), {
            status: 402,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        throw new Error(`Failed to spend credits: ${spendError.message ?? 'Unknown error'}`);
      }

      spendTransaction = spendData as unknown as { id: string; balance_after: number };
      remainingCredits = spendTransaction?.balance_after ?? remainingCredits;
    }

    // Determine which workflow to use
    const isFirstShot = generationType === 'video' && body.sceneIndex === 0;
    
    const workflowUrl = resolveWorkflowUrl(generationType, isFirstShot);
    if (!workflowUrl) {
      throw new Error('Segmind workflow URL not configured');
    }

    // Create pending task record
    const { data: taskData, error: taskError } = await supabase
      .from('generation_tasks')
      .insert({
        project_id: body.projectId,
        shot_id: body.shotId ?? body.requestId ?? crypto.randomUUID(),
        scene_id: body.sceneId ?? body.shotId ?? crypto.randomUUID(),
        request_id: body.requestId ?? crypto.randomUUID(),
        generation_type: generationType,
        status: 'pending',
      })
      .select()
      .single();

    if (taskError) {
      console.error('Failed to create generation task record:', taskError);
    }

    // Build payload based on generation type and shot position
    let requestPayload: Record<string, unknown>;
    
    // Add webhook URL with task_id for webhook matching
    const webhookUrl = taskData?.id 
      ? `https://yggkcvlrhelueulbumqe.supabase.co/functions/v1/segmind-webhook?task_id=${taskData.id}`
      : undefined;
    
    if (generationType === 'keyframe') {
      // Workflow 1: Scene image generation
      const characterImages = Array.isArray(body.scene_character) 
        ? body.scene_character.filter(Boolean)
        : body.scene_character 
          ? [body.scene_character] 
          : [];
      
      const basePayload: Record<string, unknown> = {
        scene_image_prompt: body.image_prompt,
      };
      
      // New workflow expects character_images as string or array
      if (characterImages.length > 0) {
        basePayload.character_images = characterImages.length === 1 ? characterImages[0] : characterImages;
      }
      
      if (webhookUrl) {
        basePayload.webhook_url = webhookUrl;
      }
      
      requestPayload = cleanPayload(basePayload);
    } else if (isFirstShot) {
      // Workflow 2: First shot of scene - new workflow
      requestPayload = cleanPayload({
        shot_video_prompt: body.video_prompt,
        shot_audio: body.shot_audio ?? '',
        scene_image: body.shot_keyframe ?? '',
        shot_image_prompt: body.image_prompt,
        ...(webhookUrl ? { webhook_url: webhookUrl } : {}),
      });
    } else {
      // Workflow 3: Remaining shots - new workflow
      requestPayload = cleanPayload({
        shot_video_prompt: body.video_prompt,
        first_shot_video: body.first_shot_video ?? '',
        scene_image: body.shot_keyframe ?? '',
        ...(webhookUrl ? { webhook_url: webhookUrl } : {}),
      });
    }

    console.log('Calling Segmind workflow API:', {
      url: workflowUrl,
      payload: requestPayload,
    });

    const startTime = Date.now();

    try {
      const response = await fetch(workflowUrl, {
        method: 'POST',
        headers: {
          'x-api-key': segmindApiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestPayload),
      });

      if (!response.ok) {
        let errorData: unknown = null;
        try {
          errorData = await response.json();
        } catch (_jsonError) {
          errorData = await response.text();
        }
        console.error('Segmind API error:', errorData);
        const message = typeof errorData === 'object' && errorData && 'message' in errorData
          ? String((errorData as Record<string, unknown>).message)
          : 'Unknown error';
        throw new Error(`Segmind API error: ${message}`);
      }

      const workflowResponse: WorkflowResponse = await response.json();
      console.log('Workflow response:', workflowResponse);

      // Update task with request_id and poll_url
      const requestId = workflowResponse.request_id ?? body.requestId ?? body.shotId ?? body.sceneId ?? crypto.randomUUID();
      if (taskData?.id) {
        await supabase
          .from('generation_tasks')
          .update({
            request_id: requestId,
            poll_url: workflowResponse.poll_url ?? null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', taskData.id);
      }

      let completedResult: CompletedResponse | null = null;
      const immediateMedia = extractMediaFromResponse(workflowResponse);
      const responseStatus = typeof workflowResponse.status === 'string'
        ? workflowResponse.status.toUpperCase()
        : undefined;

      if (immediateMedia && (!responseStatus || SUCCESS_STATUSES.has(responseStatus))) {
        completedResult = {
          ...immediateMedia,
          raw: workflowResponse,
        };
      } else if (webhookUrl) {
        // Webhook configured - return immediately and let webhook handle completion
        console.log('Webhook configured, returning immediately. Task will be updated via webhook.');
        return new Response(JSON.stringify({
          success: true,
          cost: requiredCredits,
          remaining_credits: remainingCredits,
          request_id: requestId,
          task_id: taskData?.id ?? null,
          status: 'processing',
          message: 'Generation started, will be completed via webhook'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } else if (workflowResponse.poll_url) {
        completedResult = await pollForCompletion(
          workflowResponse.poll_url, 
          segmindApiKey,
          40, // 2 minutes max (40 attempts × 3 seconds) to stay under edge function timeout
          3000 // 3 second intervals
        );
      } else {
        throw new Error('Segmind response did not include webhook_url or poll_url or immediate media');
      }

      const duration = Date.now() - startTime;

      // Update task as completed
      if (taskData?.id) {
        await supabase
          .from('generation_tasks')
          .update({
            status: 'completed',
            completed_at: new Date().toISOString(),
            result_url: completedResult?.videoUrl ?? completedResult?.imageUrl ?? null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', taskData.id);
      }

      try {
        const promptPieces = [body.video_prompt, body.image_prompt]
          .map((piece) => (typeof piece === 'string' ? piece.trim() : ''))
          .filter(Boolean);
        const prompt = promptPieces.join(' | ');
        const promptTokens = Math.ceil(prompt.length / 4);
        const endpoint = workflowUrl.replace('https://api.segmind.com/', '');

        await supabase.rpc('log_api_request', {
          p_user_id: userId,
          p_user_email: userEmail,
          p_project_id: body.projectId ?? null,
          p_project_name: null,
          p_api_type: 'segmind',
          p_generation_type: generationType,
          p_endpoint: endpoint,
          p_method: 'POST',
          p_prompt: prompt,
          p_prompt_tokens: promptTokens,
          p_completion_tokens: 0,
          p_total_tokens: promptTokens,
          p_raw_request: {
            url: workflowUrl,
            payload: requestPayload,
          },
          p_raw_response: completedResult?.raw ?? null,
          p_status_code: 200,
          p_success: true,
          p_error_message: null,
          p_duration_ms: duration,
          p_cost_usd: requiredCredits,
        });

        console.log('API request logged successfully');
      } catch (logError) {
        console.error('Error logging API request:', logError);
      }

      const result = {
        success: true,
        cost: requiredCredits,
        remaining_credits: remainingCredits,
        duration_ms: duration,
        request_id: requestId,
        task_id: taskData?.id ?? null,
        video_url: completedResult?.videoUrl ?? null,
        image_url: completedResult?.imageUrl ?? null,
      };

      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (generationError) {
      // Update task as failed or timeout
      if (taskData?.id) {
        const isTimeout = generationError instanceof Error && generationError.message.includes('timed out');
        await supabase
          .from('generation_tasks')
          .update({
            status: isTimeout ? 'timeout' : 'failed',
            error_message: generationError instanceof Error ? generationError.message : 'Unknown error',
            updated_at: new Date().toISOString(),
          })
          .eq('id', taskData.id);
      }

      if (spendTransaction) {
        try {
          await supabase.rpc('add_credits', {
            p_user_id: userId,
            p_amount: requiredCredits,
            p_type: 'refund',
            p_reason: 'segmind_generation_failed',
            p_metadata: {
              projectId: body.projectId ?? null,
              shotId: body.shotId ?? body.requestId ?? null,
              generationType,
              original_transaction_id: spendTransaction.id,
            },
          });
        } catch (refundError) {
          console.error('Failed to refund credits after generation failure', refundError);
        }
      }

      throw generationError;
    }

  } catch (error) {
    console.error('Error in segmind-generation function:', error);

    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error instanceof Error ? error.stack : String(error),
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
