## 2026-07-14 - Fail-Open Authorization Bypass
**Vulnerability:** In `src/App.js`, if a user's document was missing in the `clients` Firestore collection, the application defaulted their role to `'admin'`, granting full administrative access to uninitialized or improperly registered user accounts.
**Learning:** Defaulting to elevated privileges when user metadata is missing or lookup fails creates a severe "fail-open" security architecture.
**Prevention:** Always follow the principle of least privilege: default missing or unverified user roles to the lowest permission tier (`'client'`) and wrap role fetching in robust error handlers (`try...catch`).
