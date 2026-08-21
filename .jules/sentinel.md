## 2026-07-14 - Fail-Open Authorization Bypass
**Vulnerability:** User missing a Firestore `clients` document or experiencing database fetch errors was granted full `admin` role privileges by default in `src/App.js`.
**Learning:** Defaulting unassigned or missing user documents/roles to elevated privileges creates a critical authorization bypass (fail-open pattern).
**Prevention:** Always default missing user document states and catch block error handlers to the minimum required privilege level (`client` or `none`) to fail securely (fail-closed).
