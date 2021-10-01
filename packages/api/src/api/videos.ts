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
        // Check if videoId is in the expected format
        if (isNaN(+videoId)) {
            throw new TypeError();
        }  

        // Find desired Video
        const videosRepository = req.entityManager.getRepository(Video);
        const video = await videosRepository.findOne({ id: videoId });
        res.status(200).send(video);
        
    } catch (error) {
        // Check for error type
        if (error instanceof TypeError) {
            logger.error('videoId "' + videoId + '" is not in the expected format.', error);
            // Return Unprocessable Enitity Status Code
            res.status(422).send('"' + videoId + '" is not a valid id');
        } else {
            logger.error('There was an issue geting video "' + videoId + '":', error);
            res.status(500).send('There was an issue geting video "' + videoId + '"');
        }
        
    };
});
