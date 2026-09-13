## 2026-07-14 - Fail-Open Authorization Bypass in Client Document Lookup
**Vulnerability:** Authenticated users whose Firestore profile document did not exist were automatically granted 'admin' role privileges.
**Learning:** Defaulting missing user records or database errors to an administrative role ("fail-open") creates a severe privilege escalation vulnerability.
**Prevention:** Always follow the principle of least privilege and fail-closed: default missing user records or failed lookups to the lowest privilege role ('client').
