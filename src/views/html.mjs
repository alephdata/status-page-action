import { html, formatDate } from '../helpers.mjs';

const Updates = (updates) => {
  return html`
    <ul class="updates">
      $${updates.map(
        (update) => html`
          <li class="updates__item">
            <time
              class="updates__date"
              datetime="${update.createdAt.toISOString()}"
              >${formatDate(update.createdAt, 'short')}</time
            >
            $${update.safeHtmlBody}
          </li>
        `
      )}
    </ul>
  `;
};

const Message = (message) => {
  if (!message) {
    return 'Aleph is operational! :)';
  }

  return html`
    <article class="message">
      <header class="message__header">
        <h3 class="message__title">${message.title}</h3>
        <p class="message__meta">
          <time datetime="${message.createdAt.toISOString()}"
            >${formatDate(message.createdAt)}</time
          >
        </p>
      </header>
      <p>$${message.safeHtmlBody}</p>
      $${Updates(message.updates)}
    </article>
  `;
};

const Status = (messages) => {
  const hasIssues = messages.some(({ level }) => {
    return level !== 'success' && level !== 'info';
  });

  const icon = hasIssues
    ? '<svg width="24px" height="24px" viewBox="0 0 24 24"><path d="M12,0A12,12,0,1,0,24,12,12.035,12.035,0,0,0,12,0Zm4.95,15.536L15.536,16.95,12,13.414,8.464,16.95,7.05,15.536,10.586,12,7.05,8.464,8.464,7.05,12,10.586,15.536,7.05,16.95,8.464,13.414,12Z"></path></svg>'
    : '<svg width="24px" height="24px" viewBox="0 0 24 24"><path d="M12,0A12,12,0,1,0,24,12,12.035,12.035,0,0,0,12,0ZM10,17.414,4.586,12,6,10.586l4,4,8-8L19.414,8Z"></path></svg>';

  const text = hasIssues
    ? html`
        <h1>We’re currently having issues.</h1>
        <p>We’re sorry for the inconvenience.</p>
      `
    : html`
        <h1>All systems operational.</h1>
        <p>There are no known issues at the moment.</p>
      `;

  return html`
    <section class="status status--${hasIssues ? 'error' : 'success'}">
      <div class="status__icon">$${icon}</div>
      <div class="status__text">$${text}</div>
    </section>
  `;
};

const Messages = (messages) => {
  return html`
    <section class="messages">
      <h2 class="visually-hidden">Recent messages</h2>
      $${messages.map((message) => Message(message))}
    </section>
  `;
};

const Main = (messages) => {
  return html`
    <main class="main">
      $${Status(messages)} $${messages.length > 0 && Messages(messages)}
    </main>
  `;
};

const Header = ({ title, appUrl }) => {
  return html`
    <header class="header">
      <div class="header__title">${title}</div>
      <a class="header__app-link" href="${appUrl}" target="_blank"
        >Back to app</a
      >
    </header>
  `;
};

export default function ({ title, appUrl, messages }) {
  const activeMessages = messages.filter(({ closedAt }) => !closedAt);

  return html`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <title>${title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="./main.css" />
      </head>
      <body>
        <div class="wrapper">
          $${Header({ title, appUrl })} $${Main(activeMessages)}
        </div>
      </body>
    </html>
  `;
}
