import { users } from '../../src/api/users';
import { User } from '../../src/entities/User';
import logger from '../../src/logger';
import { testHandler } from '../testUtils/testHandler';

interface MockPartialUser {
  name: string;
  pronouns: string;
  schoolName: string;
}

interface UpdatePartialUser {
  name: string;
  pronouns: string;
}

const sampleUser: MockPartialUser = {
  name: 'Bill Nye',
  pronouns: 'he/him',
  schoolName: 'Science School',
};

const loggerSpy = jest.spyOn(logger, 'error').mockImplementation();

describe('/users', () => {
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

    expect(body).toEqual(sampleUser);
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

describe('/users/:userId', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
  });

  it('non-numeric input returns 400 error while editing user', async () => {
    const handler = testHandler(users);
    handler.entityManager.findOne.mockReset();
    const { text } = await handler.patch('/abc').send({
      name: 'Bill Nye',
      pronouns: 'he/him',
      schoolName: 'Science School',
    });
    expect(text).toEqual('"abc" is not a valid id, it must be a number.');
  });

  it('successfully edits a user', async () => {
    const handler = testHandler(users);

    const userToModify: MockPartialUser = {
      name: 'Bill Nye',
      pronouns: 'he/him',
      schoolName: 'Science School',
    };

    const patchContent: UpdatePartialUser = {
      name: 'Will Bye',
      pronouns: 'she/her',
    };

    handler.entityManager.findOne.mockResolvedValue(userToModify);

    // const {body}  = await handler.patch('/0').send({
    //   name: 'Will Bye',
    //   pronouns: 'she/her',
    // });

    const { body } = await handler.patch('/0').send(patchContent);

    expect(body).toEqual({
      name: 'Will Bye',
      pronouns: 'she/her',
      schoolName: 'Science School',
    });

    expect(body.name).toEqual('Will Bye');
    expect(body.pronouns).toEqual('she/her');

    expect(handler.entityManager.flush).toHaveBeenCalled();

    expect(handler.entityManager.findOne).toHaveBeenCalledWith(User, { id: '0' });
  });
});
