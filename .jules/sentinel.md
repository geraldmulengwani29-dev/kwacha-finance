## 2026-07-14 - Fail-Open Authorization Bypass in App.js
**Vulnerability:** The application was vulnerable to a fail-open authorization bypass in `src/App.js` where users without a corresponding Firestore document, or during a database/network error, were granted the elevated `'admin'` role by default.
**Learning:** Defaulting unmapped users or lookup failures to a highly privileged role (like `'admin'`) violates the principle of secure defaults and leads to critical privilege escalation.
**Prevention:** Implement a strict fail-secure default by defaulting missing or failed document lookup outcomes to the least privileged `'client'` role, and wrapping database operations in robust error handling blocks.
