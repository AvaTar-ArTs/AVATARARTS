import { createClient } from '@supabase/supabase-js';

const url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!url || !key) {
  throw new Error('Missing Supabase env vars');
}

const supabase = createClient(url, key, {
  auth: { persistSession: false },
});

const analysis = {
  tempo: 120,
  key: 'C Major',
  duration: 180,
  genre: 'pop',
  mood: 'uplifting',
  instruments: ['synth', 'drums'],
  themes: ['confidence'],
  beatMap: Array.from({ length: 16 }, (_, i) => i * 4),
  mood_timeline: [
    { timestamp: 0, mood: 'hopeful', intensity: 0.4 },
    { timestamp: 90, mood: 'confident', intensity: 0.7 },
  ],
};

const lyrics = `Verse 1\nI wake up chasing sunbeams\nHeart is beating double time\nPre-Chorus\nI hear the city calling\nGonna make the light all mine\nChorus\nWe are the spark in the night\nIgniting the sky, burning bright`;

const userVision = 'High-energy rooftop performance with neon lights and dynamic choreography.';

const conceptRes = await supabase.functions.invoke('concept-analysis', {
  body: {
    lyrics,
    userVision,
    genre: analysis.genre,
    mood: analysis.mood,
    characters: [],
    songData: analysis,
  },
});

if (conceptRes.error) {
  console.error('Concept analysis error', conceptRes.error);
  process.exit(1);
}

console.log('Concept conversation snippet:', conceptRes.data?.conversation?.slice(0, 120) ?? '');
console.log('Concept keys:', conceptRes.data ? Object.keys(conceptRes.data) : []);
const concept = conceptRes.data?.concept;
console.log('Concept present?', concept ? 'yes' : 'no');
if (concept) {
  console.log('Concept sample:', JSON.stringify(concept, null, 2).slice(0, 400));
}

const sceneRes = await supabase.functions.invoke('scene-breakdown', {
  body: {
    lyrics,
    concept,
    analysis,
    characters: [],
  },
});

if (sceneRes.error) {
  let details = sceneRes.error;
  if (sceneRes.error?.context) {
    try {
      const text = await sceneRes.error.context.text();
      details = `${sceneRes.error.message ?? 'Error'}: ${text}`;
    } catch (_) {
      // ignore
    }
  }
  console.error('Scene breakdown error', details);
  process.exit(1);
}

console.log('Scene count:', sceneRes.data?.scenes?.length ?? 0);

const shotRes = await supabase.functions.invoke('scene-shot-expansion', {
  body: {
    scenes: sceneRes.data?.scenes ?? [],
    analysis,
    concept,
    characters: [],
  },
});

if (shotRes.error) {
  console.error('Shot expansion error', shotRes.error);
  process.exit(1);
}

console.log('Shot count:', shotRes.data?.shots?.length ?? 0);
