## 2026-07-12 - Hardcoded Firebase Secrets
**Vulnerability:** Hardcoded Firebase configuration including API keys in `src/firebase.js`.
**Learning:** Even though illustrative examples in the prompt suggested Vite syntax (`import.meta.env`), this specific codebase uses Create React App (CRA), requiring the `REACT_APP_` prefix and `process.env` syntax.
**Prevention:** Always verify the build tool in `package.json` before implementing environment variable logic to ensure correct syntax and prefixing.
