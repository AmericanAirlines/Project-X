import {Router} from 'express';
import { Video } from '../entities/Video';
import logger from '../logger';

export const videos = Router();

// Get all videos
videos.get('', async (req, res) => {
    try {
        // Find All videos
        const videosList = await req.entityManager.getRepository(Video).findAll();

        // Return the list
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
        // Check if videoId is in the expected format
        if (isNaN(Number(videoId))) {
            res.status(400).send(`"${videoId}" is not a valid id, it must be a number.`);
            return;
        }  

        // Find desired Video       
        const video = await req.entityManager.findOne( Video, { id: videoId });

        // Check if video exists
        if (!video) {
            res.sendStatus(404);
            return;
        }
        
        // Return the video
        res.status(200).send(video);

    } catch (error) {
            logger.error(`There was an issue geting video "${videoId}"`, error);
            res.status(500).send(`There was an issue geting video "${videoId}"`);       
    };
});
