/**
 * Escapes HTML special characters to prevent XSS attacks when injecting content into HTML strings.
 * @param {string|number|null|undefined} str - The string or value to escape.
 * @returns {string} The escaped string.
 */
export const escapeHTML = (str) => {
  if (str === null || str === undefined) return '';
  const stringValue = String(str);
  return stringValue
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};
