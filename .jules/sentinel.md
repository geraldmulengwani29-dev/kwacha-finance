## 2026-06-11 - Manual HTML Construction XSS
**Vulnerability:** Manual HTML construction using template literals combined with `document.write()` in export features (like `handlePrint` in `ClientProfile.js`) bypasses React's built-in XSS protections.
**Learning:** React's automatic sanitization only applies to JSX. When developers drop down to manual DOM manipulation or use APIs like `document.write` with dynamic data, they must manually sanitize all inputs.
**Prevention:** Use a shared security utility (e.g., `escapeHTML`) to sanitize all dynamic fields before they are interpolated into manual HTML strings.
