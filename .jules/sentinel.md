## 2026-07-14 - Fail-Open Authorization Bypass
**Vulnerability:** Unregistered or newly authenticated users without a Firestore `clients` document defaulted to `admin` role in `src/App.js`.
**Learning:** `onAuthStateChanged` assumed that any user without a `clients` document was an admin (`else { setRole('admin'); }`), causing a critical authorization bypass for any non-registered or partially initialized user accounts.
**Prevention:** Always default to least privilege (`client` or unprivileged role) when user data is missing or fetching fails.
