## 2026-07-14 - Fail-Open Authorization Bypass in Client Role Lookup
**Vulnerability:** In `src/App.js`, if a user was authenticated but did not have an existing document in the `clients` Firestore collection, the application fallback granted them `admin` privileges.
**Learning:** Defaulting to elevated privileges when user metadata/profile lookup fails or is missing is a critical fail-open flaw that allows newly created or unprofiled accounts to bypass access controls.
**Prevention:** Always default authorization checks to the least privileged role (`client` or `guest`) and wrap document lookups in try-catch blocks to safely fall back to low-privilege access during database errors.
