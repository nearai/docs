import json
import os
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import unittest

from openapi_contract import validate_contract

ROOT = Path(__file__).resolve().parents[1]


class OpenAPIContractTests(unittest.TestCase):
    def setUp(self):
        self.spec = json.loads((ROOT / "api-reference/openapi.json").read_text())

    def run_sync(self, spec, root):
        source = root / "source.json"
        source.write_text(json.dumps(spec))
        return subprocess.run(
            [sys.executable, str(root / "scripts/sync-openapi.py")],
            env={**os.environ, "OPENAPI_URL": source.as_uri()},
            capture_output=True, text=True,
        )

    def prepare_sync(self, root):
        (root / "scripts").mkdir()
        (root / "api-reference").mkdir()
        for name in ("sync-openapi.py", "openapi_contract.py"):
            shutil.copyfile(ROOT / "scripts" / name, root / "scripts" / name)
        for name in ("api-reference/openapi.json", "docs.json"):
            shutil.copyfile(ROOT / name, root / name)

    def test_published_contract(self):
        validate_contract(self.spec)

    def test_offline_sync_repairs_contract_and_is_idempotent(self):
        aliases = ("/v1/audio/transcriptions", "/v1/rerank", "/v1/score", "/v1/systemone")
        for path in aliases:
            self.spec["paths"][path]["post"]["security"] = [{"ApiKeyAuth": []}]
        self.spec["paths"]["/v1/users/contact-email/verify"]["post"].pop("security", None)
        admin_ids = {
            "/v1/admin/models": ("list_models", "list_admin_models"),
            "/v1/admin/organizations": ("list_organizations", "list_admin_organizations"),
            "/v1/admin/organizations/{org_id}": ("get_organization", "get_admin_organization"),
            "/v1/admin/organizations/{org_id}/members": (
                "list_organization_members", "list_admin_organization_members"
            ),
        }
        for path, (old_id, _) in admin_ids.items():
            self.spec["paths"][path]["get"]["operationId"] = old_id
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            self.prepare_sync(root)
            result = self.run_sync(self.spec, root)
            self.assertEqual(result.returncode, 0, result.stderr)
            generated = json.loads((root / "api-reference/openapi.json").read_text())
            for path in aliases:
                self.assertEqual(generated["paths"][path]["post"]["security"], [{"api_key": []}])
            self.assertEqual(generated["paths"]["/v1/users/contact-email/verify"]["post"]["security"], [])
            for path, (_, new_id) in admin_ids.items():
                self.assertEqual(generated["paths"][path]["get"]["operationId"], new_id)
            self.assertEqual(generated["paths"]["/v1/organizations"]["get"]["operationId"], "list_organizations")
            before = {name: (root / name).read_bytes() for name in ("api-reference/openapi.json", "docs.json")}
            result = self.run_sync(generated, root)
            self.assertEqual(result.returncode, 0, result.stderr)
            for name, content in before.items():
                self.assertEqual((root / name).read_bytes(), content)

    def test_unknown_contract_errors_do_not_overwrite_outputs(self):
        for failure in ("scheme", "operation_id"):
            with self.subTest(failure=failure), tempfile.TemporaryDirectory() as directory:
                spec = json.loads(json.dumps(self.spec))
                operation = spec["paths"]["/v1/systemone"]["post"]
                if failure == "scheme":
                    operation["security"] = [{"unknown_auth": []}]
                else:
                    operation["operationId"] = "list_organizations"
                root = Path(directory)
                self.prepare_sync(root)
                before = {name: (root / name).read_bytes() for name in ("api-reference/openapi.json", "docs.json")}
                result = self.run_sync(spec, root)
                self.assertNotEqual(result.returncode, 0)
                self.assertIn("undefined security scheme" if failure == "scheme" else "Duplicate operationId", result.stderr)
                for name, content in before.items():
                    self.assertEqual((root / name).read_bytes(), content)

    def test_public_operation_cannot_inherit_required_auth(self):
        self.spec["paths"]["/v1/users/contact-email/verify"]["post"].pop("security", None)
        with self.assertRaisesRegex(ValueError, "must allow anonymous access"):
            validate_contract(self.spec)

    def test_anonymous_security_alternative_is_valid(self):
        self.spec["paths"]["/v1/users/contact-email/verify"]["post"]["security"] = [{}, {"api_key": []}]
        validate_contract(self.spec)

    def test_undefined_inherited_security_is_rejected(self):
        self.spec["security"] = [{"unknown_auth": []}]
        with self.assertRaisesRegex(ValueError, "undefined security scheme"):
            validate_contract(self.spec)


if __name__ == "__main__":
    unittest.main()
