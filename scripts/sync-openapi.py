#!/usr/bin/env python3
"""Refresh api-reference/openapi.json from the live API and regenerate the
API Reference sidebar in docs.json.

Why this exists: the upstream spec has no `servers` entry (Mintlify's playground
needs one), and Mintlify's auto-populated OpenAPI navigation orders groups by
path, which puts Admin first. Listing endpoints explicitly keeps a sensible order.
"""
import json, os, urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.environ.get("OPENAPI_URL", "https://cloud-api.near.ai/api-docs/openapi.json")
SPEC = "api-reference/openapi.json"
TAG_ORDER = [  # unlisted tags are appended alphabetically
    "Chat", "Responses", "Models", "Images", "Audio", "Rerank", "Score",
    "Privacy", "Attestation", "Users", "Organizations",
    "Organization Members", "Invitations", "Workspaces", "Usage", "Reporting",
    "Billing", "Staking Farm", "Services", "Gateway", "Health", "Feature Requests", "Admin",
]

os.chdir(ROOT)
spec = json.load(urllib.request.urlopen(SRC))
spec["info"]["description"] = (
    "NEAR AI Cloud API for private AI model inference and organization administration."
)
spec["servers"] = [{"url": "https://cloud-api.near.ai", "description": "NEAR AI Cloud"}]
with open(SPEC, "w") as f:
    json.dump(spec, f, indent=2, ensure_ascii=False); f.write("\n")

by_tag = {}
for path, ops in spec["paths"].items():
    for method, op in ops.items():
        if method in ("get", "post", "put", "patch", "delete") and not op.get("x-hidden"):
            by_tag.setdefault((op.get("tags") or ["Other"])[0], []).append(f"{method.upper()} {path}")
order = TAG_ORDER + sorted(t for t in by_tag if t not in TAG_ORDER)

docs = json.load(open("docs.json"))
tab = next(t for t in docs["navigation"]["tabs"] if t["tab"] == "API Reference")
tab["openapi"] = SPEC
tab["groups"] = [{"group": "Getting Started", "pages": ["api-reference/introduction"]}]
tab["groups"] += [{"group": t, "pages": by_tag[t]} for t in order if t in by_tag]
with open("docs.json", "w") as f:
    json.dump(docs, f, indent=2, ensure_ascii=False); f.write("\n")
print(f"{sum(map(len, by_tag.values()))} endpoints in {len(by_tag)} groups")
