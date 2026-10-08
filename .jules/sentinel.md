## 2026-07-14 - Fail-Open Default Role Assignment
**Vulnerability:** Newly registered or user profiles missing from Firestore clients collection were defaulted to 'admin' privileges in `src/App.js`.
**Learning:** Defaulting unmapped users to elevated roles when fetching user profile metadata creates a fail-open authorization bypass.
**Prevention:** Always follow the principle of least privilege and fail closed/secure by defaulting unmapped or unverified users to the lowest privilege role ('client').
