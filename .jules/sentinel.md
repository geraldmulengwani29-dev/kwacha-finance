## 2026-07-14 - Fail-Open Authorization Bypass
**Vulnerability:** A fail-open authorization bypass was identified in `src/App.js` where users without a corresponding Firestore document were defaulted to an 'admin' role.
**Learning:** Defaulting to the highest privilege level upon a data lookup failure is a critical security risk. The application should always fail securely by defaulting to the lowest privilege level or denying access.
**Prevention:** Implement a fail-secure approach by defaulting to 'client' or null roles and using try-catch blocks to handle potential lookup errors without elevating privileges.
