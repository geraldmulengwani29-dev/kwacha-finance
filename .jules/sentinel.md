## 2026-07-14 - Fail-Open Authorization Default in Auth Listener
**Vulnerability:** User role defaulted to 'admin' when client profile document was absent in Firestore.
**Learning:** Defaulting missing or failed role lookups to elevated roles grants unauthorized access to unprofiled accounts or during database failures.
**Prevention:** Always follow the principle of least privilege and fail-secure by defaulting role resolution to 'client' or null on missing records or exception paths.
