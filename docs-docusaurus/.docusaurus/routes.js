import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/docs-docusaurus/__docusaurus/debug',
    component: ComponentCreator('/docs-docusaurus/__docusaurus/debug', '91e'),
    exact: true
  },
  {
    path: '/docs-docusaurus/__docusaurus/debug/config',
    component: ComponentCreator('/docs-docusaurus/__docusaurus/debug/config', '45d'),
    exact: true
  },
  {
    path: '/docs-docusaurus/__docusaurus/debug/content',
    component: ComponentCreator('/docs-docusaurus/__docusaurus/debug/content', '615'),
    exact: true
  },
  {
    path: '/docs-docusaurus/__docusaurus/debug/globalData',
    component: ComponentCreator('/docs-docusaurus/__docusaurus/debug/globalData', '80e'),
    exact: true
  },
  {
    path: '/docs-docusaurus/__docusaurus/debug/metadata',
    component: ComponentCreator('/docs-docusaurus/__docusaurus/debug/metadata', 'c34'),
    exact: true
  },
  {
    path: '/docs-docusaurus/__docusaurus/debug/registry',
    component: ComponentCreator('/docs-docusaurus/__docusaurus/debug/registry', 'bfb'),
    exact: true
  },
  {
    path: '/docs-docusaurus/__docusaurus/debug/routes',
    component: ComponentCreator('/docs-docusaurus/__docusaurus/debug/routes', '03d'),
    exact: true
  },
  {
    path: '/docs-docusaurus/docs',
    component: ComponentCreator('/docs-docusaurus/docs', '3f3'),
    routes: [
      {
        path: '/docs-docusaurus/docs',
        component: ComponentCreator('/docs-docusaurus/docs', 'e1a'),
        routes: [
          {
            path: '/docs-docusaurus/docs',
            component: ComponentCreator('/docs-docusaurus/docs', '85c'),
            routes: [
              {
                path: '/docs-docusaurus/docs/getting-started/introduction',
                component: ComponentCreator('/docs-docusaurus/docs/getting-started/introduction', '21a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs-docusaurus/docs/intro',
                component: ComponentCreator('/docs-docusaurus/docs/intro', '262'),
                exact: true,
                sidebar: "tutorialSidebar"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
