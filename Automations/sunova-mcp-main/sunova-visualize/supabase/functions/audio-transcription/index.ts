import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1?no-check';
import { createCorsHeaders, handleOptions } from "../_shared/cors.ts";

serve(async (req) => {
  const corsHeaders = createCorsHeaders(req.headers.get("origin"));
  const optionsResponse = handleOptions(req, corsHeaders);
  if (optionsResponse) {
    return optionsResponse;
  }

  try {
    const { audio, projectId } = await req.json();
    
    if (!audio) {
      throw new Error('No audio data provided');
    }

    console.log('Starting transcription for project:', projectId);

    // Get user ID from JWT
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Verify JWT and get user
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Invalid authorization token');
    }

    console.log('Processing transcription for user:', user.id);

    // Create file hash for caching
    const encoder = new TextEncoder();
    const data = encoder.encode(audio.substring(0, 1000)); // Use first 1000 chars for hash
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const fileHash = Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    // Check if we already have this transcription cached for this user
    const { data: cachedData } = await supabase
      .from('audio_transcription_cache')
      .select('transcription, duration')
      .eq('file_hash', fileHash)
      .eq('user_id', user.id)
      .single();

    if (cachedData) {
      console.log('Using cached transcription');
      return new Response(
        JSON.stringify({ 
          text: cachedData.transcription,
          duration: cachedData.duration,
          cached: true 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Decode base64 audio
    console.log('Decoding base64 audio, length:', audio.length);
    const binaryString = atob(audio);
    const binaryAudio = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      binaryAudio[i] = binaryString.charCodeAt(i);
    }
    
    // Prepare form data
    const formData = new FormData();
    const blob = new Blob([binaryAudio], { type: 'audio/mpeg' });
    formData.append('file', blob, 'audio.mp3');
    formData.append('model', 'whisper-1');
    formData.append('language', 'en');
    formData.append('response_format', 'verbose_json');
    formData.append('prompt', 'This is a song with lyrics. Please transcribe all the sung words and lyrics accurately.');

    console.log('Sending to OpenAI Whisper API...');

    // Send to OpenAI
    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${errorText}`);
    }

    const result = await response.json();
    console.log('Transcription completed, text length:', result.text?.length || 0);

    // Cache the result with user_id
    const cacheData = {
      file_hash: fileHash,
      file_name: `project_${projectId}_audio`,
      file_size: binaryAudio.length,
      transcription: result.text || '',
      duration: result.duration || 0,
      user_id: user.id
    };

    await supabase
      .from('audio_transcription_cache')
      .insert(cacheData)
      .select()
      .single();

    return new Response(
      JSON.stringify({ 
        text: result.text || '',
        duration: result.duration || 0,
        segments: result.segments || [],
        cached: false
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Transcription error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});