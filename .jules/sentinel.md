## 2025-05-14 - XSS in Manual HTML Construction for Export Features
**Vulnerability:** Cross-Site Scripting (XSS) via `document.write()` and unescaped template literals.
**Learning:** In features like PDF export or printing, developers often use `window.open()` followed by `document.write()` with template literals. Since these template literals bypass React's automatic sanitization, any user-controlled data (like client names or notes) can lead to XSS.
**Prevention:** Always escape dynamic data before inserting it into manual HTML strings using a dedicated utility like `escapeHTML`.
