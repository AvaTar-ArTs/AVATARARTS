# 📚 Docusaurus Setup Guide

**Create a professional documentation site for Podcast to Shorts AI**

---

## 🎯 What is Docusaurus?

Docusaurus is a modern static website generator that creates beautiful documentation sites. It's used by Facebook, Stripe, and many other companies.

**Benefits:**
- ✅ Easy to set up
- ✅ Beautiful default theme
- ✅ Mobile responsive
- ✅ Search functionality
- ✅ Version control
- ✅ Free hosting options

---

## 📋 Prerequisites

- Node.js 16+ installed
- npm or yarn
- Git (optional)

---

## 🚀 Quick Setup (5 minutes)

### Step 1: Install Docusaurus

```bash
npx create-docusaurus@latest podcast-shorts-docs classic
```

**Options:**
- Project name: `podcast-shorts-docs`
- Template: `classic`
- TypeScript: No (or Yes if you prefer)

### Step 2: Navigate to Project

```bash
cd podcast-shorts-docs
```

### Step 3: Start Development Server

```bash
npm start
```

**Open:** http://localhost:3000

**You should see the Docusaurus homepage!** 🎉

---

## 📁 Project Structure

```
podcast-shorts-docs/
├── blog/                    # Blog posts (optional)
├── docs/                    # Your documentation
│   ├── installation.md
│   ├── quick-start.md
│   ├── testing.md
│   └── ...
├── src/
│   ├── components/          # React components
│   ├── css/                 # Custom styles
│   └── pages/               # Custom pages
├── static/                  # Static assets
├── docusaurus.config.js     # Configuration
└── package.json
```

---

## 📝 Add Your Documentation

### Copy Documentation Files

```bash
# Copy all docs from your project
cp -r /path/to/REVENUE_LAUNCH_2026/01_PRODUCTS/Podcast_to_Shorts_AI/docs/* podcast-shorts-docs/docs/
```

### Update Sidebar

**Edit `docusaurus.config.js`:**

```javascript
module.exports = {
  // ... other config
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // ... other options
        },
      },
    ],
  ],
};
```

**Edit `sidebars.js`:**

```javascript
module.exports = {
  tutorialSidebar: [
    'README',
    'installation',
    'quick-start',
    'testing',
    'configuration',
    'examples',
    'api-reference',
    'troubleshooting',
    'deployment',
    'faq',
  ],
};
```

---

## 🎨 Customize Configuration

### Edit `docusaurus.config.js`

```javascript
module.exports = {
  title: 'Podcast to Shorts AI',
  tagline: 'Convert podcasts to YouTube Shorts automatically',
  url: 'https://your-domain.com',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  
  organizationName: 'your-username',
  projectName: 'podcast-shorts-docs',
  
  themeConfig: {
    navbar: {
      title: 'Podcast to Shorts AI',
      logo: {
        alt: 'Podcast to Shorts AI Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'doc',
          docId: 'README',
          position: 'left',
          label: 'Docs',
        },
        {
          href: 'https://your-gumroad-link',
          label: 'Buy Now',
          position: 'right',
        },
        {
          href: 'https://github.com/yourusername',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Installation',
              to: '/docs/installation',
            },
            {
              label: 'Quick Start',
              to: '/docs/quick-start',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Twitter',
              href: 'https://twitter.com/yourhandle',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Buy on Gumroad',
              href: 'https://your-gumroad-link',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Your Name.`,
    },
  },
  
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/yourusername/podcast-shorts-docs/edit/main/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
```

---

## 🚀 Build and Deploy

### Build for Production

```bash
npm run build
```

**Output:** `build/` directory

### Deploy Options

#### Option 1: Netlify (Easiest)

1. Push to GitHub
2. Connect to Netlify
3. Deploy automatically

**Free hosting!**

#### Option 2: Vercel

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

**Free hosting!**

#### Option 3: GitHub Pages

1. Install plugin:
   ```bash
   npm install --save-dev @docusaurus/plugin-client-redirects
   ```

2. Update config:
   ```javascript
   plugins: [
     [
       '@docusaurus/plugin-content-docs',
       {
         // ... config
       },
     ],
   ],
   ```

3. Deploy:
   ```bash
   GIT_USER=your-username npm run deploy
   ```

**Free hosting!**

---

## 🎨 Customization

### Add Logo

1. Place logo in `static/img/logo.svg`
2. Update config (see above)

### Custom Colors

**Edit `src/css/custom.css`:**

```css
:root {
  --ifm-color-primary: #667eea;
  --ifm-color-primary-dark: #5568d3;
  --ifm-color-primary-darker: #4f62c8;
  --ifm-color-primary-darkest: #4150a4;
  --ifm-color-primary-light: #7894f1;
  --ifm-color-primary-lighter: #829ef2;
  --ifm-color-primary-lightest: #9eb0f6;
}
```

### Add Search

**Install plugin:**

```bash
npm install @docusaurus/plugin-search
```

**Add to config:**

```javascript
plugins: [
  [
    '@docusaurus/plugin-content-docs',
    {
      // ... config
    },
  ],
  [
    '@docusaurus/plugin-search',
    {
      // ... search config
    },
  ],
],
```

---

## 📋 Complete Setup Checklist

- [ ] Install Docusaurus
- [ ] Copy documentation files
- [ ] Update sidebar configuration
- [ ] Customize theme
- [ ] Add logo and branding
- [ ] Test locally
- [ ] Build for production
- [ ] Deploy to hosting
- [ ] Share the link!

---

## 🎯 Quick Commands

```bash
# Start development server
npm start

# Build for production
npm run build

# Serve production build
npm run serve

# Clear cache
npm run clear
```

---

## 📚 Resources

- [Docusaurus Documentation](https://docusaurus.io/docs)
- [Docusaurus Tutorial](https://docusaurus.io/docs/tutorial-basics)
- [Deployment Guide](https://docusaurus.io/docs/deployment)

---

## 🆘 Troubleshooting

### "Command not found: npx"
→ Install Node.js: https://nodejs.org/

### "Port 3000 already in use"
→ Use different port: `npm start -- --port 3001`

### Build fails
→ Clear cache: `npm run clear` then `npm run build`

---

**Docusaurus setup complete!** 🚀

**Your documentation site is ready!**
