import {Router} from 'express';
import { json } from 'stream/consumers';
import { Video } from '../entities/Video';

export const videos = Router();

videos.get('', async (req, res) => {
    try {
        const videosRepository = req.entityManager.getRepository(Video);
        const videosList = await videosRepository.findAll();

        res.status(200).send(videosList);
    } catch (error) {
        res.status(500).send('There was an issue geting all videos');
    };
});

videos.get('/:video_id', async (req, res) => {
    const { video_id } = req.params;
    
    try {      
        const videosRepository = req.entityManager.getRepository(Video);
        const video = await videosRepository.findOne({ video_id: Number(video_id) });

        res.status(200).send(video);
    } catch (error) {
        res.status(500).send('There was an issue geting the video with an id of ' + video_id);
    };
});