## 2026-07-14 - Fail-Open Authorization Bypass in Client Role Default
**Vulnerability:** New or unlisted authenticated users were defaulted to 'admin' privileges in `src/App.js` when their client document did not exist in Firestore.
**Learning:** Defaulting missing role documents to elevated permissions is a classic fail-open pattern that breaks least privilege principles.
**Prevention:** Always default missing, newly registered, or unauthenticated user states to the least privileged role ('client') and explicitly assign administrative privileges only when positively verified.
