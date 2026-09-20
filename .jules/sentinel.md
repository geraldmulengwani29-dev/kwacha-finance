## 2026-07-14 - Fail-Open Authorization Bypass in Role Assignment
**Vulnerability:** Users missing a client profile document in Firestore were granted 'admin' privileges by default in `src/App.js`.
**Learning:** Defaulting unhandled branches in authorization logic to administrative access allowed unauthorized privilege escalation whenever user records were missing or delayed in database propagation.
**Prevention:** Always default authorization states to least privilege ('client' or unauthenticated) and wrap database profile lookups in try-catch blocks to enforce fail-secure defaults on failure.
