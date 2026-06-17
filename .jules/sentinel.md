## 2025-06-17 - Manual HTML Construction XSS
**Vulnerability:** Manual HTML construction using template literals combined with `document.write()` in the PDF export feature allowed for Cross-Site Scripting (XSS).
**Learning:** Data fetched from Firestore was trusted and injected directly into a new window's document, bypassing React's automatic sanitization which only applies to JSX.
**Prevention:** Always use a sanitization utility like `escapeHTML` when manually constructing HTML strings, even for data that is expected to be numeric or from a trusted source.
