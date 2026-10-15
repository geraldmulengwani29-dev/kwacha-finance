## 2026-07-14 - Hardcoded Firebase API Credentials
**Vulnerability:** Hardcoded Firebase API key and configuration credentials in `src/firebase.js`.
**Learning:** Hardcoding credentials directly in client source files exposes API keys in source control and risk credential compromise.
**Prevention:** Always externalize configuration parameters into environment variables (`process.env.REACT_APP_*`), provide `.env.example` templates, and maintain `.env` in `.gitignore`.
