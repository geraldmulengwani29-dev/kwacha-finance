## 2026-06-12 - Prevented XSS in Print Export Features
**Vulnerability:** Cross-Site Scripting (XSS) via manual HTML construction in export/print features.
**Learning:** Even if the main application uses React (which auto-sanitizes), manual HTML strings built with template literals and `document.write()` bypass these protections. Dynamic content like user names, addresses, or notes can contain malicious scripts.
**Prevention:** Always use a dedicated sanitization utility (like `escapeHTML`) when manually constructing HTML strings from dynamic data. Defense-in-depth: even if a field is expected to be safe, treat all dynamic input as untrusted.
