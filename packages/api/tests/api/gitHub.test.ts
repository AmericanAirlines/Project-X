import "jest";
import { gitHub  } from "../../src/api/auth/gitHub";
import { testHandler } from "../testUtils/testHandler";
import { env } from '../../src/env';

const GitHubClientId = env.GitHubId;

const url = 'https://github.com/login/oauth/authorize?client_id=${GitHubClientId}&redirect_uri=http://localhost:3000/api/auth/github/callback';

describe('/GitHub endpoints',() => {
    beforeEach(async () => {
        jest.clearAllMocks();
    });

   it('Goes to GitHub link for user to Login', async () => {

       const handler = testHandler(gitHub)
        .expect('Location', url)
        .expect(302)

   });

    // testHandler(yourHandler)
    // .get('your-route')
    // .expect(302)
    // .expect('Location', 'your-redirect-url');

});
