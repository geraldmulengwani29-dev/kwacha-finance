## 2026-07-14 - Fail-Open Authorization Bypass
**Vulnerability:** New or unregistered user accounts whose Firestore `clients` document did not exist were automatically granted `admin` role privileges in `src/App.js`.
**Learning:** Defaulting roles or permissions to elevated privilege levels when data is missing or lookup fails creates a severe "fail-open" security vulnerability.
**Prevention:** Always enforce "fail-closed" defaults in authorization logic—if user state or document lookup fails or is missing, assign the lowest privilege role (`client`) or deny access by default.
