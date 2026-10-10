## 2026-07-14 - Fail-Open Authorization Bypass
**Vulnerability:** Defaulting unknown users or missing Firestore client documents to the 'admin' role in `src/App.js`.
**Learning:** Logic assumed any user without an explicit 'client' document must be an administrator, causing an immediate privilege escalation for missing or new profiles.
**Prevention:** Always implement fail-closed defaults; default unverified users to the least-privileged role ('client') and handle database lookup errors explicitly.
