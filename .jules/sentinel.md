## 2026-07-14 - Fail-Open Authorization Bypass in Client Role Default
**Vulnerability:** When checking user roles in `src/App.js` via Firestore, missing client documents defaulted the role to `'admin'`, granting administrative access to non-existent or partially initialized profiles.
**Learning:** Defaulting privileges on missing data or unexpected control paths creates a classic fail-open vulnerability.
**Prevention:** Always default missing or unconfirmed authorization states to the least-privileged role (`'client'`) and handle database errors defensively with `try-catch` blocks.
