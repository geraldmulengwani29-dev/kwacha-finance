## 2025-05-14 - Hardcoded Firebase Credentials
**Vulnerability:** Firebase API keys and configuration were hardcoded directly in `src/firebase.js`.
**Learning:** Hardcoding secrets in the source code exposes them to anyone with access to the repository, increasing the risk of unauthorized access or misuse of the Firebase project.
**Prevention:** Always use environment variables for sensitive configuration data and ensure that environment files (like `.env`) are included in `.gitignore`. Provide a `.env.example` file to guide developers on required configuration without exposing actual secrets.
