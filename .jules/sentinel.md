## 2026-07-02 - Firebase Secrets Regression
**Vulnerability:** Hardcoded Firebase API keys and configuration in `src/firebase.js`.
**Learning:** Security fixes for hardcoded secrets are prone to regression if not backed by a `.env.example` template and clear security comments in the configuration file. Developers may accidentally revert to hardcoded strings for "convenience" during local debugging if environment variables are not properly documented.
**Prevention:** Always maintain a `.env.example` file, ensure `.env` is in `.gitignore`, and add `// SECURITY` comments directly in the config file to warn future developers against re-introducing hardcoded values.
