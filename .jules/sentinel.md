## 2026-07-14 - Fail-Open Authorization Default in Authentication Hook
**Vulnerability:** In `src/App.js`, when a logged-in user did not have a corresponding document in the `clients` collection or when Firestore returned an error during document fetching, the role defaulted to `'admin'`.
**Learning:** The fallback logic was written with the assumption that non-clients must be admins, resulting in a fail-open authorization logic bug where missing or failing database reads granted full administrative permissions.
**Prevention:** Always default role authorization to the lowest-privilege role (`'client'`) and wrap Firestore document lookup in a `try-catch` block to handle errors securely (fail-closed / least-privilege).
