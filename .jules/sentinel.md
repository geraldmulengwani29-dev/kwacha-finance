## 2026-07-14 - Hardcoded secrets in Firebase configuration
**Vulnerability:** Hardcoded Firebase API keys and credentials in `src/firebase.js` can lead to credential leakage, unauthorized access to resources, and block easy credential rotation.
**Learning:** Developers frequently hardcode client-side credentials in configuration files during initial setup or rapid feature development, ignoring the risk of committing them to public or shared repositories.
**Prevention:** Always externalize configuration keys and credentials using environment variables with build-system specific prefixes (e.g. `process.env.REACT_APP_` for Create React App), maintain a `.env.example` template, and explicitly ignore `.env` files in `.gitignore`.
