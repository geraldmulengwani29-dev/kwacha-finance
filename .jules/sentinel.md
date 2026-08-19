## 2026-07-14 - Remediate Fail-Open Authorization Bypass in App.js
**Vulnerability:** Authenticated users missing a client document in Firestore were assigned the `admin` role by default in `App.js`.
**Learning:** Defaulting privileges on missing database records or unhandled errors leads to privilege escalation.
**Prevention:** Always fail closed by defaulting authorization state to least-privileged role (`client`) when user record lookups fail or return missing documents.
