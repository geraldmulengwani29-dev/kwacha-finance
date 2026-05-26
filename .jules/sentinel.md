## 2025-05-15 - XSS via Print Functionality
**Vulnerability:** Cross-Site Scripting (XSS)
**Learning:** User-controlled data (client details, loan descriptions, payment notes) was directly injected into a HTML template string used for the `window.open().document.write()` print functionality. This allowed for execution of arbitrary JavaScript if a client's name or other fields contained malicious scripts.
**Prevention:** Always sanitize or escape user-controlled data before injecting it into HTML contexts, even for secondary features like print-to-PDF. Use a dedicated escaping helper for manual HTML construction.
