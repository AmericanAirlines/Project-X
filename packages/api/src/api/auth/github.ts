import { Handler, Router } from 'express';
import passport from 'passport';

export const github = Router();

const logout: Handler = (req, res, next) => {
  req.session.destroy(() => {
    req.logout();
    next();
  });
};

github.get('/github/logout', logout, (req, res) => {
  // when they logout redirect them home
  res.redirect('/');
});

github.get('/github/login', passport.authenticate('github'));

github.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: '/errorPage' }),
  (req, res) => {
    // Successful authentication, redirect to app.
    res.redirect('/app');
  },
);
