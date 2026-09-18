## 2026-07-14 - Fail-Open Authorization Bypass
**Vulnerability:** In `src/App.js`, if a user's Firestore client profile document was missing, the role was automatically set to 'admin'.
**Learning:** Defaulting to elevated privileges when user metadata is missing or fails to load introduces a critical fail-open authorization bypass.
**Prevention:** Always default to least privilege ('client') when user record lookup fails or is missing (fail-closed / fail-secure pattern).
