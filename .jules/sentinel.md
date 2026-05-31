## 2025-05-31 - XSS in Manual HTML Construction
**Vulnerability:** Cross-Site Scripting (XSS) via manual HTML construction in PDF export features.
**Learning:** Using template literals to build HTML strings for `document.write()` bypassing React's automatic sanitization. Even if data is stored in a database, it must be escaped when manually building HTML strings.
**Prevention:** Always use a sanitization utility like `escapeHTML` when manually constructing HTML from user-controlled data. Prefer using established libraries for PDF generation or printing that handle escaping automatically.
