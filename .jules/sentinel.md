## 2026-06-30 - Hardcoded Secrets Regression
**Vulnerability:** Hardcoded Firebase API keys and project credentials in `src/firebase.js`.
**Learning:** Initial application setup often leads to hardcoding configuration for convenience, which then persists into version control. Even "public" Firebase keys should be handled via environment variables as a defense-in-depth measure and to facilitate multi-environment setups.
**Prevention:** Always use environment variables for third-party service configurations from the start. Implement a runtime check to alert developers when required environment variables are missing.
