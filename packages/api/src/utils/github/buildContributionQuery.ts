
export const buildQueryBodyString = (
  projectsString: string,
  dateString: string,
  userString: string,
  cursor: string | null,
) => {
  const queryParamString = `${projectsString} is:pr is:merged merged:${dateString} ${userString}`;

  const queryBodyString = JSON.stringify({
    query: `
  query FindPullRequests($queryParams: String!, $cursor: String){
      search (first: 2, after: $cursor, query: $queryParams, type: ISSUE) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          ... on PullRequest {
            id
            title
            permalink
            mergedAt
            author {
              login
            }
          }
        }
      }
    }
        `,
        variables: {
          queryParams: queryParamString,
          cursor,
        }
      });

  return queryBodyString;
};