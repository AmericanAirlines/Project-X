import { Collection } from '@mikro-orm/core';
import { contributions } from '../../src/api/contributions';
import { Contribution } from '../../src/entities/Contribution';
import { User } from '../../src/entities/User';
import logger from '../../src/logger';
import { testHandler } from '../testUtils/testHandler';

const sampleUser: Partial<User> = {
  name: 'Bill Nye',
  pronouns: 'he/him',
  schoolName: 'Science School',
  assign: jest.fn(),
  isAdmin: false,
  githubId: '234234',
  id: '1',
  contributionList: new Collection<Contribution>(this),
};

const sampleUserNoContributionsList: Partial<User> = {
  name: 'Bill Smith',
  pronouns: 'he/him',
  schoolName: 'School',
  assign: jest.fn(),
  isAdmin: false,
  githubId: '0987654321',
  id: '2',
};

const sampleSignedInUser: Express.User = {
  profile: {
    id: 'aaa',
  },
  githubToken: 'abcd123',
};

const mockQueriedUserContributions: Partial<Contribution>[] = [
  {
    nodeID: 'PR_12345',
    description: 'Count from 1 to 5',
    author: sampleUser as User,
    type: 'OPEN',
    score: 1,
    contributedAt: new Date('2011-01-01'),
  },
  {
    nodeID: 'PR_54321',
    description: 'Count from 5 to 1',
    author: sampleUser as User,
    type: 'CLOSED',
    score: 1,
    contributedAt: new Date('2011-01-02'),
  },
  {
    nodeID: 'PR_T4C0B311',
    description: 'yum',
    author: sampleUser as User,
    type: 'OPEN',
    score: 123,
    contributedAt: new Date('2011-01-03'),
  },
];

const loggerSpy = jest.spyOn(logger, 'error').mockImplementation();
const mockGetItems = jest.spyOn(Collection.prototype as Collection<Contribution>, 'getItems');

describe('Contributions API GET route', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
  });

  it('returns a 500 error when find throws an error', async () => {
    const handler = testHandler(contributions, (req, _res, next) => {
      req.user = sampleSignedInUser;
      req.query = { userId: sampleUser.id };
      next();
    });

    handler.entityManager.findOne.mockRejectedValueOnce(new Error(''));

    const { text } = await handler.get('').expect(500);
    expect(text).toEqual('There was an issue retrieving contributions');
    expect(handler.entityManager.findOne).toBeCalledTimes(1);
    expect(loggerSpy).toBeCalledTimes(1);
  });

  it('returns a 404 error when queried user cannot be found', async () => {
    const handler = testHandler(contributions, (req, _res, next) => {
      req.user = sampleSignedInUser;
      req.query = { userId: sampleUser.id };
      next();
    });

    handler.entityManager.findOne.mockResolvedValueOnce(null);
    handler.entityManager.find.mockResolvedValueOnce(mockQueriedUserContributions);

    await handler.get('').expect(404);
    expect(handler.entityManager.findOne).toHaveBeenCalledTimes(1);
    expect(handler.entityManager.find).toHaveBeenCalledTimes(0);
  });

  it('returns a 400 error when no id is entered in query parameters', async () => {
    const handler = testHandler(contributions, (req, _res, next) => {
      req.user = sampleSignedInUser;
      next();
    });

    const { text } = await handler.get('').expect(400);
    expect(text).toEqual("Query parameter 'userId' is required and must be a positive integer");
  });

  it('returns a 400 error when non-numeric userId passed in query parameters', async () => {
    const mockQueryId = 'abc';

    const handler = testHandler(contributions, (req, _res, next) => {
      req.user = sampleSignedInUser;
      req.query = { userId: mockQueryId };
      next();
    });

    const { text } = await handler.get('').expect(400);
    expect(text).toEqual("Query parameter 'userId' is required and must be a positive integer");
  });

  it("successfully returns the current user's contributions", async () => {
    const handler = testHandler(contributions, (req, _res, next) => {
      req.user = sampleSignedInUser;
      req.query = { userId: sampleUser.id };
      next();
    });

    // Deep copy made because the GET route will delete the author from each Contribution in the array
    const mockCopyQueriedUserContributions: Partial<Contribution>[] = JSON.parse(
      JSON.stringify(mockQueriedUserContributions),
    );

    handler.entityManager.findOne.mockResolvedValueOnce(sampleUser);
    mockGetItems.mockReturnValue(mockCopyQueriedUserContributions as Contribution[]);

    const { body } = await handler.get('').expect(200);
    expect(body).toEqual(mockCopyQueriedUserContributions);
    expect(handler.entityManager.findOne).toHaveBeenCalledTimes(1);
    expect(mockGetItems).toHaveBeenCalledTimes(1);
  });

  it("returns an empty array if the user's contributions list is undefined", async () => {
    const handler = testHandler(contributions, (req, _res, next) => {
      req.user = sampleSignedInUser;
      req.query = { userId: sampleUser.id };
      next();
    });

    handler.entityManager.findOne.mockResolvedValueOnce(sampleUserNoContributionsList);

    const { body } = await handler.get('').expect(200);
    expect(body).toEqual([]);
    expect(handler.entityManager.findOne).toHaveBeenCalledTimes(1);
  });

  it('returns a 401 error when no logged in user', async () => {
    const handler = testHandler(contributions);
    await handler.get('').expect(401);
  });
});
