import { Router } from 'express';
import passport from 'passport';

export const gitHub = Router();

passport.serializeUser((user: any, done: any) => {
  done(null, user.id);
});

passport.deserializeUser((id: any, done: any) => {
  done(null, id);
});

function logout(req: any, res: any, next: any) {
  req.session.destroy();
  req.logout();
  next();
}

gitHub.get('/github/logout', logout, (req, res) => {
  res.redirect('/');
});

gitHub.get('/github/login', passport.authenticate('github'));

gitHub.get('/github/callback', 
  passport.authenticate('github', { failureRedirect: '/github/login' }),
  (req, res) => {
    // Successful authentication, redirect home.
    res.redirect('/app');
  });
