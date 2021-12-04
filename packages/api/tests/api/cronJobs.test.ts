import { EntityManager } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { contributionPoll } from '../../src/cronJobs';
import { Project } from '../../src/entities/Project';
import { User } from '../../src/entities/User';
import logger from '../../src/logger';
import * as searchForContributions from '../../src/utils/github/searchForContributions';
import { PullRequestContribution } from '../../src/utils/github/searchForContributions';
import { testHandler } from '../testUtils/testHandler';

const loggerErrorSpy = jest.spyOn(logger, 'error').mockImplementation();
const loggerInfoSpy = jest.spyOn(logger, 'info').mockImplementation();

const sampleUser1: Partial<User> = {
  name: 'BatMan',
  pronouns: 'he/him',
  schoolName: 'Gotham Private',
  assign: jest.fn(),
  githubUsername: 'BruceWayne',
  githubId: '123454',
};

const sampleUser2: Partial<User> = {
  name: 'CatWoman',
  pronouns: 'she/her',
  schoolName: 'School of Gifted Cats',
  assign: jest.fn(),
  githubUsername: 'SalenaKyle',
  githubId: '323444',
};

const sampleProject1: Partial<Project> = {
  nodeID: 'aosidnqown21',
};

const sampleProject2: Partial<Project> = {
  nodeID: '54343nt3ljn=',
};

const prContribution1: PullRequestContribution = {
  id: '1asas',
  title: 'contribution1',
  permalink: 'www.con1.com',
  mergedAt: '10-10-2020',
  author: {
    login: 'BruceWayne',
  },
};

const prContribution2: PullRequestContribution = {
  id: '2dwdi',
  title: 'contribution2',
  permalink: 'www.con2.com',
  mergedAt: '10-11-2020',
  author: {
    login: 'BruceWayne',
  },
};

const prContribution3: PullRequestContribution = {
  id: '3pppp',
  title: 'contribution3',
  permalink: 'www.con3.com',
  mergedAt: '10-11-2020',
  author: {
    login: 'SalenaKyle',
  },
};

const unknownUserContribution: PullRequestContribution = {
  id: '234rfwsef',
  title: 'contribution4',
  permalink: 'www.con4.com',
  mergedAt: '10-11-2020',
  author: {
    login: 'BarryAllen',
  },
};

describe('contributionPoll', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
  });

  it('persists the expected contributions and updates the checked users when all new contributions are found', async () => {
    const handler = testHandler();
    const contributions = [
      prContribution1,
      prContribution2,
      prContribution3,
    ] as PullRequestContribution[];

    handler.entityManager.find.mockResolvedValueOnce([sampleUser1, sampleUser2]);
    handler.entityManager.find.mockResolvedValueOnce([sampleProject1, sampleProject2]);
    jest
      .spyOn(searchForContributions, 'searchForContributions')
      .mockResolvedValueOnce(contributions);

    // find contributions calls
    handler.entityManager.count.mockResolvedValueOnce(0);
    handler.entityManager.count.mockResolvedValueOnce(0);
    handler.entityManager.count.mockResolvedValueOnce(0);

    await contributionPoll(handler.entityManager as unknown as EntityManager<PostgreSqlDriver>);

    expect(handler.entityManager.persist).toBeCalledWith(sampleUser1);
    expect(handler.entityManager.persist).toBeCalledWith(sampleUser2);
    expect(handler.entityManager.count).toBeCalledTimes(3);
    expect(handler.entityManager.persist).toBeCalledTimes(5);
    expect(handler.entityManager.find).toBeCalledTimes(2);
    expect(handler.entityManager.flush).toBeCalledTimes(1);
  });

  it('does not persists duplicate contributions and still updates all users', async () => {
    const handler = testHandler();
    const contributions = [
      prContribution1,
      prContribution2,
      prContribution3,
    ] as PullRequestContribution[];

    handler.entityManager.find.mockResolvedValueOnce([sampleUser1, sampleUser2]);
    handler.entityManager.find.mockResolvedValueOnce([sampleProject1, sampleProject2]);
    jest
      .spyOn(searchForContributions, 'searchForContributions')
      .mockResolvedValueOnce(contributions);

    // find contributions calls
    handler.entityManager.count.mockResolvedValueOnce(0);
    handler.entityManager.count.mockResolvedValueOnce(1); // Duplicate found
    handler.entityManager.count.mockResolvedValueOnce(0);

    await contributionPoll(handler.entityManager as unknown as EntityManager<PostgreSqlDriver>);

    expect(handler.entityManager.persist).toBeCalledWith(sampleUser1);
    expect(handler.entityManager.persist).toBeCalledWith(sampleUser2);
    expect(handler.entityManager.count).toBeCalledTimes(3);
    expect(handler.entityManager.persist).toBeCalledTimes(4);
    expect(handler.entityManager.find).toBeCalledTimes(2);
    expect(handler.entityManager.flush).toBeCalledTimes(1);
  });

  it('handles finding a contribution for a user not in our list of users to be checked', async () => {
    const handler = testHandler();
    const contributions = [
      prContribution1,
      prContribution2,
      unknownUserContribution,
    ] as PullRequestContribution[];

    handler.entityManager.find.mockResolvedValueOnce([sampleUser1, sampleUser2]);
    handler.entityManager.find.mockResolvedValueOnce([sampleProject1, sampleProject2]);
    jest
      .spyOn(searchForContributions, 'searchForContributions')
      .mockResolvedValueOnce(contributions);

    // find contributions calls
    handler.entityManager.count.mockResolvedValueOnce(0);
    handler.entityManager.count.mockResolvedValueOnce(0);
    handler.entityManager.count.mockResolvedValueOnce(0);

    await contributionPoll(handler.entityManager as unknown as EntityManager<PostgreSqlDriver>);

    expect(handler.entityManager.persist).toBeCalledWith(sampleUser1);
    expect(handler.entityManager.persist).toBeCalledWith(sampleUser2);
    expect(handler.entityManager.count).toBeCalledTimes(3);
    expect(handler.entityManager.persist).toBeCalledTimes(4);
    expect(handler.entityManager.find).toBeCalledTimes(2);
    expect(handler.entityManager.flush).toBeCalledTimes(1);
  });

  it('handles having no users to check properly', async () => {
    const handler = testHandler();
    handler.entityManager.find.mockResolvedValueOnce([]);

    await contributionPoll(handler.entityManager as unknown as EntityManager<PostgreSqlDriver>);

    expect(handler.entityManager.find).toBeCalledTimes(1);
    expect(handler.entityManager.flush).toBeCalledTimes(0);
    expect(loggerInfoSpy).toHaveBeenCalledTimes(1);
    expect(loggerInfoSpy).toHaveBeenCalledWith('No users need to have their contributions updated');
    expect(loggerErrorSpy).toHaveBeenCalledTimes(0);
  });

  it('handles having no projects to check properly', async () => {
    const handler = testHandler();

    handler.entityManager.find.mockResolvedValueOnce([sampleUser1, sampleUser2]);
    handler.entityManager.find.mockResolvedValueOnce([]);

    await contributionPoll(handler.entityManager as unknown as EntityManager<PostgreSqlDriver>);

    expect(handler.entityManager.find).toBeCalledTimes(2);
    expect(handler.entityManager.flush).toBeCalledTimes(0);
    expect(loggerInfoSpy).toHaveBeenCalledTimes(1);
    expect(loggerInfoSpy).toHaveBeenCalledWith('No projects found for contribution polling');
    expect(loggerErrorSpy).toHaveBeenCalledTimes(0);
  });

  it('handles a thrown error properly', async () => {
    const handler = testHandler();
    const error = new Error('test Error');
    handler.entityManager.find.mockResolvedValueOnce([sampleUser1, sampleUser2]);
    handler.entityManager.find.mockRejectedValueOnce(error);

    await contributionPoll(handler.entityManager as unknown as EntityManager<PostgreSqlDriver>);

    expect(handler.entityManager.find).toBeCalledTimes(2);
    expect(handler.entityManager.flush).toBeCalledTimes(0);
    expect(loggerInfoSpy).toHaveBeenCalledTimes(0);
    expect(loggerErrorSpy).toHaveBeenCalledTimes(1);
    expect(loggerErrorSpy).toHaveBeenCalledWith(
      'There was an issue saving contribution data to the database',
      error,
    );
  });
});
