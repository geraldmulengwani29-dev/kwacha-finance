## 2026-06-24 - Hardcoded Firebase secrets regression
**Vulnerability:** Hardcoded Firebase API keys and configuration in `src/firebase.js`.
**Learning:** Despite previous attempts to move secrets to environment variables (seen in git history), hardcoded credentials regressed into the main branch. This indicates a lack of automated secrets scanning in the CI/CD pipeline.
**Prevention:** Implement a secrets scanning tool (like Gitleaks or TruffleHog) in the pre-commit hooks and CI pipeline to prevent sensitive information from being committed.
