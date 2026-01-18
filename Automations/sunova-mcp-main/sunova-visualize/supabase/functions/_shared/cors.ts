const DEFAULT_ORIGIN = "https://sunova.ai";

const allowedOrigins = new Set([
  DEFAULT_ORIGIN,
  "https://www.sunova.ai",
  "https://app.sunova.ai",
  "https://sunova.app",
  "https://www.sunova.app",
  "https://app.sunova.app",
  "https://dca1e73a-dda4-4b33-afd0-92bf34137cd3.lovableproject.com",
  "https://sunova-visualize-iufsuc7ew-justins-projects-9835cbd6.vercel.app",
  "https://sonikframe.com",
  "http://localhost:3000",
  "http://localhost:5173",
  "http://localhost:4173",
  "http://localhost:8080",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:8080",
]);

const ALLOWED_HEADERS =
  "authorization, x-client-info, apikey, content-type";
const ALLOWED_METHODS = "GET, POST, OPTIONS";

function isAllowedOrigin(origin: string | null) {
  if (!origin) {
    return false;
  }

  if (allowedOrigins.has(origin)) {
    return true;
  }

  try {
    const { hostname } = new URL(origin);
    if (
      hostname.endsWith(".vercel.app") &&
      (hostname === "sunova-visualize.vercel.app" ||
        hostname.startsWith("sunova-visualize-"))
    ) {
      return true;
    }
  } catch (_) {
    return false;
  }

  return false;
}

export function createCorsHeaders(origin: string | null) {
  const allowOrigin: string = isAllowedOrigin(origin)
    ? (origin as string)
    : DEFAULT_ORIGIN;

  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Headers": ALLOWED_HEADERS,
    "Access-Control-Allow-Methods": ALLOWED_METHODS,
    Vary: "Origin",
  };
}

export function handleOptions(req: Request, headers?: HeadersInit) {
  if (req.method !== "OPTIONS") {
    return null;
  }

  const origin = req.headers.get("origin");
  const corsHeaders = headers ?? createCorsHeaders(origin);
  return new Response("ok", { headers: corsHeaders });
}
