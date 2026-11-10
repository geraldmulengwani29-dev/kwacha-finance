# Sentinel Security Journal

## 2026-07-14 - Fail-Open Authorization Bypass
**Vulnerability:** A fail-open vulnerability existed in the authentication state listener in `src/App.js` where users without a corresponding Firestore document were implicitly granted 'admin' privileges.
**Learning:** Defaulting to the highest level of privilege when data is missing is a critical security flaw. Logic should always fail-secure (deny by default or assign least privilege).
**Prevention:** Always implement a 'deny by default' or 'least privilege by default' strategy in authorization logic. Ensure that missing user metadata results in minimal access.
