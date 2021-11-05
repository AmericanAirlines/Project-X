import 'jest';
import passport from 'passport';
import { Handler } from 'express';
import { testHandler } from '../../testUtils/testHandler';
import { getMock } from '../../testUtils/getMock';

jest.mock('passport');

describe('/github endpoints', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
  });

  it('goes to github link for Login', (done) => {
    jest.isolateModules(async () => {
      const passportAuthenticateMock200 = getMock(passport.authenticate).mockImplementation(
        () =>
          ((_req, res) => {
            res.sendStatus(200);
          }) as Handler,
      );
      const { github } = require('../../../src/api/auth/github');
      await testHandler(github).get('/github/login').expect(200);
      expect(passportAuthenticateMock200).toHaveBeenCalledWith('github', { scope: ['user:email'] });
      done();
    });
  });

  it('redirects to /app when authenticated', (done) => {
    jest.isolateModules(async () => {
      const passportAuthenticateMockNext = getMock(passport.authenticate).mockImplementation(
        () =>
          ((_req, res, next) => {
            next();
          }) as Handler,
      );
      const { github } = require('../../../src/api/auth/github');
      await testHandler(github).get('/github/callback').expect(302);
      expect(passportAuthenticateMockNext).toHaveBeenCalledWith('github', {
        failureRedirect: '/errorPage',
      });
      done();
    });
  });
  it('destroys session and logs out when logout is called', (done) => {
    jest.isolateModules(async () => {
      const { github } = require('../../../src/api/auth/github');
      const destroyMock = jest.fn((callback) => callback());
      const logoutMock = jest.fn();
      await testHandler(github, (req, _res, next) => {
        req.session = { destroy: destroyMock } as any;
        req.logout = logoutMock;
        next();
      })
        .get('/github/logout')
        .expect(302)
        .expect('Location', '/');
      expect(destroyMock).toHaveBeenCalledTimes(1);
      expect(logoutMock).toHaveBeenCalledTimes(1);
      done();
    });
  });
});
