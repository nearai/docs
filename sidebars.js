// @ts-check

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.

 @type {import('@docusaurus/plugin-content-docs').SidebarsConfig}
 */
const sidebars = {
  docsSidebar: [
    {
      type: 'doc',
      id: 'cloud/introduction',
      customProps: {
        icon: '/docs/img/icons/introduction.svg',
      },
    },
    {
      type: 'doc',
      id: 'cloud/quickstart',
      customProps: {
        icon: '/docs/img/icons/quickstart.svg',
      },
    },
    {
      type: 'doc',
      id: 'cloud/models',
      customProps: {
        icon: '/docs/img/icons/ai.svg',
      },
    },
    {
      type: 'doc',
      id: 'cloud/private-inference',
      customProps: {
        icon: '/docs/img/icons/private-inference.svg',
      },
    },
    {
      type: 'category',
      label: 'Verification',
      link: {
        type: 'doc',
        id: 'cloud/verification/verification',
      },
      collapsed: true,
      customProps: {
        icon: '/docs/img/icons/verification.svg',
      },
      items: [
        'cloud/verification/model-verification',
        'cloud/verification/chat-verification',
      ],
    },
  ],
};

export default sidebars;
