import express, { Express, RequestHandler } from 'express';
import supertest from 'supertest'; // eslint-disable-line import/no-extraneous-dependencies
import type { ParamsDictionary } from 'express-serve-static-core';
import type { ParsedQs } from 'qs';

type TestRequestHandler = RequestHandler<ParamsDictionary, any, any, ParsedQs, Record<string, any>>;

interface CreateTestApp {
  (...handlers: TestRequestHandler[]): Express;
  (mappings: Record<string, TestRequestHandler>): Express;
}

const createTestApp: CreateTestApp = (
  mappingsOrFirstHandler: Record<string, TestRequestHandler> | TestRequestHandler,
  ...restOfHandlers: TestRequestHandler[]
) => {
  const app = express();

  if (typeof mappingsOrFirstHandler === 'object') {
    const mappings = mappingsOrFirstHandler;

    for (const [path, handler] of Object.entries(mappings)) {
      app.use(path, handler);
    }
  } else {
    const handlers = [mappingsOrFirstHandler, ...restOfHandlers];

    app.use(handlers);
  }

  return app;
};

export const testHandler = (handler: TestRequestHandler) =>
  supertest(createTestApp(handler)).get('/');
