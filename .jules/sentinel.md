# Sentinel Security Journal

## 2026-07-14 - Hardcoded Firebase Secrets Regression
**Vulnerability:** Hardcoded Firebase API keys and config object directly exposed in `src/firebase.js` in cleartext.
**Learning:** Credentials and configuration parameters were hardcoded in version control, indicating a regression pattern where merging branches or updating configurations reintroduced raw secrets despite prior remediation efforts.
**Prevention:** Utilize Create React App's `REACT_APP_` environment variable pattern strictly. Document environment templates in `.env.example`, ensure `.env` is explicitly ignored by `.gitignore`, and set up automated pre-commit warnings or linting to block raw Firebase API keys in commits.
