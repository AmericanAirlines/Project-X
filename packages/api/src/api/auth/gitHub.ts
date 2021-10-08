import { Router } from 'express';
// import { session } from 'passport';

const session = require('express-session');
const Passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;

// import { env } from '../../env';

// const GitHubClientId = env.GitHubId;

export const gitHub = Router();

gitHub.use(Passport.initialize());
gitHub.use(Passport.session());

gitHub.use(
  session({
    secret: 'asdasd',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 0.1 * 60 * 60 * 1000,
    },
  }),
);

Passport.serializeUser((user: any, done: any) => {
  done(null, user.id);
});

Passport.deserializeUser((id: any, done: any) => {
  done(null, id);
});

Passport.use(
  new GitHubStrategy(
    {
      clientID: 'f3257f8055fa9f5b1e0b',
      clientSecret: 'c4ed5c029521b6ea8453488110ee60052330dee0',
      callbackURL: 'http://localhost:3000/api/auth/github/callback',
    },
    (_accessToken: any, _refreshToken: any, profile: any, done: any) => {
      done(null, profile);
    },
  ),
);

// gitHub.get('/github/login', Passport.authenticate('github'));

// eslint-disable-next-line @typescript-eslint/no-unused-vars
gitHub.get('/github/login', (_req, _res) => {
  Passport.authenticate('github');
});
gitHub.get('/github/callback', (_req, res) => {
  Passport.authenticate('github', { failureRedirect: '/login' });
  // const url = ``;
  res.redirect(`/app`);
});
