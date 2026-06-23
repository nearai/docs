---
draft: true
---

# Integration Guide Authoring Note

This file is a source note for future integration guide authors. Do not add it to
`sidebars.js`, and do not create `_template.mdx`; Docusaurus may treat that as a
publishable document.

## Required Section Contract

Every published integration guide must use these sections, in this order unless a
tool-specific reason makes a small adjustment clearer:

1. Overview
2. Prerequisites
3. Base URL
4. Model ID
5. Configure
6. Refresh models
7. Quick test
8. Troubleshooting
9. Related guides
10. Sources Checked

## Required Content

- Include a `curl` smoke test in **Quick test** before tool-specific debugging.
- Include a troubleshooting table in **Troubleshooting**.
- Cover at least these troubleshooting cases: model not listed, `401`, and base
  URL fields that incorrectly include `/chat/completions`.
- Keep API keys in environment variables, secret fields, keychains, or placeholder
  values such as `$NEARAI_API_KEY` or `YOUR_NEAR_AI_API_KEY`.
- Use `https://cloud-api.near.ai/v1` as the default gateway base URL.
- Do not append `/chat/completions` to base URL fields. Use that path only in
  full request URLs, such as curl smoke tests.
- Use model IDs that NEAR AI Cloud actually exposes. Prefer `z-ai/glm-5.2` when a
  guide needs a current example model.
- Avoid static duplicated model catalogs in individual guides. Link to the
  canonical model discovery guide when model freshness matters.
- Avoid overclaiming support. If a tool only documents partial OpenAI-compatible
  behavior, describe the verified surface and tell readers what they must confirm
  in their own install.

## Section Notes

### Overview

State what the tool can do with NEAR AI Cloud and any known support limits.

### Prerequisites

List the required tool version or account state when known, plus a NEAR AI Cloud
API key stored outside the guide content.

### Base URL

Use the gateway base URL by default:

```text
https://cloud-api.near.ai/v1
```

Only mention direct completions when the tool accepts arbitrary per-model base
URLs. Otherwise, link to Direct Completions instead of adding unverified config.

### Model ID

Tell readers where the model ID goes and link to canonical model discovery when
they need the freshest list.

### Configure

Show the smallest working provider configuration for the tool. Use env vars or
placeholders for secrets.

### Refresh models

Explain whether the tool auto-fetches `/v1/models`, depends on an external
catalog, or needs manual model entry updates.

### Quick test

Include a curl smoke test against NEAR AI Cloud. Use the full request URL here:

```bash
curl https://cloud-api.near.ai/v1/chat/completions \
  -H "Authorization: Bearer $NEARAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "z-ai/glm-5.2",
    "messages": [
      {
        "role": "user",
        "content": "Reply with one sentence confirming the model is reachable."
      }
    ],
    "max_tokens": 64
  }'
```

### Troubleshooting

Use a table with `Symptom` and `Fix` columns. Include tool-specific caveats only
when they are supported by public docs or verified behavior.

### Related guides

Link to canonical NEAR AI Cloud docs instead of repeating long explanations:

- OpenAI Compatibility: `/cloud/guides/openai-compatibility`
- Model Discovery: `/cloud/guides/integrations/model-discovery`
- Direct Completions: `/cloud/private-inference#direct-completions`
- Available Models: `/cloud/models`

### Sources Checked

Place source dates and external references in a trailing `## Sources Checked`
section. Do not use inline `Sources checked: ...` paragraphs near the top of a
published guide; the trailing section keeps setup instructions focused while
preserving source freshness.
