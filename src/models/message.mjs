import Update from './update.mjs';
import { sanitizeHtml } from '../helpers.mjs';

export default class Message {
  constructor(issue = {}) {
    this.issue = issue;
  }

  get id() {
    return this.issue.id;
  }

  get createdAt() {
    return this.issue.createdAt ? new Date(this.issue.createdAt) : null;
  }

  get updatedAt() {
    return this.issue.updatedAt ? new Date(this.issue.updatedAt) : null;
  }

  get closedAt() {
    return this.issue.closedAt ? new Date(this.issue.closedAt) : null;
  }

  get displayUntil() {
    if (!this.closedAt) {
      return null;
    }

    return new Date(this.closedAt.getTime() + 24 * 60 * 60 * 1000);
  }

  get level() {
    if (this.closedAt) {
      return 'success';
    }

    const label = this.issue.labels?.find((label) =>
      label.startsWith('level:')
    );

    if (!label) {
      return 'warning';
    }

    return label.replace(/^level:/, '');
  }

  get title() {
    if (this.closedAt) {
      return `Resolved: ${this.issue.title}`;
    }

    return this.issue.title;
  }

  get safeHtmlBody() {
    return sanitizeHtml(this.issue.bodyHTML);
  }

  get updates() {
    return this.issue.comments.map((comment) => new Update(comment));
  }

  toObject() {
    return {
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      displayUntil: this.displayUntil,
      level: this.level,
      title: this.title,
      safeHtmlBody: this.safeHtmlBody,
      updates: this.updates.map((update) => update.toObject()),
    };
  }
}
