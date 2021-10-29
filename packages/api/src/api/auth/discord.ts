import { Router } from 'express';
import { URLSearchParams } from 'url';
import { User } from '../../entities/User';
import { env } from '../../env';
import logger from '../../logger';

export const discord = Router();

export interface DiscordAccessTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  token_type: string;
}

export interface PassportData {
  user: string;
}

export interface SessionData {
  cookies: {};
  passport: PassportData;
}

discord.get('/discord/login', (_req, res) => {
  const url = `https://discord.com/api/oauth2/authorize?client_id=${env.discordClientId}&redirect_uri=http://localhost:3000/api/auth/discord/callback&response_type=code&scope=identify`;
  res.redirect(url);
});

discord.get('/discord/callback', async (req, res) => {
  const { code } = req.query;
  if (code) {
    try {
      const data = new URLSearchParams({
        client_id: `${env.discordClientId}`,
        client_secret: `${env.discordSecretId}`,
        grant_type: 'authorization_code',
        code: code.toString(),
        redirect_uri: 'http://localhost:3000/api/auth/discord/callback',
      });

      const tokenResponse = await fetch('https://discord.com/api/v9/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: data,
      });

      const { access_token: accessToken } = await tokenResponse.json();

      const userResponse = await fetch('https://discord.com/api/v8/users/@me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const { id: discordId } = await userResponse.json();

      const { passport } = req.session as unknown as SessionData;
      const { user: userGithubId } = passport as PassportData;
      const user = await req.entityManager.findOne(User, { githubId: userGithubId });

      if (user) {
        user.discordId = discordId;
        void req.entityManager.flush();
        res.redirect('/app/community', 200);
      } else {
        res.redirect('/app/community', 400);
      }
    } catch (error) {
      const userRetrievalErrorString = 'There was an issue getting Discord user information';
      logger.error(userRetrievalErrorString, error);
      res.status(400).send(userRetrievalErrorString);
    }
  } else {
    const discordAuthErrorString = 'There was an issue authrozing with Discord';
    logger.error(discordAuthErrorString);
    res.status(500).send(discordAuthErrorString);
  }
});
