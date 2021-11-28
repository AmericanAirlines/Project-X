/* istanbul ignore file */
import express, { Handler } from 'express';
import { web } from '@x/web';
import { EntityManager, MikroORM } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import session from 'express-session';
import passport from 'passport';
import { CronJob } from 'cron';
import { env } from './env';
import { api } from './api';
import { initDatabase } from './database';
import logger from './logger';
import { User } from './entities/User';
import { contributionPoll } from './cronJobs';

const app = express();
const port = Number(env.port ?? '') || 3000;
let orm: MikroORM<PostgreSqlDriver>;
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
  done(null, user);
});

passport.deserializeUser((user: any, done) => {
  done(null, user);
});

passport.use(
  new GitHubStrategy(
    {
      clientID: env.githubClientId,
      clientSecret: env.githubSecret,
      callbackURL: `${env.appUrl}/api/auth/github/callback`,
    },
    async (accessToken: any, refreshToken: any, profile: any, done: any) => {
      const currentUser = await authEm?.findOne(User, {
        githubId: profile.id,
      });
      if (!currentUser) {
        logger.info('Creating new user.');
        const newUser = new User({
          name: profile.username,
          githubId: profile.id,
          githubUsername: profile.username,
          hireable: false,
          purpose: '',
        });
        authEm?.persist(newUser);
      } else {
        currentUser.githubUsername = profile.username;
      }
      await authEm?.flush();
      done(null, { profile, githubToken: accessToken });
    },
  ),
);

void (async () => {
  orm = await initDatabase();
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

      const contributionPollCronJob = new CronJob(
        '39 * * * *',
        () => contributionPoll(orm.em.fork()),
        null,
        false,
      ); // every six hours every day
      contributionPollCronJob.start();
    });
  })
  .catch((err) => {
    logger.crit('An error happened during app start', err);
  });
