## 2026-07-14 - Fail-Open Authorization Bypass
**Vulnerability:** Newly registered or missing Firestore client user documents defaulted to granting admin role privileges in `App.js`.
**Learning:** Relying on fallback default logic (`else { setRole('admin'); }`) when a database record is absent creates a fail-open security bypass.
**Prevention:** Always fail closed and default to the least privileged role (`client`) or deny access when authorization metadata is missing or fails to load.
