import fetchMock from 'fetch-mock-jest';
import { contributions } from '../../src/api/contributions';
import { Contribution } from '../../src/entities/Contribution';
import { Project } from '../../src/entities/Project';
import { User } from '../../src/entities/User';
import logger from '../../src/logger';
import { testHandler } from '../testUtils/testHandler';

jest.mock('../../src/api/contributions', () => ({
  ...jest.requireActual('../../src/api/contributions'),
  buildDateQuery: jest.fn(),
  buildProjectsQuery: jest.fn(),
  buildQueryString: jest.fn(),
  buildUsersQuery: jest.fn(),
}));

const loggerSpy = jest.spyOn(logger, 'error').mockImplementation();

const sampleUser1: Partial<User> = {
  name: 'BruceWayne',
  pronouns: 'he/him',
  schoolName: 'Gotham Private',
  assign: jest.fn(),
  githubUsername: 'BatMan',
  githubId: '123454',
};

const sampleUser2: Partial<User> = {
  name: 'SalenaKyle',
  pronouns: 'she/her',
  schoolName: 'School of Gifted Cats',
  assign: jest.fn(),
  githubUsername: 'CatWoman',
  githubId: '323444',
};

const sampleContribution: Partial<Contribution> = {
  nodeID: 'testContribution',
};

const sampleProject1: Partial<Project> = {
  nodeID: 'aosidnqown21',
};

const sampleProject2: Partial<Project> = {
  nodeID: '54343nt3ljn=',
};

const repositoryResponse = {
  data: {
    nodes: [
      {
        id: '12wq',
        nameWithOwner: 'Gotham/PoliceScanner',
      },
      {
        id: '35ge',
        nameWithOwner: 'Gotham/JailCell',
      },
    ],
  },
};

const emptyRepositoryResponse = {
  data: {
    nodes: [],
  },
};

const contributionResponse = {
  data: {
    search: {
      pageInfo: {
        hasNextPage: false,
        endCursor: '121',
      },
      nodes: [
        {
          id: '1asas',
          title: 'contribution1',
          permalink: 'www.con1.com',
          mergedAt: '10-10-2020',
          author: {
            login: 'BruceWayne',
          },
        },
        {
          id: '2dwdi',
          title: 'contribution2',
          permalink: 'www.con2.com',
          mergedAt: '10-11-2020',
          author: {
            login: 'BruceWayne',
          },
        },
        {
          id: '3pppp',
          title: 'contribution3',
          permalink: 'www.con3.com',
          mergedAt: '10-11-2020',
          author: {
            login: 'SalenaKyle',
          },
        },
      ],
    },
  },
};

const contributionMultiPageResponse1 = {
  data: {
    search: {
      pageInfo: {
        hasNextPage: true,
        endCursor: '121',
      },
      nodes: [
        {
          id: '1asas',
          title: 'contribution1',
          permalink: 'www.con1.com',
          mergedAt: '10-10-2020',
          author: {
            login: 'BruceWayne',
          },
        },
        {
          id: '2dwdi',
          title: 'contribution2',
          permalink: 'www.con2.com',
          mergedAt: '10-11-2020',
          author: {
            login: 'BruceWayne',
          },
        },
      ],
    },
  },
};

const contributionMultiPageResponse2 = {
  data: {
    search: {
      pageInfo: {
        hasNextPage: false,
        endCursor: '10p',
      },
      nodes: [
        {
          id: '3pppp',
          title: 'contribution3',
          permalink: 'www.con3.com',
          mergedAt: '10-11-2020',
          author: {
            login: 'SalenaKyle',
          },
        },
      ],
    },
  },
};

const emptyContributionResponse = {
  data: {
    search: {
      pageInfo: {
        hasNextPage: false,
        endCursor: null,
      },
      nodes: [],
    },
  },
};

describe('/contributions API GET route', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    fetchMock.reset();
  });

  it('successfully saves contributions when a single page is returned', async () => {
    const handler = testHandler(contributions);

    handler.entityManager.find.mockResolvedValueOnce([sampleUser1, sampleUser2]);
    handler.entityManager.find.mockResolvedValueOnce([sampleProject1, sampleProject2]);

    // find contributions calls
    handler.entityManager.find.mockResolvedValueOnce([]);
    handler.entityManager.find.mockResolvedValueOnce([]);
    handler.entityManager.find.mockResolvedValueOnce([]);

    // get user ids calls
    handler.entityManager.findOne.mockResolvedValueOnce(sampleUser1);
    handler.entityManager.findOne.mockResolvedValueOnce(sampleUser1);
    handler.entityManager.findOne.mockResolvedValueOnce(sampleUser2);

    fetchMock.postOnce('https://api.github.com/graphql', repositoryResponse);
    fetchMock.postOnce('https://api.github.com/graphql', contributionResponse, {
      overwriteRoutes: false,
    });

    await handler.get('').expect(200);

    expect(handler.entityManager.findOne).toHaveBeenCalledWith(User, {
      githubUsername: { $eq: sampleUser1.name },
    });
    expect(handler.entityManager.findOne).toHaveBeenCalledWith(User, {
      githubUsername: { $eq: sampleUser2.name },
    });

    expect(handler.entityManager.persist).toBeCalledWith(sampleUser1);
    expect(handler.entityManager.persist).toBeCalledWith(sampleUser2);
    expect(handler.entityManager.persist).toBeCalledTimes(5);
    expect(handler.entityManager.flush).toBeCalledTimes(1);
  });

  it('successfully saves contributions when multiple pages are returned', async () => {
    const handler = testHandler(contributions);

    handler.entityManager.find.mockResolvedValueOnce([sampleUser1, sampleUser2]);
    handler.entityManager.find.mockResolvedValueOnce([sampleProject1, sampleProject2]);

    // find contributions calls
    handler.entityManager.find.mockResolvedValueOnce([]);
    handler.entityManager.find.mockResolvedValueOnce([]);
    handler.entityManager.find.mockResolvedValueOnce([]);

    // get user ids calls
    handler.entityManager.findOne.mockResolvedValueOnce(sampleUser1);
    handler.entityManager.findOne.mockResolvedValueOnce(sampleUser1);
    handler.entityManager.findOne.mockResolvedValueOnce(sampleUser2);

    fetchMock.postOnce('https://api.github.com/graphql', repositoryResponse);
    fetchMock.postOnce('https://api.github.com/graphql', contributionMultiPageResponse1, {
      overwriteRoutes: false,
    });
    fetchMock.postOnce('https://api.github.com/graphql', contributionMultiPageResponse2, {
      overwriteRoutes: false,
    });

    await handler.get('').expect(200);

    expect(handler.entityManager.findOne).toHaveBeenCalledWith(User, {
      githubUsername: { $eq: sampleUser1.name },
    });
    expect(handler.entityManager.findOne).toHaveBeenCalledWith(User, {
      githubUsername: { $eq: sampleUser2.name },
    });

    expect(handler.entityManager.persist).toBeCalledWith(sampleUser1);
    expect(handler.entityManager.persist).toBeCalledWith(sampleUser2);
    expect(handler.entityManager.persist).toBeCalledTimes(5);
    expect(handler.entityManager.flush).toBeCalledTimes(1);
  });

  it('does not save new contribution when contribution already exist', async () => {
    const handler = testHandler(contributions);

    handler.entityManager.find.mockResolvedValueOnce([sampleUser1, sampleUser2]);
    handler.entityManager.find.mockResolvedValueOnce([sampleProject1, sampleProject2]);

    // find contributions calls
    handler.entityManager.find.mockResolvedValueOnce([sampleContribution]);
    handler.entityManager.find.mockResolvedValueOnce([]);
    handler.entityManager.find.mockResolvedValueOnce([]);

    // get user ids calls
    handler.entityManager.findOne.mockResolvedValueOnce(sampleUser1);
    handler.entityManager.findOne.mockResolvedValueOnce(sampleUser1);
    handler.entityManager.findOne.mockResolvedValueOnce(sampleUser2);

    fetchMock.postOnce('https://api.github.com/graphql', repositoryResponse);
    fetchMock.postOnce('https://api.github.com/graphql', contributionResponse, {
      overwriteRoutes: false,
    });

    await handler.get('').expect(200);

    expect(handler.entityManager.persist).toBeCalledWith(sampleUser1);
    expect(handler.entityManager.persist).toBeCalledWith(sampleUser2);
    expect(handler.entityManager.persist).toBeCalledTimes(4);
    expect(handler.entityManager.flush).toBeCalledTimes(1);
  });

  it('does not save contribution when user does not exist', async () => {
    const handler = testHandler(contributions);

    handler.entityManager.find.mockResolvedValueOnce([sampleUser1, sampleUser2]);
    handler.entityManager.find.mockResolvedValueOnce([sampleProject1, sampleProject2]);

    // find known contributions calls
    handler.entityManager.find.mockResolvedValueOnce([]);
    handler.entityManager.find.mockResolvedValueOnce([]);
    handler.entityManager.find.mockResolvedValueOnce([]);

    // get user ids calls
    handler.entityManager.findOne.mockResolvedValueOnce(null);
    handler.entityManager.findOne.mockResolvedValueOnce(null);
    handler.entityManager.findOne.mockResolvedValueOnce(sampleUser2);

    fetchMock.postOnce('https://api.github.com/graphql', repositoryResponse);
    fetchMock.postOnce('https://api.github.com/graphql', contributionResponse, {
      overwriteRoutes: false,
    });

    await handler.get('').expect(200);

    expect(handler.entityManager.persist).toBeCalledWith(sampleUser1);
    expect(handler.entityManager.persist).toBeCalledWith(sampleUser2);
    expect(handler.entityManager.flush).toBeCalledTimes(1);
  });

  it('returns when no users need to be updated', async () => {
    const handler = testHandler(contributions);

    handler.entityManager.find.mockResolvedValueOnce([]);

    await handler.get('').expect(200);
  });

  it('returns when no projects are found', async () => {
    const handler = testHandler(contributions);

    handler.entityManager.find.mockResolvedValueOnce([sampleUser1, sampleUser2]);
    handler.entityManager.find.mockResolvedValueOnce([]);

    fetchMock.postOnce('https://api.github.com/graphql', emptyRepositoryResponse);
    fetchMock.postOnce('https://api.github.com/graphql', emptyContributionResponse, {
      overwriteRoutes: false,
    });

    await handler.get('').expect(200);

    expect(handler.entityManager.persist).toBeCalledWith(sampleUser1);
    expect(handler.entityManager.persist).toBeCalledWith(sampleUser2);
    expect(handler.entityManager.flush).toBeCalledTimes(1);
  });

  it('handles a thrown error correctly', async () => {
    const handler = testHandler(contributions);

    handler.entityManager.find.mockResolvedValueOnce([sampleUser1, sampleUser2]);
    handler.entityManager.find.mockResolvedValueOnce([]);

    fetchMock.postOnce('https://api.github.com/graphql', { errors: { status: 500 } });

    await handler.get('').expect(500);
    expect(loggerSpy).toBeCalledTimes(1);
  });
});
