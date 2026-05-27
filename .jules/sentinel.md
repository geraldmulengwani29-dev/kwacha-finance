## 2025-05-15 - XSS in Manual HTML Construction for Export
**Vulnerability:** Cross-Site Scripting (XSS) via `document.write()` in PDF export feature.
**Learning:** Manually constructing HTML strings using template literals and injecting user-provided data directly into them creates significant XSS risks. In this case, client names, notes, and collateral descriptions were being injected without sanitization, allowing malicious users to execute arbitrary scripts in the administrator's context when a profile is exported.
**Prevention:** Always sanitize or escape user-controllable data before injecting it into HTML strings. Use a dedicated library for PDF generation or a safe templating engine instead of manual string concatenation and `document.write()`.
