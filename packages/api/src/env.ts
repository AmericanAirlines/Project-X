/* istanbul ignore file */
import { config } from 'dotenv-flow';
import setEnv from '@americanairlines/simple-env';

config();

export const env = setEnv({
  required: {
    nodeEnv: 'NODE_ENV',
    port: 'PORT',
    databaseUrl: 'DATABASE_URL',
    discordClientId: 'DISCORD_CLIENT_ID',
    discordSecretId: 'DISCORD_SECRET_ID',
    githubClientId: 'GITHUB_CLIENT_ID',
    githubSecret: 'GITHUB_SECRET',
    githubToken: 'GITHUB_TOKEN',
    appUrl: 'APP_URL',
  },
  optional: {
    databaseUser: 'DATABASE_USER',
  },
});
