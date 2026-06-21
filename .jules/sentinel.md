## 2025-06-21 - [CRITICAL] Fix hardcoded Firebase credentials
**Vulnerability:** Hardcoded Firebase API key and configuration in `src/firebase.js`.
**Learning:** Hardcoding secrets in source code is a common but high-risk vulnerability that can lead to unauthorized access to cloud resources. Even if the project is private, secrets should never be part of the codebase history.
**Prevention:** Always use environment variables for sensitive configuration (e.g., `REACT_APP_` for Create React App projects) and ensure `.env` is listed in `.gitignore`. Provide a `.env.example` as a template for other developers.
