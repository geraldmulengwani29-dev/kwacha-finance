## 2026-07-02 - Remediation of Hardcoded Firebase Secrets
**Vulnerability:** Hardcoded Firebase API keys and configuration in `src/firebase.js`.
**Learning:** Hardcoding third-party service credentials directly in the source code exposes them to anyone with access to the repository, which can lead to unauthorized service usage or data access if the keys have excessive permissions.
**Prevention:** Always use environment variables for sensitive configuration and provide a `.env.example` template for other developers. Ensure `.env` files are ignored by version control.
