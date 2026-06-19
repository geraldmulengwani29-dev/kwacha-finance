## 2026-06-19 - XSS in PDF Export via document.write
**Vulnerability:** Manual HTML construction using template literals combined with `document.write()` in the PDF export feature of `ClientProfile.js` allowed unescaped user data (e.g., client names, loan notes) to be injected into the DOM.
**Learning:** React's built-in XSS protections are bypassed when developers manually construct HTML strings and inject them into the browser using legacy APIs like `document.write()` or `innerHTML`.
**Prevention:** Centralize HTML escaping logic in a security utility and ensure all dynamic content is sanitized before interpolation in manual HTML strings. Defense-in-depth requires escaping even data that is expected to be safe.
