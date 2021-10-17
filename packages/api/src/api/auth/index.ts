import { Router } from 'express';
import { github } from './gitHub';

export const auth = Router();

auth.use(github);
