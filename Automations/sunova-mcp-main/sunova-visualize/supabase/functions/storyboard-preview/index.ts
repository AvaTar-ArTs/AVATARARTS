import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1?no-check";
import { createCorsHeaders, handleOptions } from "../_shared/cors.ts";

interface PreviewRequest {
  prompt: string;
  aspect_ratio?: string;
  steps?: number;
  seed?: number;
}

interface SegmindResponse {
  image?: string;
  output?: string | string[];
  images?: string[];
  data?: {
    image?: string;
    images?: string[];
    output?: string | string[];
    image_url?: string;
  } & Record<string, unknown>;
  image_url?: string;
  url?: string;
  [key: string]: unknown;
}

const API_URL = "https://api.segmind.com/v1/fast-flux-schnell";

const toArray = <T>(value: T | T[] | undefined | null): T[] => {
  if (!value) {
    return [];
  }
  return Array.isArray(value) ? value : [value];
};

const isLikelyBase64 = (value: string | null | undefined): boolean => {
  if (!value) {
    return false;
  }
  const trimmed = value.trim();
  if (trimmed.startsWith("data:")) {
    return true;
  }
  if (trimmed.length < 100) {
    return false;
  }
  return /^[A-Za-z0-9+/=\n\r]+$/.test(trimmed);
};

const extractImagePayload = (payload: unknown): {
  base64?: string;
  url?: string;
} | null => {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const record = payload as SegmindResponse;

  const directUrl = record.image_url || record.url;
  if (typeof directUrl === "string" && directUrl.startsWith("http")) {
    return { url: directUrl };
  }

  const directImage = record.image;
  if (typeof directImage === "string" && isLikelyBase64(directImage)) {
    return { base64: directImage };
  }

  const traversed = [
    record.output,
    record.images,
    record.data?.image,
    record.data?.images,
    record.data?.output,
  ].flat();

  for (const candidate of toArray(traversed)) {
    if (typeof candidate === "string") {
      if (candidate.startsWith("http")) {
        return { url: candidate };
      }
      if (isLikelyBase64(candidate)) {
        return { base64: candidate };
      }
    }
  }

  for (const value of Object.values(record)) {
    if (typeof value === "string") {
      if (value.startsWith("http")) {
        return { url: value };
      }
      if (isLikelyBase64(value)) {
        return { base64: value };
      }
    }
  }

  return null;
};

serve(async (req) => {
  const corsHeaders = createCorsHeaders(req.headers.get("origin"));
  const optionsResponse = handleOptions(req, corsHeaders);
  if (optionsResponse) {
    return optionsResponse;
  }

  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const segmindApiKey = Deno.env.get("SEGMIND_API_KEY");
    if (!segmindApiKey) {
      throw new Error("SEGMIND_API_KEY is not configured");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Supabase configuration is missing");
    }

    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Authentication required" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data: authData, error: authError } = await supabase.auth.getUser(token);

    if (authError || !authData?.user?.id) {
      return new Response(JSON.stringify({ error: "Authentication required" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = authData.user.id;
    const userEmail = authData.user.email ?? null;

    const body: PreviewRequest = await req.json();
    const { prompt, steps = 4, aspect_ratio = "1:1" } = body;

    if (!prompt || typeof prompt !== "string") {
      throw new Error("Prompt is required");
    }

    const payload = {
      prompt,
      steps,
      aspect_ratio,
      base64: true,
      seed: body.seed ?? Math.floor(Math.random() * 10_000_000),
    };

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "x-api-key": segmindApiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      let errorPayload: unknown;
      try {
        errorPayload = await response.json();
      } catch (_error) {
        errorPayload = await response.text();
      }

      console.error("Segmind preview error", errorPayload);
      throw new Error(`Segmind API error: ${response.status}`);
    }

    const data = await response.json();
    const extracted = extractImagePayload(data);

    if (!extracted) {
      console.error("Unexpected Segmind preview response", data);
      throw new Error("Segmind response did not include image data");
    }

    const base64Image = extracted.base64 ?? null;
    const imageUrl = extracted.url ?? null;
    const imageDataUrl = base64Image
      ? (base64Image.trim().startsWith("data:") ? base64Image.trim() : `data:image/png;base64,${base64Image.trim()}`)
      : null;

    try {
      await supabase.rpc("log_api_request", {
        p_user_id: userId,
        p_user_email: userEmail,
        p_project_id: null,
        p_project_name: null,
        p_api_type: "segmind",
        p_generation_type: "storyboard_preview",
        p_endpoint: "v1/fast-flux-schnell",
        p_method: "POST",
        p_prompt: prompt,
        p_prompt_tokens: Math.ceil(prompt.length / 4),
        p_completion_tokens: 0,
        p_total_tokens: Math.ceil(prompt.length / 4),
        p_raw_request: payload,
        p_raw_response: data,
        p_status_code: 200,
        p_success: true,
        p_error_message: null,
        p_duration_ms: null,
        p_cost_usd: 0,
      });
    } catch (logError) {
      console.error("Failed to log storyboard preview request", logError);
    }

    return new Response(JSON.stringify({
      success: true,
      image_data_url: imageDataUrl,
      image_base64: base64Image,
      image_url: imageUrl,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error generating storyboard preview", error);

    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
