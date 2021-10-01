import {Router} from 'express';
import { Video } from '../entities/Video';
import logger from '../logger';

export const videos = Router();

// Get all videos
videos.get('', async (req, res) => {
    try {
        const videosRepository = req.entityManager.getRepository(Video);
        const videosList = await videosRepository.findAll();

        res.status(200).send(videosList);
    } catch (error) {
        logger.error('There was an issue geting all videos: ', error);
        res.status(500).send('There was an issue geting all videos');
    };
});

// Get video by id
videos.get('/:videoId', async (req, res) => {
    const { videoId } = req.params;

    try {      
        const videosRepository = req.entityManager.getRepository(Video);
        const video = await videosRepository.findOne({ id: videoId });

        res.status(200).send(video);
    } catch (error) {
        logger.error('There was an issue geting video "' + videoId + '":', error);
        res.status(500).send('"' + videoId + '" is not a valid id');
    };
});
