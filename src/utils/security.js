/**
 * Escapes special characters for use in HTML to prevent XSS.
 * @param {any} val - The value to escape.
 * @returns {string} - The escaped string.
 */
export const escapeHTML = (val) => {
  if (val === null || val === undefined) return '';
  const str = String(val);
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};
