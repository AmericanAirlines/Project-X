import { Router } from 'express';
import { Contribution } from '../entities/Contribution';
import { User } from '../entities/User';
import logger from '../logger';

export const contributions = Router();

contributions.get('', async (req, res) => {
  if (!req.user) {
    res.sendStatus(401);
    return;
  }

  const { userId } = req.query;

  if (Number.isNaN(Number(userId)) || Number(userId) < 0) {
    res.status(400).send("Query parameter 'userId' is required and must be a positive integer");
    return;
  }


  try {
    const queriedUser = await req.entityManager.findOne(User, { id: userId as string });

    if (!queriedUser) {
      res.sendStatus(404);
      return;
    }

    const userContributions = await req.entityManager.find(Contribution, {
      authorGithubId: queriedUser.githubId,
    });

    res.send(userContributions);
  } catch (error) {
    const errorMessage = 'There was an issue retrieving contributions';
    logger.error(errorMessage, error);
    res.status(500).send(errorMessage);
  }
});
