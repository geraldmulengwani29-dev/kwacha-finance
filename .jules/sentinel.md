## 2025-05-14 - XSS in Manual HTML Construction
**Vulnerability:** Cross-Site Scripting (XSS) via manual HTML string construction and `document.write()`.
**Learning:** Developers often rely on React's automatic escaping but may forget that manual HTML generation (e.g., for PDF export/printing) bypasses these protections.
**Prevention:** Use an `escapeHTML` utility to sanitize all dynamic fields before including them in manually constructed HTML strings.
