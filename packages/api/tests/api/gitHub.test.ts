import 'jest';
import passport from 'passport';
import { github } from '../../src/api/auth/github';
import { testHandler } from '../testUtils/testHandler';
import { env } from '../../src/env';

const url = `https://github.com/login/oauth/authorize?client_id=${env.githubClientId}&redirect_uri=http://localhost:3000/api/auth/github/callback`;
// const callbackUrl = 'http://localhost:3000/api/auth/github/callback';

describe('/GitHub endpoints', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
  });

  it('Goes to GitHub link for user to Login', async () => {
    await testHandler(github)
    .get('/github/callback')
    .expect(302)
    .expect('Location', callbackUrl);
  }); // still needs to finish testing
  
  
});
