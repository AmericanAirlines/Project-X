/* istanbul ignore file */
import express from 'express';
import { web } from '@x/web';
import { env } from './env';
import { api } from './api';
import { initDatabase } from './database';
import logger from './logger';

const app = express();
const port = Number(env.port ?? '') || 3000;
const dev = env.nodeEnv === 'development';

const isAuth = (req: any, res: any, next: any) => {
  if (req.user) {
    next();
  } else {
    console.log(req.user);
    res.redirect('/'); // 401
  }
};

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
