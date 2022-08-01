import { sanitizeHtml } from '../helpers.mjs';

export default class Update {
  constructor(comment = {}) {
    this.comment = comment;
  }

  get id() {
    return this.comment.id;
  }

  get createdAt() {
    return this.comment.createdAt ? new Date(this.comment.createdAt) : null;
  }

  get updatedAt() {
    return this.comment.updatedAt ? new Date(this.comment.updatedAt) : null;
  }

  get safeHtmlBody() {
    return sanitizeHtml(this.comment.bodyHTML);
  }

  toObject() {
    return {
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      safeHtmlBody: this.safeHtmlBody,
    };
  }
}
