import 'jest';
import fetchMock from 'fetch-mock-jest';
import { discord, DiscordAccessTokenResponse } from '../../../src/api/auth/discord';
import { testHandler } from '../../testUtils/testHandler';
import logger from '../../../src/logger';
import { env } from '../../../src/env';
import { User } from '../../../src/entities/User';

const testResponse: DiscordAccessTokenResponse = {
  access_token: 'token',
  expires_in: 123435,
  refresh_token: 'refresh_token',
  scope: 'test_scope',
  token_type: 'test_type',
};

const testDiscordUser = {
  id: '12344',
};

const testUser: Partial<User> = {
  githubId: 'githubId',
  discordId: '',
};

const mockSession = {
  passport: {
    user: '12345',
  },
};

const loggerSpy = jest.spyOn(logger, 'error').mockImplementation();

const url = `https://discord.com/api/oauth2/authorize?client_id=${env.discordClientId}&redirect_uri=http://localhost:3000/api/auth/discord/callback&response_type=code&scope=identify`;

describe('Discord', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    fetchMock.mockReset();
  });

  it('/discord/login links to Discord login', async () => {
    await testHandler(discord).get('/discord/login').expect(302).expect('Location', url);
  });

  it('/discord/callback handles an authorization error', async () => {
    const { text } = await testHandler(discord).get('/discord/callback').expect(500);

    expect(text).toEqual('There was an issue authrozing with Discord');
    expect(loggerSpy).toBeCalledTimes(1);
  });

  it('/discord/callback handles a discord user fetch error', async () => {
    const { text } = await testHandler(discord).get('/discord/callback?code=testCode').expect(500);
    fetchMock
      .mock()
      .postOnce('https://discord.com/api/v9/oauth2/token', new Error('Something is broken'));

    expect(text).toEqual('There was an issue getting Discord user information');
    expect(loggerSpy).toBeCalledTimes(1);
  });

  it('/discord/callback calls discord api token endpoint', async () => {
    const expectedPostHeaders = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };

    const expectedGetHeaders = {
      Authorization: `Bearer token`,
    };

    const expectedPostBody = {
      client_id: `${env.discordClientId}`,
      client_secret: `${env.discordSecretId}`,
      grant_type: 'authorization_code',
      code: 'testCod',
      redirect_uri: 'http://localhost:3000/api/auth/discord/callback',
    };

    const handler = testHandler(discord, (req, _res, next) => {
      req.session = mockSession as any;
      req.user = {
        profile: {
          id: mockSession.passport.user,
        },
        githubToken: 'testToken',
      };
      next();
    });

    fetchMock.mock().postOnce('https://discord.com/api/v9/oauth2/token', { body: testResponse });
    fetchMock.mock().getOnce('https://discord.com/api/v8/users/@me', {}, { body: testDiscordUser });
    handler.entityManager.findOne.mockResolvedValueOnce(testUser);
    await handler
      .get('/discord/callback?code=testCod')
      .expect(302)
      .expect('Location', '/app/community');

    expect(fetchMock).toHaveFetched(
      'https://discord.com/api/v9/oauth2/token',
      expect.objectContaining({
        body: expect.objectContaining(expectedPostBody),
        headers: expect.objectContaining(expectedPostHeaders),
      }),
    );

    expect(fetchMock).toHaveFetched(
      'https://discord.com/api/v8/users/@me',
      expect.objectContaining({
        headers: expect.objectContaining(expectedGetHeaders),
      }),
    );

    expect(handler.entityManager.flush).toBeCalledTimes(1);
  });

  it('/discord/callback handles a database user fetch error', async () => {
    const handler = testHandler(discord, (req, _res, next) => {
      req.session = mockSession as any;
      req.user = undefined;
      next();
    });

    fetchMock.mock().postOnce('https://discord.com/api/v9/oauth2/token', { body: testDiscordUser });
    fetchMock.mock().getOnce('https://discord.com/api/v8/users/@me', {}, { body: testResponse });
    handler.entityManager.findOne.mockResolvedValueOnce(null);

    await handler
      .get('/discord/callback?code=testCode')
      .expect(302)
      .expect('Location', '/app/community');

    expect(handler.entityManager.flush).toBeCalledTimes(0);
  });
});
