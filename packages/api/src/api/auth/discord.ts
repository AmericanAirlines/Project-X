import { Router } from 'express';
import { env } from '../../env';

const { discordClientId } = env;
export const discord = Router();

discord.get('/discord/login', (req, res) => {
  const url = `https://discord.com/api/oauth2/authorize?client_id=${discordClientId}&redirect_uri=http://localhost:3000/api/auth/discord/callback&response_type=code&scope=identify`;
  res.redirect(url);
});

discord.get('/discord/callback', (req, res) => {
  // const url = ``;
  res.redirect(`/app`);
});
