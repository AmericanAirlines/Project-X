import fetchMock from 'fetch-mock-jest';
import { contributions } from '../../src/api/contributions';
import { Contribution } from '../../src/entities/Contribution';
import logger from '../../src/logger';
import { testHandler } from '../testUtils/testHandler';

const loggerSpy = jest.spyOn(logger, 'error').mockImplementation();

const mockAllContibutions = [
  {
    nodeID: 'PR_00000',
    description: 'Pizza but a construct of the mind',
    type: 'CLOSED',
    score: 1,
    contributedAt: '1612-04-20',
  },
  {
    nodeID: 'PR_12345',
    description: 'Count from 1 to 5',
    type: 'OPEN',
    score: 1,
    contributedAt: '2011-01-01',
  },
  {
    nodeID: 'PR_54321',
    description: 'Count from 5 to 1',
    type: 'CLOSED',
    score: 1,
    contributedAt: '2022-12-1',
  },
  {
    nodeID: 'PR_T4C0B311',
    description: 'yum',
    type: 'OPEN',
    score: 123,
    contributedAt: '1962-03-22',
  },
];

const mockCurrentUserContibutions = [
  {
    nodeID: 'PR_12345',
    description: 'Count from 1 to 5',
    type: 'OPEN',
    score: 1,
    contributedAt: '2011-01-01',
  },
  {
    nodeID: 'PR_54321',
    description: 'Count from 5 to 1',
    type: 'CLOSED',
    score: 1,
    contributedAt: '2022-12-1',
  },
  {
    nodeID: 'PR_T4C0B311',
    description: 'yum',
    type: 'OPEN',
    score: 123,
    contributedAt: '1962-03-22',
  },
];

const mockFetchRes = {
  data: {
    nodes: [
      {
        id: 'PR_00000',
        viewerDidAuthor: false,
      },
      {
        id: 'PR_12345',
        viewerDidAuthor: true,
      },
      {
        id: 'PR_54321',
        viewerDidAuthor: true,
      },
      {
        id: 'PR_T4C0B311',
        viewerDidAuthor: true,
      },
    ],
  },
};

describe('Contributions API GET route', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    fetchMock.reset();
  });

  it('Error during find returns 500 error', async () => {
    const handler = testHandler(contributions, (req, _res, next) => {
      req.user = { githubToken: 'abcd123', profile: { id: 'aaa' } };
      next();
    });

    handler.entityManager.find.mockRejectedValueOnce(new Error(''));

    const { text } = await handler.get('/').expect(500);
    expect(text).toEqual('There was an issue returning the contributions.');
    expect(loggerSpy).toBeCalledTimes(1);
  });

  it("Successfully return list of current user's contributions", async () => {
    const handler = testHandler(contributions, (req, _res, next) => {
      req.user = { githubToken: 'abcd123', profile: { id: 'aaa' } };
      next();
    });

    handler.entityManager.find.mockResolvedValueOnce(mockAllContibutions);
    fetchMock.post('https://api.github.com/graphql', JSON.stringify(mockFetchRes));
    handler.entityManager.find.mockResolvedValueOnce(mockCurrentUserContibutions);

    const { body } = await handler.get('').expect(200);
    expect(body).toEqual(mockCurrentUserContibutions);
    expect(fetchMock).toHaveFetchedTimes(1);
    expect(handler.entityManager.find).toHaveBeenCalledTimes(2);
  });

  it('401 Unauthorized Access', async () => {
    const handler = testHandler(contributions);

    fetchMock.post('https://api.github.com/graphql', {});
    const { text } = await handler.get('/').expect(401);

    expect(text).toEqual('You must be logged in to view your contributions.');
    expect(fetchMock).toHaveFetchedTimes(0);
  });
});
