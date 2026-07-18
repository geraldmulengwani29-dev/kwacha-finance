## 2026-07-14 - Fail-Open Authorization Bypass in App.js
**Vulnerability:** When retrieving user roles, if the Firestore client document was missing or failed to load, the application defaulted the role to `'admin'`, causing a critical fail-open authorization bypass.
**Learning:** System designs must always fail securely. Defaulting to an elevated privilege level (such as `'admin'`) when lookup fails or when database structures are incomplete presents an enormous privilege escalation risk.
**Prevention:** Always default to the least-privileged role (e.g., `'client'`) when authorization lookup fails or is missing, and handle database access errors with robust try-catch blocks to prevent bypasses.
