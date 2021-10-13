/* istanbul ignore file */
import { Router } from 'express';
import { auth } from './auth';
import { health } from './health';
import { videos } from './videos';
 
export const api = Router();

api.use('/health', health);
api.use('/videos', videos);
api.use('/auth', auth);
