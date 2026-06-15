/**
 * Escapes HTML special characters in a string to prevent XSS.
 * @param {any} unsafe - The value to escape.
 * @returns {string} The escaped string.
 */
export const escapeHTML = (unsafe) => {
  if (unsafe === null || unsafe === undefined) return '';
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};
