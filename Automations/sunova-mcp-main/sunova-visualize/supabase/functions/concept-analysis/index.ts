import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';

// @ts-ignore: Deno global is available in Supabase Edge Functions
declare const Deno: any;
import { createCorsHeaders, handleOptions } from "../_shared/cors.ts";

interface CharacterInput {
  attributes?: {
    age?: string;
    gender?: string;
    style?: string;
    [key: string]: unknown;
  };
}

interface ConversationHistoryItem {
  type: 'user' | 'assistant';
  content: string;
}

interface RequestPayload {
  lyrics?: string;
  userVision?: string;
  genre?: string;
  mood?: string;
  characters?: CharacterInput[];
  conversationHistory?: ConversationHistoryItem[];
  songData?: {
    tempo?: number;
    key?: string;
    duration?: number;
    instruments?: string[];
    themes?: string[];
    mood_timeline?: Array<{ timestamp: number; mood: string; intensity: number }>;
    lyrics?: string;
    genre?: string;
    mood?: string;
    beatMap?: number[];
    beat_map?: number[];
    spectral_features?: Record<string, unknown>;
    energy_profile?: Array<{ time?: number; energy?: number }>;
  };
}

Deno.serve(async (req: Request) => {
  const corsHeaders = createCorsHeaders(req.headers.get('origin'));
  const optionsResponse = handleOptions(req, corsHeaders);
  if (optionsResponse) {
    return optionsResponse;
  }

  try {
    // Input validation schema
    const RequestSchema = z.object({
      lyrics: z.string().max(50000).optional(),
      userVision: z.string().max(10000).optional(),
      genre: z.string().max(100).optional(),
      mood: z.string().max(100).optional(),
      characters: z.array(z.object({
        attributes: z.object({
          age: z.string().max(50).optional(),
          gender: z.string().max(50).optional(),
          style: z.string().max(100).optional(),
        }).passthrough().optional(),
      }).passthrough()).max(20).optional(),
      conversationHistory: z.array(z.object({
        type: z.enum(['user', 'assistant']),
        content: z.string().max(10000),
      })).max(50).optional(),
      songData: z.object({
        tempo: z.number().optional(),
        key: z.string().max(10).optional(),
        duration: z.number().optional(),
        instruments: z.array(z.string()).optional(),
        themes: z.array(z.string()).optional(),
        mood_timeline: z.array(z.object({
          timestamp: z.number(),
          mood: z.string(),
          intensity: z.number(),
        })).optional(),
        beatMap: z.array(z.number()).optional(),
        beat_map: z.array(z.number()).optional(),
      }).passthrough().optional(),
    }).refine(data => data.lyrics || data.userVision, {
      message: 'Either lyrics or userVision is required',
    });

    const validationResult = RequestSchema.safeParse(await req.json());
    
    if (!validationResult.success) {
      console.error('Validation error:', validationResult.error);
      return new Response(
        JSON.stringify({ error: 'Invalid input', details: validationResult.error.issues }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const {
      lyrics,
      userVision,
      genre,
      mood,
      characters,
      conversationHistory,
      songData,
    } = validationResult.data;

    const beatMap = Array.isArray(songData?.beatMap)
      ? songData.beatMap
      : Array.isArray(songData?.beat_map)
        ? songData.beat_map
        : [];

    const averageBeatSpacing = (() => {
      if (beatMap.length < 2) return null;
      let total = 0;
      for (let i = 0; i < beatMap.length - 1; i++) {
        total += Math.max(beatMap[i + 1] - beatMap[i], 0);
      }
      return total / (beatMap.length - 1);
    })();

    console.log('Starting concept analysis with GPT-5...');
    console.log('Input data:', {
      lyricsLength: lyrics?.length || 0,
      userVisionLength: userVision?.length || 0,
      genre,
      mood,
      characterCount: characters?.length || 0,
      conversationHistoryLength: conversationHistory?.length || 0,
      tempo: songData?.tempo,
      key: songData?.key,
      duration: songData?.duration,
      beatCount: beatMap.length,
      averageBeatSpacing
    });

    // Build the prompt for music video concept development
    const systemPrompt = `You are a hip and trendy music video director that all the artists are dying to work with. You are fun, upbeat, and use a casual style with occasional slang, but avoid niche or obscure phrases so the language is clear to anyone familiar with smartphones. You are speaking out loud, so use natural conversational language.

IMPORTANT: You do NOT have access to the user's camera or any visual input. You cannot see the user or their environment. Only respond to what they say through audio.

Your task is to help users come up with concepts for a music video, or to refine the idea they already have. Be supportive, extremely creative, and keep in mind that visuals will be created with AI image-to-video tools that handle short clips, may struggle with long continuity, and cannot always reproduce exact details. The song is a song the user wrote. Here are the details of the song. Genre: ${genre || 'unknown'}, Mood: ${mood || 'unknown'}. Lyrics: ${lyrics || 'No lyrics provided'}

The idea is to come up with a concept the user likes that best tells the story their lyrics are trying to get across. Keep in mind the genre and industry norms when making a music video of that genre. For example, pop songs often use upbeat pacing and faster edits, while ballads or country songs might use slower, longer shots.

CRITICAL STOP RULES:
- Only come up with the basic narrative arc (beginning, middle, end). Do NOT provide shot lists, props, costumes, transitions, or editing details.
- Once the beginning–middle–end arc is finalized, STOP. 
- When the user indicates satisfaction (e.g. "I'm happy with the concept," "this works," "lock it in," "sounds good"), set "status": "finalized" in the JSON and STOP responding entirely.
- At the end of every response, you MUST include a <CONCEPT_JSON> block. Do not mention the JSON in conversation.
 - Immediately before the <CONCEPT_JSON> block, write the literal token [END OF CONCEPT] on its own line to signal completion.

Format your response as:
1. Natural conversational response to the user (short, conversational)
2. [END OF CONCEPT]
3. <CONCEPT_JSON>
{
  "concept_summary": "Brief overview of the current music video concept",
  "storyline": [
    { "phase": "beginning", "events": ["..."] },
    { "phase": "middle", "events": ["..."] },
    { "phase": "end", "events": ["..."] }
  ],
  "visual_themes": ["theme1", "theme2"],
  "character_roles": {
    "@character1": "role if provided",
    "@character2": "role if provided"
  },
  "status": "draft" // change to "finalized" when done
}
</CONCEPT_JSON>`;

let userPrompt = `Create a music video concept for a ${genre} song with ${mood} mood. It should be engaging, follow the lyrics, represent the genre and artist, and feel cinematic.

SONG METRICS:
- Tempo: ${songData?.tempo ?? 'unknown'} BPM
- Key: ${songData?.key ?? 'unknown'}
- Duration: ${songData?.duration ? `${Math.round(songData.duration)} seconds` : 'unknown'}
- Beat count: ${beatMap.length}
- Average beat spacing: ${averageBeatSpacing ? `${averageBeatSpacing.toFixed(2)}s` : 'n/a'}
- Instruments detected: ${(songData?.instruments && songData.instruments.length) ? songData.instruments.join(', ') : 'unknown'}
- Themes detected: ${(songData?.themes && songData.themes.length) ? songData.themes.join(', ') : 'unknown'}
- Energy profile samples: ${Array.isArray(songData?.energy_profile) ? songData.energy_profile.length : 0}

SONG LYRICS:
"""
${lyrics || 'No lyrics provided'}
"""

USER VISION:
"""
${userVision || 'No specific vision provided - create based on lyrics and music style'}
"""`;

if (characters && characters.length > 0) {
  userPrompt += `

AVAILABLE CHARACTERS:
${characters.map((char, index) => {
  const attributes = char.attributes ?? {};
  const age = typeof attributes.age === 'string' ? attributes.age : 'unknown age';
  const gender = typeof attributes.gender === 'string' ? attributes.gender : 'person';
  const style = typeof attributes.style === 'string' ? attributes.style : 'casual';
  return `@character${index + 1}: ${age} ${gender} (${style} style)`;
}
).join('\n')}

Please integrate these characters meaningfully into the narrative.`;
}

userPrompt += `

Have a brief conversation with me about developing this concept. Stop once the beginning–middle–end structure is finalized and set "status": "finalized" in the JSON.`;

console.log('Sending request to OpenAI GPT-5...');

// Build messages
const messages = [{ role: 'system', content: systemPrompt }];
if (conversationHistory && conversationHistory.length > 0) {
  conversationHistory.forEach((msg) => {
    if (msg && msg.content) {
      messages.push({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.content,
      });
    }
  });
}
messages.push({ role: 'user', content: userPrompt });

const response = await fetch('https://api.openai.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'gpt-5-nano',
    messages,
    max_completion_tokens: 4000,
    stream: false
  }),
});

if (!response.ok) {
  const errorText = await response.text();
  console.error('OpenAI API error:', errorText);
  throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
}

const completion = await response.json();
const fullContent = completion?.choices?.[0]?.message?.content ?? '';

let conversationContent = fullContent;
let conceptData = null;
const conceptMatch = fullContent.match(/<CONCEPT_JSON>(.*?)<\/CONCEPT_JSON>/s);
if (conceptMatch) {
  try {
    conceptData = JSON.parse(conceptMatch[1].trim());
    conversationContent = fullContent.replace(/<CONCEPT_JSON>.*?<\/CONCEPT_JSON>/s, '').trim();
  } catch (err) {
    console.error('Error parsing concept JSON:', err);
  }
}

const conversationTrimmed = conversationContent.trim();
const conversationWithEndToken = conversationTrimmed.includes('[END OF CONCEPT]')
  ? conversationTrimmed
  : (conversationTrimmed ? `${conversationTrimmed}\n\n[END OF CONCEPT]` : '[END OF CONCEPT]');

const responsePayload: {
  type: 'complete';
  conversation: string;
  fullContent: string;
  concept?: unknown;
} = {
  type: 'complete',
  conversation: conversationWithEndToken,
  fullContent,
};

if (conceptData) {
  responsePayload.concept = conceptData;
}

return new Response(JSON.stringify(responsePayload), {
  headers: {
    ...corsHeaders,
    'Content-Type': 'application/json',
  }
});

  } catch (error) {
    console.error('Concept analysis error:', error);
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
