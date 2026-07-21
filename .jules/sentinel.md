## 2026-07-14 - Secrets Regression
**Vulnerability:** Hardcoded Firebase credentials (API Key, authDomain, projectId, storageBucket, messagingSenderId, and appId) in `src/firebase.js`.
**Learning:** During feature additions or refactoring, developers frequently revert environment-variable configurations back to hardcoded configurations for quick local testing and then commit them. In CRA, environment variables require the `REACT_APP_` prefix, which must be clearly documented to prevent confusion.
**Prevention:** Always use environment variables for third-party service configurations, provide a `.env.example` file as a reference, explicitly configure `.gitignore` to reject committing `.env` files, and include prominent warning comments in files prone to regressions.
