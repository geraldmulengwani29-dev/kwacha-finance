## 2026-07-14 - Fail-Open Authorization Bypass in Client Document Fallback
**Vulnerability:** In `src/App.js`, if an authenticated user did not have a document in the `clients` collection in Firestore (or if fetching it raised an error), the role fallback defaulted to `admin`, granting unrestricted admin access to unrecognized or unprofiled accounts.
**Learning:** Defaulting to elevated privileges (`admin`) when data is missing or fetching fails breaks the Principle of Least Privilege and introduces a fail-open authorization bypass.
**Prevention:** Always default to least privilege (`client` or unprivileged role) when optional context or user profile documents are missing or fail to load.
