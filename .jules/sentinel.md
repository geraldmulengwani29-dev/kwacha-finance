## 2025-05-15 - XSS in Manual HTML Construction
**Vulnerability:** Cross-Site Scripting (XSS) via `document.write()` with unsanitized template literals.
**Learning:** Manual construction of HTML strings using template literals followed by `document.write()` bypasses React's automatic sanitization. This pattern was found in export/print features where user-provided data (e.g., client names, notes, collateral) was directly injected into the HTML.
**Prevention:** Always use a sanitization utility like `escapeHTML` to escape any dynamic, user-provided content before injecting it into raw HTML strings. Consider using safer alternatives to `document.write()` or libraries designed for safe PDF/print generation.
