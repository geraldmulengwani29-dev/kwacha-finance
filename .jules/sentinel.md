# Sentinel's Security Journal 🛡️

## 2026-07-14 - Fail-Open Authorization Bypass
**Vulnerability:** Defaulting users without corresponding Firestore documents to the `'admin'` role inside the `onAuthStateChanged` handler in `src/App.js`.
**Learning:** Fail-secure defaults should always be implemented when authorization document lookups fail or are missing. Assuming missing user profiles are admins creates a critical authorization bypass risk where newly registered or unprofiled clients can access administrative endpoints and data.
**Prevention:** Always default to the least privileged role (e.g., `'client'`) when resolving a user's role, and use proper error-handling (like try-catch blocks) to avoid crashing or leaking unauthorized access states when external database services are down or fail.
