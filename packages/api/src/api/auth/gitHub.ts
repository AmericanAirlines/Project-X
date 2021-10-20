import { Router } from 'express';
import { env } from '../../env';

const passport = require('passport');

export const gitHub = Router();

passport.serializeUser((user: any, done: any) => {
  done(null, user.id);
});

passport.deserializeUser((id: any, done: any) => {
  done(null, id);
});

// passport.use(new GitHubStrategy({
//   clientID: gitHubClientId,
//   clientSecret: gitHubClientSecret,
//   callbackURL: "http://localhost:3000/api/auth/github/callback"
// },
//   async (accessToken: any, refreshToken: any, profile: any, done: any) => {

// const user = {
//   name: profile.username, 
//   gitHubId: profile.id
// };

// const res = await fetch(`http://localhost:3000/api/users/${profile.id}`);
//   if(res.status === 404){ // if we dont find the user, we do this block
//     const res2 = await fetch('http://localhost:3000/api/users', {
//     method: 'POST',
//     headers: {
//         'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(user),
//   });

//   if(res2.status === 201){ // user created, now we go to this block
//     done(null, profile);
//   };
// }else{ // if user is already existing, we execute this
// done(null, profile);
// };

// })
// );

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
