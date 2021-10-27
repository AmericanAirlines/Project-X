/* istanbul ignore file */
import { config } from 'dotenv-flow';
import setEnv from '@americanairlines/simple-env';

config();

export const env = setEnv({
  required: {
    nodeEnv: 'NODE_ENV',
    port: 'PORT',
    databaseUrl: 'DATABASE_URL',
    gitHubClientId: 'GITHUB_CLIENT_ID',
    githubGraphQLPAT: 'GITHUB_GRAPHQL_PAT'
  },
  optional: {
    databaseUser: 'DATABASE_USER',
  },
});
