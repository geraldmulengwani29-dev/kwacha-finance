## 2026-07-14 - Fail-Open Authorization Bypass
**Vulnerability:** A fail-open authorization bypass was present in `src/App.js` where users authenticated via Firebase default to `admin` role when their document was missing from the `clients` Firestore collection.
**Learning:** Defaulting missing or unconfigured user state to an elevated role (`admin`) grants unrestricted access to privileged administrative routes and sensitive client data whenever a user record is incomplete or missing.
**Prevention:** Always enforce a default-deny / principle of least privilege posture. Fall back to the lowest-privilege role (`client` or `none`) when resolving missing database entries or during error scenarios.
