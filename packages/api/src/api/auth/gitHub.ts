import { Router } from 'express';

import { env } from '../../env';

const GitHubClientId = env.GitHubId;

export const gitHub = Router();

gitHub.get('/github/login', (req, res) => {
  const url = `https://github.com/login/oauth/authorize?client_id=${GitHubClientId}&redirect_uri=http://localhost:3000/api/auth/github/callback`;
  res.redirect(url);
});

gitHub.get('/github/callback', (req, res) => {
  // const url = ``;
  res.redirect(``);
});
