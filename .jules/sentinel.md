## 2026-07-02 - Remediation of Hardcoded Firebase Secrets
**Vulnerability:** Hardcoded Firebase API keys and configuration secrets in `src/firebase.js`.
**Learning:** Storing secrets in source code violates security best practices. In Create React App, environment variables must be prefixed with `REACT_APP_` and accessed via `process.env`.
**Prevention:** Always use environment variables for sensitive configuration. Ensure `.env` files are NOT committed to the repository (add to `.gitignore` and only provide `.env.example`).
