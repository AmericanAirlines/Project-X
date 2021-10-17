import express, { Router } from 'express';
import { User } from '../entities/User';
import logger from '../logger';

export const users = Router();
users.use(express.json());

users.post('', async (req, res) => {
  try {
    const user1 = req.body;

    const user = new User(user1);
    // const something = req.entityManager.create(User, user1);

    void req.entityManager.persistAndFlush(user);

    res.status(201).send();
  } catch (error) {
    logger.error('There was an issue geting all videos: ', error);
    res.status(500).send('Couldnt save the user');
  }
});

users.get('/:gitHubId', async (req, res) => {
  const { gitHubId } = req.params;

  try {
    // Check if videoId is in the expected format
    if (Number.isNaN(Number(gitHubId))) {
      res.status(400).send(`"${gitHubId}" is not a valid id, it must be a number.`);
      return;
    }

    const user = await req.entityManager.findOne(User, { gitHubId });

    if (!user) {
      res.sendStatus(404);
      return;
    }

    res.status(200).send(user);
  } catch (error) {
    logger.error(`There was an issue geting user "${gitHubId}"`, error);
    res.status(500).send(`There was an issue geting user "${gitHubId}"`);
  }
});
