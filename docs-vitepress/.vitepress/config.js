import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'AVATARARTS Documentation',
  description: 'Comprehensive documentation for the AVATARARTS workspace',

  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }]
  ],

  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Getting Started', link: '/getting-started/introduction' },
      { text: 'Projects', link: '/projects/active-projects' },
      { text: 'Tools', link: '/tools/tools-utilities' },
    ],

    sidebar: {
      '/': [
        {
          text: 'Getting Started',
          items: [
            { text: 'Introduction', link: '/getting-started/introduction' },
            { text: 'Workspace Overview', link: '/getting-started/workspace-overview' },
            { text: 'Directory Structure', link: '/getting-started/directory-structure' },
          ]
        },
        {
          text: 'Projects & Development',
          items: [
            { text: 'Active Projects', link: '/projects/active-projects' },
            { text: 'Development Guides', link: '/projects/development-guides' },
            { text: 'API Reference', link: '/projects/api-reference' },
          ]
        },
        {
          text: 'Tools & Automation',
          items: [
            { text: 'Tools & Utilities', link: '/tools/tools-utilities' },
            { text: 'Scripts & Automation', link: '/tools/scripts-automation' },
          ]
        },
        {
          text: 'Business Systems',
          items: [
            { text: 'Revenue Systems', link: '/business/revenue-systems' },
            { text: 'Data Analytics', link: '/business/data-analytics' },
            { text: 'SEO & Marketing', link: '/business/seo-marketing' },
            { text: 'Websites', link: '/business/websites' },
          ]
        },
        {
          text: 'Operations',
          items: [
            { text: 'Deployment', link: '/operations/deployment' },
            { text: 'Troubleshooting', link: '/operations/troubleshooting' },
          ]
        },
        {
          text: 'Documentation & Archives',
          items: [
            { text: 'Documentation System', link: '/docs/documentation-system' },
            { text: 'Archives', link: '/docs/archives' },
            { text: 'Miscellaneous', link: '/docs/miscellaneous' },
          ]
        },
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/avatararts' }
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2026 Steven Chaplinski'
    },

    search: {
      provider: 'local'
    }
  }
})
