## 2026-06-27 - Secrets Regression
**Vulnerability:** Hardcoded Firebase credentials in `src/firebase.js`.
**Learning:** Previously remediated secrets were reintroduced in `src/firebase.js`. This indicates a regression in security posture, possibly during a refactor or merging process.
**Prevention:** Always use environment variables for sensitive configuration. Maintain a `.env.example` file to guide developers and use runtime checks to warn when required secrets are missing during development.
