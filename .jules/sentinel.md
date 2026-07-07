## 2026-07-02 - Secrets Regression Prevention
**Vulnerability:** Hardcoded Firebase API keys and configuration in `src/firebase.js`.
**Learning:** Security regressions can occur when sensitive configuration is reintroduced into the codebase during feature development or refactoring, bypassing previous environment variable setups.
**Prevention:** Always use environment variables (prefixed with `REACT_APP_` for Create React App projects) for sensitive configuration and maintain a `.env.example` file to enforce this pattern. Add periodic checks for hardcoded secrets in core configuration files.
