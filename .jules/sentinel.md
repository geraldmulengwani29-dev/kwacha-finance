## 2026-07-14 - Fail-Open Authorization Bypass in Client Role Verification
**Vulnerability:** In `src/App.js`, when a signed-in user's client profile document did not exist in Firestore (`clientDoc.exists()` was false), the app defaulted their user role to `'admin'`, granting administrative access to unauthenticated or non-client accounts.
**Learning:** The fallback logic was written as `else { setRole('admin'); }`, likely assuming any non-client account was an admin without explicit verification, leading to a fail-open security bypass.
**Prevention:** Always fail-closed or default to least privilege (`'client'` or access denied) when profile or role data is missing or lookup errors occur.
