# Sentinel's Security Journal 🛡️

## 2025-05-14 - XSS in manual HTML construction
**Vulnerability:** Cross-Site Scripting (XSS) via `document.write` in export features.
**Learning:** The application uses template literals to build full HTML documents for printing, injecting user-controlled data directly into the markup without sanitization.
**Prevention:** Use a dedicated `escapeHTML` utility to sanitize all user-controlled variables before they are injected into manual HTML strings.

## 2025-05-14 - Hardcoded Firebase Credentials
**Vulnerability:** Hardcoded API keys and project identifiers in `src/firebase.js`.
**Learning:** Development credentials were left in the source code, posing a risk if the repository is shared or compromised.
**Prevention:** Use environment variables (prefixed with `REACT_APP_`) to manage sensitive configuration and provide a `.env.example` for reference.
