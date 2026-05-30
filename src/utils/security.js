/**
 * Escapes special characters in a string for safe use in HTML content.
 * @param {any} unsafe - The value to escape.
 * @returns {string} The escaped string.
 */
export const escapeHTML = (unsafe) => {
  if (unsafe === null || unsafe === undefined) return '';
  const str = String(unsafe);
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};
