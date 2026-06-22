## 2025-06-22 - Hardcoded Firebase Credentials
**Vulnerability:** Hardcoded Firebase API keys and project configuration in `src/firebase.js`.
**Learning:** Initial project setup often includes hardcoded configuration for convenience, which can be accidentally committed to version control, exposing infrastructure to unauthorized access.
**Prevention:** Always use environment variables for sensitive configuration and provide a `.env.example` file as a template. Ensure `.env` is explicitly listed in `.gitignore`.
