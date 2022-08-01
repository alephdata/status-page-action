# status-page-action

A GitHub Action that builds a static status page, using GitHub Issues as content source, ready to be published via GitHub Pages.

- Open issues are listed as active incidents on the status page. Closing an issue resolves the incident. Issue comments are displayed as updates.
- Whenever an issue is opened, closed, edited, or a new comment is added, the status page is built and deployed to GitHub Actions.
- Incidents are also exposed as a static JSON file that can be consumed to display in-app incident updates etc.

## Usage

1. Create a new repository to host your status page. The repository should be **private**, as every issue opened will be published on the status page, and there is no way to permanently restrict who is able to create new issues.
2. Create a new workflow based on [this template](/alephdata/status-page-action/tree/main/workflow-template.yml).
3. The workflow commits and pushes the static assets to the `gh-pages` branch. In the repository settings, enable GitHub Pages and configure `gh-pages` as [the publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site#publishing-from-a-branch).
