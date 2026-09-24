## 2026-07-14 - Fail-Open Authorization Bypass
**Vulnerability:** Defaulting unknown or missing user records to 'admin' privileges during auth state changes in `src/App.js`.
**Learning:** Defaulting to elevated permissions when a user lookup is missing or fails creates a severe fail-open state.
**Prevention:** Always default user roles to the least privileged role ('client') in fallback branches and wrap database lookups in try-catch blocks.
