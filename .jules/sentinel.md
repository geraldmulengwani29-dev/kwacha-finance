## 2025-05-14 - XSS in Manual HTML Construction
**Vulnerability:** Cross-Site Scripting (XSS) via `document.write()` and template literals.
**Learning:** React's automatic sanitization only applies to JSX. When bypassing React to manually construct HTML strings for features like PDF export or printing, all user-provided data remains unsanitized and must be manually escaped.
**Prevention:** Use a dedicated `escapeHTML` utility for any manual HTML construction. Avoid `document.write()` where possible in favor of more modern and secure export methods.
