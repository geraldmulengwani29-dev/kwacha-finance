## 2026-06-30 - Fix fail-open authorization in App.js
**Vulnerability:** A 'fail-open' vulnerability existed where users were automatically granted 'admin' privileges if their document was missing from the 'clients' collection.
**Learning:** Initial authorization logic defaulted to the highest privilege ('admin') when user metadata was unavailable, violating the principle of least privilege.
**Prevention:** Always default to the least privilege ('client' or null) when authorization data is missing or ambiguous.
