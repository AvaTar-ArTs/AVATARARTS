#!/bin/bash
# setup.sh
# Complete setup script for Steven Chaplinski website

set -e

echo "🚀 Setting up Steven Chaplinski Website..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p public/images
mkdir -p public/fonts
mkdir -p public/assets

# Create favicon and basic assets
echo "🎨 Creating basic assets..."

# Create a simple favicon
cat > public/favicon.ico << 'EOF'
# This would be a binary favicon file
# For now, we'll create a placeholder
EOF

# Create site.webmanifest
cat > public/site.webmanifest << 'EOF'
{
  "name": "Steven Chaplinski - AI Alchemist & Creative Automation Engineer",
  "short_name": "Steven Chaplinski",
  "description": "Professional portfolio showcasing AI automation, creative technology, and business optimization solutions.",
  "icons": [
    {
      "src": "/apple-touch-icon.png",
      "sizes": "180x180",
      "type": "image/png"
    }
  ],
  "theme_color": "#3b82f6",
  "background_color": "#ffffff",
  "display": "standalone",
  "start_url": "/"
}
EOF

# Create robots.txt
cat > public/robots.txt << 'EOF'
User-agent: *
Allow: /

Sitemap: https://stevenchaplinski.com/sitemap.xml
EOF

# Create sitemap.xml
cat > public/sitemap.xml << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://stevenchaplinski.com/</loc>
    <lastmod>2025-01-15</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://stevenchaplinski.com/about</loc>
    <lastmod>2025-01-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://stevenchaplinski.com/services</loc>
    <lastmod>2025-01-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://stevenchaplinski.com/portfolio</loc>
    <lastmod>2025-01-15</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://stevenchaplinski.com/contact</loc>
    <lastmod>2025-01-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://stevenchaplinski.com/brands/avatararts</loc>
    <lastmod>2025-01-15</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://stevenchaplinski.com/brands/quantumforge</loc>
    <lastmod>2025-01-15</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://stevenchaplinski.com/brands/gptjunkie</loc>
    <lastmod>2025-01-15</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
EOF

# Create .env.local
cat > .env.local << 'EOF'
# Steven Chaplinski Website Environment Variables
NEXT_PUBLIC_SITE_URL=https://stevenchaplinski.com
NEXT_PUBLIC_SITE_NAME=Steven Chaplinski
NEXT_PUBLIC_SITE_DESCRIPTION=AI Alchemist & Creative Automation Engineer

# Analytics (Add your keys here)
# NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
# NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX

# Contact Form (Add your service here)
# NEXT_PUBLIC_CONTACT_FORM_ENDPOINT=https://api.example.com/contact
EOF

# Create .gitignore
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Next.js
.next/
out/
build/
dist/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
*.log

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/

# nyc test coverage
.nyc_output

# Dependency directories
jspm_packages/

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Microbundle cache
.rpt2_cache/
.rts2_cache_cjs/
.rts2_cache_es/
.rts2_cache_umd/

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# next.js build output
.next

# nuxt.js build output
.nuxt

# vuepress build output
.vuepress/dist

# Serverless directories
.serverless

# FuseBox cache
.fusebox/

# DynamoDB Local files
.dynamodb/

# TernJS port file
.tern-port
EOF

# Create README for development
cat > DEVELOPMENT.md << 'EOF'
# Steven Chaplinski Website - Development Guide

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run export` - Export static files

## Project Structure

```
src/
├── components/     # React components
├── pages/         # Next.js pages
├── layouts/       # Layout components
├── styles/        # CSS files
└── utils/         # Utility functions

content/           # Markdown content
├── projects/      # Project documentation
├── services/      # Service offerings
├── blog/          # Blog posts
└── resources/     # Resources and downloads

public/            # Static assets
├── images/        # Images
├── fonts/         # Fonts
└── assets/        # Other assets
```

## Environment Variables

Create a `.env.local` file with:

```env
NEXT_PUBLIC_SITE_URL=https://stevenchaplinski.com
NEXT_PUBLIC_SITE_NAME=Steven Chaplinski
NEXT_PUBLIC_SITE_DESCRIPTION=AI Alchemist & Creative Automation Engineer
```

## Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Netlify
```bash
# Build and export
npm run build && npm run export

# Deploy to Netlify
# Upload the 'out' directory to Netlify
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

© 2025 Steven Chaplinski. All rights reserved.
EOF

echo "✅ Setup completed successfully!"
echo ""
echo "🎉 Steven Chaplinski Website is ready!"
echo ""
echo "Next steps:"
echo "1. Run 'npm run dev' to start development server"
echo "2. Visit http://localhost:3000 to view the website"
echo "3. Customize content in the 'content/' directory"
echo "4. Add your images to 'public/images/'"
echo "5. Configure environment variables in '.env.local'"
echo ""
echo "For deployment instructions, see DEVELOPMENT.md"