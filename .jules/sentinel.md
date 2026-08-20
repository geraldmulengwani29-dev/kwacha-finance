## 2026-07-14 - Fail-Open Authorization Bypass in Client Document Lookup
**Vulnerability:** In `src/App.js`, if a user's client profile document did not exist in Firestore or if the query threw an error, the application granted the `'admin'` role by default.
**Learning:** Defaulting to elevated privileges when user metadata is missing or fails to fetch creates a severe privilege escalation vulnerability (fail-open).
**Prevention:** Always default to the least-privileged role (`'client'`) and handle document lookup errors with explicit try/catch blocks (fail-closed).
