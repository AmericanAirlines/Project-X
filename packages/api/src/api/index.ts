/* istanbul ignore file */
import { Router } from 'express';
import { auth } from './auth';
import { health } from './health';

export const api = Router();

api.use('/health', health);
api.use('/auth', auth)
