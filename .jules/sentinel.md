## 2026-07-14 - Fail-Open Authorization Bypass in Default User Role Assignment

**Vulnerability:** When a signed-in user did not have a corresponding Firestore client document, `src/App.js` assigned the `'admin'` role by default, granting full admin access to unassigned or newly registered users.

**Learning:** Authorization checks fell back to a high-privilege role ('admin') on missing data or lookup failures, violating the fail-closed security principle.

**Prevention:** Always default missing, unverified, or error states in role determination to the lowest-privilege role ('client') and wrap document queries in exception handlers.
