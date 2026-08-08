# Sentinel Security Journal

## 2026-07-14 - Fail-Open Authorization Bypass in App.js
**Vulnerability:** A fail-open authorization bypass existed in the global authorization handler inside `src/App.js` where users without an explicit document in Firestore defaulted to the `'admin'` role, allowing unauthenticated or custom accounts to escalate privileges.
**Learning:** Defaulting to elevated privileges in the absence of database records is an anti-pattern. Systems should always default to the least privileged role (e.g., `'client'`) and incorporate robust exception handling to ensure failures fail securely.
**Prevention:** Always follow the principle of least privilege. Implement secure default states where any missing metadata, database records, or query execution errors result in a fail-closed or minimally privileged posture.
