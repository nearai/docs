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
  "model": "llama-3.3-70b-instruct"
}
```

Which hashes to:

```bash
31f46232b8ae6154e75a68256523851c1ce84f9ad53a1f8290c9d0576b95929f
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
  "model": "llama-3.3-70b-instruct"
});

const hash = crypto.createHash('sha256').update(requestBody).digest('hex');
console.log(hash); //31f46232b8ae6154e75a68256523851c1ce84f9ad53a1f8290c9d0576b95929f
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
    "model": "llama-3.3-70b-instruct"
}

# Convert to JSON string with same formatting as JavaScript
request_body_str = json.dumps(request_body, separators=(',', ':'))

# Calculate SHA-256 hash
hash_obj = hashlib.sha256(request_body_str.encode())
hash_hex = hash_obj.hexdigest()
print(hash_hex)  #31f46232b8ae6154e75a68256523851c1ce84f9ad53a1f8290c9d0576b95929f
```

</TabItem>
</Tabs>

---

## Chat Message Response Hash

This value is calculated from the **exact response body string**.

**_Example Response Body:_**

```bash
data: {"id":"chatcmpl-13edbcd23c9e4139b796fa988a88451b","created":1756693844,"model":"phala/llama-3.3-70b-instruct","object":"chat.completion.chunk","choices":[{"index":0,"delta":{"content":"I","role":"assistant"}}]}

data: {"id":"chatcmpl-13edbcd23c9e4139b796fa988a88451b","created":1756693844,"model":"phala/llama-3.3-70b-instruct","object":"chat.completion.chunk","choices":[{"index":0,"delta":{"content":" agree"}}]}

data: {"id":"chatcmpl-13edbcd23c9e4139b796fa988a88451b","created":1756693844,"model":"phala/llama-3.3-70b-instruct","object":"chat.completion.chunk","choices":[{"finish_reason":"stop","index":0,"delta":{}}]}

data: [DONE]
```

Which hashes to:

```bash
5d679ec62b9d8e9681085814391bfef9e837b8cc08757f479302311b828284b2
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
console.log(hash); // 5d679ec62b9d8e9681085814391bfef9e837b8cc08757f479302311b828284b2
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
print(hash_hex)  # 5d679ec62b9d8e9681085814391bfef9e837b8cc08757f479302311b828284b2
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

 `chatcmpl-13edbcd23c9e4139b796fa988a88451b`

```bash
curl -X GET 'https://cloud-api.near.ai/signature/chatcmpl-13edbcd23c9e4139b796fa988a88451b?model=llama-3.3-70b-instruct&signing_algo=ecdsa' \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer <YOUR-NEARAI-CLOUD-API-KEY>"
```

***Example Response:***

```json
{
  "text": "31f46232b8ae6154e75a68256523851c1ce84f9ad53a1f8290c9d0576b95929f:5d679ec62b9d8e9681085814391bfef9e837b8cc08757f479302311b828284b2",
  "signature": "0x5ed3ac0642bceb8cdd5b222cd2db36b92af2a4d427f11cd1bec0e5b732b94628015f32f2cec91865148bf9d6f56ab673645f6bc500421cd28ff120339ea7e1a01b",
  "signing_address": "0x1d58EE32e9eB327c074294A2b8320C47E33b9316",
  "signing_algo": "ecdsa"
}
```

The above response gives us all of the crucial information we need to verify that the message was executed in our trusted environment:

- `text` - This is the [Chat Message REQUEST Hash](#chat-message-request-hash) & [Chat Message RESPONSE Hash](#chat-message-response-hash) concatenated with a `:` separator.
- `signature` - This is the cryptographic signature of the `text` field, generated using the TEE's private key
- `signing_address` - Public key of the TEE unique to the model we used
- `signing_algo` - Cryptography curve used to sign

You can see that `text` is:

`31f46232b8ae6154e75a68256523851c1ce84f9ad53a1f8290c9d0576b95929f:5d679ec62b9d8e9681085814391bfef9e837b8cc08757f479302311b828284b2`

This exactly matches the concatenated values we calculated in the previous sections:

- Request hash: `31f46232b8ae6154e75a68256523851c1ce84f9ad53a1f8290c9d0576b95929f`
- Response hash: `5d679ec62b9d8e9681085814391bfef9e837b8cc08757f479302311b828284b2`

:::note
    Due to resource limitations, signatures are kept in memory for **5 minutes** after the response is generated. However, once queried within this 5-minute window, the signature becomes persistent in the LLM gateway for future verification.
:::

---

## Verify Signature

Signature verification can be easily done with any standard ECDSA verification library such as [ethers](https://www.npmjs.com/package/ethers) or even an online tool such as [etherscan's VerifySignatures](https://etherscan.io/verifiedSignatures).

These tools will require:

- `Address`: What the expected address is for the signature. In our case it will be the one retrieved from your attestation API query (see Model Verification page).
- `Message`: The original message before signing. In our case it will be the sha256 hash of the request and response (`text` field from [Get Chat Message Signature](#chat-message-signature))
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

const text = "65b0adb47d0450971803dfb18d0ce4af4a64d27420a43d5aad4066ebf10b81b5:e508d818744d175a62aae1a9fb3f373c075460cbe50bf962a88ac008c843dff1";
const signature = "0xf28f537325c337fd96ae6e156783c904ca708dcd38fb8a476d1280dfc72dc88e4fcb5c3941bdd4f8fe5238a2253b975c6b02ea6a0a450b5b0f9296ab54cf24181b";
const expectedAddress = "0xc51268C9b46140619CBC066A34441a6ca51F85f9";

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

text = "65b0adb47d0450971803dfb18d0ce4af4a64d27420a43d5aad4066ebf10b81b5:e508d818744d175a62aae1a9fb3f373c075460cbe50bf962a88ac008c843dff1"
signature = "0xf28f537325c337fd96ae6e156783c904ca708dcd38fb8a476d1280dfc72dc88e4fcb5c3941bdd4f8fe5238a2253b975c6b02ea6a0a450b5b0f9296ab54cf24181b"
expected_address = "0xc51268C9b46140619CBC066A34441a6ca51F85f9"

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
