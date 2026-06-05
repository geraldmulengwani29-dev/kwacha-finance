## 2026-06-05 - DOM-based XSS in Print/Export Features
**Vulnerability:** DOM-based Cross-Site Scripting (XSS) via `document.write()` and `innerHTML`.
**Learning:** Manual HTML construction using template literals combined with `document.write()` bypasses React's automatic XSS protection. Injected user data (names, notes, collateral) from Firestore was not sanitized, allowing malicious scripts to execute in the context of the printing window.
**Prevention:** Avoid `innerHTML` and `document.write()` when possible. If required for features like print-to-PDF, always sanitize dynamic data using a dedicated `escapeHTML` utility before injection into the HTML string.
