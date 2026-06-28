## 2026-06-28 - Hardcoded Firebase Credentials
**Vulnerability:** Critical Firebase API keys and project identifiers were hardcoded in `src/firebase.js`.
**Learning:** Hardcoded secrets in client-side code are easily discoverable and can lead to unauthorized access to backend services. In this project, secrets have regressed multiple times.
**Prevention:** Always use environment variables for sensitive configuration. Add a `.env.example` as a template and implement runtime checks to alert developers of missing configuration during development.
