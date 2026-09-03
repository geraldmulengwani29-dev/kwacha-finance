## 2026-07-14 - Fail-Open Authorization Bypass in Role Resolution

**Vulnerability:** In `src/App.js`, when checking the `clients` Firestore collection for an authenticated user's profile, missing client records caused the authentication callback to fall back to `setRole('admin')`, granting full administrator access to any user without a client profile document.
**Learning:** Defaulting fallback roles to high-privilege accounts ("failing open") introduces critical authorization bypasses if user profiles fail to load, do not exist, or experience network errors.
**Prevention:** Always follow the principle of least privilege by failing closed to the minimum required role (`'client'`) and wrapping asynchronous authorization checks in `try-catch` error handling blocks.
