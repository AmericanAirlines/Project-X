import {Router} from 'express';
import { Video } from '../entities/Video';

export const videos = Router();

videos.get('', (req, res) => {
    try {
        const videosRepository = req.entityManager.getRepository(Video);
        const videosList = videosRepository.findAll();

        res.status(200).send(videosList);
    } catch (error) {
        res.status(500).send('There was an issue geting all videos');
    };
});
// add GET endpoint to return all videos at ''
// add GET endpoint to return a video at '/{video_id}'