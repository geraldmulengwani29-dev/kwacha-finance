## 2026-07-14 - Fail-Open Authorization Bypass in Role Resolution
**Vulnerability:** In `src/App.js`, when a logged-in user lacked a document in the `clients` Firestore collection, the fallback role defaulted to `'admin'`, granting full administrative access to unindexed or newly created user accounts.
**Learning:** Defaulting to elevated access when user metadata is missing or failing to handle async Firestore lookup errors creates a fail-open authorization logic flaw.
**Prevention:** Always default to least privilege (`'client'` or guest) and wrap role fetching in try-catch blocks to fail securely on database lookup errors or missing records.
