import express, { RequestHandler } from 'express';
import supertest from 'supertest';
import type { ParamsDictionary } from 'express-serve-static-core';
import type { ParsedQs } from 'qs';

type TestRequestHandler = RequestHandler<ParamsDictionary, any, any, ParsedQs, Record<string, any>>;

const createTestApp = (handler: TestRequestHandler) => {
  const app = express();
  app.use(handler);

  return app;
};

export const testHandler = (handler: TestRequestHandler) => supertest(createTestApp(handler));
