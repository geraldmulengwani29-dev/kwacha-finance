## 2026-07-14 - Fail-Open Authorization Bypass Remediation
**Vulnerability:** Defaulting authenticated users without an existing Firestore client document to the 'admin' role in `src/App.js`.
**Learning:** Hardcoding fallback roles to administrative privileges ("fail-open") in routing logic allows unauthorized user escalation when records are missing or Firestore errors occur.
**Prevention:** Always follow the principle of fail-closed security by defaulting fallback roles to the least-privileged level ('client') and wrapping permission checks in try-catch blocks.
