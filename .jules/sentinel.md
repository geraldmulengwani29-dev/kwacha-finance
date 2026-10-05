## 2026-07-14 - Fail-Open Authorization Bypass in Client Role Assignment
**Vulnerability:** Defaulting to 'admin' role when a client profile document is missing in Firestore.
**Learning:** Initial routing logic defaulted missing Firestore user documents to 'admin', creating a severe fail-open authorization bypass where any user lacking a profile document gained full administrative privileges.
**Prevention:** Always default authorization decisions to the least-privileged role ('client') and handle database lookup errors defensively in auth listeners.
