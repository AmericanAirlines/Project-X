/* istanbul ignore file */
import express from 'express';
import { web } from '@x/web';
import { EntityManager } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { env } from './env';
import { api } from './api';
import { initDatabase } from './database';
import logger from './logger';
import { User } from './entities/User';

const app = express();
const port = Number(env.port ?? '') || 3000;
const dev = env.nodeEnv === 'development';
const session = require('express-session'); // express-session
const passport = require('passport');
const GitHubStrategy = require('passport-github2');

const gitHubClientId = env.GitHubClientId;
const gitHubClientSecret = env.GitHubSecret;

const isAuth = (req: any, res: any, next: any) => {
  if (req.user) {
    next();
  } else {
    res.redirect('/api/auth/github/login'); // 401
  }
};

let authEm: EntityManager<PostgreSqlDriver> | undefined;

void (async () => {
  const orm = await initDatabase();
  authEm = authEm ?? orm.em.fork();
});

  app.use(
    session({
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 0.1 * 60 * 60 * 1000,
      },
    }),
  );

app.use(passport.initialize());
app.use(passport.session(session));

passport.use(new GitHubStrategy({
  clientID: gitHubClientId,
  clientSecret: gitHubClientSecret,
  callbackURL: "http://localhost:3000/api/auth/github/callback"
},
  async (accessToken: any, refreshToken: any, profile: any, done: any) => {
    
    authEm?.persist(new User({ name: profile.username, gitHubId: profile.id }));


})
);

void (async () => {
  const orm = await initDatabase();

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

  app.all('/app', isAuth, webHandler);
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
