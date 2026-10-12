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
HTTP_METHODS = ("get", "post", "put", "patch", "delete")
# These endpoints remain in the live schema until their planned removal, but
# should not be introduced to new API Reference readers.
EXCLUDED_TAGS = {"Conversations", "Files"}
EXCLUDED_OPERATIONS = {
    ("get", "/v1/responses/{response_id}"),
    ("delete", "/v1/responses/{response_id}"),
    ("post", "/v1/responses/{response_id}/cancel"),
    ("get", "/v1/responses/{response_id}/input_items"),
}

os.chdir(ROOT)
spec = json.load(urllib.request.urlopen(SRC))
spec["info"]["description"] = (
    "NEAR AI Cloud API for private AI model inference and organization administration."
)
stateless_request = spec.get("components", {}).get("schemas", {}).get(
    "StatelessCreateResponseRequestSchema"
)
if stateless_request:
    store = stateless_request["properties"]["store"]
    store["type"] = "boolean"
    store["const"] = False
spec["servers"] = [{"url": "https://cloud-api.near.ai", "description": "NEAR AI Cloud"}]

for path, path_item in list(spec["paths"].items()):
    for method in HTTP_METHODS:
        operation = path_item.get(method)
        if operation and (
            set(operation.get("tags", ())) & EXCLUDED_TAGS
            or (method, path) in EXCLUDED_OPERATIONS
        ):
            del path_item[method]
    if not any(method in path_item for method in HTTP_METHODS):
        del spec["paths"][path]

with open(SPEC, "w") as f:
    json.dump(spec, f, indent=2, ensure_ascii=False); f.write("\n")

by_tag = {}
for path, ops in spec["paths"].items():
    for method, op in ops.items():
        if method in HTTP_METHODS and not op.get("x-hidden"):
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
