import Update from './update.mjs';
import { sanitizeHtml } from '../helpers.mjs';

const TYPE_LABEL_MAPPING = {
  minor: 'warning',
  major: 'error',
  announcement: 'info',
  'scheduled-maintenance': 'info',
};

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

    if (!['minor', 'major', 'scheduled-maintenance'].includes(this.type)) {
      return this.closedAt;
    }

    return new Date(this.closedAt.getTime() + 24 * 60 * 60 * 1000);
  }

  get isDismissible() {
    return this.issue.labels?.includes('dismissible') || false;
  }

  get type() {
    const label = this.issue.labels?.find((label) => label.startsWith('type:'));

    if (!label) {
      return 'announcement';
    }

    return label.replace(/^type:/, '');
  }

  get isIncident() {
    return ['minor', 'major'].includes(this.type);
  }

  get isScheduledMaintenance() {
    return this.type === 'scheduled-maintenance';
  }

  get level() {
    if (this.isIncident && this.closedAt) {
      return 'success';
    }

    if (this.isScheduledMaintenance && this.closedAt) {
      return 'success';
    }

    return TYPE_LABEL_MAPPING[this.type] || 'info';
  }

  get title() {
    if (this.isIncident && this.closedAt) {
      return `Resolved: ${this.issue.title}`;
    }

    if (this.isScheduledMaintenance && this.closedAt) {
      return `Completed: ${this.issue.title}`;
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
      dismissible: this.isDismissible,
      type: this.type,
      level: this.level,
      title: this.title,
      safeHtmlBody: this.safeHtmlBody,
      updates: this.updates.map((update) => update.toObject()),
    };
  }
}
