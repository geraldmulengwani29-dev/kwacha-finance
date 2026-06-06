## 2025-05-14 - XSS via Manual HTML Construction in Print Windows
**Vulnerability:** Cross-Site Scripting (XSS) via `document.write()` and `innerHTML` when generating print reports.
**Learning:** Manual HTML construction using template literals combined with `document.write()` bypassed React's automatic sanitization, allowing unescaped user-controlled data (like client names, notes, or addresses) to be executed as scripts in the context of the application.
**Prevention:** Always escape user-provided data using a dedicated sanitization utility (e.g., `escapeHTML`) when manually constructing HTML strings. Avoid using `innerHTML` to copy content into new windows; instead, explicitly construct the desired HTML structure with escaped data.
