## 2026-05-29 - XSS vulnerability in Client Profile export
**Vulnerability:** Cross-Site Scripting (XSS) via `window.document.write()`. User-controlled data (client name, address, loan collateral, etc.) was directly embedded into a manually constructed HTML string for printing/exporting.
**Learning:** React's automatic sanitization only applies to JSX. Manual DOM manipulation or using template literals with `document.write()` or `innerHTML` bypasses these protections, reintroducing XSS risks if data isn't explicitly escaped.
**Prevention:** Always use a sanitization utility when manually building HTML strings from user-controlled data. In this project, `escapeHTML` should be used for all non-JSX HTML construction.
