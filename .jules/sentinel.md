# Sentinel Security Journal

## 2026-06-26 - Hardcoded Secret Regression in Firebase Config
**Vulnerability:** Hardcoded Firebase API keys and configuration in `src/firebase.js`.
**Learning:** Sensitive credentials were found hardcoded in the source code despite previous Sentinel interventions in the git history. This indicates a high risk of regression when developers update configuration or when merging branches that haven't adopted environment variables.
**Prevention:** Use environment variables for all sensitive configuration. Ensure `.env.example` is maintained and that any PR touching `src/firebase.js` is strictly reviewed for hardcoded secrets.
