# Sentinel Security Journal

## 2026-07-02 - Stored XSS in PDF Export Logic
**Vulnerability:** Cross-Site Scripting (XSS) via `document.write()` in PDF export features.
**Learning:** Manual HTML construction using template literals in features like `handlePrint` bypasses React's automatic sanitization. Even data coming from Firestore should be treated as untrusted in this context.
**Prevention:** Always use a sanitization utility like `escapeHTML` when interpolating dynamic data into raw HTML strings. Favor React-based PDF generation libraries over manual `document.write()` for more robust protection.
