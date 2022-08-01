import { writeFileSync, mkdirSync, copyFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fetchIssues } from './query.mjs';
import Message from './models/message.mjs';
import jsonView from './views/json.mjs';
import htmlView from './views/html.mjs';

const BUILD_DIR = process.env.BUILD_DIR || resolve('./build');
const PUBLIC_DIR = resolve('./public');
const ISSUE_LIMIT = 10;

const repoOwner = process.env.GITHUB_REPOSITORY.split('/')[0];
const repoName = process.env.GITHUB_REPOSITORY.split('/')[1];
const title = process.env.STATUS_PAGE_TITLE || 'System Status';
const appUrl = process.env.STATUS_PAGE_APP_URL;

const issues = await fetchIssues(repoOwner, repoName, ISSUE_LIMIT);
const activeMessages = issues.active.map((issue) => new Message(issue));
const resolvedMessages = issues.closed.map((issue) => new Message(issue));
const messages = [...activeMessages, ...resolvedMessages].slice(0, ISSUE_LIMIT);

const writeFile = (name, contents) => {
  const path = resolve(BUILD_DIR, name);
  writeFileSync(path, contents);
};

mkdirSync(BUILD_DIR, { recursive: true });
copyFileSync(resolve(PUBLIC_DIR, 'main.css'), resolve(BUILD_DIR, 'main.css'));
writeFile('messages.json', jsonView(messages));
writeFile('index.html', htmlView({ messages, title, appUrl }));
