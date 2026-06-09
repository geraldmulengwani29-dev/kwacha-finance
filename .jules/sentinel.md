## 2026-06-09 - Remediate Hardcoded Firebase Secrets
**Vulnerability:** Firebase configuration secrets (API Key, Project ID, etc.) were hardcoded in `src/firebase.js`, exposing them to anyone with access to the source code.
**Learning:** Hardcoding API keys in source code is a common but critical security risk. In Create React App, environment variables must be prefixed with `REACT_APP_` to be accessible via `process.env`.
**Prevention:** Always use environment variables for sensitive configuration values and ensure that `.env` files are included in `.gitignore`.
