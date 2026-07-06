/**
 * Escapes characters that could be used for XSS in an HTML context.
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
