import express, { Router } from 'express';
import { User } from '../entities/User';
import logger from '../logger';

export const currentUser = Router();
currentUser.use(express.json());

const stripSensitiveFields = (user: User): Partial<User> => ({
  name: user.name,
  pronouns: user.pronouns,
  schoolName: user.schoolName,
  githubId: user.githubId,
  isAdmin: user.isAdmin,
  discordId: user.discordId,
});

currentUser.get('', async (req, res) => {
  try {
    if (req.user) {
      const user = await req.entityManager.findOne(User, { githubId: req.user.profile.id });

      // Check if user exists
      if (!user) {
        res.sendStatus(404);
        return;
      }

      // Return stripped user information
      res.status(200).send(stripSensitiveFields(user));
    } else {
      res.sendStatus(401);
    }
  } catch (error) {
    logger.error(`There was an issue getting user current user`, error);
    res.status(500).send(`There was an issue getting current user`);
  }
});
