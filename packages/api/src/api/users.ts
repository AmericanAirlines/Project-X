import { Router } from 'express';
import { User } from '../entities/User';
import logger from '../logger';

export const users = Router();

const stripSensitiveFields = (user: User): Partial<User> => ({
  name: user.name,
  pronouns: user.pronouns,
  schoolName: user.schoolName,
});

users.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    // Check if userId is in correct format
    if (Number.isNaN(Number(userId))) {
      res.status(400).send(`"${userId}" is not a valid id, it must be a number.`);
      return;
    }

    const user = await req.entityManager.findOne(User, { id: userId });

    // Check if user exists
    if (!user) {
      res.sendStatus(404);
      return;
    }

    // Return stripped user information
    res.status(200).send(stripSensitiveFields(user));
  } catch (error) {
    logger.error(`There was an issue getting user "${userId}"`, error);
    res.status(500).send(`There was an issue getting user "${userId}"`);
  }
});

users.patch('/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    if (Number.isNaN(Number(userId))) {
      res.status(400).send(`"${userId}" is not a valid id, it must be a number.`);
      return;
    }

    const user = await req.entityManager.findOne(User, { id: userId });

    if (!user) {
      res.sendStatus(404);
      return;
    }

    if (req.body.name !== undefined) {
      user.name = req.body.name;
    }

    if (req.body.pronouns !== undefined) {
      user.pronouns = req.body.pronouns;
    }

    if (req.body.location !== undefined) {
      user.location = req.body.location;
    }

    if (req.body.hireable !== undefined) {
      user.hireable = req.body.hireable;
    }

    if (req.body.purpose !== undefined) {
      user.purpose = req.body.purpose;
    }

    if (req.body.schoolName !== undefined) {
      user.schoolName = req.body.schoolName;
    }

    if (req.body.major !== undefined) {
      user.major = req.body.major;
    }

    if (req.body.graduationDate !== undefined) {
      user.graduationDate = new Date(req.body.graduationDate);
    }

    await req.entityManager.flush();

    res.status(200).send(user);
  } catch (error) {
    logger.error(`There was an issue updating user "${userId}"`, error);
    res.status(500).send(`There was an issue updating user "${userId}"`);
  }
});
