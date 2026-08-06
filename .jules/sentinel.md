## 2026-07-14 - Fail-Open Authorization Bypass in App.js
**Vulnerability:** A critical fail-open authorization bypass in `src/App.js` where users without a corresponding Firestore document (or if the database fetch fails) were automatically granted 'admin' privileges.
**Learning:** The application defaulted to 'admin' privileges when `clientDoc.exists()` was false, rather than applying the principle of least privilege and defaulting to 'client'. Additionally, a database lookup error within the auth observer could prevent `setLoading(false)` from running, hanging the application.
**Prevention:** Always fail securely by defaulting to the least permissive role ('client') and handle database errors gracefully within authorization callbacks using try-catch-finally blocks.
