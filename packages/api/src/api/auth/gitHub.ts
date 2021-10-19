import { Router } from 'express';
import { env } from '../../env';

const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
// const session = require('express-session'); // express-session

const GitHubClientId = env.GitHubId;
const GitHubClientSecret = env.GitHubSecret;
const COOKIE = '';

export const github = Router();

passport.serializeUser((user: any, done: any) => {
  done(null, user.id);
});

passport.deserializeUser((id: any, done: any) => {
  done(null, id);
});

passport.use(
  new GitHubStrategy(
    {
      clientID: GitHubClientId,
      clientSecret: GitHubClientSecret,
      callbackURL: 'http://localhost:3000/api/auth/github/callback',
    },
    async (accessToken: any, refreshToken: any, profile: any, done: any) => {
      const user = {
        name: profile.username,
        gitHubId: profile.id,
      };

      const res = await fetch(`http://localhost:3000/api/users/${profile.id}`);
      if (res.status === 404) {
        // if we dont find the user, we do this block
        const res2 = await fetch('http://localhost:3000/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(user),
        });

        if (res2.status === 201) {
          // user created, now we go to this block
          done(null, profile);
        }
      } else {
        // if user is already existing, we execute this
        // console.log('got the user');
        done(null, profile);
      }
    },
  ),
);

github.get('/github/login', passport.authenticate('github'));

github.get(
  '/github/callback',
  passport.authenticate('github', {
    failureRedirect: '/github/login',
  }),
  (req, res) => {
    // Successful authentication, redirect home.
    res.redirect('/github/setcookie');
  },
);

let data: any;
function setcookie(req: any, res: any, next: any) {
  data = {
    user: req.session.passport.user.profile.json,
    token: req.session.passport.user.token,
  };
  res.cookie(COOKIE, JSON.stringify(data));
  console.log(data);
  next();
}

github.get('/github/setcookie', setcookie, (_req, res) => {
  res.redirect('/app');
});

function logout(req: any, res: any, next: any) {
  req.logout();
  req.session.destroy();
  delete req.session;
  next();
}

github.get('/github/logout', logout, (req, res) => {
  req.logOut();
  res.redirect('/');
});
