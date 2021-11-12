import { currentUser } from '../../src/api/currentUser';
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
};

const loggerSpy = jest.spyOn(logger, 'error').mockImplementation();

describe('currentUser API GET route', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
  });

  it('successfully returns a user', async () => {
    const handler = testHandler(currentUser, (req, _res, next) => {
      req.user = { githubToken: 'abcd123', profile: { id: 'aaa' } };
      next();
    });

    handler.entityManager.findOne.mockResolvedValueOnce(sampleUser);

    const { body } = await handler.get('').expect(200);

    const { assign, ...retrievedUser } = sampleUser;

    expect(body).toEqual(retrievedUser);
    expect(handler.entityManager.findOne).toHaveBeenCalledWith(User, { githubId: 'aaa' });
  });

  it('non-existant user returns 401', async () => {
    const handler = testHandler(currentUser);
    handler.entityManager.findOne.mockResolvedValueOnce(null);

    await handler.get('').expect(401);
  });

  it('database user not found returns 404', async () => {
    const handler = testHandler(currentUser, (req, _res, next) => {
      req.user = { githubToken: 'abcd123', profile: { id: 'aaa' } };
      next();
    });
    handler.entityManager.findOne.mockResolvedValueOnce(null);

    await handler.get('').expect(404);
  });

  it('returns 500 error while retreiving user', async () => {
    const handler = testHandler(currentUser, (req, _res, next) => {
      req.user = { githubToken: 'abcd123', profile: { id: 'aaa' } };
      next();
    });
    handler.entityManager.findOne.mockRejectedValueOnce(new Error('Error has occurred'));

    const { text } = await handler.get('').expect(500);
    expect(text).toEqual('There was an issue getting current user');

    expect(loggerSpy).toBeCalledTimes(1);
  });
});
