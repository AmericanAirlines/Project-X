import { contributions } from '../../src/api/contributions';
import { Contribution } from '../../src/entities/Contribution';
import { User } from '../../src/entities/User';
import logger from '../../src/logger';
import { testHandler } from '../testUtils/testHandler';

const loggerSpy = jest.spyOn(logger, 'error').mockImplementation();

const mockQueriedUserContibutions = [
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

const sampleUser: Partial<User> = {
  name: 'Bill Nye',
  pronouns: 'he/him',
  schoolName: 'Science School',
  assign: jest.fn(),
  isAdmin: false,
  githubId: '234234',
  id: '1',
};

const sampleSignedInUser: Express.User = {
  profile: {
    id: 'aaa',
  },
  githubToken: 'abcd123',
};

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

    handler.entityManager.findOne.mockResolvedValueOnce(sampleUser);
    handler.entityManager.find.mockRejectedValueOnce(new Error(''));

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
    handler.entityManager.find.mockResolvedValueOnce(mockQueriedUserContibutions);

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
    expect(text).toEqual('No user id was given.');
  });

  it('returns a 400 error when non-numeric userId passed in query parameters', async () => {
    const mockQueryId = 'abc';

    const handler = testHandler(contributions, (req, _res, next) => {
      req.user = sampleSignedInUser;
      req.query = { userId: mockQueryId };
      next();
    });

    const { text } = await handler.get('').expect(400);
    expect(text).toEqual(`"${mockQueryId}" is not a valid id, it must be a number.`);
  });

  it("successfully returns the current user's contributions", async () => {
    const handler = testHandler(contributions, (req, _res, next) => {
      req.user = sampleSignedInUser;
      req.query = { userId: sampleUser.id };
      next();
    });

    handler.entityManager.findOne.mockResolvedValueOnce(sampleUser);
    handler.entityManager.find.mockResolvedValueOnce(mockQueriedUserContibutions);

    const { body } = await handler.get('').expect(200);
    expect(body).toEqual(mockQueriedUserContibutions);
    expect(handler.entityManager.findOne).toHaveBeenCalledTimes(1);
    expect(handler.entityManager.find).toHaveBeenCalledTimes(1);
  });

  it('returns a 401 error when no logged in user', async () => {
    const handler = testHandler(contributions);
    await handler.get('').expect(401);
  });
});
