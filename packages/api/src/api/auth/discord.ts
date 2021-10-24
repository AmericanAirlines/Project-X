import { Router } from 'express';
import axios from 'axios';
import { URLSearchParams } from 'url';
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

      const res2 = await axios.post('https://discord.com/api/v9/oauth2/token', data.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      const { access_token: accessToken } = res2.data as DiscordAccessTokenResponse;

      const { data: userResponse } = await axios.get('https://discord.com/api/v8/users/@me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // To Do: Update User row with Discord ID
      res.send(userResponse);
    } catch (error) {
      logger.error('There was an issue getting Discord user information ', error);
      res.status(500).send('There was an issue getting Discord user information');
    }
  } else {
    logger.error('There was an issue authrozing with Discord ');
    res.status(500).send('There was an issue authrozing with Discord');
  }
});
