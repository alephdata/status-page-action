const GRAPHQL_ENDPOINT = 'https://api.github.com/graphql';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const request = async (query, variables) => {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `token ${GITHUB_TOKEN}`,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  };

  return await fetch(GRAPHQL_ENDPOINT, options).then((res) => res.json());
};

export const fetchIssues = async (repoOwner, repoName, limit) => {
  const query = `
    query($repoOwner: String!, $repoName: String!, $limit: Int!) { 
      repository(owner: $repoOwner, name: $repoName) {
        active: issues(states: OPEN, first: $limit, orderBy: {
          field: UPDATED_AT,
          direction: DESC,
        }) {
          nodes { ...issueInfo }
        },
        closed: issues(states: CLOSED, first: $limit, orderBy: {
          field: UPDATED_AT,
          direction: DESC,
        }) { 
          nodes { ...issueInfo }
        },
      },
    }

    fragment issueInfo on Issue {
      id,
      createdAt,
      updatedAt,
      closedAt,
      title,
      bodyHTML,
      labels(first: 100) {
        nodes {
          name,
        }
      },
      comments(first: 100) {
        nodes {
          id,
          createdAt,
          updatedAt,
          bodyHTML,
        },
      },
    }
  `;

  const response = await request(query, { repoOwner, repoName, limit });

  const flattenIssue = (issue) => ({
    ...issue,
    labels: issue.labels.nodes.map(({ name }) => name),
    comments: issue.comments.nodes.map((comment) => comment),
  });

  return {
    active: response.data.repository.active.nodes.map((issue) =>
      flattenIssue(issue)
    ),
    closed: response.data.repository.closed.nodes.map((issue) =>
      flattenIssue(issue)
    ),
  };
};
