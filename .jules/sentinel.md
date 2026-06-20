## 2025-06-20 - Hardcoded Firebase Credentials
**Vulnerability:** Hardcoded API keys and configuration in `src/firebase.js`.
**Learning:** Initial setup or quick prototyping often leads to committing secrets to the repository, which can be exploited if the codebase is exposed.
**Prevention:** Use environment variables for all sensitive configuration and provide a `.env.example` template for other developers.
