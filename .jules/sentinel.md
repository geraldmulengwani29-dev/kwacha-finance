## 2025-05-14 - Manual HTML Construction XSS
**Vulnerability:** XSS via `document.write()` with unescaped user data.
**Learning:** Manual HTML construction using template literals combined with `document.write()` in export features (like `handlePrint` in `ClientProfile.js`) bypassed React's automatic sanitization, creating a direct XSS vector.
**Prevention:** Always use a sanitization utility like `escapeHTML` when manually building HTML strings from dynamic data, even for internal features like printing.
