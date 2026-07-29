## 2026-07-14 - Fail-Open Authorization Bypass Fix
**Vulnerability:** A critical fail-open authorization bypass was present in `src/App.js` where a user with a missing or unretrievable client document in Firestore was granted the `admin` role by default.
**Learning:** Defaulting unmapped users or lookup failures to a highly privileged `admin` role violates the secure defaults principle.
**Prevention:** Implement a strict fail-secure default by defaulting missing or failed document lookup outcomes to the least privileged `client` role, and wrapping database operations in robust error handling blocks.
