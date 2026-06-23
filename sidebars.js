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
      type: "doc",
      id: "cloud/introduction",
      customProps: {
        icon: "/img/icons/introduction.svg",
      },
    },
    {
      type: "doc",
      id: "cloud/quickstart",
      customProps: {
        icon: "/img/icons/quickstart.svg",
      },
    },
    {
      type: "category",
      label: "Models",
      link: {
        type: "doc",
        id: "cloud/models",
      },
      collapsed: true,
      customProps: {
        icon: "/img/icons/ai.svg",
      },
      items: ["cloud/models", "cloud/reasoning-models"],
    },
    {
      type: "doc",
      id: "cloud/private-inference",
      customProps: {
        icon: "/img/icons/private-inference.svg",
      },
    },
    {
      type: "category",
      label: "Verification",
      link: {
        type: "doc",
        id: "cloud/verification/verification",
      },
      collapsed: true,
      customProps: {
        icon: "/img/icons/verification.svg",
      },
      items: [
        "cloud/verification/model-verification",
        "cloud/verification/gateway-verification",
        "cloud/verification/tls-attestation-verification",
        "cloud/verification/chat-verification",
      ],
    },
    {
      type: "category",
      label: "Guides",
      link: {
        type: "doc",
        id: "cloud/guides/openai-compatibility",
      },
      collapsed: false,
      customProps: {
        icon: "/img/icons/docs.svg",
      },
      items: [
        "cloud/guides/openai-compatibility",
        {
          type: "category",
          label: "Integrations",
          link: {
            type: "doc",
            id: "cloud/guides/integrations/integrations",
          },
          collapsed: false,
          items: [
            "cloud/guides/integrations/integrations",
            "cloud/guides/integrations/model-discovery",
            {
              type: "category",
              label: "Coding Agents and IDEs",
              collapsed: false,
              items: [
                "cloud/guides/integrations/cursor",
                "cloud/guides/integrations/continue",
                "cloud/guides/integrations/cline-roo-kilo",
                "cloud/guides/integrations/aider-zed",
                "cloud/guides/opencode-goose",
              ],
            },
            {
              type: "category",
              label: "Self-hosted and Team Apps",
              collapsed: false,
              items: [
                "cloud/guides/integrations/librechat",
                "cloud/guides/integrations/open-webui",
                "cloud/guides/integrations/litellm",
                "cloud/guides/integrations/dify",
              ],
            },
          ],
        },
        "cloud/guides/prompt-caching",
        "cloud/guides/fusion",
        "cloud/guides/web-search",
        "cloud/guides/specialized-endpoints",
        "cloud/guides/e2ee-chat-completions",
      ],
    },
    {
      type: "doc",
      id: "api-reference",
      customProps: {
        icon: "/img/icons/unified-api.svg",
      },
    },
  ],
};

export default sidebars;
