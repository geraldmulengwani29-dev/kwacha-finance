# Sentinel Security Journal

## 2026-07-02 - Firebase Secrets Regression
**Vulnerability:** Hardcoded Firebase API keys and configuration in `src/firebase.js`.
**Learning:** Security fixes for hardcoded credentials can regress if the configuration is manually reverted or overwritten during feature development.
**Prevention:** Use environment variables for all sensitive configuration and provide a `.env.example` file as a reference for required keys.
