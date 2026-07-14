## 2026-07-14 - Fail-Open Authorization Bypass
**Vulnerability:** The application defaulted to an 'admin' role if an authenticated user did not have a corresponding document in the 'clients' Firestore collection.
**Learning:** This "fail-open" logic allowed any new user to gain full administrative access if the document creation failed or was delayed during registration. It violated the principle of least privilege.
**Prevention:** Always implement "fail-secure" logic where the default state is the least privileged one. In this case, defaulting to 'client' or null role is the safer approach.
