---
id: quickstart
title: Quickstart
sidebar_label: Quickstart
sidebar_position: 2
description: ""
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# NEAR AI Cloud Quickstart

[NEAR AI Cloud](https://cloud.near.ai) offers developers access to private, verifiable AI models through a unified API. This guide will walk you through setting up your account, creating API keys, and making your first requests.

## Setup

  1) **Create your account** - Sign up at [cloud.near.ai](https://cloud.near.ai/) 
  2) **Add Credits** - Goto the "Credits" section and purchase credits based on your needs
  3) **Generate API Key** - Goto the "API Keys" section and generate a new key

:::tip Keep Your API Key Safe
Never share your API key publicly or commit it to version control. If compromised, you can regenerate it anytime from your dashboard.
:::

---

## Making Your First Request

Now let's make a simple API call to chat with an open-source model. Your conversations are private and secure.

**Remember to replace `YOUR_API_KEY` with the key you created in step 3.**

<Tabs
  defaultValue="curl"
  values={[
    {label: 'curl', value: 'curl'},
    {label: 'Python', value: 'python'},
    {label: 'JavaScript', value: 'javascript'},
  ]}>
<TabItem value="curl">

```bash
curl https://cloud-api.near.ai/v1/chat/completions \
-H "Content-Type: application/json" \
-H "Authorization: Bearer YOUR_API_KEY" \
-d '{
    "model": "deepseek-chat-v3-0324",
    "messages": [{
        "role": "user",
        "content": "Hello, NEAR AI!"
    }]
}'
```

</TabItem>
<TabItem value="python">

```python
import openai

client = openai.OpenAI(
    base_url="https://cloud-api.near.ai/v1",
    api_key="YOUR_API_KEY"
)

response = client.chat.completions.create(
    model="deepseek-chat-v3-0324",
    messages=[{
        "role": "user", "content": "Hello, NEAR AI!"
    }]
)

print(response.choices[0].message.content)
```

</TabItem>
<TabItem value="javascript">

```javascript
import OpenAI from 'openai';

const openai = new OpenAI({
    baseURL: 'https://cloud-api.near.ai/v1',
    apiKey: 'YOUR_API_KEY',
});

const completion = await openai.chat.completions.create({
    model: 'deepseek-chat-v3-0324',
    messages: [{
        role: 'user', content: 'Hello, NEAR AI!'
    }]
});

console.log(completion.choices[0].message.content);
```

</TabItem>
</Tabs>

---

## Available Models

NEAR AI Cloud now supports a few open source, private and verifiable models. We'll add more models soon.

You can find the model list from [https://cloud.near.ai/models](https://cloud.near.ai/models)


