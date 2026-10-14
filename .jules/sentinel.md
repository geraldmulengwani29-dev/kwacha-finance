## 2026-07-14 - Hardcoded Firebase Credentials Regression
**Vulnerability:** Firebase API configuration credentials and project keys were hardcoded in `src/firebase.js`.
**Learning:** Hardcoded credentials easily regress if defaults are kept in client configuration files instead of using `process.env.REACT_APP_` environment variables.
**Prevention:** Reference `process.env.REACT_APP_` in `src/firebase.js`, provide `.env.example` as a developer template, and enforce `.env` exclusion in `.gitignore`.
