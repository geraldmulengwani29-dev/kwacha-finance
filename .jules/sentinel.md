## 2026-07-14 - Fail-Open Authorization Bypass
**Vulnerability:** Defaulting authenticated users with missing Firestore documents to an 'admin' role in `src/App.js`.
**Learning:** Fail-open defaults in authentication listeners allow unauthorized users or accounts created outside expected registration flows (or during DB error states) to gain full admin privileges.
**Prevention:** Always default missing user documents or role fetching errors to the lowest privilege level ('client') or unauthenticated state.
