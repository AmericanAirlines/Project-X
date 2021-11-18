import express, { Router } from 'express';
import { env } from '../env';
import { Contribution } from '../entities/Contribution';
import { User } from '../entities/User';
import logger from '../logger';
import { Project } from '../entities/Project';

export const contributions = Router();
contributions.use(express.json());

export interface PullRequestContribution {
  id: string;
  title: string;
  permalink: string;
  mergedAt: string;
  author: {
    login: string;
  };
}

export interface Repository {
  id: string;
  nameWithOwner: string;
}

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

interface RepositoryResponse {
  data: {
    nodes: Repository[];
  };
}

const buildProjectsQuery = async (projects: Project[]) => {
  let idString = '';

  projects.forEach((p) => {
    idString += `"${p.nodeID}",`;
  });

  idString = idString.substring(0, idString.length - 1);

  const repoQueryString = `
    query { 
      nodes(ids: [${idString}]){
        ... on Repository {
          id
          nameWithOwner
        }    
      }
    }
  `;

  const fetchRes = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `bearer ${env.githubToken}`,
    },
    body: JSON.stringify({
      query: repoQueryString,
    }),
  });

  const { data: responseData }: RepositoryResponse = await fetchRes.json();

  let queryString = '';

  responseData.nodes.forEach((repo) => {
    queryString += `repo:${repo.nameWithOwner} `;
  });

  return queryString;
};

const buildUsersQuery = (users: User[]) => {
  let queryString = '';

  users.forEach((u) => {
    queryString += `author:${u.githubUsername} `;
  });

  return queryString;
};

const buildDateQuery = (startDate: Date, endDate: Date) => {
  const locale = 'en-US';
  const queryString = `${startDate.getFullYear()}-${(startDate.getMonth() + 1).toLocaleString(
    locale,
    { minimumIntegerDigits: 2 },
  )}-${startDate
    .getDate()
    .toLocaleString(locale, { minimumIntegerDigits: 2 })}..${endDate.getFullYear()}-${(
    endDate.getMonth() + 1
  ).toLocaleString(locale, { minimumIntegerDigits: 2 })}-${endDate
    .getDate()
    .toLocaleString(locale, { minimumIntegerDigits: 2 })}`;
  return queryString;
};

const buildQueryString = (
  projectsString: string,
  dateString: string,
  userString: string,
  cursor: string | null,
) => {
  const afterString = cursor ? `after:"${cursor}",` : '';

  const queryString = `
    {
      search (first: 2, ${afterString} query: "${projectsString} is:pr is:merged merged:${dateString} ${userString}", type: ISSUE) {
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
        `;

  return queryString;
};

contributions.get('', async (req, res) => {
  try {
    const timeRange = new Date();
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 100);
    timeRange.setHours(timeRange.getHours() - 5);

    const userList = await req.entityManager.find(User, {
      $or: [
        {
          contributionsLastCheckedAt: {
            $lt: timeRange,
          },
        },
        {
          contributionsLastCheckedAt: {
            $eq: null,
          },
        },
      ],
    });

    if (userList.length === 0) {
      res.sendStatus(200);
      return;
    }

    const projectList = await req.entityManager.find(Project, {});
    const projectsString = await buildProjectsQuery(projectList);
    const dateString = buildDateQuery(yesterday, today);
    const usersString = buildUsersQuery(userList);
    let cursor = null;
    let hasNextPage = true;

    while (hasNextPage) {
      const queryString = buildQueryString(projectsString, dateString, usersString, cursor);

      const fetchRes = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `bearer ${env.githubToken}`,
        },
        body: JSON.stringify({
          query: queryString,
        }),
      });

      const { data: responseData }: ContributionResponse = await fetchRes.json();

      for (const pr of responseData.search.nodes.entries()) {
        // Only Add new contributions
        if (
          (await req.entityManager.find(Contribution, { nodeID: { $eq: pr[1].id } })).length === 0
        ) {
          const user = await req.entityManager.findOne(User, {
            githubUsername: { $eq: pr[1].author.login },
          });
          if (user) {
            const newContribution = new Contribution({
              nodeID: pr[1].id,
              authorGithubId: user.githubId,
              type: 'Pull Request',
              description: pr[1].title,
              contributedAt: new Date(Date.parse(pr[1].mergedAt)),
              score: 100,
            });
            user.contributionsLastCheckedAt = new Date();
            req.entityManager.persist(user);
            req.entityManager.persist(newContribution);
          }
        }
      }

      hasNextPage = responseData.search.pageInfo.hasNextPage;
      cursor = responseData.search.pageInfo.endCursor;
    }

    // Save new info in the db
    void req.entityManager.flush();
    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
    const errorMessage = 'There was an issue saving contribution data to the database';
    logger.error(errorMessage, error);
  }
});
