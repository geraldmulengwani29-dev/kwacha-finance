# Sentinel Security Journal

## 2026-11-05 - Hardcoded Firebase Credentials in Source Code
**Vulnerability:** Firebase configuration credentials (apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId) were hardcoded directly in `src/firebase.js`.
**Learning:** Default project setup often bundles development keys directly into client source files. In Create React App, environment variables must be prefixed with `REACT_APP_` and accessed statically as `process.env.REACT_APP_*` to ensure bundler replacement.
**Prevention:** Always externalize API credentials to `.env`, enforce `.env` exclusion in `.gitignore`, provide a `.env.example` template, and log warnings when environment variables are missing during development.
