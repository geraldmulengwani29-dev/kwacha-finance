## 2026-07-14 - Fail-Open Authorization Bypass in Client Role Lookups
**Vulnerability:** When checking Firestore user records for role assignment during authentication state changes in `App.js`, missing user documents defaulted the role to `'admin'`, granting full administrative access to unindexed or newly created user accounts.
**Learning:** Defaulting permission checks to elevated roles when data is missing or queries fail creates a critical fail-open vulnerability.
**Prevention:** Always default authorization checks to least-privilege roles (`'client'`) and wrap Firestore state lookups in `try-catch` blocks to ensure fail-closed behavior on errors.
