## 2026-07-14 - Fail-Open Authorization Bypass
**Vulnerability:** New users or users with missing Firestore profiles were automatically granted 'admin' privileges in the frontend authorization logic.
**Learning:** The application logic used an `else` block to assign the 'admin' role if `clientDoc.exists()` returned false, assuming only admins would lack a client document. This "fail-open" pattern is dangerous as it grants maximum privilege by default.
**Prevention:** Always use a "fail-secure" approach by defaulting to the minimum required privilege level ('client') and explicitly checking for administrative criteria.
