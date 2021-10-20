/* istanbul ignore file */
import { Router } from 'express';
import { gitHub } from './gitHub';
//import

export const auth = Router();

auth.use(gitHub);
//auth.use(discord);