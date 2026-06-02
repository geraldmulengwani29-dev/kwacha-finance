/**
 * Escapes special characters for use in HTML to prevent XSS.
 * @param {string} str - The string to escape.
 * @returns {string} - The escaped string.
 */
export const escapeHTML = (str) => {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};
