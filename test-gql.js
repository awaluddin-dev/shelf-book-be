const token = process.env.GITHUB_TOKEN;
const query = `
  query {
    user(login: "awaluddin-dev") {
      contributionsCollection {
        totalCommitContributions
        totalIssueContributions
        totalPullRequestContributions
        commitContributionsByRepository(maxRepositories: 5) {
          repository {
            name
          }
          contributions {
            totalCount
          }
        }
        pullRequestContributionsByRepository(maxRepositories: 5) {
          repository {
            name
          }
          contributions {
            totalCount
          }
        }
      }
    }
  }
`;

fetch('https://api.github.com/graphql', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ query }),
})
.then(res => res.json())
.then(console.log);
