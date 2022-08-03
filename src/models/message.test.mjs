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

test('sets type and level based on labels', () => {
  const announcement = new Message({ labels: ['type:announcement'] });
  assert.strictEqual(announcement.type, 'announcement');
  assert.strictEqual(announcement.level, 'info');

  const minor = new Message({ labels: ['type:minor'] });
  assert.strictEqual(minor.type, 'minor');
  assert.strictEqual(minor.level, 'warning');

  const major = new Message({ labels: ['type:major'] });
  assert.strictEqual(major.type, 'major');
  assert.strictEqual(major.level, 'error');

  const maintenance = new Message({ labels: ['type:scheduled-maintenance'] });
  assert.strictEqual(maintenance.type, 'scheduled-maintenance');
  assert.strictEqual(maintenance.level, 'info');

  const defaultType = new Message({ labels: ['ignored'] });
  assert.strictEqual(defaultType.type, 'announcement');
  assert.strictEqual(defaultType.level, 'info');
});

test('sets success level and prefixes title for resolved minor/major incidents', () => {
  const minor = new Message({
    labels: ['type:minor'],
    closedAt: '2022-01-01T00:00:00.000Z',
    title: 'Degraded performance',
  });

  const major = new Message({
    labels: ['type:major'],
    closedAt: '2022-01-01T00:00:00.000Z',
    title: 'Outage',
  });

  assert.strictEqual(minor.level, 'success');
  assert.strictEqual(minor.title, 'Resolved: Degraded performance');

  assert.strictEqual(major.level, 'success');
  assert.strictEqual(major.title, 'Resolved: Outage');
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
