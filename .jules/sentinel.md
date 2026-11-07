## 2026-11-05 - Firebase Secrets Regression
**Vulnerability:** Hardcoded Firebase API credentials were exposed directly in `src/firebase.js`.
**Learning:** Hardcoded credentials frequently regress when environment variable configurations are not clearly documented and guarded. Create React App requires static access via `process.env.REACT_APP_` for variables to be injected during the build.
**Prevention:** Externalize secrets to environment variables, provide a `.env.example` template, ensure `.gitignore` excludes `.env`, and add in-code security warnings.
