---
id: chat-verification
title: Chat Message Verification
sidebar_label: Chat Verification
slug: /cloud/verification/chat
sidebar_position: 5
description: ""
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Chat Message Verification

You can verify each chat message with NEAR AI Cloud. For this you will need:

1. [Chat Message **REQUEST** Hash](#chat-message-request-hash)
2. [Chat Message **RESPONSE** Hash](#chat-message-response-hash)
3. [Chat Message Signature](#chat-message-signature)

:::tip 
See an example implementation in the [NEAR AI Cloud Verification Example](https://github.com/near-examples/nearai-cloud-verification-example) repo.
:::

---

## Chat Message Request Hash

The value is calculated from the **exact JSON request body string**.

**_Example:_**

```json
{
  "messages": [
    {
      "content": "Respond with only two words.",
      "role": "user"
    }
  ],
  "stream": true,
  "model": "deepseek-ai/DeepSeek-V3.1"
}
```

Which hashes to:

```bash
b524f8f4b611b43526aa988c636cf1d7e72aa661876c3d969e2c2acae125a8ba
```

Here is an example of how to get the sha256 hash of your message request body:

<Tabs
  defaultValue="javascript"
  values={[
    {label: 'JavaScript', value: 'javascript'},
    {label: 'Python', value: 'python'},
    ]}>
<TabItem value="javascript">

```js
import crypto from 'crypto';

const requestBody = JSON.stringify({
  "messages": [
    {
      "content": "Respond with only two words.",
      "role": "user"
    }
  ],
  "stream": true,
  "model": "deepseek-ai/DeepSeek-V3.1"
});

const hash = crypto.createHash('sha256').update(requestBody).digest('hex');
console.log(hash); //b524f8f4b611b43526aa988c636cf1d7e72aa661876c3d969e2c2acae125a8ba
```

</TabItem>
<TabItem value="python">

```python
import hashlib
import json

request_body = {
    "messages": [
        {
            "content": "Respond with only two words.",
            "role": "user"
        }
    ],
    "stream": True,
    "model": "deepseek-ai/DeepSeek-V3.1"
}

# Convert to JSON string with same formatting as JavaScript
request_body_str = json.dumps(request_body, separators=(',', ':'))

# Calculate SHA-256 hash
hash_obj = hashlib.sha256(request_body_str.encode())
hash_hex = hash_obj.hexdigest()
print(hash_hex)  #b524f8f4b611b43526aa988c636cf1d7e72aa661876c3d969e2c2acae125a8ba
```

</TabItem>
</Tabs>

---

## Chat Message Response Hash

This value is calculated from the **exact response body string**.

:::info
    Please note the streaming response contains two new lines at the end and should not be omitted when copying response as the hash value will change.
:::

**_Example Response Body:_**

```bash
data: {"id":"chatcmpl-ba1b4314210adc3b","object":"chat.completion.chunk","created":1764763435,"model":"deepseek-ai/DeepSeek-V3.1","choices":[{"index":0,"delta":{"role":"assistant","content":"","reasoning_content":null},"logprobs":null,"finish_reason":null}],"prompt_token_ids":null}

data: {"id":"chatcmpl-ba1b4314210adc3b","object":"chat.completion.chunk","created":1764763435,"model":"deepseek-ai/DeepSeek-V3.1","choices":[{"index":0,"delta":{"content":"Okay","reasoning_content":null},"logprobs":null,"finish_reason":null,"token_ids":null}]}

data: {"id":"chatcmpl-ba1b4314210adc3b","object":"chat.completion.chunk","created":1764763435,"model":"deepseek-ai/DeepSeek-V3.1","choices":[{"index":0,"delta":{"content":".","reasoning_content":null},"logprobs":null,"finish_reason":null,"token_ids":null}]}

data: {"id":"chatcmpl-ba1b4314210adc3b","object":"chat.completion.chunk","created":1764763435,"model":"deepseek-ai/DeepSeek-V3.1","choices":[{"index":0,"delta":{"content":"","reasoning_content":null},"logprobs":null,"finish_reason":"stop","stop_reason":null,"token_ids":null}]}

data: {"id":"chatcmpl-ba1b4314210adc3b","object":"chat.completion.chunk","created":1764763435,"model":"deepseek-ai/DeepSeek-V3.1","choices":[],"usage":{"prompt_tokens":13,"total_tokens":16,"completion_tokens":3}}

data: [DONE]

```

Which hashes to:

```bash
aae79d9de9c46f0a9c478481ceb84df5742a88067a6ab8bac9e98664d712d58f
```

Here is an example of how to get the sha256 hash of your message response body:

<Tabs
  defaultValue="javascript"
  values={[
    {label: 'JavaScript', value: 'javascript'},
    {label: 'Python', value: 'python'},
    ]}>

<TabItem value="javascript">

```js
const response = await fetch('https://cloud-api.near.ai/v1/chat/completions', {
  method: 'POST',
  headers: {
    'accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.NEARAI_CLOUD_API_KEY}`
  },
  body: requestBody
});

const responseBody = await response.text();
const hash = crypto.createHash('sha256').update(responseBody).digest('hex');
console.log(hash); // aae79d9de9c46f0a9c478481ceb84df5742a88067a6ab8bac9e98664d712d58f
```

</TabItem>
<TabItem value="python">

```python
import hashlib
import requests
import os

response = requests.post(
    'https://cloud-api.near.ai/v1/chat/completions',
    headers={
        'accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {os.environ["NEARAI_CLOUD_API_KEY"]}'
    },
    json=request_body  # Uses the request_body from previous example
)

response_body = response.text
hash_obj = hashlib.sha256(response_body.encode())
hash_hex = hash_obj.hexdigest()
print(hash_hex)  # aae79d9de9c46f0a9c478481ceb84df5742a88067a6ab8bac9e98664d712d58f
```

</TabItem>
</Tabs>

---

## Chat Message Signature

From the Chat Message Response you will get a unique chat `id` that is used to fetch the Chat Message Signature from NEAR AI Cloud.

By default, you can query another API with the value of `id` in the response in 5 minutes after chat completion. The signature will be persistent in the LLM gateway once it's queried.

Use the following endpoint to get this signature:

```bash
GET https://cloud-api.near.ai/v1/signature/{chat_id}?model={model_id}&signing_algo=ecdsa
```

> **Implementation**: This endpoint is defined in the [NEAR AI Private ML SDK](https://github.com/nearai/private-ml-sdk/blob/a23fa797dfd7e676fba08cba68471b51ac9a13d9/vllm-proxy/src/app/api/v1/openai.py#L257).

For example, the response in the previous section, the `id` is:

 `chatcmpl-ba1b4314210adc3b`

```bash
curl -X GET 'https://cloud-api.near.ai/v1/signature/chatcmpl-ba1b4314210adc3b?model=deepseek-ai/DeepSeek-V3.1&signing_algo=ecdsa' \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer <YOUR-NEARAI-CLOUD-API-KEY>"
```

***Example Response:***

```json
{
  "text":"b524f8f4b611b43526aa988c636cf1d7e72aa661876c3d969e2c2acae125a8ba:aae79d9de9c46f0a9c478481ceb84df5742a88067a6ab8bac9e98664d712d58f",
  "signature":"0x649b30be41e53ac33cb3fe414c8f5fd30ad72cacaeac0f41c4977fee4b67506e185300f1978039306c406b398c4eda49c3dad476d5054c63fd811570815012cc1b",
  "signing_address":"0x319f1b8BB3b723A5d098FFB67005Bdf7BB579ACa",
  "signing_algo":"ecdsa"
}
```

The above response gives us all of the crucial information we need to verify that the message was executed in our trusted environment:

- `text` - This is the [Chat Message REQUEST Hash](#chat-message-request-hash) & [Chat Message RESPONSE Hash](#chat-message-response-hash) concatenated with a `:` separator.
- `signature` - This is the cryptographic signature of the `text` field, generated using the TEE's private key 
- `signing_address` - Public key of the TEE unique to the model we used
- `signing_algo` - Cryptography curve used to sign

You can see that `text` is:

`b524f8f4b611b43526aa988c636cf1d7e72aa661876c3d969e2c2acae125a8ba:aae79d9de9c46f0a9c478481ceb84df5742a88067a6ab8bac9e98664d712d58f`

This exactly matches the concatenated values we calculated in the previous sections:

- Request hash: `b524f8f4b611b43526aa988c636cf1d7e72aa661876c3d969e2c2acae125a8ba`
- Response hash: `aae79d9de9c46f0a9c478481ceb84df5742a88067a6ab8bac9e98664d712d58f`

:::note
    Due to resource limitations, signatures are kept in memory for **5 minutes** after the response is generated. However, once queried within this 5-minute window, the signature becomes persistent in the LLM gateway for future verification.
:::

---

## Verify Signature

Signature verification can be easily done with any standard ECDSA verification library such as [ethers](https://www.npmjs.com/package/ethers) or even an online tool such as [etherscan's VerifySignatures](https://etherscan.io/verifiedSignatures).

These tools will require:

- `Address`: What the expected address is for the signature. In our case it will be the one retrieved from your [attestation API query](./model) (see Model Verification page).
- `Message`: The original message before signing. In our case it will be the sha256 hash of the request and response (`text` field from [Chat Message Signature](#chat-message-signature))
- `Signature`: The signed message from above

Here is an example of how to verify the Chat Message signature using `ethers`:

<Tabs
  defaultValue="javascript"
  values={[
    {label: 'JavaScript', value: 'javascript'},
    {label: 'Python', value: 'python'},
    ]}>
<TabItem value="javascript">

```js
import { ethers } from 'ethers';

const text = "b524f8f4b611b43526aa988c636cf1d7e72aa661876c3d969e2c2acae125a8ba:aae79d9de9c46f0a9c478481ceb84df5742a88067a6ab8bac9e98664d712d58f";
const signature = "0x649b30be41e53ac33cb3fe414c8f5fd30ad72cacaeac0f41c4977fee4b67506e185300f1978039306c406b398c4eda49c3dad476d5054c63fd811570815012cc1b";
const expectedAddress = "0x319f1b8BB3b723A5d098FFB67005Bdf7BB579ACa";

// Recover the address from the signature
const recoveredAddress = ethers.verifyMessage(text, signature);

// Compare with expected address (case-insensitive)
const isValid = recoveredAddress.toLowerCase() === expectedAddress.toLowerCase();

console.log("Text:", text);
console.log("Expected address:", expectedAddress);
console.log("Recovered address:", recoveredAddress);
console.log("Signature valid:", isValid);
```

</TabItem>
<TabItem value="python">

```python
from eth_account import Account
from eth_account.messages import encode_defunct

text = "b524f8f4b611b43526aa988c636cf1d7e72aa661876c3d969e2c2acae125a8ba:aae79d9de9c46f0a9c478481ceb84df5742a88067a6ab8bac9e98664d712d58f"
signature = "0x649b30be41e53ac33cb3fe414c8f5fd30ad72cacaeac0f41c4977fee4b67506e185300f1978039306c406b398c4eda49c3dad476d5054c63fd811570815012cc1b"
expected_address = "0x319f1b8BB3b723A5d098FFB67005Bdf7BB579ACa"

# Create a message object that can be signed
message = encode_defunct(text=text)

# Recover the address from the signature
recovered_address = Account.recover_message(message, signature=signature)

# Compare with expected address (case-insensitive)
is_valid = recovered_address.lower() == expected_address.lower()

print("Text:", text)
print("Expected address:", expected_address)
print("Recovered address:", recovered_address)
print("Signature valid:", is_valid)
```

</TabItem>
</Tabs>
