## 2025-06-03 - [XSS via document.write in Print Features]
**Vulnerability:** Cross-Site Scripting (XSS)
**Learning:** Manual HTML construction using template literals combined with `document.write()` in client-side code bypassed React's automatic sanitization, allowing potentially malicious client or report data to execute scripts.
**Prevention:** Always use a dedicated HTML escaping utility for dynamic data when manually constructing HTML strings. Additionally, avoid using `innerHTML` to grab content for printing as it might contain unsanitized state; instead, reconstruct the HTML from the source data while applying proper escaping.
