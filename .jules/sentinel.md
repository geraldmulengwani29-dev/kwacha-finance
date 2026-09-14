## 2026-07-14 - Fail-Open Authorization Default
**Vulnerability:** Missing Firestore user profile document defaulted user role to 'admin' in `App.js`.
**Learning:** Defaulting missing or uninitialized database records to elevated privileges creates a critical authorization bypass for newly created accounts or during database lookup errors.
**Prevention:** Always follow the principle of least privilege and fail securely by defaulting unauthenticated or unknown user states to the lowest privilege role ('client').
