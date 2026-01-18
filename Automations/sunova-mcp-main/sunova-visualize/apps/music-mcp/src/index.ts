import express from "express";
import cors from "cors";
import { randomUUID } from "node:crypto";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { isInitializeRequest } from "@modelcontextprotocol/sdk/types.js";
import { z, type ZodRawShape, type ZodTypeAny } from "zod";
import OpenAI from "openai";
import Stripe from "stripe";

const PORT = Number(process.env.PORT || 8787);
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || "";
const BILLING_REQUIRED = (process.env.BILLING_REQUIRED || "false").toLowerCase() === "true";
const PRICE_PER_IMAGE_USD = Number(process.env.PRICE_PER_IMAGE_USD || 0.25);
const PRICE_PER_VIDEO_USD = Number(process.env.PRICE_PER_VIDEO_USD || 1.0);
const PUBLIC_BASE_URL = process.env.PUBLIC_BASE_URL || "http://localhost:" + PORT;

const app = express();
app.use(
  cors({
    origin: "*",
    allowedHeaders: ["Content-Type", "mcp-session-id"],
    exposedHeaders: ["Mcp-Session-Id"],
    maxAge: 600
  })
);
app.use(express.json({ limit: "20mb" }));

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
const stripe = STRIPE_SECRET_KEY ? new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" }) : (null as any);
// In-memory maps to remember request context per render job id
const audioByVideoId = new Map<string, string>();
const storyboardByVideoId = new Map<string, any>();

const createServer = () => {
  const srv = new McpServer({ name: "music-video-mcp", version: "0.1.0" });
  const server = srv;


// UI resources
server.registerResource("storyboard-ui","ui://music-video/storyboard.html",{},async()=>({
  contents:[{uri:"ui://music-video/storyboard.html",mimeType:"text/html+skybridge",text:"<!doctype html><html><body><p>Use storyboard2 template.</p></body></html>",_meta:{"openai/widgetDescription":"Deprecated storyboard.","openai/widgetPrefersBorder":true}}]
}));

// Safer storyboard UI (no nested template strings)
server.registerResource(
  "storyboard-ui2",
  "ui://music-video/storyboard2.html",
  {},
  async () => ({
    contents: [
      {
        uri: "ui://music-video/storyboard2.html",
        mimeType: "text/html+skybridge",
        text: `
<!doctype html>
<html><head><meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<style>
  body{font-family:ui-sans-serif,system-ui,Arial;margin:0;padding:16px;background:linear-gradient(135deg,#fff7ed 0%,#fde68a 45%,#fb923c 100%);color:#111827;}
  h2{margin:0 0 12px;font-size:24px;font-weight:600;color:#9a3412;}
  .toolbar{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px}
  button{background:linear-gradient(135deg,#f97316,#ec4899);color:#fff;border:none;border-radius:999px;padding:9px 18px;font-size:14px;font-weight:600;cursor:pointer;transition:transform .15s ease,box-shadow .15s ease;}
  button:hover{transform:translateY(-1px);box-shadow:0 12px 28px -18px rgba(236,72,153,.7);} 
  button:disabled{opacity:.6;cursor:not-allowed;transform:none;box-shadow:none;}
  .banner{padding:13px;border-radius:12px;margin-bottom:12px;font-size:14px;border:1px solid transparent;box-shadow:0 10px 24px -22px rgba(249,115,22,.6)}
  .banner.success{background:rgba(34,197,94,.12);border-color:#22c55e;color:#166534;}
  .banner.warning{background:rgba(249,115,22,.12);border-color:#f97316;color:#9a3412;}
  .banner.info{background:rgba(59,130,246,.12);border-color:#3b82f6;color:#1d4ed8;}
  .muted{color:#475569;font-size:13px;margin-bottom:10px}
  .checkout{display:flex;flex-direction:column;gap:6px;margin-bottom:12px}
  .checkout a{color:#f97316;text-decoration:none;font-weight:600}
  .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:14px}
  .scene{border:1px solid rgba(249,115,22,.2);border-radius:16px;padding:14px;background:#fff;box-shadow:0 16px 40px -24px rgba(251,146,60,.6);opacity:0;transform:translateY(12px)}
  .scene h3{margin:0 0 8px;font-size:16px}
  .shot{display:flex;gap:12px;align-items:flex-start;margin:8px 0}
  .shot img{width:200px;height:112px;object-fit:cover;border-radius:12px;border:1px solid rgba(249,115,22,.25);background:#fff7ed}
  .shot .meta{font-size:13px;color:#4f46e5}
  .empty{color:#9ca3af;text-align:center;font-style:italic;padding:24px 0}
  @keyframes popIn{0%{opacity:0;transform:translateY(12px);}100%{opacity:1;transform:translateY(0);}}
</style></head>
<body>
  <h2>Storyboard</h2>
  <div class="toolbar">
    <button id="genKeyframes">Generate Keyframes</button>
    <button id="buyKeyframes">Buy Keyframe Credits (Stripe)</button>
    <button id="saveProject">Save Project on Sunova</button>
  </div>
  <div id="banner"></div>
  <p id="storyboardSummary" class="muted"></p>
  <div id="checkout" class="checkout"></div>
  <div id="grid" class="grid"></div>
  <script type="module">
    const toolData = (window.openai && window.openai.toolOutput) ? window.openai.toolOutput : {};
    const scenes = Array.isArray(toolData.scenes) ? toolData.scenes : [];
    const checkout = (toolData && toolData.url) ? toolData : null;
    let pendingSessionId = checkout && checkout.sessionId ? checkout.sessionId : null;
    const bannerData = toolData && toolData.banner ? toolData.banner : null;
    if (bannerData && bannerData.type === 'success') pendingSessionId = null;

    const grid = document.getElementById('grid');
    const checkoutBox = document.getElementById('checkout');
    const bannerBox = document.getElementById('banner');
    const summary = document.getElementById('storyboardSummary');
    grid.innerHTML = '';
    checkoutBox.innerHTML = '';
    bannerBox.innerHTML = '';
    summary.textContent = '';

    const pushBanner = (data, fallback) => {
      if (data && data.message) {
        const div = document.createElement('div');
        div.className = 'banner ' + data.type;
        div.textContent = data.message;
        bannerBox.appendChild(div);
      } else if (fallback) {
        const div = document.createElement('div');
        div.className = 'banner info';
        div.textContent = fallback;
        bannerBox.appendChild(div);
      }
    };

    if (checkout && checkout.url) {
      const info = document.createElement('div'); info.className = 'muted'; info.textContent = 'Checkout session created. Complete payment to unlock generation.';
      const link = document.createElement('a'); link.href = checkout.url; link.target = '_blank'; link.rel = 'noopener noreferrer'; link.textContent = 'Open Stripe Checkout';
      checkoutBox.append(info, link);
      if (checkout.amount_cents) {
        const amount = document.createElement('div'); amount.className = 'muted'; amount.textContent = 'Amount: $' + (checkout.amount_cents / 100).toFixed(2);
        checkoutBox.appendChild(amount);
      }
    }

    if (!scenes.length) {
      grid.innerHTML = '<div class="empty">No scenes yet.</div>';
      pushBanner(bannerData, checkout ? 'Complete payment, then click Generate Keyframes.' : 'Create a storyboard to begin.');
    } else {
      scenes.forEach((s, i) => {
        const el = document.createElement('div'); el.className = 'scene';
        el.style.animation = 'popIn .45s ease forwards';
        el.style.animationDelay = (i * 80) + 'ms';
        const h = document.createElement('h3'); h.textContent = 'Scene ' + (i+1) + ': ' + (s.title || ''); el.appendChild(h);
        const shots = Array.isArray(s.shots) ? s.shots : [];
        shots.forEach((sh, j) => {
          const row = document.createElement('div'); row.className = 'shot';
          row.style.animation = 'popIn .35s ease forwards';
          row.style.animationDelay = (i * 80 + j * 40) + 'ms';
          const img = document.createElement('img'); img.src = sh.keyframe || 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22240%22 height=%22135%22><rect width=%22240%22 height=%22135%22 fill=%22%23f5f5f5%22/><text x=%2250%22 y=%2270%22 font-size=%2212%22 fill=%22%23999%22>no image</text></svg>';
          const meta = document.createElement('div'); meta.className = 'meta';
          meta.innerHTML = '<strong>Shot ' + (j+1) + '</strong>' + (sh.prompt ? '<div>' + sh.prompt + '</div>' : '') + (sh.timing ? '<div class="muted">' + sh.timing + '</div>' : '');
          row.appendChild(img); row.appendChild(meta);
          el.appendChild(row);
        });
        grid.appendChild(el);
      });
      pushBanner(bannerData, null);
    }

    const callTool = (name, input) => {
      if (window.openai && typeof window.openai.callTool === 'function') {
        window.openai.callTool(name, input);
      } else {
        window.parent?.postMessage({ type: 'call-tool', tool: name, input }, '*');
      }
    };

    const shotsCount = scenes.reduce((total, scene) => total + (Array.isArray(scene.shots) ? scene.shots.length : 0), 0);
    const summaryBits = [];
    if (shotsCount) summaryBits.push('Shots: ' + shotsCount);
    if (!scenes.length) summaryBits.push('Use Stripe checkout to unlock generation.');
    if (pendingSessionId) summaryBits.push('Checkout session: ' + pendingSessionId.slice(0, 10) + '…');
    if (!summaryBits.length) summaryBits.push('Ready when you are.');
    summary.textContent = summaryBits.join(' • ');

    const genBtn = document.getElementById('genKeyframes');
    genBtn.addEventListener('click', () => {
      if (!Array.isArray(scenes) || !scenes.length) { alert('No scenes available yet.'); return; }
      const payload = { storyboard: { scenes } };
      if (pendingSessionId) payload.paymentSessionId = pendingSessionId;
      const original = genBtn.textContent;
      genBtn.disabled = true;
      genBtn.textContent = 'Generating…';
      pushBanner({ type: 'info', message: 'Generating keyframes…' }, null);
      callTool('music.generate_keyframes', payload);
      setTimeout(() => { genBtn.disabled = false; genBtn.textContent = original; }, 4000);
    });

    document.getElementById('buyKeyframes').addEventListener('click', () => {
      if (!shotsCount) { alert('No shots to purchase.'); return; }
      const email = window.prompt('Email for Stripe receipt (optional)');
      const input = { product: 'image', quantity: Math.max(1, shotsCount), context: 'storyboard' };
      if (email) input.email = email;
      pushBanner({ type: 'info', message: 'Generating Stripe checkout…' }, null);
      callTool('music.create_checkout_session', input);
    });

    document.getElementById('saveProject').addEventListener('click', () => {
      window.open('https://sunova.app/signup', '_blank', 'noopener');
    });
  </script>
  </body></html>
        `.trim(),
        _meta: {
          "openai/widgetDescription": "Displays scenes and shots with generated keyframe images for the storyboard.",
          "openai/widgetPrefersBorder": true,
          "openai/widgetCSP": {
            connect_domains: ["" + PUBLIC_BASE_URL + ""],
            resource_domains: ["" + PUBLIC_BASE_URL + ""]
          }
        }
      }
    ]
  })
);

server.registerResource(
  "render-ui",
  "ui://music-video/render.html",
  {},
  async () => ({
    contents: [
      {
        uri: "ui://music-video/render.html",
        mimeType: "text/html+skybridge",
        text: `
<!doctype html>
<html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/>
<style>
  body{font-family:ui-sans-serif,system-ui,Arial;margin:0;padding:16px;background:linear-gradient(135deg,#fef3c7 0%,#fde68a 45%,#f97316 100%);color:#0f172a}
  .card{background:#fff;border:1px solid rgba(255,255,255,.4);border-radius:20px;padding:20px 22px;box-shadow:0 18px 45px -22px rgba(217,119,6,.6);max-width:720px;margin:0 auto}
  h3{margin:0 0 12px;font-size:22px;font-weight:600;color:#9a3412}
  pre{background:#0f172a;color:#f1f5f9;border-radius:12px;padding:14px;font-size:12px;max-height:200px;overflow:auto;border:1px solid rgba(255,255,255,.1)}
  .banner{padding:13px 14px;border-radius:12px;margin-bottom:14px;font-size:14px;border:1px solid transparent}
  .banner.success{background:rgba(34,197,94,.12);border-color:#22c55e;color:#166534}
  .banner.warning{background:rgba(249,115,22,.12);border-color:#f97316;color:#9a3412}
  .banner.info{background:rgba(59,130,246,.12);border-color:#3b82f6;color:#1d4ed8}
  .muted{color:#475569;font-size:13px;text-align:center;margin:8px 0}
  .video-wrapper{margin:14px 0;border:1px dashed rgba(249,115,22,.3);border-radius:16px;background:rgba(255,255,255,.65);padding:12px;display:flex;justify-content:center;align-items:center;min-height:120px}
  video{width:100%;max-height:320px;border-radius:10px;box-shadow:0 12px 24px -20px rgba(249,115,22,.6)}
  .actions{margin-top:14px;display:flex;gap:10px;flex-wrap:wrap}
  button{background:linear-gradient(135deg,#f97316,#ec4899);color:#fff;border:none;border-radius:999px;padding:10px 18px;font-size:14px;font-weight:600;cursor:pointer;transition:transform .15s ease,box-shadow .15s ease}
  button:hover{transform:translateY(-1px);box-shadow:0 10px 24px -16px rgba(236,72,153,.8)}
  button:disabled{opacity:.6;cursor:not-allowed;box-shadow:none;transform:none}
  .progress{margin-top:12px;background:rgba(255,255,255,.6);border-radius:999px;height:10px;overflow:hidden;border:1px solid rgba(17,24,39,.12);display:none;position:relative}
  .progress span{display:block;height:100%;background:linear-gradient(135deg,#fb923c,#f97316);transition:width .3s ease;box-shadow:0 4px 12px -6px rgba(249,115,22,.65)}
  .progress span.indeterminate{width:35%;animation:progressSweep 1.4s infinite ease-in-out}
  @keyframes progressSweep{0%{transform:translateX(-120%);}50%{transform:translateX(10%);}100%{transform:translateX(220%);}}
  .progress-label{margin-top:6px;font-size:12px;color:#9a3412;text-align:right;display:none}
</style>
</head><body>
  <div class="card">
    <h3>Render Status</h3>
    <div id="renderBanner"></div>
    <pre id="status"></pre>
    <div class="progress" id="progressBarWrap"><span id="progressBar"></span></div>
    <div class="progress-label" id="progressLabel"></div>
    <div id="video" class="video-wrapper"></div>
    <div class="actions">
      <button id="refresh">Refresh Status</button>
      <button id="mux">Mux With Original Audio</button>
      <button id="downloadAssets">Download Assets</button>
    </div>
  </div>
  <script type="module">
    const data = window.openai?.toolOutput || {};
    const statusEl = document.getElementById('status');
    const bannerEl = document.getElementById('renderBanner');
    const videoWrap = document.getElementById('video');
    const progressWrap = document.getElementById('progressBarWrap');
    const progressBar = document.getElementById('progressBar');
    const progressLabel = document.getElementById('progressLabel');
    const downloadBtn = document.getElementById('downloadAssets');
    const assets = Array.isArray(data?.assets) ? data.assets : [];

    const callTool = (name, input) => {
      if (window.openai && typeof window.openai.callTool === 'function') {
        window.openai.callTool(name, input);
      } else {
        window.parent?.postMessage({ type: 'call-tool', tool: name, input }, '*');
      }
    };

    const renderBanner = (banner) => {
      bannerEl.innerHTML = '';
      if (!banner) return;
      const div = document.createElement('div');
      div.className = 'banner ' + banner.type;
      div.textContent = banner.message;
      bannerEl.appendChild(div);
    };

    const fallbackBanner = () => {
      if (data.state === 'processing') {
        renderBanner({ type: 'info', message: 'Sora is rendering your video. Refresh in a few moments.' });
      } else if (data.state === 'completed' && data.videoUrl) {
        renderBanner({ type: 'success', message: 'Render completed! Enjoy your video below.' });
      } else if (data.state === 'queued') {
        renderBanner({ type: 'info', message: 'Render queued. We will start as soon as resources free up.' });
      }
    };

    renderBanner(data.banner || null);
    if (!data.banner) fallbackBanner();

    statusEl.textContent = JSON.stringify({ state: data.state, details: data.details }, null, 2);

    videoWrap.innerHTML = '';
    if (data.videoUrl) {
      const video = document.createElement('video');
      video.controls = true;
      video.src = data.videoUrl;
      videoWrap.appendChild(video);
    } else {
      const placeholder = document.createElement('div');
      placeholder.className = 'muted';
      placeholder.textContent = 'Video not ready yet.';
      videoWrap.appendChild(placeholder);
    }

    if (data.state === 'processing') {
      progressWrap.style.display = 'block';
      progressLabel.style.display = 'block';
      if (typeof data?.details?.progress === 'number') {
        progressBar.classList.remove('indeterminate');
        progressBar.style.width = Math.min(100, Math.max(0, data.details.progress)) + '%';
        progressLabel.textContent = 'Progress: ' + data.details.progress + '%';
      } else {
        progressBar.classList.add('indeterminate');
        progressBar.style.width = '35%';
        progressLabel.textContent = 'Progress: calculating…';
      }
      setTimeout(() => callTool('music.get_video_status', { id: data.details?.id }), 6000);
    } else {
      progressWrap.style.display = 'none';
      progressLabel.style.display = 'none';
      progressBar.classList.remove('indeterminate');
    }

    const refreshBtn = document.getElementById('refresh');
    refreshBtn.addEventListener('click', () => {
      const id = data?.details?.id; if (!id) { alert('No render id to refresh.'); return; }
      refreshBtn.disabled = true; const original = refreshBtn.textContent; refreshBtn.textContent = 'Refreshing…';
      callTool('music.get_video_status', { id });
      setTimeout(() => { refreshBtn.disabled = false; refreshBtn.textContent = original; }, 2500);
    });

    document.getElementById('mux').addEventListener('click', () => {
      const id = data?.details?.id; const au = data?.details?.requestedAudioUrl;
      if (!id) { alert('No render id available.'); return; }
      if (!au) { alert('No original audio available to mux.'); return; }
      callTool('music.mux_after_render', { videoId: id, audioUrl: au });
    });

    if (downloadBtn) {
      downloadBtn.disabled = !(data?.videoUrl);
      downloadBtn.addEventListener('click', () => {
        if (!data?.details?.id) { alert('No render id available.'); return; }
        if (!data?.videoUrl) { alert('Video not ready yet.'); return; }
        const keyframes = [];
        assets.forEach((scene, si) => {
          const shots = Array.isArray(scene?.shots) ? scene.shots : [];
          shots.forEach((shot, ji) => {
            if (typeof shot?.keyframe === 'string' && shot.keyframe.startsWith('data:image')) {
              keyframes.push({ scene: si + 1, shot: ji + 1, dataUrl: shot.keyframe });
            }
          });
        });
        callTool('music.download_assets_bundle', {
          videoId: data.details.id,
          videoUrl: data.videoUrl,
          audioUrl: data?.details?.requestedAudioUrl,
          keyframes,
          context: 'render'
        });
      });
    }
  </script>
  </body></html>
        `.trim(),
        _meta: {
          "openai/widgetDescription": "Shows Sora render state and the final playable video when ready.",
          "openai/widgetPrefersBorder": true,
          "openai/widgetCSP": {
            connect_domains: ["" + PUBLIC_BASE_URL + ""],
            resource_domains: ["" + PUBLIC_BASE_URL + ""]
          }
        }
      }
    ]
  })
);

// UI: Timeline NLE-like view
server.registerResource(
  "timeline-ui",
  "ui://music-video/timeline.html",
  {},
  async () => ({
    contents: [
      {
        uri: "ui://music-video/timeline.html",
        mimeType: "text/html+skybridge",
        text: `
<!doctype html>
<html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/>
<style>
  body{font-family:ui-sans-serif,system-ui,Arial;margin:0;padding:16px;background:linear-gradient(135deg,#fff7ed 0%,#fde68a 45%,#fb923c 100%);color:#111827}
  h3{margin:0 0 12px;font-size:22px;font-weight:600;color:#9a3412}
  .toolbar{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px}
  button{background:linear-gradient(135deg,#f97316,#ec4899);color:#fff;border:none;border-radius:999px;padding:9px 18px;font-size:14px;font-weight:600;cursor:pointer;transition:transform .15s ease,box-shadow .15s ease}
  button:hover{transform:translateY(-1px);box-shadow:0 12px 28px -18px rgba(236,72,153,.7)}
  button:disabled{opacity:.6;cursor:not-allowed;transform:none;box-shadow:none}
  .banner{padding:13px;border-radius:12px;margin-bottom:12px;font-size:14px;border:1px solid transparent;box-shadow:0 10px 24px -22px rgba(249,115,22,.6)}
  .banner.success{background:rgba(34,197,94,.12);border-color:#22c55e;color:#166534}
  .banner.warning{background:rgba(249,115,22,.12);border-color:#f97316;color:#9a3412}
  .banner.info{background:rgba(59,130,246,.12);border-color:#3b82f6;color:#1d4ed8}
  .muted{color:#475569;font-size:13px;margin-bottom:10px}
  .checkout{display:flex;flex-direction:column;gap:6px;margin-bottom:14px}
  .checkout a{color:#f97316;text-decoration:none;font-weight:600}
  .timeline{display:flex;flex-direction:column;gap:16px}
  .scene{background:#fff;border:1px solid rgba(249,115,22,.2);border-radius:16px;padding:12px;box-shadow:0 12px 30px -20px rgba(251,146,60,.55);opacity:0;transform:translateY(12px)}
  .scene h4{margin:0 0 8px;font-size:15px}
  .shots{display:flex;gap:8px;overflow-x:auto;padding:6px 0}
  .shot{flex:0 0 auto;border:1px solid rgba(249,115,22,.25);border-radius:12px;background:#fff7ed;width:180px;box-shadow:0 6px 18px -16px rgba(249,115,22,.4);opacity:0;transform:translateY(8px)}
  .shot img{display:block;width:180px;height:102px;object-fit:cover;border-radius:12px 12px 0 0;border-bottom:1px solid rgba(249,115,22,.25)}
  .shot .meta{padding:8px 10px;font-size:12px;color:#4338ca}
  .beats{display:flex;gap:2px;margin-top:8px}
  .beat{width:8px;height:6px;background:#fcd34d;border-radius:2px;opacity:.6}
  .beat.strong{background:#f97316;opacity:1}
  .empty{color:#9ca3af;text-align:center;font-style:italic;padding:24px 0}
</style>
</head><body>
  <h3>Timeline</h3>
  <div class="toolbar">
    <button id="renderVideo">Render Video</button>
    <button id="buyVideo">Buy Video Credits (Stripe)</button>
    <button id="saveProjectVideo">Save Project on Sunova</button>
  </div>
  <div id="timelineBanner"></div>
  <p id="timelineSummary" class="muted"></p>
  <div id="timelineCheckout" class="checkout"></div>
  <div id="timelineRoot"></div>
  <script type="module">
    const toolData = window.openai?.toolOutput || {};
    const scenes = Array.isArray(toolData.scenes) ? toolData.scenes : [];
    const beats = Array.isArray(toolData.beats) ? toolData.beats : [];
    const checkout = (toolData && toolData.url) ? toolData : null;
    let pendingSessionId = checkout && checkout.sessionId ? checkout.sessionId : null;
    const bannerData = toolData && toolData.banner ? toolData.banner : null;
    if (bannerData && bannerData.type === 'success') pendingSessionId = null;

    const root = document.getElementById('timelineRoot');
    const bannerBox = document.getElementById('timelineBanner');
    const summary = document.getElementById('timelineSummary');
    const checkoutBox = document.getElementById('timelineCheckout');
    root.innerHTML = '';
    bannerBox.innerHTML = '';
    summary.textContent = '';
    checkoutBox.innerHTML = '';

    const pushBanner = (banner, fallback) => {
      if (banner && banner.message) {
        const div = document.createElement('div');
        div.className = 'banner ' + banner.type;
        div.textContent = banner.message;
        bannerBox.appendChild(div);
      } else if (fallback) {
        const div = document.createElement('div');
        div.className = 'banner info';
        div.textContent = fallback;
        bannerBox.appendChild(div);
      }
    };

    if (checkout && checkout.url) {
      const info = document.createElement('div'); info.className = 'muted'; info.textContent = 'Checkout session created. Complete payment before rendering.';
      const link = document.createElement('a'); link.href = checkout.url; link.target = '_blank'; link.rel = 'noopener noreferrer'; link.textContent = 'Open Stripe Checkout';
      checkoutBox.append(info, link);
      if (checkout.amount_cents) {
        const amount = document.createElement('div'); amount.className = 'muted'; amount.textContent = 'Amount: $' + (checkout.amount_cents / 100).toFixed(2);
        checkoutBox.appendChild(amount);
      }
    }

    if (!scenes.length) {
      root.innerHTML = '<div class="empty">No shots yet.</div>';
      pushBanner(bannerData, checkout ? 'Complete payment, then press Render Video.' : 'Generate keyframes to populate the timeline.');
    } else {
      const timeline = document.createElement('div'); timeline.className = 'timeline';
      scenes.forEach((s, i) => {
        const card = document.createElement('div'); card.className = 'scene';
        const title = document.createElement('h4'); title.textContent = 'Scene ' + (i+1) + ': ' + (s.title || ''); card.appendChild(title);
        const shotsWrap = document.createElement('div'); shotsWrap.className = 'shots';
        (s.shots || []).forEach((sh, j) => {
          const shot = document.createElement('div'); shot.className = 'shot';
          const img = document.createElement('img'); img.src = sh.keyframe || 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22170%22 height=%2296%22><rect width=%22170%22 height=%2296%22 fill=%22%23f3f4f6%22/><text x=%2240%22 y=%2254%22 font-size=%2210%22 fill=%22%23999%22>pending</text></svg>';
          const meta = document.createElement('div'); meta.className = 'meta';
          const duration = sh.durationMs ? ' • ' + Math.round(sh.durationMs/1000) + 's' : '';
          meta.innerHTML = '<strong>Shot ' + (j+1) + '</strong>' + duration + (sh.prompt ? '<div>' + sh.prompt + '</div>' : '');
          shot.append(img, meta);
          shotsWrap.appendChild(shot);
        });
        card.appendChild(shotsWrap);
        if (beats.length) {
          const beatsRow = document.createElement('div'); beatsRow.className = 'beats';
          beats.slice(0, 64).forEach((_, idx) => {
            const dot = document.createElement('div'); dot.className = 'beat' + (idx % 4 === 0 ? ' strong' : '');
            beatsRow.appendChild(dot);
          });
          card.appendChild(beatsRow);
        }
        timeline.appendChild(card);
      });
      root.appendChild(timeline);
      pushBanner(bannerData, null);
    }

    const callTool = (name, input) => {
      if (window.openai && typeof window.openai.callTool === 'function') {
        window.openai.callTool(name, input);
      } else {
        window.parent?.postMessage({ type: 'call-tool', tool: name, input }, '*');
      }
    };

    const shotsCount = scenes.reduce((total, scene) => total + (Array.isArray(scene.shots) ? scene.shots.length : 0), 0);
    const summaryBits = [];
    if (shotsCount) summaryBits.push('Shots: ' + shotsCount);
    if (beats.length) summaryBits.push('Beats tracked: ' + beats.length);
    if (!scenes.length) summaryBits.push('Use Stripe checkout to unlock rendering.');
    if (pendingSessionId) summaryBits.push('Checkout session: ' + pendingSessionId.slice(0, 10) + '…');
    if (!summaryBits.length) summaryBits.push('Ready when you are.');
    summary.textContent = summaryBits.join(' • ');

    const renderBtn = document.getElementById('renderVideo');
    renderBtn.addEventListener('click', () => {
      if (!Array.isArray(scenes) || !scenes.length) { alert('No scenes available.'); return; }
      const audioUrl = toolData.audioUrl || (toolData.analysis && toolData.analysis.audioUrl) || '';
      if (!audioUrl) {
        const proceed = window.confirm('No audio track detected. Continue anyway?');
        if (!proceed) return;
      }
      const payload = { storyboard: { scenes } };
      if (audioUrl) payload.audioUrl = audioUrl;
      if (pendingSessionId) payload.paymentSessionId = pendingSessionId;
      const original = renderBtn.textContent;
      renderBtn.disabled = true;
      renderBtn.textContent = 'Rendering…';
      pushBanner({ type: 'info', message: 'Rendering video with Sora…' }, null);
      callTool('music.render_video', payload);
      setTimeout(() => { renderBtn.disabled = false; renderBtn.textContent = original; }, 4000);
    });

    document.getElementById('buyVideo').addEventListener('click', () => {
      if (!shotsCount) { alert('No shots to purchase.'); return; }
      const email = window.prompt('Email for Stripe receipt (optional)');
      const input = { product: 'video', quantity: Math.max(1, shotsCount), context: 'timeline' };
      if (email) input.email = email;
      pushBanner({ type: 'info', message: 'Generating Stripe checkout…' }, null);
      callTool('music.create_checkout_session', input);
    });

    document.getElementById('saveProjectVideo').addEventListener('click', () => {
      window.open('https://sunova.app/signup', '_blank', 'noopener');
    });
  </script>
  </body></html>
        `.trim(),
        _meta: {
          "openai/widgetDescription": "Shows shots per scene in a horizontal, NLE-style timeline with optional beat markers.",
          "openai/widgetPrefersBorder": true,
          "openai/widgetCSP": {
            connect_domains: ["" + PUBLIC_BASE_URL + ""],
            resource_domains: ["" + PUBLIC_BASE_URL + ""]
          }
        }
      }
    ]
  })
);

// UI: Audio analysis code viewer
server.registerResource(
  "analysis-ui",
  "ui://music-video/analysis.html",
  {},
  async () => ({
    contents: [
      {
        uri: "ui://music-video/analysis.html",
        mimeType: "text/html+skybridge",
        text: `
<!doctype html>
<html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/>
<style>
  body{font-family:ui-sans-serif,system-ui,Arial;margin:0;padding:16px}
  .card{border:1px solid #ddd;border-radius:8px;padding:12px;margin-bottom:12px}
  textarea{width:100%;height:360px;font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;font-size:12px}
  code, pre{white-space:pre-wrap}
  .muted{color:#666}
  button{padding:6px 10px;border:1px solid #ccc;border-radius:6px;background:#f7f7f7;cursor:pointer}
  .row{display:flex;gap:8px;align-items:center}
  .mono{font-family:ui-monospace,monospace}
  input[type=text]{width:100%;padding:6px 10px;border:1px solid #ccc;border-radius:6px}
  .small{font-size:12px}
  .kbd{font-family:ui-monospace,monospace;background:#f1f1f1;padding:2px 6px;border-radius:4px}
  .grid{display:grid;grid-template-columns:1fr;gap:12px}
  @media (min-width: 900px){ .grid{ grid-template-columns: 1fr 1fr } }
 </style>
</head><body>
  <div class="card">
    <h3>Audio Analysis</h3>
    <p class="muted small">BPM, beatmap, energy, and genre. If Python code is present, ChatGPT will execute it server‑side.</p>
    <div class="grid">
      <div>
        <h4>Results</h4>
        <pre id="results" class="mono small">waiting…</pre>
      </div>
      <div>
        <h4>Python (for transparency)</h4>
        <textarea id="code" spellcheck="false"></textarea>
        <div class="row" style="margin-top:8px">
          <button id="copy">Copy Script</button>
          <button id="copyCmd">Copy Command</button>
        </div>
      </div>
    </div>
  </div>
  <script type="module">
    const data = window.openai?.toolOutput || {};
    const code = data.python || '# no code';
    const analysis = data.analysis || null;
    document.getElementById('code').value = code;
    const resEl = document.getElementById('results');
    resEl.textContent = analysis ? JSON.stringify(analysis, null, 2) : 'No analysis yet. Run the tool to execute Python and return JSON.';
    document.getElementById('copy').onclick = () => navigator.clipboard?.writeText(code);
    document.getElementById('copyCmd').onclick = () => navigator.clipboard?.writeText((data.suggestedCommand||'').trim());
  </script>
  </body></html>
        `.trim(),
        _meta: {
          "openai/widgetDescription": "Shows a ready-to-run Python script for audio beatmap, energy, and genre analysis.",
          "openai/widgetPrefersBorder": true,
          "openai/widgetCSP": {
            connect_domains: ["" + PUBLIC_BASE_URL + ""],
            resource_domains: ["" + PUBLIC_BASE_URL + ""]
          }
        }
      }
    ]
  })
);

// Schemas
const TranscribeInputShape = {
  audioUrl: z
    .string()
    .url()
    .describe("Public HTTPS URL to the audio that should be transcribed. Use this when the user shares a link instead of uploading a file.")
    .optional(),
  fileId: z
    .string()
    .describe("ChatGPT file ID for an uploaded audio attachment in the current conversation. Prefer this over audioUrl when present.")
    .optional(),
  language: z
    .string()
    .describe("Optional BCP-47 language code (for example 'en' or 'es') to bias Whisper toward the correct language.")
    .optional()
} satisfies Record<string, ZodTypeAny>;
const TranscribeInputBase = z.object(TranscribeInputShape);
const TranscribeInput = TranscribeInputBase.refine(
  (v) => !!(v.audioUrl || v.fileId),
  { message: "Provide audioUrl or fileId" }
);

const StoryboardInputShape = {
  lyrics: z
    .string()
    .min(1)
    .describe("Full lyrics or narrative description that should drive the storyboard. Provide at least a chorus or verse."),
  artist: z
    .string()
    .describe("Optional artist name to ground visual references.")
    .optional(),
  style: z
    .string()
    .describe("Optional cinematic or artistic direction such as 'neo-noir' or 'anime montage'.")
    .optional(),
  durationSeconds: z
    .number()
    .int()
    .positive()
    .describe("Optional target video length in seconds. Use when the user specifies the song duration.")
    .optional()
} satisfies Record<string, ZodTypeAny>;
const StoryboardInput = z.object(StoryboardInputShape);

const KeyframesInputShape = {
  storyboard: z
    .object({
      scenes: z
        .array(
          z.object({
            title: z.string().describe("Optional scene title displayed in the UI.").optional(),
            shots: z
              .array(
                z.object({
                  prompt: z.string().describe("Visual prompt describing composition, subject, and style for the shot."),
                  timing: z.string().describe("Optional timing or lyric reference for the shot.").optional()
                })
              )
              .describe("Ordered list of shots within the scene.")
          })
        )
        .describe("Storyboard scenes to convert into keyframe images.")
    })
    .describe("Storyboard produced by music.generate_storyboard including scenes and shots."),
  aspectRatio: z
    .string()
    .describe("Desired image aspect ratio in W:H form, for example '16:9' or '9:16'.")
    .default("16:9")
    .optional(),
  stylePreset: z
    .string()
    .describe("Optional art-direction keyword to append to each keyframe prompt (e.g., 'cyberpunk matte painting').")
    .optional(),
  size: z
    .string()
    .describe("OpenAI image size such as '1024x576' or '512x512'.")
    .default("1024x576")
    .optional(),
  paymentSessionId: z
    .string()
    .describe("Stripe Checkout session ID proving payment for this generation in billing-required mode.")
    .optional()
} satisfies Record<string, ZodTypeAny>;
const KeyframesInput = z.object(KeyframesInputShape);

const RenderInputShape = {
  storyboard: KeyframesInputShape.storyboard.describe("Storyboard with prompts to feed into Sora-2."),
  audioUrl: z
    .string()
    .url()
    .describe("Public HTTPS URL to the audio track that should be synced with the rendered video."),
  resolution: z
    .enum(["720p", "1080p", "4k"])
    .describe("Target output resolution. Defaults to 1080p.")
    .default("1080p")
    .optional(),
  fps: z
    .number()
    .int()
    .min(12)
    .max(60)
    .describe("Frames per second for the requested render. Defaults to 24.")
    .default(24)
    .optional(),
  style: z
    .string()
    .describe("Optional style guidance to append to the combined storyboard prompt.")
    .optional(),
  paymentSessionId: z
    .string()
    .describe("Stripe Checkout session ID confirming payment for the render when billing is required.")
    .optional()
} satisfies Record<string, ZodTypeAny>;
const RenderInput = z.object(RenderInputShape);

const CreateCheckoutInputShape = {
  product: z
    .enum(["image", "video"])
    .describe("Product type to purchase credits for: 'image' (keyframes) or 'video' (renders)."),
  quantity: z
    .number()
    .int()
    .min(1)
    .max(200)
    .describe("Number of shots to cover in the purchase. Defaults to 1.")
    .default(1)
    .optional(),
  email: z
    .string()
    .email()
    .describe("Optional customer email to prefill in Stripe if the user requests it.")
    .optional(),
  context: z
    .enum(["storyboard", "timeline", "render"])
    .describe("UI surface that triggered the checkout so the matching widget can refresh (storyboard, timeline, or render).")
    .optional()
} satisfies Record<string, ZodTypeAny>;
const CreateCheckoutInput = z.object(CreateCheckoutInputShape);

const VerifyCheckoutInputShape = {
  sessionId: z
    .string()
    .min(1)
    .describe("Stripe Checkout session ID to verify after payment completes.")
} satisfies Record<string, ZodTypeAny>;
const VerifyCheckoutInput = z.object(VerifyCheckoutInputShape);

const PresentTimelineInputShape = {
  scenes: z
    .array(
      z.object({
        title: z.string().describe("Optional scene title displayed above the row.").optional(),
        shots: z
          .array(
            z.object({
              prompt: z.string().describe("Shot description to show in the timeline.").optional(),
              keyframe: z.string().describe("Optional image data URL to preview the shot.").optional(),
              durationMs: z
                .number()
                .describe("Optional shot duration in milliseconds for the timeline visualization.")
                .optional()
            })
          )
          .describe("Ordered shots for the scene.")
      })
    )
    .describe("Timeline scenes the UI should display."),
  beats: z
    .array(z.number().describe("Beat timestamp in seconds."))
    .describe("Optional beat grid to overlay on the timeline.")
    .optional(),
  audioUrl: z
    .string()
    .url()
    .describe("Optional audio URL so the timeline component can expose playback controls.")
    .optional()
} satisfies Record<string, ZodTypeAny>;
const PresentTimelineInput = z.object(PresentTimelineInputShape);

const ConfirmBooleanInputShape = {
  ok: z.boolean().describe("Set to true when the user approves the step, false to block or request revisions.")
} satisfies Record<string, ZodTypeAny>;
const ConfirmBooleanInput = z.object(ConfirmBooleanInputShape);

const PlanShotTimingInputShape = {
  scenes: z
    .array(
      z.object({
        title: z.string().describe("Optional scene title.").optional(),
        shots: z
          .array(
            z.object({
              prompt: z.string().describe("Shot prompt to include in the timing results."),
              timing: z.string().describe("Optional lyric timing or annotation for the shot.").optional()
            })
          )
          .describe("Shots that require duration assignments.")
      })
    )
    .describe("Storyboard scenes to calculate timings for."),
  beats: z
    .array(z.number().describe("Beat timestamp in seconds in ascending order."))
    .describe("Beat timestamps derived from audio analysis."),
  beatsPerShot: z
    .number()
    .positive()
    .describe("Number of beats to group into each shot. Defaults to 1.")
    .default(1)
    .optional(),
  padMs: z
    .number()
    .int()
    .min(0)
    .describe("Optional additional milliseconds to add to every shot duration.")
    .default(0)
    .optional()
} satisfies Record<string, ZodTypeAny>;
const PlanShotTimingInput = z.object(PlanShotTimingInputShape);

const GetVideoStatusInputShape = {
  id: z
    .string()
    .min(1)
    .describe("Video job identifier returned by music.render_video.")
} satisfies Record<string, ZodTypeAny>;
const GetVideoStatusInput = z.object(GetVideoStatusInputShape);

const RemixVideoInputShape = {
  id: z
    .string()
    .min(1)
    .describe("Completed video ID to remix using Sora-2."),
  prompt: z
    .string()
    .min(1)
    .describe("Creative instructions for the remix (e.g., add lighting tweaks or alternate mood).")
} satisfies Record<string, ZodTypeAny>;
const RemixVideoInput = z.object(RemixVideoInputShape);

const MuxAfterRenderInputShape = {
  videoId: z
    .string()
    .min(1)
    .describe("Completed Sora job ID whose video should be downloaded for muxing."),
  audioUrl: z
    .string()
    .url()
    .describe("Public HTTPS URL to the mastered audio track that should replace the render's scratch audio."),
  filename: z
    .string()
    .describe("Optional output filename for the muxed MP4 returned by ChatGPT.")
    .optional()
} satisfies Record<string, ZodTypeAny>;
const MuxAfterRenderInput = z.object(MuxAfterRenderInputShape);

const DownloadAssetsInputShape = {
  videoId: z
    .string()
    .min(1)
    .describe("Video job ID whose assets should be downloaded."),
  videoUrl: z
    .string()
    .url()
    .describe("Optional direct video URL to override the default proxy.")
    .optional(),
  audioUrl: z
    .string()
    .url()
    .describe("Optional audio URL to include in the ZIP bundle.")
    .optional(),
  keyframes: z
    .array(
      z.object({
        scene: z.number().describe("Optional scene index for the keyframe (1-based).").optional(),
        shot: z.number().describe("Optional shot index for the keyframe (1-based).").optional(),
        dataUrl: z.string().describe("Base64 data URL for the keyframe image to include in the bundle.")
      })
    )
    .describe("Optional list of keyframes to package alongside the video.")
    .optional(),
  filename: z
    .string()
    .describe("Optional ZIP filename to hand back to the user.")
    .optional(),
  context: z
    .enum(["render"])
    .describe("UI surface requesting the bundle. Currently only 'render' is supported.")
    .optional()
} satisfies Record<string, ZodTypeAny>;
const DownloadAssetsInput = z.object(DownloadAssetsInputShape);

const AudioAnalysisPythonInputShape = {
  audioUrl: z
    .string()
    .url()
    .describe("Public HTTPS URL to the audio file that should be analysed in Python."),
  sampleRate: z
    .number()
    .int()
    .min(8000)
    .max(48000)
    .describe("Target sampling rate for Librosa loading. Defaults to 22050 Hz.")
    .default(22050)
    .optional(),
  hopLength: z
    .number()
    .int()
    .min(128)
    .max(2048)
    .describe("Librosa hop length controlling beat resolution. Defaults to 512 samples.")
    .default(512)
    .optional(),
  timeSignature: z
    .number()
    .int()
    .min(1)
    .max(12)
    .describe("Time signature numerator to infer downbeats. Defaults to 4 for common time.")
    .default(4)
    .optional()
} satisfies Record<string, ZodTypeAny>;
const AudioAnalysisPythonInput = z.object(AudioAnalysisPythonInputShape);

const PresentAnalysisInputShape = {
  bpm: z.number().describe("Calculated tempo in beats per minute."),
  beatmap: z
    .array(z.number().describe("Beat timestamp in seconds."))
    .describe("Full beat timeline to show in the analysis widget."),
  downbeats: z
    .array(z.number().describe("Downbeat timestamp in seconds."))
    .describe("Optional estimated downbeats for highlighting phrasing.")
    .optional(),
  energy: z
    .object({
      overall_rms: z.number().describe("Average RMS energy of the track."),
      label: z.string().describe("Qualitative energy description: low, medium, or high."),
      rms_series: z
        .array(
          z.object({
            t: z.number().describe("Timestamp in seconds."),
            rms: z.number().describe("RMS value at that timestamp.")
          })
        )
        .describe("Optional timeline of RMS values for plotting.")
        .optional()
    })
    .describe("Energy metrics derived from the analysis."),
  features: z
    .object({
      spectral_centroid_mean: z.number().describe("Average spectral centroid across the track.").optional(),
      spectral_bandwidth_mean: z.number().describe("Average spectral bandwidth.").optional(),
      zcr_mean: z.number().describe("Average zero-crossing rate.").optional()
    })
    .describe("Optional spectral features to display.")
    .optional(),
  genre_guess: z.string().describe("Heuristic genre label inferred from tempo and spectral features."),
  duration_sec: z.number().describe("Track duration in seconds.")
} satisfies Record<string, ZodTypeAny>;
const PresentAnalysisInput = z.object(PresentAnalysisInputShape);

type TranscribeInputData = z.infer<typeof TranscribeInputBase>;
type StoryboardInputData = z.infer<typeof StoryboardInput>;
type KeyframesInputData = z.infer<typeof KeyframesInput>;
type RenderInputData = z.infer<typeof RenderInput>;
type CreateCheckoutInputData = z.infer<typeof CreateCheckoutInput>;
type VerifyCheckoutInputData = z.infer<typeof VerifyCheckoutInput>;
type PresentTimelineInputData = z.infer<typeof PresentTimelineInput>;
type PlanShotTimingInputData = z.infer<typeof PlanShotTimingInput>;
type GetVideoStatusInputData = z.infer<typeof GetVideoStatusInput>;
type RemixVideoInputData = z.infer<typeof RemixVideoInput>;
type MuxAfterRenderInputData = z.infer<typeof MuxAfterRenderInput>;
type DownloadAssetsInputData = z.infer<typeof DownloadAssetsInput>;
type AudioAnalysisPythonInputData = z.infer<typeof AudioAnalysisPythonInput>;
type PresentAnalysisInputData = z.infer<typeof PresentAnalysisInput>;

async function requirePaymentOrContinue(kind: "image" | "video", units: number, paymentSessionId?: string) {
  if (!BILLING_REQUIRED) return { ok: true } as const;
  if (!stripe) throw new Error("Stripe not configured");
  const unitPrice = kind === "image" ? PRICE_PER_IMAGE_USD : PRICE_PER_VIDEO_USD;
  const total = Math.round(unitPrice * units * 100); // cents
  if (paymentSessionId) {
    const s = await stripe.checkout.sessions.retrieve(paymentSessionId);
    if (s.payment_status === "paid") return { ok: true, method: "stripe", session: s } as const;
    return { ok: false, reason: "payment_pending", expected_cents: total } as const;
  }
  return { ok: false, reason: "payment_required", expected_cents: total } as const;
}

// Tools
server.registerTool(
  "music.transcribe_lyrics",
  {
    title: "Transcribe Lyrics (Whisper)",
    description: "Use this when the user needs verbatim lyrics from a vocal recording. Do not use for instrumental-only audio or when they only want a summary.",
    readOnlyHint: true,
    _meta: {
      "openai/toolInvocation/invoking": "Transcribing lyrics…",
      "openai/toolInvocation/invoked": "Lyrics transcribed."
    },
    inputSchema: TranscribeInputShape
  } as any,
  async (rawInput) => {
    const { audioUrl, fileId, language } = TranscribeInput.parse(rawInput);
    let file: File;
    if (fileId) {
      const resp = await (openai as any).files.content(fileId);
      const ct = resp.headers.get("content-type") || "application/octet-stream";
      const buf = await resp.arrayBuffer();
      file = new File([buf], "audio", { type: ct });
    } else if (audioUrl) {
      const res = await fetch(audioUrl);
      if (!res.ok) throw new Error(`Failed to fetch audio: ${res.status}`);
      const ab = await res.arrayBuffer();
      file = new File([ab], "audio.mp3", { type: res.headers.get("content-type") || "audio/mpeg" });
    } else {
      throw new Error("Provide audioUrl or fileId");
    }

    const tx = await openai.audio.transcriptions.create({
      file,
      model: "whisper-1",
      language
    });

    return {
      structuredContent: { lyrics: tx.text },
      content: [{ type: "text", text: "Transcription complete." }]
    };
  }
);

server.registerTool(
  "music.generate_storyboard",
  {
    title: "Plan Storyboard",
    description: "Use this when the user wants a scene-by-scene storyboard from lyrics or a brief. Do not call if the user only needs keyframes or render updates.",
    readOnlyHint: true,
    _meta: {
      "openai/outputTemplate": "ui://music-video/storyboard2.html",
      "openai/toolInvocation/invoking": "Planning scenes and shots…",
      "openai/toolInvocation/invoked": "Storyboard ready.",
      "openai/widgetAccessible": true
    },
    inputSchema: StoryboardInputShape
  } as any,
  async (rawInput) => {
    const { lyrics, artist, style, durationSeconds } = StoryboardInput.parse(rawInput);
    const sys = `You are a music video director. Create a JSON storyboard: { scenes: [ { title, shots: [ { prompt, timing } ] } ] }. Keep 3-6 scenes, 3-6 shots per scene. Prompts should be vivid and precise.`;
    const user = [
      `Lyrics:\n${lyrics}`,
      artist ? `Artist: ${artist}` : "",
      style ? `Style: ${style}` : "",
      durationSeconds ? `Target duration (s): ${durationSeconds}` : ""
    ].filter(Boolean).join("\n");

    const resp = await openai.responses.parse({
      model: "gpt-4.1-mini",
      input: [
        { role: "system", content: sys },
        { role: "user", content: user }
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "storyboard",
          schema: {
            type: "object",
            properties: {
              scenes: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    title: { type: "string" },
                    shots: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          prompt: { type: "string" },
                          timing: { type: "string" }
                        },
                        required: ["prompt"],
                        additionalProperties: true
                      }
                    }
                  },
                  required: ["shots"],
                  additionalProperties: true
                }
              }
            },
            required: ["scenes"],
            additionalProperties: true
          }
        }
      }
    });

    const parsed = resp.output_parsed;
    if (!parsed || typeof parsed !== "object" || !("scenes" in parsed)) {
      throw new Error("Storyboard response missing scenes");
    }
    const data = parsed as { scenes: Array<{ title?: string; shots: Array<{ prompt: string; timing?: string }> }> };
    return {
      structuredContent: { scenes: data.scenes },
      content: [{ type: "text", text: "Storyboard generated. You can proceed to generate keyframes." }]
    };
  }
);

server.registerTool(
  "music.generate_keyframes",
  {
    title: "Generate Keyframe Images",
    description: "Use this when the user has a storyboard and needs visual keyframes for each shot. Do not trigger before a storyboard exists or when only audio analysis is requested.",
    _meta: {
      "openai/outputTemplate": "ui://music-video/storyboard2.html",
      "openai/toolInvocation/invoking": "Creating keyframes…",
      "openai/toolInvocation/invoked": "Keyframes ready.",
      "openai/widgetAccessible": true
    },
    inputSchema: KeyframesInputShape
  } as any,
  async (rawInput) => {
    const { storyboard, aspectRatio = "16:9", stylePreset, size = "1024x576", paymentSessionId } =
      KeyframesInput.parse(rawInput);
    // Billing gate
    const shotCount = storyboard.scenes.reduce((acc, s) => acc + (s.shots?.length || 0), 0);
    const allowed = await requirePaymentOrContinue("image", shotCount, paymentSessionId);
    if (!allowed.ok) {
      return {
        structuredContent: {
          state: allowed.reason,
          details: {
            expected_cents: (allowed as any).expected_cents,
            kind: "image",
            shots: shotCount,
            billing_mode: "stripe"
          },
          banner: {
            type: "warning",
            message: "Complete your Stripe checkout from the link above, then click Generate Keyframes again."
          }
        },
        content: [{ type: "text", text: "Payment required before generating keyframes. Use the Stripe checkout button in the widget, complete payment, then retry." }],
        _meta: { hint: "Use the Buy Keyframe Credits button, finish checkout, then press Generate Keyframes.", shots: shotCount }
      };
    }
    const paymentMethod = (allowed as any).method || (paymentSessionId ? "stripe" : "unknown");
    const outScenes: any[] = [];
    for (const scene of storyboard.scenes) {
      const outShots: any[] = [];
      for (const shot of scene.shots) {
        const prompt = [shot.prompt, stylePreset ? `Style: ${stylePreset}` : "", `Aspect: ${aspectRatio}`]
          .filter(Boolean)
          .join("; ");
        const img = await openai.images.generate({
          model: "gpt-image-1",
          prompt,
          size: size as any,
          response_format: "b64_json"
        });
        const b64 = img.data?.[0]?.b64_json || "";
        const dataUrl = `data:image/png;base64,${b64}`;
        outShots.push({ ...shot, keyframe: dataUrl });
      }
      outScenes.push({ title: scene.title, shots: outShots });
    }

    return {
      structuredContent: {
        scenes: outScenes,
        billing: { method: paymentMethod },
        banner: paymentMethod === "stripe"
          ? { type: "success", message: "Stripe payment confirmed! Keyframes are ready." }
          : undefined
      },
      content: [{ type: "text", text: "Keyframes generated for storyboard shots." }]
    };
  }
);

// Present timeline from storyboard/keyframes and optional beats
server.registerTool(
  "music.present_timeline",
  {
    title: "Show Timeline",
    description: "Use this when the user wants to review shots on a horizontal timeline. Do not use before any keyframes or durations exist.",
    readOnlyHint: true,
    _meta: {
      "openai/outputTemplate": "ui://music-video/timeline.html",
      "openai/toolInvocation/invoking": "Building timeline…",
      "openai/toolInvocation/invoked": "Timeline ready.",
      "openai/widgetAccessible": true
    },
    inputSchema: PresentTimelineInputShape
  } as any,
  async (rawInput) => {
    const { scenes, beats, audioUrl } = PresentTimelineInput.parse(rawInput);
    return {
      structuredContent: { scenes, beats, audioUrl },
      content: [{ type: "text", text: "Timeline presented." }]
    };
  }
);

// Simple confirmation tools
server.registerTool(
  "music.confirm_storyboard",
  {
    title: "Confirm Storyboard",
    description: "Use this when the user explicitly approves or rejects the storyboard. Do not invoke without a clear user decision.",
    readOnlyHint: true,
    inputSchema: ConfirmBooleanInputShape
  } as any,
  async (rawInput) => {
    const { ok } = ConfirmBooleanInput.parse(rawInput);
    return {
      structuredContent: { ok, stage: "storyboard_confirmed" },
      content: [{ type: "text", text: ok ? "Storyboard approved." : "Storyboard rejected." }]
    };
  }
);
server.registerTool(
  "music.confirm_shots",
  {
    title: "Confirm Shots",
    description: "Use this when the user signs off on the shot plan. Do not auto-approve without explicit confirmation.",
    readOnlyHint: true,
    inputSchema: ConfirmBooleanInputShape
  } as any,
  async (rawInput) => {
    const { ok } = ConfirmBooleanInput.parse(rawInput);
    return {
      structuredContent: { ok, stage: "shots_confirmed" },
      content: [{ type: "text", text: ok ? "Shots approved." : "Shots rejected." }]
    };
  }
);

// Plan shot timing from beats (simple heuristic packing)
server.registerTool(
  "music.plan_shot_timing",
  {
    title: "Plan Shot Timing",
    description: "Use this when the user wants to map beats to shot durations. Do not run without beat timestamps from audio analysis.",
    readOnlyHint: true,
    inputSchema: PlanShotTimingInputShape
  } as any,
  async (rawInput) => {
    const { scenes, beats, beatsPerShot = 1, padMs = 0 } = PlanShotTimingInput.parse(rawInput);
    if (!beats?.length) return { structuredContent: { scenes }, content: [{ type: "text", text: "No beats provided; left durations unset." }] };
    const intervals: number[] = [];
    for (let i = 1; i < beats.length; i++) intervals.push((beats[i] - beats[i - 1]) * 1000);
    const avg = intervals.length ? intervals.reduce((a, b) => a + b, 0) / intervals.length : 500;
    const perShotMs = Math.max(300, avg * beatsPerShot);
    const out = scenes.map(s => ({
      title: s.title,
      shots: s.shots.map(sh => ({ ...sh, durationMs: Math.round(perShotMs + padMs) }))
    }));
    return {
      structuredContent: { scenes: out },
      content: [{ type: "text", text: `Assigned ~${Math.round(perShotMs)}ms per shot from beats (beatsPerShot=${beatsPerShot}).` }]
    };
  }
);

server.registerTool(
  "music.render_video",
  {
    title: "Render Music Video (Sora‑2)",
    description: "Use this when the user has approved shots and wants Sora-2 to render the full video. Do not invoke before payment is confirmed when billing is required.",
    _meta: {
      "openai/outputTemplate": "ui://music-video/render.html",
      "openai/toolInvocation/invoking": "Rendering with Sora‑2…",
      "openai/toolInvocation/invoked": "Render completed.",
      "openai/widgetAccessible": true
    },
    inputSchema: RenderInputShape
  } as any,
  async (rawInput) => {
    const { storyboard, audioUrl, resolution = "1080p", fps = 24, style, paymentSessionId } =
      RenderInput.parse(rawInput);
    // Billing gate
    const shotCount = storyboard.scenes.reduce((acc, s) => acc + (s.shots?.length || 0), 0);
    const allowed = await requirePaymentOrContinue("video", shotCount, paymentSessionId);
    if (!allowed.ok) {
      return {
        structuredContent: {
          state: allowed.reason,
          details: {
            expected_cents: (allowed as any).expected_cents,
            kind: "video",
            shots: shotCount,
            billing_mode: "stripe"
          },
          banner: {
            type: "warning",
            message: "Finish the Stripe payment from the link above, then click Render Video again."
          }
        },
        content: [{ type: "text", text: "Payment required before rendering video. Use the Stripe checkout button in the timeline widget, then retry render." }],
        _meta: { hint: "Use the Buy Video Credits button, finish checkout, then press Render Video.", shots: shotCount }
      };
    }
    const paymentMethod = (allowed as any).method || (paymentSessionId ? "stripe" : "unknown");
    const prompts: string[] = [];
    storyboard.scenes.forEach((s, i) => s.shots.forEach((sh, j) => {
      prompts.push(`Scene ${i+1} Shot ${j+1}: ${sh.prompt}`);
    }));
    const totalShots = prompts.length;
    const basePrompt = [
      style ? `Style: ${style}` : "",
      `Target FPS: ${fps}`,
      `Shots: ${totalShots}`
    ].filter(Boolean).join("; ");
    const size = resolution === "4k" ? "3840x2160" : resolution === "720p" ? "1280x720" : "1920x1080";

    const job = await (openai as any).videos.create({
      model: "sora-2",
      prompt: `${basePrompt}\n\n${prompts.join("\n")}`,
      size
    });
    try {
      if (audioUrl) audioByVideoId.set(job.id, audioUrl);
      storyboardByVideoId.set(job.id, storyboard);
    } catch {}

    return {
      structuredContent: {
        state: job.status || "queued",
        details: { id: job.id, size, fps, requestedAudioUrl: audioUrl, billing: { method: paymentMethod } },
        videoUrl: null,
        assets: storyboard.scenes,
        banner: paymentMethod === "stripe"
          ? { type: "success", message: "Stripe payment confirmed! Rendering has started." }
          : undefined
      },
      content: [{ type: "text", text: `Video job created (${job.id}). Use music.get_video_status to poll until complete.` }]
    };
  }
);

// Poll job status and expose a playable proxy URL when completed
server.registerTool(
  "music.get_video_status",
  {
    title: "Get Video Status",
    description: "Use this when the user wants progress on a render job. Do not call before music.render_video has returned an ID.",
    readOnlyHint: true,
    _meta: {
      "openai/outputTemplate": "ui://music-video/render.html",
      "openai/toolInvocation/invoking": "Checking render status…",
      "openai/toolInvocation/invoked": "Status updated.",
      "openai/widgetAccessible": true
    },
    inputSchema: GetVideoStatusInputShape
  } as any,
  async (rawInput) => {
    const { id } = GetVideoStatusInput.parse(rawInput);
    const v = await (openai as any).videos.retrieve(id);
    const videoUrl = v.status === "completed" ? `${PUBLIC_BASE_URL}/videos/${encodeURIComponent(id)}/content` : null;
    const requestedAudioUrl = audioByVideoId.get(id) || null;
    const assets = storyboardByVideoId.get(id) || null;
    let banner = null;
    if (v.status === "completed" && videoUrl) {
      banner = { type: "success", message: "Render complete! Enjoy your video or download assets below." };
    } else if (v.status === "processing" && typeof v.progress === "number") {
      banner = { type: "info", message: `Rendering... ${v.progress}% complete.` };
    } else if (v.status === "processing") {
      banner = { type: "info", message: "Rendering in progress. Refresh shortly for updates." };
    } else if (v.status === "failed") {
      banner = { type: "warning", message: "Render failed. Try again or contact support with the job ID." };
    }
    return {
      structuredContent: { state: v.status, details: { id, progress: v.progress ?? null, requestedAudioUrl }, videoUrl, assets, banner },
      content: [{ type: "text", text: v.status === "completed" ? "Your video is ready." : `Status: ${v.status}${typeof v.progress === "number" ? ` (${v.progress}%)` : ""}` }]
    };
  }
);

// Remix an existing completed video
server.registerTool(
  "music.remix_video",
  {
    title: "Remix Video",
    description: "Use this when the user wants to remix an existing completed video with new instructions. Do not run on jobs that are still processing.",
    inputSchema: RemixVideoInputShape
  } as any,
  async (rawInput) => {
    const { id, prompt } = RemixVideoInput.parse(rawInput);
    const r = await (openai as any).videos.remix(id, { prompt });
    return {
      structuredContent: { state: r.status || "queued", details: { id: r.id, remixed_from_video_id: r.remixed_from_video_id || id }, videoUrl: null },
      content: [{ type: "text", text: `Remix job created (${r.id}). Use music.get_video_status to poll.` }]
    };
  }
);

// Stripe: Create a checkout session for prepaid generation
server.registerTool(
  "music.create_checkout_session",
  {
    title: "Create Checkout Session",
    description: "Use this when the user needs to prepay for keyframes or renders via Stripe. Do not trigger if billing is disabled or the user is just browsing.",
    _meta: {
      "openai/toolInvocation/invoking": "Creating payment session…",
      "openai/toolInvocation/invoked": "Payment session created.",
      "openai/widgetAccessible": true
    },
    inputSchema: CreateCheckoutInputShape
  } as any,
  async (rawInput) => {
    const { product, quantity = 1, email, context } = CreateCheckoutInput.parse(rawInput);
    if (!stripe) throw new Error("Stripe not configured");
    const unitPrice = product === "image" ? PRICE_PER_IMAGE_USD : PRICE_PER_VIDEO_USD;
    const unit_amount = Math.round(unitPrice * 100);
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: email,
      success_url: `${PUBLIC_BASE_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${PUBLIC_BASE_URL}/payment/cancel`,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: product === "image" ? "Image generation" : "Video render" },
            unit_amount
          },
          quantity
        }
      ],
      metadata: { product, quantity: String(quantity) }
    });
    const template = context === "timeline"
      ? "ui://music-video/timeline.html"
      : context === "render"
        ? "ui://music-video/render.html"
        : "ui://music-video/storyboard2.html";
    const bannerMessage = product === "image"
      ? `Checkout ready for ${quantity} keyframe shot${quantity > 1 ? 's' : ''}. Complete payment, then generate images.`
      : `Checkout ready for ${quantity} video shot${quantity > 1 ? 's' : ''}. Complete payment, then render video.`;
    return {
      structuredContent: {
        url: session.url,
        sessionId: session.id,
        amount_cents: unit_amount * quantity,
        product,
        quantity,
        banner: { type: "info", message: bannerMessage }
      },
      content: [{ type: "text", text: "Open the URL to complete payment, then pass the sessionId to the generation tool as paymentSessionId." }],
      _meta: { "openai/outputTemplate": template }
    };
  }
);

server.registerTool(
  "music.verify_checkout_session",
  {
    title: "Verify Checkout Session",
    description: "Use this when the user needs confirmation that a Stripe session completed. Do not call before the user has a session ID.",
    readOnlyHint: true,
    inputSchema: VerifyCheckoutInputShape
  } as any,
  async (rawInput) => {
    const { sessionId } = VerifyCheckoutInput.parse(rawInput);
    if (!stripe) throw new Error("Stripe not configured");
    const s = await stripe.checkout.sessions.retrieve(sessionId);
    return {
      structuredContent: {
        id: s.id,
        payment_status: s.payment_status,
        amount_total: s.amount_total,
        currency: s.currency
      },
      content: [{ type: "text", text: `Session ${s.payment_status}.` }]
    };
  }
);

// Post-render: Mux original audio with generated video via Python run in ChatGPT
server.registerTool(
  "music.mux_after_render",
  {
    title: "Mux Audio Into Video",
    description: "Use this when the user wants the final video with their mastered audio merged in ChatGPT's Python sandbox. Do not call before music.render_video completes.",
    _meta: {
      "openai/outputTemplate": "ui://music-video/render.html",
      "openai/toolInvocation/invoking": "Merging audio track…",
      "openai/toolInvocation/invoked": "Mux complete.",
      "openai/widgetAccessible": true
    },
    inputSchema: MuxAfterRenderInputShape
  } as any,
  async (rawInput) => {
    const { videoId, audioUrl, filename } = MuxAfterRenderInput.parse(rawInput);
    const videoProxy = `${PUBLIC_BASE_URL}/videos/${encodeURIComponent(videoId)}/content`;
    const outName = filename || `final_${videoId}.mp4`;
    const py = `# Downloads video+audio, muxes with moviepy (imageio-ffmpeg)
import sys, subprocess, pkgutil, os
reqs = ['moviepy','requests','imageio-ffmpeg']
installed = {m.name for m in pkgutil.iter_modules()}
to_install = [p for p in reqs if p not in installed]
if to_install:
    subprocess.check_call([sys.executable, '-m', 'pip', 'install', '-q', *to_install])

import requests, tempfile
from moviepy.editor import VideoFileClip, AudioFileClip

vd_url = ${JSON.stringify(videoProxy)}
au_url = ${JSON.stringify(audioUrl)}

vd_fd, vd_path = tempfile.mkstemp(suffix='.mp4'); os.close(vd_fd)
au_fd, au_path = tempfile.mkstemp(suffix='.audio'); os.close(au_fd)

with requests.get(vd_url, stream=True, timeout=120) as r:
    r.raise_for_status()
    with open(vd_path, 'wb') as f:
        for chunk in r.iter_content(chunk_size=1<<20):
            if chunk: f.write(chunk)
with requests.get(au_url, stream=True, timeout=120) as r:
    r.raise_for_status()
    with open(au_path, 'wb') as f:
        for chunk in r.iter_content(chunk_size=1<<20):
            if chunk: f.write(chunk)

video = VideoFileClip(vd_path)
audio = AudioFileClip(au_path)
video = video.set_audio(audio)
out_path = ${JSON.stringify(outName)}
video.write_videofile(out_path, codec='libx264', audio_codec='aac', fps=max(24, int(round(video.fps or 24))))
print(out_path)
`;

    const note = `Please run the Python below in your environment, upload the resulting MP4 (${outName}) as an attachment in this chat, and then display it.`;

    return {
      structuredContent: { state: "mux_ready", details: { videoId, audioUrl, outName }, videoUrl: null },
      content: [
        { type: "text", text: note },
        { type: "input_text", text: "```python\n" + py + "\n```" }
      ]
    } as any;
  }
);

// Download assets bundle via ChatGPT python (video + audio + keyframes)
server.registerTool(
  "music.download_assets_bundle",
  {
    title: "Download Assets Bundle",
    description: "Use this when the user wants ChatGPT to package the render, audio, and keyframes into a ZIP for download. Do not call before assets exist.",
    readOnlyHint: true,
    _meta: {
      "openai/outputTemplate": "ui://music-video/render.html",
      "openai/toolInvocation/invoking": "Preparing download bundle…",
      "openai/toolInvocation/invoked": "Bundle ready."
    },
    inputSchema: DownloadAssetsInputShape
  } as any,
  async (rawInput) => {
    const { videoId, videoUrl, audioUrl, keyframes = [], filename } = DownloadAssetsInput.parse(rawInput);
    const resolvedVideo = videoUrl || `${PUBLIC_BASE_URL}/videos/${encodeURIComponent(videoId)}/content`;
    const safeName = filename || `sunova_assets_${videoId}.zip`;
    const script = `import base64, io, os, zipfile, sys, tempfile, requests

def save_base64_image(data_url, path):
    header, b64 = data_url.split(",", 1)
    with open(path, "wb") as f:
        f.write(base64.b64decode(b64))

temp_dir = tempfile.mkdtemp(prefix="sunova_assets_")
video_path = os.path.join(temp_dir, "video.mp4")
with requests.get(${JSON.stringify(resolvedVideo)}, stream=True, timeout=120) as r:
    r.raise_for_status()
    with open(video_path, "wb") as f:
        for chunk in r.iter_content(chunk_size=1<<20):
            if chunk:
                f.write(chunk)

audio_path = None
audio_url = ${audioUrl ? JSON.stringify(audioUrl) : 'None'}
if audio_url:
    audio_path = os.path.join(temp_dir, "original_audio" + os.path.splitext(audio_url.split("?")[0])[-1] or ".mp3")
    with requests.get(audio_url, stream=True, timeout=120) as r:
        r.raise_for_status()
        with open(audio_path, "wb") as f:
            for chunk in r.iter_content(chunk_size=1<<20):
                if chunk:
                    f.write(chunk)

keyframes = ${JSON.stringify(keyframes)}
image_paths = []
for idx, frame in enumerate(keyframes, start=1):
    data_url = frame.get("dataUrl")
    if not data_url:
        continue
    scene = frame.get("scene") or 0
    shot = frame.get("shot") or idx
    name = f"scene{scene:02d}_shot{shot:02d}.png"
    path = os.path.join(temp_dir, name)
    save_base64_image(data_url, path)
    image_paths.append(path)

zip_path = os.path.join(temp_dir, ${JSON.stringify(safeName)})
with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as z:
    z.write(video_path, arcname="video.mp4")
    if audio_path:
        z.write(audio_path, arcname=os.path.basename(audio_path))
    for img in image_paths:
        z.write(img, arcname=os.path.basename(img))

print(zip_path)
`;

    return {
      structuredContent: {
        banner: { type: "info", message: "Downloading assets… ChatGPT will return a ZIP when ready." }
      },
      content: [
        { type: "text", text: "Run the Python below to download the video, optional audio, and keyframes, then return the ZIP file." },
        { type: "input_text", text: "```python\n" + script + "\n```" }
      ]
    } as any;
  }
);

  // Tool: Provide Python code for audio analysis (beatmap, energy, genre)
  server.registerTool(
    "music.run_audio_analysis",
    {
      title: "Audio Analysis Python",
      description: "Use this when the user needs beat, energy, and genre analysis for an audio file. Do not run if no audio URL is provided.",
      readOnlyHint: true,
      _meta: {
        "openai/outputTemplate": "ui://music-video/analysis.html",
        "openai/toolInvocation/invoking": "Preparing Python analysis script…",
        "openai/toolInvocation/invoked": "Python script ready.",
        "openai/widgetAccessible": true
      },
      inputSchema: AudioAnalysisPythonInputShape
    } as any,
    async (rawInput) => {
      const { audioUrl, sampleRate = 22050, hopLength = 512, timeSignature = 4 } =
        AudioAnalysisPythonInput.parse(rawInput);
      const PY = `#!/usr/bin/env python3
import argparse, json, os, sys, tempfile
import numpy as np
import requests
import librosa

def fetch_to_path(src: str) -> str:
    if src.startswith('http://') or src.startswith('https://'):
        r = requests.get(src, timeout=60)
        r.raise_for_status()
        fd, path = tempfile.mkstemp(suffix='.audio')
        with os.fdopen(fd, 'wb') as f:
            f.write(r.content)
        return path
    return src

def analyze(path: str, sr: int = ${sampleRate}, hop_length: int = ${hopLength}, ts: int = ${timeSignature}):
    y, sr = librosa.load(path, sr=sr, mono=True)
    duration = float(librosa.get_duration(y=y, sr=sr))

    # Beat tracking
    tempo, beat_frames = librosa.beat.beat_track(y=y, sr=sr, hop_length=hop_length)
    beat_times = librosa.frames_to_time(beat_frames, sr=sr, hop_length=hop_length).tolist()

    # Approx downbeats assuming ts (e.g., 4/4)
    downbeats = [beat_times[i] for i in range(0, len(beat_times), max(1, ts))]

    # Energy via RMS
    rms = librosa.feature.rms(y=y, frame_length=2048, hop_length=hop_length)[0]
    rms_times = librosa.frames_to_time(np.arange(len(rms)), sr=sr, hop_length=hop_length)
    overall_rms = float(np.mean(rms))

    # Spectral features
    centroid = librosa.feature.spectral_centroid(y=y, sr=sr, hop_length=hop_length)[0]
    zcr = librosa.feature.zero_crossing_rate(y=y, frame_length=2048, hop_length=hop_length)[0]
    bandwidth = librosa.feature.spectral_bandwidth(y=y, sr=sr, hop_length=hop_length)[0]

    centroid_mean = float(np.mean(centroid))
    zcr_mean = float(np.mean(zcr))
    bandwidth_mean = float(np.mean(bandwidth))

    # Normalize indicators for a rough energy label
    rms_norm = overall_rms / (np.max(rms) + 1e-9)
    if rms_norm > 0.66:
        energy_label = 'high'
    elif rms_norm > 0.33:
        energy_label = 'medium'
    else:
        energy_label = 'low'

    # Heuristic genre guess
    bpm = float(tempo)
    genre = 'unknown'
    if bpm >= 125 and centroid_mean > 2000:
        genre = 'EDM/Dance'
    elif bpm < 90 and centroid_mean < 1800:
        genre = 'Hip-Hop/RnB'
    elif 90 <= bpm < 110:
        genre = 'Pop'
    elif 110 <= bpm < 140:
        genre = 'Rock/Pop Rock'
    elif bpm >= 140 and zcr_mean > 0.1:
        genre = 'Metal/Punk'

    return {
        'bpm': bpm,
        'beatmap': beat_times,
        'downbeats': downbeats,
        'energy': {
            'overall_rms': overall_rms,
            'label': energy_label,
            'rms_series': [{'t': float(t), 'rms': float(v)} for t, v in zip(rms_times, rms)]
        },
        'features': {
            'spectral_centroid_mean': centroid_mean,
            'spectral_bandwidth_mean': bandwidth_mean,
            'zcr_mean': zcr_mean
        },
        'genre_guess': genre,
        'sr': sr,
        'hop_length': hop_length,
        'time_signature': ts,
        'duration_sec': duration
    }

def main():
    p = argparse.ArgumentParser()
    p.add_argument('--input', required=True, help='Audio file path or URL')
    p.add_argument('--sr', type=int, default=${sampleRate})
    p.add_argument('--hop', type=int, default=${hopLength})
    p.add_argument('--ts', type=int, default=${timeSignature})
    args = p.parse_args()
    path = fetch_to_path(args.input)
    out = analyze(path, sr=args.sr, hop_length=args.hop, ts=args.ts)
    print(json.dumps(out, ensure_ascii=False))

if __name__ == '__main__':
    main()
`;

      // Ask ChatGPT to execute the Python in its server-side environment
      const execNote = [
        "Please run the following Python in your Python environment (Code Interpreter).",
        "Install dependencies if missing, then execute with the provided arguments, and return ONLY the JSON printed by the script.",
        "Arguments:",
        `--input ${audioUrl}`,
        `--sr ${sampleRate} --hop ${hopLength} --ts ${timeSignature}`
      ].join("\n");

      const codeBlock = [
        "```python",
        "# Auto-install if needed",
        "import sys, subprocess, pkgutil",
        "reqs = ['librosa','numpy','scipy','soundfile','requests']",
        "installed = {m.name for m in pkgutil.iter_modules()}",
        "to_install = [p for p in reqs if p not in installed]",
        "if to_install:",
        "    subprocess.check_call([sys.executable, '-m', 'pip', 'install', '-q', *to_install])",
        "\n",
        PY,
        "\n",
        "# Execute",
        `args = ['--input', '${audioUrl}', '--sr', '${sampleRate}', '--hop', '${hopLength}', '--ts', '${timeSignature}']`,
        "import types, sys",
        "if 'main' in globals():",
        "    sys.argv = ['analyze_audio.py'] + args",
        "    main()",
        "```"
      ].join("\n");

      return {
        structuredContent: {
          python: PY,
          instructions: execNote,
          suggestedCommand: "run in ChatGPT Python",
          dependencies: ["librosa", "numpy", "scipy", "soundfile", "requests"],
          outputSchema: {
            type: "object",
            properties: {
              bpm: { type: "number" },
              beatmap: { type: "array", items: { type: "number" } },
              downbeats: { type: "array", items: { type: "number" } },
              energy: {
                type: "object",
                properties: {
                  overall_rms: { type: "number" },
                  label: { type: "string" },
                  rms_series: {
                    type: "array",
                    items: { type: "object", properties: { t: { type: "number" }, rms: { type: "number" } }, required: ["t","rms"] }
                  }
                },
                required: ["overall_rms","label"]
              },
              features: {
                type: "object",
                properties: {
                  spectral_centroid_mean: { type: "number" },
                  spectral_bandwidth_mean: { type: "number" },
                  zcr_mean: { type: "number" }
                }
              },
              genre_guess: { type: "string" },
              sr: { type: "integer" },
              hop_length: { type: "integer" },
              time_signature: { type: "integer" },
              duration_sec: { type: "number" }
            },
            required: ["bpm","beatmap","energy","genre_guess","duration_sec"]
          }
        },
        content: [
          { type: "text", text: execNote },
          { type: "input_text", text: codeBlock }
        ]
      } as any;
    }
  );

  // Present analysis JSON in the widget after ChatGPT runs Python
  server.registerTool(
    "music.present_analysis",
    {
      title: "Show Audio Analysis",
      description: "Use this when the user wants to view previously computed audio analytics. Do not call before music.run_audio_analysis has produced results.",
      readOnlyHint: true,
      _meta: {
        "openai/outputTemplate": "ui://music-video/analysis.html",
        "openai/toolInvocation/invoking": "Presenting analysis…",
        "openai/toolInvocation/invoked": "Analysis shown.",
        "openai/widgetAccessible": true
      },
      inputSchema: PresentAnalysisInputShape
    } as any,
    async (rawInput) => {
      const analysis = PresentAnalysisInput.parse(rawInput);
      return {
        structuredContent: { analysis },
        content: [{ type: "text", text: "Audio analysis results presented." }]
      };
    }
  );

  return srv;
};

const sessions = new Map<string, { server: McpServer; transport: StreamableHTTPServerTransport }>();

// HTTP transport: session-aware JSON-RPC bridge for MCP Inspector & ChatGPT Apps SDK
app.post("/mcp", async (req, res) => {
  const incomingSessionId = req.headers["mcp-session-id"] as string | undefined;

  if (incomingSessionId) {
    const existing = sessions.get(incomingSessionId);
    if (!existing) {
      res.status(400).json({
        jsonrpc: "2.0",
        error: { code: -32001, message: "Unknown MCP session." },
        id: null
      });
      return;
    }

    await existing.transport.handleRequest(req, res, req.body);
    return;
  }

  if (isInitializeRequest(req.body)) {
    const sessionServer = createServer();
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: () => randomUUID(),
      onsessioninitialized: (sessionId) => {
        sessions.set(sessionId, { server: sessionServer, transport });
        res.setHeader("Mcp-Session-Id", sessionId);
        res.setHeader("mcp-session-id", sessionId);
      }
    });

    transport.onclose = () => {
      if (transport.sessionId) {
        sessions.delete(transport.sessionId);
      }
      sessionServer.close().catch(() => {});
    };

    try {
      await sessionServer.connect(transport);
      await transport.handleRequest(req, res, req.body);
    } catch (err: unknown) {
      if (!res.headersSent) {
        const message = err instanceof Error ? err.message : String(err);
        res.status(500).json({
          jsonrpc: "2.0",
          error: { code: -32603, message },
          id: null
        });
      }
    }
    return;
  }

  // Stateless fallback for one-off requests (e.g., manual curl tests)
  const tempServer = createServer();
  const tempTransport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true
  });

  res.on("close", () => {
    tempTransport.close().catch(() => {});
    tempServer.close().catch(() => {});
  });

  try {
    await tempServer.connect(tempTransport);
    await tempTransport.handleRequest(req, res, req.body);
  } catch (err: unknown) {
    if (!res.headersSent) {
      const message = err instanceof Error ? err.message : String(err);
      res.status(500).json({
        jsonrpc: "2.0",
        error: { code: -32603, message },
        id: null
      });
    }
  } finally {
    await tempTransport.close().catch(() => {});
    await tempServer.close().catch(() => {});
  }
});

const handleSessionRequest = async (req: express.Request, res: express.Response) => {
  const sessionId = req.headers["mcp-session-id"] as string | undefined;
  if (!sessionId) {
    res.status(400).send("Missing MCP session id");
    return;
  }

  const existing = sessions.get(sessionId);
  if (!existing) {
    res.status(400).send("Unknown MCP session");
    return;
  }

  await existing.transport.handleRequest(req, res);
};

app.get("/mcp", handleSessionRequest);
app.delete("/mcp", handleSessionRequest);

app.get("/health", (_req, res) => res.json({ ok: true }));
// Proxy OpenAI video content for playback in the widget
app.get("/videos/:id/content", async (req, res) => {
  try {
    const { id } = req.params as { id: string };
    const upstream = await (openai as any).videos.downloadContent(id);
    res.setHeader("Content-Type", upstream.headers.get("content-type") || "video/mp4");
    res.setHeader("Cache-Control", "public, max-age=300");
    if ((upstream as any).body?.pipe) {
      (upstream as any).body.pipe(res);
    } else {
      const buffer = Buffer.from(await upstream.arrayBuffer());
      res.end(buffer);
    }
  } catch (e: any) {
    res.status(500).send(e?.message || "Failed to fetch content");
  }
});
app.get("/payment/success", (req, res) => res.send("Payment completed. Return to ChatGPT."));
app.get("/payment/cancel", (req, res) => res.send("Payment canceled."));

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`MCP server listening on http://localhost:${PORT}`);
});
