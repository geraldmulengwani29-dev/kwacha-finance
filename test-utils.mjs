import { escapeHTML } from './src/utils/security.js';
import assert from 'assert';

try {
  assert.strictEqual(escapeHTML('<div>'), '&lt;div&gt;');
  assert.strictEqual(escapeHTML('a & b'), 'a &amp; b');
  assert.strictEqual(escapeHTML('"quote"'), '&quot;quote&quot;');
  assert.strictEqual(escapeHTML("'single'"), '&#039;single&#039;');
  assert.strictEqual(escapeHTML(123), 123);
  console.log('Utility tests passed!');
} catch (err) {
  console.error('Utility tests failed!');
  console.error(err);
  process.exit(1);
}
