## 2026-07-02 - Environment Variable Configuration
**Vulnerability:** Hardcoded Firebase secrets were fixed using `process.env.REACT_APP_` syntax, which is specific to Create React App (CRA).
**Learning:** Despite illustrative examples suggesting Vite syntax (`import.meta.env.VITE_`), this project is built with CRA (`react-scripts`). Using the wrong syntax results in `undefined` values and breaks the application.
**Prevention:** Always verify the project's build system (e.g., check `package.json` for `react-scripts` vs `vite`) before implementing environment variable logic. Add code comments to clarify the required syntax for future maintainers.
