/* istanbul ignore file */
import { Router } from 'express';
import { health } from './health';

export const api = Router();

api.use('/health', health);
