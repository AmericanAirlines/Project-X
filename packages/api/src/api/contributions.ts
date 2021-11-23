import { Router } from 'express';
import { Contribution } from '../entities/Contribution';
import { User } from '../entities/User';
import logger from '../logger';

export const contributions = Router();

contributions.get('', async (req, res) => {
  if(!req.user) {
    res.sendStatus(401);
    return;
  }

  const { userId } = req.query;
  
  if(!userId) {
    res.status(400).send('No user id was given.');
    return;
  }

  if (Number.isNaN(Number(userId))) {
    res.status(400).send(`"${userId}" is not a valid id, it must be a number.`);
    return;
  }

  try {
    const queriedUser = await req.entityManager.findOne(User, { id: userId as string });

    if(!queriedUser) {
      res.sendStatus(404);
      return;
    }

    const userContributions = await req.entityManager.find(Contribution, {authorGithubId: queriedUser.githubId})

    res.send(userContributions);
  }
  catch (error)
  {
    const errorMessage = "An error has occurred retriving the user's contributions."
    logger.error(errorMessage, error);
    res.status(500).send(errorMessage);
  }
});
