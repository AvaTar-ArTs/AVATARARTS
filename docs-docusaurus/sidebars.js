/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  tutorialSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Getting Started',
      items: [
        'getting-started/introduction',
        'getting-started/workspace-overview',
      ],
    },
    {
      type: 'category',
      label: 'Projects',
      items: [
        'projects/active-projects',
        'projects/directory-structure',
      ],
    },
    {
      type: 'category',
      label: 'Tools',
      items: [
        'tools/tools-utilities',
      ],
    },
    // Additional categories will be added as documentation is created
    // Uncomment and add items as you create the corresponding markdown files:
    //
    // {
    //   type: 'category',
    //   label: 'Projects & Development',
    //   items: [
    //     'projects/active-projects',
    //     'projects/development-guides',
    //     'projects/api-reference',
    //   ],
    // },
    // {
    //   type: 'category',
    //   label: 'Tools & Automation',
    //   items: [
    //     'tools/tools-utilities',
    //     'tools/scripts-automation',
    //   ],
    // },
    // {
    //   type: 'category',
    //   label: 'Business Systems',
    //   items: [
    //     'business/revenue-systems',
    //     'business/data-analytics',
    //     'business/seo-marketing',
    //     'business/websites',
    //   ],
    // },
    // {
    //   type: 'category',
    //   label: 'Operations',
    //   items: [
    //     'operations/deployment',
    //     'operations/troubleshooting',
    //   ],
    // },
    // {
    //   type: 'category',
    //   label: 'Documentation & Archives',
    //   items: [
    //     'docs/documentation-system',
    //     'docs/archives',
    //     'docs/miscellaneous',
    //   ],
    // },
  ],
};

module.exports = sidebars;
