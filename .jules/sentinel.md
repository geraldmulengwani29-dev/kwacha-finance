## 2026-07-14 - Fail-Open Authorization Bypass in Client Document Lookup
**Vulnerability:** Newly registered or external authenticated users whose client record did not exist in Firestore were automatically assigned the `admin` role in `src/App.js`.
**Learning:** Defaulting unhandled branches or missing documents to elevated permissions is a classic fail-open anti-pattern.
**Prevention:** Always default missing user document or error scenarios to the least privileged role (`client`).
