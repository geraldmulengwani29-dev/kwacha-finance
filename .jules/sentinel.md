## 2025-05-14 - XSS via Manual HTML Construction in Export Features
**Vulnerability:** Cross-Site Scripting (XSS) via `document.write()` and `innerHTML` in export-to-PDF functions.
**Learning:** Manual HTML construction using template literals combined with `document.write()` bypassed React's automatic sanitization, allowing unsanitized user-controlled data (e.g., client names, notes) to be executed as script.
**Prevention:** Use a dedicated `escapeHTML` utility to sanitize all dynamic data when manually building HTML strings. Prefer structured data over `innerHTML` when transferring content to new windows for printing.
