# status-page-action

A GitHub Action that builds a static status page, using GitHub Issues as content source, ready to be published via GitHub Pages.

- Open issues are listed as active status messages on the status page. Closing an issue resolves the status message. Issue comments are displayed as updates.
- Whenever an issue is opened, closed, edited, or a new comment is added, the status page is built and deployed to GitHub Actions.
- Status messages are also exposed as a static JSON file that can be consumed to display in-app status messages etc.

## Setup

1. Create a new repository to host your status page. The repository should be **private**, as every issue opened will be published on the status page, and there is no way to permanently restrict who is able to create new issues.
2. Create a new workflow based on [this template](/alephdata/status-page-action/tree/main/workflow-template.yml).
3. The workflow commits and pushes the static assets to the `gh-pages` branch. In the repository settings, enable GitHub Pages and configure `gh-pages` as [the publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site#publishing-from-a-branch).

## Status Types

You can use issue labels to assign a type to a status message. The default status message type is _announcement_.

| Type                  | Label                        |
| --------------------- | ---------------------------- |
| Announcement          | `type:announcement`          |
| Minor incident        | `type:minor`                 |
| Major incident        | `type:major`                 |
| Scheduled maintenance | `type:scheduled-maintenance` |

When you close a status message of type _minor incident_, _major incident_, or _scheduled maintenance_, the message will stay active for 24 more hours in order to inform your users that the incident has been resolved or that the maintenance has been completed.
