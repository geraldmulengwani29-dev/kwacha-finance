/**
 * Safely escapes HTML special characters to prevent Cross-Site Scripting (XSS).
 * Handles null/undefined and converts non-string primitives safely.
 */
export const escapeHTML = (str) => {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};
