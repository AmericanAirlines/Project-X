/* istanbul ignore file */
import express from 'express';
import { web } from '@x/web';
import crypto from 'crypto';
import { env } from './env';
import { api } from './api';
import { initDatabase } from './database';
import logger from './logger';

const cookieParser = require('cookie-parser');
const session = require('express-session');
const Passport = require('passport');

const app = express();
const port = Number(env.port ?? '') || 3000;
const dev = env.nodeEnv === 'development';

const isAuth = (req: any, res: any, next: any) => {
  if (req.user) {
    console.log(req.user);
    next();
  } else {
    res.redirect('/'); // 401
  }
};

app.use(
  // express-session
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: false,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000, // 1 day long
    },
  }),
);

app.use(Passport.initialize());
app.use(Passport.session());

app.use(cookieParser());
app.use(
  session({
    secret: crypto.randomBytes(64).toString('hex'),

    resave: true,
    saveUninitialized: true,
  }),
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
  app.all('/app/*', isAuth, webHandler);
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
