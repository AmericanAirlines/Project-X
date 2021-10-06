import { Router } from 'express';

import { env } from '../../env';

const passport = require('passport');

const GitHubClientId = env.GitHubId;

export const gitHub = Router();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
gitHub.get('/github/login', (req, res) => {
  /* passport(
    `https://github.com/login/oauth/authorize?client_id=${GitHubClientId}&redirect_uri=http://localhost:3000/api/auth/github/callback`,
  ); */

  const url = `https://github.com/login/oauth/authorize?client_id=${GitHubClientId}&redirect_uri=http://localhost:3000/api/auth/github/callback`;
  res.redirect(url);
});

gitHub.get('/github/callback', (req, res) => {
  // passport.authenticate('github', { failureRedirect: '/login' })
  // const url = ``;
  res.redirect(``);
});
