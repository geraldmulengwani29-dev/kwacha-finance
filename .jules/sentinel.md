## 2026-07-14 - Hardcoded Firebase Credentials Regression
**Vulnerability:** Hardcoded Firebase API keys and project configuration in `src/firebase.js`.
**Learning:** Hardcoded credentials can easily be checked back into source code during rapid development or refactoring when missing template configuration files.
**Prevention:** Always extract credentials into `process.env.REACT_APP_*` environment variables, maintain a `.env.example` file, and ensure `.env` is explicitly listed in `.gitignore`.
