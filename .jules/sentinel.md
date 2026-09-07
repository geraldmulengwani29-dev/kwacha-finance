## 2026-07-14 - Fail-Open Authorization Bypass in Role Assignment
**Vulnerability:** Defaulting to 'admin' privileges when user Firestore documents do not exist or when document fetching fails.
**Learning:** Defaulting missing documents or unhandled exceptions in `onAuthStateChanged` to elevated permissions creates a critical fail-open vulnerability.
**Prevention:** Always default missing user profiles and error fallbacks to the least-privileged role ('client') to ensure fail-secure behavior.
