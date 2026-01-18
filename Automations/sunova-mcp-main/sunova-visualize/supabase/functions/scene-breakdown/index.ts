import "https://deno.land/x/xhr@0.1.0/mod.ts";

// @ts-ignore: Deno global is available in Supabase Edge Functions
declare const Deno: any;
import { createCorsHeaders, handleOptions } from "../_shared/cors.ts";
import { sanitizeAndNormalizeScenes } from "../_shared/sceneSanitizer.ts";
import { PromptBuilder } from "../_shared/promptBuilder.ts";
import { deriveScenePlanningHeuristics } from "../_shared/scenePlanning.ts";

interface SceneBreakdownRequest {
  lyrics?: string;
  concept: unknown;
  analysis: unknown;
  characters?: Array<{
    mention: string;
    name: string;
    description?: string;
  }>;
}

interface SceneResponse {
  id: string;
  title: string;
  overview: string;
  start_time: number;
  end_time: number;
  has_character: boolean;
  characters: string[];
  visual_prompt: string;
  style?: string;
  camera?: string;
  environment?: string;
  subject?: string;
  elements?: string;
  lighting?: string;
  colors?: string;
  motion?: string;
  mood?: string;
}

interface SceneBreakdownResponse {
  scenes: SceneResponse[];
}

function extractJson<T>(content: string): T {
  const jsonFenceMatch = content.match(/```json([\s\S]*?)```/i);
  const trimmed = jsonFenceMatch ? jsonFenceMatch[1].trim() : content.trim();

  try {
    return JSON.parse(trimmed) as T;
  } catch (error) {
    console.error("Failed to parse JSON from model response", { content: trimmed, error });
    throw new Error("Model response was not valid JSON");
  }
}

Deno.serve(async (req: Request) => {
  const corsHeaders = createCorsHeaders(req.headers.get("origin"));
  const optionsResponse = handleOptions(req, corsHeaders);
  if (optionsResponse) {
    return optionsResponse;
  }

  try {
    const openAiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openAiKey) {
      throw new Error("OPENAI_API_KEY is not configured");
    }

    const body: SceneBreakdownRequest = await req.json();

    if (!body?.concept) {
      throw new Error("Concept data is required to generate scenes");
    }

    if (!body?.analysis) {
      throw new Error("Audio analysis metadata is required");
    }

    const heuristics = deriveScenePlanningHeuristics(
      body.concept,
      body.analysis,
      body.characters
    );

    const heuristicsSummary = heuristics.notes.map((note) => `- ${note}`).join("\n");

    const systemPrompt = `You are an award-winning music video storyboard director.

SCENE DEFINITION: A scene is a continuous block of story set in a single location and time frame. The scene changes immediately when the story jumps to a new location, a new time of day, a new time period, or a meaningfully different environment—even if the same characters continue the action. Shots are the individual camera angles inside a scene and will be generated later.

Planning checklist before emitting JSON:
1. Read the concept storyline and lyrics to list every distinct location or time shift the narrative covers.
2. Merge actions that stay in the same location/time into a single scene; create a new scene for every true location/time change or major set-piece beat.
3. Respect the recommended scene counts below. If the concept clearly states it is a single-location one-take, you may stay at one scene; otherwise ensure the final plan spans the recommended range and never collapses a multi-location story into a single entry.

Planning heuristics:
${heuristicsSummary}

Constraints:
- Minimum scenes: ${heuristics.recommendedMinScenes}
- Maximum scenes: ${heuristics.recommendedMaxScenes}
- Hard cap: 15 scenes
- The total duration of all scenes must equal the song duration (±5 seconds) and align to beat markers from the analysis.

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

Always produce strict JSON. The response must be a JSON object that matches:
{ "scenes": [...]}`;

    const limitedLyrics = typeof body.lyrics === "string"
      ? body.lyrics.slice(0, 5000)
      : null;

    const userPayload = {
      lyrics: limitedLyrics,
      concept: body.concept,
      analysis: body.analysis,
      available_characters: body.characters ?? [],
      planning_heuristics: {
        recommended_min_scenes: heuristics.recommendedMinScenes,
        recommended_max_scenes: heuristics.recommendedMaxScenes,
        duration_seconds: heuristics.durationSeconds,
        storyline_phases: heuristics.storylinePhaseCount,
        storyline_events: heuristics.storylineEventCount,
        character_count: heuristics.characterCount,
        single_location_focus: heuristics.singleLocationEmphasis,
        notes: heuristics.notes,
      },
    };

    const baseMessages = [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content:
          'Analyze the following lyrics and my concept. Included is the audio metadata as well which contains the beats, genre, energy and more about the song. Make sure the mood and vibe of each scene matches the genre and energy of the audio. Scenes should also be aligned to the lyrics as well. Return a JSON object with a "scenes" array. Each scene must include id, title, overview, start_time, end_time, has_character, characters, and visual_prompt. Ensure timestamps are aligned to the beat map, and that the sum of all scenes durations cover the entire song duration.\n\n' +
          JSON.stringify(userPayload),
      },
    ];

    const callOpenAi = async (messages: Array<{ role: string; content: string }>) => {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${openAiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-5-nano",
          max_completion_tokens: 16000,
          messages,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("OpenAI scene breakdown error", errorText);
        throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
      }

      const completionJson = await response.json();
      const content = completionJson.choices?.[0]?.message?.content;
      if (typeof content !== "string" || !content.trim()) {
        console.error("OpenAI scene breakdown missing content", completionJson);
        throw new Error("OpenAI returned an empty response");
      }

      return { completionJson, content };
    };

    let { content } = await callOpenAi(baseMessages);
    let parsed = extractJson<SceneBreakdownResponse>(content);
    if (!parsed?.scenes || !Array.isArray(parsed.scenes)) {
      throw new Error("Model did not return a valid scenes array");
    }

    if (
      parsed.scenes.length < heuristics.recommendedMinScenes &&
      heuristics.recommendedMinScenes > 1 &&
      !heuristics.singleLocationEmphasis
    ) {
      const retryMessages = [
        ...baseMessages,
        { role: "assistant", content },
        {
          role: "user",
          content: `The previous JSON only included ${parsed.scenes.length} scene(s), which is below the required minimum of ${heuristics.recommendedMinScenes}. Regenerate the plan with ${heuristics.recommendedMinScenes} to ${heuristics.recommendedMaxScenes} scenes (unless the narrative truly stays in one location) and return JSON only.`,
        },
      ];

      const retry = await callOpenAi(retryMessages);
      content = retry.content;
      parsed = extractJson<SceneBreakdownResponse>(content);
      if (!parsed?.scenes || !Array.isArray(parsed.scenes)) {
        throw new Error("Model did not return a valid scenes array on retry");
      }
    }
    const scenesWithPrompts = parsed.scenes.map((scene, index) => {
      const promptBuilder = new PromptBuilder({
        style_tag: scene.style || "",
        camera_angle: scene.camera || "",
        environment: scene.environment || "",
        primary_subject: scene.subject || "",
        supporting_elements: scene.elements || "",
        lighting: scene.lighting || "",
        color_emphasis: scene.colors || "",
        dynamic_line: scene.motion || "",
        mood: scene.mood || "",
      });

      return {
        ...scene,
        id: scene.id || `scene-${index + 1}`,
        title: scene.title || `Scene ${index + 1}`,
        visual_prompt: scene.visual_prompt || promptBuilder.renderImage(),
      };
    });

    const normalizedScenes = sanitizeAndNormalizeScenes(scenesWithPrompts, body.analysis);

    return new Response(JSON.stringify({ scenes: normalizedScenes }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Scene breakdown failure", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
