## 2026-07-14 - Fail-Open Authorization Bypass in App.js
**Vulnerability:** A critical fail-open authorization bypass vulnerability was identified in `src/App.js` where users without a corresponding Firestore document were automatically granted the `'admin'` privilege.
**Learning:** Defaulting privileges to elevated roles when lookups fail or records are missing exposes the system to unauthorized access. System states should always fail-closed.
**Prevention:** Implement secure-by-default logic by defaulting unspecified or missing user profiles to the lowest possible privilege level (e.g., `'client'`), and wrap authorization database lookups in try-catch-finally blocks to safely catch and handle transient database or connectivity errors.
