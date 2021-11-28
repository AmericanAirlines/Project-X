import { EntityManager } from "@mikro-orm/core";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { Contribution } from "./entities/Contribution";
import { Project } from "./entities/Project";
import { User } from "./entities/User";
import { env } from "./env";
import logger from "./logger";
import { buildQueryBodyString } from "./utils/github/buildContributionQuery";
import { buildDateQuery } from "./utils/github/buildDateQuery";
import { buildProjectsQuery } from "./utils/github/buildProjectsQuery";
import { buildUsersQuery } from "./utils/github/buildUserQuery";

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

export const contributionPoll = async (entityManager: EntityManager<PostgreSqlDriver>) => {
    try {
      const timeRange = new Date();
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 100);
      timeRange.setHours(timeRange.getHours() - 5);
  
      const userList = await entityManager.find(User, {
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
        return;
      }
  
      const projectList = await entityManager.find(Project, {});
      const projectsString = await buildProjectsQuery(projectList);
      const dateString = buildDateQuery(yesterday, today);
      const usersString = buildUsersQuery(userList);
      let cursor = null;
      let hasNextPage = true;
  
      while (hasNextPage) {
        const queryBodyString = buildQueryBodyString(projectsString, dateString, usersString, cursor);
  
        const fetchRes = await fetch('https://api.github.com/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `bearer ${env.githubToken}`,
          },
          body: queryBodyString,
        });
  
        const { data: responseData }: ContributionResponse = await fetchRes.json();
        for (const pr of responseData.search.nodes.entries()) {
          // Only Add new contributions
          if (
            (await entityManager.find(Contribution, { nodeID: { $eq: pr[1].id } })).length === 0
          ) {
            const user = await entityManager.findOne(User, {
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
              entityManager.persist(newContribution);
            }
          }
        }
        hasNextPage = responseData.search.pageInfo.hasNextPage;
        cursor = responseData.search.pageInfo.endCursor;
      }
  
      for (const user of userList) {
        user.contributionsLastCheckedAt = new Date();
        entityManager.persist(user);
      }
  
      // Save new info in the db
      void entityManager.flush();
      logger.info('Successfully polled and saved new PR contributions');
      return;
      
    } catch (error) {
      const errorMessage = 'There was an issue saving contribution data to the database';
      logger.error(errorMessage, error);
    }
};