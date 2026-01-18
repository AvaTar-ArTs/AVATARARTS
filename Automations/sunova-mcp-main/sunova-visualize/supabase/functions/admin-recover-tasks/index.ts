import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.58.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const segmindApiKey = Deno.env.get('SEGMIND_API_KEY')!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify admin access
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check if user is admin
    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .maybeSingle();

    if (!roleData) {
      return new Response(JSON.stringify({ error: 'Admin access required' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Admin recovery initiated by:', user.email);

    // Fetch all pending or timeout tasks
    const { data: tasks, error: fetchError } = await supabase
      .from('generation_tasks')
      .select('*')
      .in('status', ['pending', 'timeout'])
      .order('created_at', { ascending: true })
      .limit(100);

    if (fetchError) {
      throw fetchError;
    }

    console.log(`Found ${tasks?.length || 0} tasks to recover`);

    const results = {
      total: tasks?.length || 0,
      recovered: 0,
      failed: 0,
      details: [] as any[],
    };

    // Process each task
    for (const task of tasks || []) {
      try {
        console.log(`Checking task ${task.id} with request_id ${task.request_id}`);

        // Poll Segmind API for task status
        const pollResponse = await fetch(`https://api.segmind.com/v1/status/${task.request_id}`, {
          method: 'GET',
          headers: {
            'x-api-key': segmindApiKey,
          },
        });

        if (!pollResponse.ok) {
          console.error(`Failed to poll task ${task.id}: ${pollResponse.status}`);
          results.details.push({
            task_id: task.id,
            request_id: task.request_id,
            status: 'poll_failed',
            error: `HTTP ${pollResponse.status}`,
          });
          results.failed++;
          continue;
        }

        const pollData = await pollResponse.json();
        console.log(`Task ${task.id} status from Segmind:`, pollData.status);

        let newStatus = task.status;
        let resultUrl = task.result_url;
        let errorMessage = task.error_message;

        // Handle different statuses
        if (pollData.status === 'COMPLETED' && pollData.output) {
          newStatus = 'completed';
          
          // Extract media URL from output
          if (Array.isArray(pollData.output) && pollData.output.length > 0) {
            resultUrl = pollData.output[0];
          } else if (typeof pollData.output === 'string') {
            resultUrl = pollData.output;
          } else if (pollData.output.url) {
            resultUrl = pollData.output.url;
          }

          // Download and store the media file
          if (resultUrl) {
            try {
              console.log(`Downloading media for task ${task.id} from ${resultUrl}`);
              
              const mediaResponse = await fetch(resultUrl);
              if (mediaResponse.ok) {
                const blob = await mediaResponse.blob();
                const arrayBuffer = await blob.arrayBuffer();
                const fileData = new Uint8Array(arrayBuffer);
                
                // Determine file extension
                const contentType = mediaResponse.headers.get('content-type');
                const extension = contentType?.includes('video') ? 'mp4' : 'jpg';
                
                // Upload to storage
                const storagePath = `${task.project_id}/${task.scene_id}_${task.shot_id}_${task.generation_type}.${extension}`;
                
                const { error: uploadError } = await supabase.storage
                  .from('shot-media')
                  .upload(storagePath, fileData, {
                    contentType: contentType || 'image/jpeg',
                    upsert: true,
                  });

                if (uploadError) {
                  console.error(`Failed to upload media for task ${task.id}:`, uploadError);
                } else {
                  console.log(`Successfully uploaded media for task ${task.id}`);
                  
                  // Get public URL
                  const { data: urlData } = supabase.storage
                    .from('shot-media')
                    .getPublicUrl(storagePath);
                  
                  resultUrl = urlData.publicUrl;

                  // Update project storyboard with the media URL
                  const { data: project } = await supabase
                    .from('projects')
                    .select('storyboard')
                    .eq('id', task.project_id)
                    .single();

                  if (project?.storyboard) {
                    const storyboard = project.storyboard as any;
                    
                    // Find and update the shot
                    if (storyboard.scenes) {
                      for (const scene of storyboard.scenes) {
                        if (scene.id === task.scene_id) {
                          const shot = scene.shots?.find((s: any) => s.id === task.shot_id);
                          if (shot) {
                            if (task.generation_type === 'image') {
                              shot.imageUrl = resultUrl;
                            } else if (task.generation_type === 'video') {
                              shot.videoUrl = resultUrl;
                            }
                            
                            // Update the project
                            await supabase
                              .from('projects')
                              .update({ storyboard })
                              .eq('id', task.project_id);
                            
                            console.log(`Updated storyboard for task ${task.id}`);
                          }
                        }
                      }
                    }
                  }
                }
              }
            } catch (downloadError) {
              console.error(`Error downloading/storing media for task ${task.id}:`, downloadError);
            }
          }

          results.recovered++;
          results.details.push({
            task_id: task.id,
            request_id: task.request_id,
            status: 'recovered',
            result_url: resultUrl,
          });
        } else if (pollData.status === 'FAILED') {
          newStatus = 'failed';
          errorMessage = pollData.error || 'Generation failed';
          results.failed++;
          results.details.push({
            task_id: task.id,
            request_id: task.request_id,
            status: 'failed',
            error: errorMessage,
          });
        } else if (pollData.status === 'PENDING' || pollData.status === 'IN_PROGRESS') {
          // Still processing, update to pending
          newStatus = 'pending';
          results.details.push({
            task_id: task.id,
            request_id: task.request_id,
            status: 'still_pending',
          });
        }

        // Update task in database
        await supabase
          .from('generation_tasks')
          .update({
            status: newStatus,
            result_url: resultUrl,
            error_message: errorMessage,
            retrieved: newStatus === 'completed',
            completed_at: newStatus === 'completed' ? new Date().toISOString() : null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', task.id);

        console.log(`Updated task ${task.id} to status: ${newStatus}`);
      } catch (taskError) {
        console.error(`Error processing task ${task.id}:`, taskError);
        results.failed++;
        results.details.push({
          task_id: task.id,
          request_id: task.request_id,
          status: 'error',
          error: taskError instanceof Error ? taskError.message : String(taskError),
        });
      }
    }

    console.log('Recovery complete:', results);

    return new Response(JSON.stringify(results), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in admin-recover-tasks:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : String(error) }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
