## 2026-07-02 - Secrets Regression in Firebase Configuration
**Vulnerability:** Hardcoded Firebase API keys and configuration secrets in `src/firebase.js`.
**Learning:** Security fixes for hardcoded secrets can easily regress if developers revert changes or follow outdated templates during feature development.
**Prevention:** Use environment variables for all sensitive configuration and provide a clear `.env.example`.
