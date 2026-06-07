## 2025-05-14 - DOM XSS in Export Features
**Vulnerability:** DOM-based Cross-Site Scripting (XSS) via `document.write()` and `innerHTML`.
**Learning:** Manual HTML construction using template literals and injecting them into the DOM (e.g., via `document.write()` or `innerHTML`) bypasses React's automatic sanitization. In this codebase, the export/print features were particularly vulnerable as they combined user-controlled data (client names, notes, addresses) into HTML strings.
**Prevention:** Use a dedicated security utility like `escapeHTML` to sanitize all dynamic content before manual HTML construction. Avoid `innerHTML` and `document.write()` where possible, or ensure the input is fully sanitized.
