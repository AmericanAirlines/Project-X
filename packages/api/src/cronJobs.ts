import { EntityManager } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { DateTime } from 'luxon';
import { Contribution } from './entities/Contribution';
import { Project } from './entities/Project';
import { User } from './entities/User';
import logger from './logger';
import { searchForContributions } from './utils/github/searchForContributions';

export const contributionPoll = async (entityManager: EntityManager<PostgreSqlDriver>) => {
  try {
    const upperBoundDate = DateTime.now();

    const lastCheckedThreshold = upperBoundDate.minus({ hours: 6 });

    const userList = await entityManager.find(User, {
      contributionsLastCheckedAt: { $lt: lastCheckedThreshold.toJSDate() },
    });

    if (userList.length === 0) {
      logger.info('No users need to have their contributions updated');
      return;
    }

    const projectList = await entityManager.find(Project, {});

    if (projectList.length === 0) {
      logger.info('No projects found for contribution polling');
      return;
    }

    const lastCheckedTimes = userList.map((u) => DateTime.fromJSDate(u.contributionsLastCheckedAt));

    const lowerBoundDate = DateTime.min(...lastCheckedTimes);

    for (const contribution of await searchForContributions(
      projectList,
      lowerBoundDate,
      upperBoundDate,
      userList,
    )) {
      // Only Add new contributions
      if (!(await entityManager.count(Contribution, { nodeID: { $eq: contribution.id } }))) {
        const user = userList.find((u) => u.githubUsername === contribution.author.login);

        if (user) {
          const newContribution = new Contribution({
            nodeID: contribution.id,
            authorGithubId: user.githubId,
            type: 'Pull Request',
            description: contribution.title,
            contributedAt: new Date(Date.parse(contribution.mergedAt)),
            score: 100,
          });
          entityManager.persist(newContribution);
        }
      }
    }

    for (const user of userList) {
      user.contributionsLastCheckedAt = upperBoundDate.toJSDate();
      entityManager.persist(user);
    }

    // Save new info in the db
    await entityManager.flush();
    logger.info('Successfully polled and saved new PR contributions');
    return;
  } catch (error) {
    const errorMessage = 'There was an issue saving contribution data to the database';
    logger.error(errorMessage, error);
  }
};
