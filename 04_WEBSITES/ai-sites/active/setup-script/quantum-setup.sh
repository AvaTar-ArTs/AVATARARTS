#!/usr/bin/env bash
#
# setup.sh — Scaffold folder structure and placeholder files for QuantumForgeLabs
#
# Usage:
#   chmod +x setup.sh
#   ./setup.sh
#

set -e

# Root directory (script assumes you run it from inside QuantumForgeLabs/)
ROOT_DIR="$(pwd)"

echo "Creating folder structure under: $ROOT_DIR"

# 1) Create asset subdirectories
mkdir -p assets/css
mkdir -p assets/js
mkdir -p assets/imgs

# 2) Create pages directory
mkdir -p pages

# 3) Create CSS placeholder
CSS_FILE="assets/css/style.css"
if [[ ! -f $CSS_FILE ]]; then
  cat > "$CSS_FILE" << 'EOF'
/* style.css — Global styles for QuantumForgeLabs */

:root {
  --neon-green: #00FF9D;
  --cyber-purple: #B100FF;
  --oil-black: #0F0F0F;
  --text-light: #EAEAEA;
  --text-muted: #A0A0A0;
  --btn-bg: #29013f;
  --btn-hover-bg: #3e0256;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
  font-family: 'IBM Plex Mono', monospace;
  background-color: var(--oil-black);
  color: var(--text-light);
}

body {
  line-height: 1.6;
}

/* Header/Nav */
header {
  background-color: var(--oil-black);
  padding: 1rem 2rem;
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid var(--text-muted);
}

.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--neon-green);
  text-decoration: none;
}

nav ul {
  list-style: none;
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

nav a {
  color: var(--text-light);
  text-decoration: none;
  font-weight: 500;
  position: relative;
  transition: color 0.2s;
}

nav a:hover,
nav a.active {
  color: var(--neon-green);
}

nav a::after {
  content: '';
  display: block;
  width: 0;
  height: 2px;
  background: var(--neon-green);
  transition: width .3s;
  position: absolute;
  bottom: -4px;
  left: 0;
}

nav a:hover::after,
nav a.active::after {
  width: 100%;
}

/* Hero Section */
.hero {
  text-align: center;
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
}

.hero h1 {
  font-size: 3rem;
  color: var(--cyber-purple);
  margin-bottom: 1rem;
}

.hero p {
  font-size: 1.2rem;
  color: var(--text-muted);
  margin-bottom: 2rem;
  max-width: 600px;
}

.cta-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.cta {
  background-color: var(--btn-bg);
  color: #fff;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  border-radius: 0.25rem;
  text-decoration: none;
  transition: background-color .2s;
}

.cta:hover {
  background-color: var(--btn-hover-bg);
}

/* Projects Section */
.projects {
  padding: 4rem 2rem;
}

.projects h2 {
  font-size: 2rem;
  text-align: center;
  color: var(--neon-green);
  margin-bottom: 2rem;
}

.project-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.project-card {
  background-color: #1a1a1a;
  border: 1px solid var(--text-muted);
  border-radius: 0.5rem;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s;
}

.project-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.project-card img {
  width: 100%;
  height: 180px;
  object-fit: cover;
}

.project-details {
  padding: 1rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.project-title {
  font-size: 1.25rem;
  color: var(--cyber-purple);
  margin-bottom: 0.5rem;
}

.project-desc {
  flex: 1;
  color: var(--text-muted);
  font-size: 0.95rem;
  margin-bottom: 1rem;
}

.project-link {
  align-self: flex-start;
  color: var(--neon-green);
  text-decoration: none;
  font-weight: 500;
  transition: text-decoration 0.2s;
}

.project-link:hover {
  text-decoration: underline;
}

/* Footer */
footer {
  background-color: var(--oil-black);
  padding: 2rem;
  border-top: 1px solid var(--text-muted);
}

.footer-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.social-links {
  display: flex;
  gap: 1rem;
}

.social-links a {
  color: var(--text-muted);
  text-decoration: none;
  font-size: 1.25rem;
  transition: color .2s;
}

.social-links a:hover {
  color: var(--neon-green);
}

.footer-text {
  color: var(--text-muted);
  font-size: 0.9rem;
  text-align: center;
}

/* Responsive */
@media (max-width: 768px) {
  .hero h1 {
    font-size: 2.5rem;
  }

  .projects {
    padding: 2rem 1rem;
  }
}
EOF
  echo "  -> Created $CSS_FILE"
else
  echo "  -> $CSS_FILE already exists, skipping."
fi

# 4) Create JS placeholder
JS_FILE="assets/js/script.js"
if [[ ! -f $JS_FILE ]]; then
  cat > "$JS_FILE" << 'EOF'
// script.js — placeholder for future JavaScript (nav toggles, animations, etc.)

document.addEventListener('DOMContentLoaded', () => {
  // Example: highlight the active nav link
  const path = window.location.pathname;
  document.querySelectorAll('nav a').forEach(link => {
    if (link.getAttribute('href') === path) {
      link.classList.add('active');
    }
  });
});
EOF
  echo "  -> Created $JS_FILE"
else
  echo "  -> $JS_FILE already exists, skipping."
fi

# 5) Create pages placeholders
PAGES=(about.html blog.html connect.html docs.html projects.html)
for page in "${PAGES[@]}"; do
  PAGE_PATH="pages/$page"
  if [[ ! -f $PAGE_PATH ]]; then
    cat > "$PAGE_PATH" << EOF
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${page%.*} | QuantumForgeLabs</title>
  <link rel="stylesheet" href="/assets/css/style.css" />
</head>

<body>
  <header>
    <div class="nav-container">
      <a href="/" class="logo">QuantumForgeLabs</a>
      <nav>
        <ul>
          <li><a href="/" >Home</a></li>
          <li><a href="/pages/projects.html">Projects</a></li>
          <li><a href="/pages/docs.html">Docs</a></li>
          <li><a href="/pages/blog.html">Blog</a></li>
          <li><a href="/pages/about.html" class="active">About</a></li>
          <li><a href="/pages/connect.html">Connect</a></li>
        </ul>
      </nav>
    </div>
  </header>

  <section class="hero">
    <h1>${page%.*}</h1>
    <p>Content coming soon for the ${page%.*} page...</p>
  </section>

  <footer>
    <div class="footer-container">
      <div class="social-links">
        <a href="https://github.com/quantumforgelabs" target="_blank" rel="noopener noreferrer">GitHub</a>
        <a href="https://twitter.com/QuantumAuTomAIton" target="_blank" rel="noopener noreferrer">Twitter</a>
        <a href="https://instagram.com/AIAutomationAlchemist" target="_blank" rel="noopener noreferrer">Instagram</a>
      </div>
      <p class="footer-text">© 2025 Steven Chaplinski – QuantumForgeLabs. All rights reserved.</p>
    </div>
  </footer>

  <script src="/assets/js/script.js"></script>
</body>

</html>
EOF
    echo "  -> Created placeholder $PAGE_PATH"
  else
    echo "  -> $PAGE_PATH already exists, skipping."
  fi
done

# 6) Create index.html (homepage) if it doesn't exist
INDEX_FILE="index.html"
if [[ ! -f $INDEX_FILE ]]; then
  cat > "$INDEX_FILE" << 'EOF'
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>QuantumForgeLabs</title>

  <!-- SEO Meta -->
  <meta name="description" content="QuantumForgeLabs: Technical Alchemy for Artists, Developers & Dreamers. Discover Python tools, AI scripts, and creative automation workflows." />
  <meta property="og:title" content="QuantumForgeLabs" />
  <meta property="og:description" content="QuantumForgeLabs: Technical Alchemy for Artists, Developers & Dreamers. Discover Python tools, AI scripts, and creative automation workflows." />
  <meta property="og:image" content="/assets/imgs/og-image.png" />
  <meta property="og:url" content="https://quantumforgelabs.org" />
  <meta name="twitter:card" content="summary_large_image" />

  <!-- Favicon -->
  <link rel="icon" href="/favicon.ico" type="image/x-icon" />

  <!-- Stylesheet -->
  <link rel="stylesheet" href="/assets/css/style.css" />
</head>

<body>
  <!-- Navigation -->
  <header>
    <div class="nav-container">
      <a href="/" class="logo">QuantumForgeLabs</a>
      <nav>
        <ul>
          <li><a href="/" class="active">Home</a></li>
          <li><a href="/pages/projects.html">Projects</a></li>
          <li><a href="/pages/docs.html">Docs</a></li>
          <li><a href="/pages/blog.html">Blog</a></li>
          <li><a href="/pages/about.html">About</a></li>
          <li><a href="/pages/connect.html">Connect</a></li>
        </ul>
      </nav>
    </div>
  </header>

  <!-- Hero Section -->
  <section class="hero">
    <h1>Technical Alchemy for Artists, Developers &amp; Dreamers</h1>
    <p>Forging the Future of Creative Automation — Where Code Becomes Alchemy</p>
    <div class="cta-buttons">
      <a href="/pages/projects.html" class="cta">Browse Python Tools</a>
      <a href="https://avatararts.org" class="cta" target="_blank" rel="noopener noreferrer">See the Art It Powers</a>
    </div>
  </section>

  <!-- Featured Projects Section -->
  <section class="projects">
    <h2>Featured Projects</h2>
    <div class="project-grid">
      <!-- Project Card 1 -->
      <div class="project-card">
        <img src="/assets/imgs/whispergpt.png" alt="Screenshot: WhisperGPT - Automated Transcription & Analysis" />
        <div class="project-details">
          <h3 class="project-title">WhisperGPT Pipeline</h3>
          <p class="project-desc">A Python script integrating OpenAI Whisper &amp; GPT-4 to auto-transcribe and summarize audio files into rich metadata.</p>
          <a href="https://github.com/quantumforgelabs/whispergpt" class="project-link" target="_blank" rel="noopener noreferrer">View on GitHub →</a>
        </div>
      </div>

      <!-- Project Card 2 -->
      <div class="project-card">
        <img src="/assets/imgs/dalle-tool.png" alt="Screenshot: DALL·E 3 Narrative Prompt Generator" />
        <div class="project-details">
          <h3 class="project-title">DALL·E Narrative Toolkit</h3>
          <p class="project-desc">Generate narrative-driven prompts for DALL·E 3 with structured cover, transitions, and thematic consistency in 9:16 format.</p>
          <a href="https://github.com/quantumforgelabs/dalle-tool" class="project-link" target="_blank" rel="noopener noreferrer">View on GitHub →</a>
        </div>
      </div>

      <!-- Project Card 3 -->
      <div class="project-card">
        <img src="/assets/imgs/ffmpeg-script.png" alt="Screenshot: FFmpeg Auto-Editor for YouTube Shorts" />
        <div class="project-details">
          <h3 class="project-title">YouTube Shorts Auto-Editor</h3>
          <p class="project-desc">A configurable FFmpeg pipeline that auto-generates YouTube Shorts from raw footage and narrated scripts.</p>
          <a href="https://github.com/quantumforgelabs/youtube-autoeditor" class="project-link" target="_blank" rel="noopener noreferrer">View on GitHub →</a>
        </div>
      </div>

      <!-- Project Card 4 -->
      <div class="project-card">
        <img src="/assets/imgs/chaos-api.png" alt="Screenshot: ChaosAPI – RESTful Chaos Engineering Toolkit" />
        <div class="project-details">
          <h3 class="project-title">ChaosAPI</h3>
          <p class="project-desc">A RESTful API suite to simulate load, handle fault injection, and stress-test web services with chaos theory principles.</p>
          <a href="https://github.com/quantumforgelabs/chaos-api" class="project-link" target="_blank" rel="noopener noreferrer">View on GitHub →</a>
        </div>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer>
    <div class="footer-container">
      <div class="social-links">
        <a href="https://github.com/quantumforgelabs" target="_blank" rel="noopener noreferrer">GitHub</a>
        <a href="https://twitter.com/QuantumAuTomAIton" target="_blank" rel="noopener noreferrer">Twitter</a>
        <a href="https://instagram.com/AIAutomationAlchemist" target="_blank" rel="noopener noreferrer">Instagram</a>
      </div>
      <p class="footer-text">© 2025 Steven Chaplinski – QuantumForgeLabs. All rights reserved.</p>
      <p class="footer-text">Built with <code>Python</code>, <code>HTML/CSS</code>, and a dash of chaos magic.</p>
    </div>
  </footer>

  <!-- JavaScript -->
  <script src="/assets/js/script.js"></script>
</body>

</html>
EOF
  echo "  -> Created $INDEX_FILE"
else
  echo "  -> $INDEX_FILE already exists, skipping."
fi

echo
echo "✅ Scaffold complete! Your folder structure now looks like this:"
tree -C -L 2 "$ROOT_DIR"

echo
echo "Next steps:"
echo "  • Add your actual image files under assets/imgs/."
echo "  • Update pages/*.html to include real content."
echo "  • Serve or deploy this directory via your web server."
