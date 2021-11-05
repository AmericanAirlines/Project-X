/* istanbul ignore file */
import express, { Handler } from 'express';
import { web } from '@x/web';
import { EntityManager } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import session from 'express-session';
import passport from 'passport';
import { env } from './env';
import { api } from './api';
import { initDatabase } from './database';
import logger from './logger';
import { User } from './entities/User';

const app = express();
const port = Number(env.port ?? '') || 3000;
const dev = env.nodeEnv === 'development';
app.use(express.json());

const GitHubStrategy = require('passport-github2');

const authRequired: Handler = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.redirect('/api/auth/github/login');
  }
};

let authEm: EntityManager<PostgreSqlDriver> | undefined;

app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    },
  }),
);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser((id: string, done) => {
  done(null, id);
});

passport.use(
  new GitHubStrategy(
    {
      clientID: env.githubClientId,
      clientSecret: env.githubSecret,
      scope: 'user:emails',
      callbackURL: `${env.appUrl}/api/auth/github/callback`,
    },
    async (accessToken: any, refreshToken: any, profile: any, done: any) => {
      const regex = new RegExp(/^[a-zA-Z0-9]+[@][a-zA-Z0-9]+[.][e][d][u]$/);
      let emailValue;

      const currentUser = await authEm?.findOne(User, {
        githubId: profile.id,
      });

      if (!currentUser) {
        const response = await fetch('https://api.github.com/user/emails', {
          method: 'GET',
          headers: {
            Authorization: `token ${accessToken}`,
          },
        });
        const responseData = await response.json();

        for (let x = 0; x < responseData.length; x += 1) {
          // for loop to go through the emails and find one to match to, otherwise save null.
          if (responseData[x].email.match(regex) && responseData[x].verified) {
            emailValue = responseData[x].email;
            logger.info('Creating new user.');
            const newUser = new User({
              name: profile.username,
              githubId: profile.id,
              hireable: false,
              purpose: '',
              email: emailValue, // send the .edu email here
            });
            await authEm?.persistAndFlush(newUser);
            done(null, profile);
          }
        }
        done(null, null);
      } else {
        done(null, profile);
      }
    },
  ),
);

void (async () => {
  const orm = await initDatabase();
  authEm = authEm ?? orm.em.fork();

  app.use(
    '/api',
    /* 403Middleware, */
    (req, _res, next) => {
      req.entityManager = orm.em.fork();

      next();
    },
    api,
  );

  const webHandler = await web({ dev });

  app.all('/app', authRequired, webHandler);
  app.all('*', webHandler);
})()
  .then(() => {
    app.listen(port, () => {
      logger.info(`🚀 Listening at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    logger.crit('An error happened during app start', err);
  });
