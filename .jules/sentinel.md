## 2026-07-14 - Firebase Secrets Exposure and Secrets Regression
**Vulnerability:** Hardcoded sensitive Firebase configuration details and API keys were exposed in the source code at `src/firebase.js`.
**Learning:** Hardcoding credentials makes them vulnerable to exposure in public repositories and complicates configuration changes across environments. Even after such vulnerabilities are fixed once, code regressions (e.g., merging features from older branches) can reintroduce them.
**Prevention:** Always use environment variables (e.g., prefixed with `REACT_APP_` for Create React App) to load configuration dynamically at build/runtime. Maintain `.env.example` templates and configure `.gitignore` to explicitly ignore `.env` files.
