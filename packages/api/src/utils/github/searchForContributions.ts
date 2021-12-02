import { DateTime } from 'luxon';
import { Project } from '../../entities/Project';
import { User } from '../../entities/User';
import { env } from '../../env';
import logger from '../../logger';
import { buildQueryBodyString } from './buildContributionQuery';
import { buildProjectsQuery } from './buildProjectsQuery';

interface ContributionResponse {
  data: {
    search: {
      pageInfo: {
        hasNextPage: boolean;
        endCursor: string | null;
      };
      nodes: PullRequestContribution[];
    };
  };
}

export interface PullRequestContribution {
  id: string;
  title: string;
  permalink: string;
  mergedAt: string;
  author: {
    login: string;
  };
}

export async function searchForContributions(
  projects: Project[],
  lowerBoundDate: DateTime,
  upperBoundDate: DateTime,
  users: User[],
) {
  let cursor = null;
  let hasNextPage = true;

  const contributions: PullRequestContribution[] = [];

  const projectsString = await buildProjectsQuery(projects);
  if (!projectsString) {
    return contributions;
  }

  const usersString = users.map((user) => `author:${user.githubUsername}`).join(' ');
  const dateString = `${lowerBoundDate.toFormat('yyyy-MM-dd')}..${upperBoundDate.toFormat(
    'yyyy-MM-dd',
  )}`;

  try {
    while (hasNextPage) {
      // TODO
      // Add throttoling here to prevent this from exeeding the rate limit.
      // Documentation on the limit can be found here: https://docs.github.com/en/graphql/overview/resource-limitations

      const queryBodyString = buildQueryBodyString(projectsString, dateString, usersString, cursor);

      const fetchRes = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `bearer ${env.githubToken}`,
        },
        body: queryBodyString,
      });

      if (!fetchRes.ok) {
        logger.error('The contibution query to GitHub has failed');
        throw new Error(await fetchRes.text());
      }

      const { data: responseData }: ContributionResponse = await fetchRes.json();
      for (const pr of responseData.search.nodes.entries()) {
        contributions.push(pr[1]); // each node in esponseData.search.nodes.entries() is of the form [number, PullRequestContribution]
      }

      hasNextPage = responseData.search.pageInfo.hasNextPage;
      cursor = responseData.search.pageInfo.endCursor;
    }
  } catch (error) {
    const errorMessage = 'There was an issue getting contribution data';
    logger.error(errorMessage, error);
  }

  return contributions;
}
