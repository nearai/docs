---
id: model-verification
title: Model Verification
sidebar_label: Model Verification
slug: /cloud/verification/model
description: ""
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Model Verification

To verify a NEAR AI model is operating in a secure trusted environment, there are two main steps:

- [Request Model Attestation](#request-model-attestation) report from NEAR AI Cloud
- [Verify Model Attestation](#verifying-model-attestation) report using NVIDIA & Intel attestation authenticators

:::tip 
See an example implementation in the [NEAR AI Cloud Verification Example](https://github.com/near-examples/nearai-cloud-verification-example) repo.

A more complete verifier implementation is available in the [NEAR AI Cloud Verifier](https://github.com/nearai/nearai-cloud-verifier) repo. 
:::

---

## Request Model Attestation

To request a model attestation from NEAR AI cloud, use the following `GET` API endpoint:

```bash
https://cloud-api.near.ai/v1/attestation/report?model={model_name}&signing_algo=ecdsa&nonce={nonce}
```

The `signing_algo` parameter specifies the signing algorithm used (`ecdsa` or `ed25519`). The `nonce` parameter is optional but recommended. It should be a randomly generated 64 character hexadecimal string (32 bytes) that ensures attestation freshness and prevents replay attacks. If not provided, the server will generate one for you.

<Tabs
  defaultValue="curl"
  values={[
    {label: 'curl', value: 'curl'},
    {label: 'JavaScript', value: 'javascript'},
    {label: 'Python', value: 'python'},
    ]}>
<TabItem value="curl">

```bash
# Generate a random 64-character hex nonce (optional but recommended)
NONCE=$(openssl rand -hex 32)

curl "https://cloud-api.near.ai/v1/attestation/report?model=deepseek-ai/DeepSeek-V3.1&signing_algo=ecdsa&nonce=${NONCE}" \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
```

</TabItem>
<TabItem value="javascript">

```js
import crypto from 'crypto';

const MODEL_NAME = 'deepseek-ai/DeepSeek-V3.1'
// Generate a random 64-character hex nonce (optional but recommended)
const nonce = crypto.randomBytes(32).toString('hex');

const response = await fetch(
  `https://cloud-api.near.ai/v1/attestation/report?model=${MODEL_NAME}&signing_algo=ecdsa&nonce=${nonce}`,
  {
    headers: {
      'Content-Type': 'application/json',
      },
  }
);
```

</TabItem>
<TabItem value="python">

```python
import requests
import secrets

MODEL_NAME = 'deepseek-ai/DeepSeek-V3.1'
# Generate a random 64-character hex nonce (optional but recommended)
nonce = secrets.token_hex(32)

response = requests.get(
    f'https://cloud-api.near.ai/v1/attestation/report?model={MODEL_NAME}&signing_algo=ecdsa&nonce={nonce}',
    headers={
        'Content-Type': 'application/json',
    }
)
```

</TabItem>
</Tabs>

<details>
 <summary>Example Response:</summary>
```json
{      
"model_attestations": [         \\ List of all GPU nodes in the network
  {
    "signing_address": "...",   \\ TEE Public Key
    "nvidia_payload": "...",    \\ Attestation report used to verify w/ NVIDIA
    "intel_quote": "..."        \\ Attestation report use to verify w/ Intel
  }
]
}
```

- `model_attestations`: List attestations from all GPU nodes as multiple TEE nodes may be used to serve inference requests. 

- `signing_address`: Account address generated inside TEE that will be used to sign the chat response. You can utilize the `signing_address` from `model_attestations` to select the appropriate TEE node for verifying its integrity.

- `nvidia_payload` and `intel_quote`: Attestation report formatted for NVIDIA TEE and Intel TEE respectively. You can use them to verify the integrity of the TEE. See [Verifying Model Attestation](#verifying-model-attestation) for more details.

</details>



:::note
    **Implementation**: This endpoint is defined in the [NEAR AI Private ML SDK](https://github.com/nearai/private-ml-sdk/blob/a23fa797dfd7e676fba08cba68471b51ac9a13d9/vllm-proxy/src/app/api/v1/openai.py#L170).
:::

## Verifying Model Attestation

Once you have [requested a model attestation](#request-model-attestation) from NEAR AI Cloud, you can use the returned payload to verify its authenticity. You can verify:

- **GPU attestation**: Submit GPU evidence payload to NVIDIA NRAS and verify the nonce matches
- **Intel TDX quote**: Verifies TDX quote with [`dcap-qvl`](https://github.com/Phala-Network/dcap-qvl) library
- **TDX report data**: Validates that report data binds the signing key (ECDSA or Ed25519) and nonce
- **Compose manifest**: Displays Docker compose manifest and verifies it matches the mr_config measurement
- **Sigstore provenance**: Verifies container image provenance links

### Verify GPU Attestation

NVIDIA offers a [Remote Attestation Service](https://docs.nvidia.com/attestation/technical-docs-nras/latest/nras_introduction.html) that allows you to verify that you are using a trusted environment with one of their GPUs. To verify:

1. Submit the GPU evidence payload (`nvidia_payload`) to NVIDIA NRAS
2. Verify the nonce in the GPU payload matches the request nonce
3. Validate the NVIDIA attestation verdict is PASS

The `nvidia_payload` contains:
- `nonce` - The nonce from your attestation request
- `arch` - Architecture of the GPU _(HOPPER or BLACKWELL)_
- `evidence_list` - A list of GPU evidence items, each containing an evidence and a corresponding certificate

The `evidence_list` contains Base64 encoded data that lists the GPU's:

- Hardware Identity
- Firmware & Software measurements
- Security configuration state
- Endorsement certificates (Signed measurements from the GPU's unique key)

The private key of this GPU is how we can securely verify the authenticity. NVIDIA burns this unique private key into each GPU during the manufacturing process and only retains the corresponding public key, which is used to verify the signature of attestations provided to them.

All of this data is provided to you from the [Model Attestation response](#request-model-attestation) as `nvidia_payload`.

Simply use this JSON Object with your API call:

```bash
curl -X POST https://nras.attestation.nvidia.com/v3/attest/gpu \
 -H "accept: application/json" \
 -H "content-type: application/json" \
 -d "<NVIDIA_PAYLOAD_FROM_NEARAI_MODEL_ATTESTATION>"
```

See official documentation: https://docs.api.nvidia.com/attestation/reference/attestmultigpu_1

<details>
 <summary>Example Response:</summary>

```json
[
  [
    "JWT",
    "eyJraWQiOiJudi1lYXQta2lkLXByb2QtMjAyNTA4MjQxNzI2MzczMzEtMGM4YzM2MzQtY2ZkMC00YmViLWFmNWYtMTE2MzliOWUxOTIyIiwiYWxnIjoiRVMzODQifQ.eyJzdWIiOiJOVklESUEtUExBVEZPUk0tQVRURVNUQVRJT04iLCJ4LW52aWRpYS12ZXIiOiIyLjAiLCJuYmYiOjE3NTYxNjg5MjYsImlzcyI6Imh0dHBzOi8vbnJhcy5hdHRlc3RhdGlvbi5udmlkaWEuY29tIiwieC1udmlkaWEtb3ZlcmFsbC1hdHQtcmVzdWx0Ijp0cnVlLCJzdWJtb2RzIjp7IkdQVS0wIjpbIkRJR0VTVCIsWyJTSEEtMjU2IiwiMDJmYzJmMTg3M2JkZjg5Y2VlNGYzZTQzYzU3ZTE3YzI0ODUxODcwMmQ4ZGZjMzcwNmE3YjdmZTgwMzZlOTNkMCJdXX0sImVhdF9ub25jZSI6IjRkNmUwYzQ5MzIxZDIyZGFhOWJkN2ZjMjIwNWUzODFmOTUwNmMyMGU3N2RkNTA4MmVjZjVlMTI0ZWMwZjQ2MTgiLCJleHAiOjE3NTYxNzI1MjYsImlhdCI6MTc1NjE2ODkyNiwianRpIjoiYzFhM2NkYzktZWUyMi00MmFkLTljZDEtNDRhMTE5OWYyZGVlIn0.199S4bah6SVZpy4lpBvRBc975tmf25gkf_mLDwR9-fwrc_kWYePNxGygTRQUzGbRdbrZOQHXWP0eALUPkJvmwGIV_MVfHRIKaBIRdr1e2_7jEP1-mqkbCmbefimiZN8t"
  ],
  {
    "GPU-0": "eyJraWQiOiJudi1lYXQta2lkLXByb2QtMjAyNTA4MjQxNzI2MzczMzEtMGM4YzM2MzQtY2ZkMC00YmViLWFmNWYtMTE2MzliOWUxOTIyIiwiYWxnIjoiRVMzODQifQ.eyJ4LW52aWRpYS1ncHUtZHJpdmVyLXJpbS1zY2hlbWEtdmFsaWRhdGVkIjp0cnVlLCJpc3MiOiJodHRwczovL25yYXMuYXR0ZXN0YXRpb24ubnZpZGlhLmNvbSIsIngtbnZpZGlhLWdwdS1hdHRlc3RhdGlvbi1yZXBvcnQtY2VydC1jaGFpbi12YWxpZGF0ZWQiOnRydWUsImVhdF9ub25jZSI6IjRkNmUwYzQ5MzIxZDIyZGFhOWJkN2ZjMjIwNWUzODFmOTUwNmMyMGU3N2RkNTA4MmVjZjVlMTI0ZWMwZjQ2MTgiLCJ4LW52aWRpYS1ncHUtdmJpb3MtcmltLXNpZ25hdHVyZS12ZXJpZmllZCI6dHJ1ZSwieC1udmlkaWEtZ3B1LXZiaW9zLXJpbS1mZXRjaGVkIjp0cnVlLCJleHAiOjE3NTYxNzI1MjYsImlhdCI6MTc1NjE2ODkyNiwidWVpZCI6IjY0Mjk2MDE4OTI5ODAwNzUxMTI1MDk1ODAzMDUwMDc0OTE1MjczMDIyMTE0MjQ2OCIsImp0aSI6IjFhMzhjMTAzLWMyODAtNDQyMi1hZDc1LTRkMTA3OTkyMGI2MyIsIngtbnZpZGlhLWdwdS1hdHRlc3RhdGlvbi1yZXBvcnQtbm9uY2UtbWF0Y2giOnRydWUsIngtbnZpZGlhLWdwdS12Ymlvcy1pbmRleC1uby1jb25mbGljdCI6dHJ1ZSwieC1udmlkaWEtZ3B1LXZiaW9zLXJpbS1jZXJ0LXZhbGlkYXRlZCI6dHJ1ZSwic2VjYm9vdCI6dHJ1ZSwieC1udmlkaWEtZ3B1LWF0dGVzdGF0aW9uLXJlcG9ydC1wYXJzZWQiOnRydWUsIngtbnZpZGlhLWdwdS1kcml2ZXItcmltLXNpZ25hdHVyZS12ZXJpZmllZCI6dHJ1ZSwieC1udmlkaWEtZ3B1LWFyY2gtY2hlY2siOnRydWUsIngtbnZpZGlhLWF0dGVzdGF0aW9uLXdhcm5pbmciOm51bGwsIm5iZiI6MTc1NjE2ODkyNiwieC1udmlkaWEtZ3B1LWRyaXZlci12ZXJzaW9uIjoiNTcwLjEzMy4yMCIsIngtbnZpZGlhLWdwdS1kcml2ZXItcmltLW1lYXN1cmVtZW50cy1hdmFpbGFibGUiOnRydWUsIngtbnZpZGlhLWdwdS1hdHRlc3RhdGlvbi1yZXBvcnQtc2lnbmF0dXJlLXZlcmlmaWVkIjp0cnVlLCJod21vZGVsIjoiR0gxMDAgQTAxIEdTUCBCUk9NIiwiZGJnc3RhdCI6ImRpc2FibGVkIiwieC1udmlkaWEtZ3B1LWRyaXZlci1yaW0tZmV0Y2hlZCI6dHJ1ZSwib2VtaWQiOiI1NzAzIiwieC1udmlkaWEtZ3B1LXZiaW9zLXJpbS1zY2hlbWEtdmFsaWRhdGVkIjp0cnVlLCJtZWFzcmVzIjoic3VjY2VzcyIsIngtbnZpZGlhLWdwdS1kcml2ZXItcmltLWNlcnQtdmFsaWRhdGVkIjp0cnVlLCJ4LW52aWRpYS1ncHUtdmJpb3MtdmVyc2lvbiI6Ijk2LjAwLkNGLjAwLjAyIiwieC1udmlkaWEtZ3B1LXZiaW9zLXJpbS1tZWFzdXJlbWVudHMtYXZhaWxhYmxlIjp0cnVlfQ.Zjac1Al0OsYbrXu7lOKDAH7lLNnRU_G2R1UJBnUpvZKL1EE8mjPyy-4sqRvE_d8uZJ4GuhXoy_EonyuUIXESd3sxjY0Eohe9Rtlzatj14iLOdcVrF_eOq12ZHNIYs4Go"
  }
]
```
</details>

:::tip
    NVIDIA's attestation verification response returns a "Entity Attestation Token" (EAT) encoded as a JSON Web Token (JWT)

    To decode these values, you can use an online tool such as [jwt.io](https://www.jwt.io) or a library such as [Jose](https://www.npmjs.com/package/jose).

<details>
 <summary>Example Formatted Result:</summary>

```json

"JWT":
{
  "sub": "NVIDIA-PLATFORM-ATTESTATION",
  "x-nvidia-ver": "2.0",
  "nbf": 1756168926,
  "iss": "https://nras.attestation.nvidia.com",
  "x-nvidia-overall-att-result": true,
  "submods": {
    "GPU-0": [
      "DIGEST",
      [
        "SHA-256",
        "02fc2f1873bdf89cee4f3e43c57e17c248518702d8dfc3706a7b7fe8036e93d0"
      ]
    ]
  },
  "eat_nonce": "4d6e0c49321d22daa9bd7fc2205e381f9506c20e77dd5082ecf5e124ec0f4618",
  "exp": 1756172526,
  "iat": 1756168926,
  "jti": "c1a3cdc9-ee22-42ad-9cd1-44a1199f2dee"
}

"GPU-0":
{
  "x-nvidia-gpu-driver-rim-schema-validated": true,
  "iss": "https://nras.attestation.nvidia.com",
  "x-nvidia-gpu-attestation-report-cert-chain-validated": true,
  "eat_nonce": "4d6e0c49321d22daa9bd7fc2205e381f9506c20e77dd5082ecf5e124ec0f4618",
  "x-nvidia-gpu-vbios-rim-signature-verified": true,
  "x-nvidia-gpu-vbios-rim-fetched": true,
  "exp": 1756172526,
  "iat": 1756168926,
  "ueid": "642960189298007511250958030500749152730221142468",
  "jti": "1a38c103-c280-4422-ad75-4d1079920b63",
  "x-nvidia-gpu-attestation-report-nonce-match": true,
  "x-nvidia-gpu-vbios-index-no-conflict": true,
  "x-nvidia-gpu-vbios-rim-cert-validated": true,
  "secboot": true,
  "x-nvidia-gpu-attestation-report-parsed": true,
  "x-nvidia-gpu-driver-rim-signature-verified": true,
  "x-nvidia-gpu-arch-check": true,
  "x-nvidia-attestation-warning": null,
  "nbf": 1756168926,
  "x-nvidia-gpu-driver-version": "570.133.20",
  "x-nvidia-gpu-driver-rim-measurements-available": true,
  "x-nvidia-gpu-attestation-report-signature-verified": true,
  "hwmodel": "GH100 A01 GSP BROM",
  "dbgstat": "disabled",
  "x-nvidia-gpu-driver-rim-fetched": true,
  "oemid": "5703",
  "x-nvidia-gpu-vbios-rim-schema-validated": true,
  "measres": "success",
  "x-nvidia-gpu-driver-rim-cert-validated": true,
  "x-nvidia-gpu-vbios-version": "96.00.CF.00.02",
  "x-nvidia-gpu-vbios-rim-measurements-available": true
}

```

</details>

:::


### Verify TDX Quote

You can verify the Intel TDX quote with the value of `intel_quote` using the [`dcap-qvl`](https://github.com/Phala-Network/dcap-qvl) library. This verifies:

- The CPU TEE measurements are valid
- The quote is authentic and signed by Intel
- The TEE environment is genuine

Alternatively, you can verify the Intel TDX quote at [TEE Attestation Explorer](https://proof.t16z.com/).

### Verify TDX Report Data

The TDX report data validates that:
- The report data binds the signing key (ECDSA or Ed25519) 
- The report data embeds the request nonce

This ensures cryptographic binding between the signing key and the hardware, and prevents replay attacks through nonce freshness.

### Verify Compose Manifest

The attestation response includes Docker compose manifest information in the `info` field. To verify:

1. Extract the Docker compose manifest from the attestation
2. Calculate the SHA-256 hash of the compose manifest
3. Compare it with the `mr_config` measurement from the verified TDX quote
4. Verify they match, proving the exact container configuration

This ensures the exact Docker compose file is deployed to the TEE.

### Verify Sigstore Provenance

Extract all container image digests from the Docker compose manifest (matching `@sha256:xxx` patterns) and verify Sigstore accessibility for each image. This allows you to:

1. Verify the container images were built from the expected source repository
2. Review the GitHub Actions workflow that built the images
3. Audit the build provenance and supply chain metadata

Check each Sigstore link with an HTTP HEAD request to ensure provenance data is available (not 404).
