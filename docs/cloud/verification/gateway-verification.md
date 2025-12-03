---
id: gateway-verification
title: Gateway Verification
sidebar_label: Gateway Verification
slug: /cloud/verification/gateway
sidebar_position: 4
description: ""
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Gateway Verification

To verify the NEAR AI Cloud private inference gateway is operating in a secure trusted environment, you need to verify the gateway attestation. The gateway attestation proves that the API gateway itself runs in a Trusted Execution Environment (TEE).

- [Request Gateway Attestation](#request-gateway-attestation) report from NEAR AI Cloud
- [Verify Gateway Attestation](#verifying-gateway-attestation) report using Intel attestation authenticators

:::tip 
See an example implementation in the [NEAR AI Cloud Verifier](https://github.com/nearai/nearai-cloud-verifier) repo.
:::

---

## Request Gateway Attestation

The gateway attestation can be requested standalone or is included in the response when you request a model attestation. To request gateway attestation standalone, use the following `GET` API endpoint:

```bash
https://cloud-api.near.ai/v1/attestation/report?signing_algo=ecdsa&nonce={nonce}
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

curl "https://cloud-api.near.ai/v1/attestation/report?signing_algo=ecdsa&nonce=${NONCE}" \
  -H 'accept: application/json'
```

</TabItem>
<TabItem value="javascript">

```js
import crypto from 'crypto';

// Generate a random 64-character hex nonce (optional but recommended)
const nonce = crypto.randomBytes(32).toString('hex');

const response = await fetch(
  `https://cloud-api.near.ai/v1/attestation/report?signing_algo=ecdsa&nonce=${nonce}`,
  {
    headers: {
      'accept': 'application/json',
    },
  }
);
```

</TabItem>
<TabItem value="python">

```python
import requests
import secrets

# Generate a random 64-character hex nonce (optional but recommended)
nonce = secrets.token_hex(32)

response = requests.get(
    f'https://cloud-api.near.ai/v1/attestation/report?signing_algo=ecdsa&nonce={nonce}',
    headers={
        'accept': 'application/json',
    }
)
```

</TabItem>
</Tabs>

<details>
 <summary>Example Response:</summary>
```json
{
  "gateway_attestation": {
    "request_nonce": "...",      \\ The nonce you provided in the request
    "intel_quote": "...",        \\ Attestation report used to verify w/ Intel TDX
    "event_log": [...],           \\ TDX event log
    "info": {                     \\ TCB information including Docker compose manifest
      "compose": "...",
      ...
    }
  }
}
```

- `gateway_attestation`: Attestation report for the private inference gateway (API gateway)
  - `request_nonce`: The nonce you provided in the request
  - `intel_quote`: Intel TDX quote for the gateway TEE
  - `event_log`: TDX event log
  - `info`: TCB information including Docker compose manifest

</details>

:::note
    **Implementation**: This endpoint is defined in the [NEAR AI Cloud API](https://github.com/nearai/cloud-api).
:::

---

## Verifying Gateway Attestation

Once you have [requested a gateway attestation](#request-gateway-attestation) from NEAR AI Cloud, you can use the returned payload to verify its authenticity. You can verify:

- **Intel TDX quote**: Verifies TDX quote with [`dcap-qvl`](https://github.com/Phala-Network/dcap-qvl) library
- **TDX report data**: Validates that report data includes the nonce in request
- **Compose manifest**: Displays Docker compose manifest and verifies it matches the mr_config measurement
- **Source Code provenance**: Verifies container image provenance

### Verify TDX Quote

You can verify the Intel TDX quote with the value of `intel_quote` from `gateway_attestation` using the [`dcap-qvl`](https://github.com/Phala-Network/dcap-qvl) library. This verifies:

- The CPU TEE measurements are valid
- The quote is authentic and signed by Intel
- The TEE environment is genuine

Alternatively, you can verify the Intel TDX quote at [TEE Attestation Explorer](https://proof.t16z.com/).

### Verify TDX Report Data

The TDX report data validates that:
- The report data binds the signing address (ECDSA or Ed25519) 
- The report data embeds the request nonce

This ensures cryptographic binding between the signing address and the hardware, and prevents replay attacks through nonce freshness.

### Verify Compose Manifest

The attestation response includes Docker compose manifest information in the `gateway_attestation.info` field. To verify:

1. Extract the Docker compose manifest from the attestation
2. Calculate the SHA-256 hash of the compose manifest
3. Compare it with the `mr_config` measurement from the verified TDX quote
4. Verify they match, proving the exact container configuration

This ensures the exact Docker compose file is deployed to the TEE environment.

### Verify Source Code Provenance 

Extract the `nearaidev/cloud-api` container image digests from the Docker compose manifest (matching `@sha256:xxx` patterns) and fetch the source code provenance from Sigstore for each image. This allows you to:

1. Verify the container images were built from the expected source repository with exact release tag
2. Review the GitHub Actions workflow that built the images
3. Audit the build provenance and supply chain metadata
4. Audit the source code of a given release

The source code of the [cloud-api gateway](https://github.com/nearai/cloud-api) is reproducible, which means you can build from the source code of a given release and verify that the resulting Docker image digest matches the digest from the attestation (`@sha256:xxx`).

This ensures the exact version of source code is built into the `nearaidev/cloud-api` Docker image and makes it easy to audit and validate the source code. You can find one [Sigstore link example](https://search.sigstore.dev/?hash=sha256:f75c2a8f1a3d8a36ed6cd7479e848edf0a0e814381d7b83993a703201594bc14) in the [v0.1.7 release of cloud-api](https://github.com/nearai/cloud-api/releases/tag/v0.1.7).
