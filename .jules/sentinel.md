## 2026-07-14 - Fail-Open Authorization Bypass in Role Assignment
**Vulnerability:** Newly created or unindexed users defaulted to the `admin` role when their Firestore document was missing in `src/App.js`.
**Learning:** Defaulting to elevated privileges on missing database records creates a critical fail-open vulnerability where unauthorized users gain access to administrative routes.
**Prevention:** Always default to least privilege (`client` or unauthenticated) when user documents are missing or queries fail, and wrap asynchronous role checks in try-catch blocks.
