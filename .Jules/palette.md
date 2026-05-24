## 2025-05-24 - Accessibility and Semantics in Auth Pages
**Learning:** Using non-semantic elements like `<span>` with click handlers for navigation is inaccessible to keyboard users and screen readers. Additionally, missing `<label>` elements for form inputs prevents screen readers from correctly identifying the purpose of each field.
**Action:** Always use `<Link>` from `react-router-dom` for navigation between pages and ensure all form inputs have associated `<label>` elements. Use a global `.sr-only` class to keep labels accessible to screen readers while maintaining visual design.
