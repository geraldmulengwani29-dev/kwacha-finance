## 2026-07-14 - Hardcoded Firebase Credentials Vulnerability

**Vulnerability:** Firebase configuration secrets were hardcoded directly in `src/firebase.js`.
**Learning:** Hardcoding API keys and configuration secrets in client-side repository code exposes sensitive configuration to public version control and increases the risk of credential leakage.
**Prevention:** Always use `process.env.REACT_APP_` environment variables for client-side environment configurations, provide `.env.example` templates, and ensure `.env` files are ignored in `.gitignore`.
