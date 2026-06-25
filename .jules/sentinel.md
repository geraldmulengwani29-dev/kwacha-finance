# Sentinel Security Journal

## 2026-06-25 - [CRITICAL] Fix hardcoded Firebase secrets
**Vulnerability:** Hardcoded Firebase API keys and configuration in `src/firebase.js`.
**Learning:** Hardcoded credentials in source code can be exposed through version control, leading to unauthorized access and potential service abuse.
**Prevention:** Always use environment variables for sensitive configuration and provide a `.env.example` template for development. Ensure `.env` files are ignored in `.gitignore` and never commit actual secrets or API keys to the repository.
