/* istanbul ignore file */
import { Router } from 'express';
import { health } from './health';
import { videos } from './videos';

export const api = Router();

api.use('/health', health);
<<<<<<< HEAD
api.use('/videos', videos);
=======
// add video file reference at '/videos'
>>>>>>> main
