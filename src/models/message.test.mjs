import test from 'node:test';
import assert from 'node:assert';
import Message from './message.mjs';

test('sets title and body', () => {
  const message = new Message({
    title: 'Degraded performance',
    bodyHTML: 'Processing files currently takes longer than usual.',
  });

  assert.strictEqual(message.title, 'Degraded performance');
  assert.strictEqual(
    message.safeHtmlBody,
    'Processing files currently takes longer than usual.'
  );
});

test('sanitizes body', () => {
  const message = new Message({
    bodyHTML: 'Hello World!<script>alert("Hello World!")</script>',
  });

  assert.strictEqual(message.safeHtmlBody, 'Hello World!');
});

test('adds target="_blank" and rel="noreferrer noopener" to links', () => {
  const message = new Message({
    bodyHTML: '<a href="https://example.org">Read more</a>',
  });

  assert.strictEqual(
    message.safeHtmlBody,
    '<a href="https://example.org" target="_blank" rel="noopener noreferrer">Read more</a>'
  );
});

test('sets level based on issue labels', () => {
  const infoMessage = new Message({ labels: ['ignored', 'level:info'] });
  assert.strictEqual(infoMessage.level, 'info');

  const warningMessage = new Message({ labels: [] });
  assert.strictEqual(warningMessage.level, 'warning');
});

test('sets success level and title prefix for closed issues', () => {
  const message = new Message({
    labels: ['level:warning'],
    closedAt: '2022-01-01T00:00:00.000Z',
    title: 'Degraded performance',
  });

  assert.strictEqual(message.level, 'success');
  assert.strictEqual(message.title, 'Resolved: Degraded performance');
});

test('displays closed issues for 24 more hours', () => {
  const message = new Message({
    closedAt: '2022-01-01T00:00:00.000Z',
  });

  assert.deepStrictEqual(
    message.displayUntil,
    new Date('2022-01-02T00:00:00.000Z')
  );
});

test('has updates', () => {
  const message = new Message({
    comments: [
      {
        id: 1,
        createdAt: '2022-01-03T00:00:00.000Z',
        bodyHTML: 'This is an update!',
      },
    ],
  });

  assert.deepStrictEqual(message.toObject().updates, [
    {
      id: 1,
      createdAt: new Date('2022-01-03T00:00:00.000Z'),
      updatedAt: null,
      safeHtmlBody: 'This is an update!',
    },
  ]);
});
