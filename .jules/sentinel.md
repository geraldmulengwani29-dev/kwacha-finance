## 2025-05-14 - XSS in Manual HTML Construction
**Vulnerability:** Stored Cross-Site Scripting (XSS) via `document.write()` in print/export features.
**Learning:** User-controlled data was directly concatenated into HTML strings for generating PDF/print views without sanitization. This is a common pattern in this codebase for reports and profiles.
**Prevention:** Always use a sanitization utility like `escapeHTML` when constructing HTML strings manually. Prefer using a templating engine or React-based printing libraries if possible.
