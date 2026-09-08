## 2026-07-14 - Fail-Open Role Assignment in Auth State Listener
**Vulnerability:** Defaulting user role to 'admin' when client profile document was missing in Firestore or on fetch failure.
**Learning:** The initial implementation assumed non-client accounts were admin accounts without validating admin credentials or collection membership, creating a critical authorization bypass for any newly created user account.
**Prevention:** Always default missing or unverified user profiles to the least privileged role ('client') and wrap auth role checks in try-catch blocks to fail securely.
