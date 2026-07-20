# Sentinel Security Journal

## 2026-07-14 - Fail-Open Authorization Bypass in Client vs Admin Role Resolution
**Vulnerability:** A fail-open authorization bypass in `src/App.js` where users without a corresponding Firestore document were previously granted 'admin' privileges; the default was changed to 'client'.
**Learning:** During user authentication state changes, querying Firestore client profile to determine the user role fell back to 'admin' when the document was not found or failed to load. Under database lookup failures or user profiles being missing/uncreated, unauthorized users were granted full administrative rights.
**Prevention:** Always adopt a fail-closed approach by defaulting authorization logic to the lowest-privilege role ('client') whenever a user document is missing or retrieval fails. Ensure error handling (try-catch) wraps all database calls during role resolution to gracefully handle transient network or query errors.

## 2026-07-12 - Hardcoded Firebase Secrets
**Vulnerability:** Hardcoded Firebase configuration including API keys in `src/firebase.js`.
**Learning:** Even though illustrative examples in the prompt suggested Vite syntax (`import.meta.env`), this specific codebase uses Create React App (CRA), requiring the `REACT_APP_` prefix and `process.env` syntax.
**Prevention:** Always verify the build tool in `package.json` before implementing environment variable logic to ensure correct syntax and prefixing.

## 2026-07-02 - Stored XSS in PDF Export Logic
**Vulnerability:** Cross-Site Scripting (XSS) via `document.write()` in PDF export features.
**Learning:** Manual HTML construction using template literals in features like `handlePrint` bypasses React's automatic sanitization. Even data coming from Firestore should be treated as untrusted in this context.
**Prevention:** Always use a sanitization utility like `escapeHTML` when interpolating dynamic data into raw HTML strings. Favor React-based PDF generation libraries over manual `document.write()` for more robust protection.
