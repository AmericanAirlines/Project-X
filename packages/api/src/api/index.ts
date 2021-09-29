/* istanbul ignore file */
import { Router } from 'express';
import { health } from './health';
//import {user} from './user'; 

export const api = Router();

api.use('/health', health);
//api.use('/user'), user);