// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer').themes.github;
const darkCodeTheme = require('prism-react-renderer').themes.dracula;

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'AVATARARTS Documentation',
  tagline: 'Comprehensive documentation for the AVATARARTS workspace',
  // favicon: 'img/favicon.ico', // Uncomment when favicon is added

  // Set the production url of your site here
  url: 'https://avatararts.org',
  // Set the /<baseUrl>/ pathname under which your site is served
  baseUrl: '/docs-docusaurus/',

  // GitHub pages deployment config.
  organizationName: 'avatararts',
  projectName: 'docs-docusaurus',

  onBrokenLinks: 'warn',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
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
          editUrl: 'https://github.com/avatararts/docs-docusaurus/tree/main/',
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      // image: 'img/docusaurus-social-card.jpg', // Uncomment when image is added
      navbar: {
        title: 'AVATARARTS',
        // logo: { // Uncomment when logo is added
        //   alt: 'AVATARARTS Logo',
        //   src: 'img/logo.svg',
        // },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Documentation',
          },
          {
            href: 'https://github.com/avatararts',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Documentation',
            items: [
              {
                label: 'Getting Started',
                to: '/docs/getting-started/introduction',
              },
              {
                label: 'Workspace Overview',
                to: '/docs/getting-started/workspace-overview',
              },
              {
                label: 'Active Projects',
                to: '/docs/projects/active-projects',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/avatararts',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Steven Chaplinski. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
