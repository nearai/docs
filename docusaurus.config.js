// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import { themes as prismThemes } from 'prism-react-renderer';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'NEAR AI',
  tagline: 'Private. Intelligent. Yours.',
  favicon: 'img/favicon.svg',
  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://docs.near.ai',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'nearai', // Usually your GitHub org/user name.
  projectName: 'docs', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
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
          routeBasePath: '/',
          sidebarPath: './sidebars.js',
          editUrl: 'https://github.com/nearai/docs/tree/main/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themes: ['@docusaurus/theme-mermaid'],

  markdown: {
    mermaid: true,
  },

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/icons/social-card.png',
      colorMode: {
        defaultMode: 'dark',
        disableSwitch: true,
        respectPrefersColorScheme: false,
      },
      navbar: {
        logo: {
          alt: 'NEAR AI Logo',
          src: 'img/nearAI-logo.svg',
        },
        items: [
          {
            to: 'cloud/introduction',
            position: 'left',
            label: 'Docs',
          },
          {
            to: 'api',
            position: 'left',
            label: 'API',
          },
          {
            href: 'https://cloud.near.ai',
            label: 'Developer Dashboard',
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
                label: 'Quickstart',
                to: 'cloud/quickstart',
              },
              {
                label: 'Models',
                to: 'cloud/models',
              },
              {
                label: 'Private Inference',
                to: 'cloud/private-inference',
              },
              {
                label: 'Verification',
                to: 'cloud/verification',
              },
              {
                label: 'API Reference',
                to: 'api',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Telegram',
                href: 'https://t.me/nearaialpha',
              },
              {
                label: 'X',
                href: 'https://x.com/near_ai',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Developer Dashboard',
                href: 'https://cloud.near.ai',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/nearai/docs',
              },
            ],
          },
        ],
        copyright: `© ${new Date().getFullYear()} NEAR AI. All rights reserved.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
