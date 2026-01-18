// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'AVATARARTS',
  tagline: 'Multi-Revenue Stream Digital Business Automation Platform',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://avatar-arts.github.io',
  baseUrl: '/',

  organizationName: 'AvaTar-ArTs',
  projectName: 'avatararts-docs',

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/AvaTar-ArTs/avatararts/tree/main/',
        },
        blog: {
          showReadingTime: true,
          editUrl: 'https://github.com/AvaTar-ArTs/avatararts/tree/main/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/avatararts-social-card.jpg',
      navbar: {
        title: 'AVATARARTS',
        logo: {
          alt: 'AVATARARTS Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Documentation',
          },
          {to: '/blog', label: 'Blog', position: 'left'},
          {
            href: 'https://github.com/AvaTar-ArTs',
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
                label: 'Getting Started',
                to: '/docs/intro',
              },
              {
                label: 'Business Projects',
                to: '/docs/business/overview',
              },
            ],
          },
          {
            title: 'Projects',
            items: [
              {
                label: 'Heavenly Hands',
                href: '#',
              },
              {
                label: 'Retention Suite',
                href: '#',
              },
              {
                label: 'QuantumForge',
                href: '#',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Blog',
                to: '/blog',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/AvaTar-ArTs',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} AVATARARTS. Built with Docusaurus.`,
      },
      prism: {
        theme: require('prism-react-renderer').themes.github,
        darkTheme: require('prism-react-renderer').themes.dracula,
      },
      algolia: {
        appId: 'YOUR_APP_ID',
        apiKey: 'YOUR_SEARCH_API_KEY',
        indexName: 'avatararts',
        contextualSearch: true,
      },
    }),
};

module.exports = config;
