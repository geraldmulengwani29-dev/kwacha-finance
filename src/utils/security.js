/**
 * Safely escapes HTML characters in a string to prevent XSS.
 * Also handles non-string inputs by converting them to strings first.
 * @param {any} str - The value to escape
 * @returns {string} - The escaped string
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
