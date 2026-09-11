## 2026-07-14 - Fail-Open Authorization Bypass
**Vulnerability:** Defaulting unknown or missing user profiles to an 'admin' role in authentication listener (`App.js`).
**Learning:** Broad fallbacks in authentication logic easily grant full privileges to unauthenticated or unprofiled users upon unexpected conditions.
**Prevention:** Always default missing user document roles or error states to the least privileged role ('client' or non-admin role) and wrap async Firestore calls in defensive try-catch blocks.
