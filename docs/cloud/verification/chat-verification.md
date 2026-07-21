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

:::info Two signature kinds
There are two kinds of chat signatures, distinguished by the `signature_kind` field on the gateway's signature response — see [Signature Kinds](#signature-kinds):

- **`provider_tee`** — generated **inside the model TEE** over the exact bytes the TEE received and sent. This is always what you get from a model's [direct completions endpoint](/cloud/private-inference#direct-completions) (`{slug}.completions.near.ai`) — the examples below use `qwen35-122b.completions.near.ai`.
- **`gateway`** — generated **inside the gateway TEE** (`cloud-api.near.ai`) over the exact bytes the gateway returned to you. Used when the gateway rewrites streamed response bytes (OpenAI-spec usage accounting), so the model TEE's byte-exact signature could no longer match what you received.
:::

---

## Chat Message Request Hash

The value is calculated from the **exact JSON request body string** as it was sent over the wire.

**_Example:_**

```json
{"messages":[{"content":"Respond with only two words.","role":"user"}],"stream":true,"model":"Qwen/Qwen3.5-122B-A10B","chat_template_kwargs":{"enable_thinking":false}}
```

Which hashes to:

```bash
2974f24b2a687856d2a0cf08d813902965c25e6552ba7062e4fa303432b6d2ad
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
  "model": "Qwen/Qwen3.5-122B-A10B",
  "chat_template_kwargs": {"enable_thinking": false}
});

const hash = crypto.createHash('sha256').update(requestBody).digest('hex');
console.log(hash); //2974f24b2a687856d2a0cf08d813902965c25e6552ba7062e4fa303432b6d2ad
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
    "model": "Qwen/Qwen3.5-122B-A10B",
    "chat_template_kwargs": {"enable_thinking": False}
}

# Convert to JSON string with same formatting as JavaScript
request_body_str = json.dumps(request_body, separators=(',', ':'))

# Calculate SHA-256 hash
hash_obj = hashlib.sha256(request_body_str.encode())
hash_hex = hash_obj.hexdigest()
print(hash_hex)  #2974f24b2a687856d2a0cf08d813902965c25e6552ba7062e4fa303432b6d2ad
```

</TabItem>
</Tabs>

---

## Chat Message Response Hash

This value is calculated from the **exact response payload string**.

:::info
    Please note that the streaming response contains two new lines at the end and should not be omitted when copying the response as the hash value will change.
:::

**_Example Response Body:_**

```bash
data: {"choices":[{"delta":{"content":"","reasoning_content":null,"role":"assistant"},"finish_reason":null,"index":0,"logprobs":null,"matched_stop":null}],"created":1780404899,"id":"afa7975eaf844b1888776cf41548e230","model":"Qwen/Qwen3.5-122B-A10B","object":"chat.completion.chunk"}

data: {"choices":[{"delta":{"content":"Under","reasoning_content":null},"finish_reason":null,"index":0,"logprobs":null,"matched_stop":null}],"created":1780404899,"id":"afa7975eaf844b1888776cf41548e230","model":"Qwen/Qwen3.5-122B-A10B","object":"chat.completion.chunk"}

data: {"choices":[{"delta":{"content":"stood.","reasoning_content":null},"finish_reason":null,"index":0,"logprobs":null,"matched_stop":null}],"created":1780404899,"id":"afa7975eaf844b1888776cf41548e230","model":"Qwen/Qwen3.5-122B-A10B","object":"chat.completion.chunk"}

data: {"choices":[{"delta":{"reasoning_content":null},"finish_reason":"stop","index":0,"logprobs":null,"matched_stop":248046}],"created":1780404899,"id":"afa7975eaf844b1888776cf41548e230","model":"Qwen/Qwen3.5-122B-A10B","object":"chat.completion.chunk"}

data: {"choices":[],"created":1780404899,"id":"afa7975eaf844b1888776cf41548e230","model":"Qwen/Qwen3.5-122B-A10B","object":"chat.completion.chunk","usage":{"completion_tokens":4,"prompt_tokens":18,"prompt_tokens_details":null,"reasoning_tokens":0,"total_tokens":22}}

data: [DONE]

```

Which hashes to:

```bash
8cb30eef9d133bdc6bfe812772dc4a62336d2827caea843546cbeff3f004c42c
```

Here is an example of how to get the sha256 hash of your message response payload:

<Tabs
  defaultValue="javascript"
  values={[
    {label: 'JavaScript', value: 'javascript'},
    {label: 'Python', value: 'python'},
    ]}>

<TabItem value="javascript">

```js
const response = await fetch('https://qwen35-122b.completions.near.ai/v1/chat/completions', {
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
console.log(hash); // 8cb30eef9d133bdc6bfe812772dc4a62336d2827caea843546cbeff3f004c42c
```

</TabItem>
<TabItem value="python">

```python
import hashlib
import requests
import os

response = requests.post(
    'https://qwen35-122b.completions.near.ai/v1/chat/completions',
    headers={
        'accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {os.environ["NEARAI_CLOUD_API_KEY"]}'
    },
    data=request_body_str  # Uses the exact string from the previous example
)

response_body = response.text
hash_obj = hashlib.sha256(response_body.encode())
hash_hex = hash_obj.hexdigest()
print(hash_hex)  # 8cb30eef9d133bdc6bfe812772dc4a62336d2827caea843546cbeff3f004c42c
```

</TabItem>
</Tabs>

---

## Chat Message Signature

From the Chat Message Response you will get a unique chat `id` that is used to fetch the Chat Message Signature from NEAR AI Cloud.

You can query the signature API with the value of `id` from the response after chat completion.

Use one of the following endpoints to get the signature:

**Via Direct Completions:**
```bash
GET https://{slug}.completions.near.ai/v1/signature/{chat_id}?signing_algo=ecdsa
```

**Via Gateway:**
```bash
GET https://cloud-api.near.ai/v1/signature/{chat_id}?model={model_id}&signing_algo=ecdsa
```

For example, the `id` from the response in the previous section is:

 `afa7975eaf844b1888776cf41548e230`

```bash
# Via direct completions:
curl -X GET 'https://qwen35-122b.completions.near.ai/v1/signature/afa7975eaf844b1888776cf41548e230?signing_algo=ecdsa' \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer <YOUR-NEARAI-CLOUD-API-KEY>"
```

:::note
A model can be served by multiple TEE nodes behind the same domain. The signature is cached on the node that served your chat completion, so a lookup may transiently return `Chat id not found or expired` if it lands on a different node — simply retry until you hit the right one.
:::

***Example Response:***

```json
{
  "text":"Qwen/Qwen3.5-122B-A10B:2974f24b2a687856d2a0cf08d813902965c25e6552ba7062e4fa303432b6d2ad:8cb30eef9d133bdc6bfe812772dc4a62336d2827caea843546cbeff3f004c42c",
  "signature":"0xed381e84d059198d1826e44dbbbac9501caaa8f79f913f27578acafa5be852e6103fe34fabd6446d7fde3f5250c0a16e109fe088a562bae08ac13d081a66d0761b",
  "signing_address":"0x6525e128afcffebf7eed05d485d7be983cdae934",
  "signing_algo":"ecdsa"
}
```

The above response gives us all of the crucial information we need to verify that the message was executed in our trusted environment:

- `text` - The signed payload. Its format depends on the [signature kind](#signature-kinds): `{model_id}:{request_hash}:{response_hash}` for a model-TEE signature (as in this example), `{request_hash}:{response_hash}` for a gateway signature
- `signature` - This is the cryptographic signature of the `text` field, generated using the TEE's private key 
- `signing_address` - Public key of the TEE that signed (the model TEE for `provider_tee`, the gateway TEE for `gateway`)
- `signing_algo` - Cryptography curve used to sign
- `signature_kind` - Which key produced the signature: `"provider_tee"` or `"gateway"` (gateway endpoint only — see [Signature Kinds](#signature-kinds))

You can see that `text` is:

`Qwen/Qwen3.5-122B-A10B:2974f24b2a687856d2a0cf08d813902965c25e6552ba7062e4fa303432b6d2ad:8cb30eef9d133bdc6bfe812772dc4a62336d2827caea843546cbeff3f004c42c`

This exactly matches the model we requested and the values we calculated in the previous sections:

- Model: `Qwen/Qwen3.5-122B-A10B`
- Request hash: `2974f24b2a687856d2a0cf08d813902965c25e6552ba7062e4fa303432b6d2ad`
- Response hash: `8cb30eef9d133bdc6bfe812772dc4a62336d2827caea843546cbeff3f004c42c`

---

## Signature Kinds

Signatures fetched from the gateway (`GET https://cloud-api.near.ai/v1/signature/{chat_id}`) carry a `signature_kind` field that tells you which key signed and what the `text` payload contains:

### `provider_tee`

- **Who signs:** the model TEE that served your request, with the signing key from its [model attestation](/cloud/verification/model). Verify `signing_address` against that attestation.
- **Payload:** `text = "{model_id}:{request_hash}:{response_hash}"`.
- **What it covers:** the exact request bytes the model TEE received and the exact response bytes it sent. When you use a [direct completions endpoint](/cloud/private-inference#direct-completions), the bytes you sent and received are those bytes, so both hashes verify byte-for-byte against your own traffic. (Direct completions signature responses come straight from the model TEE and do not carry a `signature_kind` field — they are always model-TEE signatures.)

### `gateway`

- **Who signs:** the gateway TEE (`cloud-api.near.ai`), with the same signing key whose address is returned by the [gateway attestation report](/cloud/verification/gateway) (`GET /v1/attestation/report`). Verify `signing_address` against that report.
- **Payload:** `text = "{request_hash}:{response_hash}"` — no model-ID prefix.
- **What it covers:** the exact request body you sent to the gateway and the exact response bytes the gateway returned to you, so both hashes verify byte-for-byte against your own traffic.

The gateway signs a streamed response itself when it has rewritten the stream bytes for OpenAI compatibility, which makes the model TEE's byte-exact signature unable to match what you received:

- **Usage accounting** — with `stream_options: {"include_usage": true}`, the gateway rewrites intermediate chunks to carry `usage: null` and appends a single final usage chunk.
- **Usage stripping** — on attested models, default streaming (no `stream_options`) and `"include_usage": false` streams have per-chunk usage nulled out and the upstream's trailing usage-only chunk dropped.

In both cases the gateway stores its signature **before** emitting the final `data: [DONE]` line, so the signature is retrievable the moment the stream ends. The gateway signature also covers attested third-party fallback serving (`x-serving-provider: chutes` response header): those backends protect response integrity with an end-to-end encrypted channel rather than a per-response model signature, so a rewritten stream served by them is signed by the gateway alone.

:::note Legacy signatures
Signatures stored before `signature_kind` was recorded omit the field — their provenance is unknown rather than guessed. You can still distinguish them structurally: a `text` with three `:`-separated fields (`{model_id}:{request_hash}:{response_hash}`) is a model-TEE payload; one with two (`{request_hash}:{response_hash}`) is a gateway payload.
:::

---

## Verify Signature

Signature verification can be easily done with any standard ECDSA verification library such as [ethers](https://www.npmjs.com/package/ethers) or even an online tool such as [etherscan's VerifySignatures](https://etherscan.io/verifiedSignatures).

These tools will require:

- `Address`: What the expected address is for the signature. In our case it will be the one retrieved from your [attestation API query](./model) (see Model Verification page).
- `Message`: The original message before signing. In our case it will be the `text` field from [Chat Message Signature](#chat-message-signature) (`{model_id}:{request_hash}:{response_hash}`)
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

const text = "Qwen/Qwen3.5-122B-A10B:2974f24b2a687856d2a0cf08d813902965c25e6552ba7062e4fa303432b6d2ad:8cb30eef9d133bdc6bfe812772dc4a62336d2827caea843546cbeff3f004c42c";
const signature = "0xed381e84d059198d1826e44dbbbac9501caaa8f79f913f27578acafa5be852e6103fe34fabd6446d7fde3f5250c0a16e109fe088a562bae08ac13d081a66d0761b";
const expectedAddress = "0x6525e128afcffebf7eed05d485d7be983cdae934";

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

text = "Qwen/Qwen3.5-122B-A10B:2974f24b2a687856d2a0cf08d813902965c25e6552ba7062e4fa303432b6d2ad:8cb30eef9d133bdc6bfe812772dc4a62336d2827caea843546cbeff3f004c42c"
signature = "0xed381e84d059198d1826e44dbbbac9501caaa8f79f913f27578acafa5be852e6103fe34fabd6446d7fde3f5250c0a16e109fe088a562bae08ac13d081a66d0761b"
expected_address = "0x6525e128afcffebf7eed05d485d7be983cdae934"

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
