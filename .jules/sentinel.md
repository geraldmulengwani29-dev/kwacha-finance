## 2026-06-28 - Secrets regression in Firebase configuration
**Vulnerability:** Hardcoded Firebase API key and project metadata in `src/firebase.js`.
**Learning:** Security fixes involving configuration can regress if not properly monitored or if developers revert changes for convenience during local debugging.
**Prevention:** Use environment variable prefixes (e.g., `REACT_APP_`) for static replacement during build. Implement runtime checks in development mode to warn about missing configuration. Provide a `.env.example` template to standardize environment setup across the team.
