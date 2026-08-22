## 2026-07-14 - Fail-Open Authorization Bypass
**Vulnerability:** In `src/App.js`, when an authenticated user did not have a corresponding document in the `clients` Firestore collection, `onAuthStateChanged` defaulted their role to `'admin'`, allowing unprivileged users to gain full administrative privileges.
**Learning:** Fallback branches in authentication and role assignment logic were designed as fail-open rather than fail-closed, granting maximum privileges by default when data lookup failed or was missing.
**Prevention:** Always follow the principle of least privilege and fail-closed authorization design. Default role fallbacks and catch blocks must always resolve to the lowest privilege tier (`'client'`) rather than elevated tiers (`'admin'`).
