## 2026-07-14 - Fail-Open Authorization Bypass
**Vulnerability:** Defaulting to 'admin' role when a user profile record in Firestore is missing or lookup fails in `src/App.js`.
**Learning:** Fail-open access control logic grants full administrative privileges to any unprofiled or newly registered account if their client record cannot be found.
**Prevention:** Always fail secure by default; fall back to the lowest privilege role ('client') whenever role verification is missing, ambiguous, or encounters errors.
