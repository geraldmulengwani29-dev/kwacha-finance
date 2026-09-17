## 2026-07-14 - Fail-Open Authorization Fallback in Role Check
**Vulnerability:** In `src/App.js`, when a user document was not found in Firestore during auth state change, the application assigned `setRole('admin')`, granting full administrative privilege by default.
**Learning:** Hardcoded default fallback logic in client-side auth state checks can accidentally default to the most privileged role instead of least privilege.
**Prevention:** Always default missing or unverified roles to the least-privileged role (`'client'`) or `null` and handle lookup errors with explicit try/catch blocks.
