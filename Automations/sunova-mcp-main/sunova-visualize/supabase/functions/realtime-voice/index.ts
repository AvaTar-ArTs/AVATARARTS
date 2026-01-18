import "https://deno.land/x/xhr@0.1.0/mod.ts";

// @ts-ignore: Deno global is available in Supabase Edge Functions
declare const Deno: any;
import { createCorsHeaders, handleOptions } from "../_shared/cors.ts";

interface SongData {
  tempo?: number;
  key?: string;
  genre?: string;
  mood?: string;
  lyrics?: string;
}

type ConversationRole = 'user' | 'assistant';

interface ConversationHistoryItem {
  type: ConversationRole;
  content: string;
}

// Handle text-based conversation with OpenAI
async function handleTextConversation(
  openAIKey: string,
  songData: SongData | null,
  message: string,
  conversationHistory: ConversationHistoryItem[] | undefined,
  corsHeaders: Record<string, string>,
) {
  console.log('🔥 Processing text conversation...');
  
  // Build instructions for text mode
  let instructions = "";
  const isFallbackData = songData?.tempo === 120 && songData?.key === "C" && songData?.genre === "Unknown";
  
  if (isFallbackData || !songData) {
    instructions = `You are a hip and trendy music video director that all the artists are dying to work with. You are fun, upbeat, use gen z language while keeping it still understandable by any age that is familiar with smartphones.

Your task is to help users come up with concepts for a music video, or to flush out the idea they already have. Be supportive, extremely creative, but also aware of the limitations of using AI image-to-video models and their capabilities since that is how the music video will be created.

The goal is to provide ONLY a high-level narrative concept with a clear beginning, middle, and end. Do NOT go into individual shots, camera movements, wardrobe, editing, or color grading. Stop once the narrative arc is fully described. At the very end of your response, write: [END OF CONCEPT].

If the app lets you know that the song's tempo, key, genre, or lyrics changed, acknowledge the update briefly and rely on those new values.

I wasn't able to access the song analysis data, so please ask the user to provide their lyrics or ideas to get started.`;
  } else {
    instructions = `You are a hip and trendy music video director that all the artists are dying to work with. You are fun, upbeat, use gen z language while keeping it still understandable by any age that is familiar with smartphones.

Your task is to help users come up with concepts for a music video, or to flush out the idea they already have. Be supportive, extremely creative, but also aware of the limitations of using AI image-to-video models and their capabilities since that is how the music video will be created.

The goal is to provide ONLY a high-level narrative concept with a clear beginning, middle, and end. Do NOT go into individual shots, camera movements, wardrobe, editing, or color grading. Stop once the narrative arc is fully described. At the very end of your response, write: [END OF CONCEPT].

The song is a song the user wrote so keep that in mind. Here are the details of the song:
- Tempo: ${songData.tempo}BPM
- Key: ${songData.key}
- Genre: ${songData.genre}
- Mood: ${songData.mood}
- Lyrics: ${songData.lyrics}

If the app lets you know that the song's tempo, key, genre, or lyrics changed, acknowledge the update briefly and rely on those new values.

The idea is to come up with a concept the user likes, that best tells the story their lyrics are trying to get across. Keep in mind the genre and industry norms when making a music video of the genre. e.g. Pop songs, fun, upbeat, faster edits, vs a ballad or country song might have slower longer drawn out shots.`;
  }

  // Build messages array for OpenAI
  const messages = [
    { role: "system", content: instructions }
  ];

  // Add conversation history
  const history = Array.isArray(conversationHistory) ? conversationHistory : [];

  for (const historyMsg of history) {
    if (!historyMsg || (historyMsg.type !== 'user' && historyMsg.type !== 'assistant') || typeof historyMsg.content !== 'string') {
      continue;
    }
    if (historyMsg.type === 'user') {
      messages.push({ role: "user", content: historyMsg.content });
    } else if (historyMsg.type === 'assistant') {
      messages.push({ role: "assistant", content: historyMsg.content });
    }
  }

  // Add current message
  messages.push({ role: "user", content: message });

  console.log('🔥 Sending to OpenAI Chat Completions API...');

  // Call OpenAI Chat Completions API
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4.1-2025-04-14',
      messages: messages,
      stream: true
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('🔥 OpenAI Chat API error:', response.status, errorText);
    throw new Error(`OpenAI Chat API error: ${response.status} ${errorText}`);
  }

  // Create a streaming response
  const stream = new ReadableStream({
    async start(controller) {
      const reader = response.body!.getReader();
      const decoder = new TextDecoder();

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ') && line !== 'data: [DONE]') {
              try {
                const data = JSON.parse(line.slice(6));
                const content = data.choices?.[0]?.delta?.content;
                if (content) {
                  // Check for sentinel
                  if (content.includes("[END OF CONCEPT]")) {
                    const clean = content.replace("[END OF CONCEPT]", "").trim();
                    const eventData = JSON.stringify({
                      type: 'content',
                      content: clean
                    });
                    controller.enqueue(new TextEncoder().encode(`data: ${eventData}\n\n`));
                    controller.close(); // stop streaming once concept ends
                    return;
                  }

                  // Send content as server-sent event
                  const eventData = JSON.stringify({
                    type: 'content',
                    content: content
                  });
                  controller.enqueue(new TextEncoder().encode(`data: ${eventData}\n\n`));
                }
              } catch (e) {
                // Skip invalid JSON
              }
            }
          }
        }
      } catch (error) {
        console.error('🔥 Stream error:', error);
        controller.error(error);
      } finally {
        controller.close();
      }
    }
  });

  return new Response(stream, {
    headers: {
      ...corsHeaders,
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    }
  });
}

Deno.serve(async (req: Request) => {
  console.log('🔥 Edge function called with method:', req.method);
  console.log('🔥 Headers:', Object.fromEntries(req.headers.entries()));
  console.log('🔥 URL:', req.url);

  const corsHeaders = createCorsHeaders(req.headers.get('origin'));
  const optionsResponse = handleOptions(req, corsHeaders);

  // Handle CORS preflight requests
  if (optionsResponse) {
    console.log('🔥 Handling CORS preflight request');
    return optionsResponse;
  }

  // Handle client secret generation for OpenAI Realtime API OR text chat
  if (req.method === 'POST') {
    try {
      const openAIKey = Deno.env.get('OPENAI_API_KEY');
      if (!openAIKey) {
        throw new Error('OPENAI_API_KEY environment variable is not set');
      }

      // Get request data
      const requestBody = await req.json();
      const { songData, textMode, message, conversationHistory } = requestBody;
      console.log('🔥 Full request body:', requestBody);
      console.log('🔥 Received song data:', songData);
      
      // Handle text-based conversation
      if (textMode && message) {
        console.log('🔥 Handling text conversation mode');
        return await handleTextConversation(openAIKey, songData, message, conversationHistory, corsHeaders);
      }

      console.log('🔥 Creating OpenAI client secret...');
      
      // Build instructions based on song data
      let instructions = "";
      
      // Check for fallback data indicators
      const isFallbackData = songData?.tempo === 120 && songData?.key === "C" && songData?.genre === "Unknown";
      
      if (isFallbackData || !songData) {
        instructions = `You are a hip and trendy music video director that all the artists are dying to work with. You are fun, upbeat, use gen z language while keeping it still understandable by any age that is familiar with smartphones. You are speaking out loud so speak using natural conversational language. 

IMPORTANT: You do NOT have access to the user's camera or any visual input. You cannot see the user or their environment. Only respond to what they say through audio.

Your task is to help users come up with concepts for a music video, or to flush out the idea they already have. Be supportive, extremely creative, but also aware of the limitations of using AI image-to-video models and their capabilities since that is how the music video will be created. 

I wasn't able to access the song analysis data, so please ask the user to provide their lyrics or ideas to get started.`;
      } else {
        instructions = `You are a hip and trendy music video director that all the artists are dying to work with. You are fun, upbeat, use gen z language while keeping it still understandable by any age that is familiar with smartphones. You are speaking out loud so speak using natural conversational language.

IMPORTANT: You do NOT have access to the user's camera or any visual input. You cannot see the user or their environment. Only respond to what they say through audio.

Your task is to help users come up with concepts for a music video, or to flush out the idea they already have. Be supportive, extremely creative, but also aware of the limitations of using AI image-to-video models and their capabilities since that is how the music video will be created. 

The song is a song the user wrote so keep that in mind. Here are the details of the song:
- Tempo: ${songData.tempo}BPM
- Key: ${songData.key}
- Genre: ${songData.genre}
- Mood: ${songData.mood}
- Lyrics: ${songData.lyrics}

The idea is to come up with a concept the user likes, that best tells the story their lyrics are trying to get across. Keep in mind the genre and industry norms when making a music video of the genre. e.g. Pop songs, fun, upbeat, faster edits, vs a ballad or country song might have slower longer drawn out shots.`;
      }
      
      console.log('🔥 Using instructions:', instructions.substring(0, 200) + '...');
      
      // Create ephemeral client secret for OpenAI Realtime API
      const response = await fetch('https://api.openai.com/v1/realtime/client_secrets', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          expires_after: {
            anchor: "created_at",
            seconds: 600 // 10 minutes
          },
          session: {
            type: "realtime",
            model: "gpt-realtime",
            instructions: instructions,
            output_modalities: ["audio"],
            audio: {
              input: {
                format: {
                  type: "audio/pcm",
                  rate: 24000
                },
                transcription: {
                  model: "whisper-1"
                },
                turn_detection: {
                  type: "server_vad",
                  threshold: 0.5,
                  prefix_padding_ms: 300,
                  silence_duration_ms: 1000
                }
              },
              output: {
                format: {
                  type: "audio/pcm", 
                  rate: 24000
                },
                voice: "alloy"
              }
            }
          }
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('🔥 OpenAI API error:', response.status, errorText);
        throw new Error(`OpenAI API error: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      console.log('🔥 Client secret created successfully');
      
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } catch (error) {
      console.error('🔥 Error creating client secret:', error);
      return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  }

  // Add a simple GET test endpoint
  if (req.method === 'GET') {
    console.log('🔥 Handling GET request - function is working!');
    return new Response(JSON.stringify({ 
      message: "Edge function is working!", 
      timestamp: new Date().toISOString(),
      openai_key_available: !!Deno.env.get('OPENAI_API_KEY')
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  // This endpoint no longer handles WebSocket connections
  // It now generates client secrets for the new OpenAI Realtime API
  return new Response("This endpoint generates client secrets for OpenAI Realtime API", { 
    status: 400,
    headers: corsHeaders 
  });
});
