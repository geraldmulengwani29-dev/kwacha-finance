## 2026-07-14 - Fail-Open Authorization Bypass in Client Document Lookup
**Vulnerability:** Non-existent client document or Firestore lookup error in `onAuthStateChanged` hook defaulted user role to `'admin'`, granting full administrative access to unrecognized or error-triggering authenticated users.
**Learning:** Defaulting to a privileged role (fail-open) when a database lookup fails or finds no record creates a critical privilege escalation / authorization bypass.
**Prevention:** Always default user permissions to the least-privileged role (`'client'`) on missing data or errors (fail-close).
