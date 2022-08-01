import test from 'node:test';
import assert from 'node:assert';
import Update from './update.mjs';

test('sanitizes body', () => {
  const update = new Update({
    bodyHTML: 'Hello World!<script>alert("Hello World!")</script>',
  });

  assert.strictEqual(update.safeHtmlBody, 'Hello World!');
});

test('adds target="_blank" and rel="noreferrer noopener" to links', () => {
  const update = new Update({
    bodyHTML: '<a href="https://example.org">Read more</a>',
  });

  assert.strictEqual(
    update.safeHtmlBody,
    '<a href="https://example.org" target="_blank" rel="noopener noreferrer">Read more</a>'
  );
});
