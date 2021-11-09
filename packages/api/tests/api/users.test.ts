import { users } from '../../src/api/users';
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

describe('users API GET route', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
  });

  it('non-numeric input returns 400 error while retreiving user', async () => {
    const handler = testHandler(users);

    const { text } = await handler.get('/abc').expect(400);
    expect(text).toEqual('"abc" is not a valid id, it must be a number.');
  });

  it('successfully returns a user', async () => {
    const handler = testHandler(users);
    handler.entityManager.findOne.mockResolvedValueOnce(sampleUser);

    const { body } = await handler.get('/0').expect(200);

    const { assign, ...retrievedUser } = sampleUser;

    expect(body).toEqual(retrievedUser);
    expect(handler.entityManager.findOne).toHaveBeenCalledWith(User, { id: '0' });
  });

  it('non-existant user returns 404', async () => {
    const handler = testHandler(users);
    handler.entityManager.findOne.mockResolvedValueOnce(null);

    await handler.get('/1').expect(404);
  });

  it('returns 500 error while retreiving user', async () => {
    const handler = testHandler(users);
    handler.entityManager.findOne.mockRejectedValueOnce(new Error('Error has occurred'));

    const { text } = await handler.get('/0').expect(500);
    expect(text).toEqual('There was an issue getting user "0"');

    expect(loggerSpy).toBeCalledTimes(1);
  });
});

describe('users API PATCH route', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
  });

  it('non-numeric input returns 400 error while editing user', async () => {
    const handler = testHandler(users, (req, _res, next) => {
      req.user = { githubToken: 'abcd123', profile: { id: 'aaa' } };
      next();
    });
    handler.entityManager.findOne.mockReset();
    const { text } = await handler.patch('/abc').send({
      name: 'Bill Nye',
      pronouns: 'he/him',
      schoolName: 'Science School',
    });
    expect(text).toEqual('"abc" is not a valid id, it must be a number.');
  });

  it('non-existant user returns 404 while editing user', async () => {
    const handler = testHandler(users, (req, _res, next) => {
      req.user = { githubToken: 'abcd123', profile: { id: 'aaa' } };
      next();
    });
    handler.entityManager.findOne.mockResolvedValueOnce(null);

    await handler.patch('/1').expect(404);
  });

  it('returns 500 error while editing user', async () => {
    const handler = testHandler(users, (req, _res, next) => {
      req.user = { githubToken: 'abcd123', profile: { id: 'aaa' } };
      next();
    });

    handler.entityManager.findOne.mockResolvedValueOnce(sampleUser);
    handler.entityManager.findOne.mockRejectedValueOnce(new Error('Error has occurred'));

    const { text } = await handler.patch('/0').expect(500);
    expect(text).toEqual('There was an issue updating user "0"');

    expect(loggerSpy).toBeCalledTimes(1);
  });

  it('successfully edits a user as non admin', async () => {
    const handler = testHandler(users, (req, _res, next) => {
      req.user = { githubToken: 'abcd123', profile: { id: 'aaa' } };
      next();
    });
    let callIndex = 0;
    let assignTimestamp: number | undefined;
    let flushTimestamp: number | undefined;

    const userToModify: Partial<User> = {
      name: 'Bill Nye',
      pronouns: 'he/him',
      schoolName: 'Science School',
      isAdmin: false,
      assign: jest.fn(() => {
        assignTimestamp = callIndex;
        callIndex += 1;
      }) as any,
    };

    const patchContent: Partial<User> = {
      name: 'Will Bye',
      pronouns: 'she/her',
      location: 'Dallas',
    };

    handler.entityManager.findOne.mockResolvedValue(userToModify);

    handler.entityManager.flush.mockImplementationOnce(async () => {
      flushTimestamp = callIndex;
      callIndex += 1;
    });

    await handler.patch('/0').send(patchContent).expect(200);

    const { location, ...expectedPatch } = patchContent;

    expect(userToModify.assign).toHaveBeenCalledWith(expectedPatch);

    expect(handler.entityManager.flush).toHaveBeenCalled();

    expect(flushTimestamp).toBeGreaterThan(assignTimestamp ?? Infinity);

    expect(handler.entityManager.findOne).toHaveBeenCalledWith(User, { id: '0' });
  });

  it('successfully edits a user as admin', async () => {
    const handler = testHandler(users, (req, _res, next) => {
      req.user = { githubToken: 'abcd123', profile: { id: 'aaa' } };
      next();
    });
    let callIndex = 0;
    let assignTimestamp: number | undefined;
    let flushTimestamp: number | undefined;

    const userToModify: Partial<User> = {
      name: 'Bill Nye',
      pronouns: 'he/him',
      schoolName: 'Science School',
      isAdmin: true,
      assign: jest.fn(() => {
        assignTimestamp = callIndex;
        callIndex += 1;
      }) as any,
    };

    const patchContent: Partial<User> = {
      name: 'Will Bye',
      pronouns: 'she/her',
      location: 'Dallas',
      isAdmin: false,
    };

    handler.entityManager.findOne.mockResolvedValue(userToModify);

    handler.entityManager.flush.mockImplementationOnce(async () => {
      flushTimestamp = callIndex;
      callIndex += 1;
    });

    await handler.patch('/0').send(patchContent).expect(200);

    const { location, ...expectedPatch } = patchContent;

    expect(userToModify.assign).toHaveBeenCalledWith(expectedPatch);

    expect(handler.entityManager.flush).toHaveBeenCalled();

    expect(flushTimestamp).toBeGreaterThan(assignTimestamp ?? Infinity);

    expect(handler.entityManager.findOne).toHaveBeenCalledWith(User, { id: '0' });
  });

  it('returns 403 when user edits another user', async () => {
    const handler = testHandler(users, (req, _res, next) => {
      req.user = { githubToken: 'abcd123', profile: { id: 'aaa' } };
      next();
    });

    const userToModify: Partial<User> = {
      name: 'Bill Nye',
      pronouns: 'he/him',
      schoolName: 'Science School',
      isAdmin: true,
    };

    handler.entityManager.findOne.mockResolvedValueOnce(userToModify);
    handler.entityManager.findOne.mockResolvedValueOnce({});

    await handler.patch('/0').expect(403);
  });

  it('401 when not logged in', async () => {
    const handler = testHandler(users);

    await handler.patch('/0').expect(401);

    expect(handler.entityManager.findOne).toHaveBeenCalledTimes(0);
    expect(handler.entityManager.flush).toHaveBeenCalledTimes(0);
  });
});
