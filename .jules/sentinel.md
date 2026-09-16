## 2026-07-14 - Fail-Open Authorization Bypass Remediated
**Vulnerability:** Defaulting to 'admin' role when client Firestore document is missing or fetch fails.
**Learning:** Any missing user profile or database query failure allowed newly created or unknown accounts to inherit full administrative access across all protected routes.
**Prevention:** Always fail secure by default; assign the least privilege ('client') when user document metadata is missing or when database lookups fail.
