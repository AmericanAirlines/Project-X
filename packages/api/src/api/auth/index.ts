/* istanbul ignore file */
import { Router } from 'express';
import { github } from './github';
import { discord } from './discord';

export const auth = Router();

auth.use(github);
auth.use(discord);
