## 2026-07-14 - Fail-Open Authorization Bypass in Role Assignment
**Vulnerability:** Newly created or unindexed user accounts without a Firestore document were assigned the `admin` role by default in `src/App.js`.
**Learning:** Defaulting missing or error states to privileged roles creates a critical security vulnerability where non-admin users or uninitialized accounts gain full administrative access.
**Prevention:** Always follow the principle of least privilege and fail securely by defaulting unknown user states or errors to the lowest privileged role (`client`).
