const systemPrompt = `You are an award-winning music video storyboard director. You break down the songs lyrics into each section of the song, i.e. verses, choruses, bridges, intro, outro and then you overlay the provided concept over the top of the section map and break each section down into a narrative flow for the music video. Each scene must have clear timestamps that are locked to a beat from the beat map, an overview, and information about whether featured characters appear. There should never be less than 6 scenes per song and there should never be more than 25 scenes per song. The total of all scenes added together can be no less than the total duration of the song, and no more that the total duration of the song +15 seconds.

Return JSON only with the exact shape described below. Even if you think additional text would help, respond solely with JSON.

For each scene, provide structured prompt components:
- style: Visual style tag (e.g., "Dark Digital Art", "Cinematic Realism")
- camera: Camera angle/shot type (e.g., "Wide shot", "Close-up tracking")
- environment: Scene setting with dominant palette (1 sentence max)
- subject: Primary character/object with pose, outfit, emotion
- elements: Secondary visual elements (background characters, props, logos)
- lighting: Concise lighting description
- colors: Explicit color palette or contrast notes
- motion: Camera or subject movement description
- mood: 3-5 mood adjectives
- visual_prompt: Legacy field (will be auto-generated from structured data)

Limit the output to exactly 6 scenes. Keep every string under 60 words. Use concise language.

Always produce strict JSON.`;

const schema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    scenes: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          id: { type: 'string' },
          title: { type: 'string' },
          overview: { type: 'string' },
          start_time: { type: 'number' },
          end_time: { type: 'number' },
          has_character: { type: 'boolean' },
          characters: {
            type: 'array',
            items: { type: 'string' }
          },
          visual_prompt: { type: 'string' },
          style: { type: 'string' },
          camera: { type: 'string' },
          environment: { type: 'string' },
          subject: { type: 'string' },
          elements: { type: 'string' },
          lighting: { type: 'string' },
          colors: { type: 'string' },
          motion: { type: 'string' },
          mood: { type: 'string' }
        },
        required: ['id','title','overview','start_time','end_time','has_character','characters','visual_prompt','style','camera','environment','subject','elements','lighting','colors','motion','mood']
      }
    }
  },
  required: ['scenes']
};

const analysis = {
  tempo: 120,
  key: 'C Major',
  duration: 180,
  genre: 'pop',
  mood: 'uplifting',
  beatMap: Array.from({ length: 16 }, (_, i) => i * 4),
};

const concept = {
  concept_summary: 'A test concept',
  storyline: [
    { phase: 'beginning', events: ['Event 1'] },
    { phase: 'middle', events: ['Event 2'] },
    { phase: 'end', events: ['Event 3'] },
  ],
};

const lyrics = 'Sample lyrics...';

const body = {
  model: 'gpt-5-nano',
  input: [
    { role: 'system', content: systemPrompt },
    {
      role: 'user',
      content:
        'Analyze the following lyrics and my concept. Included is the audio metadata as well which contains the beats, genre, energy and more about the song. Make sure the mood and vibe of each scene matches the genre and energy of the audio. Scenes should also be aligned to the lyrics as well.  Return a JSON object with a "scenes" array. Each scene must include id, title, overview, start_time, end_time, has_character, characters, and visual_prompt. Ensure timestamps are at minimun the song duration and no more than the song duration + 15 seconds.\n\n' +
        JSON.stringify({ lyrics, concept, analysis, available_characters: [] })
    }
  ],
  max_output_tokens: 6000,
  text: {
    format: {
      type: 'json_schema',
      name: 'scene_breakdown_response',
      schema
    }
  }
};

const res = await fetch('https://api.openai.com/v1/responses', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(body),
});

const text = await res.text();
console.log(res.status, text);
