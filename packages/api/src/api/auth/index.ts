/* istanbul ignore file */
import { Router } from 'express';
import { github } from './github';

export const auth = Router();

auth.use(github);
