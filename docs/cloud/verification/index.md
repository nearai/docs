---
id: verification
title: Verification
sidebar_label: Verification
slug: /cloud/verification
description: ""
---

[NEAR AI Cloud](https://cloud.near.ai) operates in Trusted Execution Environments (TEEs) which use cryptographic proofs to verify that your private AI conversations actually happened in secure, isolated environments - not on compromised systems or with unauthorized access.

This section will show you step-by-step processes for checking these proofs, validating digital signatures, and confirming that your AI interactions haven't been tampered with.

## How NEAR AI Cloud Verification Works

1. **Secure Key Generation:** When NEAR AI Cloud initializes, it generates a unique cryptographic signing key pair inside the Trusted Execution Environment (TEE). The private key never leaves the secure hardware.

2. **Hardware Attestation:** The system generates attestation reports that cryptographically prove it's running on genuine NVIDIA H100/H200/B100 hardware in TEE mode within a confidential VM.

3. **Key Binding:** These attestation reports include the public key from step 1, creating a verifiable link between the secure hardware and the signing capability.

4. **Message Signing:** Every AI inference request and response is digitally signed using the private key that remains secured within the TEE.

5. **End-to-End Verification:** You can verify that your AI interactions were genuinely processed in the secure environment by:

    - Checking the hardware attestation reports
    - Validating the digital signatures on your messages
    - Confirming the signing key matches the attested hardware

---

## What You Can Verify

**Model Verification** - Verify that AI models are running in secure TEE environments using NVIDIA and Intel attestation.

**Chat Verification** - Verify individual chat messages and responses through cryptographic signatures.
