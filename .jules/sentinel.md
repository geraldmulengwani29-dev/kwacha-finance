# Sentinel Security Journal

This journal tracks critical security learnings, vulnerability patterns, and mitigation strategies for the Kwacha Finance project.

## 2026-07-02 - Regression of Hardcoded Firebase Secrets
**Vulnerability:** Hardcoded Firebase credentials were found in `src/firebase.js`.
**Learning:** Security configurations can regress during development or refactoring if not properly monitored or if environment variable practices are not strictly enforced.
**Prevention:** Use environment variables for all sensitive configuration data and provide a `.env.example` file. Regularly audit configuration files for hardcoded secrets.
