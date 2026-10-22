## 2026-07-14 - Fail-Open Authorization Bypass in Role Assignment
**Vulnerability:** Missing Firestore user documents caused the authentication state listener to default users to the 'admin' role.
**Learning:** Defaulting unhandled states or missing user records to elevated privileges introduces a critical authorization bypass vulnerability.
**Prevention:** Always default to least privilege ('client') and wrap document fetching in try-catch blocks to fail closed on error.
