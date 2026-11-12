"""Normalize and check the generated API reference contract."""

HTTP_METHODS = ("get", "post", "put", "patch", "delete", "head", "options", "trace")
ADMIN_OPERATION_IDS = {
    "/v1/admin/models": ("list_models", "list_admin_models"),
    "/v1/admin/organizations": ("list_organizations", "list_admin_organizations"),
    "/v1/admin/organizations/{org_id}": ("get_organization", "get_admin_organization"),
    "/v1/admin/organizations/{org_id}/members": (
        "list_organization_members", "list_admin_organization_members"
    ),
}
PUBLIC_EMAIL_VERIFICATION = ("post", "/v1/users/contact-email/verify")


def operations(spec):
    for path, path_item in spec["paths"].items():
        for method in HTTP_METHODS:
            if method in path_item:
                yield method, path, path_item[method]


def normalize_contract(spec):
    for method, path, operation in operations(spec):
        for requirement in operation.get("security", []):
            if "ApiKeyAuth" in requirement:
                requirement["api_key"] = requirement.pop("ApiKeyAuth")
        if (method, path) == PUBLIC_EMAIL_VERIFICATION:
            operation["security"] = []
        if method == "get" and path in ADMIN_OPERATION_IDS:
            old_id, new_id = ADMIN_OPERATION_IDS[path]
            if operation.get("operationId") == old_id:
                operation["operationId"] = new_id


def validate_contract(spec):
    schemes = spec.get("components", {}).get("securitySchemes", {})
    root_security = spec.get("security", [])

    def check_security(requirements, location):
        for requirement in requirements:
            for name in requirement:
                if name not in schemes:
                    raise ValueError(f"{location}: undefined security scheme {name}")

    check_security(root_security, "Root security")
    operation_ids = {}
    for method, path, operation in operations(spec):
        location = f"{method.upper()} {path}"
        operation_id = operation.get("operationId")
        if operation_id is not None:
            if operation_id in operation_ids:
                raise ValueError(
                    f"Duplicate operationId {operation_id}: "
                    f"{operation_ids[operation_id]} and {location}"
                )
            operation_ids[operation_id] = location
        security = operation.get("security", root_security)
        check_security(security, location)
        if (method, path) == PUBLIC_EMAIL_VERIFICATION and security and {} not in security:
            raise ValueError(f"{location}: email verification must allow anonymous access")
