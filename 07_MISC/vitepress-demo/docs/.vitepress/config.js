import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'AVATARARTS',
  description: 'Multi-Revenue Stream Digital Business Automation Platform',

  themeConfig: {
    logo: '/logo.svg',

    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/' },
      { text: 'Business', link: '/business/' },
      { text: 'Tools', link: '/utilities/' }
    ],

    sidebar: {
      '/': [
        {
          text: 'Introduction',
          items: [
            { text: 'Getting Started', link: '/guide/' },
            { text: 'Overview', link: '/guide/overview' }
          ]
        },
        {
          text: 'Business Projects',
          items: [
            { text: 'Overview', link: '/business/' },
            { text: 'Heavenly Hands', link: '/business/heavenly-hands' },
            { text: 'Retention Suite', link: '/business/retention-suite' },
            { text: 'QuantumForge', link: '/business/quantumforge' }
          ]
        },
        {
          text: 'Client Projects',
          items: [
            { text: 'Overview', link: '/clients/' }
          ]
        },
        {
          text: 'AI & Automation',
          items: [
            { text: 'Overview', link: '/ai-tools/' }
          ]
        },
        {
          text: 'Tools & Utilities',
          items: [
            { text: 'Overview', link: '/utilities/' },
            { text: 'Organization Suite', link: '/utilities/organization' },
            { text: 'Reindexing System', link: '/utilities/reindex' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/AvaTar-ArTs' }
    ],

    footer: {
      message: 'Built with VitePress',
      copyright: 'Copyright © 2026 AVATARARTS'
    },

    search: {
      provider: 'local'
    }
  }
})
