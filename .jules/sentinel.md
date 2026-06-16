## 2025-06-16 - XSS in PDF Export
**Vulnerability:** Cross-Site Scripting (XSS) via `document.write` in PDF export features.
**Learning:** Manual construction of HTML strings using template literals and injecting them into a new window using `document.write` bypasses React's automatic sanitization. This allows unsanitized user-controlled data (like client names or loan notes) to execute arbitrary JavaScript if the exported content is viewed.
**Prevention:** Always sanitize dynamic data using a dedicated utility like `escapeHTML` when manually constructing HTML strings for injection into the DOM or new windows.
