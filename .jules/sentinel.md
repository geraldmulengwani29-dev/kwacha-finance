# Sentinel Security Journal

## 2026-07-14 - Fail-Open Authorization Bypass in App.js
**Vulnerability:** The application fell back to an elevated 'admin' role when a user's Firestore client profile document was not found or when a query error occurred during authentication.
**Learning:** This design pattern is "fail-open", which violates the principle of least privilege. In the event of query failures, database disconnections, or missing documents, unauthorized clients are incorrectly granted full admin access.
**Prevention:** Always default to the least-privileged role ('client') during authentication checks, handle exceptions explicitly with try-catch blocks to prevent bypasses, and ensure that loading states resolve safely without leaking high-privilege access.
