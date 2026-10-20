## 2026-07-14 - Fail-Open Authorization Bypass on Missing Client Document
**Vulnerability:** When authenticated users logged in without a corresponding Firestore document in the `clients` collection (or during Firestore read errors), `src/App.js` fell back to granting `admin` privileges.
**Learning:** Assuming missing role metadata implies an administrative user is a dangerous fail-open pattern that allows unauthorized privilege escalation for newly created or unindexed accounts.
**Prevention:** Default all fallback states and exceptions to the least privileged role (`client`) to maintain a fail-closed access control design.
