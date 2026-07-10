## 2026-07-02 - Remediation of Hardcoded Firebase Secrets
**Vulnerability:** Firebase configuration secrets (API key, App ID, etc.) were hardcoded in `src/firebase.js`.
**Learning:** Hardcoding secrets in the source code exposes them to anyone with access to the repository and makes rotation difficult.
**Prevention:** Use environment variables (via `.env` files) for all sensitive configuration data and ensure `.env` is listed in `.gitignore`. Provide a `.env.example` as a template for other developers.
