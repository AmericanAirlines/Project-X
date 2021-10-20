/* istanbul ignore file */
import { config } from 'dotenv-flow';
import setEnv from '@americanairlines/simple-env';

config();

export const env = setEnv({
  required: {
    nodeEnv: 'NODE_ENV',
    port: 'PORT',
    databaseUrl: 'DATABASE_URL',
    GitHubClientId: 'GITHUB_ID',
    GitHubSecret: 'GITHUB_SECRET',
  },
  optional: {
    databaseUser: 'DATABASE_USER',
  },
});
