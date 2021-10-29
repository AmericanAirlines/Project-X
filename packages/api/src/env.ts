/* istanbul ignore file */
import { config } from 'dotenv-flow';
import setEnv from '@americanairlines/simple-env';

config();

export const env = setEnv({
  required: {
    nodeEnv: 'NODE_ENV',
    port: 'PORT',
    databaseUrl: 'DATABASE_URL',
    githubClientId: 'GITHUB_CLIENT_ID',
    githubSecret: 'GITHUB_SECRET',
    appUrl: 'APP_URL',
  },
  optional: {
    databaseUser: 'DATABASE_USER',
  },
});
