import "https://deno.land/x/xhr@0.1.0/mod.ts";

// @ts-ignore: Deno global is available in Supabase Edge Functions
declare const Deno: any;
import { createCorsHeaders, handleOptions } from "../_shared/cors.ts";
import { sanitizeShots } from "../_shared/shotSanitizer.ts";
import { PromptBuilder } from "../_shared/promptBuilder.ts";

interface SceneInput {
  id: string;
  title: string;
  overview: string;
  start_time: number;
  end_time: number;
  visual_prompt: string;
  has_character: boolean;
  characters: string[];
  keyframe_image?: string;
}

interface ShotPlanRequest {
  scenes: SceneInput[];
  analysis: unknown;
  concept: unknown;
  characters?: Array<{
    mention: string;
    name: string;
    description?: string;
  }>;
}

interface ShotResponseItem {
  id: string;
  scene_id: string;
  scene_index: number;
  shot_index: number;
  title: string;
  description: string;
  start_time: number;
  end_time: number;
  image_prompt: string;
  video_prompt: string;
  has_character: boolean;
  characters: string[];
  camera_direction?: string;
  shot_type?: string;
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

    const body: ShotPlanRequest = await req.json();

    if (!Array.isArray(body?.scenes) || body.scenes.length === 0) {
      throw new Error("At least one scene is required to generate shots");
    }

    console.log(`Processing ${body.scenes.length} scenes for shot expansion`);

    const systemPrompt = `You are an experienced music video director and editor. Break scenes into concise camera shots that can be generated with text-to-video models. Respect scene timings and ensure cumulative shot durations stay within each scene's range. Shots are different angles of the same scene subject matter, just different perspectives to keep visually stimulating.

For each shot, provide structured prompt components following the 10-slot format:
1. style: Visual style tag (e.g., "Dark Digital Art", "Cinematic Realism")
2. camera: Camera angle/shot type with movement (e.g., "Wide shot tracking left", "Close-up dolly in")
3. environment: Scene setting with dominant palette (1 sentence max)
4. subject: Primary character/object with pose, outfit, emotion. Use @mention format for characters.
5. elements: Secondary visual elements (background characters, props, atmospheric motion like birds, rain, crowds)
6. lighting: Concise lighting description with cinematographic detail
7. colors: Explicit color palette or contrast notes
8. motion: Camera and subject movement - highly detailed for video prompts
9. mood: 3-5 mood adjectives
10. Characters must use @ mention format

The image_prompt focuses on the first frame composition only (no motion).
The video_prompt focuses on movement throughout the shot (camera and subject motion).

If a similar shot appears later, reference the master shot as "scene_X_shot_Y" instead of generating new prompts.

Ensure consistency across shots, characters, and locations. Always include atmospheric background motion. Generate 2-4 shots per scene depending on scene duration.`;

    const userPayload = {
      analysis: body.analysis,
      concept: body.concept,
      scenes: body.scenes,
      available_characters: body.characters ?? [],
    };

    const completionResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openAiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-5",
        max_completion_tokens: 16000,
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "shot_plan_response",
            schema: {
              type: "object",
              additionalProperties: false,
              properties: {
                shots: {
                  type: "array",
                  items: {
                    type: "object",
                    additionalProperties: false,
                    properties: {
                      id: { type: "string" },
                      scene_id: { type: "string" },
                      scene_index: { type: "number" },
                      shot_index: { type: "number" },
                      title: { type: "string" },
                      description: { type: "string" },
                      start_time: { type: "number" },
                      end_time: { type: "number" },
                      image_prompt: { type: "string" },
                      video_prompt: { type: "string" },
                      has_character: { type: "boolean" },
                      characters: {
                        type: "array",
                        items: { type: "string" }
                      },
                      camera_direction: { type: "string" },
                      shot_type: { type: "string" },
                      style: { type: "string" },
                      camera: { type: "string" },
                      environment: { type: "string" },
                      subject: { type: "string" },
                      elements: { type: "string" },
                      lighting: { type: "string" },
                      colors: { type: "string" },
                      motion: { type: "string" },
                      mood: { type: "string" }
                    },
                    required: [
                      "id",
                      "scene_id",
                      "scene_index",
                      "shot_index",
                      "title",
                      "description",
                      "start_time",
                      "end_time",
                      "image_prompt",
                      "video_prompt",
                      "has_character",
                      "characters",
                      "camera_direction",
                      "shot_type",
                      "style",
                      "camera",
                      "environment",
                      "subject",
                      "elements",
                      "lighting",
                      "colors",
                      "motion",
                      "mood"
                    ]
                  }
                }
              },
              required: ["shots"]
            },
            strict: true
          }
        },
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: 'Convert the provided music video scenes into detailed shot prompts. Ensure each shot includes id, scene_id, scene_index, shot_index, title, description, start_time, end_time, image_prompt, video_prompt, has_character, characters, camera_direction, and shot_type. Respect each scene\'s start and end times. All start times and end times must fall on a musical or lyrical beat, or match the energy of that moment in the song. Most shots should be under or around 5 seconds with the exception being for slow songs, or for opening, endings, or musical interludes and only for effect. If the shot is less than 5 seconds, the first part of the generation can be used as 1 shot, and the second part for another if the same visuals are used elsewhere in the full video. Notate shots where the same generation is used at a later time in the image prompt and the video prompt value by placing the first shots scene_id and shot_index instead of the prompts.\n\n' +
              JSON.stringify(userPayload),
          },
        ],
      }),
    });

    if (!completionResponse.ok) {
      const errorText = await completionResponse.text();
      console.error("OpenAI shot expansion error", errorText);
      throw new Error(`OpenAI API error: ${completionResponse.status}`);
    }

    const completionJson = await completionResponse.json();
    const content = completionJson.choices?.[0]?.message?.content;
    if (typeof content !== "string" || !content.trim()) {
      console.error("OpenAI shot expansion missing content", completionJson);
      throw new Error("OpenAI returned an empty response");
    }

    const parsed = extractJson<{ shots?: ShotResponseItem[] }>(content);
    if (!parsed?.shots || !Array.isArray(parsed.shots)) {
      throw new Error("Model did not return a valid shots array");
    }

    const defaultScene = body.scenes[0] ?? body.scenes.at(0);
    const defaultSceneId = (defaultScene?.id && typeof defaultScene.id === "string") ? defaultScene.id : "scene-1";

    const shotsWithPrompts = parsed.shots.map((shot) => {
      const isReference = shot.image_prompt?.includes("scene_") && shot.image_prompt?.includes("shot_");
      let imagePrompt = shot.image_prompt || "";
      let videoPrompt = shot.video_prompt || "";

      if (!isReference) {
        const promptBuilder = new PromptBuilder({
          style_tag: shot.style || "",
          camera_angle: shot.camera || "",
          environment: shot.environment || "",
          primary_subject: shot.subject || "",
          supporting_elements: shot.elements || "",
          lighting: shot.lighting || "",
          color_emphasis: shot.colors || "",
          dynamic_line: shot.motion || "",
          mood: shot.mood || "",
        });

        imagePrompt = imagePrompt || promptBuilder.renderImage();
        videoPrompt = videoPrompt || promptBuilder.renderVideo();
      }

      return {
        ...shot,
        image_prompt: imagePrompt,
        video_prompt: videoPrompt,
      };
    });

    const sanitizedShots = sanitizeShots(shotsWithPrompts, {
      defaultSceneId,
      defaultSceneIndex: Number.isFinite((defaultScene as any)?.scene_index) ? (defaultScene as any).scene_index : 0,
    });

    return new Response(JSON.stringify({ shots: sanitizedShots }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Shot expansion failure", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
