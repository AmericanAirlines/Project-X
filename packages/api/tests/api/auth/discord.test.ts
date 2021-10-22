import 'jest';
import axios from 'axios';
import { discord, DiscordAccessTokenResponse } from '../../../src/api/auth/discord';
import { testHandler } from '../../testUtils/testHandler';
import logger from '../../../src/logger';
import { env } from '../../../src/env';

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
let axiosGetSpy = jest.spyOn(axios, 'get').mockResolvedValueOnce({ data: testDiscordUser });
let axiosPostSpy = jest.spyOn(axios, 'post').mockResolvedValueOnce({ data: testResponse });
const loggerSpy = jest.spyOn(logger, 'error').mockImplementation();

const url = `https://discord.com/api/oauth2/authorize?client_id=${env.discordClientId}&redirect_uri=http://localhost:3000/api/auth/discord/callback&response_type=code&scope=identify`;

describe('Discord', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    axiosPostSpy.mockReset();
    axiosGetSpy.mockReset();
  });

  it('/discord/login links to Discord login', async () => {
    await testHandler(discord).get('/discord/login').expect(302).expect('Location', url);
  });

  it('/discord/callback handles an authorization error', async () => {
    const { text } = await testHandler(discord).get('/discord/callback').expect(500);

    expect(text).toEqual('There was an issue authrozing with Discord');
    expect(loggerSpy).toBeCalledTimes(1);
  });

  it('/discord/callback handles an discord user fetch', async () => {
    const { text } = await testHandler(discord).get('/discord/callback?code=testCode').expect(500);

    jest.spyOn(axios, 'post').mockRejectedValueOnce(new Error('Something is broken'));

    expect(text).toEqual('There was an issue getting Discord user information');
    expect(loggerSpy).toBeCalledTimes(1);
  });

  it('/discord/callback calls discord api token endpoint', async () => {
    const expectedPostHeader = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    };

    const expectedGetHeader = {
      headers: {
        Authorization: `Bearer token`,
      },
    };

    const expectedPostBody = new URLSearchParams({
      client_id: `${env.discordClientId}`,
      client_secret: `${env.discordSecretId}`,
      grant_type: 'authorization_code',
      code: 'testCode',
      redirect_uri: 'http://localhost:3000/api/auth/discord/callback',
    });

    jest.spyOn(axios, 'get').mockResolvedValueOnce({ data: testDiscordUser });
    jest.spyOn(axios, 'post').mockResolvedValueOnce({ data: testResponse });

    await testHandler(discord).get('/discord/callback?code=testCode');

    expect(axiosPostSpy).toBeCalledTimes(1);
    expect(axiosPostSpy).toBeCalledWith(
      'https://discord.com/api/v9/oauth2/token',
      expectedPostBody.toString(),
      expectedPostHeader,
    );

    expect(axiosGetSpy).toBeCalledTimes(1);
    expect(axiosGetSpy).toBeCalledWith('https://discord.com/api/v8/users/@me', expectedGetHeader);
  });
});
