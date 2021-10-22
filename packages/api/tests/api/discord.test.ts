import 'jest';
import { discord } from '../../src/api/auth/discord';
import { testHandler } from '../testUtils/testHandler';
import { env } from '../../src/env';

const url = `https://discord.com/api/oauth2/authorize?client_id=${env.discordClientId}&redirect_uri=http://localhost:3000/api/auth/discord/callback&response_type=code&scope=identify`;

describe('Discord OAuth Endpoint', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
  });

  it('Links to Discord login', async () => {
    await testHandler(discord).get('/discord/login').expect(302).expect('Location', url);
  });
});
