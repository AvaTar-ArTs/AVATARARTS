/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.
 */

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  tutorialSidebar: [
    {
      type: 'doc',
      id: 'intro',
      label: 'Getting Started',
    },
    {
      type: 'category',
      label: 'Business Projects',
      items: [
        'business/overview',
        'business/heavenly-hands',
        'business/retention-suite',
        'business/quantumforge',
      ],
    },
    {
      type: 'category',
      label: 'Client Projects',
      items: [
        'clients/overview',
      ],
    },
    {
      type: 'category',
      label: 'AI & Automation',
      items: [
        'ai-tools/overview',
      ],
    },
    {
      type: 'category',
      label: 'Tools & Utilities',
      items: [
        'utilities/overview',
      ],
    },
  ],
};

module.exports = sidebars;
