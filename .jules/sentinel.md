## 2026-07-14 - Fail-Open Authorization Bypass in Client Document Lookup
**Vulnerability:** Users missing a corresponding Firestore document in the 'clients' collection defaulted to receiving 'admin' role privileges upon logging in.
**Learning:** Defaulting to elevated privileges when user metadata is missing or on database error creates a critical fail-open vulnerability.
**Prevention:** Always default user roles to the lowest permission level ('client') and handle error states gracefully (fail secure).
