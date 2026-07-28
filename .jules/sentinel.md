## 2026-07-14 - Fail-Open Authorization Bypass
**Vulnerability:** A fail-open authorization logic in the auth state listener (`src/App.js`) defaulted users without a corresponding Firestore 'clients' document to an 'admin' role, potentially granting administrative access to unauthenticated or unprofiled accounts.
**Learning:** The codebase assumed that any account without a matching 'client' record must be an administrative/staff user, rather than defaulting to the least privileged role. Failure to use a "fail-secure" model can result in critical privilege escalation.
**Prevention:** Always default to the least privileged role ('client' or a basic user) when user record lookups fail, are incomplete, or return empty. Explicitly assign higher privilege roles only when verified.
